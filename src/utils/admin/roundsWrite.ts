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
  
  export type RoundKey = "private" | "institutional" | "community";
  
  const PRESALE_ADDR = process.env
    .NEXT_PUBLIC_PRESALE_SMART_CONTRACT_ADDRESS as `0x${string}`;
  
  const presale = getContract({
    client,
    chain: sepolia,
    address: PRESALE_ADDR,
    abi: presaleAbi,
  });
  
  /**
   * ⚠️ Confirm these match your Solidity enum order:
   * enum RoundType { Private, Institutional, Community }
   */
  export const ROUND_ENUM_INDEX: Record<RoundKey, number> = {
    private: 0,
    institutional: 1,
    community: 2,
  };
  
  function ensureEnumMapping(key: RoundKey): number {
    const idx = ROUND_ENUM_INDEX[key];
    if (idx === undefined || idx === null) {
      throw new Error(`Missing enum index for round "${key}" in ROUND_ENUM_INDEX.`);
    }
    return idx;
  }
  
  const ALL_ROUND_KEYS: RoundKey[] = ["private", "institutional", "community"];
  
  type RoundInfoTuple = [
    boolean, // isActive_
    bigint,  // tokenPrice_
    bigint,  // minPurchase_
    bigint,  // maxPurchase_
    bigint,  // totalRaised_
    bigint,  // startTime_
    bigint,  // endTime_
    bigint,  // totalTokensSold_
    bigint,  // maxTokensToSell_
    boolean, // isPublic_
    bigint   // vestingEndTime_
  ];
  
  // ---------- READ HELPERS ----------
  
  export async function readRoundInfoByKey(key: RoundKey): Promise<RoundInfoTuple> {
    switch (key) {
      case "private":
        return (await readContract({ contract: presale, method: "getPrivateRoundInfo" })) as RoundInfoTuple;
      case "institutional":
        return (await readContract({ contract: presale, method: "getInstitutionalRoundInfo" })) as RoundInfoTuple;
      case "community":
        return (await readContract({ contract: presale, method: "getCommunityRoundInfo" })) as RoundInfoTuple;
    }
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
   * This avoids "Start time must be in the future" and similar guards.
   */
  function normalizeTimesFuture(
    start: bigint,
    end: bigint,
    opts?: { LEEWAY_SEC?: bigint; MIN_WINDOW_SEC?: bigint }
  ): { start: bigint; end: bigint } {
    const now = BigInt(Math.floor(Date.now() / 1000));
    const LEEWAY = opts?.LEEWAY_SEC ?? 120n;      // 2 minutes buffer
    const MIN_WINDOW = opts?.MIN_WINDOW_SEC ?? 300n; // 5 minutes minimum window
  
    let s = start;
    let e = end;
  
    // push start strictly into the future with some buffer
    if (s <= now + LEEWAY) s = now + LEEWAY;
  
    // ensure end is after start by at least MIN_WINDOW
    if (e <= s) e = s + MIN_WINDOW;
  
    return { start: s, end: e };
  }
  
  /**
   * Toggle a single round active/inactive (no side-effects on other rounds).
   * - If activating and times are invalid/expired, set to future (start=now+LEEWAY, end=start+MIN_WINDOW or +30d).
   * - If deactivating, still pass validated future times to satisfy strict contracts.
   */
  export async function toggleRoundActive(
    account: Account,
    key: RoundKey,
    nextActive: boolean
  ): Promise<{ statusTx: `0x${string}`; startTimeUsed: bigint; endTimeUsed: bigint }> {
    const info = await readRoundInfoByKey(key);
    let startTime = info[5]; // startTime_
    let endTime = info[6];   // endTime_
  
    const nowSec = BigInt(Math.floor(Date.now() / 1000));
    const THIRTY_DAYS = 30n * 24n * 60n * 60n;
  
    const timesInvalid =
      startTime === 0n || endTime === 0n || startTime >= endTime || endTime <= nowSec;
  
    if (nextActive) {
      if (timesInvalid) {
        // reasonable future window: start soon, end in ~30 days
        const n = normalizeTimesFuture(nowSec, nowSec + THIRTY_DAYS);
        startTime = n.start;
        endTime = n.end;
      } else {
        // even if valid, ensure they're still in the future (avoid edge reverts)
        const n = normalizeTimesFuture(startTime, endTime);
        startTime = n.start;
        endTime = n.end;
      }
    } else {
      // deactivating: some contracts validate times regardless; keep or push forward safely
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
   * - then sequentially deactivate any other active round, also passing future-proof times.
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
      if (!Boolean(info[0])) continue; // already inactive
  
      const n = normalizeTimesFuture(info[5], info[6]);
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
  