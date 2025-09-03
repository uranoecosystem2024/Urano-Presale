'use client'

import { Stack, Typography, Link, Box } from "@mui/material"
import Image from "next/image"
import logo from "@/assets/images/logos/logo-turquoise-1.webp"
import { useTheme, type Theme } from '@mui/material/styles';
import { PiTelegramLogoDuotone, PiXLogo } from "react-icons/pi";


const Footer = () => {
    const theme = useTheme<Theme>();
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%" sx={{
            backgroundColor: theme.palette.transparentPaper.main,
            border: `1px solid ${theme.palette.footerBorder.main}`,
            borderRadius: 2,
            paddingX: 5,
        }}>
            <Link href="/">
                <Image src={logo} alt="Logo" width={100} height={65} style={{
                    scale: 1.2,
                }} />
            </Link>
            <Stack direction="row" justifyContent="center" alignItems="center" gap={2}>
                <Link href="/" underline="none">
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingY: 1,
                            paddingX: 2,
                            borderRadius: 2,
                            '&:hover': {
                                backgroundColor: "#1A1A1A",
                                "&:hover .navLink": {
                                    background: theme.palette.uranoGradient,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                },
                            },
                        }}
                    >
                        <Typography
                            variant="body1"
                            fontWeight={400}
                            color={theme.palette.text.secondary}
                            className="navLink"
                        >
                            Terms & Conditions
                        </Typography>
                    </Box>
                </Link>
                <Link href="/" underline="none">
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingY: 1,
                            paddingX: 2,
                            borderRadius: 2,
                            '&:hover': {
                                backgroundColor: "#1A1A1A",
                                "&:hover .navLink": {
                                    background: theme.palette.uranoGradient,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                },
                            },
                        }}
                    >
                        <Typography
                            variant="body1"
                            fontWeight={400}
                            color={theme.palette.text.secondary}
                            className="navLink"
                        >
                            Privacy Policy
                        </Typography>
                    </Box>
                </Link>
            </Stack>
            <Stack direction="row" justifyContent="end" alignItems="center" gap={1}>
                <Link href="/" underline="none">
                    <Box sx={{
                        backgroundColor: theme.palette.secondary.main,
                        border: `1px solid ${theme.palette.headerBorder.main}`,
                        borderRadius: 2,
                        paddingX: 1,
                        paddingY: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        "&:hover": {
                            background: theme.palette.uranoGradient,
                            "&:hover .navIcon": {
                                filter: 'brightness(0)',
                            },
                        },
                    }}>
                        <PiXLogo size={24} color={theme.palette.text.disabled} className="navIcon" />
                    </Box>
                </Link>
                <Link href="/" underline="none">
                    <Box sx={{
                        backgroundColor: theme.palette.secondary.main,
                        border: `1px solid ${theme.palette.headerBorder.main}`,
                        borderRadius: 2,
                        paddingX: 1,
                        paddingY: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        "&:hover": {
                            background: theme.palette.uranoGradient,
                            "&:hover .navIcon": {
                                filter: 'brightness(0)',
                            },
                        },
                    }}>
                        <PiTelegramLogoDuotone size={24} color={theme.palette.text.disabled} className="navIcon" />
                    </Box>
                </Link>
            </Stack>
        </Stack>
    )
}

export default Footer;
