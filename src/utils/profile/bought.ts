// utils/profile/bought.ts
import { getContract, readContract } from "thirdweb";
import { client } from "@/lib/thirdwebClient";
import { sepolia } from "thirdweb/chains";
import { presaleAbi } from "@/lib/abi/presale";

/** All supported rounds (ABI order assumed) */
export type RoundKey = "seed" | "private" | "institutional" | "strategic" | "community";
export const ROUND_ENUM_INDEX: Record<RoundKey, number> = {
  seed: 0,
  private: 1,
  institutional: 2,
  strategic: 3,
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

const ERC20_DECIMALS_ABI = [
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

/* ------------------------ Conversions ------------------------ */

export function fromUnits(amount: bigint, decimals: number): string {
  const base = 10n ** BigInt(decimals);
  const intPart = amount / base;
  const frac = amount % base;
  if (frac === 0n) return intPart.toString();
  const fracStr = frac.toString().padStart(decimals, "0").replace(/0+$/, "");
  return `${intPart}.${fracStr}`;
}

/* ------------------------ Token metadata --------------------- */

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
      abi: ERC20_DECIMALS_ABI,
    });

    const dec = (await readContract({ contract: erc20, method: "decimals" })) as number | bigint;
    return typeof dec === "bigint" ? Number(dec) : dec;
  } catch {
    return 18;
  }
}

export async function getUsdcDecimals(): Promise<number> {
  try {
    const usdcAddr = (await readContract({
      contract: presale,
      method: "usdc",
    })) as `0x${string}`;

    const erc20 = getContract({
      client,
      chain: sepolia,
      address: usdcAddr,
      abi: ERC20_DECIMALS_ABI,
    });

    const dec = (await readContract({ contract: erc20, method: "decimals" })) as number | bigint;
    return typeof dec === "bigint" ? Number(dec) : dec;
  } catch {
    return 6; // typical USDC
  }
}

/* ------------------------ Round reads ------------------------ */

type RoundInfoTuple = readonly [
  boolean,  // 0 isActive_
  bigint,   // 1 tokenPrice_
  bigint,   // 2 minPurchase_
  bigint,   // 3 totalRaised_
  bigint,   // 4 startTime_
  bigint,   // 5 endTime_
  bigint,   // 6 totalTokensSold_
  bigint,   // 7 maxTokensToSell_
  boolean,  // 8 isPublic_
  bigint,   // 9 vestingEndTime_
  bigint,   // 10 cliffPeriodMonths_
  bigint,   // 11 vestingDurationMonths_
  bigint    // 12 tgeUnlockPercentage_
];

export async function readRoundInfoByKey(key: RoundKey): Promise<RoundInfoTuple> {
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
  }
}

/**
 * Read the active round (first active found) and return its price (raw) + USDC decimals.
 * If multiple rounds are active (shouldn’t happen with your “singleActive” admin UX),
 * this returns the first one in the order below.
 */
export async function readActiveRoundPrice(): Promise<{
    round: RoundKey | null;
    priceRaw: bigint | null;
    usdcDecimals: number;
  }> {
    const rounds = ["seed", "private", "institutional", "strategic", "community"] as const;
  
    const infos = (await Promise.all(rounds.map((r) => readRoundInfoByKey(r))));
  
    const idx = infos.findIndex((info) => info[0] === true);
  
    const usdcDecimals = await getUsdcDecimals();
  
    if (idx === -1) {
      return { round: null, priceRaw: null, usdcDecimals };
    }
  
    const info = infos[idx]!;                // not undefined thanks to the guard above
    const priceRaw = info[1];
    const round = rounds[idx]! as RoundKey;  // assert not undefined + align to RoundKey
  
    return { round, priceRaw, usdcDecimals };
  }
  
  

/* ------------------------ User totals ------------------------ */

export async function readUserBoughtSummary(user: `0x${string}`): Promise<{
  totalTokensRaw: bigint;
  totalUsdRaw: bigint;
  tokenDecimals: number;
  usdcDecimals: number;
  singleRoundPriceRaw: bigint | null; // kept for compatibility, not used by UI anymore
}> {
  const rounds: RoundKey[] = ["seed", "private", "institutional", "strategic", "community"];
  const [tokenDecimals, usdcDecimals] = await Promise.all([getTokenDecimals(), getUsdcDecimals()]);

  let totalTokensRaw = 0n;
  let totalUsdRaw = 0n;
  const nonZeroRounds: RoundKey[] = [];

  for (const rk of rounds) {
    const [amounts] = (await readContract({
      contract: presale,
      method: "getUserPurchases",
      params: [user, ROUND_ENUM_INDEX[rk]],
    })) as readonly [bigint[], bigint[], bigint[], bigint[]];

    const roundTokens = amounts.reduce((acc, v) => acc + v, 0n);
    totalTokensRaw += roundTokens;

    const spent = (await readContract({
      contract: presale,
      method: "userTotalSpent",
      params: [user, ROUND_ENUM_INDEX[rk]],
    }));

    totalUsdRaw += spent;
    if (roundTokens > 0n || spent > 0n) nonZeroRounds.push(rk);
  }

  // (legacy) If exactly one round had purchases, read its price
  let singleRoundPriceRaw: bigint | null = null;
  if (nonZeroRounds.length === 1) {
    const info = await readRoundInfoByKey(nonZeroRounds[0]!);
    singleRoundPriceRaw = info[1];
  }

  return {
    totalTokensRaw,
    totalUsdRaw,
    tokenDecimals,
    usdcDecimals,
    singleRoundPriceRaw,
  };
}
