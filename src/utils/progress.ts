import { getContract, readContract } from "thirdweb";
import { presaleAbi } from "@/lib/abi/presale";
import { client } from "@/lib/thirdwebClient";
import { PRESALE_ADDRESS, PRESALE_CHAIN } from "@/lib/presaleConfig";

export type RoundKey = "strategic" | "seed" | "private" | "institutional" | "community";

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

type RoundInfoTuple = readonly [
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
      const _exhaustiveCheck: never = key;
      throw new Error(`Unsupported round key: ${String(_exhaustiveCheck)}`);
    }
  }
}

export type PresaleProgress = {
  key: RoundKey | null;
  label: string | null;
  totalTokensSold: bigint;
  maxTokensToSell: bigint;
  purchasedPercent: number;
};

export async function readPresaleProgress(): Promise<PresaleProgress> {
  const order = ["strategic", "seed", "private", "institutional", "community"] as const;

  const all = await Promise.all(order.map((k) => readRoundInfoByKey(k)));

  const normalized = all.map((t, i) => ({
    key: order[i]! as RoundKey,
    isActive: t[0],
    startTime: t[4],
    endTime: t[5],
    totalTokensSold: t[6],
    maxTokensToSell: t[7],
  }));

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

  const key: RoundKey = chosen.key;
  const { totalTokensSold, maxTokensToSell } = chosen;

  let purchasedPercent = 0;
  if (maxTokensToSell > 0n) {
    purchasedPercent = Number((totalTokensSold * 10000n) / maxTokensToSell) / 100;
    if (!Number.isFinite(purchasedPercent)) purchasedPercent = 0;
    if (purchasedPercent < 0) purchasedPercent = 0;
    if (purchasedPercent > 100) purchasedPercent = 100;
  }

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
