// utils/presaleCard.ts

import { getContract, readContract } from "thirdweb";
import { presaleAbi } from "@/lib/abi/presale";
import { PRESALE_ADDRESS, PRESALE_CHAIN } from "@/lib/presaleConfig";

/** Round keys in Solidity enum order. */
export type RoundKey = "seed" | "private" | "institutional" | "strategic" | "community";

export const ROUND_ENUM_INDEX: Record<RoundKey, number> = {
  seed: 0,
  private: 1,
  institutional: 2,
  strategic: 3,
  community: 4,
};

const ALL_KEYS: readonly RoundKey[] = ["seed", "private", "institutional", "strategic", "community"] as const;

// One-time sanity log to verify the card reads the SAME adsdr/chain as admin.
if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_DEBUG_PRESALE === "true") {
  console.log("[PresaleCard reader] address/chain", {
    address: PRESALE_ADDRESS,
    chainId: PRESALE_CHAIN.id,
  });
}

// Create the exact same contract instance as admin
const presale = getContract({
  client: (await import("@/lib/thirdwebClient")).client, // dynamic to avoid SSR import pitfalls
  chain: PRESALE_CHAIN,
  address: PRESALE_ADDRESS,
  abi: presaleAbi,
});

// USDC decimals — if you have a proper ERC20 decimals reader, swap this in.
async function getUsdcDecimals(): Promise<number> {
  return 6;
}

// --- Helpers for clean debug logs ---
function bn(v: bigint) {
  return v.toString();
}

export const ROUND_LABEL: Record<RoundKey, string> = {
  seed: "Seed",
  private: "Private",
  institutional: "Institutional",
  strategic: "Strategic",
  community: "Community",
};

// Shape of one round (normalized)
export type RoundInfo = {
  isActive: boolean;
  tokenPrice: bigint;
  minPurchase: bigint;
  totalRaised: bigint;
  startTime: bigint;
  endTime: bigint;
  totalTokensSold: bigint;
  maxTokensToSell: bigint;
  isPublic: boolean;
  vestingEndTime: bigint;
  cliffPeriodMonths: bigint;
  vestingDurationMonths: bigint;
  tgeUnlockPercentage: bigint;
};

// Exact tuple layout from the public mapping getter rounds(uint8)
type RoundsStruct = readonly [
  boolean, // 0 isActive
  bigint,  // 1 tokenPrice
  bigint,  // 2 minPurchase
  bigint,  // 3 totalRaised
  bigint,  // 4 startTime
  bigint,  // 5 endTime
  bigint,  // 6 totalTokensSold
  bigint,  // 7 maxTokensToSell
  boolean, // 8 isPublic
  bigint,  // 9 vestingEndTime
  bigint,  // 10 cliffPeriodMonths
  bigint,  // 11 vestingDurationMonths
  bigint   // 12 tgeUnlockPercentage
];

// tuple → object
function tupleToInfo(t: RoundsStruct): RoundInfo {
  return {
    isActive: t[0],
    tokenPrice: t[1],
    minPurchase: t[2],
    totalRaised: t[3],
    startTime: t[4],
    endTime: t[5],
    totalTokensSold: t[6],
    maxTokensToSell: t[7],
    isPublic: t[8],
    vestingEndTime: t[9],
    cliffPeriodMonths: t[10],
    vestingDurationMonths: t[11],
    tgeUnlockPercentage: t[12],
  };
}

/** Read the on-chain mapping directly by index to avoid any helper/getter discrepancies. */
async function readRoundByIndex(index: number): Promise<RoundsStruct> {
  return (await readContract({
    contract: presale,
    method: "rounds",           // <-- ABI name
    params: [index],
  })) as RoundsStruct;
}

export type ActiveRoundResult = {
  key: RoundKey | null;
  label: string | null;
  info: RoundInfo | null;
  usdcDecimals: number;
};

/**
 * Reads all rounds from the mapping (seed → private → institutional → strategic → community),
 * prefers (isActive && now within [start,end] or times are zero),
 * falls back to the first isActive; else null.
 */
export async function readActiveRound(): Promise<ActiveRoundResult> {
  const [structs, usdcDecimals] = await Promise.all([
    Promise.all(ALL_KEYS.map((k) => readRoundByIndex(ROUND_ENUM_INDEX[k]))),
    getUsdcDecimals(),
  ]);

  // Normalize & attach key
  const normalized = structs.map((t, i) => ({
    key: ALL_KEYS[i]!,
    info: tupleToInfo(t),
  }));

  // ---- DEBUG LOG (enable with NEXT_PUBLIC_DEBUG_PRESALE=true) ----
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_DEBUG_PRESALE === "true") {
    try {
      const rows = normalized.map(({ key, info }) => ({
        key,
        isActive: info.isActive,
        startTime: bn(info.startTime),
        endTime: bn(info.endTime),
        tokenPrice: bn(info.tokenPrice),
        minPurchase: bn(info.minPurchase),
        totalRaised: bn(info.totalRaised),
        totalTokensSold: bn(info.totalTokensSold),
        maxTokensToSell: bn(info.maxTokensToSell),
        isPublic: info.isPublic,
        vestingEndTime: bn(info.vestingEndTime),
        cliffPeriodMonths: bn(info.cliffPeriodMonths),
        vestingDurationMonths: bn(info.vestingDurationMonths),
        tgeUnlockPercentage: bn(info.tgeUnlockPercentage),
      }));
      console.groupCollapsed("[Presale] Round snapshots (mapping)");
      console.table(rows);
      console.groupEnd();

      const actives = normalized.filter(({ info }) => info.isActive);
      if (actives.length > 1) {
        console.warn("[Presale] Multiple rounds marked active in mapping:", actives.map((a) => a.key));
      }
    } catch {
      console.warn("[Presale] Failed to log round snapshots");
    }
  }
  // ---------------------------------------------------------------

  // Prefer active & within time window; fallback to first active; else none
  const now = BigInt(Math.floor(Date.now() / 1000));
  const timedActive = normalized.filter(({ info }) => {
    if (!info.isActive) return false;
    const startOk = info.startTime === 0n || now >= info.startTime;
    const endOk = info.endTime === 0n || now <= info.endTime;
    return startOk && endOk;
  });

  const chosen = timedActive[0] ?? normalized.find(({ info }) => info.isActive) ?? null;

  if (!chosen) {
    return { key: null, label: null, info: null, usdcDecimals };
  }

  return { key: chosen.key, label: ROUND_LABEL[chosen.key], info: chosen.info, usdcDecimals };
}

/**
 * Back-compat: returns only price + decimals.
 */
export async function readActiveRoundSummary(): Promise<{
  key: RoundKey | null;
  label: string | null;
  tokenPriceRaw: bigint | null;
  usdcDecimals: number;
}> {
  const { key, label, info, usdcDecimals } = await readActiveRound();
  return { key, label, tokenPriceRaw: info?.tokenPrice ?? null, usdcDecimals };
}

/** Format a USDC-based raw bigint to a decimal string (e.g. "0.03000"). */
export function formatUsdc(raw: bigint, usdcDecimals: number, fractionDigits = usdcDecimals): string {
  const negative = raw < 0n;
  const value = negative ? -raw : raw;
  const base = 10n ** BigInt(usdcDecimals);
  const intPart = value / base;
  const fracPart = value % base;
  const fracStr = fracPart.toString().padStart(usdcDecimals, "0").slice(0, fractionDigits);
  return `${negative ? "-" : ""}${intPart.toString()}${
    fractionDigits > 0 ? "." + fracStr.padEnd(fractionDigits, "0") : ""
  }`;
}
