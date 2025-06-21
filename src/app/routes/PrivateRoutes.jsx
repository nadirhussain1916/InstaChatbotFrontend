import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation, Outlet } from 'react-router-dom';

function PrivateRoutes() {
  const { isAuthenticated } = useSelector(state => state.auth);
  const { pathname,search } = useLocation();

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/login" state={{ from: `${pathname}${search}` }} />
  );
}

export default PrivateRoutes;
