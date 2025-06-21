import { onLoggedOut } from '@/store/slices/authSlice';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const handleLogout = useCallback(() => {
    dispatch(onLoggedOut());
  }, [dispatch]);

  return { handleLogout, isAuthenticated, user, };
};

export default useAuth;
