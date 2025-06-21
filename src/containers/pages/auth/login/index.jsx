import React, { useState } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';

// COMPONENTS & ASSETS
import '@styles/common/layout.module.scss';
import LoginForm from './components/LoginForm';

function Login() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: 'linear-gradient(to bottom right, #f3e8ff, #fde0ef, #ffe9d5)',
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <Box mb={4}>
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              background: 'linear-gradient(to right, #9333ea, #ec4899, #f97316)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Instagram Chatbot
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={2}>
            Connect with your profile and start chatting with our AI assistant
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          onClick={() => setIsModalOpen(true)}
          sx={{
            background: 'linear-gradient(to right, #9333ea, #ec4899, #f97316)',
            color: '#fff',
            px: 5,
            py: 1.5,
            borderRadius: '9999px',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: '500',
            boxShadow: 3,
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: 6,
            },
            transition: 'all 0.3s ease',
          }}
        >
          Get Started
        </Button>
      </Container>

      <LoginForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Box>
  );
}

export default Login;
