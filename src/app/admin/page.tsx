"use client";

import { useEffect, useState } from "react";
import { Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import AdminHeader from "@/components/admin/adminHeader";
import Footer from "@/components/Footer";
import RoundStatusManagement, { type RoundStatusItem } from "@/components/admin/roundStatusManagement";
import InstitutionalRoundAccess from "@/components/admin/institutionalRoundAccess";
import InstitutionalAllowlist from "@/components/admin/institutionalAllowlist";
import ManualSepaPurchase from "@/components/admin/manualSEPAPurchase";
import WithdrawUnsoldTokens from "@/components/admin/withdrawUnsoldTokens";

import { useActiveAccount } from "thirdweb/react";
import { hasAdminRole } from "@/utils/admin/roles"; // ⬅️ new helper
import { PiWarningFill } from "react-icons/pi";

export default function Admin() {
    const theme = useTheme();
    const account = useActiveAccount();

    const [checkingRole, setCheckingRole] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    // Check admin role whenever the wallet changes
    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            if (!account) {
                setIsAdmin(false);
                setCheckingRole(false);
                return;
            }
            setCheckingRole(true);
            try {
                const ok = await hasAdminRole(account);
                if (!cancelled) setIsAdmin(ok);
            } catch (err) {
                console.error("Admin role check failed:", err);
                if (!cancelled) setIsAdmin(false);
            } finally {
                if (!cancelled) setCheckingRole(false);
            }
        };

        void run();
        return () => {
            cancelled = true;
        };
    }, [account]);

    // Reusable centered notice box
    const CenterNotice = ({ title, subtitle }: { title: string; subtitle?: string }) => (
        <Stack
            alignItems="center"
            justifyContent="center"
            width={{ xs: "95%", lg: "45%" }}
            minHeight="40dvh"
            sx={{
                backgroundColor: theme.palette.presaleCardBg.main,
                border: `1px solid ${theme.palette.headerBorder.main}`,
                borderRadius: 2,
                p: 3,
                textAlign: "center",
                marginBottom: 8
            }}
        >
            <PiWarningFill size="64" color="#ffd54f" />

            <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
                {title}
            </Typography>
            {subtitle && (
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
                    {subtitle}
                </Typography>
            )}
        </Stack>
    );

    return (
        <Stack
            direction="column"
            minHeight="100dvh"
            height="fit-content"
            width="100%"
            position="relative"
            alignItems="center"
            px={{ xs: 0, lg: 6 }}
            py={{ xs: 0, lg: 3 }}
        >
            <AdminHeader />

            <Stack
                flex={1}
                width={{ xs: "95%", lg: "65%" }}
                py={4}
                alignItems="center"
                justifyContent="start"
                gap={{ xs: 0.75, lg: 1.5 }}
                sx={{ position: "relative" }}
            >
                <Typography
                    className="conthrax"
                    variant="h3"
                    sx={{
                        fontSize: { xs: "1.4rem", lg: "2rem" },
                        fontWeight: 600,
                        background: theme.palette.uranoGradient,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mt: 4,
                    }}
                >
                    Admin Panel
                </Typography>
                <Typography
                    variant="h6"
                    sx={{ fontSize: { xs: "0.875rem", lg: "0.875rem" }, fontWeight: 400, color: theme.palette.text.primary }}
                >
                    Manage token presale rounds and vesting parameters
                </Typography>
            </Stack>

            {/* Access gating */}
            {!account ? (
                <CenterNotice
                    title="No wallet connected"
                    subtitle="Please connect a wallet with admin permissions to access the admin panel."
                />
            ) : checkingRole ? (
                <CenterNotice title="Checking access…" subtitle="Verifying admin role for the connected wallet." />
            ) : !isAdmin ? (
                <CenterNotice
                    title="Unauthorized wallet"
                    subtitle="The connected wallet does not have admin role on the presale contract."
                />
            ) : (
                // ✅ Admin content
                <Stack width={{ xs: "95%", lg: "65%" }} mb={4} gap={2}>
                    <Stack
                        sx={{
                            backgroundColor: theme.palette.presaleCardBg.main,
                            border: `1px solid ${theme.palette.headerBorder.main}`,
                            borderRadius: 2,
                            p: 3,
                            gap: 2,
                        }}
                    >
                        <RoundStatusManagement
                            singleActive
                            onChange={(next, changedId) => {
                                // Wire to contract or API when ready
                                console.log({ changedId, next });
                            }}
                            onShowMore={(id) => console.log("show more for", id)}
                        />
                    </Stack>

                    <Stack
                        sx={{
                            backgroundColor: theme.palette.presaleCardBg.main,
                            border: `1px solid ${theme.palette.headerBorder.main}`,
                            borderRadius: 2,
                            p: 3,
                            gap: 2,
                        }}
                    >
                        <InstitutionalRoundAccess subtitleOn="Public access enabled" subtitleOff="Public access disabled" />
                    </Stack>

                    
                </Stack>
            )}

            <Footer />
        </Stack>
    );
}
