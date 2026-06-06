import { Component } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          reset: this.handleReset,
        });
      }

      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: this.props.minHeight || '100vh',
            p: 4,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 6,
              maxWidth: 480,
              textAlign: 'center',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'error.light',
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                bgcolor: 'error.50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <AlertTriangle size={36} color="#ef4444" />
            </Box>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
              Something went wrong
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, maxWidth: 360, mx: 'auto' }}>
              An unexpected error occurred. Please try again or contact support if the problem persists.
            </Typography>
            {this.props.showDetails && this.state.error && (
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mb: 3,
                  p: 2,
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  color: 'error.main',
                  wordBreak: 'break-word',
                  maxHeight: 120,
                  overflow: 'auto',
                }}
              >
                {this.state.error.message || this.state.error.toString()}
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                startIcon={<RefreshCw size={16} />}
                onClick={this.handleReset}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              >
                Try Again
              </Button>
              <Button
                variant="outlined"
                startIcon={<Home size={16} />}
                onClick={this.handleReload}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Reload Page
              </Button>
            </Box>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
