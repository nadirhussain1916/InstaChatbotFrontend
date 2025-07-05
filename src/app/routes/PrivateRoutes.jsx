import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import GloabalLoader from '../../containers/common/loaders/GloabalLoader';

function PrivateRoutes() {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { pathname, search } = useLocation();

  if (isAuthenticated && (user === undefined || user === null)) {
    return <GloabalLoader />;
  }
  if (isAuthenticated) {
    // Always redirect to dashboard after login, unless answering questions
    if (user?.has_answered === true && pathname !== '/') {
      return <Navigate to="/" />;
    }
    if (user?.has_answered === false && pathname !== '/question') {
      return <Navigate to="/question" replace />;
    }
    return <Outlet />;
  } else {
    return <Navigate to="/auth/login" state={{ from: `${pathname}${search}` }} />;
  }
}

export default PrivateRoutes;
