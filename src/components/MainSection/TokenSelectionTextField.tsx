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
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";

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
  tokenIconSrc = "/usdc.png", // put your asset here
  onPickToken,
  sx,
}: StablecoinFieldProps) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      label={label}
      value={value}
      onChange={(e) => onChange?.(Number(e.target.value))}
      inputProps={{
        inputMode: "decimal",
        pattern: "[0-9.]*",
        style: { textAlign: "right", fontSize: 18, fontWeight: 500 },
        "aria-label": label,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" sx={{ mr: 1 }}>
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
              <ExpandMoreRoundedIcon fontSize="small" />
            </Button>
          </InputAdornment>
        ),
      }}
      sx={{
        // container
        "& .MuiOutlinedInput-root": {
          bgcolor: "#151515",
          borderRadius: 2,
          height: 56,
          pr: 2,
          // subtle border + focus color
          "& fieldset": { borderColor: "#2A2A2A" },
          "&:hover fieldset": { borderColor: "#3A3A3A" },
          "&.Mui-focused fieldset": { borderColor: "#6BE2C2" },
          // remove extra left padding (we provide our own via adornment)
          "& .MuiOutlinedInput-input": { paddingLeft: 0 },
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
