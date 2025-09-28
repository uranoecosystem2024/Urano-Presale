"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Stack,
  Typography,
  TextField,
  Button,
  useTheme,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useActiveAccount } from "thirdweb/react";

import { readVestingStatus, startVestingFromDateTx } from "@/utils/admin/vesting";

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

  const [derivedEnds, setDerivedEnds] = useState<{
    seedEnd?: string;
    privateEnd?: string;
    institutionalEnd?: string;
    strategicEnd?: string;
    communityEnd?: string;
  }>({});

  const inputSx = {
    // Input surface + border behavior
    "& .MuiOutlinedInput-root": {
      background: theme.palette.background.paper,
      borderRadius: 2,
      "& fieldset": { borderColor: theme.palette.headerBorder.main },
      "&:hover fieldset": { borderColor: theme.palette.text.primary },
      "&.Mui-focused fieldset": { borderColor: theme.palette.uranoGreen1.main },
    },

    // Placeholder opacity
    "& .MuiInputBase-input::placeholder": { opacity: 0.7 },

    // Label styles
    "& .MuiInputLabel-root": {
      color: theme.palette.common.white,
      "&.Mui-focused": { color: theme.palette.common.white },
      "&.MuiInputLabel-shrink": {
        color: theme.palette.common.white,
        // Make the floating label look like it cuts the border
        px: 0.75,                   // horizontal padding for breathing room
        borderRadius: 0.5,          // soften corners
        backgroundColor: theme.palette.background.paper, // match input bg
        lineHeight: 1.2,            // avoids clipping with padding
      },
      "&.Mui-disabled": { color: theme.palette.text.disabled },
    },

    // Let the notch fit the padded label
    "& .MuiOutlinedInput-notchedOutline legend": {
      maxWidth: "60px", // override MUI's tiny animation width
    },

    // (Optional) add a little inner padding to the legend’s span for perfect notch sizing
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

  // Load global vesting status (+ derived end times)
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        const status = await readVestingStatus();
        if (cancelled) return;

        setStarted(status.started);

        const fmt = (sec: bigint) =>
          sec && sec > 0n ? dayjs(Number(sec) * 1000).format("YYYY-MM-DD HH:mm") : "—";

        setDerivedEnds({
          seedEnd: fmt(status.ends.seed),
          privateEnd: fmt(status.ends.private),
          institutionalEnd: fmt(status.ends.institutional),
          strategicEnd: fmt(status.ends.strategic),
          communityEnd: fmt(status.ends.community),
        });

        // suggest a near-future TGE if not started
        if (!status.started) {
          const defaultTge = dayjs().add(1, "hour").second(0).millisecond(0);
          setTgeISO(defaultTge.format("YYYY-MM-DDTHH:mm"));
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

  // single-field save: start vesting with provided TGE
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
      await startVestingFromDateTx(account, dayjs(tgeISO).toDate());
      toast.success("Vesting started.");
      setStarted(true);
    } catch (e) {
      console.error(e);
      toast.error(getErrorMessage(e));
    } finally {
      setActionLoading(false);
    }
  };

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
                      filter: 'invert(1) brightness(2)', // makes it white on dark backgrounds
                      opacity: 1,
                    },
                  }}
                />
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

          <Divider sx={{ my: 1.5, borderBottom: `1px solid ${theme.palette.secondary.main}` }} />

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
