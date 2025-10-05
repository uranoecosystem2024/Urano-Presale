// utils/profile/userClaimInfo.ts
"use client";

import { getContract, readContract, prepareContractCall } from "thirdweb";
import type { PreparedTransaction } from "thirdweb";
import { client } from "@/lib/thirdwebClient";
import { sepolia } from "thirdweb/chains";
import { presaleAbi } from "@/lib/abi/presale";

/** Reusable type for this contract’s prepared txs */
type PresalePreparedTx = PreparedTransaction<typeof presaleAbi>;

/* ============================== Contracts ============================== */

const PRESALE_ADDR = process.env
  .NEXT_PUBLIC_PRESALE_SMART_CONTRACT_ADDRESS as `0x${string}`;

const presale = getContract({
  client,
  chain: sepolia,
  address: PRESALE_ADDR,
  abi: presaleAbi,
});

/** Minimal ERC20 ABI to read decimals() */
const ERC20_DECIMALS_ABI = [
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

/* ============================== Types ============================== */

type PurchasesTuple = readonly [
  amounts: bigint[],
  usdcAmounts: bigint[],
  timestamps: bigint[],
  claimed: bigint[]
];

type VestsTuple = readonly [
  amounts: bigint[],
  unlockTimes: bigint[],
  claimed: bigint[],
  claimableAmounts: bigint[]
];

/** Round ids as stored on-chain (enum order) */
const ROUND_IDS = [0, 1, 2, 3, 4] as const;

/* ============================== Helpers ============================== */

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
    return 18; // sensible fallback for ERC20s
  }
}

/* ============================== WHITELIST FLOW ============================== */

export async function readWhitelistClaimSummary(user: `0x${string}`): Promise<{
  claimableRaw: bigint;
  claimedRaw: bigint;
  preAssignedRaw: bigint;
  tokenDecimals: number;
}> {
  const tokenDecimals = await getTokenDecimals();

  const [isWhitelisted, preAssignedRaw, claimedRaw] = (await readContract({
    contract: presale,
    method: "whitelist",
    params: [user],
  }));

  // If not whitelisted, everything is 0
  if (!isWhitelisted) {
    return { claimableRaw: 0n, claimedRaw: 0n, preAssignedRaw: 0n, tokenDecimals };
  }

  const claimableRaw = (await readContract({
    contract: presale,
    method: "getWhitelistClaimable",
    params: [user],
  }));

  return { claimableRaw, claimedRaw, preAssignedRaw, tokenDecimals };
}

export function prepareWhitelistClaimTx(): PresalePreparedTx {
  return prepareContractCall({
    contract: presale,
    method: "claimWhitelistTokens",
    params: [],
  });
}

/* ============================== PURCHASED FLOW ============================== */

export async function readPurchasedClaimSummary(user: `0x${string}`): Promise<{
  claimableRaw: bigint; // sum of current claimable across all rounds
  claimedRaw: bigint;   // sum of already claimed across all rounds
  tokenDecimals: number;
  items: Array<{
    round: number;
    purchaseIndex: number;
    claimable: bigint;  // per purchase claimable now
  }>;
}> {
  const tokenDecimals = await getTokenDecimals();

  const items: Array<{ round: number; purchaseIndex: number; claimable: bigint }> = [];
  let totalClaimable = 0n;
  let totalClaimed = 0n;

  for (const round of ROUND_IDS) {
    const [amounts, , , claimed] = (await readContract({
      contract: presale,
      method: "getUserPurchases",
      params: [user, round],
    })) as PurchasesTuple;

    if (amounts.length === 0) continue;

    const [, , , claimables] = (await readContract({
      contract: presale,
      method: "getUserVestingInfo",
      params: [user, round],
    })) as VestsTuple;

    const n = Math.min(amounts.length, claimables.length, claimed.length);
    for (let i = 0; i < n; i++) {
      const c = claimables[i] ?? 0n;
      const cl = claimed[i] ?? 0n;
      if (c > 0n) {
        items.push({ round, purchaseIndex: i, claimable: c });
        totalClaimable += c;
      }
      totalClaimed += cl;
    }
  }

  return { claimableRaw: totalClaimable, claimedRaw: totalClaimed, tokenDecimals, items };
}

/** One prepared tx per purchase with claimable > 0 */
export async function preparePurchasedClaimTxs(
  user: `0x${string}`
): Promise<PresalePreparedTx[]> {
  const { items } = await readPurchasedClaimSummary(user);

  const txs: PresalePreparedTx[] = [];
  for (const it of items) {
    if (it.claimable > 0n) {
      txs.push(
        prepareContractCall({
          contract: presale,
          method: "claimTokens",
          params: [it.round, BigInt(it.purchaseIndex)],
        })
      );
    }
  }
  return txs;
}
