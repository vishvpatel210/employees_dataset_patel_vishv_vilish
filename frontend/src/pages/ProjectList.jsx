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
  Stack,
} from '@mui/material';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { fetchProjects, createProject, updateProject, deleteProject, clearProjectError } from '../store/slices/projectSlice';
import { formatDate } from '../utils/helpers';
import DataTable from '../components/common/DataTable';
import ConfirmDialog from '../components/common/ConfirmDialog';
import toast from 'react-hot-toast';

const projectSchema = yup.object({
  projectId: yup
    .string()
    .required('Project ID is required'),
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .required('Project name is required'),
});

const initialValues = { projectId: '', name: '' };

const ProjectList = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.projects);
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'Admin';

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadProjects = useCallback(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    return () => dispatch(clearProjectError());
  }, [dispatch]);

  const handleOpenCreate = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditTarget(project);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditTarget(null);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (editTarget) {
        await dispatch(updateProject({ id: editTarget._id || editTarget.id, ...values })).unwrap();
        toast.success('Project updated successfully');
      } else {
        await dispatch(createProject(values)).unwrap();
        toast.success('Project created successfully');
      }
      handleCloseModal();
    } catch (err) {
      toast.error(err || `Failed to ${editTarget ? 'update' : 'create'} project`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await dispatch(deleteProject(deleteTarget._id || deleteTarget.id)).unwrap();
      toast.success('Project deleted successfully');
    } catch (err) {
      toast.error(err || 'Failed to delete project');
    }
    setDeleteTarget(null);
  };

  const columns = useMemo(() => [
    {
      field: 'projectId',
      label: 'Project ID',
      sortable: true,
      render: (row) => (
        <Typography variant="body2" fontWeight={600}>
          {row.projectId || row._id}
        </Typography>
      ),
    },
    {
      field: 'name',
      label: 'Name',
      sortable: true,
      render: (row) => (
        <Typography variant="body2" fontWeight={500}>
          {row.name}
        </Typography>
      ),
    },
    {
      field: 'tasks',
      label: 'Tasks',
      sortable: false,
      render: (row) => {
        const tasks = row.tasks || [];
        if (tasks.length === 0) return <Typography variant="body2" color="text.disabled">None</Typography>;
        return (
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
            {tasks.slice(0, 5).map((task) => (
              <Chip
                key={task._id}
                label={task.taskId || task.description?.substring(0, 20) || task._id}
                size="small"
                sx={{ bgcolor: '#dbeafe', color: '#1e40af', fontWeight: 500, fontSize: '0.7rem' }}
              />
            ))}
            {tasks.length > 5 && (
              <Chip
                label={`+${tasks.length - 5}`}
                size="small"
                sx={{ bgcolor: '#f1f5f9', color: '#64748b', fontWeight: 500, fontSize: '0.7rem' }}
              />
            )}
          </Stack>
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
          <Typography variant="h5" fontWeight={700}>Projects</Typography>
          <Typography variant="body2" color="text.secondary">
            {items.length > 0 ? `${items.length} project${items.length !== 1 ? 's' : ''} found` : 'Manage your projects'}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={handleOpenCreate}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          Add Project
        </Button>
      </Box>

      <DataTable
        columns={columns}
        rows={items}
        loading={loading}
        error={error}
        onRetry={loadProjects}
        emptyTitle="No projects found"
        emptyDescription="Add your first project to get started."
      />

      {/* Create / Edit Modal */}
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <Formik
          initialValues={editTarget ? { projectId: editTarget.projectId || '', name: editTarget.name || '' } : initialValues}
          validationSchema={projectSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <DialogTitle sx={{ fontWeight: 700 }}>
                {editTarget ? 'Edit Project' : 'Add Project'}
              </DialogTitle>
              <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
                  <Field name="projectId">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Project ID"
                        fullWidth
                        size="medium"
                        disabled={!!editTarget}
                        error={touched.projectId && Boolean(errors.projectId)}
                        helperText={touched.projectId && errors.projectId}
                        slotProps={{ input: { sx: { borderRadius: 2 } } }}
                      />
                    )}
                  </Field>
                  <Field name="name">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Project Name"
                        fullWidth
                        size="medium"
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                        slotProps={{ input: { sx: { borderRadius: 2 } } }}
                      />
                    )}
                  </Field>
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
                  disabled={isSubmitting}
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
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        confirmLabel="Delete"
        color="error"
      />
    </Box>
  );
};

export default ProjectList;
