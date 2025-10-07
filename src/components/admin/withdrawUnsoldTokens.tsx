"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Stack,
  Typography,
  TextField,
  Button,
  useTheme,
} from "@mui/material";
import { useActiveAccount } from "thirdweb/react";
import { toast } from "react-toastify";

import {
  getTreasuryAddress,
  readContractTokenBalanceHuman,
  withdrawUnsoldTokensHumanTx,
  getTokenDecimals,
  toUnits,
  readContractTokenBalanceRaw,
} from "@/utils/admin/withdrawUnsold";

export type WithdrawUnsoldTokensProps = {
  title?: string;
  subtitle?: string;
  disabled?: boolean;
  loading?: boolean;
  initialAmount?: string;
  onWithdrawSuccess?: (params: { amount: string; txHash: `0x${string}` }) => void;
};

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try { return JSON.stringify(err); } catch { return "Unknown error"; }
}

export default function WithdrawUnsoldTokens({
  title = "Withdraw Unsold Tokens",
  subtitle = "Withdraw remaining tokens after presale ends",
  disabled = false,
  loading = false,
  initialAmount = "",
  onWithdrawSuccess,
}: WithdrawUnsoldTokensProps) {
  const theme = useTheme();
  const account = useActiveAccount();

  const [amountHuman, setAmountHuman] = useState(initialAmount);
  const [treasury, setTreasury] = useState<`0x${string}` | "">("");
  const [balanceHuman, setBalanceHuman] = useState<string>("");
  const [balanceRaw, setBalanceRaw] = useState<bigint | null>(null);
  const [decimals, setDecimals] = useState<number | null>(null);
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
      background: theme.palette.uranoGradient,
      color: theme.palette.info.main,
    },
  } as const;

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const [tre, dec, balRaw] = await Promise.all([
          getTreasuryAddress(),
          getTokenDecimals(),
          readContractTokenBalanceRaw(),
        ]);
        const balHuman = await readContractTokenBalanceHuman();

        if (!cancelled) {
          setTreasury(tre);
          setDecimals(dec);
          setBalanceRaw(balRaw);
          setBalanceHuman(balHuman);
        }
      } catch (e) {
        console.error("Failed to read treasury/decimals/balance:", e);
      }
    };
    void run();
    return () => { cancelled = true; };
  }, []);

  const amountExceedsBalance = useMemo(() => {
    if (!decimals || balanceRaw === null) return false;
    const trimmed = amountHuman.trim();
    if (!trimmed || !/^\d+(\.\d+)?$/.test(trimmed)) return false;
    try {
      const rawAmt = toUnits(trimmed, decimals);
      return rawAmt > balanceRaw;
    } catch {
      return false;
    }
  }, [amountHuman, decimals, balanceRaw]);

  const canSubmit = useMemo(() => {
    if (disabled || loading || busy) return false;
    const amt = amountHuman.trim();
    if (!amt || !/^\d+(\.\d+)?$/.test(amt)) return false;
    if (Number(amt) <= 0) return false;
    if (amountExceedsBalance) return false;
    return true;
  }, [amountHuman, disabled, loading, busy, amountExceedsBalance]);

  const refreshBalance = async () => {
    try {
      const [balHuman, balRaw] = await Promise.all([
        readContractTokenBalanceHuman(),
        readContractTokenBalanceRaw(),
      ]);
      setBalanceHuman(balHuman);
      setBalanceRaw(balRaw);
    } catch { /* ignore */ }
  };

  const handleWithdraw = async () => {
    if (!canSubmit) return;
    if (!account) {
      toast.error("No wallet connected. Please connect an authorized wallet.");
      return;
    }

    try {
      setBusy(true);

      try {
        const dec = decimals ?? (await getTokenDecimals());
        const rawBal = balanceRaw ?? (await readContractTokenBalanceRaw());
        const rawAmt = toUnits(amountHuman.trim(), dec);
        if (rawAmt > rawBal) {
          toast.error("Amount exceeds the contract’s token balance.");
          setBusy(false);
          return;
        }
      } catch {
      }

      const txHash = await withdrawUnsoldTokensHumanTx(account, amountHuman.trim());
      toast.success("Withdrawal confirmed.");

      await refreshBalance();
      setAmountHuman("");
      onWithdrawSuccess?.({ amount: amountHuman.trim(), txHash });
    } catch (e) {
      console.error(e);
      toast.error(getErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const enterToSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") void handleWithdraw();
  };

  return (
    <Stack gap={4} width="100%">
      <Stack gap={0.5}>
        <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
          {subtitle}
        </Typography>
      </Stack>

      <Stack gap={2} direction={{ xs: "column", md: "row" }}>
        <TextField
          fullWidth
          label="Treasury (read-only)"
          value={treasury || "—"}
          InputProps={{ readOnly: true }}
          InputLabelProps={{ shrink: true }}
          sx={{ ...inputSx, flex: 1, minWidth: 260 }}
        />
        <TextField
          fullWidth
          label="Contract Balance ($URANO, read-only)"
          value={balanceHuman || "—"}
          InputProps={{ readOnly: true}}
          InputLabelProps={{ shrink: true }}
          sx={{ ...inputSx, flex: 1, minWidth: 220 }}
        />
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} gap={2} alignItems="stretch">
        <TextField
          fullWidth
          label="Amount to Withdraw (URANO)"
          placeholder="0"
          value={amountHuman}
          onChange={(e) => setAmountHuman(e.target.value)}
          onKeyDown={enterToSubmit}
          disabled={disabled || loading || busy}
          InputLabelProps={{ shrink: true }}
          sx={{ ...inputSx, flex: 1, minWidth: 220 }}
          type="number"
          error={amountExceedsBalance}
          helperText={amountExceedsBalance ? "Amount exceeds contract balance." : " "}
        />

        <Button
          onClick={handleWithdraw}
          disabled={!canSubmit}
          sx={{
            ...actionBtnSx,
            width: "fit-content",
            minWidth: { xs: "100%", lg: "20%" },
            height: "fit-content",
          }}
        >
          {busy || loading ? "Withdrawing…" : "Withdraw"}
        </Button>
      </Stack>
    </Stack>
  );
}
