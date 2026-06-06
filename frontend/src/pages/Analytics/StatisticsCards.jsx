import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Skeleton } from '@mui/material';
import { Users, FolderKanban, CheckSquare, Briefcase, Globe, Award } from 'lucide-react';
import {
  getEmployeeCount,
  getProjectCount,
  getTaskCount,
  getAverageExperience,
  getCountryCount,
  getCertificationCount,
} from '../../services/analyticsService';

const statCards = [
  { label: 'Total Employees', icon: Users, color: '#2563eb', bgColor: '#eff6ff', getter: getEmployeeCount, suffix: '' },
  {
    label: 'Total Projects',
    icon: FolderKanban,
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    getter: getProjectCount,
    suffix: '',
  },
  { label: 'Total Tasks', icon: CheckSquare, color: '#059669', bgColor: '#ecfdf5', getter: getTaskCount, suffix: '' },
  {
    label: 'Avg Experience',
    icon: Briefcase,
    color: '#d97706',
    bgColor: '#fffbeb',
    getter: getAverageExperience,
    suffix: ' yrs',
    decimals: 1,
  },
  { label: 'Countries', icon: Globe, color: '#dc2626', bgColor: '#fef2f2', getter: getCountryCount, suffix: '' },
  {
    label: 'Certifications',
    icon: Award,
    color: '#0891b2',
    bgColor: '#ecfeff',
    getter: getCertificationCount,
    suffix: '',
  },
];

const StatCard = ({ label, icon: Icon, color, bgColor, value, loading }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'divider',
      display: 'flex',
      alignItems: 'center',
      gap: 2.5,
      transition: 'all 0.2s',
      '&:hover': { borderColor: color, boxShadow: `0 4px 12px ${color}15` },
    }}
  >
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: bgColor,
        color: color,
        flexShrink: 0,
      }}
    >
      <Icon size={22} />
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={500}
        sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
      >
        {label}
      </Typography>
      {loading ? (
        <Skeleton variant="text" width={80} height={32} />
      ) : (
        <Typography variant="h5" fontWeight={700} color="text.primary" sx={{ mt: 0.25 }}>
          {value}
        </Typography>
      )}
    </Box>
  </Paper>
);

const StatisticsCards = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const results = {};
      const entries = statCards.map(async (card) => {
        try {
          const res = await card.getter();
          const raw = res.data?.data ?? res.data;
          results[card.label] = raw;
        } catch {
          results[card.label] = null;
        }
      });
      await Promise.all(entries);
      setData(results);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const formatValue = (card, val) => {
    if (val == null) return '--';
    if (typeof val === 'number') {
      if (Array.isArray(val)) return val.length;
      return card.decimals ? val.toFixed(card.decimals) : val;
    }
    if (Array.isArray(val)) return val.length;
    return val;
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 2.5 }}>
      {statCards.map((card) => (
        <StatCard key={card.label} {...card} value={formatValue(card, data[card.label])} loading={loading} />
      ))}
    </Box>
  );
};

export default StatisticsCards;
