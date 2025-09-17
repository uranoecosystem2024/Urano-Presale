"use client"
import { Typography, Stack, Link, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Registration from "./Registration";
import PresaleCard from "./PresaleCard";
import TokensSelection from "./TokensSelection";
import mobileCoin1 from "@/assets/images/mobileCoin1.webp"
import icon1 from "@/assets/images/icon1.webp"
import icon2 from "@/assets/images/icon2.webp"
import icon3 from "@/assets/images/icon3.webp"
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
                        fontSize: { xs: "1rem", lg: "0.95rem" },
                        fontWeight: { xs: 400, lg: 300 },
                        color: theme.palette.text.primary,
                    }}>
                        The gateway to tokenized Real World Assets, powered by <span style={{ fontWeight: 600, color: theme.palette.uranoGreen1.main }}>$URANO</span>
                    </Typography>
                </Stack>
                <Stack display={{ xs: "flex", lg: "none" }} width={"100%"} justifyContent={"center"} alignItems={"center"} sx={{
                    marginY: -6
                }}>
                    <Image
                        src={mobileCoin1}
                        className="mobileCoin1"
                        alt="coins urano"
                        style={{ width: "100%", height: "auto", scale: 1.2 }}
                        priority
                    />
                </Stack>
                <Stack gap={1.5} display={{ xs: "none", lg: "flex" }}>
                    <Stack direction={"row"} gap={1} alignItems={"center"}>
                        <Typography variant="h6" sx={{
                            fontSize: "1rem",
                            fontWeight: 500,
                            color: theme.palette.text.primary,
                        }}>
                            Shape The Future – <span style={{ fontWeight: 300, color: theme.palette.darkerText.main }}>Gain governance rights to influence Urano’s direction</span>
                        </Typography>
                    </Stack>
                    <Stack direction={"row"} gap={1} alignItems={"center"}>
                        <Typography variant="h6" sx={{
                            fontSize: "1rem",
                            fontWeight: 500,
                            color: theme.palette.text.primary,
                        }}>
                            Early Access – <span style={{ fontWeight: 300, color: theme.palette.darkerText.main }}>Get priority entry to exclusive RWA offerings</span>
                        </Typography>
                    </Stack>
                    <Stack direction={"row"} gap={1} alignItems={"center"}>
                        <Typography variant="h6" sx={{
                            fontSize: "1rem",
                            fontWeight: 500,
                            color: theme.palette.text.primary,
                        }}>
                            Staking Rewards – <span style={{ fontWeight: 300, color: theme.palette.darkerText.main }}>Unlock dynamic incentives through staking <span style={{ fontWeight: 600, color: theme.palette.uranoGreen1.main }}>$URANO</span></span>
                        </Typography>
                    </Stack>
                    <Stack direction={"row"} gap={1} alignItems={"center"}>
                        <Typography variant="h6" sx={{
                            fontSize: "1rem",
                            fontWeight: 500,
                            color: theme.palette.text.primary,
                        }}>
                            Revenue-sharing Pool – <span style={{ fontWeight: 300, color: theme.palette.darkerText.main }}>Access protocol fees distributed to key contributors</span>
                        </Typography>
                    </Stack>
                </Stack>
                <Stack gap={1.5} display={{ xs: "flex", lg: "none" }}>
                    <Stack gap={1} sx={{
                        background: theme.palette.transparentPaper.main,
                        border: `1px solid ${theme.palette.headerBorder.main}`,
                        borderRadius: 2,
                        padding: 2,
                    }}>
                        <Stack direction={"row"} justifyContent={"start"} alignItems={"center"} gap={1}>
                            <Image src={icon1} alt="icon1" style={{ width: "1.2rem", height: "1.2rem" }} />
                            <Typography variant="h6" sx={{
                                fontSize: "1.15rem",
                                fontWeight: 500,
                                color: theme.palette.text.primary,
                            }}>
                                Shape The Future
                            </Typography>
                        </Stack>
                        <Typography variant="h6" sx={{
                            fontSize: "1rem",
                            fontWeight: 300,
                            color: theme.palette.text.primary,
                        }}>
                            Gain governance rights to influence Urano’s direction
                        </Typography>
                    </Stack>
                    <Stack gap={1} sx={{
                        background: theme.palette.transparentPaper.main,
                        border: `1px solid ${theme.palette.headerBorder.main}`,
                        borderRadius: 2,
                        padding: 2,
                    }}>
                        <Stack direction={"row"} justifyContent={"start"} alignItems={"center"} gap={1}>
                            <Image src={icon2} alt="icon2" style={{ width: "1.2rem", height: "1.2rem" }} />
                            <Typography variant="h6" sx={{
                                fontSize: "1.15rem",
                                fontWeight: 500,
                                color: theme.palette.text.primary,
                            }}>
                                Early Access
                            </Typography>
                        </Stack>
                        <Typography variant="h6" sx={{
                            fontSize: "1rem",
                            fontWeight: 300,
                            color: theme.palette.text.primary,
                        }}>
                            Get priority entry to exclusive RWA offerings
                        </Typography>
                    </Stack>
                    <Stack gap={1} sx={{
                        background: theme.palette.transparentPaper.main,
                        border: `1px solid ${theme.palette.headerBorder.main}`,
                        borderRadius: 2,
                        padding: 2,
                    }}>
                        <Stack direction={"row"} justifyContent={"start"} alignItems={"center"} gap={1}>
                            <Image src={icon3} alt="icon3" style={{ width: "1.2rem", height: "1.2rem" }} />
                            <Typography variant="h6" sx={{
                                fontSize: "1.15rem",
                                fontWeight: 500,
                                color: theme.palette.text.primary,
                            }}>
                                Staking Rewards
                            </Typography>
                        </Stack>
                        <Typography variant="h6" sx={{
                            fontSize: "1rem",
                            fontWeight: 300,
                            color: theme.palette.text.primary,
                        }}>
                            Unlock dynamic incentives through staking <span style={{ fontWeight: 600, color: theme.palette.uranoGreen1.main }}>$URANO</span>
                        </Typography>
                    </Stack>
                </Stack>
                <Link href="https://www.uranoecosystem.com/token" underline="none" target="_blank" sx={{
                    display: { xs: "none", lg: "flex" },
                }}>
                    <Box sx={{
                        width: "fit-content",
                        background: theme.palette.uranoGradient,
                        border: `2px solid ${theme.palette.headerBorder.main}`,
                        borderRadius: 2,
                        paddingX: { xs: 1.5, lg: 5 },
                        paddingY: { xs: 1.5, lg: 1 },
                        marginLeft: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        "&:hover": {
                            border: `2px solid ${theme.palette.text.primary}`,
                            filter: "brightness(1.2)",
                        },
                    }}>
                        <Typography variant="body1" fontWeight={400} sx={{
                            color: theme.palette.background.default
                        }}>Learn More</Typography>
                    </Box>
                </Link>
            </Stack>
            <Stack width={{ xs: "100%", lg: "40%" }} flexGrow={1} gap={{ xs: 3, lg: 3 }} marginTop={{ xs: 4, lg: 0 }} sx={{
                backgroundColor: { xs: "transparent", lg: theme.palette.transparentPaper.main },
                border: { xs: "none", lg: `1px solid ${theme.palette.headerBorder.main}` },
                borderRadius: { xs: 0, lg: "0.75rem" },
                padding: { xs: 0, lg: "0.6rem" },
                backdropFilter: { xs: "none", lg: "blur(8.2px)" }
            }}>
                <Registration />
                <PresaleCard />
                <TokensSelection />
                <Link href="/" underline="none" target="_blank"
                onClick={(e) => {
                    e.preventDefault();
                }}
                >
                    <Box sx={{
                        width: "100%",
                        background: theme.palette.uranoGradient,
                        border: `2px solid ${theme.palette.headerBorder.main}`,
                        borderRadius: 2,
                        paddingX: { xs: 1.5, lg: 5 },
                        paddingY: { xs: 1.5, lg: 1 },
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        "&:hover": {
                            border: `2px solid ${theme.palette.text.primary}`,
                            filter: "brightness(1.2)",
                        },
                    }}>
                        <Typography variant="body1" fontWeight={400} sx={{
                            color: theme.palette.background.default
                        }}>Connect Wallet</Typography>
                    </Box>
                </Link>
            </Stack>
        </Stack>
    )
}

export default MainSection;
