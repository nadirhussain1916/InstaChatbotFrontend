/* eslint-disable no-unused-vars */
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
  Stack,
  styled,
  Switch,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useNavigate } from 'react-router-dom';

import InstagramPost from './InstagramPost';
import { useGetUserPostQuery } from '@/services/private/post';
import SectionSkeletonLoader from '@/containers/common/loaders/SectionSkeletonLoader';
import { useGetPreviousChatQuery } from '@/services/private/chat';
import { truncateMessage } from '@/utilities/helpers';
import { Opacity } from '@mui/icons-material';

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
const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 220,
  height: 50,
  padding: 0,
  display: 'flex',
  position: 'relative',

  '& .MuiSwitch-switchBase': {
    padding: 4,
    position: 'absolute',
    top: '50%',
    left: 4,
    transform: 'translateY(-50%)',
    zIndex: 2,
    transition: theme.transitions.create(['transform'], {
      duration: 300,
    }),

    '&.Mui-checked': {
      transform: 'translate(166px, -50%)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        background: 'linear-gradient(to right, #ec4899, #f97316)', // ✅ Correct gradient
        opacity: 1, // ✅ Correct casing
        '&::before': {
          display: 'none',
        },
        '&::after': {
          display: 'block',
        },
      },
    },
  },

  '& .MuiSwitch-thumb': {
    width: 42,
    height: 42,
    borderRadius: '50%',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },

  '& .MuiSwitch-track': {
    background: 'linear-gradient(to right, #ec4899, #f97316)',
     opacity: 1,
    borderRadius: 25,
    width: '100%',
    height: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: 16,
    color: '#fff',
    transition: theme.transitions.create(['background-color'], {
      duration: 300,
    }),

    '&::before, &::after': {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: 16,
      fontWeight: 600,
      color: '#fff',
    },

    '&::before': {
      content: '"Chat"',
      right: 24,
      display: 'block',
    },

    '&::after': {
      content: '"Posts"',
      left: 24,
      display: 'none',
    },
  },
}));

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
      <Box sx={{ p: isMobile ? 1 : 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 3 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'center' }}>
            <AntSwitch
              checked={view === 'chat'}
              onChange={e => setView(e.target.checked ? 'chat' : 'posts')}
            />
          </Stack>
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
            {mockInstagramPosts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="body1" color="text.secondary" fontWeight={500}>
                  No top post available
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
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
            )}
          </>
        ) : (
          <>
            {/* Chat List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 3 }}>
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
