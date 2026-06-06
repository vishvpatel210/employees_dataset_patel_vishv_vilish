import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Typography, Button } from '@mui/material';

const RoleBasedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 2,
        }}
      >
        <Typography variant="h5" fontWeight={700} color="text.secondary">
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You do not have permission to view this page.
        </Typography>
        <Button variant="contained" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </Box>
    );
  }

  return <Outlet />;
};

export default RoleBasedRoute;
