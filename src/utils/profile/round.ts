// utils/profile/round.ts
import type { RoundKey } from "@/utils/profile/bought";
import {
  readRoundInfoByKey,
  getUsdcDecimals,
} from "@/utils/profile/bought";

export const ROUND_LABEL: Record<RoundKey, string> = {
  seed: "Seed",
  private: "Private",
  institutional: "Institutional",
  strategic: "Strategic",
  community: "Community",
};

/**
 * Reads the first active round and returns its key, label, raw price and USDC decimals.
 * Returns null round when no round is active.
 */
export async function readActiveRoundSummary(): Promise<{
  key: RoundKey | null;
  label: string | null;
  tokenPriceRaw: bigint | null;
  usdcDecimals: number;
}> {
  const rounds = ["seed", "private", "institutional", "strategic", "community"] as const;

  // fetch all rounds in parallel
  const infos = await Promise.all(rounds.map((r) => readRoundInfoByKey(r)));
  const idx = infos.findIndex((info) => info[0] === true); // isActive_

  const usdcDecimals = await getUsdcDecimals();

  if (idx === -1) {
    return { key: null, label: null, tokenPriceRaw: null, usdcDecimals };
  }

  const key = rounds[idx]! as RoundKey;
  const tokenPriceRaw = infos[idx]![1]; // tokenPrice_
  return { key, label: ROUND_LABEL[key], tokenPriceRaw, usdcDecimals };
}
