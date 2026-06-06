import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Typography, Paper, Switch, Divider, Button, Avatar,
} from '@mui/material';
import { Sun, Moon, Palette, Lock, User, Shield, LogOut } from 'lucide-react';
import { toggleTheme } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { getInitials } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';
import ChangePasswordDialog from '../Profile/ChangePasswordDialog';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);
  const isDark = theme === 'dark';
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
    toast.success(isDark ? 'Light mode enabled' : 'Dark mode enabled');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login', { replace: true });
  };

  const SettingRow = ({ icon, title, description, action }) => (
    <Box
      sx={{
        display: 'flex', alignItems: 'center', gap: 2.5, py: 2.5,
        '&:not(:last-child)': { borderBottom: '1px solid', borderColor: 'divider' },
      }}
    >
      <Box sx={{ color: isDark ? 'grey.500' : 'grey.400', display: 'flex', flexShrink: 0 }}>
        {icon}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={600}>{title}</Typography>
        <Typography variant="caption" color="text.secondary">{description}</Typography>
      </Box>
      {action}
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>Settings</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage your application preferences
      </Typography>

      {/* Account Summary */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
          <Avatar
            sx={{
              width: 52, height: 52, fontSize: '1.1rem', fontWeight: 700,
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            }}
          >
            {getInitials(user?.name || user?.email || 'U')}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={600}>{user?.name || 'User'}</Typography>
            <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
            <Typography variant="caption" color="text.secondary">Role: {user?.role || 'User'}</Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            startIcon={<User size={16} />}
            onClick={() => navigate('/profile')}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            View Profile
          </Button>
        </Box>
      </Paper>

      {/* Appearance */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Palette size={20} />
          <Typography variant="h6" fontWeight={600}>Appearance</Typography>
        </Box>
        <Divider sx={{ mb: 1 }} />

        <SettingRow
          icon={isDark ? <Moon size={20} /> : <Sun size={20} />}
          title={isDark ? 'Dark Mode' : 'Light Mode'}
          description="Toggle between light and dark themes"
          action={
            <Switch
              checked={isDark}
              onChange={handleThemeToggle}
              color="primary"
            />
          }
        />
      </Paper>

      {/* Security */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Lock size={20} />
          <Typography variant="h6" fontWeight={600}>Security</Typography>
        </Box>
        <Divider sx={{ mb: 1 }} />

        <SettingRow
          icon={<Lock size={20} />}
          title="Change Password"
          description="Update your account password"
          action={
            <Button
              variant="outlined"
              size="small"
              onClick={() => setPasswordDialogOpen(true)}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Update
            </Button>
          }
        />
      </Paper>

      {/* Account */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Shield size={20} />
          <Typography variant="h6" fontWeight={600}>Account</Typography>
        </Box>
        <Divider sx={{ mb: 1 }} />

        <SettingRow
          icon={<LogOut size={20} />}
          title="Sign Out"
          description="Log out of your account on this device"
          action={
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={handleLogout}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Logout
            </Button>
          }
        />
      </Paper>

      <ChangePasswordDialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
      />
    </Box>
  );
};

export default SettingsPage;
