"use client";

import { useEffect, useState } from "react";
import { Stack, Typography, useTheme } from "@mui/material";
import { readActiveRoundSummary } from "@/utils/profile/round";
import { fromUnits } from "@/utils/profile/bought";

type ParticipationRoundProps = {
  title?: string;
};

export default function ParticipationRound({
  title = "Participation Round",
}: ParticipationRoundProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [priceHuman, setPriceHuman] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const { label, tokenPriceRaw, usdcDecimals } =
          await readActiveRoundSummary();
        const human =
          tokenPriceRaw !== null ? fromUnits(tokenPriceRaw, usdcDecimals) : null;

        if (!cancelled) {
          setLabel(label);
          setPriceHuman(human);
        }
      } catch (e) {
        console.error("Failed to read active round:", e);
        if (!cancelled) {
          setLabel(null);
          setPriceHuman(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Stack
      width={{ xs: "100%", lg: "50%" }}
      flexGrow={1}
      sx={{
        backgroundColor: theme.palette.presaleCardBg.main,
        border: `1px solid ${theme.palette.headerBorder.main}`,
        borderRadius: 2,
        padding: 3,
        gap: 2,
        opacity: loading ? 0.8 : 1,
      }}
    >
      <Stack direction="row" gap={2}>
        <Typography
          variant="h6"
          sx={{
            fontSize: "1rem",
            fontWeight: 500,
            color: theme.palette.text.primary,
          }}
        >
          {title}
        </Typography>
      </Stack>

      <Stack
        width="100%"
        direction="row"
        alignItems="center"
        justifyContent="center"
        gap={0.5}
        sx={{
          background: theme.palette.transparentPaper.main,
          border: `1px solid ${theme.palette.headerBorder.main}`,
          borderRadius: 2,
          paddingX: 1.5,
          paddingY: 1,
          overflow: "hidden",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: "0.875rem",
            fontWeight: 300,
            color: theme.palette.text.primary,
          }}
        >
          {label ? `${label} round` : "No active round"}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            fontSize: "0.875rem",
            fontWeight: 300,
            color: theme.palette.uranoGreen1.main,
          }}
        >
          {priceHuman ? `$${Number(priceHuman).toLocaleString(undefined, { maximumFractionDigits: 6 })} per token` : "—"}
        </Typography>
      </Stack>
    </Stack>
  );
}
