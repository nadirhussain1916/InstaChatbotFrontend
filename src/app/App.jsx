import React, { useEffect } from 'react';
import { ThemeProvider } from '@mui/material';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';

// COMPONENTS & UTILS
import theme from '../styles/mui/theme';
import AppRoutes from './routes';
import { useDispatch } from 'react-redux';
import { onLoggedIn, onLoggedOut } from '@/store/slices/authSlice';
import { useAuthorizedQuery } from '@/services/private/auth';

function App() {
  const dispatch = useDispatch();
  const { data, isError, isLoading, isSuccess } = useAuthorizedQuery();
  console.log(data);
  
  useEffect(() => {
    if (isSuccess) {
      dispatch(onLoggedIn(data));
    } else if (isError) dispatch(onLoggedOut());
  }, [data, dispatch, isError, isSuccess]);

  return <ThemeProvider theme={theme}>{!isLoading && <AppRoutes />}</ThemeProvider>;
}

export default App;
