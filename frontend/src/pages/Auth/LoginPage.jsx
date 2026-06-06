import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
  Divider,
} from '@mui/material';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { login, clearError } from '../../store/slices/authSlice';
import { loginSchema } from '../../utils/validators';
import { AUTH_PATHS } from '../../utils/constants';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = React.useState(false);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(login({ email: values.email, password: values.password })).finally(() => {
      setSubmitting(false);
    });
  };

  return (
    <Box sx={{ p: { xs: 3, sm: 4 } }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
        Welcome back
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Sign in to your EmployeeSphere account
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => dispatch(clearError())}>
          {typeof error === 'string' ? error : 'Authentication failed'}
        </Alert>
      )}

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
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
                    input: {
                      sx: { borderRadius: 2, bgcolor: 'rgba(0,0,0,0.02)' },
                    },
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
                  sx={{ mb: 1 }}
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
            <Box sx={{ textAlign: 'right', mb: 2.5 }}>
              <Link
                to={AUTH_PATHS.FORGOT_PASSWORD}
                style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}
              >
                Forgot password?
              </Link>
            </Box>
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
              startIcon={<LogIn size={20} />}
            >
              {loading ? 'Signing in...' : 'Sign in'}
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
        Don&apos;t have an account?{' '}
        <Link
          to={AUTH_PATHS.REGISTER}
          style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}
        >
          Create one
        </Link>
      </Typography>
    </Box>
  );
};

export default LoginPage;
