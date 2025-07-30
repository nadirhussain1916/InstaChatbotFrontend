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
    <>
      {/* Floating Background Elements */}
      <div className="floating-bg">
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
      </div>
      
      <Box sx={{ 
        height: '100vh', 
        display: 'flex', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #405de6 50%, #833ab4 75%, #c13584 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>

        <IconButton
          onClick={handleToggle}
          sx={{ 
            position: 'absolute', 
            top: isMobile ? 9 : 15, 
            left: 8, 
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            '&:hover': {
              background: 'rgba(131, 58, 180, 0.2)',
            }
          }}
        >
          {showPosts ? (
            <ArrowCircleLeftIcon sx={{ fontSize: 32, color: 'white' }} />
          ) : (
            <ArrowCircleRightIcon sx={{ fontSize: 32, color: 'white' }} />
          )}
        </IconButton>

        {showPosts && (
          <Box
            className="glass-morphism-dark"
            sx={{
              width: isMobile ? '100%' : 360,
              flexShrink: 0,
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <InstagramPostsList />
          </Box>
        )}

        {(!isMobile || (isMobile && !showPosts)) && (
          <Box sx={{ 
            flex: 1, 
            minWidth: 0,
            background: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(10px)',
          }}>
            {location.pathname === '/' ? (
              <Chat />
            ) : (
              <ChatInterface />
            )}
          </Box>
        )}
      </Box>
    </>
  );
}

export default Dashboard;
