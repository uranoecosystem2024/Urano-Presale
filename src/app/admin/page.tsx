"use client"

import { Box, Stack, Typography, Link, Divider } from '@mui/material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import arbLogo from '@/assets/images/WhiteText_horizontal_RGB.webp';
import coin1 from '@/assets/images/coin1.webp';
import { Slash, Copy } from 'iconsax-reactjs';

export default function Admin() {
    const theme = useTheme();
    return (
        <Stack
            direction="column"
            minHeight="100dvh"
            height={"fit-content"}
            width={"100%"}
            position={"relative"}
            alignItems={"center"}
            px={{ xs: 0, lg: 6 }}
            py={{ xs: 0, lg: 3 }}
        >
            <Header />

            <Stack flex={1} width={{ xs: "95%", lg: "65%" }} py={4} alignItems={"center"} justifyContent="start" gap={{ xs: 1.5, lg: 2 }} sx={{ position: "relative" }}>
                <Typography className="conthrax" variant="h3" sx={{
                    fontSize: { xs: "1.4rem", lg: "2rem" },
                    fontWeight: 600,
                    background: theme.palette.uranoGradient,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginY: 4,
                }}>Admin Panel</Typography>
            </Stack>

            <Footer />
        </Stack >
    );
}
