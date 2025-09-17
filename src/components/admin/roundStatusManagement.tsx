"use client";

import { memo, useEffect, useState, Fragment } from "react";
import {
  Stack,
  Typography,
  Switch,
  Button,
  Divider,
  Chip,
  useTheme,
} from "@mui/material";

/** Domain model for a presale round */
export type RoundStatusItem = {
  id: string;
  title: string;        // e.g. "Seed Round"
  active: boolean;
};

/** Props for the manager */
export type RoundStatusManagementProps = {
  /** Rounds to display */
  rounds: RoundStatusItem[];
  /** If true, only one round can be active at a time (matches the screenshot UX) */
  singleActive?: boolean;
  /** Disable all interactions */
  disabled?: boolean;
  /** Called when a round is toggled. Provides the next full list + the toggled id */
  onChange?: (next: RoundStatusItem[], changedId: string) => void;
  /** "Show more" click for a given round id */
  onShowMore?: (id: string) => void;
  /** Optional title override */
  title?: string;
  /** Optional subtitle override */
  subtitle?: string;
};

const RoundStatusManagement = memo(function RoundStatusManagement({
  rounds,
  singleActive = true,
  disabled = false,
  onChange,
  onShowMore,
  title = "Round Status Management",
  subtitle = "Activate or deactivate presale rounds",
}: RoundStatusManagementProps) {
  const theme = useTheme();
  const [items, setItems] = useState<RoundStatusItem[]>(rounds);

  // keep local state in sync if parent updates `rounds`
  useEffect(() => setItems(rounds), [rounds]);

  const handleToggle = (id: string, nextVal: boolean) => {
    if (disabled) return;

    setItems((prev) => {
      let next = prev.map((r) =>
        r.id === id ? { ...r, active: nextVal } : r
      );
      if (singleActive && nextVal) {
        next = next.map((r) => (r.id !== id ? { ...r, active: false } : r));
      }
      onChange?.(next, id);
      return next;
    });
  };

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

  const cardBaseSx = {
    backgroundColor: theme.palette.presaleCardBg.main,
    border: `1px solid ${theme.palette.headerBorder.main}`,
    borderRadius: 2,
    px: { xs: 2, md: 3 },
    py: { xs: 2, md: 3 },
    transition: "border-color .15s ease, box-shadow .15s ease, background .15s ease",
  } as const;

  return (
    <Stack gap={2} width="100%">
      {/* Header */}
      <Stack gap={0.5}>
        <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
          {subtitle}
        </Typography>
      </Stack>

      {/* Cards */}
      <Stack gap={2}>
        {items.map((r, idx) => {
          const isActive = r.active;
          return (
            <Fragment key={r.id}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  ...cardBaseSx,
                  border: isActive
                    ? `1px solid ${theme.palette.uranoGreen1.main}`
                    : cardBaseSx.border,
                  boxShadow: isActive
                    ? `0 0 0 1px rgba(107, 226, 194, .25)`
                    : "none",
                }}
              >
                {/* Left: title + status */}
                <Stack gap={1}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "1.05rem",
                      fontWeight: 500,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {r.title}
                  </Typography>

                  {isActive ? (
                    <Chip
                      size="small"
                      label="Active"
                      variant="outlined"
                      sx={{
                        height: 28,
                        borderColor: theme.palette.uranoGreen1.main,
                        color: theme.palette.uranoGreen1.main,
                        fontWeight: 500,
                        borderRadius: 999,
                      }}
                    />
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      Inactive
                    </Typography>
                  )}
                </Stack>

                {/* Right: toggle + show more */}
                <Stack direction="row" alignItems="center" gap={1.5}>
                  <Switch
                    checked={isActive}
                    onChange={(e) => handleToggle(r.id, e.target.checked)}
                    inputProps={{ "aria-label": `Toggle ${r.title}` }}
                    disabled={disabled}
                    sx={switchSx}
                  />

                  <Button
                    onClick={() => onShowMore?.(r.id)}
                    disabled={disabled}
                    variant="text"
                    sx={{
                      textTransform: "none",
                      px: 2.5,
                      py: 1.25,
                      borderRadius: 2,
                      background: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.headerBorder.main}`,
                      color: theme.palette.text.primary,
                      "&:hover": {
                        borderColor: theme.palette.text.primary,
                        background: theme.palette.transparentPaper.main,
                      },
                    }}
                  >
                    Show more
                  </Button>
                </Stack>
              </Stack>

              {/* subtle separator like the screenshot spacing */}
              {idx < items.length - 1 && (
                <Divider
                  sx={{
                    borderColor: "transparent",
                    my: -0.5, // visually keeps the same spacing as the screenshot cards
                  }}
                />
              )}
            </Fragment>
          );
        })}
      </Stack>
    </Stack>
  );
});

export default RoundStatusManagement;
