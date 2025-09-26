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
  /** optional inline status below the field */
  helperText?: React.ReactNode;
  /** toggles error styling & color for helperText */
  error?: boolean;
};

export default function StablecoinField({
  label = "Pay with stablecoin",
  value,
  onChange,
  tokenSymbol = "USDC",
  tokenIconSrc = "/usdc.png",
  onPickToken,
  sx,
  helperText,
  error = false,
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

    const cs = getComputedStyle(el);
    const pl = parseFloat(cs.paddingLeft || "0");
    const pr = parseFloat(cs.paddingRight || "0");
    const available = el.clientWidth - pl - pr;
    if (available <= 0) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const fontFamily = cs.fontFamily || "inherit";
    const fontWeight = cs.fontWeight || "500";
    ctx.font = `${fontWeight} ${MAX}px ${fontFamily}`;
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
      error={error}
      helperText={helperText}
      inputProps={{
        inputMode: "decimal",
        pattern: "[0-9.]*",
        style: {
          fontSize,
          fontWeight: fontSize < 12 ? 400 : 500,
          letterSpacing: fontSize < 12 ? -0.2 : 0,
          fontVariantNumeric: "tabular-nums",
        },
        sx: {
          textAlign: { xs: "right", lg: "right" },
          "& .MuiOutlinedInput-root": {
            pl: 0,
            pr: 0,
          },
          "& .MuiOutlinedInput-root.MuiInputBase-adornedStart": { pl: 0 },
          "& .MuiOutlinedInput-root.MuiInputBase-adornedEnd": { pr: 0 },
          "& .MuiFormHelperText-root": {
            margin: "0px !important",
          },
        },
        "aria-label": label,
        title: String(value ?? ""),
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" sx={{ ml: -1 }}>
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
        "& .MuiOutlinedInput-root": {
          bgcolor: "#151515",
          width: "100%",
          borderRadius: 2,
          height: 56,
          pr: 1,
          "& fieldset": { borderColor: "#2A2A2A" },
          "&:hover fieldset": { borderColor: "#3A3A3A" },
          "&.Mui-focused fieldset": { borderColor: "#6BE2C2" },
          "& .MuiOutlinedInput-input": {},
        },
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
