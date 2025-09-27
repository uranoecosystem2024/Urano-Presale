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
  
      const dec = await readContract({ contract: erc20, method: "decimals" });
      return Number(dec);
    } catch {
      return 18; // sensible fallback
    }
  }
  
  /* ----------------------------- *
   * Reads                         *
   * ----------------------------- */
  
  export type WhitelistEntry = {
    isWhitelisted: boolean;
    preAssignedTokensRaw: bigint;
    preAssignedTokensHuman: string;
    claimedTokensRaw: bigint;
    releaseDateSec: bigint;
  };
  
  export async function readWhitelist(user: `0x${string}`): Promise<WhitelistEntry> {
    const decimals = await getTokenDecimals();
  
    // ABI: whitelist(address) returns (isWhitelisted, preAssignedTokens, claimedTokens, releaseDate)
    const res = (await readContract({
      contract: presale,
      method: "whitelist",
      params: [user],
    })) as [boolean, bigint, bigint, bigint];
  
    const [isWhitelisted, preAssignedRaw, claimedRaw, releaseDate] = res;
    return {
      isWhitelisted: Boolean(isWhitelisted),
      preAssignedTokensRaw: preAssignedRaw,
      preAssignedTokensHuman: fromUnits(preAssignedRaw, decimals),
      claimedTokensRaw: claimedRaw,
      releaseDateSec: releaseDate,
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
  
  /* ----------------------------- *
   * Writes                        *
   * ----------------------------- */
  
  export type AddWhitelistEntryHuman = {
    address: `0x${string}`;
    /** Human amount, e.g., "150000" (URANO units, not wei) */
    preAssignedTokens: string;
    /** Can be a JS Date, dayjs, timestamp ms/s, etc. */
    releaseDate: Date | number | string | { valueOf: () => number };
  };
  
  /**
   * Low-level: addToWhitelist with raw bigints.
   * Arrays must be the same length, each index corresponds to one user.
   */
  export async function addToWhitelistRawTx(
    account: Account,
    users: `0x${string}`[],
    preAssignedTokensRaw: bigint[],
    releaseDatesSec: bigint[]
  ): Promise<`0x${string}`> {
    if (!(users.length && users.length === preAssignedTokensRaw.length && users.length === releaseDatesSec.length)) {
      throw new Error("Input arrays must be non-empty and of equal length.");
    }
  
    const tx = prepareContractCall({
      contract: presale,
      method: "addToWhitelist",
      params: [users, preAssignedTokensRaw, releaseDatesSec],
    });
  
    const sent = await sendTransaction({ account, transaction: tx });
    await waitForReceipt(sent);
    return sent.transactionHash;
  }
  
  /**
   * High-level: accepts human token amounts and flexible date inputs.
   * Converts to raw units using token decimals and seconds.
   */
  export async function addToWhitelistHumanTx(
    account: Account,
    entries: AddWhitelistEntryHuman[]
  ): Promise<`0x${string}`> {
    if (!entries.length) throw new Error("No entries to add.");
  
    const decimals = await getTokenDecimals();
  
    const users: `0x${string}`[] = [];
    const amounts: bigint[] = [];
    const releases: bigint[] = [];
  
    for (const e of entries) {
      const addr = e.address;
      if (!addr || !addr.startsWith("0x") || addr.length !== 42) {
        throw new Error(`Invalid address: ${addr}`);
      }
  
      const amtRaw = toUnits((e.preAssignedTokens ?? "").trim(), decimals);
      if (amtRaw < 0n) throw new Error(`Negative amount for ${addr}`);
  
      const rel = toUnixSecondsBigint(e.releaseDate);
  
      users.push(addr);
      amounts.push(amtRaw);
      releases.push(rel);
    }
  
    return addToWhitelistRawTx(account, users, amounts, releases);
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
  