import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Skeleton, Grid, Chip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Avatar, AvatarGroup,
} from '@mui/material';
import { Shield, Users, UserCog, UserCheck, Calendar } from 'lucide-react';
import { getAdminDashboard } from '../../services/adminService';

const statCards = [
  { label: 'Total Users', icon: Users, color: '#2563eb', bgColor: '#eff6ff', key: 'totalUsers', suffix: '' },
  { label: 'Admins', icon: Shield, color: '#7c3aed', bgColor: '#f5f3ff', key: 'adminCount', suffix: '' },
  { label: 'HR Staff', icon: UserCog, color: '#059669', bgColor: '#ecfdf5', key: 'hrCount', suffix: '' },
  { label: 'Employees', icon: UserCheck, color: '#d97706', bgColor: '#fffbeb', key: 'employeeCount', suffix: '' },
];

const StatCard = ({ label, icon: Icon, color, bgColor, value, loading }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider',
      display: 'flex', alignItems: 'center', gap: 2.5,
      transition: 'all 0.2s',
      '&:hover': { borderColor: color, boxShadow: `0 4px 12px ${color}15` },
    }}
  >
    <Box sx={{ width: 48, height: 48, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: bgColor, color, flexShrink: 0 }}>
      <Icon size={22} />
    </Box>
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </Typography>
      {loading ? (
        <Skeleton variant="text" width={60} height={32} />
      ) : (
        <Typography variant="h5" fontWeight={700} color="text.primary" sx={{ mt: 0.25 }}>
          {value ?? '--'}
        </Typography>
      )}
    </Box>
  </Paper>
);

const roleColors = {
  Admin: { bg: '#f3e8ff', color: '#7c3aed' },
  HR: { bg: '#d1fae5', color: '#065f46' },
  Employee: { bg: '#fef3c7', color: '#92400e' },
  User: { bg: '#dbeafe', color: '#1e40af' },
};

const RoleChip = ({ role }) => {
  const c = roleColors[role] || roleColors.User;
  return <Chip label={role} size="small" sx={{ bgcolor: c.bg, color: c.color, fontWeight: 600, fontSize: '0.75rem' }} />;
};

const AdminOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAdminDashboard();
        const d = res.data?.data ?? {};
        const roleDist = d.roleDistribution || [];
        setData({
          totalUsers: d.totalUsers,
          adminCount: roleDist.find((r) => r._id === 'Admin')?.count || 0,
          hrCount: roleDist.find((r) => r._id === 'HR')?.count || 0,
          employeeCount: roleDist.find((r) => r._id === 'Employee')?.count || 0,
          roleDistribution: roleDist,
          recentUsers: d.recentUsers || [],
        });
      } catch {
        setData(null);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={700}>Admin Dashboard</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          System overview and user management
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 2.5 }}>
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} value={data?.[card.key]} loading={loading} />
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
        {/* Role Distribution */}
        <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
          <Box sx={{ p: 3, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight={600}>Role Distribution</Typography>
          </Box>
          {loading ? (
            <Box sx={{ p: 3 }}><Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} /></Box>
          ) : (
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {(data?.roleDistribution || []).map((item) => {
                  const total = data?.totalUsers || 1;
                  const pct = ((item.count / total) * 100).toFixed(1);
                  const c = roleColors[item._id] || roleColors.User;
                  return (
                    <Box key={item._id}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" fontWeight={500}>
                          <Box component="span" sx={{ display: 'inline-block', width: 10, height: 10, borderRadius: '2px', bgcolor: c.color, mr: 1 }} />
                          {item._id}
                        </Typography>
                        <Typography variant="body2" fontWeight={600} color="text.secondary">
                          {item.count} ({pct}%)
                        </Typography>
                      </Box>
                      <Box sx={{ width: '100%', bgcolor: 'grey.100', borderRadius: 1, height: 8, overflow: 'hidden' }}>
                        <Box sx={{ width: `${pct}%`, bgcolor: c.color, height: '100%', borderRadius: 1, transition: 'width 0.5s' }} />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
        </Paper>

        {/* Recent Users */}
        <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
          <Box sx={{ p: 3, pb: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>Recent Users</Typography>
            <Chip
              label="View All"
              size="small"
              color="primary"
              variant="outlined"
              onClick={() => navigate('/admin/users')}
              sx={{ cursor: 'pointer', fontWeight: 500 }}
            />
          </Box>
          {loading ? (
            <Box sx={{ p: 3 }}><Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} /></Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Joined</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(data?.recentUsers || []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary" variant="body2">No users yet</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    (data?.recentUsers || []).map((user) => (
                      <TableRow key={user._id} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: '#2563eb' }}>
                              {(user.name || user.email || '?').split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>{user.name}</Typography>
                              <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell><RoleChip role={user.role} /></TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminOverview;
