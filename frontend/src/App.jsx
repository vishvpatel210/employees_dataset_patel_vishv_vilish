import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import MasterLayout from './components/MasterLayout';
import RequireAuth from './components/RequireAuth';
import RoleBasedRoute from './components/RoleBasedRoute';
import AuthLayout from './pages/Auth/AuthLayout';
import { AUTH_PATHS, ROLES } from './utils/constants';

const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/Auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/Auth/ResetPasswordPage'));

const Dashboard = lazy(() => import('./pages/Dashboard'));
const EmployeeList = lazy(() => import('./pages/EmployeeList'));

const Fallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <CircularProgress />
  </Box>
);

const App = () => {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        {/* Public Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path={AUTH_PATHS.LOGIN} element={<LoginPage />} />
          <Route path={AUTH_PATHS.REGISTER} element={<RegisterPage />} />
          <Route path={AUTH_PATHS.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={AUTH_PATHS.RESET_PASSWORD} element={<ResetPasswordPage />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<RequireAuth />}>
          <Route element={<MasterLayout />}>
            <Route path="/" element={<Dashboard />} />

            {/* Employees - All authenticated users */}
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/employees/new" element={<div className="p-4">Add Employee Page</div>} />
            <Route path="/employees/:id" element={<div className="p-4">Employee Detail Page</div>} />
            <Route path="/employees/:id/edit" element={<div className="p-4">Edit Employee Page</div>} />

            {/* Departments - All authenticated users */}
            <Route path="/departments" element={<div className="p-4">Departments Page</div>} />

            {/* Projects - All authenticated users */}
            <Route path="/projects" element={<div className="p-4">Projects Page</div>} />
            <Route path="/projects/new" element={<div className="p-4">Add Project Page</div>} />
            <Route path="/projects/:id" element={<div className="p-4">Project Detail Page</div>} />

            {/* Tasks - All authenticated users */}
            <Route path="/tasks" element={<div className="p-4">Tasks Page</div>} />
            <Route path="/tasks/new" element={<div className="p-4">Add Task Page</div>} />

            {/* Analytics - All authenticated users */}
            <Route path="/analytics" element={<div className="p-4">Analytics Page</div>} />

            {/* Settings - All authenticated users */}
            <Route path="/settings" element={<div className="p-4">Settings Page</div>} />

            {/* Admin Only Routes */}
            <Route element={<RoleBasedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]} />}>
              <Route path="/admin" element={<div className="p-4">Admin Dashboard</div>} />
              <Route path="/admin/users" element={<div className="p-4">User Management</div>} />
            </Route>
          </Route>
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to={AUTH_PATHS.LOGIN} replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
