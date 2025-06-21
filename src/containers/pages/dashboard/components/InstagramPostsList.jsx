import React from 'react';
import { Box, Typography, Paper, Grid, Avatar, CircularProgress } from '@mui/material';
import InstagramPost from './InstagramPost';
import { TrendingUp } from '@mui/icons-material';
import { useGetUserPostQuery } from '@/services/private/post';
import SectionSkeletonLoader from '@/containers/common/loaders/SectionSkeletonLoader';

function InstagramPostsList() {
  const { data: mockInstagramPosts = [], isLoading } = useGetUserPostQuery();

  // Calculate total likes and comments
  const totalLikes = mockInstagramPosts.reduce((sum, post) => sum + (post.likes || 0), 0);
  const totalComments = mockInstagramPosts.reduce((sum, post) => sum + (post.comments || 0), 0);

  const formatNumber = num => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <Box sx={{ bgcolor: '#f9fafb', borderRight: '1px solid #e5e7eb', height: '100%', overflowY: 'auto' }}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              background: 'linear-gradient(to right, #ec4899, #f97316)',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrendingUp size={20} color="white" />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Top Posts
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Your best performing content
            </Typography>
          </Box>
        </Box>

        {/* Loader */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            < SectionSkeletonLoader />
          </Box>
        ) : (
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
                    <Typography variant="caption" sx={{ color: '#fff', fontWeight: 'bold', fontSize: '0.75rem' }}>
                      {index + 1}
                    </Typography>
                  </Box>
                  <InstagramPost post={post} />
                </Box>
              ))}
            </Box>

            {/* Performance Summary */}
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
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary', mb: 1 }}>
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
        )}
      </Box>
    </Box>
  );
}

export default InstagramPostsList;
