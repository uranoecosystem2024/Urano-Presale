"use client"

import { Box, Divider, IconButton, Link, Stack, Typography } from "@mui/material"
import Drawer from "@mui/material/Drawer"
import { useState } from "react"
import Image from "next/image"
import { useTheme, type Theme } from '@mui/material/styles';
// assets
import { IoMdClose } from "react-icons/io"
import logo from "@/assets/images/logos/logo-turquoise-1.webp"
import { PiXLogo, PiTelegramLogoDuotone } from "react-icons/pi";
import { IoChevronForward } from "react-icons/io5";
import { MdMenu } from "react-icons/md";


const MobileMenu = () => {
    const theme = useTheme<Theme>();
    const [open, setOpen] = useState(false)
    const handleClose = () => {
        setOpen(false)
    }
    return (
        <>
            <Drawer
                anchor="right"
                open={open}
                onClose={handleClose}
                sx={{
                    display: { xs: "flex", lg: "none" },
                    width: "75%",
                    height: "100%",
                    paddingBottom: 2,
                    backgroundColor: `${theme.palette.background.default} !important`,
                    backgroundImage: "none !important",
                    position: "relative",
                    "& .MuiDrawer-paper": {
                        backgroundColor: `${theme.palette.background.default} !important`,
                        backgroundImage: "none !important",
                        width: "100%",
                        height: "100%",
                    },
                    "& .MuiDrawer-root": {
                        backgroundColor: `${theme.palette.background.default} !important`,
                        backgroundImage: "none !important",
                    },
                    "& .MuiDrawer-paperAnchorRight": {
                        backgroundColor: `${theme.palette.background.default} !important`,
                        backgroundImage: "none !important",
                    },
                }}
            >
                <Stack
                    width="100%"
                    direction={"row"}
                    justifyContent={{ xs: "space-between", lg: "end" }}
                    alignItems={"center"}
                    paddingTop={{ xs: 0, lg: 2 }}
                    paddingBottom={{ xs: 0, lg: 2 }}
                    paddingLeft={{ xs: 2.5, sm: 2 }}
                    paddingRight={{ xs: 2.5, sm: 2 }}
                    marginBottom={6}
                    gap={1}
                    minHeight={{ xs: "none", lg: "82px" }}
                    sx={{
                        backgroundColor: { xs: theme.palette.background.paper, lg: "transparent" },
                        borderBottom: { xs: `1px solid ${theme.palette.headerBorder.main}`, lg: "none" },
                        borderBottomLeftRadius: { xs: 12, lg: 0 },
                        borderBottomRightRadius: { xs: 12, lg: 0 },
                    }}
                >
                    <Box display={{ xs: "flex", lg: "none" }}>
                        <Link href="/">
                            <Image src={logo} alt="Logo" width={100} height={65} style={{
                                scale: 1.2,
                            }} />
                        </Link>
                    </Box>
                    <Stack direction="row" alignItems="center" justifyContent="end" gap={1}>
                        <Link href="/" underline="none" onClick={(e) => {
                            e.preventDefault();
                        }}>
                            <Box sx={{
                                background: theme.palette.secondary.main,
                                border: `1px solid ${theme.palette.headerBorder.main}`,
                                borderRadius: 2,
                                paddingX: { xs: 1.5, lg: 2 },
                                paddingY: { xs: 1.5, lg: 1 },
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
                                <Typography variant="body1" fontWeight={400} className="connectWalletLink" sx={{
                                    color: theme.palette.text.disabled
                                }}>Connect Wallet</Typography>
                            </Box>
                        </Link>
                        <IconButton onClick={handleClose} sx={{
                            border: `1px solid ${theme.palette.headerBorder.main}`,
                            backgroundColor: theme.palette.secondary.main,
                            borderRadius: 2,
                            paddingX: 1.5,
                            paddingY: 1.5,
                            display: { xs: "flex", lg: "none" },
                        }}>
                            <IoMdClose size={24} color={theme.palette.text.disabled} />
                        </IconButton>
                    </Stack>

                </Stack>
                <Stack
                    alignItems={"start"}
                    justifyContent={"start"}
                    width={"100%"}
                    gap={2.5}
                >
                    <Stack width={"100%"} alignItems={"center"} gap={2.5}>
                        <Link
                            href={"/"}
                            width={"100%"}
                            display={"flex"}
                            underline="none"
                        >
                            <Stack width={"100%"} direction="row" alignItems={"center"} justifyContent={"space-between"} gap={1} sx={{
                                paddingX: 2,
                            }}>
                                <Typography
                                    variant="h5"
                                    fontWeight={400}
                                    color={theme.palette.text.secondary}
                                >
                                    Homepage
                                </Typography>
                                <IoChevronForward size={24} color={theme.palette.text.secondary} />

                            </Stack>
                        </Link>
                        <Divider sx={{
                            width: "100%",
                            borderColor: theme.palette.headerBorder.main,
                        }} />
                    </Stack>
                    <Stack width={"100%"} alignItems={"center"} gap={2.5}>
                        <Link
                            href={"https://docs.uranoecosystem.com/"}
                            width={"100%"}
                            display={"flex"}
                            underline="none"
                            target="_blank"
                        >
                            <Stack width={"100%"} direction="row" alignItems={"center"} justifyContent={"space-between"} gap={1} sx={{
                                paddingX: 2,
                            }}>
                                <Typography
                                    variant="h5"
                                    fontWeight={400}
                                    color={theme.palette.text.secondary}
                                >
                                    Docs
                                </Typography>
                                <IoChevronForward size={24} color={theme.palette.text.secondary} />

                            </Stack>
                        </Link>
                        <Divider sx={{
                            width: "100%",
                            borderColor: theme.palette.headerBorder.main,
                        }} />
                    </Stack>
                    <Stack width={"100%"} alignItems={"center"} gap={2.5}>
                        <Link
                            href={"https://docs.uranoecosystem.com/ecosystem/interactive-blocks/tokenomics"}
                            width={"100%"}
                            display={"flex"}
                            underline="none"
                            target="_blank"
                        >
                            <Stack width={"100%"} direction="row" alignItems={"center"} justifyContent={"space-between"} gap={1} sx={{
                                paddingX: 2,
                            }}>
                                <Typography
                                    variant="h5"
                                    fontWeight={400}
                                    color={theme.palette.text.secondary}
                                >
                                    Tokenomics
                                </Typography>
                                <IoChevronForward size={24} color={theme.palette.text.secondary} />

                            </Stack>
                        </Link>
                        <Divider sx={{
                            width: "100%",
                            borderColor: theme.palette.headerBorder.main,
                        }} />
                    </Stack>
                </Stack>
                <Stack
                    position={"absolute"}
                    width={"100%"}
                    gap={1}
                    sx={{
                        bottom: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 1,
                    }}
                >
                    <Stack
                        direction={"row"}
                        gap={3}
                        marginTop={{ xs: 8, lg: 0 }}
                        marginBottom={{ xs: 2, lg: 0 }}
                        paddingX={2}
                        width={"100%"}
                        justifyContent={"center"}
                    >
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
                                <PiXLogo size={32} color={theme.palette.text.disabled} className="navIcon" />
                            </Box>
                        </Link>
                        <Link href="t.me/UranoEcosystem" underline="none" target="_blank">
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
                                <PiTelegramLogoDuotone size={32} color={theme.palette.text.disabled} className="navIcon" />
                            </Box>
                        </Link>
                    </Stack>
                    <Stack direction="row" justifyContent="center" alignItems="center" gap={1} marginBottom={2}>
                        <Link href="/terms-and-disclaimer" underline="none">
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',

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
                        <Typography variant="body1" fontWeight={400} color={theme.palette.text.secondary} className="navLink">
                            |
                        </Typography>
                        <Link href="/privacy-policy" underline="none">
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
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
                        <Typography variant="body1" fontWeight={400} color={theme.palette.text.secondary} className="navLink">
                            |
                        </Typography>
                        <Link href="/cookie-policy" underline="none">
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
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
                    </Stack>
                </Stack>
            </Drawer>
            <IconButton onClick={() => setOpen(true)} sx={{
                border: `1px solid ${theme.palette.headerBorder.main}`,
                backgroundColor: theme.palette.secondary.main,
                borderRadius: 2,
                paddingX: 1.5,
                paddingY: 1.5,
                display: { xs: "flex", lg: "none" },
            }}>
                <MdMenu size={24} color={theme.palette.text.disabled} />
            </IconButton>
        </>
    )
}

export default MobileMenu
