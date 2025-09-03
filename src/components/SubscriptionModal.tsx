import React, { useState } from 'react';
import {
    Modal,
    Stack,
    Typography,
    Button,
    Box,
    useTheme,
    type Theme,
    alpha,
    InputLabel,
    FormControl,
    OutlinedInput
} from '@mui/material';
import Image from 'next/image';
import popupbg from "@/assets/images/pop-up-bg.webp";

interface SubscriptionModalProps {
    open: boolean;
    onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ open, onClose }) => {
    const theme = useTheme<Theme>();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Invalid email address');
        } else {
            setEmailError('');
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        validateEmail(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent submission if email is invalid
        if (emailError) {
            return;
        }

        // Perform Web3Forms submission programmatically after validation
        const form = e.target as HTMLFormElement;
        form.submit(); // This will trigger the form submission to Web3Forms API
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
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
                    height: '65%', // Fixed height of the modal
                    minHeight: '400px', // Set a minimum height for the modal
                    maxHeight: '90%',
                }}
            >
                {/* Background Image */}
                <Box sx={{ position: 'relative', width: '100%', height: "30%" }}>
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
                        height: "70%",

                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Box sx={{
                        width: "fit-content",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 2,
                        paddingX: 2,
                        paddingY: 1,
                        aspectRatio: 1,
                        background: theme.palette.uranoGradient,
                        marginTop: -6.5,
                        border: `5px solid ${theme.palette.background.paper}`
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
                    <Stack width={"100%"} height={"100%"} alignItems={"center"} paddingY={2} gap={4}>
                        <Stack width={"100%"} alignItems={"center"} gap={1}>
                            <Typography
                                variant="h5"
                                fontWeight={500}
                                textAlign="center"
                                sx={{
                                    background: theme.palette.uranoGradient,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}
                            >
                                Register with email
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                textAlign="center"
                            >
                                Create your account in seconds.
                                <br />
                                Just enter your email to get started.
                            </Typography>
                        </Stack>
                        <form action="https://api.web3forms.com/submit" method="POST" style={{ width: "100%" }} onSubmit={handleSubmit}>
                        <input type="hidden" name="access_key" value="5e98fa64-78e9-4400-815c-9c742cb8d35b" />
                        <Stack width={"100%"} alignItems={"center"} gap={2}>
                            <Stack width={"100%"} gap={1}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel
                                        htmlFor="component-outlined"
                                        sx={{
                                            // Default label color
                                            color: emailError ? "#FF3665" : 'white',
                                            '&.Mui-focused': {
                                                color: emailError ? "#FF3665" : theme.palette.uranoGreen1.main, // Change this to your desired focused color
                                            },
                                        }}
                                    >
                                        E-mail
                                    </InputLabel>
                                    <OutlinedInput
                                        id="component-outlined"
                                        defaultValue={email}
                                        placeholder="Enter your e-mail"
                                        label="E-mail"
                                        type="email"
                                        onChange={handleEmailChange}
                                        sx={{
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: emailError ? "#FF3665" : alpha(theme.palette.common.white, 0.2), // Set border color of the input
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: emailError ? "#FF3665" : alpha(theme.palette.common.white, 0.3), // Border color on hover
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: emailError ? "#FF3665" : theme.palette.uranoGreen1.main, // Change border color when input is focused
                                            },

                                        }}
                                    />
                                </FormControl>
                                {emailError && (
                                    <Typography variant="body2" color="#FF3665">
                                        {emailError}
                                    </Typography>
                                )}
                            </Stack>
                            <Button
                                variant="contained"
                                type="submit"
                                sx={{
                                    background: theme.palette.secondary.main,
                                    borderRadius: '8px',
                                    py: 1.5,
                                    width: "100%",
                                    fontWeight: 500,
                                    color: theme.palette.text.primary,
                                    '&:hover': {
                                        background: theme.palette.uranoGreen1.main,
                                        "& .registerButtonText": {
                                            color: theme.palette.background.paper,
                                        }
                                    },
                                }}
                            >
                                <Typography className='registerButtonText' variant="body1" sx={{
                                    fontWeight: 400,
                                    color: theme.palette.text.primary,
                                    textTransform: "none",
                                }}>
                                    Register
                                </Typography>
                            </Button>
                        </Stack>
                        </form>
                    </Stack>

                </Box>
            </Box>
        </Modal>
    );
};

export default SubscriptionModal;