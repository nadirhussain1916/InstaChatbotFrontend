import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useNavigate } from 'react-router-dom';

import InstagramPost from './InstagramPost';
import { useGetUserPostQuery } from '@/services/private/post';
import SectionSkeletonLoader from '@/containers/common/loaders/SectionSkeletonLoader';
import { useGetPreviousChatQuery } from '@/services/private/chat';
import { truncateMessage } from '@/utilities/helpers';

function InstagramPostsList() {
  const { data: mockInstagramPosts = [], isLoading } = useGetUserPostQuery();
  const { data: previousChat = [] } = useGetPreviousChatQuery();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [view, setView] = useState('posts');
  const navigate = useNavigate();

  const formatNumber = num => (num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString());
  const totalLikes = mockInstagramPosts.reduce((sum, post) => sum + (post.likes || 0), 0);
  const totalComments = mockInstagramPosts.reduce((sum, post) => sum + (post.comments || 0), 0);

  const handleClickNewChat = () => navigate('/');

  return (
    <Box
      sx={{
        bgcolor: '#f9fafb',
        borderRight: '1px solid #e5e7eb',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Toggle Section */}
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 3 }}>
          <Typography
            onClick={() => setView('posts')}
            sx={{
              cursor: 'pointer',
              fontWeight: view === 'posts' ? 700 : 500,
              color: view === 'posts' ? 'primary.main' : 'text.secondary',
              fontSize: '1rem',
            }}
          >
            Posts
          </Typography>

          <IconButton
            onClick={() => setView(view === 'posts' ? 'chat' : 'posts')}
            sx={{
              backgroundColor: '#e5e7eb',
              color: '#6b7280',
              '&:hover': { backgroundColor: '#d1d5db' },
            }}
          >
            <SwapHorizIcon />
          </IconButton>

          <Typography
            onClick={() => setView('chat')}
            sx={{
              cursor: 'pointer',
              fontWeight: view === 'chat' ? 700 : 500,
              color: view === 'chat' ? 'primary.main' : 'text.secondary',
              fontSize: '1rem',
            }}
          >
            Chat List
          </Typography>
        </Box>
      </Box>

      {/* Scrollable Content */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: isMobile ? 2 : 3,
          pb: 3,
          '&::-webkit-scrollbar': {
            width: '3px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f3f4f6',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#a855f7',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#9333ea',
          },
        }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <SectionSkeletonLoader />
          </Box>
        ) : view === 'posts' ? (
          <>
            {/* Posts List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {mockInstagramPosts.map((post, index) => (
                <Box key={post.id} sx={{ position: 'relative' }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -8,
                      left: -8,
                      zIndex: 10,
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: 'linear-gradient(to right, #ec4899, #f97316)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: '#fff', fontWeight: 'bold', fontSize: '0.75rem' }}
                    >
                      {index + 1}
                    </Typography>
                  </Box>
                  <InstagramPost post={post} />
                </Box>
              ))}
            </Box>

            {/* Summary */}
            <Paper
              elevation={0}
              sx={{
                mt: 4,
                p: 2,
                bgcolor: '#fff',
                borderRadius: 3,
                border: '1px solid #f3f4f6',
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: 'text.primary', mb: 1 }}
              >
                Performance Summary
              </Typography>
              <Grid container spacing={2} textAlign="center">
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#ec4899' }}>
                    {formatNumber(totalLikes)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Total Likes
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#3b82f6' }}>
                    {formatNumber(totalComments)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Total Comments
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </>
        ) : (
          <>
            {/* Chat List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                onClick={handleClickNewChat}
                variant="contained"
                fullWidth
                sx={{
                  background: 'linear-gradient(to right, #a855f7, #ec4899, #fb923c)',
                  color: '#fff',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  py: 1.5,
                  fontSize: '1rem',
                  mb: 2,
                  '&:hover': {
                    background: 'linear-gradient(to right, #9333ea, #db2777, #f97316)',
                  },
                }}
              >
                + New Chat
              </Button>

              {previousChat.map((chat, index) => (
                <Box
                  key={index}
                  onClick={() => navigate(`/new-chat/${chat?.thread_id}`)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: '#f3f4f6',
                    },
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      color: '#111827',
                      fontSize: '0.95rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {truncateMessage(chat?.messages?.message, 30) || 'New conversation'}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#6b7280',
                      fontSize: '0.75rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {chat?.created_at
                      ? new Date(chat.created_at).toLocaleString()
                      : 'Recently'}
                  </Typography>
                </Box>
              ))}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

export default InstagramPostsList;
