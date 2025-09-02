import { Stack, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { IoChevronForward } from "react-icons/io5";



const Registration = () => {
    const theme = useTheme();
    return (
        <Stack width={"100%"} direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
            <Stack width={"40%"} direction={"row"} alignItems={"center"} gap={4} sx={{
                background: theme.palette.background.paper,
                borderRadius: 2,
                padding: 1,
                border: `1px solid ${theme.palette.headerBorder.main}`,
                cursor: "pointer",
                "&:hover": {
                    border: `1px solid ${theme.palette.uranoGreen1.main}`,
                },
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
                        fontSize: "1.5rem",
                        lineHeight: 1,
                        color: "#2A6A69",
                    }}>
                        1
                    </Typography>
                </Box>
                <Typography variant="subtitle2" sx={{
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    width: "40%",
                }}>
                    Register With Email
                </Typography>

            </Stack>
            <IoChevronForward size={24} color={theme.palette.text.primary} />
            <Stack width={"40%"} direction={"row"} alignItems={"center"} gap={4} sx={{
                background: theme.palette.background.paper,
                borderRadius: 2,
                padding: 1,
                border: `1px solid ${theme.palette.headerBorder.main}`,
                cursor: "pointer",
                "&:hover": {
                    border: `1px solid ${theme.palette.uranoGreen1.main}`,
                },
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
                        fontSize: "1.5rem",
                        lineHeight: 1,
                        color: "#2A6A69",
                    }}>
                        2
                    </Typography>
                </Box>
                <Stack width={"100%"}>
                    <Typography variant="subtitle2" sx={{
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                    }}>
                        Verify Identity
                    </Typography>
                    <Typography variant="subtitle2" sx={{
                        fontWeight: 400,
                        color: theme.palette.text.secondary,
                    }}>
                        Coming Soon
                    </Typography>
                </Stack>
            </Stack>

        </Stack>
    )
}

export default Registration;
