import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Chip,
  Card,
  CardContent,
  Grid,
  Avatar,
  LinearProgress,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from '@mui/material';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  Clock,
  Star,
  Projector,
  ListTodo,
  Calendar,
  Award,
  Code2,
  Shield,
  Layers,
  User,
} from 'lucide-react';
import { getEmployeeById, getEmployeeStatsById, getEmployeePerformance } from '../services/employeeService';
import { getProjects } from '../services/projectService';
import { getTasks } from '../services/taskService';
import { getInitials, formatDate } from '../utils/helpers';
import EmptyState from '../components/common/EmptyState';
import { CardSkeleton, TableSkeleton } from '../components/common/LoadingSkeleton';

const statusColors = {
  Active: { bg: '#dcfce7', color: '#166534' },
  Inactive: { bg: '#fef3c7', color: '#92400e' },
};

const ratingColors = {
  Outstanding: { color: '#166534', bg: '#dcfce7' },
  'Exceeds Expectations': { color: '#1e40af', bg: '#dbeafe' },
  'Meets Expectations': { color: '#92400e', bg: '#fef3c7' },
  'Needs Improvement': { color: '#991b1b', bg: '#fce4ec' },
};

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [stats, setStats] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const [empRes, allProjectsRes, allTasksRes] = await Promise.all([
          getEmployeeById(id),
          getProjects(),
          getTasks(),
        ]);

        const emp = empRes.data.data || empRes.data.employee || empRes.data;
        setEmployee(emp);

        const allProjects = allProjectsRes.data.data || allProjectsRes.data.projects || [];
        const allTasks = allTasksRes.data.data || allTasksRes.data.tasks || [];

        const empProjectIds = (emp.profile?.projects || []).map((p) => (typeof p === 'string' ? p : p._id || p));
        const empProjects = allProjects.filter((p) => empProjectIds.includes(p._id));
        setProjects(empProjects);

        const empId = emp._id || emp.id;
        const empTasks = allTasks.filter((t) => {
          const assigned = t.assignedTo || {};
          const assignedId = assigned._id || assigned.id || assigned;
          return String(assignedId) === String(empId);
        });
        setTasks(empTasks);

        const [statsRes, perfRes] = await Promise.all([
          getEmployeeStatsById(id).catch(() => null),
          getEmployeePerformance(id).catch(() => null),
        ]);

        if (statsRes?.data?.data) setStats(statsRes.data.data);
        if (perfRes?.data?.data) setPerformance(perfRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load employee details');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const displayData = stats || employee;

  if (loading) {
    return (
      <Box sx={{ spaceY: 4 }}>
        <Button
          onClick={() => navigate('/employees')}
          startIcon={<ArrowLeft size={18} />}
          sx={{ borderRadius: 2, textTransform: 'none', mb: 2 }}
        >
          Back to Employees
        </Button>
        <CardSkeleton count={4} />
        <Box sx={{ mt: 4 }}>
          <TableSkeleton rows={3} />
        </Box>
        <Box sx={{ mt: 4 }}>
          <TableSkeleton rows={3} />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Button
          onClick={() => navigate('/employees')}
          startIcon={<ArrowLeft size={18} />}
          sx={{ borderRadius: 2, textTransform: 'none', mb: 2 }}
        >
          Back to Employees
        </Button>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!employee) {
    return (
      <Box>
        <Button
          onClick={() => navigate('/employees')}
          startIcon={<ArrowLeft size={18} />}
          sx={{ borderRadius: 2, textTransform: 'none', mb: 2 }}
        >
          Back to Employees
        </Button>
        <EmptyState title="Employee not found" description="The employee you are looking for does not exist." />
      </Box>
    );
  }

  const empId = employee._id || employee.id;
  const profile = employee.profile || {};
  const contact = profile.contact || {};
  const address = contact.address || {};
  const location = address.location || {};
  const skills = profile.skills || {};
  const experience = skills.experience || {};
  const certifications = experience.certifications || {};
  const status = employee.status || 'Active';
  const sc = statusColors[status] || statusColors.Active;

  return (
    <Box sx={{ spaceY: 6 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 2,
          mb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            onClick={() => navigate('/employees')}
            startIcon={<ArrowLeft size={18} />}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Back
          </Button>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              fontSize: '1.25rem',
              fontWeight: 700,
            }}
          >
            {getInitials(employee.name)}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {employee.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                {employee.designation || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.disabled">
                |
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {employee.department?.name || 'No Department'}
              </Typography>
              <Chip
                label={status}
                size="small"
                sx={{ bgcolor: sc.bg, color: sc.color, fontWeight: 600, fontSize: '0.7rem' }}
              />
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate(`/employees/${empId}/edit`)}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Edit
          </Button>
        </Box>
      </Box>

      {/* Profile Info Card */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <User size={18} /> Profile Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Mail size={16} style={{ color: '#64748b' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {contact.email || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Phone size={16} style={{ color: '#64748b' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {contact.phone || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <MapPin size={16} style={{ color: '#64748b' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {[address.city, location.state, location.country].filter(Boolean).join(', ') || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Calendar size={16} style={{ color: '#64748b' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Joined
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formatDate(employee.joiningDate)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Code2 size={16} style={{ color: '#64748b' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Primary Skill
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {skills.primary || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Layers size={16} style={{ color: '#64748b' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Domains
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {(experience.domains || []).join(', ') || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Shield size={16} style={{ color: '#64748b' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Certifications
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {(certifications.current || []).length > 0
                      ? `${certifications.current.length} certification${certifications.current.length !== 1 ? 's' : ''}`
                      : 'None'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Globe size={16} style={{ color: '#64748b' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Timezone
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {location.geo?.timezone?.name || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Statistics Section */}
      {displayData && (
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Briefcase size={18} /> Statistics
          </Typography>
          <Grid container spacing={2}>
            {[
              {
                label: 'Total Projects',
                value: stats?.totalProjects ?? profile.projects?.length ?? 0,
                icon: <Projector size={20} />,
                color: '#2563eb',
              },
              {
                label: 'Total Tasks',
                value: stats?.totalTasks ?? tasks.length,
                icon: <ListTodo size={20} />,
                color: '#7c3aed',
              },
              {
                label: 'Experience',
                value: stats?.yearsOfExperience ?? experience.years ?? 0,
                suffix: ' yrs',
                icon: <Clock size={20} />,
                color: '#059669',
              },
              {
                label: 'Primary Skill',
                value: stats?.primarySkill ?? skills.primary ?? 'N/A',
                icon: <Award size={20} />,
                color: '#d97706',
              },
            ].map((stat) => (
              <Grid item xs={6} md={3} key={stat.label}>
                <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                      <Box
                        sx={{ p: 1, borderRadius: 2, bgcolor: `${stat.color}15`, color: stat.color, display: 'flex' }}
                      >
                        {stat.icon}
                      </Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        {stat.label}
                      </Typography>
                    </Box>
                    <Typography variant="h4" fontWeight={700} sx={{ ml: 0.5 }}>
                      {stat.value}
                      {stat.suffix || ''}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Performance Score */}
      {performance && (
        <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Star size={18} /> Performance Score
            </Typography>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={120}
                    thickness={6}
                    sx={{ color: '#e5e7eb', position: 'absolute' }}
                  />
                  <CircularProgress
                    variant="determinate"
                    value={performance.performanceScore}
                    size={120}
                    thickness={6}
                    sx={{
                      color:
                        performance.performanceScore >= 90
                          ? '#059669'
                          : performance.performanceScore >= 80
                            ? '#2563eb'
                            : performance.performanceScore >= 70
                              ? '#d97706'
                              : '#dc2626',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h4" fontWeight={700}>
                      {performance.performanceScore}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      / 100
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={performance.rating}
                  size="small"
                  sx={{
                    mt: 1,
                    bgcolor: (ratingColors[performance.rating] || ratingColors['Needs Improvement']).bg,
                    color: (ratingColors[performance.rating] || ratingColors['Needs Improvement']).color,
                    fontWeight: 600,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Score Breakdown
                </Typography>
                {[
                  { label: 'Base Score', value: 60, max: 100 },
                  {
                    label: `Experience Bonus (${displayData?.yearsOfExperience ?? experience.years ?? 0} yrs × 2)`,
                    value: performance.metrics?.experienceContribution || 0,
                    max: 40,
                  },
                  {
                    label: `Project Bonus (${stats?.totalProjects ?? profile.projects?.length ?? 0} projects × 3)`,
                    value: performance.metrics?.projectContribution || 0,
                    max: 30,
                  },
                  {
                    label: `Task Bonus (${stats?.totalTasks ?? tasks.length} tasks × 1)`,
                    value: performance.metrics?.taskContribution || 0,
                    max: 10,
                  },
                ].map((item) => (
                  <Box key={item.label} sx={{ mb: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {item.label}
                      </Typography>
                      <Typography variant="caption" fontWeight={600}>
                        +{item.value}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(item.value / item.max) * 100}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: '#e5e7eb',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          bgcolor: item.value > 0 ? '#2563eb' : '#e5e7eb',
                        },
                      }}
                    />
                  </Box>
                ))}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Projects List */}
      <Box>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Projector size={18} /> Projects ({projects.length})
        </Typography>
        {projects.length === 0 ? (
          <EmptyState title="No projects" description="This employee is not assigned to any projects." />
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Project ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Tasks</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project._id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {project.projectId || project._id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {project.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={project.tasks?.length || 0}
                        size="small"
                        sx={{ bgcolor: '#dbeafe', color: '#1e40af', fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(project.createdAt)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Tasks List */}
      <Box>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <ListTodo size={18} /> Tasks ({tasks.length})
        </Typography>
        {tasks.length === 0 ? (
          <EmptyState title="No tasks" description="This employee has no assigned tasks." />
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Task ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Project</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task._id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {task.taskId || task._id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{task.description}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500} color="primary">
                        {task.project?.name || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(task.createdAt)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default EmployeeDetail;
