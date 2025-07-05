import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, useTheme, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { API_URL } from '@/utilities/constants';

function ChatMessage({ message, isLatest,profile }) {
  const theme = useTheme();
  const isUser = message.type === 'user';
  const [typedText, setTypedText] = useState('');
  const messageRef = useRef();
  const fullText = removeSquareBrackets(message.content);

  useEffect(() => {
    if (isLatest && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isLatest]);

  useEffect(() => {
    if (isUser) {
      setTypedText(fullText);
      return;
    }

    setTypedText('');
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(prev => prev + fullText.charAt(index));
      index++;
      if (index >= fullText.length) clearInterval(interval);
    }, 20);

    return () => clearInterval(interval);
  }, [fullText]);

  function removeSquareBrackets(text) {
    if (!text) return '';
    if (text.startsWith('[') && text.endsWith(']')) {
      return text.slice(1, -1).trim();
    }
    return text.trim();
  }

  return (
    <Box
      ref={messageRef}
      display="flex"
      justifyContent={isUser ? 'flex-end' : 'flex-start'}
      mb={2}
    >
      <Box
        display="flex"
        flexDirection={isUser ? 'row-reverse' : 'row'}
        // alignItems="flex-end"
        gap={1}
      >
        <Avatar
          sx={{ bgcolor: isUser ? 'transparent' : '#e0e0e0' }}
          src={isUser ? `${API_URL}${profile}` : undefined}
        >
          {!isUser && 'AI'}
        </Avatar>

        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          sx={{
            maxWidth: { xs: '70vw', lg: '60vw' },
            px: 2,
            py: 1.5,
            borderRadius: 2,
            background: isUser
              ? 'linear-gradient(to right, #ec4899, #f97316)'
              : '#fff',
            color: isUser ? '#fff' : theme.palette.text.primary,
            border: isUser ? 'none' : `1px solid ${theme.palette.grey[300]}`,
            boxShadow: isUser ? 'none' : theme.shadows[1],
            whiteSpace: 'pre-wrap',
          }}
        >
          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
            {typedText}
            {!isUser && typedText.length < fullText.length && (
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
                style={{ display: 'inline-block' }}
              >
                |
              </motion.span>
            )}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default ChatMessage;
