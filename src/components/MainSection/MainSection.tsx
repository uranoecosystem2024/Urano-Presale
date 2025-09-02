"use client"
import { Typography, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const MainSection = () => {
    const theme = useTheme();
    return (
        <Stack width={"100%"} flex={1} direction={"row"} justifyContent={"space-between"} alignItems={"center"} paddingY={4}>
            <Stack width={"45%"} height={"100%"} gap={4}>
                <Typography variant="h3" sx={{
                    fontSize: "2.85rem",
                    fontWeight: 700,
                    background: theme.palette.uranoGradient,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>Unlocking the power<br /> of on-chain tokenization</Typography>
                <Stack>
                    <Typography variant="h6" sx={{
                        fontSize: "1.857rem",
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                    }}>
                        Welcome to Urano Ecosystem
                    </Typography>
                    <Typography variant="h6" sx={{
                        fontSize: "1.15rem",
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                    }}>
                        A compliant platform for tokenizing Real World Assets
                    </Typography>
                </Stack>
                <Stack gap={1.5}>
                    <Typography variant="h6" sx={{
                        fontSize: "1rem",
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                    }}>
                        Compliant RWA – <span style={{ fontWeight: 300 }}>Full regulatory alignment for secure investments</span>
                    </Typography>
                    <Typography variant="h6" sx={{
                        fontSize: "1rem",
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                    }}>
                        Fractional Access – <span style={{ fontWeight: 300 }}>Invest in real estate, SMEs, art & more</span>
                    </Typography>
                    <Typography variant="h6" sx={{
                        fontSize: "1rem",
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                    }}>
                        Instant Settlement – <span style={{ fontWeight: 300 }}>Blockchain-powered transactions, fast and transparent</span>
                    </Typography>
                </Stack>
            </Stack>
        </Stack>
    )
}

export default MainSection;
