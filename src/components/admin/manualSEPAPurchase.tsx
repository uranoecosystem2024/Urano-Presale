"use client";

import { useMemo, useState } from "react";
import {
    Stack,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    type SelectChangeEvent,
    Button,
    InputAdornment,
    useTheme,
} from "@mui/material";

export type RoundOption = { id: string; label: string };

export type ManualSepaPurchaseProps = {
    title?: string;
    subtitle?: string;
    rounds: RoundOption[];
    tokenSymbol?: string;
    disabled?: boolean;
    loading?: boolean;
    initialAddress?: string;
    initialRoundId?: string;
    initialAmount?: string | number;
    initialReference?: string;
    onSubmit?: (payload: {
        address: string;
        roundId: string;
        amount: number;
        reference: string;
    }) => void;
};

export default function ManualSepaPurchase({
    title = "Manual SEPA Purchase",
    subtitle = "Add SEPA purchase manually to the system",
    rounds,
    tokenSymbol = "URANO",
    disabled = false,
    loading = false,
    initialAddress = "",
    initialRoundId = "",
    initialAmount = "",
    initialReference = "",
    onSubmit,
}: ManualSepaPurchaseProps) {
    const theme = useTheme();

    const [address, setAddress] = useState(initialAddress);
    const [roundId, setRoundId] = useState(initialRoundId);
    const [amountStr, setAmountStr] = useState(String(initialAmount ?? ""));
    const [reference, setReference] = useState(initialReference);

    const amount = useMemo(() => {
        const n = Number(amountStr);
        return Number.isFinite(n) ? n : NaN;
    }, [amountStr]);

    const canSubmit =
        !!address.trim() && !!roundId && Number.isFinite(amount) && amount > 0 && !disabled && !loading;

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

    const handleAmountChange = (v: string) => {
        const sanitized = v.replace(/[^\d.]/g, "");
        const parts = sanitized.split(".");
        const next = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : sanitized;
        setAmountStr(next);
    };

    const submit = () => {
        if (!canSubmit) return;
        onSubmit?.({
            address: address.trim(),
            roundId,
            amount: Number(amountStr),
            reference: reference.trim(),
        });
    };

    const enterToSubmit = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") submit();
    };

    return (
        <Stack gap={2} width="100%">
            <Stack gap={4}>
                <Stack gap={0.5}>
                    <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                        {title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        {subtitle}
                    </Typography>
                </Stack>

                <TextField
                    fullWidth
                    label="Address"
                    placeholder="Enter address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onKeyDown={enterToSubmit}
                    disabled={disabled}
                    InputLabelProps={{ shrink: true }}
                    sx={inputSx}
                />

                <Stack direction={{ xs: "column", lg: "row" }} gap={2} alignItems="stretch">
                    <FormControl fullWidth disabled={disabled} sx={inputSx}>
                        <InputLabel id="sepa-round-label" shrink>
                            Round
                        </InputLabel>
                        <Select
                            labelId="sepa-round-label"
                            value={roundId}
                            onChange={(e: SelectChangeEvent<string>) => setRoundId(e.target.value)}
                            displayEmpty
                            label="Round"
                            sx={{
                                "& .MuiSelect-icon": {
                                  filter: "invert(1)",
                                },
                              }}
                            renderValue={(val) =>
                                val
                                    ? rounds.find((r) => r.id === val)?.label ?? val
                                    : <span style={{ color: theme.palette.text.secondary }}>Select round</span>
                            }
                        >
                            {rounds.map((r) => (
                                <MenuItem key={r.id} value={r.id}>
                                    {r.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Token Amount"
                        placeholder="0"
                        value={amountStr}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        onKeyDown={enterToSubmit}
                        disabled={disabled}
                        inputMode="decimal"
                        sx={inputSx}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">{tokenSymbol}</InputAdornment>,
                        }}
                        InputLabelProps={{ shrink: true }}
                        error={!!amountStr && (!Number.isFinite(amount) || amount <= 0)}
                        helperText={
                            !!amountStr && (!Number.isFinite(amount) || amount <= 0) ? "Enter a valid amount" : " "
                        }
                    />

                    <TextField
                        fullWidth
                        label="Reference"
                        placeholder="Reference"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        onKeyDown={enterToSubmit}
                        disabled={disabled}
                        InputLabelProps={{ shrink: true }}
                        sx={inputSx}
                    />

                    <Button
                        onClick={submit}
                        sx={{
                            ...actionBtnSx,
                            width: "fit-content",
                            minWidth: {xs: "100%", lg: "20%"},
                            height: "fit-content",
                            "&:hover": {
                                background: theme.palette.uranoGradient,
                                color: theme.palette.info.main,
                            },
                        }}
                    >
                        <Typography variant="body1" fontWeight={400} sx={{
                            whiteSpace: "nowrap",
                        }}>
                            {loading ? "Adding…" : "Add Purchase"}
                        </Typography>
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    );
}
