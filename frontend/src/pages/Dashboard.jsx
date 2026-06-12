import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Skeleton } from '@mui/material';
import { Users, FolderKanban, TrendingUp } from 'lucide-react';
import { getEmployeeCount, getProjectCount, getAverageExperience } from '../services/analyticsService';
import TopSkillsChart from './Analytics/TopSkillsChart';
import DomainDistributionChart from './Analytics/DomainDistributionChart';

const StatCard = ({ title, value, icon: Icon, color, bgColor, loading }) => (
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
        color,
        flexShrink: 0,
      }}
    >
      <Icon size={24} />
    </Box>
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ textTransform: 'uppercase' }}>
        {title}
      </Typography>
      {loading ? (
        <Skeleton variant="text" width={60} height={32} />
      ) : (
        <Typography variant="h5" fontWeight={700} color="text.primary">
          {value}
        </Typography>
      )}
    </Box>
  </Paper>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    employees: null,
    projects: null,
    avgExperience: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [empRes, projRes, expRes] = await Promise.all([
          getEmployeeCount(),
          getProjectCount(),
          getAverageExperience()
        ]);
        
        setStats({
          employees: empRes.data?.data || 0,
          projects: projRes.data?.data || 0,
          avgExperience: expRes.data?.data || 0,
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={700}>
          Dashboard Overview
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Quick summary of your organization
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard 
            title="Total Employees" 
            value={stats.employees} 
            icon={Users} 
            color="#2563eb" 
            bgColor="#eff6ff"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard 
            title="Total Projects" 
            value={stats.projects} 
            icon={FolderKanban} 
            color="#7c3aed" 
            bgColor="#f5f3ff"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard 
            title="Avg Experience" 
            value={`${Number(stats.avgExperience).toFixed(1)} yrs`} 
            icon={TrendingUp} 
            color="#059669" 
            bgColor="#ecfdf5"
            loading={loading}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
        <TopSkillsChart />
        <DomainDistributionChart />
      </Box>
    </Box>
  );
};

export default Dashboard;
