import React from 'react';
import { Box, Typography, Card, CardMedia, CardContent } from '@mui/material';
import { CalendarMonth, FavoriteBorder, Message } from '@mui/icons-material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import dayjs from 'dayjs';
import { API_URL } from '@/utilities/constants';

function InstagramPost({ post }) {

    return (
        <Card
            elevation={1}
            sx={{
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid #f3f4f6',
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: 3,
                    transform: 'scale(1.02)',
                },
            }}
        >
            <Box sx={{ position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden' }}>
                {post.post_type === 'video' ? (
                    <>
                        <CardMedia
                            component="video"
                            src={`${API_URL}${post?.thumbnail_url}`} // Ensure this is a valid image thumbnail, not the actual video
                            alt=""
                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                bgcolor: 'rgba(0, 0, 0, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Box
                                sx={{
                                    width: 60,
                                    height: 60,
                                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <a
                                    href={post?.post_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <PlayArrowIcon sx={{ color: '#1f2937', fontSize: 36 }} />
                                </a>

                            </Box>
                        </Box>
                    </>
                ) : (
                    <CardMedia
                        component="img"
                        image={`${API_URL}${post?.thumbnail_url}`}
                        alt=''
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                )}
            </Box>

            {/* Content */}
            <CardContent sx={{ p: 2 }}>
                {post?.title ? (
                    <Typography
                        variant="body1"
                        sx={{
                            color: 'text.primary',
                            fontWeight: 600,
                            mb: 0.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {post.title}
                    </Typography>
                ) : (
                    <Typography
                        variant="body1"
                        component="a"
                        href={post?.post_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            color: 'primary.main',
                            fontWeight: 600,
                            mb: 0.5,
                            textDecoration: 'none',
                            display: 'inline-block',
                        }}
                    >
                        View Post
                    </Typography>
                )}

                <Typography
                    variant="caption"
                    sx={{
                        color: 'text.secondary',
                        mb: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {post?.caption}
                </Typography>

                {/* Metrics */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <FavoriteBorder sx={{ fontSize: 16, color: '#FF0000' }} />
                            <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                                {post.likes}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Message sx={{ fontSize: 16, color: '#ADD8E6.' }} />
                            <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                                {post.comments}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarMonth sx={{ fontSize: 16, color: '#6b7280' }} />
                            <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                                {dayjs(post.timestamp).format('MMMM D')}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

export default InstagramPost;
