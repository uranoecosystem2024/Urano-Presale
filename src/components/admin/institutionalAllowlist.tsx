// components/institutionalAllowlist.tsx
"use client";

import { useMemo, useState } from "react";
import {
    Box,
    Stack,
    Typography,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    type SelectChangeEvent,
    useTheme,
} from "@mui/material";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

export type RoundOption = { id: string; label: string };

export type InstitutionalAllowlistProps = {
    /** Section title shown above the card */
    title?: string; // default: "Institutional Allowlist"
    /** Line shown inside the card header (left) */
    subtitle?: string; // default: "Withdraw unsold tokens after presale completion"
    /** Rounds for the Select */
    rounds: RoundOption[];
    /** Disable the whole block */
    disabled?: boolean;
    /** Called when user clicks Add */
    onAdd?: (address: string, roundId: string) => void;
    /** Called when user clicks Remove */
    onRemove?: (address: string, roundId: string) => void;
    /** Optional initial values */
    initialAddress?: string;
    initialRoundId?: string;
};

export default function InstitutionalAllowlist({
    title = "Institutional Allowlist",
    subtitle = "Withdraw unsold tokens after presale completion",
    rounds,
    disabled = false,
    onAdd,
    onRemove,
    initialAddress = "",
    initialRoundId = "",
}: InstitutionalAllowlistProps) {
    const theme = useTheme();
    const [address, setAddress] = useState(initialAddress);
    const [roundId, setRoundId] = useState(initialRoundId);

    const inputSx = {
        "& .MuiOutlinedInput-root": {
            background: theme.palette.background.paper,
            borderRadius: 2,
            "& fieldset": { borderColor: theme.palette.headerBorder.main },
            "&:hover fieldset": { borderColor: theme.palette.text.primary },
            "&.Mui-focused fieldset": { borderColor: theme.palette.uranoGreen1.main },
        },
        "& .MuiInputBase-input::placeholder": { opacity: 0.7 },
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

    return (
        <Stack gap={2} width="100%">
            {/* Card */}
            <Stack gap={4}>
                {/* Header row */}
                <Stack direction="row" alignItems="start" justifyContent="space-between">
                    <Stack gap={0.5}>
                        <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                            {title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                            {subtitle}
                        </Typography>
                    </Stack>

                    {/* Non-functional for now (front-end only) */}
                    <Button
                        disabled={disabled}
                        startIcon={<DownloadRoundedIcon />}
                        sx={{
                            ...actionBtnSx,
                            py: 1.25,
                            backgroundColor: theme.palette.secondary.main,
                            border: `1px solid ${theme.palette.headerBorder.main}`,
                        }}
                        onClick={() => {
                            /* no-op (placeholder) */
                        }}
                    >
                        Import CSV
                    </Button>
                </Stack>

                {/* Inputs */}
                <Stack direction={{ xs: "column", md: "row" }} gap={2}>
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

                    <FormControl fullWidth disabled={disabled} sx={inputSx}>
                        <InputLabel id="round-select-label" shrink>
                            Round
                        </InputLabel>
                        <Select
                            labelId="round-select-label"
                            value={roundId}
                            onChange={(e: SelectChangeEvent<string>) => setRoundId(e.target.value)}
                            displayEmpty
                            renderValue={(val) =>
                                val
                                    ? rounds.find((r) => r.id === val)?.label ?? val
                                    : <Box component="span" sx={{ color: theme.palette.text.secondary }}>Select round</Box>
                            }
                            label="Round"
                        >
                            {rounds.map((r) => (
                                <MenuItem key={r.id} value={r.id}>
                                    {r.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>

                {/* Actions */}
                <Stack direction={{ xs: "column", md: "row" }} gap={2}>
                    <Button
                        fullWidth
                        sx={{
                            ...actionBtnSx,
                            "&:hover": {
                                background: theme.palette.error.main,
                            },
                        }}
                        onClick={() => onRemove?.(address.trim(), roundId)}
                    >
                        Remove
                    </Button>

                    <Button
                        fullWidth
                        sx={{
                            ...actionBtnSx,
                            "&:hover": {
                                background: theme.palette.uranoGradient,
                                color: theme.palette.info.main,
                            },
                        }}
                        onClick={() => onAdd?.(address.trim(), roundId)}
                    >
                        Add
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    );
}
