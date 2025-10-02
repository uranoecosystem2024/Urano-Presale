// utils/progress.ts
import { getContract, readContract } from "thirdweb";
import { presaleAbi } from "@/lib/abi/presale";
import { client } from "@/lib/thirdwebClient";
import { PRESALE_ADDRESS, PRESALE_CHAIN } from "@/lib/presaleConfig";

/** Contract enum layout: 0=Seed, 1=Private, 2=Institutional, 3=Strategic, 4=Community */
export type RoundKey = "seed" | "private" | "institutional" | "strategic" | "community";

export const ROUND_LABEL: Record<RoundKey, string> = {
  seed: "Seed",
  private: "Private",
  institutional: "Institutional",
  strategic: "Strategic",
  community: "Community",
};

const presale = getContract({
  client,
  chain: PRESALE_CHAIN,
  address: PRESALE_ADDRESS,
  abi: presaleAbi,
});

/**
 * Tuple layout (matches get*RoundInfo outputs):
 * isActive_, tokenPrice_, minPurchase_, totalRaised_, startTime_, endTime_,
 * totalTokensSold_, maxTokensToSell_, isPublic_, vestingEndTime_,
 * cliffPeriodMonths_, vestingDurationMonths_, tgeUnlockPercentage_
 */
type RoundInfoTuple = readonly [
  boolean,  // 0 isActive_
  bigint,   // 1 tokenPrice_
  bigint,   // 2 minPurchase_
  bigint,   // 3 totalRaised_
  bigint,   // 4 startTime_
  bigint,   // 5 endTime_
  bigint,   // 6 totalTokensSold_
  bigint,   // 7 maxTokensToSell_
  boolean,  // 8 isPublic_
  bigint,   // 9 vestingEndTime_
  bigint,   // 10 cliffPeriodMonths_
  bigint,   // 11 vestingDurationMonths_
  bigint    // 12 tgeUnlockPercentage_
];

async function readRoundInfoByKey(key: RoundKey): Promise<RoundInfoTuple> {
  switch (key) {
    case "seed":
      return (await readContract({
        contract: presale,
        method: "getSeedRoundInfo",
      })) as RoundInfoTuple;
    case "private":
      return (await readContract({
        contract: presale,
        method: "getPrivateRoundInfo",
      })) as RoundInfoTuple;
    case "institutional":
      return (await readContract({
        contract: presale,
        method: "getInstitutionalRoundInfo",
      })) as RoundInfoTuple;
    case "strategic":
      return (await readContract({
        contract: presale,
        method: "getStrategicRoundInfo",
      })) as RoundInfoTuple;
    case "community":
      return (await readContract({
        contract: presale,
        method: "getCommunityRoundInfo",
      })) as RoundInfoTuple;
    default: {
      // exhaustive guard
      const _exhaustiveCheck: never = key;
      throw new Error(`Unsupported round key: ${String(_exhaustiveCheck)}`);
    }
  }
}

/** What the progress bar needs */
export type PresaleProgress = {
  key: RoundKey | null;
  label: string | null;
  /** tokens sold in the active round (raw, token decimals) */
  totalTokensSold: bigint;
  /** max tokens for the active round (raw, token decimals) */
  maxTokensToSell: bigint;
  /** % sold, 0..100 (number, safe for UI) */
  purchasedPercent: number;
};

/**
 * Read all rounds, pick the currently active one (preferring within its time window),
 * and compute purchased % = totalTokensSold / maxTokensToSell.
 */
export async function readPresaleProgress(): Promise<PresaleProgress> {
  const order = ["seed", "private", "institutional", "strategic", "community"] as const;

  const all = await Promise.all(order.map((k) => readRoundInfoByKey(k)));

  // Normalize to include key for selection + logging
  const normalized = all.map((t, i) => ({
    key: order[i]! as RoundKey,
    isActive: t[0],
    startTime: t[4],
    endTime: t[5],
    totalTokensSold: t[6],
    maxTokensToSell: t[7],
  }));

  // Prefer active & time-valid; otherwise any active; else none
  const now = BigInt(Math.floor(Date.now() / 1000));
  const timeValid = (s: bigint, e: bigint): boolean => {
    const startOk = s === 0n || now >= s;
    const endOk = e === 0n || now <= e;
    return startOk && endOk;
    };

  const timedActive = normalized.filter((r) => r.isActive && timeValid(r.startTime, r.endTime));
  const chosen = timedActive[0] ?? normalized.find((r) => r.isActive) ?? null;

  if (!chosen) {
    return {
      key: null,
      label: null,
      totalTokensSold: 0n,
      maxTokensToSell: 0n,
      purchasedPercent: 0,
    };
  }

  const key: RoundKey = chosen.key; // concrete RoundKey
  const { totalTokensSold, maxTokensToSell } = chosen;

  // Compute % as number (cap 0..100)
  let purchasedPercent = 0;
  if (maxTokensToSell > 0n) {
    // scale by 100 with 2 decimals precision (×10000 / ÷100)
    purchasedPercent = Number((totalTokensSold * 10000n) / maxTokensToSell) / 100;
    if (!Number.isFinite(purchasedPercent)) purchasedPercent = 0;
    if (purchasedPercent < 0) purchasedPercent = 0;
    if (purchasedPercent > 100) purchasedPercent = 100;
  }

  // Optional debug log (enable with NEXT_PUBLIC_DEBUG_PRESALE=true)
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_DEBUG_PRESALE === "true") {
    try {
      console.groupCollapsed("[Presale] Progress");
      console.log({
        round: key,
        totalTokensSold: totalTokensSold.toString(),
        maxTokensToSell: maxTokensToSell.toString(),
        purchasedPercent,
      });
      console.groupEnd();
    } catch {
      // ignore logging errors
    }
  }

  const label: string | null = ROUND_LABEL[key] ?? null;

  return {
    key,
    label,
    totalTokensSold,
    maxTokensToSell,
    purchasedPercent,
  };
}
