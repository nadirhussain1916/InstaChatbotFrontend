import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import PrivateRoutes from './PrivateRoutes';
import PublicRoutes from './PublicRoutes';
import GloabalLoader from '@containers/common/loaders/GloabalLoader';
import Dashboard from '@/containers/pages/dashboard';
// LAZY LOAD
const Login = lazy(() => import('@containers/pages/auth/login'));

function AppRoutes() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <BrowserRouter>
        <Suspense fallback={<GloabalLoader />}>
          <Routes>
            <Route path="/" element={<Outlet />}>
              <Route path="auth" element={<PublicRoutes />}>
                <Route path="login" element={<Login />} />
              </Route>

              <Route path="/" element={<PrivateRoutes />}>
                <Route path="/" element={<Dashboard />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default AppRoutes;
