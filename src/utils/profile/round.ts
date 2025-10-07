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

export async function readActiveRoundSummary(): Promise<{
  key: RoundKey | null;
  label: string | null;
  tokenPriceRaw: bigint | null;
  usdcDecimals: number;
}> {
  const rounds = ["strategic", "seed", "private", "institutional", "community"] as const;

  const infos = await Promise.all(rounds.map((r) => readRoundInfoByKey(r)));
  const idx = infos.findIndex((info) => info[0] === true);

  const usdcDecimals = await getUsdcDecimals();

  if (idx === -1) {
    return { key: null, label: null, tokenPriceRaw: null, usdcDecimals };
  }

  const key = rounds[idx]! as RoundKey;
  const tokenPriceRaw = infos[idx]![1];
  return { key, label: ROUND_LABEL[key], tokenPriceRaw, usdcDecimals };
}
