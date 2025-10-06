import React, { useMemo } from 'react';
import {
    Modal,
    Stack,
    Typography,
    Box,
    useTheme,
    type Theme,
    alpha,
    Button,
    Link
} from '@mui/material';
import Image from 'next/image';
import popupbg from "@/assets/images/pop-up-bg.webp";
import smallToken from "@/assets/images/smallToken.webp"
import { usePresaleCardData } from "@/hooks/usePresaleCard";

interface PurchaseSuccessModalProps {
    open: boolean;
    onClose: () => void;
    purchaseUSDvalue?: number
}

const PurchaseSuccessModal: React.FC<PurchaseSuccessModalProps> = ({ open, onClose, purchaseUSDvalue }) => {
    const theme = useTheme<Theme>();
    const { currentPriceStr } = usePresaleCardData({ priceFractionDigits: 5 });

    const purchasedUranoAmount = useMemo(() => {
        const rawCurrentPrice = Number(currentPriceStr?.split("$")[1])
        const purchasedUranoAmount = purchaseUSDvalue ? purchaseUSDvalue / rawCurrentPrice : 0
        return purchasedUranoAmount
    }, [currentPriceStr, purchaseUSDvalue]);

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'relative',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: 450,
                    borderRadius: '12px',
                    overflow: 'auto',
                    boxShadow: 24,
                    outline: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '65%',
                    minHeight: '400px',
                    maxHeight: '90%',
                    border: `1px solid ${theme.palette.headerBorder.main}`,
                }}
            >
                {/* Background Image */}
                <Box sx={{ position: 'relative', width: '100%', height: '30%' }}>
                    <Image
                        src={popupbg}
                        alt="Popup background"
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                </Box>

                {/* Content */}
                <Box
                    sx={{
                        background: theme.palette.background.paper,
                        backdropFilter: 'blur(10px)',
                        p: 3,
                        borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                        height: '70%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Box
                        sx={{
                            width: 'fit-content',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            aspectRatio: 1,
                            background: "transparent",
                            marginTop: -7.5,
                        }}
                    >
                        <Image src={smallToken} alt="small urano token" width={80} height={80} ></Image>
                    </Box>

                    <Stack width={'100%'} height={'100%'} alignItems={'center'} justifyContent={'center'} paddingY={2} gap={4}>
                        <Stack width={'100%'} alignItems={'center'} gap={1}>
                            <Typography
                                variant="h5"
                                fontWeight={500}
                                textAlign="center"
                                sx={{
                                    background: theme.palette.text.primary,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                Purchase successful
                            </Typography>
                            <Typography variant="h6" color={theme.palette.uranoGreen1.main} textAlign="center">
                                +{purchasedUranoAmount} $URANO
                            </Typography>
                            <Typography variant="body1" color="text.secondary" textAlign="center">
                                ≈ ${purchaseUSDvalue} USD
                            </Typography>
                        </Stack>

                    </Stack>
                    <Link href="/profile" underline="none" sx={{width: "100%", marginBottom: 1}}>
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{
                                background: theme.palette.uranoGreen1.main,
                                borderRadius: '8px',
                                py: 1.5,
                                width: '100%',
                                fontWeight: 500,
                                color: theme.palette.background.default,
                                '&:hover': {
                                    background: theme.palette.uranoGreen2.main,
                                    '& .registerButtonText': {
                                        color: theme.palette.background.default,
                                    },
                                },
                            }}
                        >
                            <Typography
                                className="registerButtonText"
                                variant="body1"
                                sx={{
                                    fontWeight: 400,
                                    color: theme.palette.background.default,
                                    textTransform: 'none',
                                }}
                            >
                                My Profile
                            </Typography>
                        </Button>
                    </Link>
                    <Button
                        variant="contained"
                        type="submit"
                        onClick={onClose}
                        sx={{
                            background: theme.palette.secondary.main,
                            borderRadius: '8px',
                            py: 1.5,
                            width: '100%',
                            fontWeight: 500,
                            color: theme.palette.text.primary,
                            '&:hover': {
                                background: theme.palette.uranoGreen1.main,
                                '& .registerButtonText': {
                                    color: theme.palette.background.paper,
                                },
                            },
                        }}
                    >
                        <Typography
                            className="registerButtonText"
                            variant="body1"
                            sx={{
                                fontWeight: 400,
                                color: theme.palette.text.primary,
                                textTransform: 'none',
                            }}
                        >
                            Close
                        </Typography>
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default PurchaseSuccessModal;
