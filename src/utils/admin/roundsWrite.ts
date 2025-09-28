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
import { sepolia } from "thirdweb/chains";
import { presaleAbi } from "@/lib/abi/presale";

/**
 * All rounds present in the new ABI.
 */
export type RoundKey = "seed" | "private" | "institutional" | "strategic" | "community";

const PRESALE_ADDR = process.env
  .NEXT_PUBLIC_PRESALE_SMART_CONTRACT_ADDRESS as `0x${string}`;

const presale = getContract({
  client,
  chain: sepolia,
  address: PRESALE_ADDR,
  abi: presaleAbi,
});

/**
 * ⚠️ Confirm these indices match your Solidity enum order.
 * Based on the ABI (presence/order of get*RoundInfo helpers), a common order is:
 * enum RoundType { Seed=0, Private=1, Institutional=2, Strategic=3, Community=4 }
 * If your enum differs, update this map accordingly.
 */
export const ROUND_ENUM_INDEX: Record<RoundKey, number> = {
  seed: 0,
  private: 1,
  institutional: 2,
  strategic: 3,
  community: 4,
};

function ensureEnumMapping(key: RoundKey): number {
  const idx = ROUND_ENUM_INDEX[key];
  if (idx === undefined || idx === null) {
    throw new Error(`Missing enum index for round "${key}" in ROUND_ENUM_INDEX.`);
  }
  return idx;
}

const ALL_ROUND_KEYS: RoundKey[] = ["seed", "private", "institutional", "strategic", "community"];

/**
 * NEW ABI tuple layout for get*RoundInfo():
 *
 * isActive_, tokenPrice_, minPurchase_, totalRaised_, startTime_, endTime_,
 * totalTokensSold_, maxTokensToSell_, isPublic_, vestingEndTime_,
 * cliffPeriodMonths_, vestingDurationMonths_, tgeUnlockPercentage_
 */
type RoundInfoTuple = readonly [
  boolean, // 0 isActive_
  bigint,  // 1 tokenPrice_
  bigint,  // 2 minPurchase_
  bigint,  // 3 totalRaised_
  bigint,  // 4 startTime_
  bigint,  // 5 endTime_
  bigint,  // 6 totalTokensSold_
  bigint,  // 7 maxTokensToSell_
  boolean, // 8 isPublic_
  bigint,  // 9 vestingEndTime_
  bigint,  // 10 cliffPeriodMonths_
  bigint,  // 11 vestingDurationMonths_
  bigint   // 12 tgeUnlockPercentage_
];

// ---------- READ HELPERS ----------

export async function readRoundInfoByKey(key: RoundKey): Promise<RoundInfoTuple> {
  switch (key) {
    case "seed":
      return (await readContract({
        contract: presale,
        method: "getSeedRoundInfo",
      })) as RoundInfoTuple;

    case "private":
      return (await readContract({
        contract: presale,
        method: "getPrivateRoundInfo",
      })) as RoundInfoTuple;

    case "institutional":
      return (await readContract({
        contract: presale,
        method: "getInstitutionalRoundInfo",
      })) as RoundInfoTuple;

    case "strategic":
      return (await readContract({
        contract: presale,
        method: "getStrategicRoundInfo",
      })) as RoundInfoTuple;

    case "community":
      return (await readContract({
        contract: presale,
        method: "getCommunityRoundInfo",
      })) as RoundInfoTuple;
  }
  // Exhaustiveness guard (should be unreachable)
  throw new Error(`Unsupported round key: ${key as string}`);
}

// ---------- WRITE HELPERS ----------

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

/**
 * Ensure start > now + leeway and end ≥ start + minWindow.
 * This avoids "start must be in the future" style guards.
 */
function normalizeTimesFuture(
  start: bigint,
  end: bigint,
  opts?: { LEEWAY_SEC?: bigint; MIN_WINDOW_SEC?: bigint }
): { start: bigint; end: bigint } {
  const now = BigInt(Math.floor(Date.now() / 1000));
  const LEEWAY = opts?.LEEWAY_SEC ?? 120n; // 2 minutes
  const MIN_WINDOW = opts?.MIN_WINDOW_SEC ?? 300n; // 5 minutes

  let s = start;
  let e = end;

  // Push start into the near future with a buffer
  if (s <= now + LEEWAY) s = now + LEEWAY;

  // Ensure end is after start by at least MIN_WINDOW
  if (e <= s) e = s + MIN_WINDOW;

  return { start: s, end: e };
}

/**
 * Toggle a single round active/inactive (no side-effects on other rounds).
 * - If activating and times are invalid/expired, set to future window.
 * - If deactivating, still pass validated/future times to satisfy strict contracts.
 */
export async function toggleRoundActive(
  account: Account,
  key: RoundKey,
  nextActive: boolean
): Promise<{ statusTx: `0x${string}`; startTimeUsed: bigint; endTimeUsed: bigint }> {
  const info = await readRoundInfoByKey(key);

  // NEW ABI: startTime_ at index 4, endTime_ at index 5
  let startTime = info[4];
  let endTime = info[5];

  const nowSec = BigInt(Math.floor(Date.now() / 1000));
  const THIRTY_DAYS = 30n * 24n * 60n * 60n;

  const timesInvalid =
    startTime === 0n || endTime === 0n || startTime >= endTime || endTime <= nowSec;

  if (nextActive) {
    if (timesInvalid) {
      // Reasonable future window: start soon, end in ~30 days
      const n = normalizeTimesFuture(nowSec, nowSec + THIRTY_DAYS);
      startTime = n.start;
      endTime = n.end;
    } else {
      // Even if valid, ensure they're still in the future (avoid edge reverts)
      const n = normalizeTimesFuture(startTime, endTime);
      startTime = n.start;
      endTime = n.end;
    }
  } else {
    // Deactivating: some contracts validate times regardless; keep/push forward safely
    const n = normalizeTimesFuture(startTime, endTime);
    startTime = n.start;
    endTime = n.end;
  }

  const statusTx = await setRoundStatusTx(account, key, nextActive, startTime, endTime);
  return { statusTx, startTimeUsed: startTime, endTimeUsed: endTime };
}

/**
 * Exclusive activation:
 * - Activate the chosen round (future-proof times),
 * - then sequentially deactivate any other active rounds, also with future-proof times.
 */
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

  // 1) Toggle target round
  const { statusTx, startTimeUsed, endTimeUsed } = await toggleRoundActive(account, key, nextActive);
  if (nextActive) {
    result.activated = { round: key, txHash: statusTx, startTimeUsed, endTimeUsed };
  } else {
    return result;
  }

  // 2) Deactivate others sequentially with future-proof times
  for (const other of ALL_ROUND_KEYS) {
    if (other === key) continue;

    const info = await readRoundInfoByKey(other);
    const isActive = info[0]; // isActive_

    if (!isActive) continue;

    // NEW ABI: startTime/endTime indexes are 4/5
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
