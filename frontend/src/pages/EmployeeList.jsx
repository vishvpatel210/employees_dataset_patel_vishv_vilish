import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
  Collapse,
  Grid,
} from '@mui/material';
import { Plus, Search, Eye, Edit2, Trash2, SlidersHorizontal, X } from 'lucide-react';
import { fetchEmployees, deleteEmployee, bulkDeleteEmployees, clearEmployeeError, setEmployeeFilters, clearEmployeeFilters } from '../store/slices/employeeSlice';
import { getInitials, formatDate } from '../utils/helpers';
import DataTable from '../components/common/DataTable';
import ConfirmDialog from '../components/common/ConfirmDialog';
import toast from 'react-hot-toast';

const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total, page, limit, sort, order, search, filters, loading, error } = useSelector((state) => state.employees);
  const [searchInput, setSearchInput] = useState(search || '');
  const [filterInputs, setFilterInputs] = useState({ ...filters });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const loadEmployees = useCallback(() => {
    const params = { page, limit };
    if (sort) params.sort = order === 'desc' ? `-${sort}` : sort;
    if (search) params.search = search;
    Object.entries(filters).forEach(([key, val]) => {
      if (val) params[key] = val;
    });
    dispatch(fetchEmployees(params));
  }, [dispatch, page, limit, sort, order, search, filters]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  useEffect(() => {
    return () => dispatch(clearEmployeeError());
  }, [dispatch]);

  useEffect(() => {
    setSelectedIds([]);
  }, [page, search]);

  useEffect(() => {
    setFilterInputs({ ...filters });
  }, [filters]);

  const handleSearch = () => {
    if (searchInput !== search) {
      dispatch({ type: 'employees/setEmployeeSearch', payload: searchInput });
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleSort = (field, dir) => {
    dispatch({ type: 'employees/setEmployeeSort', payload: { sort: field, order: dir } });
  };

  const handlePageChange = (_, newPage) => {
    dispatch(fetchEmployees({ page: newPage + 1, limit, sort, order: order || undefined, search: search || undefined, ...filters }));
  };

  const handleRowsPerPageChange = (e) => {
    dispatch(fetchEmployees({ page: 1, limit: parseInt(e.target.value, 10), sort, order: order || undefined, search: search || undefined, ...filters }));
  };

  const handleApplyFilters = () => {
    dispatch(setEmployeeFilters(filterInputs));
  };

  const handleResetFilters = () => {
    setFilterInputs({ primarySkill: '', domain: '', country: '', experience: '' });
    dispatch(clearEmployeeFilters());
    setSearchInput('');
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);
  const hasAnyFilter = !!(search || hasActiveFilters);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await dispatch(deleteEmployee(deleteTarget._id || deleteTarget.id)).unwrap();
      toast.success('Employee deleted successfully');
      loadEmployees();
    } catch (err) {
      toast.error(err || 'Failed to delete employee');
    }
    setDeleteTarget(null);
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.length === 0) return;
    try {
      await dispatch(bulkDeleteEmployees(selectedIds)).unwrap();
      toast.success(`${selectedIds.length} employee${selectedIds.length !== 1 ? 's' : ''} deleted successfully`);
      setSelectedIds([]);
      loadEmployees();
    } catch (err) {
      toast.error(err || 'Failed to delete employees');
    }
    setBulkDeleteOpen(false);
  };

  const columns = useMemo(() => [
    {
      field: 'name',
      label: 'Employee',
      sortable: true,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {getInitials(row.name)}
          </Box>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.profile?.contact?.email || row.email || '-'}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'designation',
      label: 'Designation',
      sortable: true,
      render: (row) => row.designation || '-',
    },
    {
      field: 'department',
      label: 'Department',
      render: (row) => row.department?.name || '-',
    },
    {
      field: 'salary',
      label: 'Salary',
      sortable: true,
      render: (row) => {
        const val = row.salary;
        if (val == null) return '-';
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
      },
    },
    {
      field: 'status',
      label: 'Status',
      render: (row) => {
        const status = row.status || 'active';
        const colors = {
          active: { bg: '#dcfce7', color: '#166534' },
          inactive: { bg: '#fef3c7', color: '#92400e' },
          suspended: { bg: '#fce4ec', color: '#c62828' },
        };
        const c = colors[status] || colors.active;
        return (
          <Chip
            label={status.charAt(0).toUpperCase() + status.slice(1)}
            size="small"
            sx={{ bgcolor: c.bg, color: c.color, fontWeight: 600, fontSize: '0.75rem' }}
          />
        );
      },
    },
    {
      field: 'joiningDate',
      label: 'Joined',
      sortable: true,
      render: (row) => formatDate(row.joiningDate),
    },
    {
      field: 'actions',
      label: 'Actions',
      sortable: false,
      nowrap: true,
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5 }} onClick={(e) => e.stopPropagation()}>
          <Tooltip title="View">
            <IconButton size="small" color="primary" onClick={() => navigate(`/employees/${row._id || row.id}`)}>
              <Eye size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" color="info" onClick={() => navigate(`/employees/${row._id || row.id}/edit`)}>
              <Edit2 size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => setDeleteTarget(row)}>
              <Trash2 size={16} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ], [navigate]);

  return (
    <Box sx={{ spaceY: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Employees</Typography>
          <Typography variant="body2" color="text.secondary">
            {total > 0 ? `${total} employee${total !== 1 ? 's' : ''} found` : 'Manage your workforce'}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => navigate('/employees/new')}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          Add Employee
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search employees..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          sx={{ minWidth: 280, maxWidth: 360 }}
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
        <Button
          variant={filtersOpen ? 'contained' : 'outlined'}
          color={filtersOpen ? 'primary' : 'inherit'}
          size="small"
          startIcon={<SlidersHorizontal size={16} />}
          onClick={() => setFiltersOpen(!filtersOpen)}
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          Filters{hasActiveFilters ? ` (${Object.values(filters).filter(Boolean).length})` : ''}
        </Button>
        {hasAnyFilter && (
          <Button
            variant="text"
            size="small"
            color="error"
            startIcon={<X size={16} />}
            onClick={handleResetFilters}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Reset all
          </Button>
        )}
      </Box>

      {/* Advanced Filters Panel */}
      <Collapse in={filtersOpen}>
        <Box
          sx={{
            p: 2.5,
            mb: 2.5,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'grey.50',
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
            Advanced Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                size="small"
                label="Primary Skill"
                placeholder="e.g. JavaScript"
                value={filterInputs.primarySkill || ''}
                onChange={(e) => setFilterInputs((prev) => ({ ...prev, primarySkill: e.target.value }))}
                fullWidth
                slotProps={{ input: { sx: { borderRadius: 2, bgcolor: '#fff' } } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                size="small"
                label="Domain"
                placeholder="e.g. Cloud, AI"
                value={filterInputs.domain || ''}
                onChange={(e) => setFilterInputs((prev) => ({ ...prev, domain: e.target.value }))}
                fullWidth
                slotProps={{ input: { sx: { borderRadius: 2, bgcolor: '#fff' } } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                size="small"
                label="Country"
                placeholder="e.g. India"
                value={filterInputs.country || ''}
                onChange={(e) => setFilterInputs((prev) => ({ ...prev, country: e.target.value }))}
                fullWidth
                slotProps={{ input: { sx: { borderRadius: 2, bgcolor: '#fff' } } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                size="small"
                label="Min Experience (years)"
                placeholder="e.g. 5"
                type="number"
                value={filterInputs.experience || ''}
                onChange={(e) => setFilterInputs((prev) => ({ ...prev, experience: e.target.value }))}
                fullWidth
                slotProps={{ input: { sx: { borderRadius: 2, bgcolor: '#fff' } } }}
              />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', gap: 1.5, mt: 2, justifyContent: 'flex-end' }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                setFilterInputs({ primarySkill: '', domain: '', country: '', experience: '' });
              }}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Clear
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleApplyFilters}
              disabled={loading}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Collapse>

      {selectedIds.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 2,
            p: 1.5,
            bgcolor: 'error.50',
            border: '1px solid',
            borderColor: 'error.200',
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" fontWeight={600} color="error.main">
            {selectedIds.length} selected
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            size="small"
            variant="contained"
            color="error"
            startIcon={<Trash2 size={16} />}
            onClick={() => setBulkDeleteOpen(true)}
            sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600 }}
          >
            Delete Selected
          </Button>
          <Button
            size="small"
            variant="text"
            onClick={() => setSelectedIds([])}
            sx={{ borderRadius: 1.5, textTransform: 'none' }}
          >
            Clear
          </Button>
        </Box>
      )}

      <DataTable
        columns={columns}
        rows={items}
        loading={loading}
        error={error}
        onRetry={loadEmployees}
        sortField={sort}
        sortOrder={order}
        onSort={handleSort}
        page={page - 1}
        total={total}
        rowsPerPage={limit}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onRowClick={(row) => navigate(`/employees/${row._id || row.id}`)}
        emptyTitle="No employees found"
        emptyDescription={hasAnyFilter ? 'Try different search terms or filters.' : 'Add your first employee to get started.'}
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteTarget?.name || 'this employee'}?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        title="Delete Selected Employees"
        message={`Are you sure you want to delete ${selectedIds.length} employee${selectedIds.length !== 1 ? 's' : ''}? This action cannot be undone.`}
        onConfirm={handleBulkDeleteConfirm}
        onCancel={() => setBulkDeleteOpen(false)}
        confirmLabel={`Delete ${selectedIds.length}`}
        color="error"
      />
    </Box>
  );
};

export default EmployeeList;
