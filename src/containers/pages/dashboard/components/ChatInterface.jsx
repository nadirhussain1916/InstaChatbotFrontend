import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Menu,
  MenuItem,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import ChatMessage from './ChatMessage';
import { NearMeRounded } from '@mui/icons-material';
import { useCreateChatMutation, useGetChatDetailQuery } from '@/services/private/chat';
import useAuth from '@/hooks/useAuth';
import { useAuthorizedQuery } from '@/services/private/auth';
import { API_URL } from '@/utilities/constants';
import { useParams } from 'react-router-dom';
import { truncateUserName } from '@/utilities/helpers';

const ChatSchema = Yup.object({
  description: Yup.string().required('Description is required'),
});

function ChatInterface() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { handleLogout } = useAuth();
  const { data } = useAuthorizedQuery();
  const [createChat] = useCreateChatMutation();
  const { id } = useParams();

  const { data: chatDetail } = useGetChatDetailQuery(id);

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState(null);
  const messagesEndRef = useRef(null);

  const handleAvatarClick = e => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleAppLogout = () => {
    handleLogout();
    handleMenuClose();
    window.location.reload();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timeout);
  }, [chatMessages]);

  useEffect(() => {
    if (Array.isArray(chatDetail?.messages) && chatDetail?.messages.length > 0) {
      setChatMessages(
        chatDetail.messages.map(msg => ({
          id: msg.id,
          content: msg.message,
          type: msg.sender === 'user' ? 'user' : 'ai',
          timestamp: msg.timestamp,
        }))
      );
      setStreamingMessageId(null); // No streaming on initial load
    }
  }, [chatDetail]);

  const handleSubmit = async (values, { resetForm }) => {
    const timestamp = new Date().toLocaleTimeString();
    const userMessage = { id: Date.now(), content: values.description, type: 'user', timestamp };
    setChatMessages(prev => [...prev, userMessage]);
    resetForm();
    setIsTyping(true);

    try {
      const payload = {
        prompt: values.description,
        thread_id: id || '',
      };

      const resp = await createChat(payload);
      const slidesRaw = resp?.data?.response;

      let botMessages = [];

      if (Array.isArray(slidesRaw)) {
        slidesRaw.forEach((slide, idx) => {
          botMessages.push({
            id: Date.now() + idx + 1,
            content: slide,
            type: 'ai',
            timestamp: new Date().toLocaleTimeString(),
          });
        });
      } else if (typeof slidesRaw === 'string') {
        botMessages.push({
          id: Date.now() + 1,
          content: slidesRaw,
          type: 'ai',
          timestamp: new Date().toLocaleTimeString(),
        });
      }

      // Simulate streaming: set streamingMessageId to the new AI message, and add it to chatMessages
      if (botMessages.length > 0) {
        setChatMessages(prev => {
          const updated = [...prev, botMessages[0]];
          setStreamingMessageId(botMessages[0].id);
          return updated;
        });
      }
    } catch {
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1000,
          content: 'Something went wrong. Please try again.',
          type: 'ai',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      setStreamingMessageId(null);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      height="100vh"
      sx={{
        background: '#ffffff',
        border: '1px solid rgba(177, 59, 255, 0.1)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(9, 0, 64, 0.1)',
        animation: 'fadeInUp 0.4s ease',
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={isMobile ? 2 : 3}
        sx={{
          background: '#ffffff',
          borderBottom: '1px solid rgba(177, 59, 255, 0.1)',
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            color: '#090040',
            fontSize: '1.25rem',
          }}
        >
          AI Content Assistant
        </Typography>
        
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={`${API_URL}${data?.profile_pic}`}
            sx={{ 
              width: 40, 
              height: 40, 
              cursor: 'pointer',
              border: '2px solid #B13BFF',
            }}
            onClick={handleAvatarClick}
          />
          <Menu 
            anchorEl={anchorEl} 
            open={openMenu} 
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                background: '#ffffff',
                border: '1px solid rgba(177, 59, 255, 0.1)',
                borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(9, 0, 64, 0.1)',
              }
            }}
          >
            <MenuItem 
              onClick={handleAppLogout}
              sx={{ 
                color: '#090040',
                '&:hover': {
                  background: 'rgba(177, 59, 255, 0.08)',
                }
              }}
            >
              Logout
            </MenuItem>
          </Menu>
          {!isMobile && (
            <Chip
              label={truncateUserName(data?.full_name || data?.username)}
              sx={{
                background: 'rgba(177, 59, 255, 0.1)',
                color: '#471396',
                fontWeight: 500,
                fontSize: '0.875rem',
                borderRadius: '8px',
                border: '1px solid rgba(177, 59, 255, 0.2)',
              }}
            />
          )}
        </Box>
      </Box>

      {/* Messages */}
      <Box 
        flex={1} 
        overflow="auto" 
        p={3}
        sx={{
          background: '#ffffff',
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(177, 59, 255, 0.05)',
            borderRadius: '2px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(177, 59, 255, 0.3)',
            borderRadius: '2px',
            '&:hover': {
              background: 'rgba(177, 59, 255, 0.5)',
            },
          },
        }}
      >
        {chatMessages?.map((message, index) => (
          <ChatMessage
            key={message.id ?? index}
            message={message}
            profile={data?.profile_pic}
            showTyping={message.id === streamingMessageId}
          />
        ))}

        {isTyping && (
          <Box
            display="flex"
            justifyContent="flex-start"
            mb={2}
            sx={{
              background: '#ffffff',
              border: '1px solid rgba(177, 59, 255, 0.1)',
              borderRadius: '18px',
              boxShadow: '0 2px 8px rgba(9, 0, 64, 0.08)',
            }}
            px={3}
            py={2}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Box className="loading-dots">
                <Box className="loading-dot" />
                <Box className="loading-dot" />
                <Box className="loading-dot" />
              </Box>
              <Typography 
                fontSize={14} 
                sx={{ 
                  color: 'rgba(9, 0, 64, 0.7)',
                  fontStyle: 'italic'
                }}
              >
                AI is thinking...
              </Typography>
            </Box>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box 
        p={3} 
        sx={{
          background: '#ffffff',
          borderTop: '1px solid rgba(177, 59, 255, 0.1)',
        }}
      >
        <Formik
          initialValues={{ description: '' }}
          validationSchema={ChatSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange }) => (
            <Form>
              <Box display="flex" alignItems="center" gap={2}>
                <Box flex={1}>
                  <TextField
                    fullWidth
                    minRows={1}
                    maxRows={4}
                    name="description"
                    placeholder="Type your message..."
                    value={values.description}
                    onChange={handleChange}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: '#ffffff',
                        borderRadius: '12px',
                        '& fieldset': {
                          borderColor: 'rgba(177, 59, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(177, 59, 255, 0.4)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#B13BFF',
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(9, 0, 64, 0.7)',
                      },
                      '& .MuiOutlinedInput-input': {
                        color: '#090040',
                        '&::placeholder': {
                          color: 'rgba(9, 0, 64, 0.5)',
                          opacity: 1,
                        },
                      },
                    }}
                  />
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    background: '#471396',
                    color: 'white',
                    width: 56,
                    height: 56,
                    minWidth: 56,
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(71, 19, 150, 0.2)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: '#B13BFF',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(177, 59, 255, 0.3)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                  }}
                >
                  <NearMeRounded />
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}

export default ChatInterface;
