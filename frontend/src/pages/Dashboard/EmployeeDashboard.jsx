import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Paper, Grid, Skeleton } from '@mui/material';
import { CheckSquare, FolderKanban, Clock } from 'lucide-react';
import { getTasks } from '../../services/taskService';

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

const EmployeeDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!user?._id && !user?.id) return;
        const res = await getTasks({ assignedTo: user._id || user.id });
        const tasks = res.data?.data || res.data?.tasks || [];
        
        setStats({
          totalTasks: tasks.length,
          pendingTasks: tasks.filter(t => t.status === 'pending' || !t.status).length,
          completedTasks: tasks.filter(t => t.status === 'completed').length,
        });
      } catch (err) {
        console.error('Failed to fetch employee dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={700}>
          Welcome, {user?.name?.split(' ')[0] || 'Employee'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Here is the summary of your assigned work
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard 
            title="Total Assigned Tasks" 
            value={stats.totalTasks} 
            icon={FolderKanban} 
            color="#2563eb" 
            bgColor="#eff6ff"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard 
            title="Pending Tasks" 
            value={stats.pendingTasks} 
            icon={Clock} 
            color="#d97706" 
            bgColor="#fffbeb"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard 
            title="Completed Tasks" 
            value={stats.completedTasks} 
            icon={CheckSquare} 
            color="#059669" 
            bgColor="#ecfdf5"
            loading={loading}
          />
        </Grid>
      </Grid>

      <Paper 
        elevation={0}
        sx={{ 
          p: 8, 
          borderRadius: 2, 
          border: '1px solid', 
          borderColor: 'divider',
          minHeight: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography color="text.secondary">
          Detailed task breakdown and recent activities will appear here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default EmployeeDashboard;
