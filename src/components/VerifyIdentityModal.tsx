"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Stack,
  Typography,
  Box,
  useTheme,
  type Theme,
  alpha,
  Button,
  CircularProgress,
} from "@mui/material";
import Image from "next/image";
import dynamic from "next/dynamic";
import popupbg from "@/assets/images/pop-up-bg.webp";
import { waitForKycStatus } from "@/utils/kyc";

interface VerifyIdentityModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
  walletAddress?: `0x${string}`;
}

type PersonaProps = {
  templateId: string;
  environmentId: string;
  referenceId?: string;
  onLoad?: () => void;
  onReady?: () => void;
  onComplete?: (meta: { inquiryId: string; status?: string; fields?: Record<string, unknown> }) => void;
  onCancel?: () => void;
  onError?: (err: unknown) => void;
};

const PersonaReact = dynamic(async () => {
  const mod = await import("persona-react");
  return (mod.default ?? mod) as React.ComponentType<PersonaProps>;
}, { ssr: false }) as unknown as React.ComponentType<PersonaProps>;

const TEMPLATE_ID = process.env.NEXT_PUBLIC_PERSONA_TEMPLATE_ID;
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_PERSONA_ENV_ID;

const VerifyIdentityModal: React.FC<VerifyIdentityModalProps> = ({ open, onClose, onComplete, walletAddress }) => {
  const theme = useTheme<Theme>();

  const [showFlow, setShowFlow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const referenceId = useMemo(() => walletAddress ?? undefined, [walletAddress]);

  useEffect(() => {
    if (!open) {
      setShowFlow(false);
      setBusy(false);
      setErrorText(null);
    }
  }, [open]);

  const startVerification = () => {
    setErrorText(null);
    setBusy(true);
    setShowFlow(true);
  };

  const handleComplete = async (_meta: { inquiryId: string; status?: string }) => {
    try {
      if (walletAddress) {
        setBusy(true);
        const ok = await waitForKycStatus(walletAddress, { tries: 20, delayMs: 2000 });
        if (!ok) throw new Error("We couldn’t confirm your verification on-chain yet. Please try again shortly.");
      }
      onComplete();
      onClose();
    } catch (e) {
      setErrorText(e instanceof Error ? e.message : "Verification could not be confirmed.");
    } finally {
      setBusy(false);
      setShowFlow(false);
    }
  };

  const handleCancel = () => {
    setShowFlow(false);
    setBusy(false);
  };

  const handleError = (err: unknown) => {
    setErrorText(err instanceof Error ? err.message : String(err));
    setShowFlow(false);
    setBusy(false);
  };

  const envError =
    !TEMPLATE_ID || !ENVIRONMENT_ID
      ? "Persona env vars missing. Set NEXT_PUBLIC_PERSONA_TEMPLATE_ID and NEXT_PUBLIC_PERSONA_ENV_ID."
      : null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(95vw, 640px)",
          height: showFlow ? "80vh" : "auto",
          maxHeight: "90vh",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 24,
          outline: "none",
          display: "flex",
          flexDirection: "column",
          border: `1px solid ${theme.palette.headerBorder.main}`,
          background: theme.palette.background.paper,
        }}
      >
        {!showFlow && (
          <Box sx={{ position: "relative", width: "100%", height: 160, flexShrink: 0, zIndex: 10 }}>
            <Image src={popupbg} alt="Popup background" fill style={{ objectFit: "cover" }} />
          </Box>
        )}

        {!showFlow ? (
          <Box
            sx={{
              p: 3,
              borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              position: "relative",
              zIndex: 15,
            }}
          >
            <Box
              sx={{
                width: "fit-content",
                alignSelf: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 2,
                px: 2,
                py: 1,
                aspectRatio: 1,
                background: theme.palette.uranoGradient,
                mt: -6.5,
                border: `5px solid ${theme.palette.background.paper}`,
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 500, fontSize: "1.5rem", lineHeight: 1, color: "#2A6A69" }}>
                2
              </Typography>
            </Box>

            {envError ? (
              <Stack width="100%" alignItems="center" gap={2} sx={{ mt: 1 }}>
                <Typography variant="h6" textAlign="center">Verify your identity</Typography>
                <Typography variant="body2" color={theme.palette.error.main} textAlign="center">
                  {envError}
                </Typography>
                <Button variant="outlined" onClick={onClose} sx={{ mt: "auto", width: "100%", borderRadius: "8px" }}>
                  Close
                </Button>
              </Stack>
            ) : (
              <>
                <Stack width="100%" alignItems="center" gap={1}>
                  <Typography
                    variant="h5"
                    fontWeight={500}
                    textAlign="center"
                    sx={{
                      background: theme.palette.text.primary,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Verify your identity
                  </Typography>
                  <Typography variant="body1" color="text.secondary" textAlign="center">
                    Please verify your identity to continue.
                  </Typography>
                  {errorText && (
                    <Typography variant="body2" color={theme.palette.error.main} textAlign="center">
                      {errorText}
                    </Typography>
                  )}
                </Stack>

                <Button
                  variant="contained"
                  disabled={busy || !walletAddress}
                  onClick={startVerification}
                  sx={{
                    mt: "auto",
                    background: theme.palette.secondary.main,
                    borderRadius: "8px",
                    py: 1.5,
                    width: "100%",
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    "&:hover": {
                      background: theme.palette.uranoGreen1.main,
                      "& .btnText": { color: theme.palette.background.paper },
                    },
                  }}
                >
                  {busy ? <CircularProgress size={22} /> : (
                    <Typography className="btnText" variant="body1" sx={{ textTransform: "none" }}>
                      Start verification
                    </Typography>
                  )}
                </Button>
              </>
            )}
          </Box>
        ) : (
          <Box sx={{ flex: 1, minHeight: 0, position: "relative" }}>
            {busy && (
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}
              >
                <CircularProgress />
              </Stack>
            )}

            <Box
              sx={{
                position: "absolute",
                inset: 0,
                "& iframe": {
                  width: "100% !important",
                  height: "100% !important",
                  border: 0,
                  display: "block",
                },
              }}
            >
              <PersonaReact
                templateId={TEMPLATE_ID!}
                environmentId={ENVIRONMENT_ID!}
                referenceId={referenceId}
                onLoad={() => setBusy(false)}
                onReady={() => setBusy(false)}
                onComplete={handleComplete}
                onCancel={handleCancel}
                onError={handleError}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default VerifyIdentityModal;
