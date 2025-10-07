export type KycInfo = {
  verified: boolean;
  crypto_wallet_address: `0x${string}` | null;
  error?: string;
};

export async function fetchKycInfo(address: `0x${string}`): Promise<KycInfo> {
  const res = await fetch(`/api/kyc-status?address=${address}`, { cache: "no-store" });
  if (!res.ok) return { verified: false, crypto_wallet_address: null, error: "http" };
  const data = (await res.json()) as KycInfo;
  return {
    verified: Boolean(data.verified),
    crypto_wallet_address: data.crypto_wallet_address ?? null,
    error: data.error,
  };
}

export async function fetchKycStatus(address: `0x${string}`): Promise<boolean> {
  const { verified } = await fetchKycInfo(address);
  return verified;
}

export async function fetchKycAndCheckMismatch(
  connected: `0x${string}`
): Promise<{ verified: boolean; personaWallet: `0x${string}` | null; mismatch: boolean }> {
  const info = await fetchKycInfo(connected);
  const persona = info.crypto_wallet_address;
  const mismatch =
    !!persona && persona.toLowerCase() !== connected.toLowerCase();
  return { verified: info.verified, personaWallet: persona, mismatch };
}

export async function waitForKycStatus(
  address: `0x${string}`,
  opts: { tries?: number; delayMs?: number } = {}
): Promise<boolean> {
  const tries = opts.tries ?? 12;
  const delayMs = opts.delayMs ?? 2500;

  for (let i = 0; i < tries; i++) {
    try {
      const { verified } = await fetchKycInfo(address);
      if (verified) return true;
    } catch {
      // ignore and keep polling
    }
    await new Promise((r) => setTimeout(r, delayMs));
  }
  return false;
}