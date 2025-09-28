// utils/admin/rounds.ts
import { getContract, readContract } from "thirdweb";
import { client } from "@/lib/thirdwebClient";
import { sepolia } from "thirdweb/chains";
import { presaleAbi } from "@/lib/abi/presale";
import type { RoundStatusItem } from "@/components/admin/roundStatusManagement";

/**
 * Contract enum indices. Keep in sync with the Solidity enum:
 *   0 = Seed, 1 = Private, 2 = Institutional, 3 = Strategic, 4 = Community
 */
export const ROUND_ENUM_INDEX = {
  seed: 0,
  private: 1,
  institutional: 2,
  strategic: 3,
  community: 4,
} as const;

export type AllRoundKey = keyof typeof ROUND_ENUM_INDEX; // "seed" | "private" | "institutional" | "strategic" | "community"

const PRESALE_ADDR = process.env
  .NEXT_PUBLIC_PRESALE_SMART_CONTRACT_ADDRESS as `0x${string}`;

const presale = getContract({
  client,
  chain: sepolia,
  address: PRESALE_ADDR,
  abi: presaleAbi,
});

export const ROUND_TITLES: Record<AllRoundKey, string> = {
  seed: "Seed Round",
  private: "Private Round",
  institutional: "Institutional Round",
  strategic: "Strategic Round",
  community: "Community Round",
};

/**
 * Struct shape returned by the public mapping getter `rounds(uint8)`.
 * (Matches the order in your ABI's `rounds` outputs.)
 */
type RoundsStruct = readonly [
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

/** Safely read one round by enum index from the contract's mapping */
async function readRoundByIndex(index: number): Promise<RoundsStruct> {
  return (await readContract({
    contract: presale,
    method: "rounds",
    params: [index],
  })) as RoundsStruct;
}

/**
 * Returns the list of admin UI items with active flags per round.
 * ✅ Includes all five rounds and binds flags by enum index, not helper names.
 */
export async function fetchRoundItems(): Promise<RoundStatusItem[]> {
  const keys = Object.keys(ROUND_ENUM_INDEX) as AllRoundKey[];

  const reads = await Promise.all(
    keys.map(async (key) => {
      const idx = ROUND_ENUM_INDEX[key];
      const data = await readRoundByIndex(idx);
      const isActive = data[0]; // boolean at position 0
      const item: RoundStatusItem = {
        id: key, // same union used by the component
        title: ROUND_TITLES[key],
        active: isActive,
      };
      return item;
    })
  );

  // Keep a stable, human-friendly order
  return [
    reads.find((r) => r.id === "seed")!,
    reads.find((r) => r.id === "private")!,
    reads.find((r) => r.id === "institutional")!,
    reads.find((r) => r.id === "strategic")!,
    reads.find((r) => r.id === "community")!,
  ];
}
