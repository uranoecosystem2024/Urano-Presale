import { getContract, readContract } from "thirdweb";
import { client } from "@/lib/thirdwebClient";
import { sepolia } from "thirdweb/chains";
import { presaleAbi } from "@/lib/abi/presale";

export type RoundKey = "strategic" | "seed" | "private" | "institutional" | "community";

const PRESALE_ADDR = process.env
  .NEXT_PUBLIC_PRESALE_SMART_CONTRACT_ADDRESS as `0x${string}`;

const presale = getContract({
  client,
  chain: sepolia,
  address: PRESALE_ADDR,
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

export type ActiveVestingSummary = {
  round: RoundKey | null;
  label: string;
  tgeUnlockPct: number | null;
  cliffMonths: number | null;
  durationMonths: number | null;
  releaseFrequency: "Monthly" | "Linear" | "Unknown";
};

export async function readActiveRoundVestingSummary(): Promise<ActiveVestingSummary> {
  const rounds: RoundKey[] = ["strategic", "seed", "private", "institutional", "community"];

  const infos = await Promise.all(rounds.map((r) => readRoundInfoByKey(r)));

  const idx = infos.findIndex((info) => info[0] === true);
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
