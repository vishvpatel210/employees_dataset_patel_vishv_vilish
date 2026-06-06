import { Box, Skeleton, Card, CardContent } from '@mui/material';

export const TableSkeleton = ({ rows = 5 }) => (
  <Box>
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} variant="rectangular" height={48} sx={{ mb: 1, borderRadius: 1 }} />
    ))}
  </Box>
);

export const CardSkeleton = ({ count = 3 }) => (
  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
    {Array.from({ length: count }).map((_, i) => (
      <Card key={i} sx={{ minWidth: 240, flex: 1 }}>
        <CardContent>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="40%" height={40} sx={{ mt: 1 }} />
          <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    ))}
  </Box>
);

export const ChartSkeleton = () => (
  <Card>
    <CardContent>
      <Skeleton variant="text" width="30%" height={28} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 1 }} />
    </CardContent>
  </Card>
);
