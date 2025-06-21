import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  TextField,
  IconButton,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import ChatMessage from './ChatMessage';
import { NearMeRounded } from '@mui/icons-material';
import { useCreateChatMutation } from '@/services/private/chat';
import useAuth from '@/hooks/useAuth';
import { useAuthorizedQuery } from '@/services/private/auth';

const ChatSchema = Yup.object({
  description: Yup.string().required('Description is required'),
});

function ChatInterface() {
  const [contentType, setContentType] = useState('Humble');
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [createChat] = useCreateChatMutation();
  const { handleLogout } = useAuth();
  const { data } = useAuthorizedQuery();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = event => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleAppLogout = () => {
    handleLogout();
    handleMenuClose();
  };

  const handleSubmit = async (values, { resetForm }) => {
    const timestamp = new Date().toLocaleTimeString();

    // User message
    const userMessage = {
      id: Date.now(),
      content: values.description,
      type: 'user',
      timestamp,
    };

    setChatMessages(prev => [...prev, userMessage]);
    resetForm();
    setIsTyping(true);

    try {
      const payload = {
        ...values,
        content_type: contentType,
      };

      const response = await createChat(payload).unwrap();

      const slidesRaw = response?.carousel_content?.slide_contents;
      const slideMessages = [];

      if (Array.isArray(slidesRaw)) {
        slidesRaw.forEach((slide, idx) => {
          slideMessages.push({
            id: Date.now() + idx + 1,
            content: slide,
            type: 'bot',
            timestamp: new Date().toLocaleTimeString(),
          });
        });
      } else if (typeof slidesRaw === 'string') {
        slideMessages.push({
          id: Date.now() + 1,
          content: slidesRaw,
          type: 'bot',
          timestamp: new Date().toLocaleTimeString(),
        });
      }

      setChatMessages(prev => [...prev, ...slideMessages]);
    } catch (error) {
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1000,
          content: 'Something went wrong. Please try again.',
          type: 'bot',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }

    setIsTyping(false);
  };

  return (
    <Box display="flex" flexDirection="column" height="100%" bgcolor="white">
      {/* Top Bar */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        borderBottom="1px solid #e0e0e0"
      >
        <Box display="flex" gap={2}>
          {['Humble', 'Image', 'Video'].map(type => (
            <Button
              key={type}
              onClick={() => setContentType(type)}
              variant="contained"
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                color: contentType === type ? 'white' : 'black',
                background:
                  contentType === type
                    ? 'linear-gradient(to right, #a855f7, #ec4899, #fb923c)'
                    : '#f0f0f0',
                '&:hover': {
                  background:
                    contentType === type
                      ? 'linear-gradient(to right, #a855f7, #ec4899, #fb923c)'
                      : '#e0e0e0',
                },
              }}
            >
              {type}
            </Button>
          ))}
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={data?.profile_pic}
            sx={{ width: 40, height: 40, cursor: 'pointer' }}
            onClick={handleAvatarClick}
          />
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={handleAppLogout}>Logout</MenuItem>
          </Menu>
          <Box>
            <Typography fontWeight={600}>{data?.full_name}</Typography>
            <Typography fontSize={14} color="text.secondary">
              {data?.role || 'Content Creator'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Chat Body */}
      <Box flex={1} overflow="auto" p={3}>
        {chatMessages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
            isLatest={index === chatMessages.length - 1}
          />
        ))}

        {isTyping && (
          <Box display="flex" justifyContent="flex-start" mb={2}>
            <Box
              px={2}
              py={1.5}
              border="1px solid #e0e0e0"
              borderRadius={4}
              boxShadow={1}
            >
              <Typography fontSize={12} color="text.secondary">
                AI is typing...
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Input Area */}
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
                    placeholder="Describe the carousel you want to create..."
                    value={values.description}
                    onChange={handleChange}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                    InputProps={{
                      endAdornment: (
                        <AutoAwesomeIcon
                          sx={{
                            color: 'grey.500',
                            position: 'absolute',
                            right: 12,
                            top: 12,
                          }}
                        />
                      ),
                      sx: { borderRadius: 2 },
                    }}
                  />
                </Box>
                <IconButton
                  type="submit"
                  sx={{
                    background:
                      'linear-gradient(to right, #a855f7, #ec4899, #fb923c)',
                    color: 'white',
                    width: 48,
                    height: 48,
                  }}
                >
                  <NearMeRounded />
                </IconButton>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}

export default ChatInterface;
