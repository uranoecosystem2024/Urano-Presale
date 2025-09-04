'use client';

import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Button, IconButton, Stack, Divider } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CookieRoundedIcon from '@mui/icons-material/CookieRounded';
import { useTheme, type Theme } from '@mui/material/styles';

const CookieBot = () => {
    useEffect(() => {
        if (typeof window !== 'undefined' && !document.getElementById('Cookiebot')) {
            const script = document.createElement('script');
            script.id = 'Cookiebot';
            script.src = 'https://consent.cookiebot.com/uc.js';
            script.async = true;
            script.type = 'text/javascript';
            script.setAttribute('data-cbid', 'a3097d16-9acc-4908-a8f0-b9d08617da92');
            script.setAttribute('data-blockingmode', 'auto');
            script.setAttribute('data-language', 'en');
            script.setAttribute('data-no-banner', 'true');
            document.body.appendChild(script);
        }
    }, []);

    return null;
};

export default function CookieConsent() {
    const theme = useTheme<Theme>();
    const [showBanner, setShowBanner] = useState<boolean>(false);

    useEffect(() => {
        const consentGiven = localStorage.getItem('cookieConsent');
        if (!consentGiven) {
            setShowBanner(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'true');
        setShowBanner(false);
        enableNonEssentialCookies();
    };

    const handleDecline = () => {
        localStorage.setItem('cookieConsent', 'false');
        setShowBanner(false);
        disableNonEssentialCookies();
    };

    const enableNonEssentialCookies = () => {
        console.log('Non-essential cookies enabled.');
    };

    const disableNonEssentialCookies = () => {
        console.log('Non-essential cookies disabled.');
    };

    if (!showBanner) {
        return null;
    }

    return (
        <>
            <CookieBot />
            <Box
                sx={{
                    position: 'fixed',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bottom: '16px',
                    zIndex: 9999,
                    width: '100%',
                    maxWidth: 1200,
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        backgroundColor: theme.palette.background.paper,
                        border: '1px solid #242424',
                        borderRadius: 3,
                        backdropFilter: 'blur(8px)',
                        boxShadow:
                            '0 0 0 1px rgba(255,255,255,0.03), 0 8px 50px rgba(0,0,0,0.55), 0 0 0 2px rgba(109,231,194,0.07)',
                    }}
                >
                    <Stack width="100%" gap={1}>
                        <Stack width="100%" direction="row" alignItems="center" justifyContent="space-between" gap={2}>
                            <Stack direction="row" alignItems="start" gap={1}>
                                <CookieRoundedIcon
                                    sx={{ fontSize: 32, color: theme.palette.uranoGreen1.main }}
                                    aria-hidden
                                />
                                <Typography variant="h5" fontWeight={700} gutterBottom>
                                    Our website uses cookies
                                </Typography>
                            </Stack>
                            <IconButton
                                aria-label="Close cookie banner"
                                edge="end"
                                sx={{
                                    ml: 1,
                                    alignSelf: 'flex-start',
                                    bgcolor: 'transparent',
                                    color: 'text.secondary',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' },
                                }}
                                onClick={() => setShowBanner(false)}
                            >
                                <CloseRoundedIcon />
                            </IconButton>
                        </Stack>
                        <Stack width="100%" direction={{xs: "column", lg: "row"}} alignItems={{xs: "center", lg: "end"}} justifyContent="space-between" gap={{xs: 3, lg: 2}}>
                            <Typography variant="body1" color="text.secondary" sx={{ width: {xs: "100%", lg: '70%'} }}>
                                This site uses strictly necessary cookies to ensure secure and optimal navigation.
                                By continuing, you confirm that you are at least 18 years old, are not a resident or citizen
                                of the USA, the UK, or any other restricted jurisdiction, including but not limited to those
                                where such access is unlawful, and that your access complies with applicable laws. For
                                more details, please review our Privacy Policy and Terms & Conditions.
                            </Typography>
                            <Divider sx={{width: {xs: "100%", lg: "1px"}, height: "100%", borderColor: theme.palette.secondary.main}} />

                            <Stack width={{xs: "100%", lg: "30%"}} direction={{xs: "column-reverse", lg: "row"}} alignItems={{xs: "center", lg: "end"}} gap={{xs: 1, lg: 2}}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        bgcolor: '#2D2D2D',
                                        color: '#FFFFFF',
                                        borderRadius: 2,
                                        px: 3,
                                        py: 1.25,
                                        '&:hover': { bgcolor: '#3A3A3A' },
                                        height: 'fit-content',
                                        width: {xs: "100%", lg: "fit-content"},
                                    }}
                                    onClick={handleDecline}
                                >
                                    Decline
                                </Button>

                                <Button
                                    variant="contained"
                                    sx={{
                                        background: theme.palette.uranoGradient,
                                        color: '#0E0E0E',
                                        fontWeight: 700,
                                        borderRadius: 2,
                                        px: 3,
                                        py: 1.25,
                                        boxShadow: 'none',
                                        '&:hover': { filter: 'brightness(1.05)' },
                                        height: 'fit-content',
                                        width: {xs: "100%", lg: "fit-content"},
                                    }}
                                    onClick={handleAccept}
                                >
                                    Accept cookies
                                </Button>
                            </Stack>
                        </Stack>
                    </Stack>
                </Paper>
            </Box>
        </>
    );
}
