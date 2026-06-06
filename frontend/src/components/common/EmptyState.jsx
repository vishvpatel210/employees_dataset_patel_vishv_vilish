import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { InboxOutlined } from '@mui/icons-material';

const EmptyState = ({ title = 'No data found', description = 'There are no records to display.', actionLabel, onAction, icon }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        color: 'text.secondary',
      }}
    >
      {icon || <InboxOutlined sx={{ fontSize: 64, mb: 2, opacity: 0.4 }} />}
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, textAlign: 'center' }}>
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
