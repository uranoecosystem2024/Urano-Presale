// utils/admin/rounds.ts
import { getContract, readContract } from "thirdweb";
import { client } from "@/lib/thirdwebClient";
import { presaleAbi } from "@/lib/abi/presale";
import { PRESALE_ADDRESS, PRESALE_CHAIN } from "@/lib/presaleConfig";
import type { RoundStatusItem } from "@/components/admin/roundStatusManagement";

/** 0=Seed, 1=Private, 2=Institutional, 3=Strategic, 4=Community */
export const ROUND_ENUM_INDEX = {
  strategic: 0,
  seed: 1,
  private: 2,
  institutional: 3,
  community: 4,
} as const;

export type AllRoundKey = keyof typeof ROUND_ENUM_INDEX;

const presale = getContract({
  client,
  chain: PRESALE_CHAIN,
  address: PRESALE_ADDRESS,
  abi: presaleAbi,
});

export const ROUND_TITLES: Record<AllRoundKey, string> = {
  seed: "Seed Round",
  private: "Private Round",
  institutional: "Institutional Round",
  strategic: "Strategic Round",
  community: "Community Round",
};

/** Tuple shape returned by `rounds(uint8)` */
type RoundsStruct = readonly [
  boolean, // isActive
  bigint,  // tokenPrice
  bigint,  // minPurchase
  bigint,  // totalRaised
  bigint,  // startTime
  bigint,  // endTime
  bigint,  // totalTokensSold
  bigint,  // maxTokensToSell
  boolean, // isPublic
  bigint,  // vestingEndTime
  bigint,  // cliffPeriodMonths
  bigint,  // vestingDurationMonths
  bigint   // tgeUnlockPercentage
];

/** Read one round by enum index from the contract's mapping */
async function readRoundByIndex(index: number): Promise<RoundsStruct> {
  const res = await readContract({
    contract: presale,
    method: "rounds",       // <-- use the function name, not the full signature
    params: [index],
  });
  return res as RoundsStruct;
}

/** Returns admin UI items with `active` flags per round (stable order). */
export async function fetchRoundItems(): Promise<RoundStatusItem[]> {
  const ORDER: AllRoundKey[] = ["strategic", "seed", "private", "institutional", "community"];

  const results = await Promise.all(
    ORDER.map(async (key) => {
      const idx = ROUND_ENUM_INDEX[key];
      const data = await readRoundByIndex(idx);
      const isActive = data[0];
      const item: RoundStatusItem = {
        id: key,
        title: ROUND_TITLES[key],
        active: isActive,
      };
      return item;
    })
  );

  return results;
}
