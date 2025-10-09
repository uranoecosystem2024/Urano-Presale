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
    InputAdornment,
} from "@mui/material";
import { useActiveAccount } from "thirdweb/react";
import { toast } from "react-toastify";

import {
    addManualPurchasesSameRoundTx,
    isAddressLike,
    coerceRoundId,
    getRoundOptions,
    type RoundKey,
    type RoundOption,
} from "@/utils/admin/manualSepaPurchase";

export type ManualSepaPurchaseProps = {
    title?: string;
    subtitle?: string;
    rounds?: RoundOption[];
    tokenSymbol?: string;
    disabled?: boolean;
    initialRoundId?: string;
    onAddedFirst?: (address: `0x${string}`) => void;
};

type Row = {
    address: string;
    usdcAmount: string;
    reference?: string;
};

export default function ManualSepaPurchase({
    title = "Manual SEPA Purchase",
    subtitle = "Add SEPA purchases manually (one tx per row)",
    rounds,
    tokenSymbol = "USDC",
    disabled = false,
    initialRoundId = "",
    onAddedFirst,
}: ManualSepaPurchaseProps) {
    const theme = useTheme();
    const account = useActiveAccount();

    const roundOptions = useMemo<RoundOption[]>(
        () => (rounds?.length ? rounds : getRoundOptions()),
        [rounds]
    );

    const [rows, setRows] = useState<Row[]>([{ address: "", usdcAmount: "", reference: "" }]);
    const [busy, setBusy] = useState(false);

    const firstRoundId = roundOptions[0]?.id ?? "";
    const [roundId, setRoundId] = useState<string>(initialRoundId || firstRoundId);

    useEffect(() => {
        if (initialRoundId) setRoundId(initialRoundId);
    }, [initialRoundId]);

    useEffect(() => {
        if (!initialRoundId && !roundId && firstRoundId) {
            setRoundId(firstRoundId);
        }
    }, [firstRoundId, initialRoundId, roundId]);

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

    const canSubmit = useMemo(() => {
        if (!account || disabled || busy || !roundId) return false;
        return rows.some(
            (r) =>
                isAddressLike((r.address ?? "").trim()) &&
                !!(r.usdcAmount ?? "").trim() &&
                /^\d+(\.\d+)?$/.test((r.usdcAmount ?? "").trim()) &&
                Number(r.usdcAmount) > 0
        );
    }, [account, disabled, busy, rows, roundId]);

    const handleAddRow = () => {
        setRows((prev) => [...prev, { address: "", usdcAmount: "", reference: "" }]);
    };

    const handleChangeRow = (i: number, patch: Partial<Row>) => {
        setRows((prev) => {
            const next = [...prev];
            const current = next[i];
            if (!current) return prev;
            next[i] = {
                address: patch.address ?? current.address,
                usdcAmount: patch.usdcAmount ?? current.usdcAmount,
                reference: patch.reference ?? current.reference,
            };
            return next;
        });
    };

    const handleRemoveRow = (i: number) => {
        setRows((prev) => (prev.length <= 1 ? prev : prev.filter((_, idx) => idx !== i)));
    };

    const sanitizeAmount = (v: string) => {
        const sanitized = v.replace(/[^\d.]/g, "");
        const parts = sanitized.split(".");
        return parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : sanitized;
    };

    const handleSubmit = async () => {
        if (!account) {
            toast.error("No wallet connected. Please connect an authorized admin wallet.");
            return;
        }
        if (!roundId) {
            toast.error("Please select a round.");
            return;
        }

        try {
            setBusy(true);

            const cleaned = rows
                .map((r) => ({
                    address: (r.address ?? "").trim(),
                    amountUsdcHuman: sanitizeAmount(r.usdcAmount ?? "").trim(),
                    reference: (r.reference ?? "").trim(),
                }))
                .filter(
                    (r) =>
                        isAddressLike(r.address) &&
                        !!r.amountUsdcHuman &&
                        /^\d+(\.\d+)?$/.test(r.amountUsdcHuman) &&
                        Number(r.amountUsdcHuman) > 0
                );

            if (!cleaned.length) {
                toast.error("Enter at least one valid row (0x address + positive USDC amount).");
                return;
            }

            const roundCoerced: RoundKey | number = coerceRoundId(roundId);
            const hashes = await addManualPurchasesSameRoundTx(account, roundCoerced, cleaned, { dedupe: true });

            toast.success(
                hashes.length === 1
                    ? "FIAT Purchase added (1 transaction)."
                    : `FIAT Purchases added (${hashes.length} transactions).`
            );

            const firstAddr = cleaned.find((r) => isAddressLike(r.address))?.address as `0x${string}` | undefined;
            if (firstAddr && onAddedFirst) onAddedFirst(firstAddr);

            setRows([{ address: "", usdcAmount: "", reference: "" }]);
        } catch (e: unknown) {
            console.error(e);
            const msg = e instanceof Error ? e.message : "Failed to add purchases.";
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
                </Stack>

                <Stack gap={0}>
                    {rows.map((row, i) => (
                        <Stack key={i} direction={{ xs: "column", md: "row" }} gap={2} alignItems={"stretch"}>
                            <TextField
                                fullWidth
                                label="Buyer Address"
                                placeholder="0x..."
                                value={row.address}
                                onChange={(e) => handleChangeRow(i, { address: e.target.value })}
                                disabled={disabled || busy}
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    ...inputSx,
                                    width: "70%"
                                }}
                            />

                            <TextField
                                fullWidth
                                label={`Amount (${tokenSymbol})`}
                                placeholder="e.g. 1000"
                                value={row.usdcAmount}
                                onChange={(e) => handleChangeRow(i, { usdcAmount: sanitizeAmount(e.target.value) })}
                                disabled={disabled || busy}
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    ...inputSx,
                                    width: "30%"
                                }}
                                inputMode="decimal"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">{tokenSymbol}</InputAdornment>,
                                }}
                                error={
                                    !!row.usdcAmount &&
                                    (!/^\d+(\.\d+)?$/.test(row.usdcAmount) || Number(row.usdcAmount) <= 0)
                                }
                                helperText={
                                    !!row.usdcAmount &&
                                        (!/^\d+(\.\d+)?$/.test(row.usdcAmount) || Number(row.usdcAmount) <= 0)
                                        ? "Enter a valid positive number"
                                        : " "
                                }
                            />

                            {i === 0 ? (
                                <Button
                                    fullWidth
                                    onClick={handleAddRow}
                                    disabled={disabled || busy}
                                    sx={{
                                        ...actionBtnSx,
                                        "&:hover": { background: theme.palette.uranoGreen1.main },
                                        width: "10%",
                                        minHeight: 56,
                                        height: 56,
                                        alignSelf: "stretch",
                                        p: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
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
                                        "&:hover": { background: theme.palette.uranoGreen1.main },
                                        width: "10%",
                                        minHeight: 56,
                                        height: 56,
                                        alignSelf: "stretch",
                                        p: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                      
                                >
                                    <Typography variant="h6">-</Typography>
                                </Button>
                            )}
                        </Stack>
                    ))}
                </Stack>

                <FormControl fullWidth disabled={disabled || busy}>
                    <InputLabel id="sepa-round-label" shrink sx={{ color: theme.palette.common.white }}>
                        Round
                    </InputLabel>
                    <Select
                        labelId="sepa-round-label"
                        value={roundId}
                        onChange={(e) => setRoundId(e.target.value)}
                        displayEmpty
                        sx={{
                            ...inputSx,
                            "& .MuiSelect-icon": { color: (theme) => theme.palette.common.white },
                            "&.Mui-disabled .MuiSelect-icon": { color: (theme) => theme.palette.text.disabled },
                        }}
                        label="Round"
                        renderValue={(val) =>
                            val ? roundOptions.find((r) => r.id === val)?.label ?? val : "Select round"
                        }
                    >
                        {roundOptions.map((r) => (
                            <MenuItem key={r.id} value={r.id}>
                                {r.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Stack direction={{ xs: "column", md: "row" }} gap={2}>
                    <Button
                        fullWidth
                        sx={{
                            ...actionBtnSx,
                            "&:hover": { background: theme.palette.uranoGradient, color: theme.palette.info.main },
                        }}
                        disabled={!canSubmit}
                        onClick={handleSubmit}
                    >
                        {busy ? "Adding…" : `Add Purchases (${rows.length})`}
                    </Button>
                </Stack>

                {!account && (
                    <Box>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                            Connect an admin wallet to add purchases.
                        </Typography>
                    </Box>
                )}
            </Stack>
        </Stack>
    );
}
