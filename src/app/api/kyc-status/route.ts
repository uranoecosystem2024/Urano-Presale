import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { createPublicClient, http, isAddress } from "viem";
import { presaleAbi } from "@/lib/abi/presale";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RPC_URL = process.env.RPC_URL!;
const PRESALE_ADDR = process.env.NEXT_PUBLIC_PRESALE_SMART_CONTRACT_ADDRESS!;

if (!RPC_URL) throw new Error("RPC_URL env var is missing");
if (!PRESALE_ADDR || !isAddress(PRESALE_ADDR)) {
  throw new Error("NEXT_PUBLIC_PRESALE_SMART_CONTRACT_ADDRESS is missing or invalid");
}

const publicClient = createPublicClient({ transport: http(RPC_URL) });

async function getPersonaWalletForAddress(
  connectedAddr: `0x${string}`
): Promise<`0x${string}` | null> {

  return null;
}

export async function GET(req: Request) {
  noStore();

  const { searchParams } = new URL(req.url);
  const addr = searchParams.get("address");

  if (!addr || !isAddress(addr)) {
    return NextResponse.json({ verified: false, error: "bad_address" }, { status: 400 });
  }

  const user = addr;

  const verified = await publicClient.readContract({
    address: PRESALE_ADDR as `0x${string}`,
    abi: presaleAbi,
    functionName: "kycVerified",
    args: [user],
  });

  const personaWallet = await getPersonaWalletForAddress(user);

  return NextResponse.json({
    verified,
    crypto_wallet_address: personaWallet,
  });
}
