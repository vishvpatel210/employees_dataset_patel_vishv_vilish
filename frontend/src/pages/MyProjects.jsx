import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from '@mui/material';
import { getTasks } from '../services/taskService';
import { getProjects } from '../services/projectService';
import { FolderKanban, Calendar } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';

const MyProjects = () => {
  const { user } = useSelector((state) => state.auth);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMyProjects = useCallback(async () => {
    try {
      setLoading(true);
      const [tasksRes, projectsRes] = await Promise.all([getTasks(), getProjects()]);
      const allTasks = tasksRes.data?.data || tasksRes.data?.tasks || [];
      const allProjects = projectsRes.data?.data || projectsRes.data?.projects || [];
      
      // Match by the exact User ID reference, fallback to name matching (case-insensitive)
      const myTasks = allTasks.filter(t => {
        const isUserMatch = t.assignedTo?.user === user?._id || t.assignedTo?.user?._id === user?._id;
        const isNameMatch = (t.assignedTo?.name || '').toLowerCase().trim() === (user?.name || '').toLowerCase().trim();
        return isUserMatch || isNameMatch;
      });
      
      const uniqueProjectsMap = {};
      myTasks.forEach(task => {
        if (task.project && !uniqueProjectsMap[task.project._id]) {
          uniqueProjectsMap[task.project._id] = task.project;
        }
      });
      
      // Also include all projects for Admin/HR, or projects that exist in the system
      allProjects.forEach(project => {
        if (!uniqueProjectsMap[project._id]) {
          uniqueProjectsMap[project._id] = project;
        }
      });
      
      setProjects(Object.values(uniqueProjectsMap));
    } catch (err) {
      setError('Failed to load your projects.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadMyProjects();
  }, [loadMyProjects]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  if (error) return <ErrorState message={error} onRetry={loadMyProjects} />;

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>My Projects</Typography>
        <Typography variant="body2" color="text.secondary">
          Projects you are currently contributing to.
        </Typography>
      </Box>

      {projects.length === 0 ? (
        <EmptyState 
          title="No projects found" 
          description="You are not currently assigned to any tasks in a project." 
        />
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project._id || project.id}>
              <Card 
                elevation={0} 
                sx={{ 
                  borderRadius: 3, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  transition: 'transform 0.2s ease',
                  '&:hover': { transform: 'translateY(-2px)', borderColor: 'primary.light' }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box 
                      sx={{ 
                        w: 48, h: 48, 
                        bgcolor: 'primary.50', 
                        color: 'primary.main', 
                        borderRadius: 2, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        p: 1.5
                      }}
                    >
                      <FolderKanban size={24} />
                    </Box>
                    <Chip label="Active" size="small" color="success" sx={{ fontWeight: 600 }} />
                  </Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {project.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mt: 2 }}>
                    <Calendar size={16} />
                    <Typography variant="caption" fontWeight={500}>
                      Since {formatDate(project.createdAt || Date.now())}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MyProjects;
