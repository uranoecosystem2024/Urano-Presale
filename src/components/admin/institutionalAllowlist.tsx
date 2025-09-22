"use client";

import { useState } from "react";
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
    title?: string;
    subtitle?: string;
    rounds: RoundOption[];
    disabled?: boolean;
    onAdd?: (address: string, roundId: string) => void;
    onRemove?: (address: string, roundId: string) => void;
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
                        disabled={disabled}
                        startIcon={<DownloadRoundedIcon />}
                        sx={{
                            ...actionBtnSx,
                            py: 1.25,
                            backgroundColor: theme.palette.secondary.main,
                            border: `1px solid ${theme.palette.headerBorder.main}`,
                        }}
                        onClick={() => {
                            console.log("Import CSV");
                        }}
                    >
                        <Typography variant="body1" fontWeight={400} sx={{
                            whiteSpace: "nowrap",
                            display: { xs: "none", md: "block" },
                        }}>
                            Import CSV
                        </Typography>
                        <Typography variant="body1" fontWeight={400} sx={{
                            whiteSpace: "nowrap",
                            display: { xs: "block", md: "none" },
                        }}>
                            Import
                        </Typography>
                    </Button>
                </Stack>

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
                            sx={{
                                "& .MuiSelect-icon": {
                                  filter: "invert(1)",
                                },
                              }}
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
