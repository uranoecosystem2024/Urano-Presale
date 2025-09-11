"use client"

import { useState } from "react";
import { Stack, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { IoChevronForward } from "react-icons/io5";
import SubscriptionModal from "../SubscriptionModal";

const Registration = () => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    return (
        <>
            <Stack width={"100%"} direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Stack width={{ xs: "48%", lg: "35%" }} direction={"row"} alignItems={"center"} gap={{ xs: 1, lg: 2 }} sx={{
                    background: theme.palette.background.paper,
                    borderRadius: 2,
                    padding: 1,
                    border: `1px solid ${theme.palette.headerBorder.main}`,
                    cursor: "pointer",
                    "&:hover": {
                        border: `1px solid ${theme.palette.uranoGreen1.main}`,
                    },
                }}
                    onClick={() => setOpen(true)}
                >
                    <Box sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 1.5,
                        paddingX: 1,
                        paddingY: 0.5,
                        aspectRatio: 1,
                        background: theme.palette.uranoGradient,
                        backgroundColor: "yellow",
                    }}>
                        <Typography variant="body1" sx={{
                            fontWeight: 500,
                            fontSize: { xs: "1rem", lg: "1.45rem" },
                            lineHeight: 1,
                            color: "#2A6A69",
                        }}>
                            1
                        </Typography>
                    </Box>
                    <Typography variant="subtitle2" sx={{
                        fontWeight: 500,
                        fontSize: { xs: "0.75rem", lg: "0.75rem" },
                        color: theme.palette.text.primary,
                        width: "80%",
                    }}>
                        Register with Email
                    </Typography>

                </Stack>
                <IoChevronForward size={24} color={theme.palette.text.primary} style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }} />
                <Stack width={{ xs: "48%", lg: "35%" }} direction={"row"} alignItems={"center"} gap={{ xs: 1, lg: 2 }} sx={{
                    background: theme.palette.background.paper,
                    borderRadius: 2,
                    padding: 1,
                    border: `1px solid ${theme.palette.headerBorder.main}`,
                    cursor: "pointer",
                    "&:hover": {
                        border: `1px solid ${theme.palette.uranoGreen1.main}`,
                    },
                }}
                    onClick={() => setOpen(true)}
                >
                    <Box sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 1.5,
                        paddingX: 1,
                        paddingY: 0.5,
                        aspectRatio: 1,
                        background: theme.palette.uranoGradient,
                        backgroundColor: "yellow",
                    }}>
                        <Typography variant="body1" sx={{
                            fontWeight: 500,
                            fontSize: { xs: "1rem", lg: "1.45rem" },
                            lineHeight: 1,
                            color: "#2A6A69",
                        }}>
                            2
                        </Typography>
                    </Box>
                    <Typography variant="subtitle2" sx={{
                        fontWeight: 500,
                        fontSize: { xs: "0.75rem", lg: "0.75rem" },
                        color: theme.palette.text.primary,
                        width: "80%",
                    }}>
                        Verify your identity
                    </Typography>

                </Stack>
                <IoChevronForward size={24} color={theme.palette.text.primary} style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }} />
                <Stack width={{ xs: "48%", lg: "35%" }} direction={"row"} alignItems={"center"} gap={{ xs: 1, lg: 2 }} sx={{
                    background: theme.palette.background.paper,
                    borderRadius: 2,
                    padding: 1,
                    border: `1px solid ${theme.palette.headerBorder.main}`,
                    cursor: "pointer",
                    "&:hover": {
                        border: `1px solid ${theme.palette.uranoGreen1.main}`,
                    },
                }}
                    onClick={() => setOpen(true)}
                >
                    <Box sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 1.5,
                        paddingX: 1,
                        paddingY: 0.5,
                        aspectRatio: 1,
                        background: theme.palette.uranoGradient,
                        backgroundColor: "yellow",
                    }}>
                        <Typography variant="body1" sx={{
                            fontWeight: 500,
                            fontSize: { xs: "1rem", lg: "1.45rem" },
                            lineHeight: 1,
                            color: "#2A6A69",
                        }}>
                            3
                        </Typography>
                    </Box>
                    <Typography variant="subtitle2" sx={{
                        fontWeight: 500,
                        fontSize: { xs: "0.75rem", lg: "0.75rem" },
                        color: theme.palette.text.primary,
                        width: "80%",
                    }}>
                        Connect wallet & Buy
                    </Typography>

                </Stack>

            </Stack>
            <SubscriptionModal open={open} onClose={() => setOpen(false)} />

        </>
    )
}

export default Registration;
