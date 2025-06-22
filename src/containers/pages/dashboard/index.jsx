import React, { useState } from 'react';
import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import InstagramPostsList from './components/InstagramPostsList';
import ChatInterface from './components/ChatInterface';

function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showPosts, setShowPosts] = useState(false);

  const handleToggle = () => {
    setShowPosts(prev => !prev);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', bgcolor: 'grey.100', position: 'relative' }}>
      {isMobile && (
        <IconButton
          onClick={handleToggle}
          sx={{ position: 'absolute', top: 8, left: 8, zIndex: 10 }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {(!isMobile || (isMobile && showPosts)) && (
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
          <ChatInterface />
        </Box>
      )}
    </Box>
  );
}

export default Dashboard;
