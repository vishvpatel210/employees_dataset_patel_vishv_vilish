import { Outlet, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Paper, Typography, useMediaQuery } from '@mui/material';
import { Users } from 'lucide-react';

const AuthLayout = () => {
  const theme = useSelector((state) => state.ui.theme);
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        isDark
          ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900'
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}
    >
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDark
            ? 'radial-gradient(ellipse at top left, rgba(59,130,246,0.08) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(139,92,246,0.08) 0%, transparent 50%)'
            : 'radial-gradient(ellipse at top left, rgba(59,130,246,0.1) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(139,92,246,0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-3 mb-8 no-underline">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-200">
            <Users size={28} className="text-white" />
          </div>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{ letterSpacing: '-0.02em', color: isDark ? '#f1f5f9' : '#1e293b' }}
          >
            Employee<span className="text-blue-600">Sphere</span>
          </Typography>
        </Link>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.8)',
            background: isDark ? 'rgba(30,41,59,0.85)' : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(20px)',
            boxShadow: isDark ? '0 25px 50px -12px rgba(0,0,0,0.5)' : '0 25px 50px -12px rgba(0,0,0,0.15)',
            overflow: 'hidden',
          }}
        >
          <Outlet context={{ isDark }} />
        </Paper>
        <Typography variant="body2" align="center" sx={{ mt: 4, color: isDark ? '#94a3b8' : 'text.secondary' }}>
          &copy; {new Date().getFullYear()} EmployeeSphere. All rights reserved.
        </Typography>
      </div>
    </div>
  );
};

export default AuthLayout;
