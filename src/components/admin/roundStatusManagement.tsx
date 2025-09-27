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
} from "@mui/material";
import Grid from "@mui/material/Grid"; // MUI v6 Grid (Grid2) -> supports size={{ xs, md }}
import dayjs from "dayjs";

// date adapter (even if we use datetime-local, you asked to keep LocalizationProvider)
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { fetchRoundItems } from "@/utils/admin/rounds";
import {
  toggleRoundActive,
  toggleRoundActiveExclusive,
  type RoundKey,
} from "@/utils/admin/roundsWrite";

import {
  readRoundMaxTokensHuman,
  setRoundMaxTokensHumanTx,
} from "@/utils/admin/roundMaxTokens";

import {
  readVestingStatus,
  startVestingFromDatesTx,
  setVestingEndTimeByKeyFromDateTx,
} from "@/utils/admin/vesting";

import { useActiveAccount } from "thirdweb/react";
import { toast } from "react-toastify";

export type RoundStatusItem = {
  id: RoundKey; // "private" | "institutional" | "community"
  title: string;
  active: boolean;
};

export type RoundStatusManagementProps = {
  rounds?: RoundStatusItem[];
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

  // UI-only vesting params (not in ABI)
  const [tgePct, setTgePct] = useState("");
  const [cliffDays, setCliffDays] = useState("");
  const [durationMonths, setDurationMonths] = useState("");

  // Round max tokens
  const [maxTokensHuman, setMaxTokensHuman] = useState("");
  const [maxTokensLoading, setMaxTokensLoading] = useState(false);

  // which row is expanded
  const [expandedId, setExpandedId] = useState<RoundKey | null>(null);

  // vesting state
  const [vestingLoading, setVestingLoading] = useState(false);
  const [vestingActionLoading, setVestingActionLoading] = useState(false);
  const [vestingStarted, setVestingStarted] = useState<boolean | null>(null);

  // datetime-local ISO strings
  const [privateEndISO, setPrivateEndISO] = useState<string>("");
  const [institutionalEndISO, setInstitutionalEndISO] = useState<string>("");
  const [communityEndISO, setCommunityEndISO] = useState<string>("");

  const [updateLoading, setUpdateLoading] = useState<Record<RoundKey, boolean>>({
    private: false,
    institutional: false,
    community: false,
  });

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
        const res = await toggleRoundActiveExclusive(account, id, true);
        try {
          const latest = await fetchRoundItems();
          setItems(latest);
          onChange?.(latest, id);
        } catch {
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
          `Activated ${id} round${
            res.activated
              ? ` (${Number(res.activated.startTimeUsed)} → ${Number(res.activated.endTimeUsed)})`
              : ""
          }.`
        );
        if (res.deactivated.length > 0) {
          toast.info(`Deactivated ${res.deactivated.map((d) => d.round).join(", ")}.`);
        }
        return;
      }

      const result = await toggleRoundActive(account, id, nextVal);

      try {
        const latest = await fetchRoundItems();
        setItems(latest);
        onChange?.(latest, id);
      } catch {
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

  // Load max tokens when a row is expanded
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!expandedId) return;
      try {
        setMaxTokensLoading(true);
        const human = await readRoundMaxTokensHuman(expandedId);
        if (!cancelled) setMaxTokensHuman(human);
      } catch (e) {
        console.error("Failed to read round max tokens:", e);
      } finally {
        if (!cancelled) setMaxTokensLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [expandedId]);

  const handleSaveMaxTokens = async () => {
    if (!expandedId) return;
    if (disabled) return;

    if (!account) {
      toast.error("No wallet connected. Please connect an authorized wallet.");
      return;
    }

    const rowId = expandedId as string;
    if (txLoadingById[rowId] || anyRowBusy) return;

    try {
      setRowTxLoading(rowId, true);
      await setRoundMaxTokensHumanTx(account, expandedId, maxTokensHuman.trim());
      toast.success(`Max tokens updated for ${expandedId} round.`);

      try {
        const human = await readRoundMaxTokensHuman(expandedId);
        setMaxTokensHuman(human);
      } catch {
        /* ignore */
      }
    } catch (e) {
      console.error(e);
      toast.error(getErrorMessage(e));
    } finally {
      setRowTxLoading(rowId, false);
    }
  };

  // Load vesting status when expanded
  useEffect(() => {
    let cancelled = false;

    const loadVesting = async () => {
      if (!expandedId) return;
      try {
        setVestingLoading(true);
        const status = await readVestingStatus();
        if (cancelled) return;

        setVestingStarted(status.started);

        const secToISO = (sec: bigint) =>
          sec && sec > 0n
            ? dayjs(Number(sec) * 1000).format("YYYY-MM-DDTHH:mm")
            : "";

        setPrivateEndISO(secToISO(status.privateEnd));
        setInstitutionalEndISO(secToISO(status.institutionalEnd));
        setCommunityEndISO(secToISO(status.communityEnd));

        if (!status.started) {
          const thirty = dayjs().add(30, "day").minute(0).second(0).millisecond(0);
          if (!status.privateEnd) setPrivateEndISO(thirty.format("YYYY-MM-DDTHH:mm"));
          if (!status.institutionalEnd) setInstitutionalEndISO(thirty.format("YYYY-MM-DDTHH:mm"));
          if (!status.communityEnd) setCommunityEndISO(thirty.format("YYYY-MM-DDTHH:mm"));
        }
      } catch (e) {
        console.error("Failed to read vesting status:", e);
        toast.error("Failed to read vesting status");
      } finally {
        if (!cancelled) setVestingLoading(false);
      }
    };

    void loadVesting();
    return () => {
      cancelled = true;
    };
  }, [expandedId]);

  const handleStartVesting = async () => {
    if (disabled || vestingStarted) return;
    if (!account) {
      toast.error("No wallet connected. Please connect an authorized wallet.");
      return;
    }

    try {
      setVestingActionLoading(true);
      if (!privateEndISO || !institutionalEndISO || !communityEndISO) {
        toast.error("Please set end times for all rounds.");
        return;
      }

      await startVestingFromDatesTx(account, {
        privateEnd: dayjs(privateEndISO).toDate(),
        institutionalEnd: dayjs(institutionalEndISO).toDate(),
        communityEnd: dayjs(communityEndISO).toDate(),
      });

      toast.success("Vesting started.");
      setVestingStarted(true);
    } catch (e) {
      console.error(e);
      toast.error(getErrorMessage(e));
    } finally {
      setVestingActionLoading(false);
    }
  };

  const handleUpdateEndTime = async (key: RoundKey, iso: string) => {
    if (!vestingStarted) return;
    if (disabled) return;
    if (!account) {
      toast.error("No wallet connected. Please connect an authorized wallet.");
      return;
    }
    if (!iso) {
      toast.error("Please select a valid end time.");
      return;
    }

    try {
      setUpdateLoading((prev) => ({ ...prev, [key]: true }));
      await setVestingEndTimeByKeyFromDateTx(account, key, dayjs(iso).toDate());
      toast.success(`Updated ${key} vesting end time.`);
    } catch (e) {
      console.error(e);
      toast.error(getErrorMessage(e));
    } finally {
      setUpdateLoading((prev) => ({ ...prev, [key]: false }));
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

                    {/* Details */}
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      {/* Vesting Parameters (UI-only) */}
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

                      {/* Start / Update Vesting (ABI-compliant) */}
                      <Stack gap={0.5} mb={4}>
                        <Typography variant="subtitle1">Vesting</Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                          {vestingStarted
                            ? "Vesting is active. Update round end times below."
                            : "Set vesting end times for all rounds, then start vesting."}
                        </Typography>
                      </Stack>

                      {vestingLoading ? (
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                          Loading vesting status…
                        </Typography>
                      ) : (
                        <>
                          {!vestingStarted ? (
                            <>
                              <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12, md: 4 }}>
                                  <TextField
                                    fullWidth
                                    label="Private End"
                                    type="datetime-local"
                                    value={privateEndISO}
                                    onChange={(e) => setPrivateEndISO(e.target.value)}
                                    disabled={disabled || vestingActionLoading}
                                    InputLabelProps={{ shrink: true }}
                                    sx={inputSx}
                                  />
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                  <TextField
                                    fullWidth
                                    label="Institutional End"
                                    type="datetime-local"
                                    value={institutionalEndISO}
                                    onChange={(e) => setInstitutionalEndISO(e.target.value)}
                                    disabled={disabled || vestingActionLoading}
                                    InputLabelProps={{ shrink: true }}
                                    sx={inputSx}
                                  />
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                  <TextField
                                    fullWidth
                                    label="Community End"
                                    type="datetime-local"
                                    value={communityEndISO}
                                    onChange={(e) => setCommunityEndISO(e.target.value)}
                                    disabled={disabled || vestingActionLoading}
                                    InputLabelProps={{ shrink: true }}
                                    sx={inputSx}
                                  />
                                </Grid>
                              </Grid>

                              <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
                                <Button
                                  onClick={handleStartVesting}
                                  disabled={
                                    disabled ||
                                    vestingActionLoading ||
                                    !privateEndISO ||
                                    !institutionalEndISO ||
                                    !communityEndISO
                                  }
                                  sx={actionBtnSx}
                                >
                                  {vestingActionLoading ? "Starting…" : "Start Vesting"}
                                </Button>
                              </Stack>
                            </>
                          ) : (
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                              <Grid size={{ xs: 12, md: 9 }}>
                                <TextField
                                  fullWidth
                                  label="Private round vesting end"
                                  type="datetime-local"
                                  value={privateEndISO}
                                  onChange={(e) => setPrivateEndISO(e.target.value)}
                                  disabled={disabled || updateLoading.private}
                                  InputLabelProps={{ shrink: true }}
                                  sx={inputSx}
                                />
                              </Grid>
                              <Grid size={{ xs: 12, md: 3 }}>
                                <Button
                                  fullWidth
                                  onClick={() => handleUpdateEndTime("private", privateEndISO)}
                                  disabled={disabled || updateLoading.private || !privateEndISO}
                                  sx={actionBtnSx}
                                >
                                  {updateLoading.private ? "Updating…" : "Update"}
                                </Button>
                              </Grid>

                              <Grid size={{ xs: 12, md: 9 }}>
                                <TextField
                                  fullWidth
                                  label="Institutional round vesting end"
                                  type="datetime-local"
                                  value={institutionalEndISO}
                                  onChange={(e) => setInstitutionalEndISO(e.target.value)}
                                  disabled={disabled || updateLoading.institutional}
                                  InputLabelProps={{ shrink: true }}
                                  sx={inputSx}
                                />
                              </Grid>
                              <Grid size={{ xs: 12, md: 3 }}>
                                <Button
                                  fullWidth
                                  onClick={() => handleUpdateEndTime("institutional", institutionalEndISO)}
                                  disabled={disabled || updateLoading.institutional || !institutionalEndISO}
                                  sx={actionBtnSx}
                                >
                                  {updateLoading.institutional ? "Updating…" : "Update"}
                                </Button>
                              </Grid>

                              <Grid size={{ xs: 12, md: 9 }}>
                                <TextField
                                  fullWidth
                                  label="Community round vesting end"
                                  type="datetime-local"
                                  value={communityEndISO}
                                  onChange={(e) => setCommunityEndISO(e.target.value)}
                                  disabled={disabled || updateLoading.community}
                                  InputLabelProps={{ shrink: true }}
                                  sx={inputSx}
                                />
                              </Grid>
                              <Grid size={{ xs: 12, md: 3 }}>
                                <Button
                                  fullWidth
                                  onClick={() => handleUpdateEndTime("community", communityEndISO)}
                                  disabled={disabled || updateLoading.community || !communityEndISO}
                                  sx={actionBtnSx}
                                >
                                  {updateLoading.community ? "Updating…" : "Update"}
                                </Button>
                              </Grid>
                            </Grid>
                          )}
                        </>
                      )}

                      <Divider sx={{ my: 3, borderBottom: `1px solid ${theme.palette.secondary.main}` }} />

                      {/* Round Max Tokens */}
                      <Stack gap={0.5} mb={4}>
                        <Typography variant="subtitle1">Round Max Tokens</Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                          Set the maximum tokens amount for this round
                        </Typography>
                      </Stack>
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={{ xs: 12, md: 10.5 }}>
                          <TextField
                            fullWidth
                            label="Round Max Tokens (URANO)"
                            placeholder="0"
                            value={maxTokensHuman}
                            onChange={(e) => setMaxTokensHuman(e.target.value)}
                            disabled={
                              disabled ||
                              maxTokensLoading ||
                              anyRowBusy ||
                              (expandedId ? !!txLoadingById[expandedId] : false)
                            }
                            InputLabelProps={{ shrink: true }}
                            sx={inputSx}
                            type="number"
                            helperText={maxTokensLoading ? "Loading current value…" : undefined}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 1.5 }}>
                          <Button
                            onClick={handleSaveMaxTokens}
                            disabled={
                              disabled ||
                              maxTokensLoading ||
                              anyRowBusy ||
                              (expandedId ? !!txLoadingById[expandedId] : false) ||
                              !maxTokensHuman.trim()
                            }
                            sx={{ ...actionBtnSx, width: { xs: "100%", md: "auto" } }}
                          >
                            Save
                          </Button>
                        </Grid>
                      </Grid>

                      <Divider sx={{ my: 3, borderBottom: `1px solid ${theme.palette.secondary.main}` }} />
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
