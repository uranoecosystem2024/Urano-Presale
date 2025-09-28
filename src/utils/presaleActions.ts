// /utils/presaleActions.ts
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
import { parseUnits, zeroAddress } from "viem";
import { presaleAbi } from "@/lib/abi/presale";
import { mockUSDC as mockUsdcAbi } from "@/lib/abi/mockUSDC";

/**
 * ENV — make sure these are set!
 */
const PRESALE_ADDR = process.env
  .NEXT_PUBLIC_PRESALE_SMART_CONTRACT_ADDRESS as `0x${string}`;
const MOCK_USDC_ADDR = process.env
  .NEXT_PUBLIC_USDC_ADDRESS_SEPOLIA as `0x${string}`;

/**
 * Contracts
 */
const presale = getContract({
  client,
  chain: sepolia,
  address: PRESALE_ADDR,
  abi: presaleAbi,
});

const mockUsdc = getContract({
  client,
  chain: sepolia,
  address: MOCK_USDC_ADDR,
  abi: mockUsdcAbi,
});

/**
 * RoundType mapping — keep this aligned with the Solidity enum order.
 * Based on the presence of getSeed/Private/Institutional/Strategic/CommunityRoundInfo,
 * the most likely enum is:
 *   0 = Seed, 1 = Private, 2 = Institutional, 3 = Strategic, 4 = Community
 * If your contract differs, update the numeric values below.
 */
export const RoundType = {
  SEED: 0,
  PRIVATE: 1,
  INSTITUTIONAL: 2,
  STRATEGIC: 3,
  COMMUNITY: 4,
} as const;

export type RoundName = keyof typeof RoundType;
export type RoundLike = number | RoundName;

/** Resolve round as a uint8 index accepted by the contract */
function resolveRound(round: RoundLike): number {
  if (typeof round === "number") return round;
  return RoundType[round];
}

/**
 * Optional: quick sanity helper to fetch round info for UX checks/logging.
 * (Not required for the write calls to succeed.)
 */
export async function getRoundInfo(round: RoundLike) {
  const idx = resolveRound(round);
  switch (idx) {
    case RoundType.SEED:
      return readContract({ contract: presale, method: "getSeedRoundInfo" });
    case RoundType.PRIVATE:
      return readContract({ contract: presale, method: "getPrivateRoundInfo" });
    case RoundType.INSTITUTIONAL:
      return readContract({
        contract: presale,
        method: "getInstitutionalRoundInfo",
      });
    case RoundType.STRATEGIC:
      return readContract({
        contract: presale,
        method: "getStrategicRoundInfo",
      });
    case RoundType.COMMUNITY:
      return readContract({
        contract: presale,
        method: "getCommunityRoundInfo",
      });
    default:
      throw new Error(`Unknown round index: ${idx}`);
  }
}

/** Utility: generate a random 6-digit numeric string (000000–999999) */
const gen6 = () =>
  String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0");

/** Cache token decimals once per session */
let cachedUsdcDecimals: number | null = null;
async function getUsdcDecimals(): Promise<number> {
  if (cachedUsdcDecimals !== null) return cachedUsdcDecimals;
  const raw = (await readContract({
    contract: mockUsdc,
    method: "decimals",
  })) as number | bigint;
  const n = typeof raw === "bigint" ? Number(raw) : raw;
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error("Invalid USDC decimals read from contract");
  }
  cachedUsdcDecimals = n;
  return n;
}

/**
 * Get the existing invite code for a wallet, or create a new unique 6-digit one and register it.
 *
 * - Checks on-chain via `getUserInviteCode(address)`.
 * - If empty, generates a code, ensures uniqueness via `getInviteCodeOwner(code) == address(0)`,
 *   then calls `registerInviteCode(code)`.
 *
 * Returns:
 *  - code: the code string
 *  - created: whether a new code was created in this call
 *  - txHash?: present only when a new code was registered
 */
export async function getOrCreateInviteCode(
  account: Account
): Promise<{ code: string; created: boolean; txHash?: `0x${string}` }> {
  if (!account) throw new Error("No connected account");
  if (!PRESALE_ADDR) throw new Error("PRESALE address is missing");
  if (!MOCK_USDC_ADDR) throw new Error("USDC address is missing");

  const userAddr = account.address as `0x${string}`;

  // 1) Check if the user already has a code
  const existing = (await readContract({
    contract: presale,
    method: "getUserInviteCode",
    params: [userAddr],
  }));

  if (existing && existing.length > 0) {
    return { code: existing, created: false };
  }

  // 2) Generate a unique code & register it
  for (let i = 0; i < 10; i++) {
    const code = gen6();

    // Optional: ensure numeric-only invite codes if your backend/UX expects that.
    // (Contract accepts string; we enforce a 6-digit numeric format for consistency.)
    if (!/^\d{6}$/.test(code)) continue;

    const owner = (await readContract({
      contract: presale,
      method: "getInviteCodeOwner",
      params: [code],
    })) as `0x${string}`;

    if (owner === zeroAddress) {
      const tx = prepareContractCall({
        contract: presale,
        method: "registerInviteCode",
        params: [code],
      });

      const sent = await sendTransaction({ account, transaction: tx });
      await waitForReceipt(sent);

      return { code, created: true, txHash: sent.transactionHash };
    }
  }

  throw new Error(
    "Could not find a free 6-digit code after several attempts. Try again."
  );
}

/**
 * Approves the PRESALE contract to spend the given amount of mock USDC
 * (human amount like 10, 25.5, etc.). Reads decimals from the token.
 *
 * Returns tx hash & the base-unit amount approved.
 */
export async function approveUsdcSpending(
  account: Account,
  humanAmountUsdc: number
): Promise<{ approvedAmount: bigint; txHash: `0x${string}` }> {
  if (!account) throw new Error("No connected account");
  if (!PRESALE_ADDR) throw new Error("PRESALE address is missing");
  if (!MOCK_USDC_ADDR) throw new Error("USDC address is missing");
  if (!(humanAmountUsdc > 0))
    throw new Error("Amount must be greater than 0");

  const decimals = await getUsdcDecimals();
  const amountBaseUnits = parseUnits(humanAmountUsdc.toString(), decimals);

  const tx = prepareContractCall({
    contract: mockUsdc,
    method: "approve",
    params: [PRESALE_ADDR, amountBaseUnits],
  });

  const sent = await sendTransaction({ account, transaction: tx });
  await waitForReceipt(sent);

  return { approvedAmount: amountBaseUnits, txHash: sent.transactionHash };
}

/**
 * Executes the presale purchase.
 * - round: accepts either a number (uint8) or a RoundName (e.g. "COMMUNITY").
 * - humanUsdcAmount: user-typed amount (e.g. 100 for 100 USDC)
 * - inviteCode: the 6-digit code (must be non-empty & already registered/owned by caller)
 *
 * Checks allowance before calling `buyTokens` and throws if insufficient.
 */
export async function buyPresaleTokens(
  account: Account,
  round: RoundLike,
  humanUsdcAmount: number,
  inviteCode: string
): Promise<{ txHash: `0x${string}` }> {
  if (!account) throw new Error("No connected account");
  if (!PRESALE_ADDR) throw new Error("PRESALE address is missing");
  if (!MOCK_USDC_ADDR) throw new Error("USDC address is missing");
  if (!(humanUsdcAmount > 0))
    throw new Error("USDC amount must be greater than 0");
  if (!inviteCode || inviteCode.trim().length === 0)
    throw new Error("Invite code is required");

  // Optional: enforce numeric 6-digit format in the dapp UX layer
  // if (!/^\d{6}$/.test(inviteCode)) throw new Error("Invalid invite code format");

  const decimals = await getUsdcDecimals();
  const usdcAmount = parseUnits(humanUsdcAmount.toString(), decimals);

  // Ensure allowance is sufficient
  const owner = account.address as `0x${string}`;
  const currentAllowance = (await readContract({
    contract: mockUsdc,
    method: "allowance",
    params: [owner, PRESALE_ADDR],
  }));

  if (currentAllowance < usdcAmount) {
    throw new Error("Insufficient USDC allowance for presale contract.");
  }

  // Resolve round enum value safely
  const roundIndex = resolveRound(round);

  // Call buyTokens(round, usdcAmount, inviteCode)
  const tx = prepareContractCall({
    contract: presale,
    method: "buyTokens",
    params: [roundIndex, usdcAmount, inviteCode],
  });

  const sent = await sendTransaction({ account, transaction: tx });
  await waitForReceipt(sent);

  return { txHash: sent.transactionHash };
}
