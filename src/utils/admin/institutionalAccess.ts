// /utils/admin/institutionalAccess.ts
import {
  getContract,
  readContract,
  prepareContractCall,
  sendTransaction,
  waitForReceipt,
} from "thirdweb";
import type { Account } from "thirdweb/wallets";
import { client } from "@/lib/thirdwebClient";
import { sepolia } from "thirdweb/chains";
import { presaleAbi } from "@/lib/abi/presale";

const PRESALE_ADDR = process.env
  .NEXT_PUBLIC_PRESALE_SMART_CONTRACT_ADDRESS as `0x${string}`;

const presale = getContract({
  client,
  chain: sepolia,
  address: PRESALE_ADDR,
  abi: presaleAbi,
});

/**
 * ABI tuple returned by getInstitutionalRoundInfo:
 * isActive_, tokenPrice_, minPurchase_, totalRaised_, startTime_, endTime_,
 * totalTokensSold_, maxTokensToSell_, isPublic_, vestingEndTime_,
 * cliffPeriodMonths_, vestingDurationMonths_, tgeUnlockPercentage_
 */
type InstitutionalInfoTuple = readonly [
  boolean,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  boolean, // isPublic_ (index 8)
  bigint,
  bigint,
  bigint,
  bigint
];

/** Returns the current "public" flag for the Institutional round. */
export async function readInstitutionalPublic(): Promise<boolean> {
  const info = (await readContract({
    contract: presale,
    method: "getInstitutionalRoundInfo",
  })) as InstitutionalInfoTuple;

  return info[8]; // isPublic_
}

/** Cached role ids to avoid repeated reads. */
let cachedDefaultAdminRole: `0x${string}` | null = null;
let cachedInstitutionalManagerRole: `0x${string}` | null = null;

async function getDefaultAdminRole(): Promise<`0x${string}`> {
  if (cachedDefaultAdminRole) return cachedDefaultAdminRole;
  const role = (await readContract({
    contract: presale,
    method: "DEFAULT_ADMIN_ROLE",
  }));
  cachedDefaultAdminRole = role;
  return role;
}

async function getInstitutionalManagerRole(): Promise<`0x${string}`> {
  if (cachedInstitutionalManagerRole) return cachedInstitutionalManagerRole;
  const role = (await readContract({
    contract: presale,
    method: "INSTITUTIONAL_MANAGER_ROLE",
  }));
  cachedInstitutionalManagerRole = role;
  return role;
}

/**
 * Admin-only: can the connected account toggle Institutional round "public"?
 * We allow either DEFAULT_ADMIN_ROLE or INSTITUTIONAL_MANAGER_ROLE.
 */
export async function canEditInstitutionalPublic(
  account?: Account
): Promise<boolean> {
  if (!account) return false;

  const addr = account.address as `0x${string}`;
  const [adminRole, instRole] = await Promise.all([
    getDefaultAdminRole(),
    getInstitutionalManagerRole(),
  ]);

  const [isAdmin, isManager] = await Promise.all([
    readContract({
      contract: presale,
      method: "hasRole",
      params: [adminRole, addr],
    }),
    readContract({
      contract: presale,
      method: "hasRole",
      params: [instRole, addr],
    }),
  ]);

  return isAdmin || isManager;
}

/** Sets the Institutional round public flag (requires proper role). */
export async function setInstitutionalPublic(
  account: Account,
  next: boolean
): Promise<{ txHash: `0x${string}` }> {
  const tx = prepareContractCall({
    contract: presale,
    method: "setInstitutionalRoundPublic",
    params: [next],
  });

  const sent = await sendTransaction({ account, transaction: tx });
  await waitForReceipt(sent);

  return { txHash: sent.transactionHash };
}
