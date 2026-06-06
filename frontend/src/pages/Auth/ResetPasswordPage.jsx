import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Eye, EyeOff, KeyRound } from 'lucide-react';
import { resetPasswordAction, clearError, clearSuccess } from '../../store/slices/authSlice';
import { resetPasswordSchema } from '../../utils/validators';
import { AUTH_PATHS } from '../../utils/constants';

const ResetPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loading, error, successMessage } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => navigate(AUTH_PATHS.LOGIN, { replace: true }), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate]);

  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(resetPasswordAction({
      token: token || undefined,
      password: values.password,
    })).finally(() => {
      setSubmitting(false);
    });
  };

  return (
    <Box sx={{ p: { xs: 3, sm: 4 } }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
        Reset password
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter your new password below.
      </Typography>

      {!token && (
        <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
          Invalid or missing reset token. Please request a new password reset.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => dispatch(clearError())}>
          {typeof error === 'string' ? error : 'Reset failed'}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
          {successMessage}. Redirecting to login...
        </Alert>
      )}

      <Formik
        initialValues={{ password: '', confirmPassword: '' }}
        validationSchema={resetPasswordSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Field name="password">
              {({ field }) => (
                <TextField
                  {...field}
                  label="New Password"
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
                  label="Confirm New Password"
                  type={showConfirm ? 'text' : 'password'}
                  fullWidth
                  size="medium"
                  error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  sx={{ mb: 3 }}
                  slotProps={{
                    input: {
                      sx: { borderRadius: 2, bgcolor: 'rgba(0,0,0,0.02)' },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end" size="small">
                            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            </Field>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isSubmitting || loading || !token}
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
              startIcon={<KeyRound size={20} />}
            >
              {loading ? 'Resetting...' : 'Reset password'}
            </Button>
          </Form>
        )}
      </Formik>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Link
          to={AUTH_PATHS.LOGIN}
          style={{
            color: '#2563eb',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
          }}
        >
          Back to sign in
        </Link>
      </Box>
    </Box>
  );
};

export default ResetPasswordPage;
