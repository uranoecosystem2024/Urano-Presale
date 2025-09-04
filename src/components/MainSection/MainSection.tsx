"use client"
import { Typography, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Registration from "./Registration";
import PresaleCard from "./PresaleCard";
import TokensSelection from "./TokensSelection";
import mobileCoin1 from "@/assets/images/mobileCoin1.webp"
import Image from "next/image";
const MainSection = () => {
    const theme = useTheme();
    return (
        <Stack width={"100%"} flex={1} direction={{ xs: "column", lg: "row" }} justifyContent={"space-between"} alignItems={"stretch"} paddingTop={2} paddingBottom={4}>
            <Stack width={{ xs: "100%", lg: "60%" }} flexGrow={1} gap={4}>
                <Typography className="conthrax" variant="h3" sx={{
                    fontSize: { xs: "1.4rem", lg: "2.5rem" },
                    fontWeight: 700,
                    background: theme.palette.uranoGradient,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>Unlocking the power<br /> of on-chain tokenization</Typography>
                <Stack>
                    <Typography className="conthrax" variant="h6" sx={{
                        fontSize: { xs: "1rem", lg: "1.5rem" },
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                    }}>
                        Welcome to Urano Ecosystem
                    </Typography>
                    <Typography variant="h6" sx={{
                        fontSize: { xs: "1rem", lg: "1.25rem" },
                        fontWeight: { xs: 400, lg: 400 },
                        color: theme.palette.text.primary,
                    }}>
                        The gateway to Real World Assets tokenization
                    </Typography>
                </Stack>
                <Stack display={{ xs: "flex", lg: "none" }} width={"100%"} justifyContent={"center"} alignItems={"center"} sx={{
                    marginY: -6
                }}>
                    <Image
                        src={mobileCoin1}
                        className="mobileCoin1"
                        alt="coins urano"
                        style={{ width: "100%", height: "auto" }}
                        priority
                    />
                </Stack>
                <Stack gap={1.5} display={{ xs: "none", lg: "flex" }}>
                    <Typography variant="h6" sx={{
                        fontSize: "1rem",
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                    }}>
                        Compliant RWA – <span style={{ fontWeight: 300 }}>Full regulatory alignment for secure investments</span>
                    </Typography>
                    <Typography variant="h6" sx={{
                        fontSize: "1rem",
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                    }}>
                        Fractional Access – <span style={{ fontWeight: 300 }}>Invest in real estate, SMEs, art & more</span>
                    </Typography>
                    <Typography variant="h6" sx={{
                        fontSize: "1rem",
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                    }}>
                        Instant Settlement – <span style={{ fontWeight: 300 }}>Blockchain-powered transactions, fast and transparent</span>
                    </Typography>
                </Stack>
                <Stack gap={1.5} display={{ xs: "flex", lg: "none" }}>
                    <Stack gap={1} sx={{
                        background: theme.palette.transparentPaper.main,
                        border: `1px solid ${theme.palette.headerBorder.main}`,
                        borderRadius: 2,
                        padding: 2,
                    }}>
                        <Typography variant="h6" sx={{
                            fontSize: "1.15rem",
                            fontWeight: 500,
                            color: theme.palette.text.primary,
                        }}>
                            Compliant RWA
                        </Typography>
                        <Typography variant="h6" sx={{
                            fontSize: "1rem",
                            fontWeight: 300,
                            color: theme.palette.text.primary,
                        }}>
                            Full regulatory alignment for secure investments
                        </Typography>
                    </Stack>
                    <Stack gap={1} sx={{
                        background: theme.palette.transparentPaper.main,
                        border: `1px solid ${theme.palette.headerBorder.main}`,
                        borderRadius: 2,
                        padding: 2,
                    }}>
                        <Typography variant="h6" sx={{
                            fontSize: "1.15rem",
                            fontWeight: 500,
                            color: theme.palette.text.primary,
                        }}>
                            Fractional Access
                        </Typography>
                        <Typography variant="h6" sx={{
                            fontSize: "1rem",
                            fontWeight: 300,
                            color: theme.palette.text.primary,
                        }}>
                            Invest in real estate, SMEs, art & more
                        </Typography>
                    </Stack>
                    <Stack gap={1} sx={{
                        background: theme.palette.transparentPaper.main,
                        border: `1px solid ${theme.palette.headerBorder.main}`,
                        borderRadius: 2,
                        padding: 2,
                    }}>
                        <Typography variant="h6" sx={{
                            fontSize: "1.15rem",
                            fontWeight: 500,
                            color: theme.palette.text.primary,
                        }}>
                            Instant Settlement
                        </Typography>
                        <Typography variant="h6" sx={{
                            fontSize: "1rem",
                            fontWeight: 300,
                            color: theme.palette.text.primary,
                        }}>
                            Blockchain-powered transactions, fast and transparent
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>
            <Stack width={{ xs: "100%", lg: "40%" }} flexGrow={1} gap={{ xs: 3, lg: 3 }} marginTop={{ xs: 4, lg: 0 }}>
                <Registration />
                <PresaleCard />
                <TokensSelection />
            </Stack>
        </Stack>
    )
}

export default MainSection;
