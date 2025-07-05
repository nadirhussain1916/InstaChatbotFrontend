import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import PrivateRoutes from './PrivateRoutes';
import PublicRoutes from './PublicRoutes';
import GloabalLoader from '@containers/common/loaders/GloabalLoader';
import Dashboard from '@/containers/pages/dashboard';
import Question from '@/containers/pages/questions';
// LAZY LOAD
const Login = lazy(() => import('@containers/pages/auth/login'));

function AppRoutes() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <BrowserRouter>
        <Suspense fallback={<GloabalLoader />}>
          <Routes>

              {/* Public routes */}
              <Route path="auth" element={<PublicRoutes />}>
                <Route path="login" element={<Login />} />
              </Route>

              {/* Private routes */}
              <Route element={<PrivateRoutes />}>
                <Route path='/' element={<Dashboard />} />
                <Route path="question" element={<Question />} />
                <Route path="new-chat/:id" element={<Dashboard />} />
              </Route>

          </Routes>

        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default AppRoutes;
