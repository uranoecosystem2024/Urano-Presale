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
  Grid,
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
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import TimerRoundedIcon from "@mui/icons-material/TimerRounded";

// date & time pickers
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { MultiSectionDigitalClock } from "@mui/x-date-pickers/MultiSectionDigitalClock";
import dayjs, { type Dayjs } from "dayjs";

export type RoundStatusItem = {
  id: string;
  title: string;
  active: boolean;
};

export type RoundStatusManagementProps = {
  rounds: RoundStatusItem[];
  singleActive?: boolean;
  disabled?: boolean;
  onChange?: (next: RoundStatusItem[], changedId: string) => void;
  onShowMore?: (id: string) => void;
  title?: string;
  subtitle?: string;
};

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
  const [items, setItems] = useState<RoundStatusItem[]>(rounds);

  // form state
  const [tgePct, setTgePct] = useState("");
  const [cliffDays, setCliffDays] = useState("");
  const [durationMonths, setDurationMonths] = useState("");
  const [tgeDate, setTgeDate] = useState("");
  const [tgeTime, setTgeTime] = useState("");
  const [seedRound, setSeedRound] = useState("");
  const [strategicRound, setStrategicRound] = useState("");
  const [institutionalRound, setInstitutionalRound] = useState("");
  const [address, setAddress] = useState("");
  const [roundId, setRoundId] = useState(""); // <- select value
  const [maxAllocation, setMaxAllocation] = useState("");


  // date popover state
  const [datePopOpen, setDatePopOpen] = useState(false);
  const [dateAnchor, setDateAnchor] = useState<HTMLElement | null>(null);
  const openDate = (el: HTMLElement) => {
    if (disabled) return;
    setDateAnchor(el);
    setDatePopOpen(true);
  };
  const closeDate = () => {
    setDatePopOpen(false);
    setDateAnchor(null);
  };
  const parseTgeDate = (): Dayjs | null => {
    const d = dayjs(tgeDate, "DD.MM.YY", true);
    return d.isValid() ? d : null;
  };

  // time popover state
  const [timePopOpen, setTimePopOpen] = useState(false);
  const [timeAnchor, setTimeAnchor] = useState<HTMLElement | null>(null);

  const parseTgeTime = (): Dayjs | null => {
    const t = dayjs(tgeTime, "HH.mm", true);
    return t.isValid() ? t : null;
  };
  const [tempTime, setTempTime] = useState<Dayjs>(parseTgeTime() ?? dayjs());
  const openTime = (el: HTMLElement) => {
    if (disabled) return;
    setTimeAnchor(el);
    setTempTime(parseTgeTime() ?? dayjs());
    setTimePopOpen(true);
  };
  const closeTime = () => {
    setTimePopOpen(false);
    setTimeAnchor(null);
  };


  // which row is expanded
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => setItems(rounds), [rounds]);

  // recompute “first active” whenever items change
  const firstActive = useMemo(() => {
    const idx = items.findIndex((r) => r.active);
    return idx >= 0 ? { id: items[idx]?.id ?? null, index: idx } : null;
  }, [items]);

  // if the expanded row stops being the first active, collapse it
  useEffect(() => {
    if (!firstActive || expandedId !== firstActive.id) {
      setExpandedId(null);
    }
  }, [firstActive, expandedId]);

  const handleToggle = (id: string, nextVal: boolean) => {
    if (disabled) return;

    setItems((prev) => {
      let next = prev.map((r) =>
        r.id === id ? { ...r, active: nextVal } : r
      );
      if (singleActive && nextVal) {
        next = next.map((r) => (r.id !== id ? { ...r, active: false } : r));
      }
      onChange?.(next, id);
      return next;
    });
  };

  const handleShowMore = (id: string) => {
    if (disabled) return;
    if (firstActive?.id !== id) return; // only first active can open
    setExpandedId((prev) => (prev === id ? null : id));
    onShowMore?.(id);
  };

  const switchSx = {
    "& .MuiSwitch-track": {
      backgroundColor: theme.palette.grey[700],
      opacity: 1,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: theme.palette.uranoGreen1.main,
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.uranoGreen1.main,
        opacity: 1,
      },
    },
  } as const;

  const cardBaseSx = {
    backgroundColor: theme.palette.presaleCardBg.main,
    border: `1px solid ${theme.palette.headerBorder.main}`,
    borderRadius: 2,
    px: { xs: 2, md: 3 },
    py: { xs: 2, md: 3 },
    transition:
      "border-color .15s ease, box-shadow .15s ease, background .15s ease",
  } as const;

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      background: theme.palette.background.paper,
      borderRadius: 2,
      "& fieldset": { borderColor: theme.palette.headerBorder.main },
      "&:hover fieldset": { borderColor: theme.palette.text.primary },
      "&.Mui-focused fieldset": { borderColor: theme.palette.uranoGreen1.main },
    },

    // keep placeholder opacity
    "& .MuiInputBase-input::placeholder": { opacity: 0.7 },

    // ⬇️ label color stays white, including when focused/shrunk
    "& .MuiInputLabel-root": {
      color: theme.palette.common.white,
      "&.Mui-focused": { color: theme.palette.common.white },
      "&.MuiInputLabel-shrink": { color: theme.palette.common.white },
      "&.Mui-disabled": { color: theme.palette.text.disabled }, // optional
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
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary }}
          >
            {subtitle}
          </Typography>
        </Stack>

        <Stack gap={2}>
          {items.map((r, idx) => {
            const isActive = r.active;
            const isFirstActive = firstActive?.id === r.id;
            const isExpanded = expandedId === r.id;

            return (
              <Fragment key={r.id}>
                <Stack
                  sx={{
                    ...cardBaseSx,
                    border: isActive
                      ? `1px solid ${theme.palette.uranoGreen1.main}`
                      : cardBaseSx.border,
                    boxShadow: isActive
                      ? `0 0 0 1px rgba(107, 226, 194, .25)`
                      : "none",
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
                    <Stack gap={1} direction={{ xs: "row", md: "column" }} alignItems="center" justifyContent={{ xs: "space-between", lg: "flex-start" }} flexWrap={{ xs: "wrap", md: "nowrap" }} width={{ xs: "100%", md: "auto" }}>
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
                            width: 100,
                            borderColor: theme.palette.uranoGreen1.main,
                            color: theme.palette.uranoGreen1.main,
                            fontWeight: 500,
                            borderRadius: 999,
                          }}
                        />
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ color: theme.palette.text.secondary, width: 100, textAlign: "end" }}
                        >
                          Inactive
                        </Typography>
                      )}
                    </Stack>

                    <Stack direction={{ xs: "row-reverse", lg: "row" }} alignItems="center" justifyContent={{ xs: "space-between", md: "flex-end" }} gap={1.5} width={{ xs: "100%", lg: "auto" }} marginTop={{ xs: 2, md: 0 }}>
                      <Switch
                        checked={isActive}
                        onChange={(e) => handleToggle(r.id, e.target.checked)}
                        inputProps={{ "aria-label": `Toggle ${r.title}` }}
                        disabled={disabled}
                        sx={switchSx}
                      />

                      <Button
                        onClick={() => handleShowMore(r.id)}
                        disabled={disabled || !isFirstActive}
                        sx={{ ...actionBtnSx, py: 1.25, }}
                      >
                        {isExpanded ? "Hide" : "Show more"}
                      </Button>
                    </Stack>
                  </Stack>

                  {/* Details (inside same card) */}
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    {/* Vesting Parameters */}
                    <Stack gap={0.5} mb={4}>
                      <Typography variant="subtitle1">
                        Vesting Parameters
                      </Typography>
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
                        <Button sx={
                          {
                            ...actionBtnSx,
                            width: { xs: "100%", md: "auto" },
                          }
                        }>Save</Button>
                      </Grid>
                    </Grid>


                    <Divider
                      sx={{
                        my: 3,
                        borderBottom: `1px solid ${theme.palette.secondary.main}`,
                      }}
                    />

                    {/* Start Vesting */}
                    <Stack gap={0.5} mb={4}>
                      <Typography variant="subtitle1">
                        Start Vesting
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        Set TGE date and start vesting schedule
                      </Typography>
                    </Stack>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      {/* TGE Date with calendar adornment + popover picker */}
                      <Grid size={{ xs: 12, md: 5.5 }}>
                        <TextField
                          fullWidth
                          label="TGE Date"
                          placeholder="dd.mm.yy"
                          value={tgeDate}
                          onClick={(e) =>
                            openDate(e.currentTarget as HTMLElement)
                          }
                          disabled={disabled}
                          InputLabelProps={{ shrink: true }}
                          sx={inputSx}
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <InputAdornment position="end">
                                <CalendarMonthRoundedIcon
                                  sx={{ color: theme.palette.text.secondary }}
                                />
                              </InputAdornment>
                            ),
                          }}
                        />

                        <Popover
                          open={datePopOpen}
                          anchorEl={dateAnchor}
                          onClose={closeDate}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                          }}
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
                              "& .MuiDayCalendar-headerSkeleton, & .MuiDayCalendar-weekDayLabel":
                                { color: theme.palette.text.secondary },
                              "& .MuiPickersSlideTransition-root": { px: 1 },
                              "& .MuiDayCalendar-weekContainer": {
                                justifyContent: "space-between",
                              },
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
                                  backgroundColor:
                                    theme.palette.uranoGreen1.main + " !important",
                                  color: theme.palette.common.black,
                                },
                                "&.Mui-disabled": { opacity: 0.35 },
                              },
                            }}
                            slots={{
                              day: (props) => <PickersDay {...props} disableMargin />,
                            }}
                          />
                        </Popover>
                      </Grid>

                      {/* TGE Time with stopwatch icon + digital time picker */}
                      <Grid size={{ xs: 12, md: 5 }}>
                        <TextField
                          fullWidth
                          label="TGE Time"
                          placeholder="hh.mm"
                          value={tgeTime}
                          onClick={(e) =>
                            openTime(e.currentTarget as HTMLElement)
                          }
                          disabled={disabled}
                          InputLabelProps={{ shrink: true }}
                          sx={inputSx}
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <InputAdornment position="end">
                                <TimerRoundedIcon
                                  sx={{ color: theme.palette.text.secondary }}
                                />
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
                                // space between columns
                                "& .MuiMultiSectionDigitalClock-root": {
                                  gap: 1.5,
                                },

                                // each column
                                "& .MuiMultiSectionDigitalClockSection-root": {
                                  bgcolor: "transparent",
                                  py: 0.5,
                                  pr: 1.5,
                                  "&:not(:last-of-type)": {
                                    borderRight: `1px solid ${theme.palette.headerBorder.main}`,
                                  }
                                },

                                "& .MuiMultiSectionDigitalClockSection-root:last-of-type": {
                                  py: 0.5,
                                  px: 0.5,
                                },

                                // HIDE section labels (Hours / Minutes / AM/PM)
                                "& .MuiMultiSectionDigitalClockSection-label": {
                                  display: "none",
                                },

                                // scrolling area
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

                                // option items
                                "& .MuiMultiSectionDigitalClockSection-item": {
                                  fontVariantNumeric: "tabular-nums",
                                  color: theme.palette.text.primary,
                                  borderRadius: 1.25,
                                  mx: 0.5,
                                  my: 0.4,
                                  height: 44,
                                  transition:
                                    "background .15s ease, color .15s ease, transform .08s ease",
                                  "&:hover": {
                                    background: theme.palette.secondary.main,
                                  },
                                  // SELECTED “pill”
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

                            {/* Footer button like your screenshot */}
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
                                  setTgeTime(tempTime.format("HH.mm")); // store 24h; UI shows AM/PM
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
                        <Button sx={
                          {
                            ...actionBtnSx,
                            width: { xs: "100%", md: "auto" },
                          }
                        }>Save</Button>
                      </Grid>
                    </Grid>


                    <Divider
                      sx={{
                        my: 3,
                        borderBottom: `1px solid ${theme.palette.secondary.main}`,
                      }}
                    />

                    {/* Round Max Tokens */}
                    <Stack gap={0.5} mb={4}>
                      <Typography variant="subtitle1">
                        Round Max Tokens
                      </Typography>
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
                        <Button sx={
                          {
                            ...actionBtnSx,
                            width: { xs: "100%", md: "auto" },
                          }
                        }>Save</Button>
                      </Grid>
                    </Grid>


                    <Divider
                      sx={{
                        my: 3,
                        borderBottom: `1px solid ${theme.palette.secondary.main}`,
                      }}
                    />

                    {/* Whitelist Management */}
                    <Stack gap={0.5} mb={4}>
                      <Typography variant="subtitle1">
                        Whitelist Management
                      </Typography>
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

                      {/* Round SELECT */}
                      <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth disabled={disabled} sx={inputSx}>
                          <InputLabel id="round-select-label" shrink>
                            Round
                          </InputLabel>
                          <Select
                            labelId="round-select-label"
                            value={roundId}
                            onChange={(e: SelectChangeEvent<string>) =>
                              setRoundId(e.target.value)
                            }
                            displayEmpty
                            renderValue={(val) =>
                              val ? (
                                items.find((rr) => rr.id === val)?.title ?? val
                              ) : (
                                <Box
                                  component="span"
                                  sx={{ color: theme.palette.text.secondary }}
                                >
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
                          sx={{
                            ...actionBtnSx,
                            "&:hover": { background: theme.palette.error.main },
                          }}
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
      </Stack>
    </LocalizationProvider>
  );
});

export default RoundStatusManagement;
