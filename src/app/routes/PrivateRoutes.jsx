import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import GloabalLoader from '../../containers/common/loaders/GloabalLoader';

function PrivateRoutes() {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { pathname, search } = useLocation();

  console.log(user);

  // Show loader until user object is loaded
  if (isAuthenticated && (user === undefined || user === null)) {
    return <GloabalLoader />;
  }

  if (isAuthenticated) {

    // If admin and has not answered, always redirect to edit-prompts
    // if (user?.role === 'admin' && user?.has_answered === false && pathname !== '/edit-prompts') {
    //   return <Navigate to="/edit-prompts" replace />;
    // }

    // If user is not admin and has not answered, redirect to questions unless already there
    if (user?.has_answered === false && pathname !== '/question') {
      return <Navigate to="/question" replace />;
    }

    // If user has answered, redirect to home unless already there
    if (user?.has_answered === true && pathname !== '/') {
      return <Navigate to="/" replace />;
    }

    return <Outlet />;
  }

  // Not authenticated → redirect to login
  return <Navigate to="/auth/login" state={{ from: `${pathname}${search}` }} />;
}

export default PrivateRoutes;
