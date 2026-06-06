import { Routes, Route, Navigate } from 'react-router-dom';
import MasterLayout from './components/MasterLayout';
import RequireAuth from './components/RequireAuth';
import Dashboard from './pages/Dashboard';
import AuthLayout from './pages/Auth/AuthLayout';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import { AUTH_PATHS } from './utils/constants';

const App = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path={AUTH_PATHS.LOGIN} element={<LoginPage />} />
        <Route path={AUTH_PATHS.REGISTER} element={<RegisterPage />} />
        <Route path={AUTH_PATHS.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={AUTH_PATHS.RESET_PASSWORD} element={<ResetPasswordPage />} />
      </Route>

      {/* Protected Routes inside Master Layout */}
      <Route element={<RequireAuth />}>
        <Route element={<MasterLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<div className="p-4">Employees Listing Page</div>} />
          <Route path="/Departments" element={<div className="p-4">Departments Page</div>} />
          <Route path="/analytics" element={<div className="p-4">Analytics Page</div>} />
          <Route path="/settings" element={<div className="p-4">Settings Page</div>} />
        </Route>
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to={AUTH_PATHS.LOGIN} replace />} />
    </Routes>
  );
};

export default App;
