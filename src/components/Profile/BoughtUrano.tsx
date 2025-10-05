"use client";

import { useEffect, useMemo, useState } from "react";
import { Stack, Typography, useTheme } from "@mui/material";
import { useActiveAccount } from "thirdweb/react";
import { toast } from "react-toastify";
import {
  readUserBoughtSummary,
  readActiveRoundPrice,
  fromUnits,
} from "@/utils/profile/bought";

import { formatCompactDecimalString } from "@/utils/compactDecimal";

type BoughtUranoProps = {
  /** Optional: override address; defaults to connected wallet */
  addressOverride?: `0x${string}`;
  /** Optional: title */
  title?: string;
};

function formatUsd(v: string) {
  const num = Number(v || "0");
  if (!Number.isFinite(num)) return "$0";
  if (num >= 1000) {
    return `$${num.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  }
  return `$${num.toLocaleString(undefined, { maximumFractionDigits: 4 })}`;
}

export default function BoughtUrano({
  addressOverride,
  title = "Total $URANO Bought",
}: BoughtUranoProps) {
  const theme = useTheme();
  const account = useActiveAccount(); 

  const address = useMemo(
    () => addressOverride ?? (account?.address as `0x${string}` | undefined),
    [addressOverride, account?.address]
  );

  const [loading, setLoading] = useState(false);
  const [totalTokens, setTotalTokens] = useState<string>("");
  const [totalUsd, setTotalUsd] = useState<string>("");
  const [roundPriceUsd, setRoundPriceUsd] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      try {
        // 1) Active round price (always fetch)
        const { priceRaw, usdcDecimals } = await readActiveRoundPrice();
        const priceHuman =
          priceRaw !== null ? fromUnits(priceRaw, usdcDecimals) : null;
        if (!cancelled) setRoundPriceUsd(priceHuman);

        // 2) User totals (only if address present)
        if (address) {
          const res = await readUserBoughtSummary(address);
          const totalTokensHuman = fromUnits(res.totalTokensRaw, res.tokenDecimals);
          const totalUsdHuman = fromUnits(res.totalUsdRaw, res.usdcDecimals);

          if (!cancelled) {
            setTotalTokens(totalTokensHuman);
            setTotalUsd(totalUsdHuman);
          }
        } else {
          if (!cancelled) {
            setTotalTokens("");
            setTotalUsd("");
          }
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) toast.error("Failed to load data from the contract.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [address]);

  const compactTokens = useMemo(
    () => formatCompactDecimalString(totalTokens, 2),
    [totalTokens]
  );

  return (
    <Stack
      width={{ xs: "100%", lg: "50%" }}
      flexGrow={1}
      sx={{
        backgroundColor: theme.palette.presaleCardBg.main,
        border: `1px solid ${theme.palette.headerBorder.main}`,
        borderRadius: 2,
        p: 3,
        gap: 2,
        opacity: loading ? 0.8 : 1,
      }}
    >
      <Stack direction="row" gap={2}>
        <Typography
          variant="h6"
          sx={{ fontSize: "1rem", fontWeight: 500, color: theme.palette.text.primary }}
        >
          {title}
        </Typography>
      </Stack>

      <Stack width="100%" gap={0}>
        <Typography
          variant="h6"
          sx={{
            fontSize: "1.75rem",
            fontWeight: 500,
            background: theme.palette.uranoGradient,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {address ? `${compactTokens || "0"} $URANO` : "—"}
        </Typography>

        <Stack direction="row" alignItems="center" gap={1.5}>
          <Typography
            variant="h6"
            sx={{ fontSize: "0.875rem", fontWeight: 400, color: theme.palette.text.secondary }}
          >
            {address ? <>≈ {formatUsd(totalUsd || "0")} USD</> : "—"}
          </Typography>

          <Typography
            variant="h6"
            sx={{ fontSize: "0.875rem", fontWeight: 400, color: theme.palette.text.secondary }}
          >
            |
          </Typography>

          <Typography
            variant="h6"
            sx={{ fontSize: "0.875rem", fontWeight: 400, color: theme.palette.text.secondary }}
          >
            {roundPriceUsd
              ? `Round price: $${Number(roundPriceUsd).toLocaleString(undefined, {
                  maximumFractionDigits: 6,
                })}`
              : "Round price: —"}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
