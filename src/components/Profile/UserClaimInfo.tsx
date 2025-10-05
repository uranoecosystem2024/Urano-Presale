"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Link, Stack, Typography, useTheme } from "@mui/material";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { toast } from "react-toastify";
import { useActiveAccount } from "thirdweb/react";
import { sendTransaction } from "thirdweb";

import {
  // WHITELIST
  readWhitelistClaimSummary,
  prepareWhitelistClaimTx,
  // PURCHASED (vesting)
  readPurchasedClaimSummary,
  preparePurchasedClaimTxs,
  // shared
  formatTokenAmount,
} from "@/utils/profile/userClaimInfo";

import { formatCompactDecimalString } from "@/utils/compactDecimal";

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

  // Purchased (vesting) state
  const [claimingPurchased, setClaimingPurchased] = useState(false);
  const [purchasedClaimable, setPurchasedClaimable] = useState<string>("0");
  const [purchasedClaimed, setPurchasedClaimed] = useState<string>("0");

  // Whitelist state
  const [claimingWhitelist, setClaimingWhitelist] = useState(false);
  const [wlClaimable, setWlClaimable] = useState<string>("0");
  const [wlClaimed, setWlClaimed] = useState<string>("0");

  const refresh = async () => {
    if (!address) {
      setPurchasedClaimable("0");
      setPurchasedClaimed("0");
      setWlClaimable("0");
      setWlClaimed("0");
      return;
    }
    setLoading(true);
    try {
      // Purchased (vesting) summary
      const purchased = await readPurchasedClaimSummary(address);
      setPurchasedClaimable(
        formatTokenAmount(purchased.claimableRaw, purchased.tokenDecimals)
      );
      setPurchasedClaimed(
        formatTokenAmount(purchased.claimedRaw, purchased.tokenDecimals)
      );

      // Whitelist summary
      const wl = await readWhitelistClaimSummary(address);
      setWlClaimable(formatTokenAmount(wl.claimableRaw, wl.tokenDecimals));
      setWlClaimed(formatTokenAmount(wl.claimedRaw, wl.tokenDecimals));
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to load claim data.";
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

  /* ----------------------- Purchased: Claim handler ---------------------- */
  const onClaimPurchased = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!account || !address) {
      toast.info("Connect your wallet first.");
      return;
    }
    try {
      setClaimingPurchased(true);

      const txs = await preparePurchasedClaimTxs(address);
      if (txs.length === 0) {
        toast.info("No claimable purchased tokens right now.");
        return;
      }

      // Send all prepared txs sequentially (safer UX)
      for (const [i, tx] of txs.entries()) {
        await sendTransaction({ account, transaction: tx });
        toast.success(`Claim ${i + 1}/${txs.length} confirmed.`);
      }

      await refresh();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Purchased claim failed.";
      console.error(err);
      toast.error(msg);
    } finally {
      setClaimingPurchased(false);
    }
  };

  /* ----------------------- Whitelist: Claim handler ---------------------- */
  const onClaimWhitelist = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!account) {
      toast.info("Connect your wallet first.");
      return;
    }
    try {
      setClaimingWhitelist(true);
      const tx = prepareWhitelistClaimTx();
      await sendTransaction({ account, transaction: tx });
      toast.success("Whitelist claim successful!");
      await refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Claim failed.";
      console.error(err);
      toast.error(msg);
    } finally {
      setClaimingWhitelist(false);
    }
  };

  // Numbers for disabling buttons
  const purchasedClaimableNum = Number(purchasedClaimable.replace(/,/g, ""));
  const wlClaimableNum = Number(wlClaimable.replace(/,/g, ""));

  // Compact display strings
  const compactPurchasedClaimable = useMemo(
    () => formatCompactDecimalString(purchasedClaimable, 2),
    [purchasedClaimable]
  );
  const compactPurchasedClaimed = useMemo(
    () => formatCompactDecimalString(purchasedClaimed, 2),
    [purchasedClaimed]
  );
  const compactWlClaimable = useMemo(
    () => formatCompactDecimalString(wlClaimable, 2),
    [wlClaimable]
  );
  const compactWlClaimed = useMemo(
    () => formatCompactDecimalString(wlClaimed, 2),
    [wlClaimed]
  );

  return (
    <Stack
      direction={{ xs: "column-reverse", lg: "row" }}
      justifyContent="space-between"
      gap={{ xs: 2, lg: 1 }}
      sx={{ opacity: loading ? 0.85 : 1 }}
    >
      {/* LEFT COLUMN: Purchased (vesting) + Claim button + Whitelist box */}
      <Stack width={{ xs: "100%", lg: "32%" }} gap={1.5}>
        {/* Purchased (vesting) — Unclaimed */}
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
            Unclaimed (Purchased/Vesting)
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
            {address ? `${compactPurchasedClaimable} $URANO` : "—"}
          </Typography>
        </Stack>

        {/* Button: Claim Purchased */}
        <Link
          href="/"
          underline="none"
          target="_blank"
          onClick={onClaimPurchased}
          sx={{
            pointerEvents:
              claimingPurchased || purchasedClaimableNum <= 0 ? "none" : "auto",
          }}
          aria-disabled={claimingPurchased || purchasedClaimableNum <= 0}
        >
          <Box
            sx={{
              width: "100%",
              background:
                claimingPurchased || purchasedClaimableNum <= 0
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
                  claimingPurchased || purchasedClaimableNum <= 0
                    ? theme.palette.text.disabled
                    : theme.palette.background.default,
              }}
            >
              {claimingPurchased
                ? "Claiming…"
                : address
                  ? `Claim ${compactPurchasedClaimable} $URANO`
                  : "Connect Wallet"}
            </Typography>
          </Box>
        </Link>
      </Stack>
      <Stack width={{ xs: "100%", lg: "32%" }} gap={1.5}>
        {/* Whitelist box */}
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
          <Typography
            variant="h6"
            sx={{
              fontSize: "1rem",
              fontWeight: 400,
              color: theme.palette.text.primary,
            }}
          >
            Whitelist Unclaimed
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
            {address ? `${compactWlClaimable} $URANO` : "—"}
          </Typography>
        </Stack>

        {/* Button: Claim Whitelist */}
        <Link
          href="/"
          underline="none"
          target="_blank"
          onClick={onClaimWhitelist}
          sx={{
            pointerEvents: claimingWhitelist || wlClaimableNum <= 0 ? "none" : "auto",
          }}
          aria-disabled={claimingWhitelist || wlClaimableNum <= 0}
        >
          <Box
            sx={{
              width: "100%",
              background:
                claimingWhitelist || wlClaimableNum <= 0
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
                  claimingWhitelist || wlClaimableNum <= 0
                    ? theme.palette.text.disabled
                    : theme.palette.background.default,
              }}
            >
              {claimingWhitelist
                ? "Claiming…"
                : address
                  ? `Claim Whitelist $URANO`
                  : "Connect Wallet"}
            </Typography>
          </Box>
        </Link>
      </Stack>

      {/* RIGHT COLUMN: Claimed totals (purchased + whitelist shown as single total) */}
      <Stack width={{ xs: "100%", lg: "32%" }} gap={1}>
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
              Claimed (All)
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
            {address
              ? `${formatCompactDecimalString(
                // combine purchased + whitelist claimed for the total claimed display
                (() => {
                  const a = Number(purchasedClaimed.replace(/,/g, "")) || 0;
                  const b = Number(wlClaimed.replace(/,/g, "")) || 0;
                  return String(a + b);
                })(),
                2
              )} $URANO`
              : "—"}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
