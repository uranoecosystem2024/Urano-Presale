// utils/profile/vesting.ts
import { getContract, readContract } from "thirdweb";
import { client } from "@/lib/thirdwebClient";
import { sepolia } from "thirdweb/chains";
import { presaleAbi } from "@/lib/abi/presale";

// Reuse the same enum mapping used elsewhere
export type RoundKey = "seed" | "private" | "institutional" | "strategic" | "community";
export const ROUND_ENUM_INDEX: Record<RoundKey, number> = {
  seed: 0,
  private: 1,
  institutional: 2,
  strategic: 3,
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

// Minimal ERC20 decimals ABI
const ERC20_DECIMALS_ABI = [
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

/** Fetch token decimals (falls back to 18 if something goes wrong) */
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

/** Tiny helper to find the active round key */
export async function readActiveRoundKey(): Promise<RoundKey | null> {
  const keys: RoundKey[] = ["seed", "private", "institutional", "strategic", "community"];
  const methods: Record<RoundKey, "getSeedRoundInfo" | "getPrivateRoundInfo" | "getInstitutionalRoundInfo" | "getStrategicRoundInfo" | "getCommunityRoundInfo"> = {
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

  const idx = infos.findIndex((tuple) => tuple[0] === true); // isActive_
  return idx === -1 ? null : keys[idx]!;
}

/** Convert raw (bigint) to human string with token decimals */
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
  /** Month label, e.g. "Oct 2025" */
  label: string;
  /** Month's total raw amount */
  amountRaw: bigint;
  /** Optional: totals for claimed / claimable (same unit as amountRaw) */
  claimedRaw: bigint;
  claimableRaw: bigint;
  /** For sorting if needed */
  firstUnlockDate: Date;
};

function monthKeyFromUnix(unixSec: bigint | number): { key: string; date: Date; label: string } {
  const ms = Number(unixSec) * 1000;
  const d = new Date(ms);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth(); // 0-11
  const key = `${y}-${m}`;
  const label = d.toLocaleString(undefined, { month: "short", year: "numeric" }); // "Oct 2025"
  return { key, date: new Date(Date.UTC(y, m, 1)), label };
}

/**
 * Read vesting tranches for the ACTIVE round and aggregate them by calendar month.
 * If no active round: returns an empty list with the token decimals for formatting.
 */
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

  // Aggregate by month
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
