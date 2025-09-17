"use client";

import { useEffect, useMemo, useState } from "react";
import { Stack, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { IoChevronForward } from "react-icons/io5";
import SubscriptionModal from "../SubscriptionModal";
import ErrorModal from "../ErrorModal";
import VerifyIdentityModal from "@/components/VerifyIdentityModal";
import WalletModal from "@/components/WalletModal";
import { useConnectModal } from "thirdweb/react"
import { client } from "@/lib/thirdwebClient"

type Progress = {
  step1: boolean;
  step2: boolean;
  step3: boolean;
};

const STORAGE_KEY = "registrationProgress:v1";

const Registration = () => {
  const theme = useTheme();
  const [openStep1, setOpenStep1] = useState(false);
  const [openStep2, setOpenStep2] = useState(false);
  const [openStep3, setOpenStep3] = useState(false);

  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorModalTitle, setErrorModalTitle] = useState("");
  const [errorModalMessage, setErrorModalMessage] = useState("");

  const { connect } = useConnectModal()

  const [progress, setProgress] = useState<Progress>({
    step1: false,
    step2: false,
    step3: false,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setProgress(JSON.parse(saved) as Progress);
    } catch { }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch { }
  }, [progress]);

  const locked = useMemo(
    () => ({
      step1: false,
      step2: !progress.step1,
      step3: !(progress.step1 && progress.step2),
    }),
    [progress]
  );

  const showLockError = (title: string, message: string) => {
    setErrorModalTitle(title);
    setErrorModalMessage(message);
    setErrorModalOpen(true);
  };

  const handleClickStep1 = () => setOpenStep1(true);

  const handleClickStep2 = () => {
    if (locked.step2) {
      showLockError(
        "Your email address is not registered",
        "Please complete step 1 (Register with Email) before verifying your identity."
      );
      return;
    }
    setOpenStep2(true);
  };

  const handleClickStep3 = async () => {
    if (locked.step3) {
      const missing =
        !progress.step1 && !progress.step2
          ? "steps 1 and 2"
          : !progress.step1
            ? "step 1"
            : "step 2";
      showLockError(
        "Previous steps incomplete",
        `Please complete ${missing} before connecting a wallet & buying.`
      );
      setOpenStep3(true);
      return;
    }
    else {
      await connect({ client })
    }
  };

  const completeStep1 = () => setProgress((p) => ({ ...p, step1: true }));
  const completeStep2 = () => setProgress((p) => ({ ...p, step2: true }));
  const completeStep3 = () => setProgress((p) => ({ ...p, step3: true }));

  const getStepBoxSx = (isLocked: boolean, isDone: boolean) => ({
    background: theme.palette.background.paper,
    borderRadius: 2,
    paddingX: { xs: 1.5, lg: 1 },
    paddingY: { xs: 1.5, lg: 1 },
    border: `1px solid ${isDone ? theme.palette.uranoGreen1.main : theme.palette.headerBorder.main}`,
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
        sx={{ fontWeight: 500, fontSize: { xs: "1.25rem", lg: "1.45rem" }, lineHeight: 1, color: "#2A6A69" }}
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
          <IoChevronForward size={20} color={theme.palette.uranoGreen1.main} className="registrationChevronMobile" />
        </Stack>

        <IoChevronForward
          size={24}
          color={theme.palette.text.primary}
          style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}
          className="registrationChevronDesktop"
        />

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
            Verify your identity
          </Typography>
          <IoChevronForward size={20} color={theme.palette.uranoGreen1.main} className="registrationChevronMobile" />
        </Stack>

        <IoChevronForward
          size={24}
          color={theme.palette.text.primary}
          style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}
          className="registrationChevronDesktop"
        />

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
            Connect wallet & Buy
          </Typography>
          <IoChevronForward size={20} color={theme.palette.uranoGreen1.main} className="registrationChevronMobile" />
        </Stack>
      </Stack>

      <SubscriptionModal open={openStep1} onClose={() => setOpenStep1(false)} onComplete={completeStep1} />
      <VerifyIdentityModal open={openStep2} onClose={() => setOpenStep2(false)} onComplete={completeStep2} />

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
