"use client";

import { memo, useEffect, useMemo, useState, Fragment } from "react";
import {
  Stack,
  Typography,
  Switch,
  Button,
  Divider,
  Chip,
  useTheme,
  Collapse,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
  Box,
  Popover,
  InputAdornment,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // ✅ Grid2 so `size={{ xs, md }}` works
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import TimerRoundedIcon from "@mui/icons-material/TimerRounded";

// date & time pickers
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { MultiSectionDigitalClock } from "@mui/x-date-pickers/MultiSectionDigitalClock";
import dayjs, { type Dayjs } from "dayjs";

import { fetchRoundItems } from "@/utils/admin/rounds";
import {
  toggleRoundActive,
  toggleRoundActiveExclusive,
  type RoundKey,
} from "@/utils/admin/roundsWrite";

import { useActiveAccount } from "thirdweb/react";
import { toast } from "react-toastify";

export type RoundStatusItem = {
  id: RoundKey; // "private" | "institutional" | "community"
  title: string;
  active: boolean;
};

export type RoundStatusManagementProps = {
  rounds?: RoundStatusItem[]; // optional; if omitted we load from chain
  singleActive?: boolean;
  disabled?: boolean;
  onChange?: (next: RoundStatusItem[], changedId: string) => void;
  onShowMore?: (id: string) => void;
  title?: string;
  subtitle?: string;
};

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "Unknown error";
  }
}

const RoundStatusManagement = memo(function RoundStatusManagement({
  rounds,
  singleActive = true,
  disabled = false,
  onChange,
  onShowMore,
  title = "Round Status Management",
  subtitle = "Activate or deactivate presale rounds",
}: RoundStatusManagementProps) {
  const theme = useTheme();
  const account = useActiveAccount();

  const [items, setItems] = useState<RoundStatusItem[]>(rounds ?? []);
  const [loading, setLoading] = useState<boolean>(!rounds);
  const [txLoadingById, setTxLoadingById] = useState<Record<string, boolean>>({});

  // form state (UI placeholders; not wired on-chain in this contract)
  const [tgePct, setTgePct] = useState("");
  const [cliffDays, setCliffDays] = useState("");
  const [durationMonths, setDurationMonths] = useState("");
  const [tgeDate, setTgeDate] = useState("");
  const [tgeTime, setTgeTime] = useState("");
  const [seedRound, setSeedRound] = useState("");
  const [strategicRound, setStrategicRound] = useState("");
  const [institutionalRound, setInstitutionalRound] = useState("");
  const [address, setAddress] = useState("");
  const [roundId, setRoundId] = useState<RoundKey | "">(""); // <- select value
  const [maxAllocation, setMaxAllocation] = useState("");

  // date/time popovers
  const [datePopOpen, setDatePopOpen] = useState(false);
  const [dateAnchor, setDateAnchor] = useState<HTMLElement | null>(null);
  const [timePopOpen, setTimePopOpen] = useState(false);
  const [timeAnchor, setTimeAnchor] = useState<HTMLElement | null>(null);

  const openDate = (el: HTMLElement) => {
    if (!disabled) {
      setDateAnchor(el);
      setDatePopOpen(true);
    }
  };
  const closeDate = () => {
    setDatePopOpen(false);
    setDateAnchor(null);
  };
  const parseTgeDate = (): Dayjs | null => {
    const d = dayjs(tgeDate, "DD.MM.YY", true);
    return d.isValid() ? d : null;
  };

  const parseTgeTime = (): Dayjs | null => {
    const t = dayjs(tgeTime, "HH.mm", true);
    return t.isValid() ? t : null;
  };
  const [tempTime, setTempTime] = useState<Dayjs>(parseTgeTime() ?? dayjs());
  const openTime = (el: HTMLElement) => {
    if (!disabled) {
      setTimeAnchor(el);
      setTempTime(parseTgeTime() ?? dayjs());
      setTimePopOpen(true);
    }
  };
  const closeTime = () => {
    setTimePopOpen(false);
    setTimeAnchor(null);
  };

  // which row is expanded
  const [expandedId, setExpandedId] = useState<RoundKey | null>(null);

  // load rounds (from prop or chain)
  useEffect(() => {
    if (rounds) {
      setItems(rounds);
      setLoading(false);
      return;
    }
    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        const onchain = await fetchRoundItems();
        if (!cancelled) setItems(onchain);
      } catch (e: unknown) {
        console.error("Failed to load rounds from chain:", e);
        toast.error("Failed to load rounds from chain");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [rounds]);

  // first active computation
  const firstActive = useMemo(() => {
    const idx = items.findIndex((r) => r.active);
    return idx >= 0 ? { id: items[idx]?.id ?? null, index: idx } : null;
  }, [items]);

  // collapse if needed
  useEffect(() => {
    if (!firstActive || expandedId !== firstActive.id) setExpandedId(null);
  }, [firstActive, expandedId]);

  const setRowTxLoading = (id: string, val: boolean) =>
    setTxLoadingById((prev) => ({ ...prev, [id]: val }));

  const anyRowBusy = useMemo(
    () => Object.values(txLoadingById).some(Boolean),
    [txLoadingById]
  );

  const handleToggle = async (id: RoundKey, nextVal: boolean) => {
    if (disabled) return;

    if (!account) {
      toast.error("No wallet connected. Please connect an authorized wallet.");
      return;
    }

    if (txLoadingById[id] || anyRowBusy) return;

    try {
      setRowTxLoading(id, true);

      if (singleActive && nextVal) {
        // ✅ one-by-one deactivate others handled inside roundsWrite
        const res = await toggleRoundActiveExclusive(account, id, true);
        // Re-sync from chain for correctness
        try {
          const latest = await fetchRoundItems();
          setItems(latest);
          onChange?.(latest, id);
        } catch {
          // Fallback optimistic UI
          setItems((prev) =>
            prev.map((r) =>
              r.id === id ? { ...r, active: true } : { ...r, active: false }
            )
          );
          onChange?.(
            items.map((r) =>
              r.id === id ? { ...r, active: true } : { ...r, active: false }
            ),
            id
          );
        }

        toast.success(
          `Activated ${id} round${res.activated
            ? ` (${Number(res.activated.startTimeUsed)} → ${Number(res.activated.endTimeUsed)})`
            : ""
          }.`
        );
        if (res.deactivated.length > 0) {
          toast.info(`Deactivated ${res.deactivated.map((d) => d.round).join(", ")}.`);
        }
        return;
      }

      // Default path: either deactivating, or multi-active allowed
      const result = await toggleRoundActive(account, id, nextVal);

      try {
        const latest = await fetchRoundItems();
        setItems(latest);
        onChange?.(latest, id);
      } catch {
        // Optimistic fallback
        setItems((prev) => {
          let next = prev.map((r) => (r.id === id ? { ...r, active: nextVal } : r));
          if (singleActive && nextVal) {
            next = next.map((r) => (r.id !== id ? { ...r, active: false } : r));
          }
          onChange?.(next, id);
          return next;
        });
      }

      toast.success(
        nextVal
          ? `${id} round activated. Window: ${Number(result.startTimeUsed)} → ${Number(result.endTimeUsed)}`
          : `${id} round deactivated.`
      );
    } catch (e: unknown) {
      console.error(e);
      toast.error(getErrorMessage(e));
    } finally {
      setRowTxLoading(id, false);
    }
  };


  const handleShowMore = (id: RoundKey) => {
    if (disabled) return;
    if (firstActive?.id !== id) return; // only first active can open
    setExpandedId((prev) => (prev === id ? null : id));
    onShowMore?.(id);
  };

  const switchSx = {
    "& .MuiSwitch-track": { backgroundColor: theme.palette.grey[700], opacity: 1 },
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: "rgba(42, 112, 100, 1)",
      "& + .MuiSwitch-track": { backgroundColor: "rgba(42, 112, 100, 1)", opacity: 1 },
      "& .MuiSwitch-thumb": {
        backgroundColor: "rgba(102, 212, 194, 1)",
        filter:
          "drop-shadow(0 2px 1px rgba(0, 0, 0, 0.20)) drop-shadow(0 1px 1px rgba(0, 0, 0, 0.14)) drop-shadow(0 1px 3px rgba(0, 0, 0, 0.12))",
        boxShadow: "0 0px 0.5px 8px rgba(102, 212, 194, 0.1)",
      },
    },
  } as const;

  const cardBaseSx = {
    backgroundColor: theme.palette.presaleCardBg.main,
    border: `1px solid ${theme.palette.headerBorder.main}`,
    borderRadius: 2,
    px: { xs: 2, md: 3 },
    py: { xs: 2, md: 3 },
    transition: "border-color .15s ease, box-shadow .15s ease, background .15s ease",
  } as const;

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
      "&.MuiInputLabel-shrink": { color: theme.palette.common.white },
      "&.Mui-disabled": { color: theme.palette.text.disabled },
    },
  } as const;

  const actionBtnSx = {
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
  } as const;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack gap={2} width="100%">
        <Stack gap={0.5}>
          <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            {subtitle}
          </Typography>
        </Stack>

        {loading ? (
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Loading rounds from chain…
          </Typography>
        ) : (
          <Stack gap={2} sx={{ opacity: anyRowBusy ? 0.85 : 1 }}>
            {items.map((r, idx) => {
              const isActive = r.active;
              const isFirstActive = firstActive?.id === r.id;
              const isExpanded = expandedId === r.id;
              const rowBusy = !!txLoadingById[r.id];

              return (
                <Fragment key={r.id}>
                  <Stack
                    sx={{
                      ...cardBaseSx,
                      border: isActive ? `1px solid ${theme.palette.uranoGreen1.main}` : cardBaseSx.border,
                      boxShadow: isActive ? `0 0 0 1px rgba(107, 226, 194, .25)` : "none",
                      opacity: rowBusy ? 0.6 : 1,
                      pointerEvents: rowBusy || anyRowBusy ? "none" : "auto",
                    }}
                    gap={2}
                  >
                    {/* Header */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      flexWrap={{ xs: "wrap", md: "nowrap" }}
                    >
                      <Stack
                        gap={1}
                        direction={{ xs: "row", md: "column" }}
                        alignItems="center"
                        justifyContent={{ xs: "space-between", lg: "flex-start" }}
                        flexWrap={{ xs: "wrap", md: "nowrap" }}
                        width={{ xs: "100%", md: "auto" }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: "1.05rem",
                            fontWeight: 500,
                            color: theme.palette.text.primary,
                          }}
                        >
                          {r.title}
                        </Typography>

                        {isActive ? (
                          <Chip
                            size="small"
                            label="Active"
                            variant="outlined"
                            sx={{
                              height: 28,
                              width: "100%",
                              borderColor: theme.palette.uranoGreen1.main,
                              color: theme.palette.uranoGreen1.main,
                              fontWeight: 500,
                              borderRadius: 999,
                            }}
                          />
                        ) : (
                          <Typography
                            variant="body2"
                            sx={{ color: theme.palette.text.secondary, width: "100%", textAlign: "left" }}
                          >
                            Inactive
                          </Typography>
                        )}
                      </Stack>

                      <Stack
                        direction={{ xs: "row-reverse", lg: "row" }}
                        alignItems="center"
                        justifyContent={{ xs: "space-between", md: "flex-end" }}
                        gap={1.5}
                        width={{ xs: "100%", lg: "auto" }}
                        marginTop={{ xs: 2, md: 0 }}
                      >
                        <Switch
                          checked={isActive}
                          onChange={(e) => void handleToggle(r.id, e.target.checked)}
                          inputProps={{ "aria-label": `Toggle ${r.title}` }}
                          disabled={disabled || rowBusy || anyRowBusy}
                          sx={switchSx}
                        />

                        <Button
                          onClick={() => handleShowMore(r.id)}
                          disabled={disabled || !isFirstActive || rowBusy || anyRowBusy}
                          sx={{
                            ...actionBtnSx,
                            py: 1.25,
                            color: isExpanded ? theme.palette.text.disabled : theme.palette.text.primary,
                          }}
                        >
                          {isExpanded ? "Hide" : "Show more"}
                        </Button>
                      </Stack>
                    </Stack>

                    {/* Details (UI only, not mapped to ABI fields except future work) */}
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      {/* Vesting Parameters (not in ABI; UI only) */}
                      <Stack gap={0.5} mb={4}>
                        <Typography variant="subtitle1">Vesting Parameters</Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                          Configure vesting terms for all rounds
                        </Typography>
                      </Stack>
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={{ xs: 12, md: 3.5 }}>
                          <TextField
                            fullWidth
                            label="TGE %"
                            placeholder="0"
                            value={tgePct}
                            onChange={(e) => setTgePct(e.target.value)}
                            disabled={disabled}
                            InputLabelProps={{ shrink: true }}
                            sx={inputSx}
                            type="number"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 3.5 }}>
                          <TextField
                            fullWidth
                            label="Cliff Days"
                            placeholder="0"
                            value={cliffDays}
                            onChange={(e) => setCliffDays(e.target.value)}
                            disabled={disabled}
                            InputLabelProps={{ shrink: true }}
                            sx={inputSx}
                            type="number"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 3.5 }}>
                          <TextField
                            fullWidth
                            label="Duration Months"
                            placeholder="0"
                            value={durationMonths}
                            onChange={(e) => setDurationMonths(e.target.value)}
                            disabled={disabled}
                            InputLabelProps={{ shrink: true }}
                            sx={inputSx}
                            type="number"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 1.5 }}>
                          <Button sx={{ ...actionBtnSx, width: { xs: "100%", md: "auto" } }}>
                            Save
                          </Button>
                        </Grid>
                      </Grid>

                      <Divider sx={{ my: 3, borderBottom: `1px solid ${theme.palette.secondary.main}` }} />

                      {/* Start Vesting (UI scaffold; actual on-chain calls are startVesting / set*VestingEndTime) */}
                      <Stack gap={0.5} mb={4}>
                        <Typography variant="subtitle1">Start Vesting</Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                          Set TGE date and start vesting schedule
                        </Typography>
                      </Stack>
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={{ xs: 12, md: 5.5 }}>
                          <TextField
                            fullWidth
                            label="TGE Date"
                            placeholder="Select a date"
                            value={tgeDate}
                            onClick={(e) => openDate(e.currentTarget as HTMLElement)}
                            disabled={disabled}
                            InputLabelProps={{ shrink: true }}
                            sx={inputSx}
                            InputProps={{
                              readOnly: true,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <CalendarMonthRoundedIcon sx={{ color: theme.palette.text.secondary }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                          <Popover
                            open={datePopOpen}
                            anchorEl={dateAnchor}
                            onClose={closeDate}
                            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                            transformOrigin={{ vertical: "top", horizontal: "left" }}
                            PaperProps={{
                              sx: {
                                bgcolor: theme.palette.background.default,
                                borderRadius: 2,
                                boxShadow: `0 8px 24px rgba(0,0,0,.35)`,
                                border: `1px solid ${theme.palette.headerBorder.main}`,
                              },
                            }}
                          >
                            <DateCalendar
                              value={parseTgeDate() ?? null}
                              onChange={(newVal) => {
                                if (newVal?.isValid()) {
                                  setTgeDate(newVal.format("DD.MM.YY"));
                                }
                                closeDate();
                              }}
                              sx={{
                                p: 1.5,
                                "& .MuiPickersCalendarHeader-root": {
                                  px: 1.5,
                                  mb: 1,
                                  "& .MuiTypography-root": { fontWeight: 600 },
                                  "& .MuiIconButton-root": { borderRadius: 1.25 },
                                },
                                "& .MuiDayCalendar-headerSkeleton, & .MuiDayCalendar-weekDayLabel": {
                                  color: theme.palette.text.secondary,
                                },
                                "& .MuiPickersSlideTransition-root": { px: 1 },
                                "& .MuiDayCalendar-weekContainer": { justifyContent: "space-between" },
                                "& .MuiSvgIcon-root": { filter: "invert(1)" },
                                "& .MuiPickersDay-root": {
                                  borderRadius: 1.25,
                                  width: 40,
                                  height: 40,
                                  margin: "6px 6px",
                                  color: theme.palette.text.primary,
                                  "&:hover": {
                                    background: theme.palette.uranoGradient,
                                    color: theme.palette.background.default,
                                  },
                                  "&.Mui-selected": {
                                    backgroundColor: theme.palette.uranoGreen1.main + " !important",
                                    color: theme.palette.common.black,
                                  },
                                  "&.Mui-disabled": { opacity: 0.35 },
                                },
                              }}
                              slots={{ day: (props) => <PickersDay {...props} disableMargin /> }}
                            />
                          </Popover>
                        </Grid>

                        <Grid size={{ xs: 12, md: 5 }}>
                          <TextField
                            fullWidth
                            label="TGE Time"
                            placeholder="Select a time"
                            value={tgeTime}
                            onClick={(e) => openTime(e.currentTarget as HTMLElement)}
                            disabled={disabled}
                            InputLabelProps={{ shrink: true }}
                            sx={inputSx}
                            InputProps={{
                              readOnly: true,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <TimerRoundedIcon sx={{ color: theme.palette.text.secondary }} />
                                </InputAdornment>
                              ),
                            }}
                          />

                          <Popover
                            open={timePopOpen}
                            anchorEl={timeAnchor}
                            onClose={closeTime}
                            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                            transformOrigin={{ vertical: "top", horizontal: "left" }}
                            PaperProps={{
                              sx: {
                                bgcolor: theme.palette.common.black,
                                borderRadius: 2,
                                boxShadow: `0 8px 24px rgba(0,0,0,.35)`,
                                border: `1px solid ${theme.palette.headerBorder.main}`,
                                p: 1,
                                width: 180,
                                display: "flex",
                                justifyContent: "center",
                              },
                            }}
                          >
                            <Stack sx={{ minWidth: 280 }}>
                              <MultiSectionDigitalClock
                                ampm
                                views={["hours", "minutes"]}
                                minutesStep={5}
                                value={tempTime}
                                onChange={(newVal) => {
                                  if (newVal?.isValid()) setTempTime(newVal);
                                }}
                                sx={{
                                  py: 0.5,
                                  width: 170,
                                  bgcolor: "transparent",
                                  "& .MuiMultiSectionDigitalClock-root": { gap: 1.5 },
                                  "& .MuiMultiSectionDigitalClockSection-root": {
                                    bgcolor: "transparent",
                                    py: 0.5,
                                    pr: 1.5,
                                    "&:not(:last-of-type)": {
                                      borderRight: `1px solid ${theme.palette.headerBorder.main}`,
                                    },
                                  },
                                  "& .MuiMultiSectionDigitalClockSection-root:last-of-type": {
                                    py: 0.5,
                                    px: 0.5,
                                  },
                                  "& .MuiMultiSectionDigitalClockSection-label": { display: "none" },
                                  "& .MuiMultiSectionDigitalClockSection-itemsContainer": {
                                    maxHeight: 300,
                                    pr: 0.5,
                                    pl: 0.25,
                                    scrollPaddingTop: 40,
                                    scrollPaddingBottom: 40,
                                    "&::-webkit-scrollbar": { width: 2 },
                                    "&::-webkit-scrollbar-thumb": {
                                      backgroundColor: theme.palette.headerBorder.main,
                                      borderRadius: 8,
                                    },
                                  },
                                  "& .MuiMultiSectionDigitalClockSection-item": {
                                    fontVariantNumeric: "tabular-nums",
                                    color: theme.palette.text.primary,
                                    borderRadius: 1.25,
                                    mx: 0.5,
                                    my: 0.4,
                                    height: 44,
                                    transition:
                                      "background .15s ease, color .15s ease, transform .08s ease",
                                    "&:hover": { background: theme.palette.secondary.main },
                                    "&.Mui-selected": {
                                      background: theme.palette.uranoGradient + " !important",
                                      color: theme.palette.common.black,
                                      boxShadow: "none",
                                    },
                                    "&.Mui-focusVisible": {
                                      outline: `2px solid ${theme.palette.uranoGreen1.main}`,
                                      outlineOffset: 1,
                                    },
                                  },
                                  "& .MuiSvgIcon-root": { filter: "invert(1)" },
                                }}
                              />

                              {/* Footer button */}
                              <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                                sx={{
                                  borderTop: `1px solid ${theme.palette.headerBorder.main}`,
                                  pt: 1.25,
                                  px: 1,
                                }}
                              >
                                <Button
                                  fullWidth
                                  onClick={() => {
                                    setTgeTime(tempTime.format("HH.mm"));
                                    closeTime();
                                  }}
                                  sx={{
                                    width: "60%",
                                    textTransform: "none",
                                    borderRadius: 2,
                                    py: 1.25,
                                    mx: "auto",
                                    fontSize: 14,
                                    backgroundColor: theme.palette.secondary.main,
                                    color: theme.palette.text.primary,
                                    "&:hover": {
                                      background: theme.palette.uranoGradient,
                                      color: theme.palette.background.default,
                                    },
                                  }}
                                >
                                  Select
                                </Button>
                              </Stack>
                            </Stack>
                          </Popover>
                        </Grid>

                        <Grid size={{ xs: 12, md: 1.5 }}>
                          <Button sx={{ ...actionBtnSx, width: { xs: "100%", md: "auto" } }}>
                            Save
                          </Button>
                        </Grid>
                      </Grid>

                      <Divider sx={{ my: 3, borderBottom: `1px solid ${theme.palette.secondary.main}` }} />

                      {/* Round Max Tokens (UI placeholders for now) */}
                      <Stack gap={0.5} mb={4}>
                        <Typography variant="subtitle1">Round Max Tokens</Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                          Configure vesting terms for all rounds
                        </Typography>
                      </Stack>
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={{ xs: 12, md: 3.5 }}>
                          <TextField
                            fullWidth
                            label="Seed Round (URANO)"
                            placeholder="0"
                            value={seedRound}
                            onChange={(e) => setSeedRound(e.target.value)}
                            disabled={disabled}
                            InputLabelProps={{ shrink: true }}
                            sx={inputSx}
                            type="number"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 3.5 }}>
                          <TextField
                            fullWidth
                            label="Strategic Round (URANO)"
                            placeholder="0"
                            value={strategicRound}
                            onChange={(e) => setStrategicRound(e.target.value)}
                            disabled={disabled}
                            InputLabelProps={{ shrink: true }}
                            sx={inputSx}
                            type="number"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 3.5 }}>
                          <TextField
                            fullWidth
                            label="Institutional Round (URANO)"
                            placeholder="0"
                            value={institutionalRound}
                            onChange={(e) => setInstitutionalRound(e.target.value)}
                            disabled={disabled}
                            InputLabelProps={{ shrink: true }}
                            sx={inputSx}
                            type="number"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 1.5 }}>
                          <Button sx={{ ...actionBtnSx, width: { xs: "100%", md: "auto" } }}>
                            Save
                          </Button>
                        </Grid>
                      </Grid>

                      <Divider sx={{ my: 3, borderBottom: `1px solid ${theme.palette.secondary.main}` }} />

                      {/* Whitelist Management (UI placeholders; contract has global whitelist only) */}
                      <Stack gap={0.5} mb={4}>
                        <Typography variant="subtitle1">Whitelist Management</Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                          Add or remove addresses from whitelist
                        </Typography>
                      </Stack>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            label="Address"
                            placeholder="Enter address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            disabled={disabled}
                            InputLabelProps={{ shrink: true }}
                            sx={inputSx}
                          />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                          <FormControl fullWidth disabled={disabled} sx={inputSx}>
                            <InputLabel id="round-select-label" shrink>
                              Round
                            </InputLabel>
                            <Select
                              labelId="round-select-label"
                              value={roundId}
                              onChange={(e: SelectChangeEvent<string>) =>
                                setRoundId(e.target.value as RoundKey)
                              }
                              displayEmpty
                              sx={{ "& .MuiSelect-icon": { filter: "invert(1)" } }}
                              renderValue={(val) =>
                                val ? (
                                  items.find((rr) => rr.id === val as RoundKey)?.title ?? val
                                ) : (
                                  <Box component="span" sx={{ color: theme.palette.text.secondary }}>
                                    Select round
                                  </Box>
                                )
                              }
                              label="Round"
                            >
                              {items.map((opt) => (
                                <MenuItem key={opt.id} value={opt.id}>
                                  {opt.title}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Max Allocation (URANO)"
                            placeholder="0"
                            value={maxAllocation}
                            onChange={(e) => setMaxAllocation(e.target.value)}
                            disabled={disabled}
                            InputLabelProps={{ shrink: true }}
                            sx={inputSx}
                            type="number"
                          />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                          <Button
                            fullWidth
                            sx={{ ...actionBtnSx, "&:hover": { background: theme.palette.error.main } }}
                          >
                            Remove
                          </Button>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Button
                            fullWidth
                            sx={{
                              ...actionBtnSx,
                              "&:hover": {
                                background: theme.palette.uranoGradient,
                                color: theme.palette.info.main,
                              },
                            }}
                          >
                            Add
                          </Button>
                        </Grid>
                      </Grid>
                    </Collapse>
                  </Stack>

                  {idx < items.length - 1 && (
                    <Divider sx={{ borderColor: "transparent", my: -0.5 }} />
                  )}
                </Fragment>
              );
            })}
          </Stack>
        )}
      </Stack>
    </LocalizationProvider>
  );
});

export default RoundStatusManagement;
