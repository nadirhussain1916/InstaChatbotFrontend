import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { API_URL } from '@/utilities/constants';
import image from "@assets/logo.png";

function removeSquareBrackets(text) {
  if (!text) return '';
  if (text.startsWith('[') && text.endsWith(']')) {
    return text.slice(1, -1).trim();
  }
  return text.trim();
}

function ChatMessage({ message, profile, showTyping = false }) {
  const isUser = message.type === 'user';
  const [typedText, setTypedText] = useState('');

  const fullText = useMemo(() => removeSquareBrackets(message.content), [message.content]);

  useEffect(() => {
    let interval;

    if (isUser || !showTyping) {
      setTypedText(fullText); // Show message instantly
    } else {
      let index = 0;
      setTypedText(''); // Start fresh for typing animation

      interval = setInterval(() => {
        setTypedText(prev => {
          const next = prev + fullText.charAt(index);
          index++;
          if (index >= fullText.length) clearInterval(interval);
          return next;
        });
      }, 20);
    }

    return () => clearInterval(interval);
  }, [message.id, fullText, isUser, showTyping]);

  // Scroll message into view when typedText changes (typing effect or full text)
  // useEffect(() => {
  //   if (messageRef.current) {
  //     messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  //   }
  // }, [typedText]);

  // useEffect(() => {
  //   if (isTyping && messageRef.current) {
  //     messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  //   }
  // }, [isTyping]);

  return (
    <Box
      // ref={messageRef}
      display="flex"
      justifyContent={isUser ? 'flex-end' : 'flex-start'}
      mb={2}
    >
      <Box
        display="flex"
        flexDirection={isUser ? 'row-reverse' : 'row'}
        gap={1}
      >
        {isUser ? (
          <Avatar src={profile ? `${API_URL}${profile}` : ''} />
        ) : (
          <img src={image} height={50} width={50} alt="user-image" />
        )}

        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          sx={{
            maxWidth: { xs: '75vw', lg: '65vw' },
            px: 3,
            py: 2,
            borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            background: isUser
              ? '#471396'
              : '#ffffff',
            color: isUser ? '#ffffff' : '#090040',
            border: isUser ? 'none' : '1px solid rgba(177, 59, 255, 0.15)',
            boxShadow: isUser 
              ? '0 2px 8px rgba(71, 19, 150, 0.2)' 
              : '0 2px 8px rgba(9, 0, 64, 0.08)',
            whiteSpace: 'pre-wrap',
            position: 'relative',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: isUser 
                ? '0 4px 12px rgba(71, 19, 150, 0.3)' 
                : '0 4px 12px rgba(9, 0, 64, 0.12)',
            },
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              lineHeight: 1.6,
              fontSize: '0.875rem',
              fontWeight: 400,
            }}
          >
            {typedText}
            {!isUser && showTyping && typedText.length < fullText.length && (
              <motion.span
                key={`cursor-${typedText.length}`}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
                style={{ 
                  display: 'inline-block',
                  color: '#B13BFF',
                  fontWeight: 'bold',
                  marginLeft: '2px',
                }}
              >
                |
              </motion.span>
            )}
          </Typography>
          
          {/* Timestamp */}
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block',
              mt: 0.5,
              opacity: 0.7,
              fontSize: '0.75rem',
              textAlign: isUser ? 'right' : 'left',
              color: isUser ? 'rgba(255, 255, 255, 0.8)' : 'rgba(9, 0, 64, 0.6)',
            }}
          >
            {message.timestamp}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default React.memo(ChatMessage);
