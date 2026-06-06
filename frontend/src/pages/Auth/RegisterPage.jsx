import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Divider,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import { Eye, EyeOff, UserPlus, Check, X } from 'lucide-react';
import { register, clearError } from '../../store/slices/authSlice';
import { registerSchema } from '../../utils/validators';
import { AUTH_PATHS } from '../../utils/constants';

const strengthConfig = {
  colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'],
  labels: ['Weak', 'Fair', 'Good', 'Strong', 'Very strong'],
};

const getStrength = (pw) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
};

const PasswordStrength = ({ value }) => {
  const level = useMemo(() => getStrength(value || ''), [value]);
  if (!value) return null;
  return (
    <Box sx={{ mb: 2.5 }}>
      <LinearProgress
        variant="determinate"
        value={((level + 1) / 5) * 100}
        sx={{
          height: 4,
          borderRadius: 2,
          bgcolor: 'rgba(0,0,0,0.06)',
          '& .MuiLinearProgress-bar': { bgcolor: strengthConfig.colors[level], transition: '0.3s' },
        }}
      />
      <Typography
        variant="caption"
        color={strengthConfig.colors[level]}
        sx={{ mt: 0.5, display: 'block', fontWeight: 500 }}
      >
        {strengthConfig.labels[level]}
      </Typography>
    </Box>
  );
};

const PasswordRequirement = ({ met, label }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
    {met ? <Check size={14} style={{ color: '#22c55e' }} /> : <X size={14} style={{ color: '#94a3b8' }} />}
    <Typography variant="caption" color={met ? 'success.main' : 'text.disabled'}>
      {label}
    </Typography>
  </Box>
);

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(
      register({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      })
    ).finally(() => setSubmitting(false));
  };

  return (
    <Box sx={{ p: { xs: 3, sm: 4 } }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
        Create account
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Join EmployeeSphere to manage your workforce
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => dispatch(clearError())}>
          {typeof error === 'string' ? error : 'Registration failed'}
        </Alert>
      )}

      <Formik
        initialValues={{ name: '', email: '', password: '', confirmPassword: '', role: 'User' }}
        validationSchema={registerSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting, setFieldValue, values }) => (
          <Form>
            <Field name="name">
              {({ field }) => (
                <TextField
                  {...field}
                  label="Full Name"
                  fullWidth
                  size="medium"
                  autoFocus
                  autoComplete="name"
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  sx={{ mb: 2.5 }}
                  slotProps={{
                    input: { sx: { borderRadius: 2, bgcolor: 'rgba(0,0,0,0.02)' } },
                  }}
                />
              )}
            </Field>
            <Field name="email">
              {({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  fullWidth
                  size="medium"
                  autoComplete="email"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ mb: 2.5 }}
                  slotProps={{
                    input: { sx: { borderRadius: 2, bgcolor: 'rgba(0,0,0,0.02)' } },
                  }}
                />
              )}
            </Field>
            <Field name="password">
              {({ field }) => (
                <TextField
                  {...field}
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  size="medium"
                  autoComplete="new-password"
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ mb: 0.5 }}
                  slotProps={{
                    input: {
                      sx: { borderRadius: 2, bgcolor: 'rgba(0,0,0,0.02)' },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword((p) => !p)} edge="end" size="small" tabIndex={-1}>
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            </Field>
            <PasswordStrength value={values.password} />
            <Box sx={{ mb: 2.5, pl: 0.5 }}>
              <PasswordRequirement met={values.password.length >= 8} label="At least 8 characters" />
              <PasswordRequirement met={/[a-z]/.test(values.password)} label="One lowercase letter" />
              <PasswordRequirement met={/[A-Z]/.test(values.password)} label="One uppercase letter" />
              <PasswordRequirement met={/[0-9]/.test(values.password)} label="One number" />
            </Box>
            <Field name="confirmPassword">
              {({ field }) => (
                <TextField
                  {...field}
                  label="Confirm Password"
                  type={showConfirm ? 'text' : 'password'}
                  fullWidth
                  size="medium"
                  autoComplete="new-password"
                  error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  sx={{ mb: 2.5 }}
                  slotProps={{
                    input: {
                      sx: { borderRadius: 2, bgcolor: 'rgba(0,0,0,0.02)' },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirm((p) => !p)} edge="end" size="small" tabIndex={-1}>
                            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            </Field>
            <Field name="role">
              {({ field }) => (
                <FormControl fullWidth size="medium" sx={{ mb: 3 }}>
                  <InputLabel sx={{ borderRadius: 2 }}>Role</InputLabel>
                  <Select
                    {...field}
                    label="Role"
                    sx={{ borderRadius: 2, bgcolor: 'rgba(0,0,0,0.02)' }}
                    onChange={(e) => setFieldValue('role', e.target.value)}
                  >
                    <MenuItem value="User">User</MenuItem>
                    <MenuItem value="Employee">Employee</MenuItem>
                    <MenuItem value="HR">HR</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                  </Select>
                  {touched.role && errors.role && <FormHelperText error>{errors.role}</FormHelperText>}
                </FormControl>
              )}
            </Field>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isSubmitting || loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1d4ed8, #6d28d9)',
                  boxShadow: '0 6px 20px rgba(37,99,235,0.4)',
                },
              }}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <UserPlus size={20} />}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </Form>
        )}
      </Formik>

      <Divider sx={{ my: 3 }}>
        <Typography variant="caption" color="text.secondary">
          OR
        </Typography>
      </Divider>

      <Typography variant="body2" align="center" color="text.secondary">
        Already have an account?{' '}
        <Link to={AUTH_PATHS.LOGIN} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
          Sign in
        </Link>
      </Typography>
    </Box>
  );
};

export default RegisterPage;
