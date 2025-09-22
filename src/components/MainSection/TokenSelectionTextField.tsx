"use client";

import * as React from "react";
import {
  TextField,
  InputAdornment,
  Button,
  Avatar,
  Box,
  type Theme,
  type SxProps,
} from "@mui/material";

type StablecoinFieldProps = {
  label?: string;
  value: string | number;
  onChange?: (v: number) => void;
  tokenSymbol?: string;
  tokenIconSrc?: string;
  onPickToken?: () => void;
  sx?: SxProps<Theme>;
};

export default function StablecoinField({
  label = "Pay with stablecoin",
  value,
  onChange,
  tokenSymbol = "USDC",
  tokenIconSrc = "/usdc.png",
  onPickToken,
  sx,
}: StablecoinFieldProps) {
  // --- auto-fit font size to ensure the full number is always visible ---
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [fontSize, setFontSize] = React.useState(18); // px
  const MAX = 18;
  const MIN = 10;

  const fit = React.useCallback(() => {
    const el = inputRef.current;
    if (!el) return;

    const str = String(value ?? "");
    if (!str) {
      if (fontSize !== MAX) setFontSize(MAX);
      return;
    }

    // compute available content width = clientWidth - paddings
    const cs = getComputedStyle(el);
    const pl = parseFloat(cs.paddingLeft || "0");
    const pr = parseFloat(cs.paddingRight || "0");
    const available = el.clientWidth - pl - pr;
    if (available <= 0) return;

    // measure text width at MAX font size
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const fontFamily = cs.fontFamily || "inherit";
    // use a numeric-friendly weight if present; keep your 500 default
    const fontWeight = cs.fontWeight || "500";
    ctx.font = `${fontWeight} ${MAX}px ${fontFamily}`;
    // optional: tabular nums for more predictable width if your font supports it
    // (canvas doesn't apply features, but input does; keeping for reference)
    const w = ctx.measureText(str).width;

    const next =
      w <= available ? MAX : Math.max(MIN, Math.floor((available / w) * MAX));
    if (next !== fontSize) setFontSize(next);
  }, [value, fontSize]);

  React.useLayoutEffect(() => {
    fit();
  }, [fit]);

  React.useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => fit());
    ro.observe(el);
    if (el.parentElement) ro.observe(el.parentElement);
    return () => ro.disconnect();
  }, [fit]);
  // ----------------------------------------------------------------------

  return (
    <TextField
      fullWidth
      variant="outlined"
      label={label}
      value={value}
      onChange={(e) => onChange?.(Number(e.target.value))}
      inputRef={inputRef}
      inputProps={{
        inputMode: "decimal",
        pattern: "[0-9.]*",
        style: {
          fontSize,
          fontWeight: fontSize < 12 ? 400 : 500, // ↓ slightly narrower glyphs when tiny
          letterSpacing: fontSize < 12 ? -0.2 : 0, // optional: tighten a hair
          fontVariantNumeric: "tabular-nums",
        },
        sx: {
          textAlign: { xs: "right", lg: "right" },
        },
        "aria-label": label,
        title: String(value ?? ""), // shows full value on hover
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" sx={{ mr: 0.5 }}>
            <Button
              onClick={onPickToken}
              disableRipple
              sx={{
                px: 1,
                py: 1,
                minWidth: 0,
                gap: 1,
                borderRadius: 1,
                color: "#fff",
                textTransform: "none",
                "&:hover": { background: "transparent" },
              }}
            >
              <Avatar
                src={tokenIconSrc}
                alt={tokenSymbol}
                sx={{ width: 24, height: 24 }}
                imgProps={{ draggable: false }}
              />
              <Box component="span" sx={{ fontWeight: 400, fontSize: 16 }}>
                {tokenSymbol}
              </Box>
            </Button>
          </InputAdornment>
        ),
      }}
      sx={{
        // container
        "& .MuiOutlinedInput-root": {
          bgcolor: "#151515",
          width: "100%",
          borderRadius: 2,
          height: 56,
          pr: 1,
          // subtle border + focus color
          "& fieldset": { borderColor: "#2A2A2A" },
          "&:hover fieldset": { borderColor: "#3A3A3A" },
          "&.Mui-focused fieldset": { borderColor: "#6BE2C2" },
          // IMPORTANT: remove the paddingLeft=0 override so MUI reserves room for the start adornment
          // "& .MuiOutlinedInput-input": { paddingLeft: 0 },  <-- remove this line
          "& .MuiOutlinedInput-input": {
            // keep any other tweaks you want, just don't kill the left padding
          },
        },
        // label color/style
        "& .MuiInputLabel-outlined": {
          color: "rgba(255,255,255,0.6)",
        },
        "& .MuiInputLabel-outlined.Mui-focused": {
          color: "rgba(255,255,255,0.7)",
        },
        ...sx,
      }}
      placeholder="0"
    />
  );
}
