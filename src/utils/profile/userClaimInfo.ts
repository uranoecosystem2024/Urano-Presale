// utils/profile/userClaimInfo.ts
"use client";

import { getContract, readContract, prepareContractCall } from "thirdweb";
import type { PreparedTransaction } from "thirdweb";
import { client } from "@/lib/thirdwebClient";
import { sepolia } from "thirdweb/chains";
import { presaleAbi } from "@/lib/abi/presale";

type PresalePreparedTx = PreparedTransaction<typeof presaleAbi>;

const PRESALE_ADDR = process.env.NEXT_PUBLIC_PRESALE_SMART_CONTRACT_ADDRESS as `0x${string}`;

const presale = getContract({
  client,
  chain: sepolia,
  address: PRESALE_ADDR,
  abi: presaleAbi,
});

const ERC20_DECIMALS_ABI = [
  { inputs: [], name: "decimals", outputs: [{ internalType: "uint8", name: "", type: "uint8" }], stateMutability: "view", type: "function" },
] as const;

type PurchasesTuple = readonly [bigint[], bigint[], bigint[], bigint[]];
type VestsTuple     = readonly [bigint[], bigint[], bigint[], bigint[]];

const ROUND_IDS = [0, 1, 2, 3, 4] as const;

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
    const tokenAddr = (await readContract({ contract: presale, method: "token" })) as `0x${string}`;
    const erc20 = getContract({ client, chain: sepolia, address: tokenAddr, abi: ERC20_DECIMALS_ABI });
    const dec = (await readContract({ contract: erc20, method: "decimals" })) as number | bigint;
    return typeof dec === "bigint" ? Number(dec) : dec;
  } catch {
    return 18;
  }
}

/* ----------------------- WHITELIST ----------------------- */

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

/* ----------------------- PURCHASED / VESTING ----------------------- */

export async function readPurchasedClaimSummary(user: `0x${string}`): Promise<{
  claimableRaw: bigint;
  claimedRaw: bigint;
  tokenDecimals: number;
  items: Array<{ round: number; purchaseIndex: number; claimable: bigint }>;
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

export async function preparePurchasedClaimTxs(user: `0x${string}`): Promise<PresalePreparedTx[]> {
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

/* ----------------------- NEW: COMBINED HELPERS ----------------------- */

/** Sum everything for a single snapshot read. */
export async function readAllClaimSummary(user: `0x${string}`): Promise<{
  tokenDecimals: number;
  unclaimedTotalRaw: bigint; // whitelist + purchased (claimable)
  claimedTotalRaw: bigint;   // whitelist + purchased (claimed so far)
  parts: {
    wl: { claimableRaw: bigint; claimedRaw: bigint };
    purchased: { claimableRaw: bigint; claimedRaw: bigint; items: { round: number; purchaseIndex: number; claimable: bigint }[] };
  };
}> {
  const [wl, purchased] = await Promise.all([
    readWhitelistClaimSummary(user),
    readPurchasedClaimSummary(user),
  ]);

  // Both helpers return the same decimals, but we’ll trust purchased.tokenDecimals for output
  const tokenDecimals = purchased.tokenDecimals;

  const unclaimedTotalRaw = (wl.claimableRaw ?? 0n) + (purchased.claimableRaw ?? 0n);
  const claimedTotalRaw   = (wl.claimedRaw ?? 0n) + (purchased.claimedRaw ?? 0n);

  return {
    tokenDecimals,
    unclaimedTotalRaw,
    claimedTotalRaw,
    parts: {
      wl: { claimableRaw: wl.claimableRaw, claimedRaw: wl.claimedRaw },
      purchased: { claimableRaw: purchased.claimableRaw, claimedRaw: purchased.claimedRaw, items: purchased.items },
    },
  };
}

/**
 * Return all prepared txs necessary to claim *everything* the user can claim now.
 * Note: With the current ABI this is multiple transactions: 0..1 whitelist + N purchased.
 */
export async function prepareClaimAllTxs(user: `0x${string}`): Promise<PresalePreparedTx[]> {
  const [wl, purchasedTxs] = await Promise.all([
    readWhitelistClaimSummary(user),
    preparePurchasedClaimTxs(user),
  ]);

  const txs: PresalePreparedTx[] = [];
  if (wl.claimableRaw > 0n) {
    txs.push(prepareWhitelistClaimTx());
  }
  if (purchasedTxs.length) {
    txs.push(...purchasedTxs);
  }
  return txs;
}
