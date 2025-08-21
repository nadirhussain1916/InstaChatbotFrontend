import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import PrivateRoutes from './PrivateRoutes';
import PublicRoutes from './PublicRoutes';
import GloabalLoader from '@containers/common/loaders/GloabalLoader';
import Dashboard from '@/containers/pages/dashboard';
import Question from '@/containers/pages/questions';
import SignUp from '@/containers/pages/auth/signup';
import ChangePassword from '@/containers/pages/auth/changePassword';
import EditPromptsForm from '@/containers/pages/admin';

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
                <Route path="signup" element={<SignUp />} />
                <Route path="change-password" element={<ChangePassword />} />

              </Route>

              {/* Private routes */}
              <Route element={<PrivateRoutes />}>
                <Route path='/' element={<Dashboard />} />
                <Route path='chat/' element={<Dashboard />} />
                <Route path="question" element={<Question />} />
                <Route path="chat/:id" element={<Dashboard />} />
                <Route path="edit-prompts" element={<EditPromptsForm />} />
              </Route>

          </Routes>

        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default AppRoutes;
