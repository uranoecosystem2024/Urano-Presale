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
  
  /** The three rounds supported by the current ABI */
  export type RoundKey = "private" | "institutional" | "community";
  
  /** Address of the Presale contract (must be defined in your .env) */
  const PRESALE_ADDR = process.env
    .NEXT_PUBLIC_PRESALE_SMART_CONTRACT_ADDRESS as `0x${string}`;
  
  /** Small buffer added to “now” when validating end times */
  export const DEFAULT_LEEWAY_SEC = 120n;
  
  const presale = getContract({
    client,
    chain: sepolia,
    address: PRESALE_ADDR,
    abi: presaleAbi,
  });
  
  /** Round info tuple (matches get*RoundInfo return) */
  type RoundInfoTuple = [
    isActive_: boolean,
    tokenPrice_: bigint,
    minPurchase_: bigint,
    maxPurchase_: bigint,
    totalRaised_: bigint,
    startTime_: bigint,
    endTime_: bigint,
    totalTokensSold_: bigint,
    maxTokensToSell_: bigint,
    isPublic_: boolean,
    vestingEndTime_: bigint
  ];
  
  /* ----------------------------- */
  /* Reads                         */
  /* ----------------------------- */
  
  /** True if vesting has been started already */
  export async function readVestingStarted(): Promise<boolean> {
    const started = await readContract({ contract: presale, method: "vestingStarted" });
    return Boolean(started);
  }
  
  /** Read the per-round vestingEndTime (seconds) */
  export async function readVestingEndTimes(): Promise<{
    privateEnd: bigint;
    institutionalEnd: bigint;
    communityEnd: bigint;
  }> {
    const [priv, inst, comm] = (await Promise.all([
      readContract({ contract: presale, method: "getPrivateRoundInfo" }) as Promise<RoundInfoTuple>,
      readContract({ contract: presale, method: "getInstitutionalRoundInfo" }) as Promise<RoundInfoTuple>,
      readContract({ contract: presale, method: "getCommunityRoundInfo" }) as Promise<RoundInfoTuple>,
    ]));
  
    return {
      privateEnd: priv[10],
      institutionalEnd: inst[10],
      communityEnd: comm[10],
    };
  }
  
  /** Convenience: read all vesting status in one shot */
  export async function readVestingStatus(): Promise<{
    started: boolean;
    privateEnd: bigint;
    institutionalEnd: bigint;
    communityEnd: bigint;
  }> {
    const [started, ends] = await Promise.all([readVestingStarted(), readVestingEndTimes()]);
    return { started, ...ends };
  }
  
  /* ----------------------------- */
  /* Helpers                       */
  /* ----------------------------- */
  
  /**
   * Convert a JS Date / dayjs / number-like input to unix seconds (bigint).
   * Accepts: Date, number (ms or s), string (ms or s), or Dayjs (duck-typed).
   *
   * Heuristic: values < 1e12 are treated as **seconds**, otherwise **milliseconds**.
   * (Because typical JS ms timestamps are ~1.7e12+.)
   */
  export function toUnixSecondsBigint(
    input: Date | number | string | { valueOf: () => number }
  ): bigint {
    // valueOf() covers dayjs and Date
    const ms = typeof input === "object" ? input.valueOf() : Number(input);
    if (!Number.isFinite(ms)) throw new Error("Invalid date/time value");
    const seconds = ms < 1e12 ? ms : Math.floor(ms / 1000);
    return BigInt(seconds);
  }
  
  /**
   * Ensure an end time is strictly in the future by at least LEEWAY seconds.
   * Returns adjusted time if needed.
   */
  export function ensureFutureEnd(
    endSec: bigint,
    opts?: { LEEWAY_SEC?: bigint }
  ): bigint {
    const now = BigInt(Math.floor(Date.now() / 1000));
    const LEEWAY = opts?.LEEWAY_SEC ?? DEFAULT_LEEWAY_SEC;
    if (endSec <= now + LEEWAY) return now + LEEWAY;
    return endSec;
  }
  
  /** Throw if any end time is non-positive (defensive validation) */
  function assertPositiveEnds(...ends: bigint[]) {
    for (const e of ends) {
      if (typeof e !== "bigint" || e <= 0n) {
        throw new Error("End times must be positive.");
      }
    }
  }
  
  /* ----------------------------- */
  /* Writes                        */
  /* ----------------------------- */
  
  /**
   * Start vesting **now** with the three end times (in seconds).
   * - Contract begins vesting immediately on tx confirmation.
   * - Validates/adjusts each end ≥ now + LEEWAY.
   * - Throws if vesting already started (safer UX).
   */
  export async function startVestingTx(
    account: Account,
    params: { privateEnd: bigint; institutionalEnd: bigint; communityEnd: bigint },
    opts?: { LEEWAY_SEC?: bigint }
  ): Promise<`0x${string}`> {
    if (await readVestingStarted()) {
      throw new Error("Vesting already started.");
    }
  
    assertPositiveEnds(params.privateEnd, params.institutionalEnd, params.communityEnd);
  
    const p = ensureFutureEnd(params.privateEnd, opts);
    const i = ensureFutureEnd(params.institutionalEnd, opts);
    const c = ensureFutureEnd(params.communityEnd, opts);
  
    const tx = prepareContractCall({
      contract: presale,
      method: "startVesting",
      params: [p, i, c],
    });
    const sent = await sendTransaction({ account, transaction: tx });
    await waitForReceipt(sent);
    return sent.transactionHash;
  }
  
  /** Update Private round vesting end time (seconds) */
  export async function setPrivateVestingEndTimeTx(
    account: Account,
    endSec: bigint,
    opts?: { LEEWAY_SEC?: bigint }
  ): Promise<`0x${string}`> {
    assertPositiveEnds(endSec);
    const safeEnd = ensureFutureEnd(endSec, opts);
    const tx = prepareContractCall({
      contract: presale,
      method: "setPrivateVestingEndTime",
      params: [safeEnd],
    });
    const sent = await sendTransaction({ account, transaction: tx });
    await waitForReceipt(sent);
    return sent.transactionHash;
  }
  
  /** Update Institutional round vesting end time (seconds) */
  export async function setInstitutionalVestingEndTimeTx(
    account: Account,
    endSec: bigint,
    opts?: { LEEWAY_SEC?: bigint }
  ): Promise<`0x${string}`> {
    assertPositiveEnds(endSec);
    const safeEnd = ensureFutureEnd(endSec, opts);
    const tx = prepareContractCall({
      contract: presale,
      method: "setInstitutionalVestingEndTime",
      params: [safeEnd],
    });
    const sent = await sendTransaction({ account, transaction: tx });
    await waitForReceipt(sent);
    return sent.transactionHash;
  }
  
  /** Update Community round vesting end time (seconds) */
  export async function setCommunityVestingEndTimeTx(
    account: Account,
    endSec: bigint,
    opts?: { LEEWAY_SEC?: bigint }
  ): Promise<`0x${string}`> {
    assertPositiveEnds(endSec);
    const safeEnd = ensureFutureEnd(endSec, opts);
    const tx = prepareContractCall({
      contract: presale,
      method: "setCommunityVestingEndTime",
      params: [safeEnd],
    });
    const sent = await sendTransaction({ account, transaction: tx });
    await waitForReceipt(sent);
    return sent.transactionHash;
  }
  
  /**
   * Round-agnostic setter (handy for UI switch/case).
   * NOTE: There is no single "setRoundVestingEnd" in the ABI; we dispatch to the proper method.
   */
  export async function setVestingEndTimeByKeyTx(
    account: Account,
    key: RoundKey,
    endSec: bigint,
    opts?: { LEEWAY_SEC?: bigint }
  ): Promise<`0x${string}`> {
    switch (key) {
      case "private":
        return setPrivateVestingEndTimeTx(account, endSec, opts);
      case "institutional":
        return setInstitutionalVestingEndTimeTx(account, endSec, opts);
      case "community":
        return setCommunityVestingEndTimeTx(account, endSec, opts);
    }
  }
  
  /* ----------------------------- */
  /* Convenience (UI helpers)      */
  /* ----------------------------- */
  
  /**
   * Accept JS Date/dayjs/etc. for end times, convert, adjust to future, and start vesting.
   * Useful if your pickers give you Date/Dayjs objects directly.
   */
  export async function startVestingFromDatesTx(
    account: Account,
    params: {
      privateEnd: Date | { valueOf: () => number };
      institutionalEnd: Date | { valueOf: () => number };
      communityEnd: Date | { valueOf: () => number };
    },
    opts?: { LEEWAY_SEC?: bigint }
  ): Promise<`0x${string}`> {
    const p = ensureFutureEnd(toUnixSecondsBigint(params.privateEnd), opts);
    const i = ensureFutureEnd(toUnixSecondsBigint(params.institutionalEnd), opts);
    const c = ensureFutureEnd(toUnixSecondsBigint(params.communityEnd), opts);
    return startVestingTx(account, { privateEnd: p, institutionalEnd: i, communityEnd: c }, opts);
  }
  
  /** Round-agnostic convenience: accepts Date/dayjs input */
  export async function setVestingEndTimeByKeyFromDateTx(
    account: Account,
    key: RoundKey,
    end: Date | { valueOf: () => number },
    opts?: { LEEWAY_SEC?: bigint }
  ): Promise<`0x${string}`> {
    const endSec = ensureFutureEnd(toUnixSecondsBigint(end), opts);
    return setVestingEndTimeByKeyTx(account, key, endSec, opts);
  }
  