/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Button, TextField, CircularProgress, Chip, Menu, MenuItem, Avatar, useTheme, useMediaQuery
} from '@mui/material';
import image from "@assets/logo.png";
import { chatFlowJson } from '../utilis/data';
import useAuth from '@/hooks/useAuth';
import { useAuthorizedQuery } from '@/services/private/auth';
import { API_URL } from '@/utilities/constants';
import { truncateUserName } from '@/utilities/helpers';
import { Form, Formik } from 'formik';
import { NearMeRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCreateChatMutation } from '@/services/private/chat';
import EmailIcon from '@mui/icons-material/Email';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import MovieIcon from '@mui/icons-material/Movie';
import { useGetQuestionRespQuery } from '@/services/private/questions';
import SectionLoader from '@/containers/common/loaders/SectionLoader';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [conversationState, setConversationState] = useState({ step: 'greeting' });
  const [answers, setAnswers] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleAvatarClick = e => setAnchorEl(e.currentTarget);
  const { handleLogout } = useAuth();
  const { data } = useAuthorizedQuery();
  const [createChat, { isLoading }] = useCreateChatMutation();
  const { data: aiResp, isLoading: loadingQuestions } = useGetQuestionRespQuery();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenuClose = () => setAnchorEl(null);
  const handleAppLogout = () => {
    handleLogout();
    handleMenuClose();
    window.location.reload();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const greetingText = chatFlowJson.content_creator.greeting;
    addMessage({
      id: 'bot-1',
      text: greetingText,
      sender: 'bot',
      options: chatFlowJson.content_creator.types.map(t => t.type)
    });
  }, []);

  function addMessage(msg) {
    setMessages(prev => [...prev, msg]);
  }

  function simulateTyping(callback, delay = 1000) {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  }

  function findTypeData(typeStr) {
    return chatFlowJson.content_creator.types.find(t => t.type === typeStr);
  }

  function processInput(input) {
    const { step } = conversationState;

    switch (step) {
      case 'greeting': {
        setAnswers({});
        setAnswers(ans => ({ ...ans, contentType: input }));
        setConversationState({ step: 'contentTypeSelected', contentType: input });

        simulateTyping(() => {
          const typeData = findTypeData(input);
          if (!typeData || !typeData.followup) {
            addMessage({ id: `bot-error`, text: `Sorry, no data found for ${input}`, sender: 'bot' });
            return;
          }

          addMessage({
            id: 'bot-followup',
            text: typeData.followup.message,
            sender: 'bot'
          });

          setConversationState(cs => ({ ...cs, step: 'description' }));
        });
        break;
      }
      case 'description': {
        // Add user's description as a message
        addMessage({ id: `user-${Date.now()}`, text: input, sender: 'user' });
        setAnswers(ans => ({ ...ans, description: input }));
        setConversationState(cs => ({ ...cs, step: 'complete' }));
        addMessage({ id: 'bot-complete', text: 'Thanks! You can now submit your prompt.', sender: 'bot' });
        break;
      }

      default:
        break;
    }
  }

  function handleOptionClick(option) {
    addMessage({ id: `user-${Date.now()}`, text: option, sender: 'user' });
    processInput(option);
  }

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh',
        background: '#ffffff',
        border: '1px solid rgba(177, 59, 255, 0.1)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(9, 0, 64, 0.1)',
        animation: 'fadeInUp 0.4s ease',
      }}
    >
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
          Content Creator AI
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
      {loadingQuestions ? (
        <SectionLoader />
      ) : (
        <React.Fragment>
          <Box 
            sx={{ 
              flexGrow: 1, 
              overflowY: 'auto', 
              p: 3,
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
            <Box 
              sx={{ 
                background: '#ffffff', 
                color: '#090040', 
                px: 3, 
                py: 2, 
                borderRadius: '12px',
                border: '1px solid rgba(177, 59, 255, 0.1)',
                maxWidth: '100%', 
                whiteSpace: 'pre-line', 
                mb: 4,
                boxShadow: '0 2px 8px rgba(9, 0, 64, 0.08)',
              }}
            >
              <Typography sx={{ color: '#090040', fontWeight: 400, lineHeight: 1.6 }}>
                {aiResp?.ai_response}
              </Typography>
            </Box>

            {messages.map(msg => (
              <Box key={msg.id} sx={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', mb: 2 }}>
                {msg.sender === 'bot' && (
                  <Box sx={{ mr: 2, alignSelf: 'flex-end' }}>
                    <img src={image} height={40} width={40} style={{ borderRadius: '50%', border: '2px solid #B13BFF' }} alt="AI Assistant" />
                  </Box>
                )}

                <Box 
                  sx={{ 
                    background: msg.sender === 'user' 
                      ? '#471396' 
                      : '#ffffff', 
                    color: msg.sender === 'user' ? 'white' : '#090040', 
                    px: 3, 
                    py: 2, 
                    borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    maxWidth: '75%', 
                    whiteSpace: 'pre-line',
                    border: msg.sender === 'user' ? 'none' : '1px solid rgba(177, 59, 255, 0.15)',
                    boxShadow: msg.sender === 'user'
                      ? '0 2px 8px rgba(71, 19, 150, 0.2)'
                      : '0 2px 8px rgba(9, 0, 64, 0.08)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: msg.sender === 'user'
                        ? '0 4px 12px rgba(71, 19, 150, 0.3)'
                        : '0 4px 12px rgba(9, 0, 64, 0.12)',
                    },
                  }}
                >
                  <Typography sx={{ fontWeight: 400, lineHeight: 1.6 }}>{msg.text}</Typography>
                  {msg.options && (
                    <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                      {msg.options.map((opt, i) => {
                        const iconMap = {
                          Carousel: <ViewCarouselIcon sx={{ fontSize: 32, color: '#471396' }} />,
                          Reel: <MovieIcon sx={{ fontSize: 32, color: '#471396' }} />,
                          Email: <EmailIcon sx={{ fontSize: 32, color: '#471396' }} />,
                        };
                        const colorMap = {
                          Carousel: '#B13BFF',
                          Reel: '#FFCC00',
                          Email: '#471396',
                        };
                        return (
                          <Box 
                            key={i} 
                            onClick={() => handleOptionClick(opt)} 
                            sx={{ 
                              cursor: 'pointer', 
                              width: 140, 
                              height: 120, 
                              p: 2.5, 
                              borderRadius: '16px', 
                              textAlign: 'center', 
                              color: '#090040', 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              background: '#ffffff', 
                              transition: 'all 0.2s ease', 
                              boxShadow: '0 2px 8px rgba(9, 0, 64, 0.08)',
                              border: `2px solid ${colorMap[opt] || '#B13BFF'}`,
                              '&:hover': { 
                                transform: 'translateY(-2px)', 
                                boxShadow: '0 4px 12px rgba(9, 0, 64, 0.15)',
                                background: `rgba(${colorMap[opt] === '#B13BFF' ? '177, 59, 255' : colorMap[opt] === '#FFCC00' ? '255, 204, 0' : '71, 19, 150'}, 0.05)`,
                              } 
                            }}
                          >
                            {iconMap[opt] || '📄'}
                            <Typography 
                              fontWeight={600} 
                              mt={1.5} 
                              fontSize={14}
                              sx={{ color: '#090040' }}
                            >
                              {opt}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </Box>

                {msg.sender === 'user' && (
                  <Box sx={{ ml: 2, alignSelf: 'flex-end' }}>
                    <Avatar 
                      src={`${API_URL}${data?.profile_pic}`} 
                      sx={{ 
                        width: 40, 
                        height: 40,
                        border: '2px solid rgba(177, 59, 255, 0.3)',
                      }} 
                    />
                  </Box>
                )}
              </Box>
            ))}

            {isTyping && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ mr: 2 }}>
                  <img src={image} height={40} width={40} style={{ borderRadius: '50%', border: '2px solid #B13BFF' }} alt="AI Assistant" />
                </Box>
                <Box 
                  sx={{ 
                    background: '#ffffff',
                    border: '1px solid rgba(177, 59, 255, 0.2)',
                    px: 3, 
                    py: 2, 
                    borderRadius: '18px', 
                    maxWidth: '75%', 
                    boxShadow: '0 2px 8px rgba(9, 0, 64, 0.08)',
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box className="loading-dots">
                      <Box className="loading-dot" />
                      <Box className="loading-dot" />
                      <Box className="loading-dot" />
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontStyle: 'italic',
                        color: '#471396',
                      }}
                    >
                      AI is thinking...
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>

          <Box 
            p={3} 
            sx={{
              background: '#ffffff',
              borderTop: '1px solid rgba(177, 59, 255, 0.1)',
            }}
          >
            <Formik
              initialValues={{ description: '' }}
              onSubmit={async (values, { resetForm }) => {
                const payload = {
                  new_chat: { ...answers },
                  prompt: values.description,
                  threadid: '',
                };
                const response = await createChat(payload);
                if (response?.data) {
                  navigate(`/new-chat/${response.data.thread_id}`);
                } else {
                  // Reset form even if navigation doesn't happen
                  resetForm();
                }
              }}
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
                        placeholder="Type your message to get started..."
                        value={values.description}
                        onChange={handleChange}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            if (values.description.trim() && !isLoading) {
                              // Submit the form
                              e.target.form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                            }
                          }
                        }}
                        error={touched.description && Boolean(errors.description)}
                        helperText={touched.description && errors.description}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            background: '#ffffff',
                            borderRadius: '16px',
                            border: '1px solid rgba(177, 59, 255, 0.2)',
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
                            color: '#471396',
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
                      disabled={isLoading || !values.description.trim()}
                      sx={{ 
                        background: '#471396',
                        color: 'white', 
                        width: 56, 
                        height: 56, 
                        minWidth: 56, 
                        borderRadius: '16px',
                        boxShadow: '0 2px 8px rgba(71, 19, 150, 0.2)',
                        transition: 'all 0.2s ease',
                        '&:hover': { 
                          background: '#B13BFF',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(71, 19, 150, 0.3)',
                        },
                        '&:active': {
                          transform: 'translateY(0)',
                        },
                        '&:disabled': {
                          opacity: 0.6,
                          transform: 'none',
                          background: 'rgba(71, 19, 150, 0.3)',
                        },
                      }}
                    >
                      {isLoading ? (
                        <CircularProgress 
                          size={24} 
                          sx={{ color: 'white' }} 
                        />
                      ) : (
                        <NearMeRounded />
                      )}
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}

export default Chat;
