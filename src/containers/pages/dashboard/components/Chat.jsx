/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Typography, Button, TextField, CircularProgress, Chip, Menu, MenuItem, Avatar, useTheme, useMediaQuery
} from '@mui/material';
import image from "@assets/isntagram.png";
import ChatMessage from './ChatMessage';
import { chatFlowJson } from '../utilis/data';
import useAuth from '@/hooks/useAuth';
import { useAuthorizedQuery } from '@/services/private/auth';
import { API_URL } from '@/utilities/constants';
import { truncateUserName } from '@/utilities/helpers';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { NearMeRounded } from '@mui/icons-material';
import { useCreateChatMutation, useGetChatDetailQuery } from '@/services/private/chat';
import EmailIcon from '@mui/icons-material/Email';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import MovieIcon from '@mui/icons-material/Movie';
import { useGetQuestionRespQuery } from '@/services/private/questions';
import SectionLoader from '@/containers/common/loaders/SectionLoader';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addMessage,
  setMessages,
  setIsTyping,
  setStreamingMessageId,
  setShowGreeting,
  setSavedThreadId,
  setSelectedContentType,
  setAnchorEl,
} from '@/store/slices/chatSlice';

const ChatSchema = Yup.object({
  description: Yup.string().trim().required('Description is required'),
});

function Chat() {
  const dispatch = useDispatch();
  const {
    chatMessages,
    isTyping,
    streamingMessageId,
    showGreeting,
    savedThreadId,
    selectedContentType,
    anchorEl,
  } = useSelector(state => state.chat);

  const messagesEndRef = useRef(null);
  const openMenu = Boolean(anchorEl);
  const handleAvatarClick = e => dispatch(setAnchorEl(e.currentTarget));
  const { handleLogout } = useAuth();
  const { data } = useAuthorizedQuery();
  const [createChat, { isLoading }] = useCreateChatMutation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: chatDetail, isLoading: chatDetailLoading, isFetching: chatDetailFetching } = useGetChatDetailQuery(id, {
    skip: !id, // Skip query if no id is provided
    // refetchOnMountOrArgChange: true, // Always refetch when component mounts or args change
    // refetchOnFocus: true, // Refetch when window regains focus
  });
  const { data: aiResp, isLoading: loadingQuestions } = useGetQuestionRespQuery();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenuClose = () => dispatch(setAnchorEl(null));
  const handleAppLogout = () => {
    handleLogout();
    handleMenuClose();
    window.location.reload();
  };
  const handleSubmit = async (values, { resetForm }) => {
    // Validate trimmed input
    const trimmedMessage = values.description.trim();
    if (!trimmedMessage) return;

    const timestamp = new Date().toLocaleTimeString();
    const userMessage = {
      id: Date.now(),
      content: trimmedMessage,
      type: 'user',
      timestamp
    };

    dispatch(addMessage(userMessage));
    resetForm();
    dispatch(setIsTyping(true));
    dispatch(setShowGreeting(false)); // Hide greeting when user starts chatting

    try {
      // Determine if this is the first message (no saved thread_id and no existing ID)
      const isFirstMessage = !savedThreadId && !id;

      const payload = {
        prompt: trimmedMessage,
        thread_id: savedThreadId || id || '',
      };

      // Add ContentType for first message
      if (isFirstMessage && selectedContentType) {
        payload.new_chat = { ContentType: selectedContentType };
      }

      const resp = await createChat(payload);
      const slidesRaw = resp?.data?.response;

      // Save thread_id from response if it's the first message
      if (isFirstMessage && resp?.data?.thread_id) {
        dispatch(setSavedThreadId(resp.data.thread_id));
      }

      console.log("Loading states:", { savedThreadId, id, data: resp?.data });

      if (Array.isArray(slidesRaw)) {
        // Handle multiple responses
        slidesRaw.forEach((slide, idx) => {
          const aiMessage = {
            id: Date.now() + idx + 1,
            content: slide,
            type: 'ai',
            timestamp: new Date().toLocaleTimeString(),
          };

          setTimeout(() => {
            dispatch(addMessage(aiMessage));
            if (idx === 0) dispatch(setStreamingMessageId(aiMessage.id));
          }, idx * 500); // Stagger multiple messages
        });
      } else if (typeof slidesRaw === 'string') {
        const aiMessage = {
          id: Date.now() + 1,
          content: slidesRaw,
          type: 'ai',
          timestamp: new Date().toLocaleTimeString(),
        };

        dispatch(addMessage(aiMessage));
        dispatch(setStreamingMessageId(aiMessage.id));
      }

      // Clear streaming after a delay
      setTimeout(() => {
        dispatch(setStreamingMessageId(null));
      }, 2000);

    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1000,
        content: 'Something went wrong. Please try again.',
        type: 'ai',
        timestamp: new Date().toLocaleTimeString(),
      };
      dispatch(addMessage(errorMessage));
      dispatch(setStreamingMessageId(null));
    } finally {
      dispatch(setIsTyping(false));
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fixed scroll effect with cleanup
  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timeout);
  }, [chatMessages, isTyping]);

  // Load existing chat messages
  useEffect(() => {
    if (Array.isArray(chatDetail?.messages) && chatDetail?.messages.length > 0) {
      const formattedMessages = chatDetail.messages.map(msg => ({
        id: msg.id,
        content: msg.message,
        type: msg.sender === 'user' ? 'user' : 'ai',
        timestamp: msg.timestamp,
      }));
      dispatch(setMessages(formattedMessages));
      dispatch(setShowGreeting(false)); // Hide greeting if there are existing messages
      dispatch(setStreamingMessageId(null));
    } else if (chatDetail && (!chatDetail.messages || chatDetail.messages.length === 0)) {
      // If chat exists but has no messages, show greeting
      dispatch(setMessages([]));
      dispatch(setShowGreeting(true));
      dispatch(setStreamingMessageId(null));
    }
  }, [chatDetail, dispatch]);

  // Handle route changes and thread ID management
  useEffect(() => {
    if (id) {
      // When navigating to a specific chat, set the thread ID
      if (id !== savedThreadId) {
        dispatch(setSavedThreadId(id));
      }
    } else if (!savedThreadId) {
      // When navigating to new chat (/chat), reset completely
      dispatch(setShowGreeting(true));
      dispatch(setMessages([]));
      dispatch(setSavedThreadId(''));
    }
  }, [id, dispatch, savedThreadId]);

  const handleOptionClick = option => {
    const userMessage = {
      id: Date.now(),
      content: option,
      type: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };

    dispatch(addMessage(userMessage));
    dispatch(setShowGreeting(false));
    dispatch(setSelectedContentType(option)); // Set the selected content type

    // Add a response based on the option selected
    dispatch(setIsTyping(true));
    setTimeout(() => {
      const typeData = chatFlowJson.content_creator.types.find(t => t.type === option);
      const responseMessage = {
        id: Date.now() + 1,
        content: typeData?.followup?.message || `Great choice! You selected ${option}. Please tell me more about what you'd like to create.`,
        type: 'ai',
        timestamp: new Date().toLocaleTimeString(),
      };
      dispatch(addMessage(responseMessage));
      dispatch(setIsTyping(false));
    }, 1000);
  };

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
            {data?.role === 'admin' && (
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate('/edit-prompts');
                }}
                sx={{
                  color: '#090040',
                  '&:hover': {
                    background: 'rgba(177, 59, 255, 0.08)',
                  }
                }}
              >
                Edit Prompts
              </MenuItem>
            )}
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

      {(loadingQuestions || chatDetailLoading || chatDetailFetching) ? (
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
            {/* AI Response Section */}
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

            {/* Greeting Message with Options */}
            {showGreeting && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                <Box sx={{ mr: 2, alignSelf: 'flex-end' }}>
                  <img src={image} height={40} width={40} style={{ borderRadius: '50%', border: '2px solid #B13BFF' }} alt="AI Assistant" />
                </Box>

                <Box
                  sx={{
                    background: '#ffffff',
                    color: '#090040',
                    px: 3,
                    py: 2,
                    borderRadius: '18px 18px 18px 4px',
                    maxWidth: '75%',
                    whiteSpace: 'pre-line',
                    border: '1px solid rgba(177, 59, 255, 0.15)',
                    boxShadow: '0 2px 8px rgba(9, 0, 64, 0.08)',
                  }}
                >
                  <Typography sx={{ fontWeight: 400, lineHeight: 1.6 }}>
                    {chatFlowJson.content_creator.greeting}
                  </Typography>

                  <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {chatFlowJson.content_creator.types.map((typeObj, i) => {
                      const opt = typeObj.type;
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
                </Box>
              </Box>
            )}

            {/* Chat Messages */}
            {chatMessages?.map((message, index) => (
              <ChatMessage
                key={message.id ?? index}
                message={message}
                profile={data?.profile_pic}
                showTyping={message.id === streamingMessageId}
              />
            ))}

            {/* Typing Indicator */}
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
                    <CircularProgress size={20} sx={{ color: '#471396' }} />
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

          {/* Input Form */}
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
                        disabled={isLoading}
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
                      disabled={isLoading || !values.description.trim()}
                      sx={{
                        background: isLoading ? '#cccccc' : '#471396',
                        color: 'white',
                        width: 56,
                        height: 56,
                        minWidth: 56,
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(71, 19, 150, 0.2)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: isLoading ? '#cccccc' : '#B13BFF',
                          transform: isLoading ? 'none' : 'translateY(-1px)',
                          boxShadow: isLoading ? 'none' : '0 4px 12px rgba(177, 59, 255, 0.3)',
                        },
                        '&:active': {
                          transform: 'translateY(0)',
                        },
                        '&:disabled': {
                          background: '#cccccc',
                          color: '#666666',
                        },
                      }}
                    >
                      {isLoading ? <CircularProgress size={20} color="inherit" /> : <NearMeRounded />}
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
