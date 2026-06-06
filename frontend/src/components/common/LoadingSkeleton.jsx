import { Box, Skeleton, Card, CardContent } from '@mui/material';

export const TableSkeleton = ({ rows = 5, columns = 5 }) => (
  <Box>
    {Array.from({ length: rows }).map((_, i) => (
      <Box key={i} sx={{ display: 'flex', gap: 2, mb: 1 }}>
        {Array.from({ length: columns }).map((_, j) => (
          <Skeleton
            key={j}
            variant="rectangular"
            height={48}
            sx={{ borderRadius: 1, flex: j === 0 ? 2 : 1 }}
          />
        ))}
      </Box>
    ))}
  </Box>
);

export const CardSkeleton = ({ count = 3 }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: `repeat(${Math.min(count, 2)}, 1fr)`, md: `repeat(${Math.min(count, 4)}, 1fr)` }, gap: 2.5 }}>
    {Array.from({ length: count }).map((_, i) => (
      <Card key={i} sx={{ borderRadius: 2 }} elevation={0}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2.5, p: 3 }}>
          <Skeleton variant="rectangular" width={48} height={48} sx={{ borderRadius: 2, flexShrink: 0 }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="70%" height={14} />
            <Skeleton variant="text" width="40%" height={32} sx={{ mt: 0.5 }} />
          </Box>
        </CardContent>
      </Card>
    ))}
  </Box>
);

export const StatCardSkeleton = CardSkeleton;

export const ChartSkeleton = ({ height = 350 }) => (
  <Card sx={{ borderRadius: 2 }} elevation={0}>
    <CardContent sx={{ p: 3 }}>
      <Skeleton variant="text" width="30%" height={24} sx={{ mb: 0.5 }} />
      <Skeleton variant="text" width="50%" height={16} sx={{ mb: 3 }} />
      <Skeleton variant="rectangular" height={height} sx={{ borderRadius: 1.5 }} />
    </CardContent>
  </Card>
);

export const ListSkeleton = ({ rows = 4, avatar = true }) => (
  <Box>
    {Array.from({ length: rows }).map((_, i) => (
      <Box
        key={i}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          py: 1.5,
          borderBottom: i < rows - 1 ? '1px solid' : 'none',
          borderColor: 'divider',
        }}
      >
        {avatar && <Skeleton variant="circular" width={36} height={36} />}
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="45%" height={16} />
          <Skeleton variant="text" width="65%" height={14} sx={{ mt: 0.25 }} />
        </Box>
        <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1.5 }} />
      </Box>
    ))}
  </Box>
);

export const DetailSkeleton = () => (
  <Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
      <Skeleton variant="circular" width={80} height={80} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="35%" height={28} />
        <Skeleton variant="text" width="20%" height={16} sx={{ mt: 0.5 }} />
      </Box>
    </Box>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Box key={i}>
          <Skeleton variant="text" width="30%" height={12} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" width="60%" height={20} />
        </Box>
      ))}
    </Box>
  </Box>
);

export const PageSkeleton = ({ cards = 4, chart = true, table = false }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
    <Box>
      <Skeleton variant="text" width="25%" height={32} />
      <Skeleton variant="text" width="40%" height={16} sx={{ mt: 0.5 }} />
    </Box>
    {cards > 0 && <CardSkeleton count={cards} />}
    {chart && <ChartSkeleton />}
    {table && <TableSkeleton />}
  </Box>
);
