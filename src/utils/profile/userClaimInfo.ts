// utils/profile/userClaimInfo.ts
import {
  getContract,
  readContract,
  prepareContractCall,
} from "thirdweb";
import { client } from "@/lib/thirdwebClient";
import { sepolia } from "thirdweb/chains";
import { presaleAbi } from "@/lib/abi/presale";

// ===== Addresses & Contracts =====
const PRESALE_ADDR = process.env
  .NEXT_PUBLIC_PRESALE_SMART_CONTRACT_ADDRESS as `0x${string}`;

const presale = getContract({
  client,
  chain: sepolia,
  address: PRESALE_ADDR,
  abi: presaleAbi,
});

// Minimal ERC20 ABI for decimals()
const ERC20_DECIMALS_ABI = [
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// ===== ABI-Typed Tuples (match your Solidity return shapes) =====

// rounds(uint8) returns:
type RoundStructTuple = [
  isActive: boolean,
  tokenPrice: bigint,
  minPurchase: bigint,
  totalRaised: bigint,
  startTime: bigint,
  endTime: bigint,
  totalTokensSold: bigint,
  maxTokensToSell: bigint,
  isPublic: boolean,
  vestingEndTime: bigint,
  cliffPeriodMonths: bigint,
  vestingDurationMonths: bigint,
  tgeUnlockPercentage: bigint
];

// whitelist(address) returns:
type WhitelistTuple = [
  isWhitelisted: boolean,
  preAssignedTokens: bigint,
  claimedTokens: bigint,
  whitelistRound: bigint // enum values come back as uint8 -> bigint
];

// getUserPurchases(address,uint8) returns:
type PurchasesTuple = [
  amounts: bigint[],
  usdcAmounts: bigint[],
  timestamps: bigint[],
  claimed: bigint[]
];

// ===== Known round ids in your enum Presale.RoundType =====
// (Seed=0, Private=1, Strategic=2, Institutional=3, Community=4)
// Adjust if your enum differs.
const ROUND_IDS = [0, 1, 2, 3, 4] as const;

// ===== Helpers =====
export function formatTokenAmount(amountRaw: bigint, decimals: number): string {
  const base = 10n ** BigInt(decimals);
  const intPart = amountRaw / base;
  const frac = amountRaw % base;
  if (frac === 0n) return intPart.toString();
  const fracStr = frac.toString().padStart(decimals, "0").replace(/0+$/, "");
  return `${intPart}.${fracStr}`;
}

async function getTokenDecimals(): Promise<number> {
  try {
    const tokenAddr = (await readContract({
      contract: presale,
      method: "token",
    })) as `0x${string}`;

    const erc20 = getContract({
      client,
      chain: sepolia,
      address: tokenAddr,
      abi: ERC20_DECIMALS_ABI,
    });

    const dec = (await readContract({
      contract: erc20,
      method: "decimals",
    })) as number | bigint;

    return typeof dec === "bigint" ? Number(dec) : dec;
  } catch {
    return 18;
  }
}

function sumBigints(arr: readonly bigint[]): bigint {
  let acc = 0n;
  for (const v of arr) acc += v;
  return acc;
}

async function getActiveRoundId(): Promise<number | undefined> {
  const now = BigInt(Math.floor(Date.now() / 1000));
  for (const id of ROUND_IDS) {
    const info = (await readContract({
      contract: presale,
      method: "rounds",
      params: [id],
    })) as RoundStructTuple;

    const isActive = info[0];
    if (!isActive) continue;

    const start = info[4];
    const end = info[5];

    const startOk = start === 0n || now >= start;
    const endOk = end === 0n || now <= end;

    if (startOk && endOk) return id;
  }
  return undefined;
}

async function getWhitelistRoundForUser(user: `0x${string}`): Promise<number | undefined> {
  try {
    const wl = (await readContract({
      contract: presale,
      method: "whitelist",
      params: [user],
    }));

    const round = Number(wl[3]);
    return Number.isFinite(round) ? round : undefined;
  } catch {
    return undefined;
  }
}

// ===== Reads =====
export async function readWhitelistClaimSummary(user: `0x${string}`): Promise<{
  claimableRaw: bigint;
  claimedRaw: bigint;
  tokenDecimals: number;
}> {
  // 1) Determine round id (prefer active, fallback to user's whitelist round)
  let roundId = await getActiveRoundId();
  roundId ??= await getWhitelistRoundForUser(user);
  if (roundId === undefined) {
    const tokenDecimals = await getTokenDecimals();
    return { claimableRaw: 0n, claimedRaw: 0n, tokenDecimals };
  }

  // 2) Read purchases for that round
  const [amounts, _usdcAmounts, _timestamps, claimed] = (await readContract({
    contract: presale,
    method: "getUserPurchases",
    params: [user, roundId],
  })) as PurchasesTuple;

  // 3) Compute totals
  const totalAmounts = sumBigints(amounts);
  const totalClaimed = sumBigints(claimed);

  const rawUnclaimed = totalAmounts - totalClaimed;
  const claimableRaw = rawUnclaimed >= 0n ? rawUnclaimed : 0n;

  // 4) Token decimals
  const tokenDecimals = await getTokenDecimals();

  return { claimableRaw, claimedRaw: totalClaimed, tokenDecimals };
}


// ===== Claim TX =====
export async function prepareWhitelistClaimTx() {
  return prepareContractCall({
    contract: presale,
    method: "claimWhitelistTokens" as const,
    params: [] as const,
  });
}
