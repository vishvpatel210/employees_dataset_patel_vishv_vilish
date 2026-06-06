import { Box, Typography, Button, Paper } from '@mui/material';
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';

const ErrorState = ({
  title = 'Failed to load data',
  message = 'Something went wrong while fetching data.',
  onRetry,
  retryLabel = 'Try Again',
  fullPage = false,
  type = 'error',
}) => {
  const isNetwork = type === 'network';
  const Icon = isNetwork ? WifiOff : AlertTriangle;
  const color = isNetwork ? 'warning' : 'error';
  const bgColor = isNetwork ? 'warning.50' : 'error.50';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: fullPage ? '100vh' : 300,
        p: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          maxWidth: 420,
          textAlign: 'center',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          width: '100%',
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            bgcolor: bgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2.5,
          }}
        >
          <Icon size={28} color={isNetwork ? '#d97706' : '#ef4444'} />
        </Box>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {message}
        </Typography>
        {onRetry && (
          <Button
            variant="contained"
            color={color === 'warning' ? 'warning' : 'primary'}
            startIcon={<RefreshCw size={16} />}
            onClick={onRetry}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            {retryLabel}
          </Button>
        )}
      </Paper>
    </Box>
  );
};

export default ErrorState;
