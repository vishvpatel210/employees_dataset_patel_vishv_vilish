import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import MasterLayout from './components/MasterLayout';
import RequireAuth from './components/RequireAuth';
import RoleBasedRoute from './components/RoleBasedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import AuthLayout from './pages/Auth/AuthLayout';
import { AUTH_PATHS, ROLES } from './utils/constants';

const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/Auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/Auth/ResetPasswordPage'));

const Dashboard = lazy(() => import('./pages/Dashboard'));
const EmployeeDashboard = lazy(() => import('./pages/Dashboard/EmployeeDashboard'));
const EmployeeList = lazy(() => import('./pages/EmployeeList'));
const EmployeeCreate = lazy(() => import('./pages/EmployeeCreate'));
const EmployeeEdit = lazy(() => import('./pages/EmployeeEdit'));
const EmployeeDetail = lazy(() => import('./pages/EmployeeDetail'));
const DepartmentList = lazy(() => import('./pages/DepartmentList'));
const ProjectList = lazy(() => import('./pages/ProjectList'));
const TaskList = lazy(() => import('./pages/TaskList'));
const AnalyticsDashboard = lazy(() => import('./pages/Analytics/AnalyticsDashboard'));
const AdminOverview = lazy(() => import('./pages/Admin/AdminOverview'));
const UserManagement = lazy(() => import('./pages/Admin/UserManagement'));
const ProfilePage = lazy(() => import('./pages/Profile/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/Settings/SettingsPage'));

const Fallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <CircularProgress />
  </Box>
);

const DashboardRouter = () => {
  const { user } = useSelector((state) => state.auth);
  const isAdminOrHr = user?.role === ROLES.ADMIN || user?.role === ROLES.HR;
  return isAdminOrHr ? <Dashboard /> : <EmployeeDashboard />;
};

const App = () => {
  return (
    <ErrorBoundary>
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
              <Route path="/" element={<DashboardRouter />} />

              {/* Profile & Settings - All authenticated users */}
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />

              {/* Admin & HR Only Routes */}
              <Route element={<RoleBasedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]} />}>
                {/* Employees */}
                <Route path="/employees" element={<EmployeeList />} />
                <Route path="/employees/new" element={<EmployeeCreate />} />
                <Route path="/employees/:id" element={<EmployeeDetail />} />
                <Route path="/employees/:id/edit" element={<EmployeeEdit />} />

                {/* Departments */}
                <Route path="/departments" element={<DepartmentList />} />

                {/* Projects */}
                <Route path="/projects" element={<ProjectList />} />

                {/* Tasks */}
                <Route path="/tasks" element={<TaskList />} />

                {/* Analytics */}
                <Route path="/analytics" element={<AnalyticsDashboard />} />

                {/* Admin Overview */}
                <Route path="/admin" element={<AdminOverview />} />
                <Route path="/admin/users" element={<UserManagement />} />
              </Route>
            </Route>
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to={AUTH_PATHS.LOGIN} replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
