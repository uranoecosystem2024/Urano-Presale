"use client";

import { useEffect, useState } from "react";
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
  addToWhitelistHumanTx,
  removeFromWhitelistTx,
  type RoundKey,
} from "@/utils/admin/whitelist";

export type WhitelistProps = {
  title?: string;
  subtitle?: string;
  disabled?: boolean;
  initialAddress?: string;
  initialAmount?: string;
  /** Default whitelist round (enum key or uint8). */
  initialRound?: RoundKey | number;
  onAdded?: (address: `0x${string}`) => void;
  onRemoved?: (address: `0x${string}`) => void;
};

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "Unexpected error";
  }
}

function isAddressLike(a: string): a is `0x${string}` {
  return a?.startsWith("0x") && a.length === 42;
}

const ROUND_OPTIONS: { label: string; value: RoundKey }[] = [
  { label: "Seed", value: "seed" },
  { label: "Private", value: "private" },
  { label: "Institutional", value: "institutional" },
  { label: "Strategic", value: "strategic" },
  { label: "Community", value: "community" },
];

// enum index <-> key maps (keep in sync with contract)
const INDEX_TO_ROUND: Record<number, RoundKey> = {
  0: "seed",
  1: "private",
  2: "institutional",
  3: "strategic",
  4: "community",
};
const ROUND_TO_INDEX: Record<RoundKey, number> = {
  seed: 0,
  private: 1,
  institutional: 2,
  strategic: 3,
  community: 4,
};

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

  const [address, setAddress] = useState<string>(initialAddress);
  const [amountHuman, setAmountHuman] = useState<string>(initialAmount);

  // Keep round in state as RoundKey only; normalize numeric initialRound
  const [round, setRound] = useState<RoundKey>(
    typeof initialRound === "number" ? INDEX_TO_ROUND[initialRound] ?? "private" : initialRound
  );

  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // If initialRound prop changes later, normalize again
    setRound(typeof initialRound === "number" ? INDEX_TO_ROUND[initialRound] ?? "private" : initialRound);
  }, [initialRound]);

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
    py: 1.75,
    backgroundColor: theme.palette.secondary.main,
    border: `1px solid ${theme.palette.headerBorder.main}`,
    color: theme.palette.text.primary,
    "&:hover": {
      borderColor: theme.palette.text.primary,
      background: theme.palette.transparentPaper.main,
    },
  } as const;

  const canSubmitAdd =
    !!account &&
    !!address.trim() &&
    isAddressLike(address.trim()) &&
    !!amountHuman.trim() &&
    !disabled &&
    !busy;

  const canSubmitRemove =
    !!account && !!address.trim() && isAddressLike(address.trim()) && !disabled && !busy;

  const handleAdd = async () => {
    if (!account) {
      toast.error("No wallet connected. Please connect an authorized wallet.");
      return;
    }
    const addr = address.trim() as `0x${string}`;
    if (!isAddressLike(addr)) {
      toast.error("Enter a valid address (0x...)");
      return;
    }
    if (!amountHuman.trim()) {
      toast.error("Enter a pre-assigned tokens amount.");
      return;
    }

    try {
      setBusy(true);
      await addToWhitelistHumanTx(account, [
        {
          address: addr,
          preAssignedTokens: amountHuman.trim(),
          // you can pass the enum index or the key; util accepts both
          whitelistRound: ROUND_TO_INDEX[round],
        },
      ]);
      toast.success("Address added to whitelist.");
      onAdded?.(addr);
    } catch (e: unknown) {
      console.error(e);
      toast.error(getErrorMessage(e) ?? "Failed to add to whitelist.");
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async () => {
    if (!account) {
      toast.error("No wallet connected. Please connect an authorized wallet.");
      return;
    }
    const addr = address.trim() as `0x${string}`;
    if (!isAddressLike(addr)) {
      toast.error("Enter a valid address (0x...)");
      return;
    }

    try {
      setBusy(true);
      await removeFromWhitelistTx(account, [addr]);
      toast.success("Address removed from whitelist.");
      onRemoved?.(addr);
    } catch (e: unknown) {
      console.error(e);
      toast.error(getErrorMessage(e) ?? "Failed to remove from whitelist.");
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
              // Hook up CSV import here if/when you add it
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

        {/* Inputs */}
        <Stack direction={{ xs: "column", md: "row" }} gap={2}>
          <TextField
            fullWidth
            label="Address"
            placeholder="0x..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={disabled || busy}
            InputLabelProps={{ shrink: true }}
            sx={inputSx}
          />

          <TextField
            fullWidth
            label="Pre-assigned Tokens (URANO)"
            placeholder="e.g. 100000"
            value={amountHuman}
            onChange={(e) => setAmountHuman(e.target.value)}
            disabled={disabled || busy}
            InputLabelProps={{ shrink: true }}
            sx={inputSx}
            type="number"
          />
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
              '& .MuiSelect-icon': {
                color: (theme) => theme.palette.common.white, // chevron color
              },
              '&.Mui-disabled .MuiSelect-icon': {
                color: (theme) => theme.palette.text.disabled, // optional: nicer when disabled
              },
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
            Select which round this user belongs to. (Impacts pricing/vesting rules.)
          </Typography>
        </FormControl>

        {/* Actions */}
        <Stack direction={{ xs: "column", md: "row" }} gap={2}>
          <Button
            fullWidth
            sx={{
              ...actionBtnSx,
              "&:hover": { background: theme.palette.error.main },
            }}
            disabled={!canSubmitRemove}
            onClick={handleRemove}
          >
            Remove
          </Button>

          <Button
            fullWidth
            sx={{
              ...actionBtnSx,
              "&:hover": { background: theme.palette.uranoGradient, color: theme.palette.info.main },
            }}
            disabled={!canSubmitAdd}
            onClick={handleAdd}
          >
            Add
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
