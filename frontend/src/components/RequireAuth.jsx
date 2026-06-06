import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AUTH_PATHS } from '../utils/constants';

const RequireAuth = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={AUTH_PATHS.LOGIN} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
