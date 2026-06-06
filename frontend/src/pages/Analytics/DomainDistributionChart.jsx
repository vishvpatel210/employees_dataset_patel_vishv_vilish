import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Skeleton } from '@mui/material';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
} from 'recharts';
import { getDomainDistribution } from '../../services/analyticsService';

const COLORS = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2', '#db2777', '#65a30d', '#0d9488', '#9333ea'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Paper elevation={3} sx={{ px: 2, py: 1.5, borderRadius: 1.5 }}>
        <Typography variant="body2" fontWeight={600}>{payload[0].name}</Typography>
        <Typography variant="body2" color="primary.main" fontWeight={600}>
          {payload[0].value} ({((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}%)
        </Typography>
      </Paper>
    );
  }
  return null;
};

const DomainDistributionChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getDomainDistribution();
        const items = res.data?.data ?? [];
        const total = items.reduce((sum, item) => sum + item.count, 0);
        setData(
          items.slice(0, 8).map((item) => ({
            name: item._id || 'Unknown',
            value: item.count,
            total,
          }))
        );
      } catch {
        setData([]);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center', mt: 2 }}>
        {payload.map((entry, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: entry.color }} />
            <Typography variant="caption" color="text.secondary">{entry.value}</Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>Domain Distribution</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Breakdown of employee domains</Typography>
      {loading ? (
        <Skeleton variant="circular" width={280} height={280} sx={{ mx: 'auto' }} />
      ) : data.length === 0 ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 350 }}>
          <Typography color="text.secondary">No data available</Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

export default DomainDistributionChart;
