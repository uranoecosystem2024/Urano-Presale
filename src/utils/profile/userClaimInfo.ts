// utils/profile/userClaimInfo.ts
import {
  getContract,
  readContract,
  prepareContractCall,
} from "thirdweb";
import { client } from "@/lib/thirdwebClient";
import { sepolia } from "thirdweb/chains";
import { presaleAbi } from "@/lib/abi/presale";

// ===== Addresses & Contracts =====
const PRESALE_ADDR = process.env
  .NEXT_PUBLIC_PRESALE_SMART_CONTRACT_ADDRESS as `0x${string}`;

const presale = getContract({
  client,
  chain: sepolia,
  address: PRESALE_ADDR,
  abi: presaleAbi,
});

const ERC20_DECIMALS_ABI = [
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// ===== Helpers =====
export function formatTokenAmount(amountRaw: bigint, decimals: number): string {
  const base = 10n ** BigInt(decimals);
  const intPart = amountRaw / base;
  const frac = amountRaw % base;
  if (frac === 0n) return intPart.toString();
  const fracStr = frac.toString().padStart(decimals, "0").replace(/0+$/, "");
  return `${intPart}.${fracStr}`;
}

async function getTokenDecimals(): Promise<number> {
  try {
    const tokenAddr = (await readContract({
      contract: presale,
      method: "token",
    })) as `0x${string}`;

    const erc20 = getContract({
      client,
      chain: sepolia,
      address: tokenAddr,
      abi: ERC20_DECIMALS_ABI,
    });

    const dec = (await readContract({
      contract: erc20,
      method: "decimals",
    })) as number | bigint;

    return typeof dec === "bigint" ? Number(dec) : dec;
  } catch {
    return 18;
  }
}

// ===== Reads =====
export async function readWhitelistClaimSummary(user: `0x${string}`): Promise<{
  claimableRaw: bigint;
  claimedRaw: bigint;
  tokenDecimals: number;
}> {
  const [claimableRaw, userInfo, tokenDecimals] = await Promise.all([
    readContract({
      contract: presale,
      method: "getWhitelistClaimable",
      params: [user],
    }),
    readContract({
      contract: presale,
      method: "getUserInfo",
      params: [user],
    }),
    getTokenDecimals(),
  ]);

  const claimedRaw = userInfo[2]; // claimedTokens_
  return { claimableRaw, claimedRaw, tokenDecimals };
}

// ===== Claim TX =====
// Let thirdweb infer the exact PreparedTransaction type
export async function prepareWhitelistClaimTx() {
  return prepareContractCall({
    contract: presale,
    method: "claimWhitelistTokens" as const,
    params: [] as const,
  });
}

// Optional convenience usage:
// export async function claimWhitelistTokens(account: Parameters<typeof sendTransaction>[0]["account"]) {
//   const tx = await prepareWhitelistClaimTx();
//   return sendTransaction({ account, transaction: tx });
// }
