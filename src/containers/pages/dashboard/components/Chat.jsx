import React, { useState } from 'react';
import {
    Box,
    Typography,
    Avatar,
    TextField,
    Button,
    Menu,
    MenuItem,
    useTheme,
    useMediaQuery,
    CircularProgress,
    Chip,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { NearMeRounded } from '@mui/icons-material';
import { useCreateChatMutation } from '@/services/private/chat';
import useAuth from '@/hooks/useAuth';
import { useAuthorizedQuery } from '@/services/private/auth';
import { API_URL } from '@/utilities/constants';
import { useNavigate } from 'react-router-dom';
import { truncateUserName } from '@/utilities/helpers';

const ChatSchema = Yup.object({
    description: Yup.string().required('Description is required'),
});

function Chat() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { handleLogout } = useAuth();
    const { data } = useAuthorizedQuery();
    const [createChat, { isLoading }] = useCreateChatMutation();
    const navigate = useNavigate();
    // UI states
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const handleAvatarClick = e => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleAppLogout = () => {
        handleLogout();
        handleMenuClose();
    };

    const handleSubmit = async values => {
        const payload = {
            ...values,
            thread_id: '',
        };
        const response = await createChat(payload);
        if (response?.data) {
            navigate(`/new-chat/${response?.data?.thread_id}`);
        }
    };

    return (
        <Box display="flex" flexDirection="column" height="100%" bgcolor="white">
            <Box
                backgroundColor="#f9fafb"
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                p={!isMobile ? 2 : 2}
                borderBottom="1px solid #e0e0e0"
            >
                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                        src={`${API_URL}${data?.profile_pic}`}
                        sx={{ width: 40, height: 40, cursor: 'pointer' }}
                        onClick={handleAvatarClick}
                    />
                    <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
                        <MenuItem onClick={handleAppLogout}>Logout</MenuItem>
                    </Menu>
                    {!isMobile && (
                        <Chip
                            label={truncateUserName(data?.full_name)}
                            sx={{
                                color: 'primary.main',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                bgcolor: 'primary.light', // optional light background
                                borderRadius: 1.5,
                            }}
                        />
                    )}
                </Box>
            </Box>
            <Box display="flex" flex={1} alignItems="center" justifyContent="center" minHeight="60vh">
                <Box width={isMobile ? '100%' : '80%'} p={3} borderRadius={2} boxShadow={2}>
                    <Typography
                        variant={isMobile ? 'h5' : 'h4'}
                        fontWeight={600}
                        mb={2}
                        textAlign="center"
                        sx={{
                            background: 'linear-gradient(to right, #a855f7, #ec4899, #fb923c)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            color: 'transparent',
                        }}
                    >
                        Start a new conversation with AI
                    </Typography>
                    <Formik
                        initialValues={{ description: '' }}
                        validationSchema={ChatSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, errors, touched, handleChange }) => (
                            <Form>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Box flex={1} position="relative">
                                        <TextField
                                            fullWidth
                                            multiline
                                            minRows={1}
                                            maxRows={4}
                                            name="description"
                                            placeholder="Write description to create..."
                                            value={values.description}
                                            onChange={handleChange}
                                            error={touched.description && Boolean(errors.description)}
                                            helperText={touched.description && errors.description}
                                            sx={{
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#a855f7',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#ec4899',
                                                },
                                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#fb923c',
                                                },
                                                background: '#f9fafb',
                                                borderRadius: 2,
                                            }}
                                        />
                                    </Box>
                                    <Button
                                        type="submit"
                                        sx={{
                                            background: 'linear-gradient(to right, #a855f7, #ec4899, #fb923c)',
                                            color: 'white',
                                            width: 48,
                                            height: 48,
                                            minWidth: 48,
                                            borderRadius: 2,
                                            '&:hover': {
                                                background: 'linear-gradient(to right, #a855f7, #ec4899, #fb923c)',
                                            },
                                        }}
                                    >
                                        {isLoading ? <CircularProgress size={24} /> : <NearMeRounded />}
                                    </Button>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Box>
        </Box>
    );
}

export default Chat;
