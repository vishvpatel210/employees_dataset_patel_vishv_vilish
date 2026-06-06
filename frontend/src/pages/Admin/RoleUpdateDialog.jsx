import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
} from '@mui/material';
import { updateUserRole } from '../../services/adminService';
import toast from 'react-hot-toast';
import { ROLES } from '../../utils/constants';

const roleDescriptions = {
  [ROLES.ADMIN]: 'Full system access including user management, settings, and all data.',
  [ROLES.HR]: 'Access to employee management, analytics, and HR-related features.',
  [ROLES.EMPLOYEE]: 'Standard employee access to view and manage their own data.',
  [ROLES.USER]: 'Basic access with limited permissions.',
};

const roleColors = {
  [ROLES.ADMIN]: '#7c3aed',
  [ROLES.HR]: '#059669',
  [ROLES.EMPLOYEE]: '#d97706',
  [ROLES.USER]: '#2563eb',
};

const RoleUpdateDialog = ({ open, onClose, user, onUpdated }) => {
  const [selectedRole, setSelectedRole] = useState(user?.role || ROLES.USER);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user) setSelectedRole(user.role);
  }, [user]);

  const handleSubmit = async () => {
    if (!user || selectedRole === user.role) {
      onClose();
      return;
    }
    setSubmitting(true);
    try {
      await updateUserRole(user._id || user.id, selectedRole);
      toast.success(`Role updated to ${selectedRole}`);
      onUpdated?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
    setSubmitting(false);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" fontWeight={700}>
          Update User Role
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 3,
            mt: 1,
            p: 2,
            bgcolor: 'grey.50',
            borderRadius: 2,
          }}
        >
          <Avatar sx={{ width: 40, height: 40, bgcolor: '#2563eb', fontSize: '0.875rem' }}>
            {(user.name || user.email || '?')
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .substring(0, 2)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {user.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>

        <RadioGroup value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
          {Object.values(ROLES).map((role) => (
            <FormControlLabel
              key={role}
              value={role}
              control={
                <Radio
                  sx={{
                    color: roleColors[role],
                    '&.Mui-checked': { color: roleColors[role] },
                  }}
                />
              }
              label={
                <Box sx={{ ml: 0.5 }}>
                  <Typography variant="body2" fontWeight={600} sx={{ color: roleColors[role] }}>
                    {role}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {roleDescriptions[role]}
                  </Typography>
                </Box>
              }
              sx={{ alignItems: 'flex-start', mb: 1, '& .MuiFormControlLabel-label': { width: '100%' } }}
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2, textTransform: 'none' }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting || selectedRole === user.role}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          {submitting ? <CircularProgress size={20} /> : 'Update Role'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleUpdateDialog;
