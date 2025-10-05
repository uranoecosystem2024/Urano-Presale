export function formatCompactDecimalString(
    dec: string | null | undefined,
    maximumFractionDigits = 2
  ): string {
    if (!dec) return "0";
  
    const s = dec.replace(/,/g, "").trim();
    if (!s || s === "." || s === "-." || s === "-") return "0";
  
    // Try Number-based compact formatting when safe
    const n = Number(s);
    if (Number.isFinite(n) && Math.abs(n) < 1e15) {
      return new Intl.NumberFormat(undefined, {
        notation: "compact",
        maximumFractionDigits,
      }).format(n);
    }
  
    const negative = s.startsWith("-");
    const unsigned = negative ? s.slice(1) : s;
  
    // ✅ defaults ensure non-undefined
    const [intRaw = "0", fracRaw = ""] = unsigned.split(".");
  
    const int = intRaw.replace(/^0+(?=\d)/, ""); // strip leading zeros
    if (int === "0") {
      const frac = fracRaw.slice(0, maximumFractionDigits).padEnd(maximumFractionDigits, "0");
      const out = maximumFractionDigits > 0 ? `0.${frac}` : "0";
      return negative ? `-${out}` : out;
    }
  
    const len = int.length;
    const suffixes = ["", "K", "M", "B", "T", "P", "E"] as const;
    const idx = Math.min(Math.floor((len - 1) / 3), suffixes.length - 1);
  
    if (idx === 0) {
      const frac = fracRaw.slice(0, maximumFractionDigits);
      const base = maximumFractionDigits > 0 && frac ? `${int}.${frac}` : int;
      return negative ? `-${base}` : base;
    }
  
    const suffix = suffixes[idx];
    const headLen = len - idx * 3;
    const head = int.slice(0, headLen);
    const tailDigits = int.slice(headLen) + fracRaw;
    const tailFrac = maximumFractionDigits > 0 ? tailDigits.slice(0, maximumFractionDigits) : "";
    const compact = tailFrac ? `${head}.${tailFrac}${suffix}` : `${head}${suffix}`;
    return negative ? `-${compact}` : compact;
  }
  