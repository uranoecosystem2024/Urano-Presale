import { getContract, readContract } from "thirdweb";
import { client } from "@/lib/thirdwebClient";
import { presaleAbi } from "@/lib/abi/presale";
import { PRESALE_ADDRESS, PRESALE_CHAIN } from "@/lib/presaleConfig";
import type { RoundStatusItem } from "@/components/admin/roundStatusManagement";

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

async function readRoundByIndex(index: number): Promise<RoundsStruct> {
  const res = await readContract({
    contract: presale,
    method: "rounds",
    params: [index],
  });
  return res as RoundsStruct;
}

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
