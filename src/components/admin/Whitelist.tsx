"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { useActiveAccount } from "thirdweb/react";
import { toast } from "react-toastify";

import {
  addWhitelistRowsSameRoundTx,
  removeFromWhitelistTx,
  type RoundKey,
  isAddressLike, // from utils
} from "@/utils/admin/whitelist";

export type WhitelistProps = {
  title?: string;
  subtitle?: string;
  disabled?: boolean;
  initialAddress?: string;
  initialAmount?: string;
  /** Default whitelist round (enum key or uint8). */
  initialRound?: RoundKey | number;
  onAdded?: (address: `0x${string}`) => void;   // called for first row only (compat)
  onRemoved?: (address: `0x${string}`) => void; // called for first row only (compat)
};

const ROUND_OPTIONS: { label: string; value: RoundKey }[] = [
  { label: "Seed", value: "seed" },
  { label: "Private", value: "private" },
  { label: "Institutional", value: "institutional" },
  { label: "Strategic", value: "strategic" },
  { label: "Community", value: "community" },
];

// enum index <-> key maps (for normalizing numeric prop only)
const INDEX_TO_ROUND: Record<number, RoundKey> = {
  0: "seed",
  1: "private",
  2: "institutional",
  3: "strategic",
  4: "community",
};

type Row = { address: string; amountHuman: string };

export default function Whitelist({
  title = "Whitelist",
  subtitle = "Add addresses to the URANO whitelist",
  disabled = false,
  initialAddress = "",
  initialAmount = "",
  initialRound = "private",
  onAdded,
  onRemoved,
}: WhitelistProps) {
  const theme = useTheme();
  const account = useActiveAccount();

  // rows state (dynamic)
  const [rows, setRows] = useState<Row[]>([{ address: initialAddress, amountHuman: initialAmount }]);

  // Keep round in state as RoundKey only; normalize numeric initialRound
  const [round, setRound] = useState<RoundKey>(
    typeof initialRound === "number" ? INDEX_TO_ROUND[initialRound] ?? "private" : initialRound
  );

  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // If initialRound prop changes later, normalize again
    setRound(typeof initialRound === "number" ? INDEX_TO_ROUND[initialRound] ?? "private" : initialRound);
  }, [initialRound]);

  // --------- styles ----------
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
    "& .MuiOutlinedInput-notchedOutline legend": { maxWidth: "60px" },
    "& .MuiOutlinedInput-notchedOutline legend > span": { paddingLeft: 6, paddingRight: 6 },
  } as const;

  const actionBtnSx = {
    textTransform: "none",
    borderRadius: 2,
    px: 3,
    py: 1.75,
    backgroundColor: theme.palette.secondary.main,
    border: `1px solid ${theme.palette.headerBorder.main}`,
    color: theme.palette.text.primary,
    "&:hover": { borderColor: theme.palette.text.primary, background: theme.palette.transparentPaper.main },
  } as const;

  // --------- derived flags ----------
  const firstRow = rows[0]; // for "Remove" (kept for backward compatibility)
  const canSubmitRemove =
    !!account &&
    !!firstRow?.address?.trim() &&
    isAddressLike(firstRow.address.trim()) &&
    !disabled &&
    !busy;

  const canSubmitAdd = useMemo(() => {
    if (!account || disabled || busy) return false;
    // At least one valid (address + positive number) row
    return rows.some(
      (r) =>
        isAddressLike((r.address ?? "").trim()) &&
        !!(r.amountHuman ?? "").trim() &&
        /^\d+(\.\d+)?$/.test((r.amountHuman ?? "").trim())
    );
  }, [account, disabled, busy, rows]);

  // --------- handlers ----------
  const handleAddRow = () => {
    setRows((prev) => [...prev, { address: "", amountHuman: "" }]);
  };

  const handleChangeRow = (i: number, patch: Partial<Row>) => {
    setRows((prev) => {
      const next = [...prev];
      const current = next[i];
      if (!current) return prev; // index guard
  
      next[i] = {
        address: patch.address ?? current.address,
        amountHuman: patch.amountHuman ?? current.amountHuman,
      };
      return next;
    });
  };
  

  const handleRemoveRow = (i: number) => {
    setRows((prev) => (prev.length <= 1 ? prev : prev.filter((_, idx) => idx !== i)));
  };

  const handleAddBatch = async () => {
    if (!account) {
      toast.error("No wallet connected. Please connect an authorized wallet.");
      return;
    }
    try {
      setBusy(true);
      // one tx (unless it needs chunking in utils)
      const txHashes = await addWhitelistRowsSameRoundTx(account, round, rows, {
        // chunkSize: 200, // uncomment to force chunking if you expect very large batches
        dedupe: true,
      });

      toast.success(
        txHashes.length === 1
          ? "Whitelist updated (1 transaction)."
          : `Whitelist updated (${txHashes.length} transactions).`
      );
      // optional: notify for the first address (to keep your existing callback contract)
      const firstAddr = rows.find((r) => isAddressLike((r.address ?? "").trim()))?.address?.trim();
      if (firstAddr) onAdded?.(firstAddr as `0x${string}`);
    } catch (e) {
      console.error(e);
      const msg = e instanceof Error ? e.message : "Failed to add to whitelist.";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async () => {
    if (!account) {
      toast.error("No wallet connected. Please connect an authorized wallet.");
      return;
    }
    const addr = (firstRow?.address ?? "").trim();
    if (!isAddressLike(addr)) {
      toast.error("Enter a valid address (0x...) in the first row to remove.");
      return;
    }

    try {
      setBusy(true);
      await removeFromWhitelistTx(account, [addr]);
      toast.success("Address removed from whitelist.");
      onRemoved?.(addr);
    } catch (e: unknown) {
      console.error(e);
      const msg = e instanceof Error ? e.message : "Failed to remove from whitelist.";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Stack gap={2} width="100%">
      <Stack gap={4}>
        <Stack direction="row" alignItems="start" justifyContent="space-between">
          <Stack gap={0.5}>
            <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              {subtitle}
            </Typography>
          </Stack>

          <Button
            disabled={disabled || busy}
            startIcon={<DownloadRoundedIcon />}
            sx={{
              ...actionBtnSx,
              py: 1.25,
              backgroundColor: theme.palette.secondary.main,
              border: `1px solid ${theme.palette.headerBorder.main}`,
            }}
            onClick={() => {
              toast.info("CSV import coming soon.");
            }}
          >
            <Typography
              variant="body1"
              fontWeight={400}
              sx={{ whiteSpace: "nowrap", display: { xs: "none", md: "block" } }}
            >
              Import CSV
            </Typography>
            <Typography
              variant="body1"
              fontWeight={400}
              sx={{ whiteSpace: "nowrap", display: { xs: "block", md: "none" } }}
            >
              Import
            </Typography>
          </Button>
        </Stack>

        {/* Dynamic rows */}
        <Stack gap={2}>
          {rows.map((row, i) => (
            <Stack key={i} direction={{ xs: "column", md: "row" }} gap={2}>
              <TextField
                fullWidth
                label="Address"
                placeholder="0x..."
                value={row.address}
                onChange={(e) => handleChangeRow(i, { address: e.target.value })}
                disabled={disabled || busy}
                InputLabelProps={{ shrink: true }}
                sx={inputSx}
              />

              <TextField
                fullWidth
                label="Pre-assigned Tokens (URANO)"
                placeholder="e.g. 100000"
                value={row.amountHuman}
                onChange={(e) => handleChangeRow(i, { amountHuman: e.target.value })}
                disabled={disabled || busy}
                InputLabelProps={{ shrink: true }}
                sx={inputSx}
                type="number"
              />

              {/* Add button on the first row; Remove button on additional rows */}
              {i === 0 ? (
                <Button
                  fullWidth
                  onClick={handleAddRow}
                  disabled={disabled || busy}
                  sx={{
                    ...actionBtnSx,
                    "&:hover": { background: theme.palette.uranoGreen1.main },
                    width: "10%",
                    paddingY: 0,
                  }}
                >
                  <Typography variant="h5">+</Typography>
                </Button>
              ) : (
                <Button
                  fullWidth
                  onClick={() => handleRemoveRow(i)}
                  disabled={disabled || busy}
                  sx={{
                    ...actionBtnSx,
                    "&:hover": { background: theme.palette.error.main },
                    width: "10%",
                    paddingY: 0,
                  }}
                >
                  <Typography variant="h6">-</Typography>
                </Button>
              )}
            </Stack>
          ))}
        </Stack>

        {/* Round selector (RoundKey only) */}
        <FormControl fullWidth disabled={disabled || busy}>
          <InputLabel id="whitelist-round-label" shrink sx={{ color: theme.palette.common.white }}>
            Whitelist Round
          </InputLabel>
          <Select
            labelId="whitelist-round-label"
            value={round}
            onChange={(e) => setRound(e.target.value as RoundKey)}
            displayEmpty
            sx={{
              ...inputSx,
              "& .MuiSelect-icon": { color: (theme) => theme.palette.common.white },
              "&.Mui-disabled .MuiSelect-icon": { color: (theme) => theme.palette.text.disabled },
            }}
            label="Whitelist Round"
          >
            {ROUND_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="caption" sx={{ mt: 0.5, color: theme.palette.text.secondary }}>
            Select which round these users belong to. (Impacts pricing/vesting rules.)
          </Typography>
        </FormControl>

        {/* Actions */}
        <Stack direction={{ xs: "column", md: "row" }} gap={2}>
          <Button
            fullWidth
            sx={{ ...actionBtnSx, "&:hover": { background: theme.palette.error.main } }}
            disabled={!canSubmitRemove}
            onClick={handleRemove}
          >
            Remove (first row)
          </Button>

          <Button
            fullWidth
            sx={{
              ...actionBtnSx,
              "&:hover": { background: theme.palette.uranoGradient, color: theme.palette.info.main },
            }}
            disabled={!canSubmitAdd}
            onClick={handleAddBatch}
          >
            Add ({rows.length})
          </Button>
        </Stack>

        {!account && (
          <Box>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Connect an admin wallet to manage the whitelist.
            </Typography>
          </Box>
        )}
      </Stack>
    </Stack>
  );
}
