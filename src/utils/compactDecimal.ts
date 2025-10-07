// utils/compactDecimal.ts
export function formatCompactDecimalString(
  dec: string | null | undefined,
  maximumFractionDigits = 2,
  opts?: { preventUnitCarry?: boolean }
): string {
  const preventUnitCarry = opts?.preventUnitCarry ?? false;

  if (!dec) return "0";
  const s = dec.replace(/,/g, "").trim();
  if (!s || s === "." || s === "-." || s === "-") return "0";

  const negative = s.startsWith("-");
  const unsigned = negative ? s.slice(1) : s;

  // If we DON'T care about boundary carry, we can safely use Number/Intl for small values.
  if (!preventUnitCarry) {
    const n = Number(unsigned);
    if (Number.isFinite(n) && Math.abs(n) < 1e15) {
      return (negative ? "-" : "") + new Intl.NumberFormat(undefined, {
        notation: "compact",
        maximumFractionDigits,
      }).format(n).replace(/\u00A0/g, "").toLocaleUpperCase();
    }
  }

  // String-based path (no unit carry)
  const [intRaw = "0", fracRaw = ""] = unsigned.split(".");
  const int = intRaw.replace(/^0+(?=\d)/, "") || "0";

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

  const ndp = Math.max(0, maximumFractionDigits);

  // Build rounded fraction with carry detection
  let needed = tailDigits.slice(0, ndp + 1).padEnd(ndp + 1, "0");
  let carry = 0;

  if (ndp > 0 && needed.length > 0) {
    const last = needed.charCodeAt(needed.length - 1) - 48; // next digit
    const doRoundUp = last >= 5;
    needed = needed.slice(0, -1); // digits we keep (to round)

    if (doRoundUp) {
      const fArr = needed.split("");
      for (let i = fArr.length - 1; i >= 0; i--) {
        const ch = fArr[i];
        const d = (ch ? ch.charCodeAt(0) - 48 : 0) + 1;
        if (d >= 10) {
          fArr[i] = "0";
          if (i === 0) carry = 1; // would spill into head (unit boundary)
        } else {
          fArr[i] = String.fromCharCode(48 + d);
          carry = 0;
          break;
        }
      }
      needed = fArr.join("");
    }
  } else {
    needed = needed.slice(0, ndp);
  }

  // If rounding would cross the next unit (e.g., 19.999..M -> 20.00M), clamp instead
  if (carry === 1 && preventUnitCarry) {
    const clamped = ndp > 0 ? `${head}.${"9".repeat(ndp)}${suffix}` : `${head}${suffix}`;
    return negative ? `-${clamped}` : clamped;
  }

  const compact = ndp > 0 && needed ? `${head}.${needed}${suffix}` : `${head}${suffix}`;
  return negative ? `-${compact}` : compact;
}
