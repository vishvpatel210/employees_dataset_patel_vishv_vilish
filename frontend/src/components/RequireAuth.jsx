import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RequireAuth = () => {
  // For PR 1, we simulate an authenticated state
  // In later PRs, this will use Redux or LocalStorage to check JWT
  const isAuthenticated = true; 

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
