// utils/admin/roundsWrite.ts
import {
  getContract,
  readContract,
  prepareContractCall,
  sendTransaction,
  waitForReceipt,
} from "thirdweb";
import type { Account } from "thirdweb/wallets";
import { client } from "@/lib/thirdwebClient";
import { presaleAbi } from "@/lib/abi/presale";
import { PRESALE_ADDRESS, PRESALE_CHAIN } from "@/lib/presaleConfig";

/** Round keys used across the app */
export type RoundKey = "strategic" | "seed" | "private" | "institutional" | "community";

/** On-chain enum mapping (must match Solidity order) */
export const ROUND_ENUM_INDEX: Record<RoundKey, number> = {
  strategic: 0,
  seed: 1,
  private: 2,
  institutional: 3,
  community: 4,
};

export const ALL_ROUND_KEYS: RoundKey[] = [
  "strategic",
  "seed",
  "private",
  "institutional",
  "community",
];

const presale = getContract({
  client,
  chain: PRESALE_CHAIN,
  address: PRESALE_ADDRESS,
  abi: presaleAbi,
});

/** Tuple returned by get{Round}RoundInfo view methods */
type RoundInfoTuple = readonly [
  isActive: boolean,            // 0
  tokenPrice: bigint,           // 1
  minPurchase: bigint,          // 2
  totalRaised: bigint,          // 3
  startTime: bigint,            // 4
  endTime: bigint,              // 5
  totalTokensSold: bigint,      // 6
  maxTokensToSell: bigint,      // 7
  isPublic: boolean,            // 8
  vestingEndTime: bigint,       // 9
  cliffPeriodMonths: bigint,    // 10
  vestingDurationMonths: bigint,// 11
  tgeUnlockPercentage: bigint   // 12
];

function ensureEnumMapping(key: RoundKey): number {
  const idx = ROUND_ENUM_INDEX[key];
  if (idx === undefined || idx === null) {
    throw new Error(`Missing enum index for round "${key}" in ROUND_ENUM_INDEX.`);
  }
  return idx;
}

/* ----------------------------- Read Helpers ----------------------------- */

export async function readRoundInfoByKey(key: RoundKey): Promise<RoundInfoTuple> {
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
    default:
      throw new Error(`Unsupported round key: ${key as string}`);
  }
}

/** Minimal info needed by the UI for timing controls */
export type RoundWindow = {
  isActive: boolean;
  startTimeSec: bigint;
  endTimeSec: bigint;
};

export async function readRoundWindow(key: RoundKey): Promise<RoundWindow> {
  const info = await readRoundInfoByKey(key);
  return {
    isActive: info[0],
    startTimeSec: info[4],
    endTimeSec: info[5],
  };
}

/* ---------------------------- Write: Status ----------------------------- */

export async function setRoundStatusTx(
  account: Account,
  key: RoundKey,
  isActive: boolean,
  startTimeSec: bigint,
  endTimeSec: bigint
): Promise<`0x${string}`> {
  const idx = ensureEnumMapping(key);
  const tx = prepareContractCall({
    contract: presale,
    method: "setRoundStatus",
    params: [idx, isActive, startTimeSec, endTimeSec],
  });
  const sent = await sendTransaction({ account, transaction: tx });
  await waitForReceipt(sent);
  return sent.transactionHash;
}

/** Small time guards for admin UX */
export function normalizeTimesFuture(
  start: bigint,
  end: bigint,
  opts?: { LEEWAY_SEC?: bigint; MIN_WINDOW_SEC?: bigint }
): { start: bigint; end: bigint } {
  const now = BigInt(Math.floor(Date.now() / 1000));
  const LEEWAY = opts?.LEEWAY_SEC ?? 120n;          // 2 minutes
  const MIN_WINDOW = opts?.MIN_WINDOW_SEC ?? 300n;  // 5 minutes

  let s = start;
  let e = end;

  if (s <= now + LEEWAY) s = now + LEEWAY;
  if (e <= s) e = s + MIN_WINDOW;

  return { start: s, end: e };
}

/** Toggle a single round (non-exclusive). Ensures sane time window when activating. */
export async function toggleRoundActive(
  account: Account,
  key: RoundKey,
  nextActive: boolean
): Promise<{ statusTx: `0x${string}`; startTimeUsed: bigint; endTimeUsed: bigint }> {
  const info = await readRoundInfoByKey(key);

  let startTime = info[4];
  let endTime = info[5];

  const nowSec = BigInt(Math.floor(Date.now() / 1000));
  const THIRTY_DAYS = 30n * 24n * 60n * 60n;

  const timesInvalid =
    startTime === 0n || endTime === 0n || startTime >= endTime || endTime <= nowSec;

  if (nextActive) {
    if (timesInvalid) {
      const n = normalizeTimesFuture(nowSec, nowSec + THIRTY_DAYS);
      startTime = n.start;
      endTime = n.end;
    } else {
      const n = normalizeTimesFuture(startTime, endTime);
      startTime = n.start;
      endTime = n.end;
    }
  } else {
    const n = normalizeTimesFuture(startTime, endTime);
    startTime = n.start;
    endTime = n.end;
  }

  const statusTx = await setRoundStatusTx(account, key, nextActive, startTime, endTime);
  return { statusTx, startTimeUsed: startTime, endTimeUsed: endTime };
}

/** Toggle one round on and all others off (exclusive). */
export async function toggleRoundActiveExclusive(
  account: Account,
  key: RoundKey,
  nextActive: boolean
): Promise<{
  activated?: { round: RoundKey; txHash: `0x${string}`; startTimeUsed: bigint; endTimeUsed: bigint };
  deactivated: { round: RoundKey; txHash: `0x${string}`; startTimeUsed: bigint; endTimeUsed: bigint }[];
}> {
  const result: {
    activated?: { round: RoundKey; txHash: `0x${string}`; startTimeUsed: bigint; endTimeUsed: bigint };
    deactivated: { round: RoundKey; txHash: `0x${string}`; startTimeUsed: bigint; endTimeUsed: bigint }[];
  } = { deactivated: [] };

  const { statusTx, startTimeUsed, endTimeUsed } = await toggleRoundActive(account, key, nextActive);
  if (nextActive) {
    result.activated = { round: key, txHash: statusTx, startTimeUsed, endTimeUsed };
  } else {
    return result;
  }

  for (const other of ALL_ROUND_KEYS) {
    if (other === key) continue;

    const info = await readRoundInfoByKey(other);
    const isActive = info[0];
    if (!isActive) continue;

    const n = normalizeTimesFuture(info[4], info[5]);
    const txHash = await setRoundStatusTx(account, other, false, n.start, n.end);

    result.deactivated.push({
      round: other,
      txHash,
      startTimeUsed: n.start,
      endTimeUsed: n.end,
    });
  }

  return result;
}

/* ------------------------- Write: Update Window ------------------------- */

/** Convert a Date/number-like to unix seconds (bigint) */
export function toUnixSecondsBigint(
  input: Date | number | string | { valueOf: () => number }
): bigint {
  const ms = typeof input === "object" ? input.valueOf() : Number(input);
  if (!Number.isFinite(ms)) throw new Error("Invalid date/time value");
  const seconds = ms < 1e12 ? ms : Math.floor(ms / 1000);
  return BigInt(seconds);
}

/**
 * Update start/end time for a round.
 * - If `isActive` is omitted, preserve the current active state.
 * - If final `isActive === true`, apply `normalizeTimesFuture` guardrails
 *   so the times are valid and in the near future.
 */
export async function updateRoundWindowTx(
  account: Account,
  key: RoundKey,
  params: {
    startTimeSec: bigint;
    endTimeSec: bigint;
    isActive?: boolean;
  },
  opts?: { enforceFutureIfActive?: boolean } // default true
): Promise<{ txHash: `0x${string}`; startTimeUsed: bigint; endTimeUsed: bigint; isActiveUsed: boolean }> {
  const info = await readRoundInfoByKey(key);
  const currentActive = info[0];

  const nextActive = params.isActive ?? currentActive;
  let s = params.startTimeSec;
  let e = params.endTimeSec;

  if (s <= 0n || e <= 0n) {
    throw new Error("Start and end times must be positive unix seconds.");
  }
  if (s >= e) {
    throw new Error("End time must be strictly greater than start time.");
  }

  const enforce = opts?.enforceFutureIfActive ?? true;
  if (nextActive && enforce) {
    const n = normalizeTimesFuture(s, e);
    s = n.start;
    e = n.end;
  }

  const txHash = await setRoundStatusTx(account, key, nextActive, s, e);
  return { txHash, startTimeUsed: s, endTimeUsed: e, isActiveUsed: nextActive };
}

/**
 * Human-friendly wrapper: accept Date/number inputs.
 * Useful directly from your component with datetime-local values.
 */
export async function updateRoundWindowFromDateTx(
  account: Account,
  key: RoundKey,
  params: {
    start: Date | number | string | { valueOf: () => number };
    end: Date | number | string | { valueOf: () => number };
    isActive?: boolean;
  },
  opts?: { enforceFutureIfActive?: boolean }
): Promise<{ txHash: `0x${string}`; startTimeUsed: bigint; endTimeUsed: bigint; isActiveUsed: boolean }> {
  const startTimeSec = toUnixSecondsBigint(params.start);
  const endTimeSec = toUnixSecondsBigint(params.end);
  return updateRoundWindowTx(account, key, { startTimeSec, endTimeSec, isActive: params.isActive }, opts);
}
