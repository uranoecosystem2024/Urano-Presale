// utils/admin/roundMaxTokens.ts
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

/** Contract rounds supported by the ABI (enum RoundType { Seed, Private, Institutional, Strategic, Community }) */
export type RoundKey = "strategic" | "seed" | "private" | "institutional" | "community";

/** ⚠️ Ensure these match your Solidity enum order */
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

// --- Minimal ERC20 ABI for decimals() ---
const ERC20_ABI = [
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

/** Ensure RoundKey -> enum index exists */
function ensureEnumMapping(key: RoundKey): number {
  const idx = ROUND_ENUM_INDEX[key];
  if (idx === undefined) {
    throw new Error(`Missing enum index for round "${key}" in ROUND_ENUM_INDEX.`);
  }
  return idx;
}

// -----------------------------
// Conversions (human <-> raw)
// -----------------------------

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

// -----------------------------
// Token decimals
// -----------------------------

/** Reads the presale token address and then its decimals(); falls back to 18 if anything fails. */
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

    const dec = await readContract({
      contract: erc20,
      method: "decimals",
    });

    return Number(dec);
  } catch {
    return 18;
  }
}

// -----------------------------
// Reads
// -----------------------------

/**
 * Tuple shape returned by get*RoundInfo() in your ABI (13 outputs):
 * 0  isActive_ (bool)
 * 1  tokenPrice_ (uint256)
 * 2  minPurchase_ (uint256)
 * 3  totalRaised_ (uint256)
 * 4  startTime_ (uint256)
 * 5  endTime_ (uint256)
 * 6  totalTokensSold_ (uint256)
 * 7  maxTokensToSell_ (uint256)
 * 8  isPublic_ (bool)
 * 9  vestingEndTime_ (uint256)
 * 10 cliffPeriodMonths_ (uint256)
 * 11 vestingDurationMonths_ (uint256)
 * 12 tgeUnlockPercentage_ (uint256)
 */
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

/** Fetch the per-round info using the dedicated getters in the ABI */
async function readRoundInfoByKey(key: RoundKey): Promise<RoundInfoTuple> {
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
}

/** Read the current maxTokensToSell for a given round (raw on-chain units). */
export async function readRoundMaxTokensRaw(key: RoundKey): Promise<bigint> {
  const info = await readRoundInfoByKey(key);
  return info[7]; // maxTokensToSell_
}

/** Read the current maxTokensToSell for a given round, returned in human units (string). */
export async function readRoundMaxTokensHuman(key: RoundKey): Promise<string> {
  const [decimals, raw] = await Promise.all([
    getTokenDecimals(),
    readRoundMaxTokensRaw(key),
  ]);
  return fromUnits(raw, decimals);
}

// -----------------------------
// Write: setRoundMaxTokens
// -----------------------------

/**
 * Send `setRoundMaxTokens(round, maxTokensRaw)` using raw on-chain units.
 * Returns the transaction hash.
 */
export async function setRoundMaxTokensRawTx(
  account: Account,
  key: RoundKey,
  maxTokensRaw: bigint
): Promise<`0x${string}`> {
  const idx = ensureEnumMapping(key);
  const tx = prepareContractCall({
    contract: presale,
    method: "setRoundMaxTokens",
    params: [idx, maxTokensRaw],
  });
  const sent = await sendTransaction({ account, transaction: tx });
  await waitForReceipt(sent);
  return sent.transactionHash;
}

/**
 * Convenience: accepts a human-readable amount (e.g. "1000000") and handles decimals conversion.
 * Returns the transaction hash.
 */
export async function setRoundMaxTokensHumanTx(
  account: Account,
  key: RoundKey,
  maxTokensHuman: string
): Promise<`0x${string}`> {
  if (!maxTokensHuman || Number(maxTokensHuman) < 0) {
    throw new Error("Enter a valid max tokens amount.");
  }
  const decimals = await getTokenDecimals();
  const raw = toUnits(maxTokensHuman, decimals);
  return setRoundMaxTokensRawTx(account, key, raw);
}
