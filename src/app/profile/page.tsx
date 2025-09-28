"use client"

import { Stack, Typography, Divider } from '@mui/material';
import ProfileHeader from '@/components/ProfileHeader';
import Footer from '@/components/Footer';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import { useActiveAccount } from "thirdweb/react";
import { PiWarningFill } from "react-icons/pi";

import profileToken1 from '@/assets/images/profileToken1.webp';
import profileToken2 from '@/assets/images/profileToken2.webp';

import ReferenceWallet from '@/components/Profile/ReferenceWallet';
import BoughtUrano from '@/components/Profile/BoughtUrano';
import ParticipationRound from '@/components/Profile/ParticipationRound';
import VestingAndCliffSummary from '@/components/Profile/VestingAndCliffSummary';
import UserClaimInfo from '@/components/Profile/UserClaimInfo';
import VestingSchedule from '@/components/Profile/VestingSchedule';


export default function Profile() {
    const theme = useTheme();
    const account = useActiveAccount();

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
                marginBottom: 8,
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
            height={"fit-content"}
            width={"100%"}
            position={"relative"}
            alignItems={"center"}
            px={{ xs: 0, lg: 6 }}
            py={{ xs: 0, lg: 3 }}
        >
            <ProfileHeader />

            <Image src={profileToken1} alt="profileToken1" width={360} height={360} style={{ position: "absolute", top: "20vh", right: 0 }} className="profileToken1" />
            <Stack flex={1} width={{ xs: "95%", lg: "65%" }} py={4} alignItems={"center"} justifyContent="start" gap={{ xs: 1.5, lg: 2 }} sx={{ position: "relative" }}>
                <Typography className="conthrax" variant="h3" sx={{
                    fontSize: { xs: "1.4rem", lg: "2rem" },
                    fontWeight: 600,
                    background: theme.palette.uranoGradient,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginY: 4,
                }}>Profile</Typography>
                {
                    !account ?
                        (
                            <CenterNotice
                                title="No wallet connected"
                                subtitle="Please connect a wallet with admin permissions to access the admin panel."
                            />
                        ) :
                        (
                            <Stack width="100%" gap={{ xs: 1.5, lg: 2 }}>
                                <ReferenceWallet />
                                <Stack width={"100%"} direction={{ xs: "column", lg: "row" }} alignItems={"stretch"} justifyContent={"space-between"} gap={{ xs: 1, lg: 2 }}>
                                    <BoughtUrano />
                                    <ParticipationRound />
                                </Stack>
                                <VestingAndCliffSummary />
                                <Stack width={"100%"} sx={{
                                    backgroundColor: theme.palette.presaleCardBg.main,
                                    border: `1px solid ${theme.palette.headerBorder.main}`,
                                    borderRadius: 2,
                                    padding: 3,
                                    gap: 2,
                                }}>
                                    <Stack direction={"row"} alignItems={"center"} gap={1}>
                                        <Typography variant="h6" sx={{
                                            fontSize: "1rem",
                                            fontWeight: 500,
                                            color: theme.palette.text.primary,
                                        }}>Available $URANO (Claimable)</Typography>
                                    </Stack>
                                    <UserClaimInfo />
                                    <Divider sx={{
                                        borderBottom: `0.5px solid ${theme.palette.grey[800]}`,
                                        marginTop: 2,
                                        marginBottom: 1,
                                    }} />
                                    <Stack direction={"row"} alignItems={"center"} gap={1}>
                                        <Typography variant="h6" sx={{
                                            fontSize: "1rem",
                                            fontWeight: 500,
                                            color: theme.palette.text.primary,
                                        }}>Upcoming Unlocks</Typography>
                                    </Stack>
                                    <VestingSchedule />
                                </Stack>
                            </Stack>
                        )
                }
            </Stack>
            <Image src={profileToken2} alt="profileToken2" width={300} height={300} style={{ position: "absolute", bottom: "20vh", left: -30 }} className="profileToken2" />
            <Footer />
        </Stack >
    );
}
