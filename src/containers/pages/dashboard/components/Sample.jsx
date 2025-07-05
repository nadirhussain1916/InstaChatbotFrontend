/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, TextField, CircularProgress, Chip, Menu, MenuItem, Avatar, useTheme, useMediaQuery } from '@mui/material';
import { chatFlowJson } from '../utilis/data';
import useAuth from '@/hooks/useAuth';
import { useAuthorizedQuery } from '@/services/private/auth';
import { API_URL } from '@/utilities/constants';
import { truncateUserName } from '@/utilities/helpers';
import { Form, Formik } from 'formik';
import { NearMeRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCreateChatMutation } from '@/services/private/chat';

function DynamicChatFlow() {
  // Chat message structure: { id, text, sender, options? }
  const [messages, setMessages] = useState([]);
  const [conversationState, setConversationState] = useState({ step: 'greeting' });
  console.log('Chat flow initialized with state:', conversationState);
  const [answers, setAnswers] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleAvatarClick = e => setAnchorEl(e.currentTarget);
  const { handleLogout } = useAuth();
  const { data } = useAuthorizedQuery();
  const [createChat, { isLoading }] = useCreateChatMutation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const handleMenuClose = () => setAnchorEl(null);
  const handleAppLogout = () => {
    handleLogout();
    handleMenuClose();
  };

  // Scroll chat to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Start with initial greeting
  useEffect(() => {
    const greetingText = chatFlowJson.content_creator.greeting.replace('FIRSTNAME', 'User');
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

  // Find type data by content type string
  function findTypeData(typeStr) {
    return chatFlowJson.content_creator.types.find(t => t.type === typeStr);
  }

  // Main conversation logic based on conversationState.step
  function processInput(input) {
    const { step, contentType, goal } = conversationState;

    switch (step) {
      case 'greeting':
        setAnswers({});
        setAnswers(ans => ({ ...ans, contentType: input }));
        setConversationState({ step: 'contentTypeSelected', contentType: input });
        // After user selects content type, show first question(s)
        simulateTyping(() => {
          const typeData = findTypeData(input);
          if (!typeData) {
            addMessage({ id: `bot-error`, text: `Sorry, no data found for ${input}`, sender: 'bot' });
            return;
          }
          // Show first goal options for selected type
          const goals = typeData.options.map(opt => opt.goal);
          addMessage({
            id: 'bot-2',
            text: `Great! What's the goal for this ${input}?`,
            sender: 'bot',
            options: goals
          });
          setConversationState(cs => ({ ...cs, step: 'goalSelection', contentType: input }));
        });
        break;

      case 'goalSelection':
        setAnswers(ans => ({ ...ans, goal: input }));
        setConversationState(cs => ({ ...cs, goal: input }));
        // Find followup questions for selected goal
        simulateTyping(() => {
          const typeData = findTypeData(contentType);
          if (!typeData) return;
          const goalData = typeData.options.find(o => o.goal === input);
          if (!goalData) return;
          // If goalData has followups, ask first followup question, else go to description
          if (goalData.followups && goalData.followups.length > 0) {
            const firstQ = goalData.followups[0];
            addMessage({ id: 'bot-3', text: firstQ.question, sender: 'bot', options: firstQ.options, type: firstQ.type });
            setConversationState(cs => ({ ...cs, step: 'followup', contentType, goal, followupIndex: 0, followups: goalData.followups }));
          } else {
            setConversationState(cs => ({ ...cs, step: 'description' }));
            addMessage({ id: 'bot-3', text: `Please enter a description for your ${contentType}.`, sender: 'bot' });
          }
        });
        break;

      case 'followup': {
        // Save answer for current followup
        const { followups = [], followupIndex = 0 } = conversationState;
        const currentQ = followups[followupIndex];
        setAnswers(ans => ({ ...ans, [currentQ.question]: input }));

        const nextIndex = followupIndex + 1;
        if (nextIndex < followups.length) {
          // Ask next followup question
          simulateTyping(() => {
            const nextQ = followups[nextIndex];
            addMessage({ id: `bot-fu-${nextIndex}`, text: nextQ.question, sender: 'bot', options: nextQ.options, type: nextQ.type });
            setConversationState(cs => ({ ...cs, followupIndex: nextIndex }));
          });
        } else {
          // No more followups, go to description input
          simulateTyping(() => {
            addMessage({ id: 'bot-desc', text: `Almost done! Please enter a description for your ${contentType}.`, sender: 'bot' });
            setConversationState(cs => ({ ...cs, step: 'description' }));
          });
        }
        break;
      }

      case 'description':
        // User finished all Qs, time to submit
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
  console.log('Last bot message options:', lastBotMessage?.options);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
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
                bgcolor: 'primary.light', // optional light background
                borderRadius: 1.5,
              }}
            />
          )}
        </Box>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 3,
        }}
      >
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
                background: msg.sender === 'user' ? 'linear-gradient(to right, #a855f7, #ec4899, #fb923c)' : 'grey.200',
                color: msg.sender === 'user' ? 'white' : 'text.primary',
                px: 2,
                py: 1.25,
                borderRadius: 2,
                maxWidth: '75%',
                whiteSpace: 'pre-line',
              }}
            >
              <Typography variant="body1">{msg.text}</Typography>
              {/* Show options buttons if any */}
              {msg.options && (
                <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {msg.options.map((opt, i) => (
                    <Button
                      key={i}
                      variant="outlined"
                      size="small"
                      onClick={() => handleOptionClick(opt)}
                    >
                      {opt}
                    </Button>
                  ))}
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
                <Avatar
                  src={`${API_URL}${data?.profile_pic}`}

                />
              </Box>
            )}
          </Box>
        ))}

        {/* Typing indicator */}
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
      <Box p={3} borderTop="1px solid #e0e0e0">
        <Formik
          initialValues={{ description: '' }}
          onSubmit={ async values => {
            const payload = {
              new_chat: { ...answers, description: values.description },
              prompt: values.description,
              threadid: '', // You can fill this dynamically
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
                    multiline
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
                        borderColor: '#a855f7', // default border color
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ec4899', // border color on hover
                      },
                      '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#fb923c', // border color on focus
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

export default DynamicChatFlow;
