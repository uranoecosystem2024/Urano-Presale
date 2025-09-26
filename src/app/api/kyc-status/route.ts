import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { createPublicClient, http, isAddress } from "viem";
import { presaleAbi } from "@/lib/abi/presale";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RPC_URL = process.env.RPC_URL;
const PRESALE_ADDR_STR = process.env.NEXT_PUBLIC_PRESALE_SMART_CONTRACT_ADDRESS;

if (!RPC_URL) {
  throw new Error("RPC_URL env var is missing");
}
if (!PRESALE_ADDR_STR || !isAddress(PRESALE_ADDR_STR)) {
  throw new Error("NEXT_PUBLIC_PRESALE_SMART_CONTRACT_ADDRESS is missing or invalid");
}

// Both of these are now strongly typed — no any/unsafe.
const publicClient = createPublicClient({ transport: http(RPC_URL) });
const PRESALE_ADDR = PRESALE_ADDR_STR;

export async function GET(req: Request) {
  noStore();

  const { searchParams } = new URL(req.url);
  const addr = searchParams.get("address");

  if (!addr || !isAddress(addr)) {
    return NextResponse.json({ verified: false, error: "bad_address" }, { status: 400 });
  }

  const user = addr;

  // viem infers the return type from the ABI: boolean
  const verified = await publicClient.readContract({
    address: PRESALE_ADDR,
    abi: presaleAbi,
    functionName: "kycVerified",
    args: [user],
  });

  return NextResponse.json({ verified });
}
