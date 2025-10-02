// components/MainSection/statusBar.tsx
"use client";

import { Stack, Typography, Box } from "@mui/material";
import { useMemo } from "react";
import { usePresaleProgress } from "@/hooks/usePresaleProgress";
import { useTheme } from "@mui/material/styles";

/** ---- helpers ---- **/

function toUnits(raw: bigint, decimals: number): number {
    if (decimals <= 0) return Number(raw);
    const div = 10 ** Math.min(decimals, 18);
    if (decimals <= 18) return Number(raw) / div;
    const extra = decimals - 18;
    return Number(raw / BigInt(10 ** extra)) / 1e18;
}

const nfCompact = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
});

function formatTokenCompact(raw: bigint, decimals: number): string {
    const v = toUnits(raw, decimals);
    return nfCompact.format(v);
}

// ---- tile (unsold) setup ----
// single cell is 20x18; we add a small horizontal gap (e.g., 4px) between cells
const CELL_W = 20;
const CELL_H = 18;
const CELL_GAP_X = 4;

// This is your provided tile, encoded for a data URL.
const TILE_SVG_ENC = encodeURIComponent(
    `<svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.35596 1.83391C1.44235 0.797326 2.30888 0 3.34905 0H17.7743C18.9663 0 19.8937 1.03613 19.762 2.22086L18.2065 16.2209C18.0939 17.2337 17.2378 18 16.2187 18H2.18239C1.01231 18 0.0921267 16.9999 0.189297 15.8339L1.35596 1.83391Z" fill="#171717" fill-opacity="0.48"/>
    <path d="M3.34863 0.5H17.7744C18.6684 0.50009 19.3634 1.27752 19.2646 2.16602L17.71 16.166C17.6254 16.9255 16.9829 17.5 16.2188 17.5H2.18262C1.30506 17.5 0.614623 16.7495 0.6875 15.875L1.85449 1.875C1.91948 1.09792 2.56884 0.500216 3.34863 0.5Z" stroke="white" stroke-opacity="0.31"/>
  </svg>`
);

// Build the data URL once
const TILE_BG_URL = `url("data:image/svg+xml;utf8,${TILE_SVG_ENC}")`;

export default function StatusBar() {
    const { loading, error, data } = usePresaleProgress();
    const theme = useTheme();

    // 0..100% for the green fill
    const pct: number = useMemo(() => {
        const raw = !loading && data ? Number(data.purchasedPercent) : 0;
        if (!Number.isFinite(raw)) return 0;
        return Math.max(0, Math.min(100, raw));
    }, [loading, data]);

    // Adjust to your token decimals if not 18
    const TOKEN_DECIMALS = 18;

    const fmtPct = useMemo(() => `${pct.toFixed(2)}%`, [pct]);
    const fmtSold = data ? formatTokenCompact(data.totalTokensSold, TOKEN_DECIMALS) : "—";
    const fmtMax = data ? formatTokenCompact(data.maxTokensToSell, TOKEN_DECIMALS) : "—";

    return (
        <Stack width="100%" gap={1}>
            {/* Top row: label + percent */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" sx={{ fontStyle: "italic" }}>
                    Status
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                    {loading ? "Loading…" : fmtPct}
                </Typography>
            </Stack>

            {/* Progress bar */}
            <Box
                role="progressbar"
                aria-valuenow={Math.round(pct)}
                aria-valuemin={0}
                aria-valuemax={100}
                sx={{
                    position: "relative",
                    width: "100%",
                    height: CELL_H,
                    borderRadius: "3px",
                    overflow: "hidden",
                    // a faint base color behind tiles (only visible between rows/edges)
                    backgroundColor: "transparent",
                    //border: "1px solid rgba(255, 255, 255, 0.31)",
                    boxSizing: "border-box",

                }}
            >
                {/* UNSOLD layer: repeating tile with a small horizontal gap */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        backgroundOrigin: "content-box",
                        backgroundImage: TILE_BG_URL,
                        backgroundRepeat: "repeat-x",
                        backgroundPosition: "right center",
                        backgroundSize: `${CELL_W + CELL_GAP_X}px ${CELL_H}px`,
                        pointerEvents: "none",
                        zIndex: 0,

                    }}
                />

                {/* SOLD layer: single SVG chevron (matches your big-segment SVG) */}
                <Box
                    component="svg"
                    sx={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: pct === 0 ? 0 : `${pct}%`, // grows with % sold
                        height: CELL_H,
                        zIndex: 1,
                        pointerEvents: "none",
                        transition: "width 400ms ease",
                    }}
                    viewBox="0 0 85 18"
                    preserveAspectRatio="none"
                >
                    {/* SOLID fill (your spec) */}
                    <path
                        d="M82.5918 0C83.7838 0 84.7116 1.03606 84.5801 2.2207L83.0244 16.2207C82.9119 17.2336 82.0552 18 81.0361 18H2C0.829946 18 -0.090286 17 0.00683594 15.834L1.17383 1.83398C1.26021 0.7974 2.12681 0 3.16699 0H82.5918Z"
                        fill="#5EBBC3"
                    />

                    <path fill="url(#soldGrad)" />
                    {false && (
                        <>
                            <defs>
                                <linearGradient id="soldGrad" x1="0" y1="9" x2="84.5927" y2="9" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#5EBBC3" />
                                    <stop offset="1" stopColor="#6DE7C2" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M82.5918 0C83.7838 0 84.7116 1.03606 84.5801 2.2207L83.0244 16.2207C82.9119 17.2336 82.0552 18 81.0361 18H2C0.829946 18 -0.090286 17 0.00683594 15.834L1.17383 1.83398C1.26021 0.7974 2.12681 0 3.16699 0H82.5918Z"
                                fill="url(#soldGrad)"
                            />
                        </>
                    )}
                </Box>


            </Box>

            {/* Bottom row: round + counters */}
            {!loading && !error && data ? (
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" color="text.secondary">
                        Sold: {fmtSold}{" "}
                        <span
                            style={{
                                fontWeight: 600,
                                background: theme.palette.uranoGradient,
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                marginBottom: 2,
                            }}
                        >
                            $URANO
                        </span>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Max: {fmtMax}{" "}
                        <span
                            style={{
                                fontWeight: 600,
                                background: theme.palette.uranoGradient,
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                marginBottom: 2,
                            }}
                        >
                            $URANO
                        </span>
                    </Typography>
                </Stack>
            ) : error ? (
                <Typography variant="caption" color="error.main">
                    {error}
                </Typography>
            ) : null}
        </Stack>
    );
}
