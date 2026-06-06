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
  CircularProgress,
  Alert,
} from '@mui/material';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { fetchDepartments, createDepartment, updateDepartment, deleteDepartment, clearDepartmentError } from '../store/slices/departmentSlice';
import { formatDate } from '../utils/helpers';
import DataTable from '../components/common/DataTable';
import ConfirmDialog from '../components/common/ConfirmDialog';
import toast from 'react-hot-toast';

const departmentSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters')
    .required('Department name is required'),
  description: yup
    .string()
    .max(500, 'Description must be at most 500 characters')
    .required('Description is required'),
});

const initialValues = { name: '', description: '' };

const DepartmentList = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.departments);
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'Admin';

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadDepartments = useCallback(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  useEffect(() => {
    return () => dispatch(clearDepartmentError());
  }, [dispatch]);

  const handleOpenCreate = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (dept) => {
    setEditTarget(dept);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditTarget(null);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (editTarget) {
        await dispatch(updateDepartment({ id: editTarget._id || editTarget.id, ...values })).unwrap();
        toast.success('Department updated successfully');
      } else {
        await dispatch(createDepartment(values)).unwrap();
        toast.success('Department created successfully');
      }
      handleCloseModal();
    } catch (err) {
      toast.error(err || `Failed to ${editTarget ? 'update' : 'create'} department`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await dispatch(deleteDepartment(deleteTarget._id || deleteTarget.id)).unwrap();
      toast.success('Department deleted successfully');
    } catch (err) {
      toast.error(err || 'Failed to delete department');
    }
    setDeleteTarget(null);
  };

  const columns = useMemo(() => [
    {
      field: 'name',
      label: 'Name',
      sortable: true,
      render: (row) => (
        <Typography variant="body2" fontWeight={600}>
          {row.name}
        </Typography>
      ),
    },
    {
      field: 'description',
      label: 'Description',
      render: (row) => (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {row.description}
        </Typography>
      ),
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
          <Typography variant="h5" fontWeight={700}>Departments</Typography>
          <Typography variant="body2" color="text.secondary">
            {items.length > 0 ? `${items.length} department${items.length !== 1 ? 's' : ''} found` : 'Manage your departments'}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={handleOpenCreate}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          Add Department
        </Button>
      </Box>

      <DataTable
        columns={columns}
        rows={items}
        loading={loading}
        error={error}
        onRetry={loadDepartments}
        emptyTitle="No departments found"
        emptyDescription="Add your first department to get started."
      />

      {/* Create / Edit Modal */}
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <Formik
          initialValues={editTarget ? { name: editTarget.name || '', description: editTarget.description || '' } : initialValues}
          validationSchema={departmentSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <DialogTitle sx={{ fontWeight: 700 }}>
                {editTarget ? 'Edit Department' : 'Add Department'}
              </DialogTitle>
              <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
                  <Field name="name">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Department Name"
                        fullWidth
                        size="medium"
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
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
        title="Delete Department"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        confirmLabel="Delete"
        color="error"
      />
    </Box>
  );
};

export default DepartmentList;
