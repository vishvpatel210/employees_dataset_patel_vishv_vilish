import { Outlet, Link } from 'react-router-dom';
import { Box, Paper, Typography } from '@mui/material';
import { Users } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(ellipse at top left, rgba(59,130,246,0.1) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(139,92,246,0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-3 mb-8 no-underline">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-200">
            <Users size={28} className="text-white" />
          </div>
          <Typography variant="h4" fontWeight={800} sx={{ color: '#1e293b', letterSpacing: '-0.02em' }}>
            Employee<span className="text-blue-600">Sphere</span>
          </Typography>
        </Link>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'rgba(255,255,255,0.8)',
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
            overflow: 'hidden',
          }}
        >
          <Outlet />
        </Paper>
        <Typography variant="body2" align="center" sx={{ mt: 4, color: 'text.secondary' }}>
          &copy; {new Date().getFullYear()} EmployeeSphere. All rights reserved.
        </Typography>
      </div>
    </div>
  );
};

export default AuthLayout;
