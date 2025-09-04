'use client'

import { Stack, Typography, Link, Box, Divider } from "@mui/material"
import Image from "next/image"
import logo from "@/assets/images/logos/logo-turquoise-1.webp"
import arb from "@/assets/images/arbdao.webp"
import { useTheme, type Theme } from '@mui/material/styles';
import { PiTelegramLogoDuotone, PiXLogo } from "react-icons/pi";
import { useState } from "react";

const Footer = () => {
    const theme = useTheme<Theme>();
    const [readMore, setReadMore] = useState(false);
    const disclaimer = "The content of this page is provided for informational purposes only and does not constitute an offer or solicitation to sell, or a recommendation to purchase, any financial instrument, security, or digital asset within the meaning of applicable laws and regulations, including Regulation (EU) 2023/1114 on Markets in Crypto-assets (MICA). Participation in the Urano token presale is subject to eligibility verification, including mandatory KYC/AML procedures in accordance with EU Anti-Money Laundering Directives and other applicable compliance frameworks. This offering is not directed to, and participation is not permitted for, residents or citizens of the USA, the UK, or any other jurisdiction where such token sales are not authorized. Access may be further restricted or prohibited in jurisdictions where the sale of crypto-assets is unlawful, or where such activities are subject to registration, licensing, or other regulatory requirements. Urano does not guarantee any specific utility, performance, financial return, or appreciation in value of the token. Tokens issued during the presale do not confer shareholder rights, profit participation, or any legal claim against Urano Ecosystem Sp. z o.o. or its affiliates. Prospective participants are solely responsible for ensuring that their involvement in the presale is compliant with the legal, regulatory, and tax obligations of their jurisdiction. They are strongly advised to consult independent legal, financial, and tax advisors prior to engaging with any token offering. By proceeding, you confirm that you have read and understood the associated risks and agree to be bound by the Terms and Conditions and Privacy Policy. Access to this page is strictly prohibited where such participation is unlawful"
    return (
        <Stack direction={"column"} justifyContent="space-between" alignItems="center" width={{ xs: "100vw", lg: "100%" }} sx={{
            backgroundColor: theme.palette.transparentPaper.main,
            borderTop: `1px solid ${theme.palette.footerBorder.main}`,
            borderBottom: { xs: "none", lg: `1px solid ${theme.palette.footerBorder.main}` },
            borderLeft: { xs: "none", lg: `1px solid ${theme.palette.footerBorder.main}` },
            borderRight: { xs: "none", lg: `1px solid ${theme.palette.footerBorder.main}` },
            borderRadius: 2,
            borderBottomLeftRadius: { xs: 0, lg: 2 },
            borderBottomRightRadius: { xs: 0, lg: 2 },
            paddingX: 5,
            paddingBottom: { xs: 3, lg: 0 },
            marginLeft: { xs: -2, lg: 0 },
        }}>
            <Stack direction={{ xs: "column", lg: "row" }} justifyContent="space-between" alignItems="center" width={{ xs: "100vw", lg: "100%" }}>
                <Link href="/">
                    <Image src={logo} alt="Logo" width={100} height={65} style={{
                        scale: 1.2,
                    }} />
                </Link>
                <Stack direction={{ xs: "column", lg: "row" }} justifyContent="center" alignItems="center" gap={2}>
                    <Link href="/terms-and-disclaimer" underline="none">
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
                                Terms & Disclaimer
                            </Typography>
                        </Box>
                    </Link>
                    <Link href="/privacy-policy" underline="none">
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
                                Cookie Policy
                            </Typography>
                        </Box>
                    </Link>
                    <Link href="/privacy-policy" underline="none">
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
                <Stack direction={"row"} justifyContent="center" alignItems="center" gap={0} marginTop={{ xs: 2, lg: 0 }}>
                    <Typography variant="body1" fontWeight={400} color={theme.palette.text.secondary}>
                        Powered by:
                    </Typography>
                    <Link href="https://www.arbitrumhub.io/" target="_blank" underline="none">
                        <Image src={arb} alt="Arb" width={120} height={40} style={{
                            marginTop: 6,
                        }} />
                    </Link>
                </Stack>
                <Stack direction="row" justifyContent="end" alignItems="center" gap={1} marginTop={{ xs: 2, lg: 0 }}>
                    <Link href="https://x.com/uranoecosystem" underline="none" target="_blank">
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
                    <Link href="https://t.me/urano_ecosystem" underline="none" target="_blank">
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
            <Divider sx={{
                width: "100%",
                borderColor: theme.palette.footerBorder.main,
                marginTop: { xs: 2, lg: 0 },
            }} />
            <Typography variant="caption" fontWeight={400} color={theme.palette.text.secondary} paddingY={2}>
                {readMore ? disclaimer : disclaimer.slice(0, 407) + "... "}
                <span>
                    <Link
                        href="/disclaimer"
                        underline="none"
                        color={theme.palette.text.primary}
                        sx={{
                            cursor: "pointer",
                            fontWeight: 500,
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            setReadMore(!readMore)
                        }}
                    >
                        {readMore ? "Show less" : "Show more"}
                    </Link>
                </span>
            </Typography>
        </Stack>
    )
}

export default Footer;
