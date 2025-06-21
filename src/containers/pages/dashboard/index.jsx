import { Box, Button } from '@mui/material';
import React from 'react';
import InstagramPostsList from './components/InstagramPostsList';
import ChatInterface from './components/ChatInterface';

function Dashboard() {
  return (
    <Box sx={{ height: '100vh', display: 'flex', bgcolor: 'grey.100', position: 'relative' }}>
      <Box
        sx={{
          width: 360,
          flexShrink: 0,
          bgcolor: 'white',
        }}
      >
        <InstagramPostsList />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <ChatInterface />
      </Box>
    </Box>
  );
}

export default Dashboard;
