// utils/admin/vesting.ts
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
 * All rounds supported by the new ABI.
 */
export type RoundKey = "strategic" | "seed" | "private" | "institutional" | "community";

/**
 * Map your UI keys to the Solidity enum indices.
 * ⚠️ Confirm these with your Solidity enum order.
 * Common order inferred from ABI helpers:
 *   0=Seed, 1=Private, 2=Institutional, 3=Strategic, 4=Community
 */
export const ROUND_ENUM_INDEX: Record<RoundKey, number> = {
  strategic: 0,
  seed: 1,
  private: 2,
  institutional: 3,
  community: 4,
};

const ALL_ROUND_KEYS: RoundKey[] = ["strategic", "seed", "private", "institutional", "community"];

/** Address of the Presale contract (must be defined in your .env) */
const PRESALE_ADDR = process.env
  .NEXT_PUBLIC_PRESALE_SMART_CONTRACT_ADDRESS as `0x${string}`;

/** Small buffer added to “now” when validating future times */
export const DEFAULT_LEEWAY_SEC = 120n;

const presale = getContract({
  client,
  chain: sepolia,
  address: PRESALE_ADDR,
  abi: presaleAbi,
});

/**
 * Tuple returned by get*RoundInfo() in the new ABI:
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

/* ----------------------------- */
/* Reads                         */
/* ----------------------------- */

/** True if vesting has been started already */
export async function readVestingStarted(): Promise<boolean> {
  const started = await readContract({ contract: presale, method: "vestingStarted" });
  return Boolean(started);
}

/** Read the global TGE time (seconds since epoch) */
export async function readTgeTime(): Promise<bigint> {
  const tge = await readContract({ contract: presale, method: "tgeTime" });
  return BigInt(tge);
}

async function readRoundInfoByKey(key: RoundKey): Promise<RoundInfoTuple> {
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
    default: {
      const neverKey: never = key;
      throw new Error(`Unsupported round key: ${String(neverKey)}`);
    }
  }
}

/** Read per-round vesting end times (seconds). Defaults to all rounds. */
export async function readVestingEndTimes(
  keys: RoundKey[] = ALL_ROUND_KEYS
): Promise<Record<RoundKey, bigint>> {
  const infos = await Promise.all(keys.map((k) => readRoundInfoByKey(k)));

  const result = {} as Record<RoundKey, bigint>;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const info = infos[i];

    if (key === undefined) {
      throw new Error(`Missing round key at index ${i}`);
    }
    if (!info) {
      throw new Error(`Failed to load round info for key "${key}"`);
    }

    // vestingEndTime_ is index 9 in the new ABI
    result[key] = info[9];
  }

  return result;
}

/** Convenience: read overall vesting status */
export async function readVestingStatus(): Promise<{
  started: boolean;
  tgeTime: bigint;
  ends: Record<RoundKey, bigint>;
}> {
  const [started, tgeTime, ends] = await Promise.all([
    readVestingStarted(),
    readTgeTime(),
    readVestingEndTimes(),
  ]);
  return { started, tgeTime, ends };
}

/* ----------------------------- */
/* Helpers                       */
/* ----------------------------- */

/**
 * Convert a JS Date / dayjs / number-like input to unix seconds (bigint).
 * Accepts: Date, number (ms or s), string (ms or s), or Dayjs-like { valueOf(): number }.
 *
 * Heuristic: values < 1e12 are treated as seconds, otherwise milliseconds.
 */
export function toUnixSecondsBigint(
  input: Date | number | string | { valueOf: () => number }
): bigint {
  const ms = typeof input === "object" ? input.valueOf() : Number(input);
  if (!Number.isFinite(ms)) throw new Error("Invalid date/time value");
  const seconds = ms < 1e12 ? ms : Math.floor(ms / 1000);
  return BigInt(seconds);
}

/** Ensure a timestamp is strictly in the future by at least LEEWAY seconds. */
export function ensureFutureTime(
  tsSec: bigint,
  opts?: { LEEWAY_SEC?: bigint }
): bigint {
  const now = BigInt(Math.floor(Date.now() / 1000));
  const LEEWAY = opts?.LEEWAY_SEC ?? DEFAULT_LEEWAY_SEC;
  return tsSec <= now + LEEWAY ? now + LEEWAY : tsSec;
}

/* ----------------------------- */
/* Writes                        */
/* ----------------------------- */

/**
 * Start vesting (sets the global TGE time).
 * Contract begins vesting at TGE on tx confirmation.
 */
export async function startVestingTx(
  account: Account,
  tgeTimeSec: bigint
): Promise<`0x${string}`> {
  const safeTge = ensureFutureTime(tgeTimeSec);
  const tx = prepareContractCall({
    contract: presale,
    method: "startVesting",
    params: [safeTge],
  });
  const sent = await sendTransaction({ account, transaction: tx });
  await waitForReceipt(sent);
  return sent.transactionHash;
}

/** Convenience: start vesting with Date/dayjs-like input */
export async function startVestingFromDateTx(
  account: Account,
  tge: Date | { valueOf: () => number },
  opts?: { LEEWAY_SEC?: bigint }
): Promise<`0x${string}`> {
  const tgeSec = ensureFutureTime(toUnixSecondsBigint(tge), opts);
  return startVestingTx(account, tgeSec);
}

/**
 * Update per-round vesting parameters (months and TGE unlock %).
 * This is how you configure vesting schedules in the new ABI.
 */
export async function updateRoundVestingParametersTx(
  account: Account,
  key: RoundKey,
  params: {
    cliffPeriodMonths: bigint;          // e.g., 6n
    vestingDurationMonths: bigint;      // e.g., 18n
    tgeUnlockPercentage: bigint;        // e.g., 100n == 100%? (check contract units)
  }
): Promise<`0x${string}`> {
  const idx = ROUND_ENUM_INDEX[key];
  if (idx === undefined) throw new Error(`Unknown round key: ${key}`);

  const tx = prepareContractCall({
    contract: presale,
    method: "updateRoundVestingParameters",
    params: [
      idx,
      params.cliffPeriodMonths,
      params.vestingDurationMonths,
      params.tgeUnlockPercentage,
    ],
  });

  const sent = await sendTransaction({ account, transaction: tx });
  await waitForReceipt(sent);
  return sent.transactionHash;
}
