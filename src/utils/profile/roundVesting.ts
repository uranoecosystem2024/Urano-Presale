// utils/profile/vesting.ts
import { getContract, readContract } from "thirdweb";
import { client } from "@/lib/thirdwebClient";
import { sepolia } from "thirdweb/chains";
import { presaleAbi } from "@/lib/abi/presale";

/** Contract rounds (must match Solidity enum order) */
export type RoundKey = "strategic" | "seed" | "private" | "institutional" | "community";

const PRESALE_ADDR = process.env
  .NEXT_PUBLIC_PRESALE_SMART_CONTRACT_ADDRESS as `0x${string}`;

const presale = getContract({
  client,
  chain: sepolia,
  address: PRESALE_ADDR,
  abi: presaleAbi,
});

/**
 * Tuple returned by get*RoundInfo():
 * [0] isActive, [1] tokenPrice, [2] minPurchase, [3] totalRaised,
 * [4] start, [5] end, [6] totalTokensSold, [7] maxTokensToSell,
 * [8] isPublic, [9] vestingEndTime, [10] cliffMonths, [11] durationMonths, [12] tgeUnlockPct
 */
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

const ROUND_LABEL: Record<RoundKey, string> = {
  seed: "Seed Round",
  private: "Private Round",
  institutional: "Institutional Round",
  strategic: "Strategic Round",
  community: "Community Round",
};

async function readRoundInfoByKey(key: RoundKey): Promise<RoundInfoTuple> {
  switch (key) {
    case "seed":
      return (await readContract({ contract: presale, method: "getSeedRoundInfo" })) as RoundInfoTuple;
    case "private":
      return (await readContract({ contract: presale, method: "getPrivateRoundInfo" })) as RoundInfoTuple;
    case "institutional":
      return (await readContract({ contract: presale, method: "getInstitutionalRoundInfo" })) as RoundInfoTuple;
    case "strategic":
      return (await readContract({ contract: presale, method: "getStrategicRoundInfo" })) as RoundInfoTuple;
    case "community":
      return (await readContract({ contract: presale, method: "getCommunityRoundInfo" })) as RoundInfoTuple;
  }
}

/** Return type exported so components can use it for precise typing */
export type ActiveVestingSummary = {
  round: RoundKey | null;
  label: string;                // e.g. "Strategic Round" or "—"
  tgeUnlockPct: number | null;  // 0..100 (as %), null if no active round
  cliffMonths: number | null;
  durationMonths: number | null;
  releaseFrequency: "Monthly" | "Linear" | "Unknown"; // UI hint (no direct field on-chain)
};

/**
 * Reads the FIRST active round (in fixed order) and returns its vesting parameters.
 * If none active: returns null-like values with label "—".
 */
export async function readActiveRoundVestingSummary(): Promise<ActiveVestingSummary> {
  const rounds: RoundKey[] = ["strategic", "seed", "private", "institutional", "community"];

  // Fetch all round infos concurrently
  const infos = await Promise.all(rounds.map((r) => readRoundInfoByKey(r)));

  const idx = infos.findIndex((info) => info[0] === true); // isActive
  if (idx === -1) {
    return {
      round: null,
      label: "—",
      tgeUnlockPct: null,
      cliffMonths: null,
      durationMonths: null,
      releaseFrequency: "Unknown",
    };
  }

  const info = infos[idx]!;
  const round = rounds[idx]!;
  const tgeUnlockPct = Number(info[12]);
  const cliffMonths = Number(info[10]);
  const durationMonths = Number(info[11]);

  // This is just a UI hint; you can tweak this logic if you add more detail later.
  const releaseFrequency: ActiveVestingSummary["releaseFrequency"] =
    durationMonths > 0 ? "Monthly" : "Unknown";

  return {
    round,
    label: ROUND_LABEL[round],
    tgeUnlockPct,
    cliffMonths,
    durationMonths,
    releaseFrequency,
  };
}
