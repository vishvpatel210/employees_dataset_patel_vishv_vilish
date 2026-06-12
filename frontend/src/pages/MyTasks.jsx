import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Chip,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { Edit2 } from 'lucide-react';
import { getTasks, updateTaskStatus } from '../services/taskService';
import { formatDate } from '../utils/helpers';
import DataTable from '../components/common/DataTable';
import toast from 'react-hot-toast';

const MyTasks = () => {
  const { user } = useSelector((state) => state.auth);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadMyTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getTasks();
      const allTasks = res.data?.data || res.data?.tasks || [];
      
      // Filter tasks assigned to the logged-in user by matching name
      // Match by the exact User ID reference, fallback to name matching (case-insensitive)
      const myTasks = allTasks.filter(t => {
        const isUserMatch = t.assignedTo?.user === user?._id || t.assignedTo?.user?._id === user?._id;
        const isNameMatch = (t.assignedTo?.name || '').toLowerCase().trim() === (user?.name || '').toLowerCase().trim();
        return isUserMatch || isNameMatch;
      });
      setTasks(myTasks);
    } catch (err) {
      setError('Failed to load your tasks.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadMyTasks();
  }, [loadMyTasks]);

  const handleOpenEdit = (task) => {
    setEditTarget(task);
    setNewStatus(task.status || 'pending');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditTarget(null);
  };

  const handleUpdateStatus = async () => {
    if (!editTarget) return;
    try {
      setIsSubmitting(true);
      await updateTaskStatus(editTarget._id || editTarget.id, { status: newStatus });
      toast.success('Task status updated successfully');
      loadMyTasks();
      handleCloseModal();
    } catch (err) {
      toast.error('Failed to update task status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        field: 'taskId',
        label: 'Task ID',
        render: (row) => <Typography variant="body2" fontWeight={600}>{row.taskId || row._id}</Typography>,
      },
      {
        field: 'description',
        label: 'Description',
        render: (row) => (
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {row.description}
          </Typography>
        ),
      },
      {
        field: 'project',
        label: 'Project',
        render: (row) => (
          <Chip
            label={row.project?.name || 'N/A'}
            size="small"
            sx={{ bgcolor: '#e0e7ff', color: '#3730a3', fontWeight: 500 }}
          />
        ),
      },
      {
        field: 'status',
        label: 'Status',
        render: (row) => {
          const status = row.status || 'pending';
          const colors = {
            completed: { bg: '#dcfce7', color: '#166534' },
            'in-progress': { bg: '#fef3c7', color: '#92400e' },
            pending: { bg: '#f1f5f9', color: '#475569' },
          };
          const c = colors[status] || colors.pending;
          return (
            <Chip
              label={status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              size="small"
              sx={{ bgcolor: c.bg, color: c.color, fontWeight: 600, fontSize: '0.75rem' }}
            />
          );
        },
      },
      {
        field: 'createdAt',
        label: 'Created',
        render: (row) => <Typography variant="body2" color="text.secondary">{formatDate(row.createdAt)}</Typography>,
      },
      {
        field: 'actions',
        label: 'Update',
        sortable: false,
        render: (row) => (
          <Tooltip title="Update Status">
            <IconButton size="small" color="info" onClick={(e) => { e.stopPropagation(); handleOpenEdit(row); }}>
              <Edit2 size={16} />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    []
  );

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>My Tasks</Typography>
        <Typography variant="body2" color="text.secondary">
          Manage and update the status of your assigned tasks.
        </Typography>
      </Box>

      <DataTable
        columns={columns}
        rows={tasks}
        loading={loading}
        error={error}
        onRetry={loadMyTasks}
        emptyTitle="No tasks found"
        emptyDescription="You currently have no tasks assigned to you."
      />

      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Update Task Status</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>Task:</strong> {editTarget?.description}
            </Typography>
            <FormControl fullWidth size="medium">
              <InputLabel>Status</InputLabel>
              <Select
                value={newStatus}
                label="Status"
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseModal} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {isSubmitting ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyTasks;
