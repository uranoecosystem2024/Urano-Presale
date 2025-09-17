"use client"

import { Box, Stack, Typography, Link, Divider } from '@mui/material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import arbLogo from '@/assets/images/WhiteText_horizontal_RGB.webp';
import { Slash, Copy } from 'iconsax-reactjs';
import { IoIosCheckmarkCircle } from "react-icons/io";


export default function Profile() {
    const theme = useTheme();
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
            <Header />

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
                <Stack width={"100%"} sx={{
                    backgroundColor: theme.palette.presaleCardBg.main,
                    border: `1px solid ${theme.palette.headerBorder.main}`,
                    borderRadius: 2,
                    padding: 3,
                    gap: 2,
                }}>
                    <Stack direction={"row"} alignItems={"center"} justifyContent={{ xs: "space-between", lg: "flex-start" }} gap={2}>
                        <Typography variant="h6" sx={{
                            fontSize: "1rem",
                            fontWeight: 500,
                            color: theme.palette.text.primary,
                        }}>Your Reference Wallet</Typography>
                        <Stack alignItems={"center"} justifyContent={"center"} sx={{
                            background: theme.palette.transparentPaper.main,
                            border: `1px solid ${theme.palette.headerBorder.main}`,
                            borderRadius: 2,
                            paddingX: 1,
                            paddingY: 0.75,
                        }}>
                            <Image src={arbLogo} alt="arbitrum-logo" style={{ width: "6rem", height: "1.55rem" }} />
                        </Stack>
                    </Stack>
                    <Stack width={"100%"} direction={{ xs: "column", lg: "row" }} alignItems={"center"} justifyContent={"space-between"} gap={{ xs: 1, lg: 0 }}>
                        <Stack width={{ xs: "100%", lg: "65%" }} direction={"row"} alignItems={"center"} gap={1} sx={{
                            background: theme.palette.transparentPaper.main,
                            border: `1px solid ${theme.palette.headerBorder.main}`,
                            borderRadius: 2,
                            paddingX: 1.5,
                            paddingY: 1,
                            overflow: "hidden",
                        }}>
                            <Box
                                sx={{
                                    width: "1.5rem",
                                    height: "1.5rem",
                                    background: theme.palette.uranoGradient,
                                    border: `1px solid ${theme.palette.headerBorder.main}`,
                                    borderRadius: "50%",
                                    padding: 1.5,
                                }}
                            />
                            <Typography variant="h6" sx={{
                                fontSize: "0.875rem",
                                fontWeight: 300,
                                color: theme.palette.text.primary,
                            }}>0xAbcdef1234567890AbCdEf1234567890AbCdEf12</Typography>
                        </Stack>
                        <Stack width={{ xs: "100%", lg: "35%" }} direction={"row"} alignItems={"center"} justifyContent={"center"} gap={{ xs: 0.5, lg: 1 }}>
                            <Link href="/" underline="none" sx={{ width: "50%" }} onClick={(e) => {
                                e.preventDefault();
                            }}>
                                <Box sx={{
                                    width: "100%",
                                    background: { xs: theme.palette.secondary.main, lg: theme.palette.secondary.main },
                                    border: `1px solid ${theme.palette.headerBorder.main}`,
                                    borderRadius: 2,
                                    paddingX: { xs: 1.5, lg: 2 },
                                    paddingY: { xs: 1.5, lg: 1 },
                                    marginLeft: { xs: 0, lg: 1 },
                                    gap: { xs: 0.5, lg: 1 },
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    "&:hover": {
                                        background: theme.palette.uranoGradient,
                                        "&:hover .connectWalletLink": {
                                            color: theme.palette.info.main,
                                        },
                                        "&:hover .iconButton": {
                                            filter: { xs: "none", lg: "brightness(0)" },
                                        },
                                    },
                                }}>
                                    <Typography variant="body1" fontWeight={400} className="connectWalletLink" sx={{
                                        color: { xs: theme.palette.text.disabled, lg: theme.palette.text.disabled }
                                    }}>Copy</Typography>
                                    <Copy variant="Bold" color={theme.palette.text.disabled} size={18} className="iconButton" />
                                </Box>
                            </Link>
                            <Link href="/" underline="none" sx={{ width: "50%" }} onClick={(e) => {
                                e.preventDefault();
                            }}>
                                <Box sx={{
                                    width: "100%",
                                    background: { xs: theme.palette.secondary.main, lg: theme.palette.secondary.main },
                                    border: `1px solid ${theme.palette.headerBorder.main}`,
                                    borderRadius: 2,
                                    paddingX: { xs: 1.5, lg: 2 },
                                    paddingY: { xs: 1.5, lg: 1 },
                                    marginLeft: { xs: 0, lg: 1 },
                                    gap: { xs: 0.5, lg: 1 },
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    "&:hover": {
                                        background: theme.palette.uranoGradient,
                                        "&:hover .connectWalletLink": {
                                            color: theme.palette.info.main,
                                        },
                                        "&:hover .buttonIcon2": {
                                            filter: { xs: "none", lg: "brightness(0)" },
                                        },
                                    },
                                }}>
                                    <Typography variant="body1" fontWeight={400} className="connectWalletLink" sx={{
                                        color: { xs: theme.palette.text.disabled, lg: theme.palette.text.disabled }
                                    }}>Disconnect</Typography>
                                    <Slash variant="Bold" color={theme.palette.text.disabled} size={18} className="buttonIcon2" />
                                </Box>
                            </Link>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack width={"100%"} direction={{ xs: "column", lg: "row" }} alignItems={"stretch"} justifyContent={"space-between"} gap={{ xs: 1, lg: 2 }}>
                    <Stack width={{ xs: "100%", lg: "50%" }} flexGrow={1} sx={{
                        backgroundColor: theme.palette.presaleCardBg.main,
                        border: `1px solid ${theme.palette.headerBorder.main}`,
                        borderRadius: 2,
                        padding: 3,
                        gap: 2,
                    }}>
                        <Stack direction={"row"} gap={2}>
                            <Typography variant="h6" sx={{
                                fontSize: "1rem",
                                fontWeight: 500,
                                color: theme.palette.text.primary,
                            }}>Total $URANO Bought</Typography>
                        </Stack>
                        <Stack width={"100%"} gap={0}>
                            <Typography variant="h6" sx={{
                                fontSize: "1.75rem",
                                fontWeight: 500,
                                background: theme.palette.uranoGradient,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>5000 $URANO</Typography>
                            <Stack direction={"row"} alignItems={"center"} gap={1.5}>
                                <Typography variant="h6" sx={{
                                    fontSize: "0.875rem",
                                    fontWeight: 400,
                                    color: theme.palette.text.secondary,
                                }}>≈ $7,500 USD</Typography>
                                <Typography variant="h6" sx={{
                                    fontSize: "0.875rem",
                                    fontWeight: 400,
                                    color: theme.palette.text.secondary,
                                }}>|</Typography>
                                <Typography variant="h6" sx={{
                                    fontSize: "0.875rem",
                                    fontWeight: 400,
                                    color: theme.palette.text.secondary,
                                }}>Round price: $0.15</Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack width={{ xs: "100%", lg: "50%" }} flexGrow={1} sx={{
                        backgroundColor: theme.palette.presaleCardBg.main,
                        border: `1px solid ${theme.palette.headerBorder.main}`,
                        borderRadius: 2,
                        padding: 3,
                        gap: 2,
                    }}>
                        <Stack direction={"row"} gap={2}>
                            <Typography variant="h6" sx={{
                                fontSize: "1rem",
                                fontWeight: 500,
                                color: theme.palette.text.primary,
                            }}>Participation Round</Typography>
                        </Stack>
                        <Stack width={"100%"} direction={"row"} alignItems={"center"} justifyContent={"center"} gap={0.5} sx={{
                            background: theme.palette.transparentPaper.main,
                            border: `1px solid ${theme.palette.headerBorder.main}`,
                            borderRadius: 2,
                            paddingX: 1.5,
                            paddingY: 1,
                            overflow: "hidden",
                        }}>
                            <Typography variant="h6" sx={{
                                fontSize: "0.875rem",
                                fontWeight: 300,
                                color: theme.palette.text.primary,
                            }}>Strategic round</Typography>
                            <Typography variant="h6" sx={{
                                fontSize: "0.875rem",
                                fontWeight: 300,
                                color: theme.palette.uranoGreen1.main,
                            }}>$0.15 per token</Typography>
                        </Stack>
                    </Stack>
                </Stack>
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
                        }}>Vesting + Cliff Summary</Typography>
                        <Typography variant="h6" sx={{
                            fontSize: "0.875rem",
                            fontWeight: 400,
                            color: theme.palette.text.secondary,
                        }}>Strategic Round</Typography>
                    </Stack>
                    <Stack width={"100%"} direction={{ xs: "column", lg: "row" }} alignItems={"center"} justifyContent={"space-between"} gap={{ xs: 1, lg: 2 }}>
                        <Stack width={{ xs: "100%", lg: "50%" }} gap={1} sx={{
                            background: theme.palette.transparentPaper.main,
                            border: `1px solid ${theme.palette.headerBorder.main}`,
                            borderRadius: 2,
                            paddingX: 1.5,
                            paddingY: 1.5,
                        }}>
                            <Typography variant="h6" sx={{
                                fontSize: "0.875rem",
                                fontWeight: 400,
                                color: theme.palette.text.secondary,
                            }}>TGE Release</Typography>
                            <Typography variant="h6" sx={{
                                fontSize: "1.5rem",
                                fontWeight: 500,
                                color: theme.palette.text.primary,
                            }}>10%</Typography>
                        </Stack>
                        <Stack width={{ xs: "100%", lg: "50%" }} gap={1} sx={{
                            background: theme.palette.transparentPaper.main,
                            border: `1px solid ${theme.palette.headerBorder.main}`,
                            borderRadius: 2,
                            paddingX: 1.5,
                            paddingY: 1.5,
                        }}>
                            <Typography variant="h6" sx={{
                                fontSize: "0.875rem",
                                fontWeight: 400,
                                color: theme.palette.text.secondary,
                            }}>Total Duration</Typography>
                            <Typography variant="h6" sx={{
                                fontSize: "1.5rem",
                                fontWeight: 500,
                                color: theme.palette.text.primary,
                            }}>24 months</Typography>
                        </Stack>
                    </Stack>
                    <Stack width={"100%"} direction={{ xs: "column", lg: "row" }} alignItems={"center"} justifyContent={"space-between"} gap={{ xs: 1, lg: 2 }}>
                        <Stack width={{ xs: "100%", lg: "50%" }} gap={1} sx={{
                            background: theme.palette.transparentPaper.main,
                            border: `1px solid ${theme.palette.headerBorder.main}`,
                            borderRadius: 2,
                            paddingX: 1.5,
                            paddingY: 1.5,
                        }}>
                            <Typography variant="h6" sx={{
                                fontSize: "0.875rem",
                                fontWeight: 400,
                                color: theme.palette.text.secondary,
                            }}>Cliff Period</Typography>
                            <Typography variant="h6" sx={{
                                fontSize: "1.5rem",
                                fontWeight: 500,
                                color: theme.palette.text.primary,
                            }}>3 months</Typography>
                        </Stack>
                        <Stack width={{ xs: "100%", lg: "50%" }} gap={1} sx={{
                            background: theme.palette.transparentPaper.main,
                            border: `1px solid ${theme.palette.headerBorder.main}`,
                            borderRadius: 2,
                            paddingX: 1.5,
                            paddingY: 1.5,
                        }}>
                            <Typography variant="h6" sx={{
                                fontSize: "0.875rem",
                                fontWeight: 400,
                                color: theme.palette.text.secondary,
                            }}>Release Frequency</Typography>
                            <Typography variant="h6" sx={{
                                fontSize: "1.5rem",
                                fontWeight: 500,
                                color: theme.palette.text.primary,
                            }}>Monthly</Typography>
                        </Stack>
                    </Stack>
                </Stack>
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
                    <Stack direction={{ xs: "column-reverse", lg: "row" }} justifyContent={"space-between"} gap={{xs:2, lg:1}}>
                        <Stack width={{ xs: "100%", lg: "50%" }} gap={1}>
                            <Stack width={"100%"} gap={{ xs: 1, lg: 2 }} direction={{ xs: "column-reverse", lg: "column" }} sx={{
                                border: "1px solid transparent",
                                background: `
                            linear-gradient(rgba(28, 34, 33, 1), rgba(28, 34, 33, 1)) padding-box,
                            linear-gradient(260.63deg, rgba(107, 226, 194, 0.82) 0%, #6BE2C2 100%) border-box,
                            linear-gradient(0deg, #242424, #242424) border-box
                        `,
                                position: "relative",
                                overflow: "hidden",
                                borderRadius: 2,
                                paddingX: 2,
                                paddingY: 2,
                            }}>
                                <Typography variant="h6" sx={{
                                    fontSize: "1rem",
                                    fontWeight: 400,
                                    color: theme.palette.text.primary,
                                }}>Unclaimed</Typography>
                                <Typography variant="h6" sx={{
                                    fontSize: "1.5rem",
                                    fontWeight: 500,
                                    background: theme.palette.uranoGradient,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>12,500 $URANO</Typography>
                            </Stack>
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
                                    }}>Claim 12,500 $URANO</Typography>
                                </Box>
                            </Link>
                        </Stack>
                        <Stack width={{ xs: "100%", lg: "50%" }} gap={1}>
                            <Stack width={"100%"} gap={{ xs: 1, lg: 2 }} direction={{ xs: "column-reverse", lg: "column" }} sx={{
                                border: "1px solid #5E9BC3",
                                background: "#1C2022",
                                position: "relative",
                                overflow: "hidden",
                                borderRadius: 2,
                                paddingX: 2,
                                paddingY: 2,
                            }}>
                                <Stack width={"100%"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} gap={1}>
                                    <Typography variant="h6" sx={{
                                        fontSize: "1rem",
                                        fontWeight: 400,
                                        color: theme.palette.text.primary,
                                    }}>Claimed</Typography>
                                    <IoIosCheckmarkCircle size={24} color={theme.palette.text.primary} />
                                </Stack>
                                <Typography variant="h6" sx={{
                                    fontSize: "1.5rem",
                                    fontWeight: 500,
                                    background: theme.palette.uranoGradient,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>5,000 $URANO</Typography>
                            </Stack>
                        </Stack>
                    </Stack>
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
                    <Stack width={"100%"} alignItems={"center"} gap={2}>
                        <Stack width={"100%"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} gap={1} sx={{
                            background: theme.palette.transparentPaper.main,
                            border: `1px solid ${theme.palette.headerBorder.main}`,
                            borderRadius: 2,
                            paddingX: 1.5,
                            paddingY: 1.5,
                            overflow: "hidden",
                        }}>
                            <Typography variant="h6" sx={{
                                fontSize: "0.875rem",
                                fontWeight: 300,
                                color: theme.palette.text.primary,
                            }}>Oct 2025</Typography>
                            <Typography variant="h6" sx={{
                                fontSize: "0.875rem",
                                fontWeight: 300,
                                color: theme.palette.text.primary,
                            }}>2083 $URANO</Typography>
                        </Stack>
                        <Stack width={"100%"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} gap={1} sx={{
                            background: theme.palette.transparentPaper.main,
                            border: `1px solid ${theme.palette.headerBorder.main}`,
                            borderRadius: 2,
                            paddingX: 1.5,
                            paddingY: 1.5,
                            overflow: "hidden",
                        }}>
                            <Typography variant="h6" sx={{
                                fontSize: "0.875rem",
                                fontWeight: 300,
                                color: theme.palette.text.primary,
                            }}>Nov 2025</Typography>
                            <Typography variant="h6" sx={{
                                fontSize: "0.875rem",
                                fontWeight: 300,
                                color: theme.palette.text.primary,
                            }}>2083 $URANO</Typography>
                        </Stack>
                        <Stack width={"100%"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} gap={1} sx={{
                            background: theme.palette.transparentPaper.main,
                            border: `1px solid ${theme.palette.headerBorder.main}`,
                            borderRadius: 2,
                            paddingX: 1.5,
                            paddingY: 1.5,
                            overflow: "hidden",
                        }}>
                            <Typography variant="h6" sx={{
                                fontSize: "0.875rem",
                                fontWeight: 300,
                                color: theme.palette.text.primary,
                            }}>Dec 2025</Typography>
                            <Typography variant="h6" sx={{
                                fontSize: "0.875rem",
                                fontWeight: 300,
                                color: theme.palette.text.primary,
                            }}>2083 $URANO</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>

            <Footer />
        </Stack >
    );
}
