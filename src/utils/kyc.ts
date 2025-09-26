// /utils/kyc.ts
export async function fetchKycStatus(address: `0x${string}`): Promise<boolean> {
    const res = await fetch(`/api/kyc-status?address=${address}`, { cache: "no-store" });
    if (!res.ok) return false;
    const data = (await res.json()) as { verified?: boolean };
    return Boolean(data?.verified);
  }
  
  export async function waitForKycStatus(
    address: `0x${string}`,
    opts: { tries?: number; delayMs?: number } = {}
  ): Promise<boolean> {
    const tries = opts.tries ?? 12;
    const delayMs = opts.delayMs ?? 2500;
  
    for (let i = 0; i < tries; i++) {
      try {
        if (await fetchKycStatus(address)) return true;
      } catch {
        // ignore and keep polling
      }
      await new Promise((r) => setTimeout(r, delayMs));
    }
    return false;
  }
  