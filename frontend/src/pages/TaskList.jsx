import { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Chip,
  CircularProgress,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from '@mui/material';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { fetchTasks, createTask, updateTask, deleteTask, clearTaskError } from '../store/slices/taskSlice';
import { getProjects } from '../services/projectService';
import { getEmployees } from '../services/employeeService';
import { formatDate } from '../utils/helpers';
import DataTable from '../components/common/DataTable';
import ConfirmDialog from '../components/common/ConfirmDialog';
import toast from 'react-hot-toast';

const taskSchema = yup.object({
  taskId: yup
    .string()
    .required('Task ID is required'),
  description: yup
    .string()
    .min(3, 'Description must be at least 3 characters')
    .max(500, 'Description must be at most 500 characters')
    .required('Description is required'),
  project: yup
    .string()
    .required('Project is required'),
  assignedTo: yup
    .string()
    .required('Assigned employee is required'),
});

const initialValues = { taskId: '', description: '', project: '', assignedTo: '' };

const TaskList = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.tasks);
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'Admin';

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [projectOptions, setProjectOptions] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(false);

  const loadTasks = useCallback(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    return () => dispatch(clearTaskError());
  }, [dispatch]);

  const loadFormOptions = async () => {
    setOptionsLoading(true);
    try {
      const [projRes, empRes] = await Promise.all([
        getProjects(),
        getEmployees({ limit: 200 }),
      ]);
      setProjectOptions(projRes.data.data || []);
      const empData = empRes.data.data || empRes.data.employees || [];
      setEmployeeOptions(empData);
    } catch {
      toast.error('Failed to load form options');
    } finally {
      setOptionsLoading(false);
    }
  };

  const handleOpenCreate = async () => {
    setEditTarget(null);
    await loadFormOptions();
    setModalOpen(true);
  };

  const handleOpenEdit = async (task) => {
    setEditTarget(task);
    await loadFormOptions();
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditTarget(null);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (editTarget) {
        await dispatch(updateTask({ id: editTarget._id || editTarget.id, ...values })).unwrap();
        toast.success('Task updated successfully');
      } else {
        await dispatch(createTask(values)).unwrap();
        toast.success('Task created successfully');
      }
      handleCloseModal();
    } catch (err) {
      toast.error(err || `Failed to ${editTarget ? 'update' : 'create'} task`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await dispatch(deleteTask(deleteTarget._id || deleteTarget.id)).unwrap();
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error(err || 'Failed to delete task');
    }
    setDeleteTarget(null);
  };

  const columns = useMemo(() => [
    {
      field: 'taskId',
      label: 'Task ID',
      sortable: true,
      render: (row) => (
        <Typography variant="body2" fontWeight={600}>
          {row.taskId || row._id}
        </Typography>
      ),
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
      render: (row) => {
        const project = row.project || {};
        return (
          <Chip
            label={project.name || 'N/A'}
            size="small"
            sx={{ bgcolor: '#e0e7ff', color: '#3730a3', fontWeight: 500 }}
          />
        );
      },
    },
    {
      field: 'assignedTo',
      label: 'Assigned To',
      render: (row) => {
        const assigned = row.assignedTo || {};
        return (
          <Typography variant="body2" fontWeight={500}>
            {assigned.name || 'N/A'}
          </Typography>
        );
      },
    },
    {
      field: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (row) => (
        <Typography variant="body2" color="text.secondary">
          {formatDate(row.createdAt)}
        </Typography>
      ),
    },
    {
      field: 'actions',
      label: 'Actions',
      sortable: false,
      nowrap: true,
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5 }} onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Edit">
            <IconButton size="small" color="info" onClick={() => handleOpenEdit(row)}>
              <Edit2 size={16} />
            </IconButton>
          </Tooltip>
          {isAdmin && (
            <Tooltip title="Delete">
              <IconButton size="small" color="error" onClick={() => setDeleteTarget(row)}>
                <Trash2 size={16} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ], [isAdmin]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Tasks</Typography>
          <Typography variant="body2" color="text.secondary">
            {items.length > 0 ? `${items.length} task${items.length !== 1 ? 's' : ''} found` : 'Manage your tasks'}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={handleOpenCreate}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          Add Task
        </Button>
      </Box>

      <DataTable
        columns={columns}
        rows={items}
        loading={loading}
        error={error}
        onRetry={loadTasks}
        emptyTitle="No tasks found"
        emptyDescription="Add your first task to get started."
      />

      {/* Create / Edit Modal */}
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <Formik
          initialValues={
            editTarget
              ? {
                  taskId: editTarget.taskId || '',
                  description: editTarget.description || '',
                  project: editTarget.project?._id || editTarget.project || '',
                  assignedTo: editTarget.assignedTo?._id || editTarget.assignedTo || '',
                }
              : initialValues
          }
          validationSchema={taskSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, isSubmitting, values, setFieldValue }) => (
            <Form>
              <DialogTitle sx={{ fontWeight: 700 }}>
                {editTarget ? 'Edit Task' : 'Add Task'}
              </DialogTitle>
              <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
                  <Field name="taskId">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Task ID"
                        fullWidth
                        size="medium"
                        disabled={!!editTarget}
                        error={touched.taskId && Boolean(errors.taskId)}
                        helperText={touched.taskId && errors.taskId}
                        slotProps={{ input: { sx: { borderRadius: 2 } } }}
                      />
                    )}
                  </Field>
                  <Field name="description">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Description"
                        fullWidth
                        size="medium"
                        multiline
                        rows={3}
                        error={touched.description && Boolean(errors.description)}
                        helperText={touched.description && errors.description}
                        slotProps={{ input: { sx: { borderRadius: 2 } } }}
                      />
                    )}
                  </Field>
                  <Field name="project">
                    {({ field }) => (
                      <FormControl fullWidth size="medium" error={touched.project && Boolean(errors.project)}>
                        <InputLabel sx={{ borderRadius: 2 }}>Project</InputLabel>
                        <Select
                          {...field}
                          label="Project"
                          sx={{ borderRadius: 2 }}
                          disabled={optionsLoading}
                          onChange={(e) => setFieldValue('project', e.target.value)}
                        >
                          {projectOptions.map((proj) => (
                            <MenuItem key={proj._id} value={proj._id}>
                              {proj.name} ({proj.projectId || proj._id})
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.project && errors.project && <FormHelperText>{errors.project}</FormHelperText>}
                      </FormControl>
                    )}
                  </Field>
                  <Field name="assignedTo">
                    {({ field }) => (
                      <FormControl fullWidth size="medium" error={touched.assignedTo && Boolean(errors.assignedTo)}>
                        <InputLabel sx={{ borderRadius: 2 }}>Assigned To</InputLabel>
                        <Select
                          {...field}
                          label="Assigned To"
                          sx={{ borderRadius: 2 }}
                          disabled={optionsLoading}
                          onChange={(e) => setFieldValue('assignedTo', e.target.value)}
                        >
                          {employeeOptions.map((emp) => (
                            <MenuItem key={emp._id} value={emp._id}>
                              {emp.name} ({emp.designation || 'N/A'})
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.assignedTo && errors.assignedTo && <FormHelperText>{errors.assignedTo}</FormHelperText>}
                      </FormControl>
                    )}
                  </Field>
                  {optionsLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                      <CircularProgress size={24} />
                    </Box>
                  )}
                  {error && (
                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                      {typeof error === 'string' ? error : 'Operation failed'}
                    </Alert>
                  )}
                </Box>
              </DialogContent>
              <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleCloseModal} sx={{ borderRadius: 2, textTransform: 'none' }}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || optionsLoading}
                  startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : undefined}
                  sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                >
                  {isSubmitting ? 'Saving...' : editTarget ? 'Update' : 'Create'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Task"
        message={`Are you sure you want to delete task "${deleteTarget?.taskId}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        confirmLabel="Delete"
        color="error"
      />
    </Box>
  );
};

export default TaskList;
