import { Box, Typography, Button } from '@mui/material';
import { InboxOutlined, SearchOff, Error as ErrorIcon, CloudOff } from '@mui/icons-material';

const icons = {
  inbox: InboxOutlined,
  search: SearchOff,
  error: ErrorIcon,
  offline: CloudOff,
};

const EmptyState = ({
  title = 'No data found',
  description = 'There are no records to display.',
  actionLabel,
  onAction,
  icon: customIcon,
  iconType = 'inbox',
  size = 'medium',
  sx,
}) => {
  const IconComponent = customIcon || icons[iconType] || icons.inbox;

  const iconSizes = {
    small: { icon: 48, spacing: 1.5 },
    medium: { icon: 64, spacing: 2 },
    large: { icon: 80, spacing: 3 },
  };

  const { icon: iconSize, spacing: iconSpacing } = iconSizes[size] || iconSizes.medium;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: size === 'small' ? 4 : 8,
        px: 2,
        color: 'text.secondary',
        ...sx,
      }}
    >
      <IconComponent
        sx={{
          fontSize: iconSize,
          mb: iconSpacing,
          opacity: 0.35,
        }}
        color="inherit"
      />
      <Typography
        variant={size === 'small' ? 'body1' : 'h6'}
        fontWeight={600}
        gutterBottom
        color="text.primary"
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: actionLabel && onAction ? 3 : 0,
          maxWidth: 400,
          textAlign: 'center',
        }}
      >
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button
          variant="contained"
          onClick={onAction}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export const SearchEmptyState = (props) => (
  <EmptyState
    iconType="search"
    title="No results found"
    description="Try adjusting your search terms or filters."
    {...props}
  />
);

export const ErrorEmptyState = (props) => (
  <EmptyState
    iconType="error"
    title="Something went wrong"
    description="An error occurred while loading data."
    {...props}
  />
);

export const OfflineEmptyState = (props) => (
  <EmptyState
    iconType="offline"
    title="No internet connection"
    description="Please check your network connection and try again."
    {...props}
  />
);

export default EmptyState;
