import React, { useState } from 'react';
import {
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
  PersonOutlineRounded,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useSignupMutation } from '@/services/public/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { onLoggedIn } from '@/store/slices/authSlice';
import { useUserInstagramPostDataMutation } from '@/services/private/post';
import useHandleApiResponse from '@/hooks/useHandleApiResponse';

const initialValues = {
  username: '',
  password: '',
};

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [login, {error:isError ,isSuccess}] = useSignupMutation();
  useHandleApiResponse(isError, isSuccess, 'Sign Up Successfully');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [getData] = useUserInstagramPostDataMutation();

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    setLoading(true);

    const loginResp = await login({ ...values });

    if (loginResp?.data) {
      dispatch(onLoggedIn(loginResp?.data));
      getData({ ...values });
      navigate('/');
    } else {
      setError('Invalid username or password');
    }

    setLoading(false);
    setSubmitting(false);
  };

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

      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3 p-4"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #405de6 50%, #833ab4 75%, #c13584 100%)',
          minHeight: '100vh',
        }}
      >
        <div
          className="glass-morphism rounded-4 w-100"
          style={{
            maxWidth: '28rem',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 45px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Instagram Gradient Top Border */}
          <div
            style={{
              height: '4px',
              background: 'linear-gradient(90deg, #405de6, #833ab4, #c13584, #e1306c, #fd1d1d)',
              backgroundSize: '300% 300%',
              animation: 'gradientShift 3s ease infinite',
            }}
          ></div>

          <DialogContent
            sx={{
              backgroundColor: 'transparent',
              minHeight: '450px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4,
              position: 'relative',
            }}
          >
            {/* Enhanced Avatar with Ring Animation */}
            <div className="avatar-ring">
              <Avatar
                sx={{
                  background: 'linear-gradient(45deg, #405de6, #833ab4, #c13584, #e1306c)',
                  mb: 3,
                  height: '80px',
                  width: '80px',
                  boxShadow: '0 10px 30px rgba(64, 93, 230, 0.3)',
                }}
              >
                <PersonOutlineRounded sx={{ fontSize: 40, color: 'white' }} />
              </Avatar>
            </div>

            {/* Enhanced Title with Gradient Text */}
            <Typography 
              variant="h4" 
              fontWeight={700} 
              mb={4}
              className="instagram-gradient-text"
              sx={{ 
                textAlign: 'center',
                letterSpacing: '0.5px',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
              }}
            >
              Join Instagram AI
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
                    placeholder="Instagram Username"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.username && Boolean(errors.username)}
                    helperText={touched.username && errors.username}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlineRounded sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        color: 'white',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        borderWidth: '1px',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(131, 58, 180, 0.6)',
                      },
                      '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#833ab4',
                        borderWidth: '2px',
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: 'rgba(255, 255, 255, 0.6)',
                      },
                      '& .MuiFormHelperText-root': {
                        color: '#ff6b6b',
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    placeholder="Instagram Password"
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
                          <LockIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton 
                            onClick={() => setShowPassword(prev => !prev)} 
                            edge="end"
                            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        color: 'white',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        borderWidth: '1px',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(131, 58, 180, 0.6)',
                      },
                      '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#833ab4',
                        borderWidth: '2px',
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: 'rgba(255, 255, 255, 0.6)',
                      },
                      '& .MuiFormHelperText-root': {
                        color: '#ff6b6b',
                      },
                    }}
                  />

                  {error && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#ff6b6b', 
                        mb: 2, 
                        textAlign: 'center',
                        fontWeight: 500,
                      }}
                    >
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
                      background: 'linear-gradient(45deg, #405de6, #833ab4, #c13584)',
                      borderRadius: '12px',
                      height: '48px',
                      fontSize: '16px',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: '0 8px 25px rgba(64, 93, 230, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #364fc7, #7c3aed, #be185d)',
                        boxShadow: '0 12px 35px rgba(64, 93, 230, 0.4)',
                        transform: 'translateY(-2px)',
                      },
                      '&:disabled': {
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'rgba(255, 255, 255, 0.5)',
                      },
                    }}
                  >
                    {isSubmitting || loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} color="inherit" />
                        Creating Account...
                      </Box>
                    ) : (
                      'Create Account'
                    )}
                  </Button>

                  <Button
                    fullWidth
                    size="large"
                    variant="outlined"
                    onClick={() => navigate('/auth/login')}
                    sx={{
                      mb: 3,
                      borderRadius: '12px',
                      height: '48px',
                      fontSize: '16px',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#833ab4',
                        backgroundColor: 'rgba(131, 58, 180, 0.1)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 8px 25px rgba(131, 58, 180, 0.2)',
                      },
                    }}
                  >
                    Already have an account? Sign In
                  </Button>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </div>
      </div>
    </>
  );
}

export default SignUpPage;
