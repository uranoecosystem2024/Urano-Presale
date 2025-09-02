import { Stack, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const PresaleCard = () => {
    const theme = useTheme();
    return (
        <Stack width={"100%"} alignItems={"center"} borderRadius={2} padding={2} gap={2} border={`1px solid ${theme.palette.headerBorder.main}`} sx={{
            background: theme.palette.background.paper,
        }}>
            <Typography variant="h5" sx={{
                fontWeight: 600,
                fontSize: "1.5rem",
                background: theme.palette.uranoGradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 2,
            }}>
                $URANO Pre-Sale
            </Typography>
            <Stack width={"100%"} direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Stack gap={0.5}>
                    <Typography variant="subtitle2" sx={{
                        fontWeight: 400,
                        fontSize: "0.875rem",
                        color: theme.palette.text.secondary,
                    }}>
                        Current Price
                    </Typography>
                    <Typography variant="subtitle1" sx={{
                        fontWeight: 500,
                        fontSize: "1rem",
                        color: theme.palette.text.primary,
                    }}>
                        $0.03000
                    </Typography>
                </Stack>
                <Stack alignItems={"center"} gap={0.5}>
                    <Typography variant="subtitle2" sx={{
                        fontWeight: 400,
                        fontSize: "0.875rem",
                        textAlign: "center",
                        color: theme.palette.text.secondary,
                    }}>
                        Round
                    </Typography>
                    <Typography variant="subtitle1" sx={{
                        fontWeight: 500,
                        fontSize: "1rem",
                        textAlign: "center",
                        color: theme.palette.text.primary,
                    }}>
                        Private Round
                    </Typography>
                </Stack>
                <Stack alignItems={"end"} gap={0.5}>
                    <Typography variant="subtitle2" sx={{
                        fontWeight: 400,
                        fontSize: "0.875rem",
                        textAlign: "end",
                        color: theme.palette.text.secondary,
                    }}>
                        Listing Price
                    </Typography>
                    <Typography variant="subtitle1" sx={{
                        fontWeight: 500,
                        fontSize: "1rem",
                        textAlign: "end",
                        color: theme.palette.text.primary,
                    }}>
                        $0.04500
                    </Typography>
                </Stack>

            </Stack>
            <Stack width={"100%"} gap={1}>
                <Typography variant="subtitle2" sx={{
                    fontWeight: 400,
                    fontSize: "0.875rem",
                    color: theme.palette.text.secondary,
                }}>
                    Status
                </Typography>
                <Stack width={"100%"} height={20} direction={"row"} justifyContent={"space-between"} alignItems={"center"} sx={{
                    background: theme.palette.uranoGreen1.main,
                    borderRadius: 2,
                    padding: 1,
                }}>
                </Stack>
            </Stack>
        </Stack>
    )
}

export default PresaleCard;
