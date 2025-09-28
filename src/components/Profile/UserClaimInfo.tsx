"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Link, Stack, Typography, useTheme } from "@mui/material";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { toast } from "react-toastify";
import { useActiveAccount } from "thirdweb/react";
import { sendTransaction } from "thirdweb";
import {
  readWhitelistClaimSummary,
  formatTokenAmount,
  prepareWhitelistClaimTx,
} from "@/utils/profile/userClaimInfo";

type UserClaimInfoProps = {
  addressOverride?: `0x${string}`;
};

export default function UserClaimInfo({ addressOverride }: UserClaimInfoProps) {
  const theme = useTheme();
  const account = useActiveAccount();

  const address = useMemo(
    () => addressOverride ?? (account?.address as `0x${string}` | undefined),
    [addressOverride, account?.address]
  );

  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);

  const [claimable, setClaimable] = useState<string>("0");
  const [claimed, setClaimed] = useState<string>("0");

  const refresh = async () => {
    if (!address) {
      setClaimable("0");
      setClaimed("0");
      return;
    }
    setLoading(true);
    try {
      const res = await readWhitelistClaimSummary(address);
      setClaimable(formatTokenAmount(res.claimableRaw, res.tokenDecimals));
      setClaimed(formatTokenAmount(res.claimedRaw, res.tokenDecimals));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load claim data.";
      console.error(err);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const onClaim = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!account) {
      toast.info("Connect your wallet first.");
      return;
    }
    try {
      setClaiming(true);
      const tx = await prepareWhitelistClaimTx();
      await sendTransaction({ account, transaction: tx });
      toast.success("Claim successful!");
      await refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Claim failed.";
      console.error(err);
      toast.error(msg);
    } finally {
      setClaiming(false);
    }
  };

  const claimableNum = Number(claimable.replace(/,/g, ""));

  return (
    <Stack
      direction={{ xs: "column-reverse", lg: "row" }}
      justifyContent="space-between"
      gap={{ xs: 2, lg: 1 }}
      sx={{ opacity: loading ? 0.85 : 1 }}
    >
      {/* Left: Unclaimed + Claim button */}
      <Stack width={{ xs: "100%", lg: "50%" }} gap={1}>
        <Stack
          width="100%"
          gap={{ xs: 1, lg: 2 }}
          direction={{ xs: "column-reverse", lg: "column" }}
          sx={{
            border: "1px solid transparent",
            background: `
              linear-gradient(rgba(28, 34, 33, 1), rgba(28, 34, 33, 1)) padding-box,
              linear-gradient(260.63deg, rgba(107, 226, 194, 0.82) 0%, #6BE2C2 100%) border-box,
              linear-gradient(0deg, #242424, #242424) border-box
            `,
            position: "relative",
            overflow: "hidden",
            borderRadius: 2,
            px: 2,
            py: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: "1rem",
              fontWeight: 400,
              color: theme.palette.text.primary,
            }}
          >
            Unclaimed
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontSize: "1.5rem",
              fontWeight: 500,
              background: theme.palette.uranoGradient,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {address ? `${claimable} $URANO` : "—"}
          </Typography>
        </Stack>

        <Link
          href="/"
          underline="none"
          target="_blank"
          onClick={onClaim}
          sx={{ pointerEvents: claiming || claimableNum <= 0 ? "none" : "auto" }}
          aria-disabled={claiming || claimableNum <= 0}
        >
          <Box
            sx={{
              width: "100%",
              background:
                claiming || claimableNum <= 0
                  ? theme.palette.action.disabledBackground
                  : theme.palette.uranoGradient,
              border: `2px solid ${theme.palette.headerBorder.main}`,
              borderRadius: 2,
              px: { xs: 1.5, lg: 5 },
              py: { xs: 1.5, lg: 1 },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              "&:hover": {
                border: `2px solid ${theme.palette.text.primary}`,
                filter: "brightness(1.2)",
              },
              transition: "filter 0.15s ease",
            }}
          >
            <Typography
              variant="body1"
              fontWeight={400}
              sx={{
                color:
                  claiming || claimableNum <= 0
                    ? theme.palette.text.disabled
                    : theme.palette.background.default,
              }}
            >
              {claiming
                ? "Claiming…"
                : address
                ? `Claim ${claimable} $URANO`
                : "Connect Wallet"}
            </Typography>
          </Box>
        </Link>
      </Stack>

      {/* Right: Claimed */}
      <Stack width={{ xs: "100%", lg: "50%" }} gap={1}>
        <Stack
          width="100%"
          gap={{ xs: 1, lg: 2 }}
          direction={{ xs: "column-reverse", lg: "column" }}
          sx={{
            border: "1px solid #5E9BC3",
            background: "#1C2022",
            position: "relative",
            overflow: "hidden",
            borderRadius: 2,
            px: 2,
            py: 2,
          }}
        >
          <Stack
            width="100%"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={1}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: "1rem",
                fontWeight: 400,
                color: theme.palette.text.primary,
              }}
            >
              Claimed
            </Typography>
            <IoIosCheckmarkCircle size={24} color={theme.palette.text.primary} />
          </Stack>
          <Typography
            variant="h6"
            sx={{
              fontSize: "1.5rem",
              fontWeight: 500,
              background: theme.palette.uranoGradient,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {address ? `${claimed} $URANO` : "—"}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
