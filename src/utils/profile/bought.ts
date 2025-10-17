import { getContract, readContract } from "thirdweb";
import { client } from "@/lib/thirdwebClient";
import { sepolia } from "thirdweb/chains";
import { presaleAbi } from "@/lib/abi/presale";

/** Round keys mapped to enum indices used on-chain */
export type RoundKey = "strategic" | "seed" | "private" | "institutional" | "community";
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

const ERC20_DECIMALS_ABI = [
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

/** BigInt → decimal string respecting token decimals */
export function fromUnits(amount: bigint, decimals: number): string {
  const base = 10n ** BigInt(decimals);
  const intPart = amount / base;
  const frac = amount % base;
  if (frac === 0n) return intPart.toString();
  const fracStr = frac.toString().padStart(decimals, "0").replace(/0+$/, "");
  return `${intPart}.${fracStr}`;
}

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
    return 6;
  }
}

/** Shape returned by get*RoundInfo */
type RoundInfoTuple = readonly [
  boolean,  // isActive
  bigint,   // tokenPrice
  bigint,   // minPurchase
  bigint,   // totalRaised
  bigint,   // startTime
  bigint,   // endTime
  bigint,   // totalTokensSold
  bigint,   // maxTokensToSell
  boolean,  // isPublic
  bigint,   // vestingEndTime
  bigint,   // cliffPeriodMonths
  bigint,   // vestingDurationMonths
  bigint    // tgeUnlockPercentage (bps)
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

/** Active round + price helper (falls back to null if none active) */
export async function readActiveRoundPrice(): Promise<{
  round: RoundKey | null;
  priceRaw: bigint | null;
  usdcDecimals: number;
}> {
  const rounds = ["seed", "private", "institutional", "strategic", "community"] as const;
  const infos = await Promise.all(rounds.map((r) => readRoundInfoByKey(r)));
  const idx = infos.findIndex((info) => info[0] === true);
  const usdcDecimals = await getUsdcDecimals();

  if (idx === -1) {
    return { round: null, priceRaw: null, usdcDecimals };
  }

  const info = infos[idx]!;
  const priceRaw = info[1];
  const round = rounds[idx]! as RoundKey;
  return { round, priceRaw, usdcDecimals };
}

/**
 * Returns totals for the profile cards.
 * IMPORTANT: includes whitelist countervalue for Strategic/Seed by pricing preAssignedTokens
 * with the corresponding round price.
 */
export async function readUserBoughtSummary(user: `0x${string}`): Promise<{
  totalTokensRaw: bigint;
  totalUsdRaw: bigint;
  tokenDecimals: number;
  usdcDecimals: number;
  /** If user participated in exactly one round (incl. whitelist), expose that round's price. */
  singleRoundPriceRaw: bigint | null;
}> {
  const rounds: RoundKey[] = ["seed", "private", "institutional", "strategic", "community"];
  const [tokenDecimals, usdcDecimals] = await Promise.all([getTokenDecimals(), getUsdcDecimals()]);

  let totalTokensRaw = 0n;
  let totalUsdRaw = 0n;
  const nonZeroRounds: RoundKey[] = [];

  // Sum on-chain purchases (non-whitelist)
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

  // Include whitelist countervalue for Strategic/Seed
  const wl = (await readContract({
    contract: presale,
    method: "whitelist",
    params: [user],
  })) as [boolean, bigint, bigint, number]; // isWhitelisted, preAssigned, claimed, whitelistRound(uint8)

  let whitelistPriceRaw: bigint | null = null;
  if (wl[0] && wl[1] > 0n) {
    const preAssignedTokens = wl[1];
    totalTokensRaw += preAssignedTokens;

    const wlRound = (["strategic","seed","private","institutional","community"] as const)[wl[3]]!;
    const wlInfo = await readRoundInfoByKey(wlRound);
    whitelistPriceRaw = wlInfo[1];

    // preAssigned(18) * price(USDC 6) / 1e18 = USDC raw
    totalUsdRaw += (preAssignedTokens * whitelistPriceRaw) / (10n ** 18n);

    if (!nonZeroRounds.includes(wlRound)) nonZeroRounds.push(wlRound);
  }

  // Determine "single round price" if user participated in exactly one round (incl. whitelist)
  let singleRoundPriceRaw: bigint | null = null;
  if (nonZeroRounds.length === 1) {
    const info = await readRoundInfoByKey(nonZeroRounds[0]!);
    singleRoundPriceRaw = info[1];
  } else if (nonZeroRounds.length === 0 && whitelistPriceRaw) {
    singleRoundPriceRaw = whitelistPriceRaw;
  }

  return {
    totalTokensRaw,
    totalUsdRaw,
    tokenDecimals,
    usdcDecimals,
    singleRoundPriceRaw,
  };
}
