import React, { useEffect } from 'react';
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
} from '@mui/material';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { register, clearError } from '../../store/slices/authSlice';
import { registerSchema } from '../../utils/validators';
import { AUTH_PATHS } from '../../utils/constants';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = React.useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(register({
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.role,
    })).finally(() => {
      setSubmitting(false);
    });
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
        {({ errors, touched, isSubmitting, setFieldValue }) => (
          <Form>
            <Field name="name">
              {({ field }) => (
                <TextField
                  {...field}
                  label="Full Name"
                  fullWidth
                  size="medium"
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
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ mb: 2.5 }}
                  slotProps={{
                    input: {
                      sx: { borderRadius: 2, bgcolor: 'rgba(0,0,0,0.02)' },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            </Field>
            <Field name="confirmPassword">
              {({ field }) => (
                <TextField
                  {...field}
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  size="medium"
                  error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  sx={{ mb: 2.5 }}
                  slotProps={{
                    input: { sx: { borderRadius: 2, bgcolor: 'rgba(0,0,0,0.02)' } },
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
                  {touched.role && errors.role && (
                    <FormHelperText error>{errors.role}</FormHelperText>
                  )}
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
              startIcon={<UserPlus size={20} />}
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
        <Link
          to={AUTH_PATHS.LOGIN}
          style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}
        >
          Sign in
        </Link>
      </Typography>
    </Box>
  );
};

export default RegisterPage;
