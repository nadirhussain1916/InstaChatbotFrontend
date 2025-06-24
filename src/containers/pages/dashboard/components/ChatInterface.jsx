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
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import ChatMessage from './ChatMessage';
import { NearMeRounded } from '@mui/icons-material';
import { useCreateChatMutation } from '@/services/private/chat';
import useAuth from '@/hooks/useAuth';
import { useAuthorizedQuery } from '@/services/private/auth';
import { API_URL } from '@/utilities/constants';

const ChatSchema = Yup.object({
  description: Yup.string().required('Description is required'),
});

function ChatInterface() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { handleLogout } = useAuth();
  const { data } = useAuthorizedQuery();
  const [createChat] = useCreateChatMutation();

  // UI states
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  // Chat states
  const [contentType, setContentType] = useState('Humble');
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [numSlides, setNumSlides] = useState('');
  const [inspiration, setInspiration] = useState('');
  const [selectInspiration, setSelectInspiration] = useState('Post');
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);
  const handleAvatarClick = e => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleAppLogout = () => {
    handleLogout();
    handleMenuClose();
  };
  console.log(numSlides);
  
  const handleSubmit = async (values, { resetForm }) => {
    const timestamp = new Date().toLocaleTimeString();
    const userMessage = { id: Date.now(), content: values.description, type: 'user', timestamp };
    setChatMessages(prev => [...prev, userMessage]);
    resetForm();
    setIsTyping(true);

    try {
      const payload = {
        ...values,
        content_type: contentType,
        num_slides: numSlides || null,
        inspiration: inspiration
      };
      const response = await createChat(payload).unwrap();

      const botMessages = [];
      const slidesRaw = response?.carousel_content?.slide_contents;
      if (Array.isArray(slidesRaw)) {
        slidesRaw.forEach((slide, idx) =>
          botMessages.push({ id: Date.now() + idx + 1, content: slide, type: 'bot', timestamp: new Date().toLocaleTimeString() })
        );
      } else if (typeof slidesRaw === 'string') {
        botMessages.push({ id: Date.now() + 1, content: slidesRaw, type: 'bot', timestamp: new Date().toLocaleTimeString() });
      }
      setChatMessages(prev => [...prev, ...botMessages]);
    } catch {
      setChatMessages(prev => [
        ...prev,
        { id: Date.now() + 1000, content: 'Something went wrong. Please try again.', type: 'bot', timestamp: new Date().toLocaleTimeString() },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100%" bgcolor="white">
      {/* Top Bar */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={!isMobile ? 2 : 5}
        borderBottom="1px solid #e0e0e0"
      >
        <Box display="flex" gap={2}>
          {['Humble', 'Origin', 'Product'].map(type => (
            <Button
              key={type}
              onClick={() => setContentType(type)}
              variant="contained"
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                color: contentType === type ? 'white' : 'black',
                background:
                  contentType === type ? 'linear-gradient(to right, #a855f7, #ec4899, #fb923c)' : '#f0f0f0',
                '&:hover': {
                  background:
                    contentType === type ? 'linear-gradient(to right, #a855f7, #ec4899, #fb923c)' : '#e0e0e0',
                },
              }}
            >
              {type}
            </Button>
          ))}
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={`${API_URL}${data?.profile_pic}`}
            sx={{ width: 40, height: 40, cursor: 'pointer' }}
            onClick={handleAvatarClick}
          />
          <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
            <MenuItem onClick={handleAppLogout}>Logout</MenuItem>
          </Menu>
          {!isMobile && <Typography fontWeight={600}>{data?.full_name}</Typography>}
        </Box>
      </Box>

      {/* Chat Body */}
      <Box flex={1} overflow="auto" p={3}>
        {chatMessages.map((message, index) => (
          <ChatMessage key={message.id} message={message} isLatest={index === chatMessages.length - 1} />
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
                    InputProps={{
                      endAdornment:
                        <AddCircleIcon

                          onClick={() => {
                            if (!numSlides && !inspiration) {
                              handleModalOpen();
                            }
                          }}
                          sx={{
                            color: '#fb923c',
                            position: 'absolute',
                            right: 12,
                            top: 18,
                            cursor: 'pointer',
                          }}
                        />
                    }}
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

      {/* Modal */}
      <Modal open={openModal} onClose={handleModalClose}>
        <Box
          sx={{
            bgcolor: 'white',
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            width: !isMobile ? 450 : 320,
            mx: 'auto',
            mt: '10%',
          }}
        >
          <Typography variant="h6" mb={2}>Create Carousel</Typography>

          <TextField
            fullWidth
            label="Add number of slides"
            variant="outlined"
            value={numSlides}
            onChange={e => setNumSlides(e.target.value)}
            sx={{
              mb: 3,
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

          <FormLabel sx={{ mb: 1 }}>Select Inspiration:</FormLabel>
          <RadioGroup
            row
            value={selectInspiration}
            onChange={e => setSelectInspiration(e.target.value)}
            sx={{ mb: 3 }}
          >
            <FormControlLabel value="Post" control={<Radio />} label="Instagram Post Link" />
            <FormControlLabel value="email" control={<Radio />} label="Email Content" />
            {selectInspiration === 'Post' && (
              <TextField
                fullWidth
                label="Past link here"
                variant="outlined"
                value={inspiration}
                onChange={e => setInspiration(e.target.value)}
                sx={{
                  mb: 3,
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
            )}
            {selectInspiration === 'email' && (
              <TextField
                multiline
                fullWidth
                label="Past Email Content "
                variant="outlined"
                value={inspiration}
                onChange={e => setInspiration(e.target.value)}
                sx={{
                  mb: 3,
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
            )}
          </RadioGroup>

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="contained"
              sx={{
                color: 'white',
                background: 'linear-gradient(to right, #a855f7, #ec4899, #fb923c)',
                '&:hover': {
                  background: 'linear-gradient(to right, #a855f7, #ec4899, #fb923c)',
                },
              }}
              onClick={handleModalClose}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleModalClose}
              sx={{
                color: 'white',
                background: 'linear-gradient(to right, #a855f7, #ec4899, #fb923c)',
                '&:hover': {
                  background: 'linear-gradient(to right, #a855f7, #ec4899, #fb923c)',
                },
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default ChatInterface;
