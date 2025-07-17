/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Button, TextField, CircularProgress, Chip, Menu, MenuItem, Avatar, useTheme, useMediaQuery
} from '@mui/material';
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
import MovieIcon from '@mui/icons-material/Movie'; // for Reel
import { useGetQuestionRespQuery } from '@/services/private/questions';

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
const { data: aiResp, isLoading:loadingQuestions } = useGetQuestionRespQuery();
  console.log(aiResp);
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

      case 'description':
        setAnswers(ans => ({ ...ans, description: input }));
        setConversationState(cs => ({ ...cs, step: 'complete' }));
        addMessage({ id: 'bot-complete', text: 'Thanks! You can now submit your prompt.', sender: 'bot' });
        break;

      default:
        break;
    }
  }

  function handleOptionClick(option) {
    addMessage({ id: `user-${Date.now()}`, text: option, sender: 'user' });
    processInput(option);
  }

  const lastBotMessage = [...messages].reverse().find(m => m.sender === 'bot' && m.options?.length > 0);
  console.log(lastBotMessage);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        p={isMobile ? 1 : 2}
        borderBottom="1px solid #e0e0e0"
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={`${API_URL}${data?.profile_pic}`}
            sx={{ width: 40, height: 40, cursor: 'pointer' }}
            onClick={handleAvatarClick}
          />
          <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
            <MenuItem onClick={handleAppLogout}>Logout</MenuItem>
          </Menu>
          {!isMobile && (
            <Chip
              label={truncateUserName(data?.full_name || data?.username)}
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                fontSize: '0.875rem',
                bgcolor: 'primary.light',
                borderRadius: 1.5,
              }}
            />
          )}
        </Box>
      </Box>

      {/* Messages */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
        <Box
          sx={{
            background: 'white',
            color: 'text.primary',
            px: 2,
            py: 1.25,
            borderRadius: 3,
            maxWidth: '100%',
            whiteSpace: 'pre-line',
            mb:5
          }}
        >
          <Typography
            variant="10px"
            sx={{
              background: 'linear-gradient(to right, #a855f7, #ec4899, #fb923c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 400,
            }}
          >
           { loadingQuestions ? 'Please wait....': aiResp?.ai_response }
          </Typography>
          </Box>
          {messages.map(msg => (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 1,
              }}
            >
              {msg.sender === 'bot' && (
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'primary.main',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    mr: 1,
                  }}
                >
                  <Avatar>Ai</Avatar>
                </Box>
              )}

              <Box
                sx={{
                  background:
                    msg.sender === 'user'
                      ? 'linear-gradient(to right, #a855f7, #ec4899, #fb923c)'
                      : 'grey.200',
                  color: msg.sender === 'user' ? 'white' : 'text.primary',
                  px: 2,
                  py: 1.25,
                  borderRadius: 2,
                  maxWidth: '75%',
                  whiteSpace: 'pre-line',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    background:
                    msg.sender === 'user'
                      ? 'linear-gradient(to right, #a855f7, #ec4899, #fb923c)'
                      : 'grey.200',
                    fontWeight: 400,
                  }}
                >
                   {msg.text}
                </Typography>

                {msg.options && (
                  <Box
                    sx={{
                      mt: 2,
                      display: 'flex',
                      gap: 2,
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                    }}
                  >
                    {msg.options.map((opt, i) => {
                      const iconMap = {
                        Carousel: <ViewCarouselIcon sx={{ fontSize: 36 }} />,
                        Reel: <MovieIcon sx={{ fontSize: 36 }} />,
                        Email: <EmailIcon sx={{ fontSize: 36 }} />,
                      };

                      const colorMap = {
                        Carousel: 'linear-gradient(135deg, #ec4899, #fb923c)',
                        Reel: 'linear-gradient(135deg, #6366f1, #a855f7)',
                        Email: 'linear-gradient(135deg, #14b8a6, #22d3ee)',
                      };

                      return (
                        <Box
                          key={i}
                          onClick={() => handleOptionClick(opt)}
                          sx={{
                            cursor: 'pointer',
                            width: 120,
                            height: 120,
                            p: 2,
                            borderRadius: 4,
                            textAlign: 'center',
                            color: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: colorMap[opt] || 'linear-gradient(135deg, #ddd, #ccc)',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                            },
                          }}
                        >
                          {iconMap[opt] || '📄'}
                          <Typography fontWeight={600} mt={1} fontSize={16}>
                            {opt}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                )}

              </Box>

              {msg.sender === 'user' && (
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'grey.400',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'grey.700',
                    ml: 1,
                  }}
                >
                  <Avatar src={`${API_URL}${data?.profile_pic}`} />
                </Box>
              )}
            </Box>
          ))}

          {isTyping && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.main',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  mr: 1,
                }}
              >
                <Avatar>Ai</Avatar>
              </Box>
              <Box
                sx={{
                  bgcolor: 'grey.200',
                  px: 2,
                  py: 1.25,
                  borderRadius: 2,
                  maxWidth: '75%',
                  color: 'grey.600',
                }}
              >
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  Typing...
                </Typography>
              </Box>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Description Form */}
        <Box p={3} borderTop="1px solid #e0e0e0">
          <Formik
            initialValues={{ description: '' }}
            onSubmit={async values => {
              const payload = {
                new_chat: { ...answers },
                prompt: values.description,
                threadid: '',
              };
              const response = await createChat(payload);
              if (response?.data) {
                navigate(`/new-chat/${response?.data?.thread_id}`);
              }
            }}
          >
            {({ values, errors, touched, handleChange }) => (
              <Form>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box flex={1} position="relative">
                    <TextField
                      fullWidth
                      minRows={1}
                      maxRows={4}
                      name="description"
                      placeholder="Write description to create..."
                      value={values.description}
                      onChange={handleChange}
                      error={touched.description && Boolean(errors.description)}
                      helperText={touched.description && errors.description}
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#a855f7',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#ec4899',
                        },
                        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#fb923c',
                        },
                      }}
                    />
                  </Box>
                  <Button
                    type="submit"
                    sx={{
                      background: 'linear-gradient(to right, #a855f7, #ec4899, #fb923c)',
                      color: 'white',
                      width: 48,
                      height: 48,
                      minWidth: 48,
                      borderRadius: 2,
                      '&:hover': {
                        background: 'linear-gradient(to right, #a855f7, #ec4899, #fb923c)',
                      },
                    }}
                  >
                    {isLoading ? <CircularProgress size={24} /> : <NearMeRounded />}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
      );
}

      export default Chat;
