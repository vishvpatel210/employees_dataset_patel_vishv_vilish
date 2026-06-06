import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Typography, Paper, Avatar, TextField, Button, Divider,
  IconButton, Tooltip, Skeleton,
} from '@mui/material';
import { Edit2, Save, X, Mail, User, Shield, Calendar } from 'lucide-react';
import { getInitials } from '../../utils/helpers';
import { updateProfileAction } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);
  const isDark = theme === 'dark';

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Name is required');
      return;
    }
    try {
      await dispatch(updateProfileAction({ name: form.name.trim() })).unwrap();
      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (err) {
      toast.error(err || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setForm({ name: user?.name || '', email: user?.email || '' });
    setEditing(false);
  };

  const infoRow = (icon, label, value) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5 }}>
      <Box sx={{ color: isDark ? 'grey.500' : 'grey.400', display: 'flex' }}>{icon}</Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={500}>{label}</Typography>
        <Typography variant="body2" fontWeight={600}>{value || '--'}</Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>My Profile</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage your personal information
      </Typography>

      <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
        {/* Header */}
        <Box
          sx={{
            position: 'relative',
            p: 4, pb: 0,
            background: isDark
              ? 'linear-gradient(135deg, #1e3a5f, #1e293b)'
              : 'linear-gradient(135deg, #eff6ff, #f0f0ff)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, flexWrap: 'wrap' }}>
            <Avatar
              sx={{
                width: 80, height: 80, fontSize: '1.75rem', fontWeight: 700,
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                border: '4px solid',
                borderColor: isDark ? '#1e293b' : '#fff',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }}
            >
              {getInitials(user?.name || user?.email || 'U')}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0, pb: 3 }}>
              {editing ? (
                <TextField
                  size="small"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  fullWidth
                  sx={{ maxWidth: 320, mb: 1 }}
                  slotProps={{ input: { sx: { borderRadius: 2, fontWeight: 600, fontSize: '1.1rem' } } }}
                />
              ) : (
                <Typography variant="h5" fontWeight={700}>{user?.name || 'User'}</Typography>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <Shield size={14} />
                <Typography variant="body2" color="text.secondary">{user?.role || 'User'}</Typography>
              </Box>
            </Box>
            <Tooltip title={editing ? 'Cancel' : 'Edit profile'}>
              <IconButton
                onClick={editing ? handleCancel : () => setEditing(true)}
                size="small"
                sx={{
                  bgcolor: isDark ? 'grey.800' : 'grey.100',
                  '&:hover': { bgcolor: isDark ? 'grey.700' : 'grey.200' },
                }}
              >
                {editing ? <X size={18} /> : <Edit2 size={18} />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ p: 4 }}>
          {/* Contact Information */}
          <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', mb: 2 }}>
            Contact Information
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 0 }}>
            {infoRow(<Mail size={18} />, 'Email', user?.email)}
            {infoRow(<User size={18} />, 'Name', user?.name)}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Account Information */}
          <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', mb: 2 }}>
            Account Information
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 0 }}>
            {infoRow(<Shield size={18} />, 'Role', user?.role)}
            {infoRow(<Calendar size={18} />, 'Member Since', '--')}
          </Box>

          {editing && (
            <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<Save size={16} />}
                onClick={handleSave}
                disabled={loading}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ProfilePage;
