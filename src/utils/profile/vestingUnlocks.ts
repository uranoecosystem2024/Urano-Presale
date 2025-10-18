// utils/profile/vestingUnlocks.ts
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

const ROUND_LABEL: Record<RoundKey, string> = {
  strategic: "Strategic Round",
  seed: "Seed Round",
  private: "Private Round",
  institutional: "Institutional Round",
  community: "Community Round",
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

/** Round info tuple (matches get*RoundInfo ABI order). */
type RoundInfoTuple = readonly [
  boolean,  // isActive
  bigint,   // tokenPrice
  bigint,   // minPurchase
  bigint,   // totalRaised
  bigint,   // startTime
  bigint,   // endTime
  bigint,   // totalTokensSold
  bigint,   // maxTokensToSell
  boolean,  // isPublic
  bigint,   // vestingEndTime
  bigint,   // cliffPeriodMonths
  bigint,   // vestingDurationMonths
  bigint    // tgeUnlockPercentage
];

async function readRoundInfoByKey(key: RoundKey): Promise<RoundInfoTuple> {
  switch (key) {
    case "strategic":
      return (await readContract({ contract: presale, method: "getStrategicRoundInfo" })) as RoundInfoTuple;
    case "seed":
      return (await readContract({ contract: presale, method: "getSeedRoundInfo" })) as RoundInfoTuple;
    case "private":
      return (await readContract({ contract: presale, method: "getPrivateRoundInfo" })) as RoundInfoTuple;
    case "institutional":
      return (await readContract({ contract: presale, method: "getInstitutionalRoundInfo" })) as RoundInfoTuple;
    case "community":
      return (await readContract({ contract: presale, method: "getCommunityRoundInfo" })) as RoundInfoTuple;
  }
}

/** Pretty token amount with rounding to 3 decimals. */
export function formatTokenAmount(raw: bigint, decimals: number): string {
  if (raw === 0n) return "0";
  const base = 10n ** BigInt(decimals);
  const integer = raw / base;
  const fraction = raw % base;

  if (fraction === 0n) return integer.toLocaleString();

  // Build a JS number safely for rounding to 3 decimals
  const asNumber = Number(integer) + Number(fraction) / Number(base);
  const rounded = Math.round(asNumber * 1000) / 1000;
  return rounded.toLocaleString(undefined, { maximumFractionDigits: 3 });
}

export type MonthlyVestingItem = {
  /** e.g. "Nov 2025" */
  label: string;
  /** total tokens unlocking at that month (rounded done in formatter) */
  amountRaw: bigint;
  claimedRaw: bigint;
  claimableRaw: bigint;
  /** 1st day of that month (UTC) – used for sorting */
  firstUnlockDate: Date;
  /** Optional: which round this item belongs to (for debugging/UX) */
  round?: RoundKey;
  roundLabel?: string;
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

/** Returns rounds the user participated in (purchases or whitelist with preAssigned tokens). */
async function getUserParticipatedRounds(user: `0x${string}`): Promise<RoundKey[]> {
  const keys: RoundKey[] = ["strategic", "seed", "private", "institutional", "community"];
  const participated = new Set<RoundKey>();

  // Purchases per round
  for (const rk of keys) {
    const [amounts] = (await readContract({
      contract: presale,
      method: "getUserPurchases",
      params: [user, ROUND_ENUM_INDEX[rk]],
    })) as readonly [bigint[], bigint[], bigint[], bigint[]];

    const sum = amounts.reduce((a, v) => a + v, 0n);
    if (sum > 0n) participated.add(rk);
  }

  // Whitelist (Strategic/Seed only)
  const wl = (await readContract({
    contract: presale,
    method: "whitelist",
    params: [user],
  })) as [boolean, bigint, bigint, number];

  const [isWhitelisted, preAssigned, _claimedWl, wlRoundIndex] = wl;
  if (isWhitelisted && preAssigned > 0n) {
    const wlRound = (["strategic", "seed", "private", "institutional", "community"] as const)[
      wlRoundIndex
    ];
    if (wlRound === "strategic" || wlRound === "seed") {
      participated.add(wlRound);
    }
  }

  return Array.from(participated);
}

/**
 * Build "upcoming unlocks" for all the user's participated rounds.
 * NOTE: The contract's getUserVestingInfo returns a single vestingEndTime per purchase.
 * We group by that month to build the schedule (no per-month breakdown on-chain).
 */
export async function readAllParticipatedMonthlyVesting(user: `0x${string}`): Promise<{
  tokenDecimals: number;
  items: MonthlyVestingItem[];
}> {
  const tokenDecimals = await getTokenDecimals();
  const rounds = await getUserParticipatedRounds(user);

  if (rounds.length === 0) {
    return { tokenDecimals, items: [] };
  }

  type Agg = { amount: bigint; claimed: bigint; claimable: bigint; firstDate: Date; label: string };
  const map = new Map<string, Agg>();

  for (const rk of rounds) {
    // Normal purchases path
    const [amounts, unlockTimes, claimed, claimableAmounts] = (await readContract({
      contract: presale,
      method: "getUserVestingInfo",
      params: [user, ROUND_ENUM_INDEX[rk]],
    })) as readonly [bigint[], bigint[], bigint[], bigint[]];

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

    // Whitelist aggregation (if this round is one of the whitelist types)
    // We add a single unlock bucket using the round's vestingEndTime for the total preAssigned amount.
    if (rk === "strategic" || rk === "seed") {
      const wl = (await readContract({
        contract: presale,
        method: "whitelist",
        params: [user],
      })) as [boolean, bigint, bigint, number];

      const [isWhitelisted, preAssigned, claimedWl, wlRoundIndex] = wl;
      const mapped = (["strategic", "seed", "private", "institutional", "community"] as const)[
        wlRoundIndex
      ];
      if (isWhitelisted && preAssigned > 0n && mapped === rk) {
        const info = await readRoundInfoByKey(rk);
        const vestEnd = info[9]; // vestingEndTime
        const { key, date, label } = monthKeyFromUnix(vestEnd);
        const prev = map.get(key);
        if (prev) {
          map.set(key, {
            amount: prev.amount + preAssigned,
            claimed: prev.claimed + claimedWl,
            claimable: prev.claimable, // getWhitelistClaimable exists, but we don't need per-bucket here
            firstDate: prev.firstDate,
            label: prev.label,
          });
        } else {
          map.set(key, {
            amount: preAssigned,
            claimed: claimedWl,
            claimable: 0n,
            firstDate: date,
            label,
          });
        }
      }
    }
  }

  const items: MonthlyVestingItem[] = Array.from(map.values())
    .sort((a, b) => a.firstDate.getTime() - b.firstDate.getTime())
    .map((v) => ({
      label: v.label, // e.g., "Nov 2025"
      amountRaw: v.amount,
      claimedRaw: v.claimed,
      claimableRaw: v.claimable,
      firstUnlockDate: v.firstDate,
    }));

  return { tokenDecimals, items };
}
