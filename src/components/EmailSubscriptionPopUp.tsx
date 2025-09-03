import React, { useState } from 'react';
import {
  Modal,
  Stack,
  Typography,
  Button,
  IconButton,
  TextField,
  Box,
  useTheme,
  type Theme,
  alpha
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import popupbg from "@/assets/images/pop-up-bg.webp";

interface EmailSubscriptionPopUpProps {
  open: boolean;
  onClose: () => void;
}

const EmailSubscriptionPopUp: React.FC<EmailSubscriptionPopUpProps> = ({ open, onClose }) => {
  const theme = useTheme<Theme>();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Email submitted:', email);
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
          overflow: 'hidden',
          boxShadow: 24,
          outline: 'none'
        }}
      >
        {/* Background Image */}
        <Box sx={{ position: 'relative', width: '100%', height: 150 }}>
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
            background: theme.palette.transparentPaper.main,
            backdropFilter: 'blur(10px)',
            p: 3,
            borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              backgroundColor: alpha(theme.palette.common.black, 0.5),
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.black, 0.7)
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          
          <Stack spacing={2} component="form" onSubmit={handleSubmit}>
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
              variant="body2" 
              color="text.secondary" 
              textAlign="center"
              sx={{ lineHeight: 1.5 }}
            >
              Create your account in seconds.
              <br />
              Just enter your email to get started.
            </Typography>
            
            <TextField
              fullWidth
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: alpha(theme.palette.common.white, 0.1),
                  borderRadius: '8px',
                  '& fieldset': {
                    border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                  },
                  '&:hover fieldset': {
                    border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
                  },
                  '&.Mui-focused fieldset': {
                    border: `1px solid ${theme.palette.uranoGreen1.main}`,
                  },
                  color: 'white',
                  '& input::placeholder': {
                    color: alpha(theme.palette.common.white, 0.6),
                    opacity: 1,
                  },
                },
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                background: theme.palette.uranoGradient,
                borderRadius: '8px',
                py: 1.5,
                fontWeight: 'bold',
                '&:hover': {
                  background: theme.palette.uranoGradient,
                  opacity: 0.9,
                },
              }}
            >
              Register
            </Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
};

export default EmailSubscriptionPopUp;