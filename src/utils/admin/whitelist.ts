// utils/admin/whitelist.ts
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

/** Minimal ERC20 ABI for decimals() */
const ERC20_ABI = [
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

/** All rounds supported by the new ABI (⚠️ matches your enum order) */
export type RoundKey = "strategic" | "seed" | "private" | "institutional" | "community";

/** Map UI keys -> Solidity enum index (⚠️ your chosen order) */
export const ROUND_ENUM_INDEX: Record<RoundKey, number> = {
  strategic: 0,
  seed: 1,
  private: 2,
  institutional: 3,
  community: 4,
};

const PRESALE_ADDR = process.env
  .NEXT_PUBLIC_PRESALE_SMART_CONTRACT_ADDRESS as `0x${string}`;

const presale = getContract({
  client,
  chain: sepolia,
  address: PRESALE_ADDR,
  abi: presaleAbi,
});

/* ----------------------------- *
 * Conversions & time utilities  *
 * ----------------------------- */

/** Convert a human string (e.g. "123.456") to raw on-chain units using token decimals. */
export function toUnits(amount: string, decimals: number): bigint {
  const cleaned = (amount ?? "").trim();
  if (!cleaned) return 0n;

  if (!/^\d+(\.\d+)?$/.test(cleaned)) {
    throw new Error("Invalid number format");
  }

  const [intPart = "0", fracPartRaw = ""] = cleaned.split(".");
  const fracPart = fracPartRaw.slice(0, decimals).padEnd(decimals, "0");

  const base = 10n ** BigInt(decimals);
  const intVal = BigInt(intPart || "0") * base;
  const fracVal = fracPart ? BigInt(fracPart) : 0n;

  return intVal + fracVal;
}

/** Convert raw on-chain units to a human string (no trailing zeros). */
export function fromUnits(amount: bigint, decimals: number): string {
  const base = 10n ** BigInt(decimals);
  const intPart = amount / base;
  const frac = amount % base;

  if (frac === 0n) return intPart.toString();

  const fracStr = frac.toString().padStart(decimals, "0").replace(/0+$/, "");
  return `${intPart.toString()}.${fracStr}`;
}

/** Convert Date/dayjs/number-like to unix seconds (bigint). */
export function toUnixSecondsBigint(
  input: Date | number | string | { valueOf: () => number }
): bigint {
  const ms = typeof input === "object" ? input.valueOf() : Number(input);
  if (!Number.isFinite(ms)) throw new Error("Invalid date/time value");
  const seconds = ms < 1e12 ? ms : Math.floor(ms / 1000);
  return BigInt(seconds);
}

/* ----------------------------- *
 * Token decimals                *
 * ----------------------------- */

export async function getTokenDecimals(): Promise<number> {
  try {
    const tokenAddr = (await readContract({
      contract: presale,
      method: "token",
    })) as `0x${string}`;

    const erc20 = getContract({
      client,
      chain: sepolia,
      address: tokenAddr,
      abi: ERC20_ABI,
    });

    const dec = (await readContract({ contract: erc20, method: "decimals" })) as number | bigint;
    return typeof dec === "bigint" ? Number(dec) : dec;
  } catch {
    return 18; // sensible fallback
  }
}

/* ----------------------------- *
 * Reads                         *
 * ----------------------------- */

/**
 * ABI now: whitelist(address) returns
 * (isWhitelisted: bool, preAssignedTokens: uint256, claimedTokens: uint256, whitelistRound: uint8)
 */
type WhitelistTuple = readonly [boolean, bigint, bigint, number | bigint];

export type WhitelistEntry = {
  isWhitelisted: boolean;
  preAssignedTokensRaw: bigint;
  preAssignedTokensHuman: string;
  claimedTokensRaw: bigint;
  whitelistRound: number; // uint8
};

export async function readWhitelist(user: `0x${string}`): Promise<WhitelistEntry> {
  const decimals = await getTokenDecimals();

  const res = (await readContract({
    contract: presale,
    method: "whitelist",
    params: [user],
  })) as WhitelistTuple;

  const isWhitelisted = Boolean(res[0]);
  const preAssignedRaw = res[1];
  const claimedRaw = res[2];
  const whitelistRound = Number(res[3]); // normalize bigint/number to number

  return {
    isWhitelisted,
    preAssignedTokensRaw: preAssignedRaw,
    preAssignedTokensHuman: fromUnits(preAssignedRaw, decimals),
    claimedTokensRaw: claimedRaw,
    whitelistRound,
  };
}

/** Convenience batch reader; executes sequentially to keep it simple. */
export async function readWhitelistMany(
  users: `0x${string}`[]
): Promise<Record<string, WhitelistEntry>> {
  const out: Record<string, WhitelistEntry> = {};
  for (const u of users) {
    out[u] = await readWhitelist(u);
  }
  return out;
}

/** (Optional helper) How much a whitelisted user can claim now */
export async function getWhitelistClaimable(user: `0x${string}`): Promise<bigint> {
  const amount = await readContract({
    contract: presale,
    method: "getWhitelistClaimable",
    params: [user],
  });
  return amount;
}

/* ----------------------------- *
 * Writes                        *
 * ----------------------------- */

export function isAddressLike(a: string): a is `0x${string}` {
  return typeof a === "string" && a.startsWith("0x") && a.length === 42;
}

/** Normalize a RoundKey | number to a uint8 number (0..255) */
function toRoundIndex(round: RoundKey | number): number {
  if (typeof round === "number") {
    if (round < 0 || round > 255) throw new Error("whitelistRound must be a uint8 (0..255).");
    return round;
  }
  const idx = ROUND_ENUM_INDEX[round];
  if (idx === undefined) throw new Error(`Unknown round key: ${round}`);
  return idx;
}

export type AddWhitelistEntryHuman = {
  address: `0x${string}`;
  /** Human amount, e.g., "150000" (token units, not wei) */
  preAssignedTokens: string;
  /** Target round for this whitelist entry (enum value or key) */
  whitelistRound: RoundKey | number;
};

/**
 * Low-level: addToWhitelist with raw bigints and uint8 rounds.
 * Arrays must be the same length; each index corresponds to one user.
 *
 * ABI: addToWhitelist(address[] users, uint256[] preAssignedTokens, uint8[] whitelistRounds)
 */
export async function addToWhitelistRawTx(
  account: Account,
  users: `0x${string}`[],
  preAssignedTokensRaw: bigint[],
  whitelistRounds: number[]
): Promise<`0x${string}`> {
  if (
    !users.length ||
    users.length !== preAssignedTokensRaw.length ||
    users.length !== whitelistRounds.length
  ) {
    throw new Error("Input arrays must be non-empty and of equal length.");
  }

  // Ensure uint8 bounds
  for (const r of whitelistRounds) {
    if (r < 0 || r > 255) throw new Error("whitelistRound must be in uint8 range (0..255).");
  }

  const tx = prepareContractCall({
    contract: presale,
    method: "addToWhitelist",
    params: [users, preAssignedTokensRaw, whitelistRounds],
  });

  const sent = await sendTransaction({ account, transaction: tx });
  await waitForReceipt(sent);
  return sent.transactionHash;
}

/**
 * High-level: accepts human token amounts and flexible round keys/numbers.
 * Converts to raw token units using token decimals.
 * Supports mixing different rounds per address in a single tx.
 */
export async function addToWhitelistHumanTx(
  account: Account,
  entries: AddWhitelistEntryHuman[]
): Promise<`0x${string}`> {
  if (!entries.length) throw new Error("No entries to add.");

  const decimals = await getTokenDecimals();

  const users: `0x${string}`[] = [];
  const amounts: bigint[] = [];
  const rounds: number[] = [];

  for (const e of entries) {
    const addr = e.address;
    if (!isAddressLike(addr)) {
      throw new Error(`Invalid address`);
    }

    const amtRaw = toUnits((e.preAssignedTokens ?? "").trim(), decimals);
    if (amtRaw < 0n) throw new Error(`Negative amount for ${addr}`);

    const roundIdx = toRoundIndex(e.whitelistRound);

    users.push(addr);
    amounts.push(amtRaw);
    rounds.push(roundIdx);
  }

  return addToWhitelistRawTx(account, users, amounts, rounds);
}

/** removeFromWhitelist(address[] users) */
export async function removeFromWhitelistTx(
  account: Account,
  users: `0x${string}`[]
): Promise<`0x${string}`> {
  if (!users.length) throw new Error("Provide at least one address.");
  const tx = prepareContractCall({
    contract: presale,
    method: "removeFromWhitelist",
    params: [users],
  });
  const sent = await sendTransaction({ account, transaction: tx });
  await waitForReceipt(sent);
  return sent.transactionHash;
}

/* ---------------------------------------------------------- *
 * Helpers for UI batch (same round) – great for your component
 * ---------------------------------------------------------- */

export type WhitelistRowInput = {
  /** Unchecked user-entered address (will be validated) */
  address: string;
  /** Human token amount as typed (e.g. "100000") */
  amountHuman: string;
};

/**
 * Add many rows for the SAME round. Will try to send in ONE tx.
 * If you pass `chunkSize`, it will split into multiple txs (useful if you hit gas limits).
 *
 * Returns an array of tx hashes (length 1 unless chunked).
 */
export async function addWhitelistRowsSameRoundTx(
  account: Account,
  round: RoundKey | number,
  rows: WhitelistRowInput[],
  opts?: { chunkSize?: number; dedupe?: boolean }
): Promise<`0x${string}`[]> {
  const chunkSize = opts?.chunkSize && opts.chunkSize > 0 ? Math.floor(opts.chunkSize) : Infinity;
  const dedupe = opts?.dedupe ?? true;

  // Clean & validate rows
  const cleaned: { address: `0x${string}`; preAssignedTokens: string; whitelistRound: RoundKey | number }[] = [];
  const seen = new Set<string>();

  for (const r of rows) {
    const addr = (r.address ?? "").trim();
    const amt = (r.amountHuman ?? "").trim();

    if (!addr || !amt) continue; // skip empty lines
    if (!isAddressLike(addr)) throw new Error(`Invalid address: ${addr}`);
    if (!/^\d+(\.\d+)?$/.test(amt)) throw new Error(`Invalid amount for ${addr}: "${amt}"`);

    if (dedupe) {
      const key = `${addr.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
    }

    cleaned.push({ address: addr, preAssignedTokens: amt, whitelistRound: round });
  }

  if (!cleaned.length) throw new Error("No valid rows to add.");

  // If fits in one tx, use the high-level helper once
  if (cleaned.length <= chunkSize) {
    const tx = await addToWhitelistHumanTx(account, cleaned);
    return [tx];
  }

  // Otherwise chunk
  const hashes: `0x${string}`[] = [];
  for (let i = 0; i < cleaned.length; i += chunkSize) {
    const slice = cleaned.slice(i, i + chunkSize);
    const tx = await addToWhitelistHumanTx(account, slice);
    hashes.push(tx);
  }
  return hashes;
}
