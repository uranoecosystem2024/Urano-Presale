import { getContract, readContract } from "thirdweb";
import { client } from "@/lib/thirdwebClient";
import { sepolia } from "thirdweb/chains";
import { presaleAbi } from "@/lib/abi/presale";

export type RoundKey = "strategic" | "seed" | "private" | "institutional" | "community";
export const ROUND_ENUM_INDEX: Record<RoundKey, number> = {
  strategic: 0,
  seed: 1,
  private: 2,
  institutional: 3,
  community: 4,
};


const PRESALE_ADDR = process.env
  .NEXT_PUBLIC_PRESALE_SMART_CONTRACT_ADDRESS as `0x${string}`;

const presale = getContract({
  client,
  chain: sepolia,
  address: PRESALE_ADDR,
  abi: presaleAbi,
});

const ERC20_DECIMALS_ABI = [
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export async function getTokenDecimals(): Promise<number> {
  try {
    const tokenAddr = (await readContract({
      contract: presale,
      method: "token",
    })) as `0x${string}`;

    const erc20 = getContract({
      client,
      chain: sepolia,
      address: tokenAddr,
      abi: ERC20_DECIMALS_ABI,
    });

    const dec = (await readContract({
      contract: erc20,
      method: "decimals",
    })) as number | bigint;

    return typeof dec === "bigint" ? Number(dec) : dec;
  } catch {
    return 18;
  }
}

export async function readActiveRoundKey(): Promise<RoundKey | null> {
  const keys: RoundKey[] = ["strategic", "seed", "private", "institutional", "community"];
  const methods: Record<RoundKey, "getStrategicRoundInfo" | "getSeedRoundInfo" | "getPrivateRoundInfo" | "getInstitutionalRoundInfo" | "getCommunityRoundInfo"> = {
    seed: "getSeedRoundInfo",
    private: "getPrivateRoundInfo",
    institutional: "getInstitutionalRoundInfo",
    strategic: "getStrategicRoundInfo",
    community: "getCommunityRoundInfo",
  };

  const infos = await Promise.all(
    keys.map((k) =>
      readContract({ contract: presale, method: methods[k] })
    )
  );

  const idx = infos.findIndex((tuple) => tuple[0] === true);
  return idx === -1 ? null : keys[idx]!;
}

export function formatTokenAmount(raw: bigint, decimals: number): string {
  if (raw === 0n) return "0";
  const base = 10n ** BigInt(decimals);
  const integer = raw / base;
  const fraction = raw % base;
  if (fraction === 0n) return integer.toLocaleString();
  const fracStr = fraction.toString().padStart(decimals, "0").replace(/0+$/, "");
  return `${integer.toLocaleString()}.${fracStr}`;
}

export type MonthlyVestingItem = {
  label: string;
  amountRaw: bigint;
  claimedRaw: bigint;
  claimableRaw: bigint;
  firstUnlockDate: Date;
};

function monthKeyFromUnix(unixSec: bigint | number): { key: string; date: Date; label: string } {
  const ms = Number(unixSec) * 1000;
  const d = new Date(ms);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();
  const key = `${y}-${m}`;
  const label = d.toLocaleString(undefined, { month: "short", year: "numeric" });
  return { key, date: new Date(Date.UTC(y, m, 1)), label };
}

export async function readActiveRoundMonthlyVesting(user: `0x${string}`): Promise<{
  tokenDecimals: number;
  items: MonthlyVestingItem[];
}> {
  const round = await readActiveRoundKey();
  const tokenDecimals = await getTokenDecimals();

  if (!round) {
    return { tokenDecimals, items: [] };
  }

  const [amounts, unlockTimes, claimed, claimableAmounts] = (await readContract({
    contract: presale,
    method: "getUserVestingInfo",
    params: [user, ROUND_ENUM_INDEX[round]],
  })) as readonly [bigint[], bigint[], bigint[], bigint[]];

  const map = new Map<
    string,
    { amount: bigint; claimed: bigint; claimable: bigint; firstDate: Date; label: string }
  >();

  for (let i = 0; i < amounts.length; i++) {
    const a = amounts[i] ?? 0n;
    if (a === 0n) continue;

    const t = unlockTimes[i] ?? 0n;
    const c = claimed[i] ?? 0n;
    const cl = claimableAmounts[i] ?? 0n;

    const { key, date, label } = monthKeyFromUnix(t);

    const prev = map.get(key);
    if (prev) {
      map.set(key, {
        amount: prev.amount + a,
        claimed: prev.claimed + c,
        claimable: prev.claimable + cl,
        firstDate: prev.firstDate,
        label: prev.label,
      });
    } else {
      map.set(key, { amount: a, claimed: c, claimable: cl, firstDate: date, label });
    }
  }

  const items: MonthlyVestingItem[] = Array.from(map.values())
    .sort((a, b) => a.firstDate.getTime() - b.firstDate.getTime())
    .map((v) => ({
      label: v.label,
      amountRaw: v.amount,
      claimedRaw: v.claimed,
      claimableRaw: v.claimable,
      firstUnlockDate: v.firstDate,
    }));

  return { tokenDecimals, items };
}
