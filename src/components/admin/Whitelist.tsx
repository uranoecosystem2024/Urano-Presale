"use client";

import { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  useTheme,
} from "@mui/material";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

// date & time picker
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { type Dayjs } from "dayjs";

import { useActiveAccount } from "thirdweb/react";
import { toast } from "react-toastify";

import {
  addToWhitelistHumanTx,
  removeFromWhitelistTx,
} from "@/utils/admin/whitelist";

import UploadWhitelistCsvModal, {
  type WhitelistCsvEntry as CsvEntry,
} from "@/components/admin/WhitelistImportModal";

export type WhitelistProps = {
  title?: string;
  subtitle?: string;
  disabled?: boolean;
  initialAddress?: string;
  initialAmount?: string;
  initialRelease?: Date;
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

export default function Whitelist({
  title = "Whitelist",
  subtitle = "Add addresses to the URANO whitelist",
  disabled = false,
  initialAddress = "",
  initialAmount = "",
  initialRelease,
  onAdded,
  onRemoved,
}: WhitelistProps) {
  const theme = useTheme();
  const account = useActiveAccount();
  const [openUploadModal, setOpenUploadModal] = useState<boolean>(false)

  function OpeningUploadModal(){
    setOpenUploadModal(true)
  }

  function closeUpload(){
    setOpenUploadModal(false)
  }

  const [address, setAddress] = useState<string>(initialAddress);
  const [amountHuman, setAmountHuman] = useState<string>(initialAmount);
  const [releaseDT, setReleaseDT] = useState<Dayjs | null>(
    initialRelease ? dayjs(initialRelease) : dayjs()
  );

  const [busy, setBusy] = useState(false);

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

  function isAddressLike(a: string): a is `0x${string}` {
    return a?.startsWith("0x") && a.length === 42;
  }

  const canSubmitAdd =
    !!account &&
    !!address.trim() &&
    isAddressLike(address.trim()) &&
    !!amountHuman.trim() &&
    !!releaseDT?.isValid?.() &&
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
    if (!releaseDT?.isValid?.()) {
      toast.error("Select a valid release date and time.");
      return;
    }

    try {
      setBusy(true);
      await addToWhitelistHumanTx(account, [
        {
          address: addr,
          preAssignedTokens: amountHuman.trim(),
          releaseDate: releaseDT, // accepts Date/dayjs/number
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

  const handleImportConfirm = async (rows: CsvEntry[]) => {
    if (!account) {
      toast.error("No wallet connected. Please connect an authorized wallet.");
      return;
    }
    if (rows.length === 0) {
      toast.info("No rows to import.");
      return;
    }

    try {
      setBusy(true);
      await addToWhitelistHumanTx(account, rows);
      toast.success(`Imported ${rows.length} whitelist ${rows.length === 1 ? "entry" : "entries"}.`);
      // Optionally notify with the first address
      const first = rows[0]?.address;
      if (first) onAdded?.(first);
    } catch (e: unknown) {
      console.error(e);
      toast.error(getErrorMessage(e) ?? "Failed to import CSV.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
              onClick={() => {OpeningUploadModal()}}
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

          <DateTimePicker
            label="Release Date & Time (TGE unlock for this user)"
            value={releaseDT}
            onChange={(v) => setReleaseDT(v)}
            disabled={disabled || busy}
            slotProps={{
              textField: {
                fullWidth: true,
                sx: inputSx,
                InputLabelProps: { shrink: true },
                helperText:
                  "User can start claiming after this moment (stored on-chain in unix seconds).",
              },
            }}
          />

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
      <UploadWhitelistCsvModal
        open={openUploadModal}
        onClose={closeUpload}
        onConfirm={(rows) => {
          // keep onConfirm's type as () => void by not returning the Promise
          void handleImportConfirm(rows);
        }}
        title="Import Whitelist CSV"
        subtitle='Columns required: "address", "amount", "release"'
      />
    </LocalizationProvider>
  );
}
