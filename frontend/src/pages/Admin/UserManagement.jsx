import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Skeleton,
  Button,
} from '@mui/material';
import { Search, Shield, Trash2 } from 'lucide-react';
import { getUsers, deleteUser } from '../../services/adminService';
import RoleUpdateDialog from './RoleUpdateDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import toast from 'react-hot-toast';

const roleColors = {
  Admin: { bg: '#f3e8ff', color: '#7c3aed' },
  HR: { bg: '#d1fae5', color: '#065f46' },
  Employee: { bg: '#fef3c7', color: '#92400e' },
  User: { bg: '#dbeafe', color: '#1e40af' },
};

const RoleChip = ({ role }) => {
  const c = roleColors[role] || roleColors.User;
  return (
    <Chip label={role} size="small" sx={{ bgcolor: c.bg, color: c.color, fontWeight: 600, fontSize: '0.75rem' }} />
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleDialogUser, setRoleDialogUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: page + 1, limit };
      if (search) params.search = search;
      const res = await getUsers(params);
      const d = res.data;
      setUsers(d.data || []);
      setTotal(d.pagination?.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
      setUsers([]);
    }
    setLoading(false);
  }, [page, limit, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = () => {
    setPage(0);
    setSearch(searchInput);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget._id || deleteTarget.id);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
    setDeleteTarget(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={700}>
          User Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {total > 0 ? `${total} user${total !== 1 ? 's' : ''} registered` : 'Manage system users and roles'}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search users by name or email..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          sx={{ minWidth: 320 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} style={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 },
            },
          }}
        />
        <Button
          variant="outlined"
          onClick={handleSearch}
          disabled={loading}
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          Search
        </Button>
        {search && (
          <Button
            variant="text"
            size="small"
            color="error"
            onClick={() => {
              setSearch('');
              setSearchInput('');
              setPage(0);
            }}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Clear
          </Button>
        )}
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', bgcolor: 'grey.50' }}>
                  User
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', bgcolor: 'grey.50' }}>
                  Email
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', bgcolor: 'grey.50' }}>
                  Role
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', bgcolor: 'grey.50' }}>
                  Joined
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', bgcolor: 'grey.50' }}
                  align="right"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton variant="text" width={j === 0 ? '60%' : '80%'} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Typography color="error" fontWeight={600}>
                      {error}
                    </Typography>
                    <Button size="small" onClick={fetchUsers} sx={{ mt: 1, textTransform: 'none', borderRadius: 2 }}>
                      Try again
                    </Button>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Typography color="text.secondary">
                      {search ? 'No users matching your search.' : 'No users registered yet.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', bgcolor: '#2563eb' }}>
                          {(user.name || user.email || '?')
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                            .substring(0, 2)}
                        </Avatar>
                        <Typography variant="body2" fontWeight={600}>
                          {user.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <RoleChip role={user.role} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(user.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        <Tooltip title="Change Role">
                          <IconButton size="small" color="primary" onClick={() => setRoleDialogUser(user)}>
                            <Shield size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User">
                          <IconButton size="small" color="error" onClick={() => setDeleteTarget(user)}>
                            <Trash2 size={16} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={limit}
          onRowsPerPageChange={(e) => {
            setLimit(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      <RoleUpdateDialog
        open={!!roleDialogUser}
        user={roleDialogUser}
        onClose={() => setRoleDialogUser(null)}
        onUpdated={fetchUsers}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteTarget?.name || 'this user'}? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        color="error"
        confirmLabel="Delete"
      />
    </Box>
  );
};

export default UserManagement;
