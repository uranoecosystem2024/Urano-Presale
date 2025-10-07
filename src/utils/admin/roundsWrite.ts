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

export type RoundKey = "strategic" | "seed" | "private" | "institutional" | "community";

const presale = getContract({
  client,
  chain: PRESALE_CHAIN,
  address: PRESALE_ADDRESS,
  abi: presaleAbi,
});

export const ROUND_ENUM_INDEX: Record<RoundKey, number> = {
  strategic: 0,
  seed: 1,
  private: 2,
  institutional: 3,
  community: 4,
};

function ensureEnumMapping(key: RoundKey): number {
  const idx = ROUND_ENUM_INDEX[key];
  if (idx === undefined || idx === null) {
    throw new Error(`Missing enum index for round "${key}" in ROUND_ENUM_INDEX.`);
  }
  return idx;
}

export const ALL_ROUND_KEYS: RoundKey[] = ["strategic", "seed", "private", "institutional", "community"];

type RoundInfoTuple = readonly [
  boolean,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  boolean,
  bigint,
  bigint,
  bigint,
  bigint
];

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
  throw new Error(`Unsupported round key: ${key as string}`);
}

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

function normalizeTimesFuture(
  start: bigint,
  end: bigint,
  opts?: { LEEWAY_SEC?: bigint; MIN_WINDOW_SEC?: bigint }
): { start: bigint; end: bigint } {
  const now = BigInt(Math.floor(Date.now() / 1000));
  const LEEWAY = opts?.LEEWAY_SEC ?? 120n;
  const MIN_WINDOW = opts?.MIN_WINDOW_SEC ?? 300n;

  let s = start;
  let e = end;

  if (s <= now + LEEWAY) s = now + LEEWAY;

  if (e <= s) e = s + MIN_WINDOW;

  return { start: s, end: e };
}

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
