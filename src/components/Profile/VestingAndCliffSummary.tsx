"use client";

import { useEffect, useState } from "react";
import { Stack, Typography, useTheme } from "@mui/material";
import { toast } from "react-toastify";
import {
  readActiveRoundVestingSummary,
  type ActiveVestingSummary,
} from "@/utils/profile/roundVesting";

export default function VestingAndCliffSummary() {
  const theme = useTheme();

  const [loading, setLoading] = useState(false);

  const [roundLabel, setRoundLabel] = useState<string>("—");
  const [tgeBps, setTgeBps] = useState<number | null>(null); // store BASIS POINTS as number
  const [cliffM, setCliffM] = useState<string>("—");
  const [durationM, setDurationM] = useState<string>("—");
  const [releaseFreq, setReleaseFreq] = useState<string>("Unknown");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      try {
        const res: ActiveVestingSummary = await readActiveRoundVestingSummary();
        if (cancelled) return;

        setRoundLabel(res.label);

        // res.tgeUnlockPct is in bps (e.g. 1200 for 12%)
        setTgeBps(res.tgeUnlockPct !== null ? Number(res.tgeUnlockPct) : null);

        setCliffM(res.cliffMonths !== null ? `${Number(res.cliffMonths)} months` : "—");
        setDurationM(res.durationMonths !== null ? `${Number(res.durationMonths)} months` : "—");
        setReleaseFreq(res.releaseFrequency);
      } catch (e) {
        console.error(e);
        if (!cancelled) toast.error("Failed to load vesting summary.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  // Pretty display: convert bps → % (e.g., 1200 → "12%")
  const tgeDisplay = tgeBps !== null ? `${(tgeBps / 100).toFixed(0)}%` : "—";

  return (
    <Stack
      width="100%"
      sx={{
        backgroundColor: theme.palette.presaleCardBg.main,
        border: `1px solid ${theme.palette.headerBorder.main}`,
        borderRadius: 2,
        p: 3,
        gap: 2,
        opacity: loading ? 0.8 : 1,
      }}
    >
      <Stack direction="row" alignItems="center" gap={1}>
        <Typography
          variant="h6"
          sx={{ fontSize: "1rem", fontWeight: 500, color: theme.palette.text.primary }}
        >
          Vesting + Cliff Summary
        </Typography>
      </Stack>

      <Stack
        width="100%"
        direction={{ xs: "column", lg: "row" }}
        alignItems="center"
        justifyContent="space-between"
        gap={{ xs: 1, lg: 2 }}
      >
        <Stack
          width={{ xs: "100%", lg: "50%" }}
          gap={1}
          sx={{
            background: theme.palette.transparentPaper.main,
            border: `1px solid ${theme.palette.headerBorder.main}`,
            borderRadius: 2,
            px: 1.5,
            py: 1.5,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontSize: "0.875rem", fontWeight: 400, color: theme.palette.text.secondary }}
          >
            TGE Release
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontSize: "1.5rem", fontWeight: 500, color: theme.palette.text.primary }}
          >
            {tgeDisplay}
          </Typography>
        </Stack>

        <Stack
          width={{ xs: "100%", lg: "50%" }}
          gap={1}
          sx={{
            background: theme.palette.transparentPaper.main,
            border: `1px solid ${theme.palette.headerBorder.main}`,
            borderRadius: 2,
            px: 1.5,
            py: 1.5,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontSize: "0.875rem", fontWeight: 400, color: theme.palette.text.secondary }}
          >
            Total Duration
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontSize: "1.5rem", fontWeight: 500, color: theme.palette.text.primary }}
          >
            {durationM}
          </Typography>
        </Stack>
      </Stack>

      <Stack
        width="100%"
        direction={{ xs: "column", lg: "row" }}
        alignItems="center"
        justifyContent="space-between"
        gap={{ xs: 1, lg: 2 }}
      >
        <Stack
          width={{ xs: "100%", lg: "50%" }}
          gap={1}
          sx={{
            background: theme.palette.transparentPaper.main,
            border: `1px solid ${theme.palette.headerBorder.main}`,
            borderRadius: 2,
            px: 1.5,
            py: 1.5,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontSize: "0.875rem", fontWeight: 400, color: theme.palette.text.secondary }}
          >
            Cliff Period
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontSize: "1.5rem", fontWeight: 500, color: theme.palette.text.primary }}
          >
            {cliffM}
          </Typography>
        </Stack>

        <Stack
          width={{ xs: "100%", lg: "50%" }}
          gap={1}
          sx={{
            background: theme.palette.transparentPaper.main,
            border: `1px solid ${theme.palette.headerBorder.main}`,
            borderRadius: 2,
            px: 1.5,
            py: 1.5,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontSize: "0.875rem", fontWeight: 400, color: theme.palette.text.secondary }}
          >
            Release Frequency
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontSize: "1.5rem", fontWeight: 500, color: theme.palette.text.primary }}
          >
            {releaseFreq}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
