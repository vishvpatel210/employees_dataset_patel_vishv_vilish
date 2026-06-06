import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Skeleton } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { getExperienceAnalysis } from '../../services/analyticsService';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper elevation={3} sx={{ px: 2, py: 1.5, borderRadius: 1.5 }}>
        <Typography variant="body2" fontWeight={600}>{label} years</Typography>
        <Typography variant="body2" color="primary.main" fontWeight={600}>
          {payload[0].value} employee{payload[0].value !== 1 ? 's' : ''}
        </Typography>
      </Paper>
    );
  }
  return null;
};

const ExperienceAnalytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getExperienceAnalysis();
        const items = res.data?.data ?? [];
        setData(
          items.map((item) => ({
            years: item._id,
            count: item.count,
          }))
        );
      } catch {
        setData([]);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>Experience Analytics</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Distribution of employee experience (years)</Typography>
      {loading ? (
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 1 }} />
      ) : data.length === 0 ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
          <Typography color="text.secondary">No data available</Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="years" tick={{ fontSize: 12 }} label={{ value: 'Years of Experience', position: 'insideBottomRight', offset: -5, style: { fontSize: 12, fill: '#94a3b8' } }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

export default ExperienceAnalytics;
