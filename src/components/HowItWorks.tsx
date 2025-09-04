"use client"

import { Stack, Typography, Box, Link } from "@mui/material"
import { useTheme, type Theme } from "@mui/material/styles"
import Union from "@/assets/images/Union.png"
import img1 from "@/assets/images/img1.webp"
import Image from "next/image"

const HowItWorks = () => {
    const theme = useTheme<Theme>();
    return (
        <Stack height={"50%"} width={"100%"} sx={{
            borderRadius: 2,
            position: 'relative',
            paddingX: {xs: 2, lg: 0},
            paddingY: {xs: 2, lg: 0},
            backgroundColor: theme.palette.background.paper,
        }}>
            <Image className="howItWorksUnion" src={Union} alt="Union" fill style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
            <Typography variant="h5" sx={{
                background: theme.palette.uranoGradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 500,
                fontSize: 22,
                position: "absolute",
                top: 0,
                left: 0,
                marginTop: "1%",
                marginLeft: "3.75%",
                zIndex: 2,
                display: {xs: "none", lg: "block"},

            }}>How it works</Typography>
            <Typography variant="h5" sx={{
                background: theme.palette.uranoGradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 500,
                fontSize: 22,
            }}>How it works</Typography>
            <Stack width={"100%"} height={"100%"} sx={{
                minHeight: 220,
                width: "100%",
                display: "flex",
                flexDirection: {xs: "column", lg: "row"},
                justifyContent: "space-between",
                alignItems: "center",
                paddingX: {xs: 0, lg: 5},
                paddingTop: {xs: 2, lg: 6},
                paddingBottom: 2,
                gap: 4,
                position: "relative",
                zIndex: 2,
            }}>
                <Stack width={{xs:"100%",lg:"22%"}} gap={1}>
                    <Typography variant="subtitle1" color={"#fff"} sx={{
                        fontWeight: 500,
                        fontSize: 16,
                    }}>Tokenize</Typography>
                    <Typography variant="body2" sx={{
                        fontWeight: 400,
                        fontSize: 14,
                        color: theme.palette.text.secondary,
                    }}>Real-world assets are digitized into secure, compliant tokens.</Typography>
                </Stack>

                <Stack width={{xs:"100%",lg:"22%"}} gap={1}>
                    <Typography variant="subtitle1" sx={{
                        fontWeight: 500,
                        fontSize: 16,
                    }}>Invest</Typography>
                    <Typography variant="body2" sx={{
                        fontWeight: 400,
                        fontSize: 14,
                        color: theme.palette.text.secondary,
                    }}>Access fractional ownership with low entry barriers</Typography>
                </Stack>

                <Stack width={{xs:"100%",lg:"22%"}} gap={1}>
                    <Typography variant="subtitle1" sx={{
                        fontWeight: 500,
                        fontSize: 16,
                    }}>Earn / Settle</Typography>
                    <Typography variant="body2" sx={{
                        fontWeight: 400,
                        fontSize: 14,
                        color: theme.palette.text.secondary,
                    }}>Receive returns and settlements instantly via blockchain.</Typography>
                </Stack>

                <Stack width={{xs:"100%",lg:"22%"}} alignItems={"center"} justifyContent={"end"}marginTop={-2}>
                    <Image src={img1} alt="img1" width={220} height={150} />
                    <Link href="/" underline="none" sx={{
                        width: {xs: "95%", lg: "fit-content"},
                    }}>
                        <Box sx={{
                            width: {xs: "100%", lg: "fit-content"},
                            marginTop: -4,
                            backgroundColor: theme.palette.secondary.main,
                            border: `1px solid ${theme.palette.headerBorder.main}`,
                            borderRadius: 2,
                            boxShadow: 2,
                            paddingX: 3,
                            paddingY: 1,
                            marginLeft: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            "&:hover": {
                                background: theme.palette.uranoGradient,
                                "&:hover .connectWalletLink": {
                                    color: theme.palette.info.main,
                                },
                            },
                        }}>
                            <Typography variant="body1" fontWeight={400} color={theme.palette.text.disabled} className="connectWalletLink">Compliance Note</Typography>
                        </Box>
                    </Link>
                </Stack>
            </Stack>
            <Box sx={{
                width: "100%",
                height: 5,
                position: "absolute",
                bottom: 0,
                left: 0,
                zIndex: 5,
                paddingX: 5,
                display: {xs: "none", lg: "block"},
            }} >
                <Box sx={{
                    width: "calc(66% + 8rem)",
                    height: "100%",
                    borderBottom: `3px solid ${theme.palette.uranoGreen1.main}`,
                }} />
            </Box>
        </Stack>
    )
}

export default HowItWorks;
