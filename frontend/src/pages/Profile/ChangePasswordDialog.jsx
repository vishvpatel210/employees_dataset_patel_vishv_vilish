import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Typography, TextField, InputAdornment, IconButton, CircularProgress,
} from '@mui/material';
import { Eye, EyeOff, Lock, KeyRound } from 'lucide-react';
import { changePassword } from '../../services/authService';
import toast from 'react-hot-toast';

const ChangePasswordDialog = ({ open, onClose }) => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.currentPassword) errs.currentPassword = 'Current password is required';
    if (!form.newPassword) errs.newPassword = 'New password is required';
    else if (form.newPassword.length < 6) errs.newPassword = 'Must be at least 6 characters';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.newPassword !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success('Password changed successfully');
      onClose();
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
    setSubmitting(false);
  };

  const handleClose = () => {
    if (!submitting) {
      onClose();
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" fontWeight={700}>Change Password</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Enter your current password and a new password
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <TextField
          fullWidth
          size="small"
          label="Current Password"
          type={show.current ? 'text' : 'password'}
          value={form.currentPassword}
          onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
          error={!!errors.currentPassword}
          helperText={errors.currentPassword}
          sx={{ mb: 2.5 }}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start"><Lock size={18} /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShow({ ...show, current: !show.current })} edge="end">
                    {show.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: 2 },
            },
          }}
        />

        <TextField
          fullWidth
          size="small"
          label="New Password"
          type={show.new ? 'text' : 'password'}
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          error={!!errors.newPassword}
          helperText={errors.newPassword}
          sx={{ mb: 2.5 }}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start"><KeyRound size={18} /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShow({ ...show, new: !show.new })} edge="end">
                    {show.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: 2 },
            },
          }}
        />

        <TextField
          fullWidth
          size="small"
          label="Confirm New Password"
          type={show.confirm ? 'text' : 'password'}
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start"><KeyRound size={18} /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShow({ ...show, confirm: !show.confirm })} edge="end">
                    {show.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: 2 },
            },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={submitting}
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          {submitting ? <CircularProgress size={20} /> : 'Change Password'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordDialog;
