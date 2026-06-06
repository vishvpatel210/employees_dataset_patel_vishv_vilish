import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box, CircularProgress, Typography } from '@mui/material';
import { fetchProfile } from '../store/slices/authSlice';
import { AUTH_PATHS } from '../utils/constants';

const RequireAuth = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, token, user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user && !loading) {
      dispatch(fetchProfile());
    }
  }, [dispatch, token, user, loading]);

  if (!isAuthenticated) {
    return <Navigate to={AUTH_PATHS.LOGIN} state={{ from: location }} replace />;
  }

  if (token && !user) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 2 }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">Verifying session...</Typography>
      </Box>
    );
  }

  return <Outlet />;
};

export default RequireAuth;
