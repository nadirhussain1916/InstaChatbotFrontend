import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Menu,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  useTheme,
  useMediaQuery,
  Chip,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Formik, Form } from 'formik';
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

  // UI states
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const handleAvatarClick = e => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleAppLogout = () => {
    handleLogout();
    handleMenuClose();
  };

  // Populate chatMessages from chatDetail on load/refresh
  React.useEffect(() => {
    if (Array.isArray(chatDetail?.messages) && chatDetail?.messages?.length > 0) {
      setChatMessages(
        chatDetail?.messages?.map(msg => ({
          id: msg.id,
          content: msg.message,
          type: msg.sender === 'user' ? 'user' : 'ai',
          timestamp: msg.timestamp,
        }))
      );
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
        ...values,
        thread_id: id || '',
      };
      const response = await createChat(payload).unwrap();

      const botMessages = [];
      const slidesRaw = response?.carousel_content;
      if (Array.isArray(slidesRaw)) {
        slidesRaw.forEach((slide, idx) =>
          botMessages.push({ id: Date.now() + idx + 1, content: slide, type: 'ai', timestamp: new Date().toLocaleTimeString() })
        );
      } else if (typeof slidesRaw === 'string') {
        botMessages.push({ id: Date.now() + 1, content: slidesRaw, type: 'ai', timestamp: new Date().toLocaleTimeString() });
      }
      setChatMessages(prev => [...prev, ...botMessages]);
    } catch {
      setChatMessages(prev => [
        ...prev,
        { id: Date.now() + 1000, content: 'Something went wrong. Please try again.', type: 'ai', timestamp: new Date().toLocaleTimeString() },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100%" bgcolor="white">
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        p={!isMobile ? 2 : 1}
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
              label={truncateUserName(data?.full_name)}
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

      {/* Chat Body */}
      <Box flex={1} overflow="auto" p={3}>
        {chatMessages.map((message, index) => (
          <ChatMessage key={message.id} message={message} isLatest={index === chatMessages.length - 1} profile={data?.profile_pic} />
        ))}
        {isTyping && (
          <Box display="flex" justifyContent="flex-start" mb={2} border="1px solid #e0e0e0" borderRadius={4} boxShadow={1} px={2} py={1.5}>
            <Typography fontSize={12} color="text.secondary">AI is typing...</Typography>
          </Box>
        )}
      </Box>

      {/* Input */}
      <Box p={3} borderTop="1px solid #e0e0e0">
        <Formik
          initialValues={{ description: '' }}
          validationSchema={ChatSchema}
          onSubmit={handleSubmit}
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
