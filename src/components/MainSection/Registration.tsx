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
            <Stack width={{xs:"48%",lg:"40%"}} direction={"row"} alignItems={"center"} gap={{xs: 1, lg: 4}} sx={{
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
                    paddingX: 2,
                    paddingY: 1,
                    aspectRatio: 1,
                    background: theme.palette.uranoGradient,
                }}>
                    <Typography variant="body1" sx={{
                        fontWeight: 500,
                        fontSize: {xs: "1rem", lg: "1.5rem"},
                        lineHeight: 1,
                        color: "#2A6A69",
                    }}>
                        1
                    </Typography>
                </Box>
                <Typography variant="subtitle2" sx={{
                    fontWeight: 500,
                    fontSize: {xs: "0.75rem", lg: "0.875rem"},
                    color: theme.palette.text.primary,
                    width: "40%",
                }}>
                    Register With Email
                </Typography>

            </Stack>
            <IoChevronForward size={24} color={theme.palette.text.primary} />
            <Stack width={{xs:"48%",lg:"40%"}} direction={"row"} alignItems={"center"} gap={{xs: 1, lg: 4}} sx={{
                background: theme.palette.background.paper,
                borderRadius: 2,
                padding: 1,
                border: `1px solid ${theme.palette.headerBorder.main}`,
            }}>
                <Box sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 1.5,
                    paddingX: 2,
                    paddingY: 1,
                    aspectRatio: 1,
                    background: theme.palette.uranoGradient,
                }}>
                    <Typography variant="body1" sx={{
                        fontWeight: 500,
                        fontSize: {xs: "1rem", lg: "1.5rem"},
                        lineHeight: 1,
                        color: "#2A6A69",
                    }}>
                        2
                    </Typography>
                </Box>
                <Stack width={"100%"}>
                    <Typography variant="subtitle2" sx={{
                        fontWeight: 500,
                        fontSize: {xs: "0.75rem", lg: "0.875rem"},
                        color: theme.palette.text.primary,
                    }}>
                        Verify Identity
                    </Typography>
                    <Typography variant="subtitle2" sx={{
                        fontWeight: 400,
                        fontSize: {xs: "0.65rem", lg: "0.75rem"},
                        color: theme.palette.text.secondary,
                    }}>
                        Coming Soon
                    </Typography>
                </Stack>
            </Stack>

        </Stack>
        <SubscriptionModal open={open} onClose={() => setOpen(false)} />
        
        </>
    )
}

export default Registration;
