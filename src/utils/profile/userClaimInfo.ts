"use client";

import { getContract, readContract, prepareContractCall } from "thirdweb";
import type { PreparedTransaction } from "thirdweb";
import { client } from "@/lib/thirdwebClient";
import { sepolia } from "thirdweb/chains";
import { presaleAbi } from "@/lib/abi/presale";

type PresalePreparedTx = PreparedTransaction<typeof presaleAbi>;

const DEBUG = process.env.NEXT_PUBLIC_DEBUG === "true";
const log = (...args: unknown[]) => {
  if (DEBUG) console.log("[userClaimInfo]", ...args);
};

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

/** getUserVestingInfo returns these arrays aligned by index */
type VestsTuple = readonly [
  amounts: bigint[],
  unlockTimes: bigint[],
  claimed: bigint[],
  claimableAmounts: bigint[]
];

type WhitelistTuple = readonly [boolean, bigint, bigint, number];
type WhitelistObj = {
  isWhitelisted: boolean;
  preAssignedTokens: bigint;
  claimedTokens: bigint;
  whitelistRound: number;
};

type RoundStructTuple = readonly [
  isActive: boolean,
  tokenPrice: bigint,
  minPurchase: bigint,
  totalRaised: bigint,
  startTime: bigint,
  endTime: bigint,
  totalTokensSold: bigint,
  maxTokensToSell: bigint,
  isPublic: boolean,
  vestingEndTime: bigint,
  cliffPeriodMonths: bigint,
  vestingDurationMonths: bigint,
  tgeUnlockPercentage: bigint
];
type RoundStructObj = {
  isActive: boolean;
  tokenPrice: bigint;
  minPurchase: bigint;
  totalRaised: bigint;
  startTime: bigint;
  endTime: bigint;
  totalTokensSold: bigint;
  maxTokensToSell: bigint;
  isPublic: boolean;
  vestingEndTime: bigint;
  cliffPeriodMonths: bigint;
  vestingDurationMonths: bigint;
  tgeUnlockPercentage: bigint;
};

const ROUND_IDS = [0, 1, 2, 3, 4] as const;

/* -------------------------- Type Guards & Utils -------------------------- */

function isWhitelistTuple(x: unknown): x is WhitelistTuple {
  return (
    Array.isArray(x) &&
    x.length >= 4 &&
    typeof x[0] === "boolean" &&
    typeof x[1] === "bigint" &&
    typeof x[2] === "bigint" &&
    typeof x[3] === "number"
  );
}

function isWhitelistObj(x: unknown): x is WhitelistObj {
  if (x === null || typeof x !== "object") return false;
  const r = x as Record<string, unknown>;
  return (
    typeof r.isWhitelisted === "boolean" &&
    typeof r.preAssignedTokens === "bigint" &&
    typeof r.claimedTokens === "bigint" &&
    typeof r.whitelistRound === "number"
  );
}

function isRoundTuple(x: unknown): x is RoundStructTuple {
  return (
    Array.isArray(x) &&
    x.length >= 13 &&
    typeof x[0] === "boolean" &&
    typeof x[1] === "bigint"
  );
}

function isRoundObj(x: unknown): x is RoundStructObj {
  if (x === null || typeof x !== "object") return false;
  const r = x as Record<string, unknown>;
  return typeof r.isActive === "boolean" && typeof r.tokenPrice === "bigint";
}

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

/* -------------------------- Whitelist (Pre-assign) -------------------------- */

export async function readWhitelistClaimSummary(user: `0x${string}`): Promise<{
  claimableRaw: bigint;
  claimedRaw: bigint;
  preAssignedRaw: bigint;
  tokenDecimals: number;
}> {
  const tokenDecimals = await getTokenDecimals();

  const wlRawUnknown: unknown = await readContract({
    contract: presale,
    method: "whitelist",
    params: [user],
  });

  let isWhitelisted = false;
  let preAssignedRaw = 0n;
  let claimedRaw = 0n;

  if (isWhitelistTuple(wlRawUnknown)) {
    isWhitelisted = wlRawUnknown[0];
    preAssignedRaw = wlRawUnknown[1];
    claimedRaw = wlRawUnknown[2];
  } else if (isWhitelistObj(wlRawUnknown)) {
    isWhitelisted = wlRawUnknown.isWhitelisted;
    preAssignedRaw = wlRawUnknown.preAssignedTokens;
    claimedRaw = wlRawUnknown.claimedTokens;
  } else {
    log("Whitelist returned an unknown shape; treating as not whitelisted.");
  }

  if (!isWhitelisted) {
    return { claimableRaw: 0n, claimedRaw: 0n, preAssignedRaw: 0n, tokenDecimals };
  }

  const diff = preAssignedRaw - claimedRaw;
  const claimableRaw = diff > 0n ? diff : 0n;
  return { claimableRaw, claimedRaw, preAssignedRaw, tokenDecimals };
}

export function prepareWhitelistClaimTx(): PresalePreparedTx {
  return prepareContractCall({
    contract: presale,
    method: "claimWhitelistTokens",
    params: [],
  });
}

/* ----------------------------- Purchased vesting ----------------------------- */
/** Claim summary across *all* rounds, not just the active one. */
export async function readPurchasedClaimSummaryAllRounds(user: `0x${string}`): Promise<{
  roundIdsWithPurchases: number[];
  claimableRaw: bigint;
  claimedRaw: bigint;
  tokenDecimals: number;
  items: Array<{ round: number; purchaseIndex: number; claimable: bigint }>;
}> {
  const tokenDecimals = await getTokenDecimals();

  let totalClaimable = 0n;
  let totalClaimed = 0n;
  const items: Array<{ round: number; purchaseIndex: number; claimable: bigint }> = [];
  const roundIdsWithPurchases: number[] = [];

  for (const roundId of ROUND_IDS) {
    let v: VestsTuple;
    try {
      v = (await readContract({
        contract: presale,
        method: "getUserVestingInfo",
        params: [user, roundId],
      })) as VestsTuple;
    } catch (e) {
      log(`getUserVestingInfo failed for round ${roundId}:`, e);
      continue;
    }

    if (!Array.isArray(v) || v.length < 4) continue;

    const [amounts, _unlockTimes, claimed, claimables] = v;

    const n = Math.min(amounts.length, claimables.length, claimed.length);
    if (n === 0) continue;

    // Mark that this round has entries for the user
    roundIdsWithPurchases.push(roundId);

    for (let i = 0; i < n; i++) {
      const cNow = claimables[i] ?? 0n;
      const cl = claimed[i] ?? 0n;

      if (cNow > 0n) {
        items.push({ round: roundId, purchaseIndex: i, claimable: cNow });
        totalClaimable += cNow;
      }
      // Sum all claimed so far for display
      totalClaimed += cl;
    }
  }

  return {
    roundIdsWithPurchases,
    claimableRaw: totalClaimable,
    claimedRaw: totalClaimed,
    tokenDecimals,
    items,
  };
}

export async function preparePurchasedClaimTxs(
  user: `0x${string}`
): Promise<PresalePreparedTx[]> {
  const res = await readPurchasedClaimSummaryAllRounds(user);
  const txs: PresalePreparedTx[] = [];
  for (const it of res.items) {
    // one tx per (round, purchaseIndex) that has something to claim
    txs.push(
      prepareContractCall({
        contract: presale,
        method: "claimTokens",
        params: [it.round, BigInt(it.purchaseIndex)],
      })
    );
  }
  return txs;
}

/* ------------------------------ Combined summary ------------------------------ */

export async function readAllClaimSummary(user: `0x${string}`): Promise<{
  tokenDecimals: number;
  unclaimedTotalRaw: bigint;
  claimedTotalRaw: bigint;
  parts: {
    wl: { claimableRaw: bigint; claimedRaw: bigint };
    purchased: {
      roundIdsWithPurchases: number[];
      claimableRaw: bigint;
      claimedRaw: bigint;
      items: { round: number; purchaseIndex: number; claimable: bigint }[];
    };
  };
}> {
  const [wl, purchased] = await Promise.all([
    readWhitelistClaimSummary(user),
    readPurchasedClaimSummaryAllRounds(user),
  ]);

  const tokenDecimals = purchased.tokenDecimals;

  const unclaimedTotalRaw = (purchased.claimableRaw ?? 0n) + (wl.claimableRaw ?? 0n);
  const claimedTotalRaw = (purchased.claimedRaw ?? 0n) + (wl.claimedRaw ?? 0n);

  return {
    tokenDecimals,
    unclaimedTotalRaw,
    claimedTotalRaw,
    parts: {
      wl: { claimableRaw: wl.claimableRaw, claimedRaw: wl.claimedRaw },
      purchased: {
        roundIdsWithPurchases: purchased.roundIdsWithPurchases,
        claimableRaw: purchased.claimableRaw,
        claimedRaw: purchased.claimedRaw,
        items: purchased.items,
      },
    },
  };
}

/** Build all claim txs (whitelist + purchased across all rounds). */
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
