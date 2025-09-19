"use client";

import { useMemo, useState } from "react";
import {
    Box,
    Stack,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    type SelectChangeEvent,
    Button,
    useTheme,
} from "@mui/material";

export type RoundOption = { id: string; label: string };

export type WithdrawUnsoldTokensProps = {
    title?: string;
    subtitle?: string;
    rounds: RoundOption[];
    disabled?: boolean;
    loading?: boolean;
    initialAddress?: string;
    initialRoundId?: string;
    onWithdraw?: (address: string, roundId: string) => void;
};

export default function WithdrawUnsoldTokens({
    title = "Withdraw Unsold Tokens",
    subtitle = "Withdraw remaining tokens after presale ends",
    rounds,
    disabled = false,
    loading = false,
    initialAddress = "",
    initialRoundId = "",
    onWithdraw,
}: WithdrawUnsoldTokensProps) {
    const theme = useTheme();
    const [address, setAddress] = useState(initialAddress);
    const [roundId, setRoundId] = useState(initialRoundId);

    const canSubmit = useMemo(
        () => address.trim().length > 0 && roundId !== "" && !disabled && !loading,
        [address, roundId, disabled, loading]
    );

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

    const handleSubmit = () => {
        if (!canSubmit) return;
        onWithdraw?.(address.trim(), roundId);
    };

    const enterToSubmit = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSubmit();
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

            <Stack direction={{ xs: "column", md: "row" }} gap={2} alignItems="stretch">
                <TextField
                    fullWidth
                    label="Address"
                    placeholder="Enter address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onKeyDown={enterToSubmit}
                    disabled={disabled}
                    InputLabelProps={{ shrink: true }}
                    sx={{ ...inputSx, flex: 1, minWidth: 220 }}
                />

                <FormControl fullWidth disabled={disabled} sx={{ ...inputSx, flex: 0.6, minWidth: 220 }}>
                    <InputLabel id="withdraw-round-label" shrink>
                        Round
                    </InputLabel>
                    <Select
                        labelId="withdraw-round-label"
                        value={roundId}
                        onChange={(e: SelectChangeEvent<string>) => setRoundId(e.target.value)}
                        displayEmpty
                        label="Round"
                        renderValue={(val) =>
                            val
                                ? rounds.find((r) => r.id === val)?.label ?? val
                                : <Box component="span" sx={{ color: theme.palette.text.secondary }}>Select round</Box>
                        }
                    >
                        {rounds.map((r) => (
                            <MenuItem key={r.id} value={r.id}>
                                {r.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    onClick={handleSubmit}
                    sx={{
                        ...actionBtnSx,
                        width: "fit-content",
                        minWidth: "20%",
                        height: "fit-content",
                        "&:hover": {
                            background: theme.palette.uranoGradient,
                            color: theme.palette.info.main,
                        },
                    }}
                >
                    {loading ? "Withdrawing…" : "Withdraw"}
                </Button>
            </Stack>
        </Stack>
    );
}
