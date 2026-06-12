import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { fetchProfile, clearError } from '../store/slices/authSlice';
import { AUTH_PATHS } from '../utils/constants';

const RequireAuth = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, token, user, loading, error } = useSelector((state) => state.auth);
  const [profileAttempted, setProfileAttempted] = useState(false);

  useEffect(() => {
    if (token && !user && !loading && !profileAttempted) {
      setProfileAttempted(true);
      dispatch(fetchProfile());
    }
  }, [dispatch, token, user, loading, profileAttempted]);

  if (!isAuthenticated) {
    return <Navigate to={AUTH_PATHS.LOGIN} state={{ from: location }} replace />;
  }

  if (token && !user) {
    if (error) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: 2,
          }}
        >
          <Typography variant="h6" color="error" fontWeight={600}>
            Session Error
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {typeof error === 'string' ? error : 'Failed to verify session. Please login again.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              dispatch(clearError());
              localStorage.removeItem('esphere_token');
              localStorage.removeItem('esphere_user');
              window.location.href = '/auth/login';
            }}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Go to Login
          </Button>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Verifying session...
        </Typography>
      </Box>
    );
  }

  return <Outlet />;
};

export default RequireAuth;
