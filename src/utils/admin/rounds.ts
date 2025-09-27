// utils/admin/rounds.ts
import { getContract, readContract } from "thirdweb";
import { client } from "@/lib/thirdwebClient";
import { sepolia } from "thirdweb/chains";
import { presaleAbi } from "@/lib/abi/presale";
import type { RoundStatusItem } from "@/components/admin/roundStatusManagement";

// Only the rounds that actually exist on-chain in this contract
export type RoundKey = "private" | "institutional" | "community";

const ROUND_TITLES: Record<RoundKey, string> = {
  private: "Private Round",
  institutional: "Institutional Round",
  community: "Community Round",
};

// ⚠️ For READS we don't need enum ordinals.
// ⚠️ For WRITES we will need them; DO NOT trust these numbers until you confirm in Solidity.
// export const ROUND_ENUM_INDEX: Record<RoundKey, number> = {
//   private: 0,
//   institutional: 1,
//   community: 2,
// };

const PRESALE_ADDR = process.env.NEXT_PUBLIC_PRESALE_SMART_CONTRACT_ADDRESS as `0x${string}`;
const presale = getContract({ client, chain: sepolia, address: PRESALE_ADDR, abi: presaleAbi });

type RoundInfoTuple = [
  isActive_: boolean,
  tokenPrice_: bigint,
  minPurchase_: bigint,
  maxPurchase_: bigint,
  totalRaised_: bigint,
  startTime_: bigint,
  endTime_: bigint,
  totalTokensSold_: bigint,
  maxTokensToSell_: bigint,
  isPublic_: boolean,
  vestingEndTime_: bigint
];

async function readPrivate(): Promise<RoundInfoTuple> {
  return await readContract({ contract: presale, method: "getPrivateRoundInfo" }) as RoundInfoTuple;
}
async function readInstitutional(): Promise<RoundInfoTuple> {
  return await readContract({ contract: presale, method: "getInstitutionalRoundInfo" }) as RoundInfoTuple;
}
async function readCommunity(): Promise<RoundInfoTuple> {
  return await readContract({ contract: presale, method: "getCommunityRoundInfo" }) as RoundInfoTuple;
}

export async function fetchRoundItems(): Promise<RoundStatusItem[]> {
  const [priv, inst, comm] = await Promise.all([readPrivate(), readInstitutional(), readCommunity()]);
  const items: RoundStatusItem[] = [
    { id: "private",        title: ROUND_TITLES.private,        active: Boolean(priv[0]) },
    { id: "institutional",  title: ROUND_TITLES.institutional,  active: Boolean(inst[0]) },
    { id: "community",      title: ROUND_TITLES.community,      active: Boolean(comm[0]) },
  ];
  return items;
}
