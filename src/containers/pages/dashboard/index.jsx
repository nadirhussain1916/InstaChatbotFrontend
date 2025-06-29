import React, { useState } from 'react';
import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import InstagramPostsList from './components/InstagramPostsList';
import ChatInterface from './components/ChatInterface';
import { useLocation } from 'react-router-dom';
import Chat from './components/Chat';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showPosts, setShowPosts] = useState(true);

  const handleToggle = () => {
    setShowPosts(prev => !prev);
  };
  const location = useLocation();

  return (
    <Box sx={{ height: '100vh', display: 'flex', bgcolor: 'grey.100', position: 'relative' }}>

      <IconButton
        onClick={handleToggle}
        sx={{ position: 'absolute', top: isMobile ? 9 : 15, left: 8, zIndex: 10 }}
      >
        {showPosts ? (

          <ArrowCircleLeftIcon  sx={{ fontSize: 32, color: 'primary.main' }} />
        ) : (
          <ArrowCircleRightIcon  sx={{ fontSize: 32 }} />

        )}
      </IconButton>

      {showPosts && (
        <Box
          sx={{
            width: isMobile ? '100%' : 360,
            flexShrink: 0,
            bgcolor: 'white',
          }}
        >
          <InstagramPostsList />
        </Box>
      )}

      {(!isMobile || (isMobile && !showPosts)) && (
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {location.pathname === '/' ? (
            <Chat />
          ) : (
            <ChatInterface />
          )}
        </Box>
      )}
    </Box>
  );
}

export default Dashboard;
