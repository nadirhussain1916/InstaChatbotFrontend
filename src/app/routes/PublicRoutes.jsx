import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

function PublicRoutes() {
  const { isAuthenticated } = useSelector(state => state.auth);

  const { state } = useLocation();

 if (isAuthenticated) {
    return <Navigate to={state?.from || '/'} replace />;
  }

  return <Outlet />;
}

export default PublicRoutes;
