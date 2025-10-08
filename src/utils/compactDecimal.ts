export function formatCompactDecimalString(
  dec: string | null | undefined,
  maximumFractionDigits = 2
): string {
  if (!dec) return "0";
  const s = dec.replace(/,/g, "").trim();
  if (!s || s === "." || s === "-." || s === "-") return "0";

  const negative = s.startsWith("-");
  const unsigned = negative ? s.slice(1) : s;

  const parts = unsigned.split(".");
  let intRaw = (parts[0] ?? "0").replace(/^0+(?=\d)/, "") || "0";
  const fracRaw = parts[1] ?? "";

  const max = Math.max(0, maximumFractionDigits);
  let frac = fracRaw;

  if (max === 0) {
    if (frac.length > 0) {
      const first = frac.charCodeAt(0) - 48;
      if (first >= 5) {
        const carryInt = intRaw.split("");
        for (let i = carryInt.length - 1; i >= 0; i--) {
          const ch = carryInt[i]!;
          const d = ch.charCodeAt(0) - 48 + 1;
          if (d === 10) {
            carryInt[i] = "0";
            if (i === 0) carryInt.unshift("1");
          } else {
            carryInt[i] = String.fromCharCode(48 + d);
            break;
          }
        }
        intRaw = carryInt.join("");
      }
    }
    frac = "";
  } else if (frac.length > max) {
    const keep = frac.slice(0, max).split("");
    const next = frac.charCodeAt(max) - 48;
    if (next >= 5) {
      let carry = 1;
      for (let i = keep.length - 1; i >= 0; i--) {
        const ch = keep[i]!;
        const d = ch.charCodeAt(0) - 48 + carry;
        if (d >= 10) {
          keep[i] = "0";
          carry = 1;
        } else {
          keep[i] = String.fromCharCode(48 + d);
          carry = 0;
          break;
        }
      }
      if (carry === 1) {
        const carryInt = intRaw.split("");
        for (let i = carryInt.length - 1; i >= 0; i--) {
          const ch = carryInt[i]!;
          const d = ch.charCodeAt(0) - 48 + 1;
          if (d === 10) {
            carryInt[i] = "0";
            if (i === 0) carryInt.unshift("1");
          } else {
            carryInt[i] = String.fromCharCode(48 + d);
            break;
          }
        }
        intRaw = carryInt.join("");
        frac = "0".repeat(max);
      } else {
        frac = keep.join("");
      }
    } else {
      frac = keep.join("");
    }
  }

  if (frac) frac = frac.replace(/0+$/, "");

  const intWithCommas = intRaw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const out = frac ? `${intWithCommas}.${frac}` : intWithCommas;
  return negative ? `-${out}` : out;
}
