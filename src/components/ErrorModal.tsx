import React from 'react';
import {
    Modal,
    Stack,
    Typography,
    Box,
    useTheme,
    type Theme,
    alpha,
    Button,
} from '@mui/material';
import Image from 'next/image';
import popupbg from "@/assets/images/pop-up-bg.webp";
import { InfoCircle } from 'iconsax-reactjs';

interface ErrorModalProps {
    open: boolean;
    onClose: () => void;
    errorTitle: string;
    errorMessage: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ open, onClose, errorTitle, errorMessage }) => {
    const theme = useTheme<Theme>();
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
                            borderRadius: 2,
                            paddingX: 2,
                            paddingY: 1,
                            aspectRatio: 1,
                            background: "#FFD54F",
                            marginTop: -6.5,
                            border: `5px solid ${theme.palette.background.paper}`,
                        }}
                    >
                        <InfoCircle size={30} variant="Bold" color={"#370D00"} />
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
                                {errorTitle}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" textAlign="center">
                                {errorMessage}
                            </Typography>
                        </Stack>
                        
                    </Stack>
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

export default ErrorModal;
