
"use client"

import { Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import vector1 from "@/assets/images/Vector1.webp";
import vector2 from "@/assets/images/Vector2.webp";
import vector3 from "@/assets/images/Vector3.webp";
import StatusBar from "@/components/MainSection/statusBar";
import { usePresaleCardData } from "@/hooks/usePresaleCard";

const PresaleCard = () => {
    const theme = useTheme();
    const { loading, roundLabel, currentPriceStr } = usePresaleCardData({ priceFractionDigits: 5 });

    return (
        <Stack width={"100%"} alignItems={"center"} borderRadius={{ xs: 2.5, lg: 2 }} padding={2} gap={2} sx={{
            border: "1px solid transparent",
            background: `
                linear-gradient(${theme.palette.presaleCardBg.main}, ${theme.palette.presaleCardBg.main}) padding-box,
                linear-gradient(260.63deg, rgba(107, 226, 194, 0.82) 2.15%, rgba(0, 0, 0, 0) 52.96%, #6BE2C2 100%) border-box,
                linear-gradient(0deg, #242424, #242424) border-box
            `,
            position: "relative",
            overflow: "hidden",
        }}>
            <Image src={vector1} alt="vector1" width={230} height={230} style={{ position: "absolute", bottom: 0, left: 0, zIndex: 0 }} />
            <Image src={vector2} alt="vector2" width={100} height={100} style={{ position: "absolute", bottom: 0, left: 0, zIndex: 0, opacity: 0.8, marginBottom: -5, marginLeft: -5 }} />
            <Image src={vector3} alt="vector3" width={230} height={230} style={{ position: "absolute", top: 0, right: 0, zIndex: 0 }} />
            <Typography className="conthrax" variant="h5" sx={{
                fontWeight: 600,
                fontSize: { xs: "1.25rem", lg: "1.5rem" },
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
                        {loading ? "Loading…" : currentPriceStr ?? "—"}
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
                        {loading ? "Loading…" : roundLabel ?? "—"}
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
            <Stack width={"100%"} gap={1} position={"relative"} zIndex={5}>
                <Stack width={"100%"}>
                    <StatusBar />
                </Stack>
            </Stack>
        </Stack>
    )
}

export default PresaleCard;
