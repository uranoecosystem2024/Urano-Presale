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
    OutlinedInput,
    CircularProgress,
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
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [isError, setIsError] = useState(false);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);

        // Don't submit if email is invalid
        if (emailError) {
            return;
        }

        // Get the form data
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        try {
            // Use fetch to send the form data to FormBold without redirection
            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
            });

            if (response.ok) {
                // Log success message
                setIsSending(false);
                setIsSent(true);
                setTimeout(
                    () => {
                        window.location.reload();
                    },
                    2000
                )
            } else {
                setIsSending(false);
                setIsError(true);
            }
        } catch (error) {
            console.error('Error: Unable to submit the form.', error);
            setIsSending(false);
            setIsError(true);
        }
    };

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
                            background: theme.palette.uranoGradient,
                            marginTop: -6.5,
                            border: `5px solid ${theme.palette.background.paper}`,
                        }}
                    >
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 500,
                                fontSize: '1.5rem',
                                lineHeight: 1,
                                color: '#2A6A69',
                            }}
                        >
                            1
                        </Typography>
                    </Box>
                    <Stack width={'100%'} height={'100%'} alignItems={'center'} justifyContent={'center'} paddingY={2} gap={4}>
                        <Stack width={'100%'} alignItems={'center'} gap={1}>
                            <Typography
                                variant="h5"
                                fontWeight={500}
                                textAlign="center"
                                sx={{
                                    background: theme.palette.uranoGradient,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                {isSent && !isError ? 'Thank you for registering!' : isError ? 'An error occurred!' : 'Register with email'}
                            </Typography>
                            {
                                isSent && !isError ? (
                                    <Typography variant="body1" color="text.secondary" textAlign="center">
                                        We will keep you updated on the latest news and developments.
                                    </Typography>
                                ) : isError ? (
                                    <Typography variant="body1" color="text.secondary" textAlign="center">
                                        Something went wrong. Please try again.
                                    </Typography>
                                ) : (
                                    <Typography variant="body1" color="text.secondary" textAlign="center">
                                        Create your account in seconds.
                                        <br />
                                        Just enter your email to get started.
                                    </Typography>
                                )
                            }
                        </Stack>
                        {
                            !isSent && !isError && (
                                <form
                                    onSubmit={handleSubmit} // Use handleSubmit function to validate email
                                    action="https://formbold.com/s/91LpA" // FormBold form URL
                                    method="POST"
                                    style={{ width: '100%' }}
                                >
                                    {/* Hidden Access Key */}
                                    <input
                                        type="hidden"
                                        name="New submission"
                                        value="New submission for Urano Presale page" // Replace with your FormBold access key
                                    />
                                    {/* Email Field */}
                                    <Stack width={'100%'} alignItems={'center'} gap={2}>
                                        <Stack width={'100%'} gap={1}>
                                            <FormControl fullWidth variant="outlined">
                                                <InputLabel
                                                    htmlFor="component-outlined"
                                                    sx={{
                                                        color: emailError ? '#FF3665' : 'white',
                                                        '&.Mui-focused': {
                                                            color: emailError ? '#FF3665' : theme.palette.uranoGreen1.main,
                                                        },
                                                    }}
                                                >
                                                    E-mail
                                                </InputLabel>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    name="email" // Ensure name is "email" to match FormBold
                                                    value={email} // Bind the email value to the state
                                                    placeholder="Enter your e-mail"
                                                    label="E-mail"
                                                    type="email"
                                                    onChange={handleEmailChange}
                                                    sx={{
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: emailError ? '#FF3665' : alpha(theme.palette.common.white, 0.2),
                                                        },
                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: emailError ? '#FF3665' : alpha(theme.palette.common.white, 0.3),
                                                        },
                                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: emailError ? '#FF3665' : theme.palette.uranoGreen1.main,
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

                                        {/* Submit Button */}
                                        <Button
                                            variant="contained"
                                            type="submit"
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
                                            {
                                                isSending ? (
                                                    <CircularProgress size={24} />
                                                ) : (
                                                    <Typography
                                                        className="registerButtonText"
                                                        variant="body1"
                                                        sx={{
                                                            fontWeight: 400,
                                                            color: theme.palette.text.primary,
                                                            textTransform: 'none',
                                                        }}
                                                    >
                                                        Register
                                                    </Typography>
                                                )
                                            }
                                        </Button>
                                    </Stack>
                                </form>
                            )
                        }
                    </Stack>
                </Box>
            </Box>
        </Modal>
    );
};

export default SubscriptionModal;
