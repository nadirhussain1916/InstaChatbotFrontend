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
import { useLoginMutation } from '@/services/public/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { onLoggedIn } from '@/store/slices/authSlice';
import image from '@assets/image.jpg'
import { useUserInstagramPostDataMutation } from '@/services/private/post';

const initialValues = {
  username: '',
  password: '',
};

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

function LoginPage({ isOpen, onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [login] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [getData] = useUserInstagramPostDataMutation();

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    setLoading(true);

    const loginResp = await login({ ...values });
    console.log(loginResp);

    if (loginResp?.data) {
      dispatch(onLoggedIn(loginResp?.data));
      getData({ ...values });
      if (data) {
        navigate('/');
      }
      onClose();
    } else {
      setError('Invalid username or password');
    }

    setLoading(false);
    setSubmitting(false);
  };

  return (
    <Dialog fullScreen open={isOpen} onClose={onClose}>
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
            <IconButton onClick={onClose} sx={{ position: 'absolute', top: 16, right: 16 }}>
              <CloseIcon />
            </IconButton>

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
              Welcome Back
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
                    placeholder="Username"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.username && Boolean(errors.username)}
                    helperText={touched.username && errors.username}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlineRounded />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    placeholder="Password"
                    name="password"
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
                    sx={{ mb: 2 }}
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
                    }}
                  >
                    {isSubmitting || loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} color="inherit" />
                        Logging in...
                      </Box>
                    ) : (
                      'Login'
                    )}
                  </Button>

                  <Typography
                    variant="caption"
                    color="textSecondary"
                    align="center"
                    display="block"
                    mt={1}
                  >
                    Demo: demo / password123
                  </Typography>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </div>
      </div>
    </Dialog>
  );
}

export default LoginPage;
