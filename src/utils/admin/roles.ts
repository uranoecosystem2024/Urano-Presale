// /utils/admin/roles.ts
import { getContract, readContract } from "thirdweb";
import type { Account } from "thirdweb/wallets";
import { client } from "@/lib/thirdwebClient";
import { sepolia } from "thirdweb/chains";
import { presaleAbi } from "@/lib/abi/presale";

/** ENV */
const PRESALE_ADDR = process.env
  .NEXT_PUBLIC_PRESALE_SMART_CONTRACT_ADDRESS as `0x${string}`;

if (!PRESALE_ADDR) {
  throw new Error("NEXT_PUBLIC_PRESALE_SMART_CONTRACT_ADDRESS is not set");
}

/** Contract instance */
const presale = getContract({
  client,
  chain: sepolia,
  address: PRESALE_ADDR,
  abi: presaleAbi,
});

/** Read the DEFAULT_ADMIN_ROLE bytes32 id from the contract */
export async function getDefaultAdminRole(): Promise<`0x${string}`> {
  const role = await readContract({
    contract: presale,
    method: "DEFAULT_ADMIN_ROLE",
  });
  return role;
}

/** Check if a raw address has the admin role */
export async function isAddressAdmin(
  address: `0x${string}`
): Promise<boolean> {
  const adminRole = await getDefaultAdminRole();
  const has = await readContract({
    contract: presale,
    method: "hasRole",
    params: [adminRole, address],
  });
  return Boolean(has);
}

/** Check if the connected thirdweb Account has the admin role */
export async function hasAdminRole(account?: Account): Promise<boolean> {
  if (!account) return false;
  return isAddressAdmin(account.address as `0x${string}`);
}

/** Optional: throw if not admin (handy for guarding actions) */
export async function assertAdmin(account?: Account): Promise<void> {
  if (!(await hasAdminRole(account))) {
    throw new Error("Current wallet does not have admin permissions.");
  }
}
