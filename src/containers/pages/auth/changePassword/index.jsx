import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Avatar,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  PersonOutlineRounded,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useChangePasswordMutation } from '@/services/public/auth';
import { useNavigate } from 'react-router-dom';
import image from '@assets/image.jpg'

const initialValues = {
  username: '',
  new_password: '',
};

const validationSchema = Yup.object({
  username: Yup.string().required('Old Password is required'),
  new_password: Yup.string().required('New Password is required'),
});

function ChangePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [changePassword] = useChangePasswordMutation();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    setLoading(true);

    const changePasswordResp = await changePassword({ ...values });

    if (changePasswordResp?.data) {
      if (data) {
        navigate('/auth/login');
      }
      onClose();
    } else {
      setError('Try Again');
    }

    setLoading(false);
    setSubmitting(false);
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3 p-4"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        className="bg-white rounded-4 shadow w-100"
        style={{
          maxWidth: '28rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '8px',
            background: 'linear-gradient(to right, #a855f7, #ec4899, #fb923c)',
          }}
        ></div>

        <DialogContent
          sx={{
            backgroundColor: '#fff',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
          }}
        >
          <Avatar
            sx={{
              background: 'linear-gradient(to right, #a855f7, #ec4899, #fb923c)',
              mb: 2,
              height: '65px',
              width: '65px',
            }}
          >
            <PersonOutlineRounded sx={{ fontSize: 32 }} />
          </Avatar>

          <Typography variant="h5" fontWeight={600} mb={3}>
            Change Password
          </Typography>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              handleChange,
              handleBlur,
              touched,
              errors,
              isSubmitting,
            }) => (
              <Form style={{ width: '100%', maxWidth: 400 }}>
                <TextField
                  fullWidth
                  placeholder="Enter user name "
                  name="username"
                  type='text'
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.username && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                  variant="outlined"
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#a855f7', // default border color
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#ec4899', // border color on hover
                    },
                    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#fb923c', // border color on focus
                    },
                  }}
                />
                <TextField
                  fullWidth
                  placeholder="Add New Password"
                  name="new_password"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(prev => !prev)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#a855f7', // default border color
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#ec4899', // border color on hover
                    },
                    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#fb923c', // border color on focus
                    },
                  }}
                />

                {error && (
                  <Typography variant="body2" color="error" mb={1}>
                    {error}
                  </Typography>
                )}
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  type="submit"
                  disabled={loading || isSubmitting}
                  sx={{
                    mb: 2,
                    background: 'linear-gradient(to right, #a855f7, #ec4899, #fb923c)',
                    '&:hover': {
                      background: 'linear-gradient(to right, #a855f7, #ec4899, #fb923c)',
                    },
                  }}

                >
                  {isSubmitting || loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} color="inherit" />
                      Submitting...
                    </Box>
                  ) : (
                    'Submit'
                  )}
                </Button>
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  type="submit"
                  disabled={loading || isSubmitting}
                  sx={{
                    mb: 2,
                    background: 'linear-gradient(to right, #a855f7, #ec4899, #fb923c)',
                    '&:hover': {
                      background: 'linear-gradient(to right, #a855f7, #ec4899, #fb923c)',
                    },
                  }}
                  onClick={() => navigate('/auth/login')}
                >
                  Back to Login
                </Button>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </div>
    </div >
  );
}

export default ChangePassword;
