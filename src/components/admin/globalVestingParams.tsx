"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Stack,
  Typography,
  TextField,
  Button,
  useTheme,
  Divider,
  FormHelperText,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useActiveAccount } from "thirdweb/react";

import {
  readVestingStatus,
  startVestingFromDateTx,
  readEarliestAllowedTgeSec,
} from "@/utils/admin/vesting";

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "Unknown error";
  }
}

export type GlobalVestingParamsProps = {
  title?: string;
  subtitle?: string;
  disabled?: boolean;
};

export default function GlobalVestingVestingParams({
  title = "Vesting",
  subtitle = "Set the TGE date and start vesting (applies globally).",
  disabled = false,
}: GlobalVestingParamsProps) {
  const theme = useTheme();
  const account = useActiveAccount();

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [started, setStarted] = useState<boolean | null>(null);
  const [tgeISO, setTgeISO] = useState<string>("");

  // earliest allowed TGE (max(endTime) across rounds), seconds since epoch
  const [earliestAllowedSec, setEarliestAllowedSec] = useState<bigint>(0n);

  const [derivedEnds, setDerivedEnds] = useState<{
    seedEnd?: string;
    privateEnd?: string;
    institutionalEnd?: string;
    strategicEnd?: string;
    communityEnd?: string;
  }>({});

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      background: theme.palette.background.paper,
      borderRadius: 2,
      "& fieldset": { borderColor: theme.palette.headerBorder.main },
      "&:hover fieldset": { borderColor: theme.palette.text.primary },
      "&.Mui-focused fieldset": { borderColor: theme.palette.uranoGreen1.main },
    },
    "& .MuiInputBase-input::placeholder": { opacity: 0.7 },
    "& .MuiInputLabel-root": {
      color: theme.palette.common.white,
      "&.Mui-focused": { color: theme.palette.common.white },
      "&.MuiInputLabel-shrink": {
        color: theme.palette.common.white,
        px: 0.75,
        borderRadius: 0.5,
        backgroundColor: theme.palette.background.paper,
        lineHeight: 1.2,
      },
      "&.Mui-disabled": { color: theme.palette.text.disabled },
    },
    "& .MuiOutlinedInput-notchedOutline legend": {
      maxWidth: "60px",
    },
    "& .MuiOutlinedInput-notchedOutline legend > span": {
      paddingLeft: 6,
      paddingRight: 6,
    },
  } as const;

  const actionBtnSx = useMemo(
    () =>
      ({
        textTransform: "none",
        borderRadius: 2,
        px: 3,
        py: 1.7,
        backgroundColor: theme.palette.secondary.main,
        border: `1px solid ${theme.palette.headerBorder.main}`,
        color: theme.palette.text.primary,
        "&:hover": {
          borderColor: theme.palette.text.primary,
          background: theme.palette.transparentPaper.main,
        },
      } as const),
    [theme]
  );

  const fmtSec = (sec?: bigint) =>
    sec && sec > 0n ? dayjs(Number(sec) * 1000).format("YYYY-MM-DD HH:mm") : "—";

  // Load global vesting status, derived ends, and earliest allowed TGE
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        const [status, earliest] = await Promise.all([
          readVestingStatus(),
          readEarliestAllowedTgeSec(),
        ]);
        if (cancelled) return;

        setStarted(status.started);
        setEarliestAllowedSec(earliest);

        setDerivedEnds({
          seedEnd: fmtSec(status.ends.seed),
          privateEnd: fmtSec(status.ends.private),
          institutionalEnd: fmtSec(status.ends.institutional),
          strategicEnd: fmtSec(status.ends.strategic),
          communityEnd: fmtSec(status.ends.community),
        });

        // suggest a near-future TGE (>= earliest allowed, rounded to minute)
        if (!status.started) {
          const minMillis = Number(earliest > 0n ? earliest * 1000n : 0n);
          const oneHourAhead = dayjs().add(1, "hour");
          const suggested = dayjs(Math.max(oneHourAhead.valueOf(), minMillis))
            .second(0)
            .millisecond(0);
          setTgeISO(suggested.format("YYYY-MM-DDTHH:mm"));
        }
      } catch (e) {
        console.error("Failed to read vesting status:", e);
        toast.error("Failed to read vesting status");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  // Save: start vesting with provided (or adjusted) TGE
  const saveTgeAndStart = async () => {
    if (disabled || started) return;
    if (!account) {
      toast.error("No wallet connected. Please connect an authorized wallet.");
      return;
    }
    if (!tgeISO) {
      toast.error("Please set a valid TGE date/time.");
      return;
    }
    try {
      setActionLoading(true);

      // chosen time in seconds
      const chosenSec = BigInt(Math.floor(dayjs(tgeISO).valueOf() / 1000));
      // enforce earliest allowed (contract requires TGE > strategic end, we use max across rounds)
      const minAllowed = earliestAllowedSec > 0n ? earliestAllowedSec : 0n;
      const adjustedSec = chosenSec <= minAllowed ? minAllowed + 1n : chosenSec;

      if (adjustedSec !== chosenSec) {
        const adjStr = dayjs(Number(adjustedSec) * 1000).format("YYYY-MM-DD HH:mm");
        toast.info(`TGE moved to ${adjStr} to satisfy sale end constraints.`);
      }

      await startVestingFromDateTx(account, new Date(Number(adjustedSec) * 1000));
      toast.success("Vesting started.");
      setStarted(true);
    } catch (e) {
      console.error(e);
      toast.error(getErrorMessage(e));
    } finally {
      setActionLoading(false);
    }
  };

  const earliestAllowedStr =
    earliestAllowedSec > 0n
      ? dayjs(Number(earliestAllowedSec) * 1000).format("YYYY-MM-DD HH:mm")
      : null;

  return (
    <Stack gap={2} width="100%">
      <Stack gap={0.5}>
        <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
          {started ? "Vesting is active." : subtitle}
        </Typography>
      </Stack>

      {loading ? (
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
          Loading vesting status…
        </Typography>
      ) : (
        <>
          {!started && (
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={{ xs: 12, md: 9 }}>
                <TextField
                  fullWidth
                  label="TGE Date & Time"
                  type="datetime-local"
                  value={tgeISO}
                  onChange={(e) => setTgeISO(e.target.value)}
                  disabled={disabled || actionLoading}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    ...inputSx,
                    '& input[type="datetime-local"]::-webkit-calendar-picker-indicator': {
                      filter: "invert(1) brightness(2)",
                      opacity: 1,
                    },
                  }}
                />
                {earliestAllowedStr && (
                  <FormHelperText sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
                    Earliest allowed TGE: {earliestAllowedStr} (must be after all sale end times)
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Button
                  fullWidth
                  onClick={saveTgeAndStart}
                  disabled={disabled || actionLoading || !tgeISO}
                  sx={actionBtnSx}
                >
                  {actionLoading ? "Saving…" : "Save & Start"}
                </Button>
              </Grid>
            </Grid>
          )}

          <Divider
            sx={{ my: 1.5, borderBottom: `1px solid ${theme.palette.secondary.main}` }}
          />

          {/* Read-only derived end times */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Seed vesting end"
                value={derivedEnds.seedEnd ?? "—"}
                InputProps={{ readOnly: true }}
                InputLabelProps={{ shrink: true }}
                sx={inputSx}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Private vesting end"
                value={derivedEnds.privateEnd ?? "—"}
                InputProps={{ readOnly: true }}
                InputLabelProps={{ shrink: true }}
                sx={inputSx}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Institutional vesting end"
                value={derivedEnds.institutionalEnd ?? "—"}
                InputProps={{ readOnly: true }}
                InputLabelProps={{ shrink: true }}
                sx={inputSx}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Strategic vesting end"
                value={derivedEnds.strategicEnd ?? "—"}
                InputProps={{ readOnly: true }}
                InputLabelProps={{ shrink: true }}
                sx={inputSx}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Community vesting end"
                value={derivedEnds.communityEnd ?? "—"}
                InputProps={{ readOnly: true }}
                InputLabelProps={{ shrink: true }}
                sx={inputSx}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Stack>
  );
}
