"use client";

import { useEffect, useMemo, useState } from "react";
import { Stack, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { IoChevronForward } from "react-icons/io5";
import SubscriptionModal from "../SubscriptionModal";
import ErrorModal from "../ErrorModal";
import VerifyIdentityModal from "@/components/VerifyIdentityModal";
import { useConnectModal, useActiveAccount, useWalletDetailsModal } from "thirdweb/react";
import { client } from "@/lib/thirdwebClient";
import { fetchKycStatus } from "@/utils/kyc";

type Progress = {
  step1: boolean; // Email
  step2: boolean; // KYC
  step3: boolean; // Wallet connected (UI state)
};

const STORAGE_KEY = "registrationProgress:v1";

const Registration = () => {
  const theme = useTheme();

  const [openStep1, setOpenStep1] = useState(false);
  const [openStep2, setOpenStep2] = useState(false);

  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorModalTitle, setErrorModalTitle] = useState("");
  const [errorModalMessage, setErrorModalMessage] = useState("");

  const { connect } = useConnectModal();
  const detailsModal = useWalletDetailsModal();
  const handleWalletDetailsModalOpen = () => {
    detailsModal.open({ client, theme: "dark" });
  };

  const account = useActiveAccount();
  const address = account?.address as `0x${string}` | undefined;
  const connected = Boolean(address);

  const [progress, setProgress] = useState<Progress>({
    step1: false,
    step2: false,
    step3: false,
  });

  // Load progress
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setProgress(JSON.parse(saved) as Progress);
    } catch {
      /* noop */
    }
  }, []);

  // Persist progress
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      /* noop */
    }
  }, [progress]);

  // Keep step3 (UI state) in sync with live connection
  useEffect(() => {
    if (progress.step3 !== connected) {
      setProgress((p) => ({ ...p, step3: connected }));
    }
  }, [connected, progress.step3]);

  // Locking rules:
  // - Step 3 (Connect wallet) requires Step 1 (email) only.
  // - Step 2 (KYC) requires Step 1 + CURRENT WALLET CONNECTED.
  const locked = useMemo(
    () => ({
      step1: false,
      step2: !(progress.step1 && connected),
      step3: !progress.step1,
    }),
    [progress.step1, connected]
  );

  const showLockError = (title: string, message: string) => {
    setErrorModalTitle(title);
    setErrorModalMessage(message);
    setErrorModalOpen(true);
  };

  const handleClickStep1 = () => setOpenStep1(true);

  const handleClickStep3 = async () => {
    if (locked.step3) {
      showLockError(
        "Your email address is not registered",
        "Please complete step 1 (Register with Email) before connecting your wallet."
      );
      return;
    }
    // If already connected, open Thirdweb wallet details
    if (connected) {
      handleWalletDetailsModalOpen();
      return;
    }
    await connect({ client });
    // step3 UI will sync via the effect above
  };

  const handleClickStep2 = async () => {
    if (locked.step2) {
      const why = !progress.step1
        ? "step 1 (Register with Email)"
        : "step 2 (Connect your wallet)";
      showLockError(
        "Previous steps incomplete",
        `Please complete ${why} before verifying your identity.`
      );
      return;
    }

    // If wallet is currently disconnected, show error (do NOT open connect modal here)
    if (!connected) {
      showLockError(
        "Wallet disconnected",
        "Please reconnect your wallet (step 2) before verifying your identity."
      );
      return;
    }

    // Pre-check: already KYC-verified on-chain?
    try {
      const already = await fetchKycStatus(address!);
      if (already) {
        showLockError(
          "Identity Already Verified",
          "Your connected wallet is already KYC-verified and whitelisted."
        );
        setProgress((p) => ({ ...p, step2: true }));
        return;
      }
    } catch {
      // If the API fails, proceed to Persona flow
    }

    setOpenStep2(true);
  };

  const completeStep1 = () => setProgress((p) => ({ ...p, step1: true }));
  const completeStep2 = () => setProgress((p) => ({ ...p, step2: true }));
  // step3 syncs automatically with `connected`

  const getStepBoxSx = (isLocked: boolean, isDone: boolean) => ({
    background: theme.palette.background.paper,
    borderRadius: 2,
    paddingX: { xs: 1.5, lg: 1 },
    paddingY: { xs: 1.5, lg: 1 },
    border: `1px solid ${
      isDone ? theme.palette.uranoGreen1.main : theme.palette.headerBorder.main
    }`,
    cursor: "pointer",
    opacity: isLocked ? 0.75 : 1,
    "&:hover": {
      border: `1px solid ${theme.palette.uranoGreen1.main}`,
    },
  });

  const StepBadge: React.FC<{ n: 1 | 2 | 3 }> = ({ n }) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 1.5,
        paddingX: 1,
        paddingY: 0.5,
        aspectRatio: 1,
        background: theme.palette.uranoGradient,
      }}
    >
      <Typography
        variant="body1"
        sx={{
          fontWeight: 500,
          fontSize: { xs: "1.25rem", lg: "1.45rem" },
          lineHeight: 1,
          color: "#2A6A69",
        }}
      >
        {n}
      </Typography>
    </Box>
  );

  return (
    <>
      <Stack
        width={"100%"}
        direction={{ xs: "column", lg: "row" }}
        justifyContent={"space-between"}
        alignItems={"center"}
        gap={{ xs: 1, lg: 0 }}
      >
        {/* Step 1 */}
        <Stack
          width={{ xs: "100%", lg: "35%" }}
          direction={"row"}
          alignItems={"center"}
          gap={{ xs: 1, lg: 2 }}
          sx={getStepBoxSx(locked.step1, progress.step1)}
          onClick={handleClickStep1}
          aria-disabled={locked.step1}
          role="button"
        >
          <StepBadge n={1} />
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 500,
              fontSize: { xs: "1rem", lg: "0.75rem" },
              color: theme.palette.text.primary,
              width: "80%",
            }}
          >
            Register with Email
          </Typography>
          <IoChevronForward
            size={20}
            color={theme.palette.uranoGreen1.main}
            className="registrationChevronMobile"
          />
        </Stack>

        <IoChevronForward
          size={24}
          color={theme.palette.text.primary}
          style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}
          className="registrationChevronDesktop"
        />

        {/* Step 2: Connect wallet */}
        <Stack
          width={{ xs: "100%", lg: "35%" }}
          direction={"row"}
          alignItems={"center"}
          gap={{ xs: 1, lg: 2 }}
          sx={getStepBoxSx(locked.step3, progress.step3)}
          onClick={handleClickStep3}
          aria-disabled={locked.step3}
          role="button"
        >
          <StepBadge n={2} />
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 500,
              fontSize: { xs: "1rem", lg: "0.75rem" },
              color: theme.palette.text.primary,
              width: "80%",
            }}
          >
            Connect your wallet
          </Typography>
          <IoChevronForward
            size={20}
            color={theme.palette.uranoGreen1.main}
            className="registrationChevronMobile"
          />
        </Stack>

        <IoChevronForward
          size={24}
          color={theme.palette.text.primary}
          style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}
          className="registrationChevronDesktop"
        />

        {/* Step 3: Verify identity */}
        <Stack
          width={{ xs: "100%", lg: "35%" }}
          direction={"row"}
          alignItems={"center"}
          gap={{ xs: 1, lg: 2 }}
          sx={getStepBoxSx(locked.step2, progress.step2)}
          onClick={handleClickStep2}
          aria-disabled={locked.step2}
          role="button"
        >
          <StepBadge n={3} />
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 500,
              fontSize: { xs: "1rem", lg: "0.75rem" },
              color: theme.palette.text.primary,
              width: "80%",
            }}
          >
            Verify your identity
          </Typography>
          <IoChevronForward
            size={20}
            color={theme.palette.uranoGreen1.main}
            className="registrationChevronMobile"
          />
        </Stack>
      </Stack>

      <SubscriptionModal
        open={openStep1}
        onClose={() => setOpenStep1(false)}
        onComplete={completeStep1}
      />

      <VerifyIdentityModal
        open={openStep2}
        onClose={() => setOpenStep2(false)}
        onComplete={completeStep2}
        walletAddress={address}
      />

      <ErrorModal
        open={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        errorTitle={errorModalTitle}
        errorMessage={errorModalMessage}
      />
    </>
  );
};

export default Registration;
