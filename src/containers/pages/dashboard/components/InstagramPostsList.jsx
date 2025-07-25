import React, { useEffect, useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import InstagramPost from './InstagramPost';
import { useGetUserPostQuery } from '@/services/private/post';
import { useDeleteChatMutation, useGetPreviousChatQuery, useUpdateChatTitleMutation, } from '@/services/private/chat';
import SectionSkeletonLoader from '@/containers/common/loaders/SectionSkeletonLoader';
import { truncateMessage } from '@/utilities/helpers';

function InstagramPostsList() {
  const [enableQuery, setEnableQuery] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEnableQuery(true);
    }, 4000); // 4 seconds

    return () => clearTimeout(timer);
  }, []);

  const { data: mockInstagramPosts = [], isLoading } = useGetUserPostQuery(undefined, {
    skip: !enableQuery,
  });
  const { data: previousChat = [] } = useGetPreviousChatQuery();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [view, setView] = useState('posts');
  const navigate = useNavigate();

  // State for menu and inline editing
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuIndex, setMenuIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [chats, setChats] = useState(previousChat);
  const [deleteChat] = useDeleteChatMutation();
  const [updateChat] = useUpdateChatTitleMutation();
  useEffect(() => {
    setChats(previousChat);
    setEditingIndex(null); // Reset editing index
    setEditValue(''); // Reset edit value
  }, [previousChat]);

  const handleClickNewChat = async () => {
      navigate('/');
  };

  const handleMenuOpen = (event, idx) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setMenuIndex(idx);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuIndex(null);
  };

  const handleRename = idx => {
    setEditingIndex(idx);
    setEditValue(truncateMessage(chats[idx]?.title, 30) || 'New conversation');
    handleMenuClose();
  };

  const handleRenameChange = e => {
    setEditValue(e.target.value);
  };

  const handleRenameSubmit = idx => {
    updateChat({
      thread_id: idx,
      title: editValue,
    });
  };

  const handleDelete = idx => {
    deleteChat(idx);
    handleMenuClose();
  };

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
      {/* Custom Toggle */}
      <Box sx={{ p: isMobile ? 1 : 2, display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            width: 220,
            height: 50,
            borderRadius: 999,
            background: 'linear-gradient(to right, #ec4899, #f97316)',
            position: 'relative',
            p: '4px',
          }}
        >
          {/* Thumb */}
          <Box
            sx={{
              position: 'absolute',
              top: 2,
              left: view === 'posts' ? 2 : 168,
              width: 50,
              height: 46,
              backgroundColor: '#fff',
              borderRadius: 999,
              transition: 'left 0.3s ease',
              zIndex: 4,
            }}
          />

          {/* Clickable Labels */}
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              height: '100%',
              zIndex: 2,
            }}
          >
            {/* Posts */}
            <Box
              onClick={() => setView('posts')}
              sx={{
                width: '50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: view === 'posts' ? '#ec4899' : '#6b7280',
                fontWeight: 600,
                transition: 'color 0.3s ease',
              }}
            >
              {view !== 'posts' && (
                <Typography color="white" variant="caption">
                  Top Posts
                </Typography>
              )}
            </Box>

            {/* Chat */}
            <Box
              onClick={() => setView('chat')}
              sx={{
                width: '50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: view === 'chat' ? '#f97316' : '#6b7280',
                fontWeight: 600,
                transition: 'color 0.3s ease',
              }}
            >
              {view !== 'chat' && (
                <Typography color="white" variant="caption">
                  Chats
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    {/* Content */}
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
      {view === 'posts' ? (
        !enableQuery ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="body1" color="text.secondary" fontWeight={500}>
              Posts are loading...
            </Typography>
          </Box>
        ) : isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <SectionSkeletonLoader />
          </Box>
        ) : mockInstagramPosts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="body1" color="text.secondary" fontWeight={500}>
              No top post available
            </Typography>
          </Box>
        ) : (
          <>
            <Button
              variant="contained"
              fullWidth
              sx={{
                background: 'linear-gradient(to right, #a855f7, #ec4899, #fb923c)',
                color: '#fff',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                py: 1.5,
                mt: 2.1,
                fontSize: '1rem',
                '&:hover': {
                  background: 'linear-gradient(to right, #9333ea, #db2777, #f97316)',
                },
              }}
            >
              Top Posts
            </Button>
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
          </>
        )
      ) : (
        <>
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

            {/* Chat List */}
            {chats.map((chat, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#f3f4f6' },
                  position: 'relative',
                }}
                onClick={() => {
                  if (editingIndex === index) return;
                  navigate(`/new-chat/${chat?.thread_id}`);
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {editingIndex === index ? (
                    <TextField
                      value={editValue}
                      onChange={handleRenameChange}
                      onClick={e => e.stopPropagation()}
                      onBlur={() => handleRenameSubmit(index)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleRenameSubmit(chat?.thread_id);
                        if (e.key === 'Escape') setEditingIndex(null);
                      }}
                      size="small"
                      autoFocus
                      fullWidth
                      inputProps={{
                        style: {
                          fontWeight: 500,
                          fontSize: '0.95rem',
                          color: '#111827',
                        },
                      }}
                    />
                  ) : (
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
                      {truncateMessage(chat?.title, 30) || 'New conversation'}
                    </Typography>
                  )}
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
                <IconButton
                  size="small"
                  sx={{ ml: 1 }}
                  onClick={e => handleMenuOpen(e, index)}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
                <Menu
                  anchorEl={menuAnchorEl}
                  open={menuIndex === index}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  onClick={e => e.stopPropagation()}
                >
                  <MenuItem onClick={() => handleRename(index)}>Rename</MenuItem>
                  <MenuItem onClick={() => handleDelete(chat?.thread_id)} sx={{ color: 'red' }}>
                    Delete
                  </MenuItem>
                </Menu>
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
