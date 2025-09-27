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
  
  const PRESALE_ADDR = process.env.NEXT_PUBLIC_PRESALE_SMART_CONTRACT_ADDRESS as `0x${string}`;
  
  const presale = getContract({ client, chain: sepolia, address: PRESALE_ADDR, abi: presaleAbi });
  
  export async function readInstitutionalPublic(): Promise<boolean> {
    const info = await readContract({ contract: presale, method: "getInstitutionalRoundInfo" });
    return Boolean(info?.[9]);
  }
  
  /** Admin only (based on your on-chain test) */
  export async function canEditInstitutionalPublic(account?: Account): Promise<boolean> {
    if (!account) return false;
    const adminRole = await readContract({ contract: presale, method: "DEFAULT_ADMIN_ROLE" });
    const isAdmin = await readContract({
      contract: presale,
      method: "hasRole",
      params: [adminRole, account.address as `0x${string}`],
    });
    return Boolean(isAdmin);
  }
  
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
  