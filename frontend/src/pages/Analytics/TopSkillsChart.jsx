import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Skeleton } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { getTopSkills } from '../../services/analyticsService';

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper elevation={3} sx={{ px: 2, py: 1.5, borderRadius: 1.5 }}>
        <Typography variant="body2" fontWeight={600}>{label}</Typography>
        <Typography variant="body2" color="primary.main" fontWeight={600}>
          {payload[0].value} employee{payload[0].value !== 1 ? 's' : ''}
        </Typography>
      </Paper>
    );
  }
  return null;
};

const TopSkillsChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getTopSkills();
        const items = res.data?.data ?? [];
        setData(
          items.map((item) => ({
            name: item._id || 'Unknown',
            count: item.count,
          })).reverse()
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
      <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>Top Skills</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Most common primary skills among employees</Typography>
      {loading ? (
        <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 1 }} />
      ) : data.length === 0 ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 350 }}>
          <Typography color="text.secondary">No data available</Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(300, data.length * 40)}>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={120} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={24}>
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

export default TopSkillsChart;
