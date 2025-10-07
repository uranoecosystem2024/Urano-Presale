
import { getContract, readContract } from "thirdweb";
import { presaleAbi } from "@/lib/abi/presale";
import { PRESALE_ADDRESS, PRESALE_CHAIN } from "@/lib/presaleConfig";

export type RoundKey = "strategic" | "seed" | "private" | "institutional" | "community";

export const ROUND_ENUM_INDEX: Record<RoundKey, number> = {
  strategic: 0,
  seed: 1,
  private: 2,
  institutional: 3,
  community: 4,
};

const ALL_KEYS: readonly RoundKey[] = ["strategic", "seed", "private", "institutional", "community"] as const;

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_DEBUG_PRESALE === "true") {
  console.log("[PresaleCard reader] address/chain", {
    address: PRESALE_ADDRESS,
    chainId: PRESALE_CHAIN.id,
  });
}

const presale = getContract({
  client: (await import("@/lib/thirdwebClient")).client,
  chain: PRESALE_CHAIN,
  address: PRESALE_ADDRESS,
  abi: presaleAbi,
});

async function getUsdcDecimals(): Promise<number> {
  return 6;
}

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

type RoundsStruct = readonly [
  boolean,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  boolean,
  bigint,
  bigint,
  bigint,
  bigint
];

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

async function readRoundByIndex(index: number): Promise<RoundsStruct> {
  return (await readContract({
    contract: presale,
    method: "rounds",
    params: [index],
  })) as RoundsStruct;
}

export type ActiveRoundResult = {
  key: RoundKey | null;
  label: string | null;
  info: RoundInfo | null;
  usdcDecimals: number;
};

export async function readActiveRound(): Promise<ActiveRoundResult> {
  const [structs, usdcDecimals] = await Promise.all([
    Promise.all(ALL_KEYS.map((k) => readRoundByIndex(ROUND_ENUM_INDEX[k]))),
    getUsdcDecimals(),
  ]);

  const normalized = structs.map((t, i) => ({
    key: ALL_KEYS[i]!,
    info: tupleToInfo(t),
  }));

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

export async function readActiveRoundSummary(): Promise<{
  key: RoundKey | null;
  label: string | null;
  tokenPriceRaw: bigint | null;
  usdcDecimals: number;
}> {
  const { key, label, info, usdcDecimals } = await readActiveRound();
  return { key, label, tokenPriceRaw: info?.tokenPrice ?? null, usdcDecimals };
}

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
