// components/VestingSchedule.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Stack, Typography, useTheme } from "@mui/material";
import { useActiveAccount } from "thirdweb/react";
import { toast } from "react-toastify";
import {
  readActiveRoundMonthlyVesting,
  formatTokenAmount,
  type MonthlyVestingItem,
} from "@/utils/profile/vestingUnlocks";

type VestingScheduleProps = {
  /** Optional: override address; defaults to connected wallet */
  addressOverride?: `0x${string}`;
};

export default function VestingSchedule({ addressOverride }: VestingScheduleProps) {
  const theme = useTheme();
  const account = useActiveAccount();

  const address = useMemo(
    () => addressOverride ?? (account?.address as `0x${string}` | undefined),
    [addressOverride, account?.address]
  );

  const [loading, setLoading] = useState(false);
  const [decimals, setDecimals] = useState(18);
  const [items, setItems] = useState<MonthlyVestingItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!address) {
        setItems([]);
        return;
      }
      setLoading(true);
      try {
        const res = await readActiveRoundMonthlyVesting(address);
        if (cancelled) return;
        setDecimals(res.tokenDecimals);
        setItems(res.items);
      } catch (err: unknown) {
        const msg =
          err && typeof err === "object" && "message" in err
            ? String((err as { message?: string }).message)
            : "Failed to load vesting schedule.";
        console.error(err);
        toast.error(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [address]);

  return (
    <Stack width="100%" alignItems="center" gap={2} sx={{ opacity: loading ? 0.85 : 1 }}>
      {address ? (
        items.length > 0 ? (
          items.map((it) => (
            <Stack
              key={`${it.label}-${it.firstUnlockDate.getTime()}`}
              width="100%"
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              gap={1}
              sx={{
                background: theme.palette.transparentPaper.main,
                border: `1px solid ${theme.palette.headerBorder.main}`,
                borderRadius: 2,
                px: 1.5,
                py: 1.5,
                overflow: "hidden",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: "0.875rem", fontWeight: 300, color: theme.palette.text.primary }}
              >
                {it.label}
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontSize: "0.875rem", fontWeight: 300, color: theme.palette.text.primary }}
              >
                {`${formatTokenAmount(it.amountRaw, decimals)} $URANO`}
              </Typography>
            </Stack>
          ))
        ) : (
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary }}
          >
            No scheduled unlocks for the active round.
          </Typography>
        )
      ) : (
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          Connect your wallet to see your vesting schedule.
        </Typography>
      )}
    </Stack>
  );
}
