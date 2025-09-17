// components/institutionalRoundAccess.tsx
"use client";

import { useEffect, useId, useState } from "react";
import { Stack, Typography, Switch, useTheme } from "@mui/material";

export type InstitutionalRoundAccessProps = {
  /** Controlled value. If provided, component becomes controlled. */
  value?: boolean;
  /** Uncontrolled initial value (used only when `value` is undefined). */
  defaultValue?: boolean;
  /** Called whenever the toggle changes. */
  onChange?: (next: boolean) => void;
  /** Disable interactions */
  disabled?: boolean;
  /** Title text */
  title?: string;
  /** Subtitle when ON */
  subtitleOn?: string;
  /** Subtitle when OFF */
  subtitleOff?: string;
};

export default function InstitutionalRoundAccess({
  value,
  defaultValue = false,
  onChange,
  disabled = false,
  title = "Institutional Round Access",
  subtitleOn = "Public access enabled",
  subtitleOff = "Public access disabled",
}: InstitutionalRoundAccessProps) {
  const theme = useTheme();
  const [on, setOn] = useState<boolean>(value ?? defaultValue);
  const descId = useId();

  // keep local state in sync if parent controls `value`
  useEffect(() => {
    if (typeof value === "boolean") setOn(value);
  }, [value]);

  const handleToggle = (next: boolean) => {
    // if uncontrolled, update internal state
    if (typeof value !== "boolean") setOn(next);
    onChange?.(next);
  };

  const cardSx = {
    backgroundColor: theme.palette.presaleCardBg.main,
    border: `1px solid ${on ? theme.palette.uranoGreen1.main : theme.palette.headerBorder.main}`,
    borderRadius: 2,
    px: { xs: 2, md: 3 },
    py: { xs: 2, md: 2.25 },
    transition: "border-color .15s ease, box-shadow .15s ease",
    boxShadow: on ? `0 0 0 1px rgba(107,226,194,.22)` : "none",
  } as const;

  const switchSx = {
    "& .MuiSwitch-track": {
      backgroundColor: theme.palette.grey[700],
      opacity: 1,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: theme.palette.uranoGreen1.main,
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.uranoGreen1.main,
        opacity: 1,
      },
    },
  } as const;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={cardSx}
    >
      <Stack gap={0.5}>
        <Typography
          variant="h6"
          sx={{ color: theme.palette.text.primary, fontWeight: 600 }}
        >
          {title}
        </Typography>
        <Typography
          id={descId}
          variant="body1"
          sx={{ color: theme.palette.text.secondary }}
        >
          {on ? subtitleOn : subtitleOff}
        </Typography>
      </Stack>

      <Switch
        checked={on}
        onChange={(e) => handleToggle(e.target.checked)}
        disabled={disabled}
        sx={switchSx}
        inputProps={{
          "aria-label": `${title} toggle`,
          "aria-describedby": descId,
        }}
      />
    </Stack>
  );
}
