import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  CircularProgress,
  Alert,
  Paper,
  Divider,
} from '@mui/material';
import { ArrowLeft, Save } from 'lucide-react';
import { createEmployee, updateEmployee } from '../store/slices/employeeSlice';
import { employeeSchema } from '../utils/validators';
import { EMPLOYEE_STATUS } from '../utils/constants';
import { getDepartments } from '../services/departmentService';
import toast from 'react-hot-toast';

const initialValues = {
  id: '',
  name: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  country: '',
  primarySkill: '',
  experienceYears: '',
  department: '',
  designation: '',
  salary: '',
  status: 'active',
  joiningDate: '',
};

const flattenEmployee = (emp) => ({
  id: emp.id || '',
  name: emp.name || '',
  email: emp.profile?.contact?.email || emp.email || '',
  phone: emp.profile?.contact?.phone || '',
  street: emp.profile?.contact?.address?.street || '',
  city: emp.profile?.contact?.address?.city || '',
  state: emp.profile?.contact?.address?.location?.state || '',
  country: emp.profile?.contact?.address?.location?.country || '',
  primarySkill: emp.profile?.skills?.primary || '',
  experienceYears: emp.profile?.skills?.experience?.years?.toString() || '',
  department: emp.department?._id || emp.department || '',
  designation: emp.designation || '',
  salary: emp.salary?.toString() || '',
  status: emp.status || 'active',
  joiningDate: emp.joiningDate ? emp.joiningDate.split('T')[0] : '',
});

const buildPayload = (values) => ({
  id: values.id,
  name: values.name,
  profile: {
    contact: {
      email: values.email,
      phone: values.phone,
      address: {
        street: values.street,
        city: values.city,
        location: {
          state: values.state,
          country: values.country,
        },
      },
    },
    skills: {
      primary: values.primarySkill,
      experience: {
        years: values.experienceYears ? Number(values.experienceYears) : 0,
      },
    },
  },
  department: values.department || undefined,
  designation: values.designation,
  salary: values.salary ? Number(values.salary) : undefined,
  status: values.status,
  joiningDate: values.joiningDate || undefined,
});

const EmployeeForm = ({ employee, isEdit }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.employees);
  const initVals = employee ? flattenEmployee(employee) : initialValues;
  const [departmentOptions, setDepartmentOptions] = useState([]);

  useEffect(() => {
    getDepartments()
      .then((res) => {
        const depts = res.data?.data || res.data?.departments || [];
        setDepartmentOptions(depts);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = buildPayload(values);
      if (isEdit) {
        await dispatch(updateEmployee({ id: employee._id || employee.id, ...payload })).unwrap();
        toast.success('Employee updated successfully');
      } else {
        await dispatch(createEmployee(payload)).unwrap();
        toast.success('Employee created successfully');
      }
      navigate('/employees', { replace: true });
    } catch (err) {
      toast.error(err || `Failed to ${isEdit ? 'update' : 'create'} employee`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Button
          onClick={() => navigate('/employees')}
          startIcon={<ArrowLeft size={18} />}
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          Back
        </Button>
        <Typography variant="h5" fontWeight={700}>
          {isEdit ? 'Edit Employee' : 'Add Employee'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {typeof error === 'string' ? error : 'Operation failed'}
        </Alert>
      )}

      <Formik initialValues={initVals} validationSchema={employeeSchema} onSubmit={handleSubmit} enableReinitialize>
        {({ errors, touched, isSubmitting, setFieldValue, values }) => (
          <Form>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Basic Information
              </Typography>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field name="id">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Employee ID"
                        fullWidth
                        size="medium"
                        disabled={isEdit}
                        error={touched.id && Boolean(errors.id)}
                        helperText={touched.id && errors.id}
                        slotProps={{ input: { sx: { borderRadius: 2 } } }}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field name="name">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Full Name"
                        fullWidth
                        size="medium"
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                        slotProps={{ input: { sx: { borderRadius: 2 } } }}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field name="designation">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Designation"
                        fullWidth
                        size="medium"
                        error={touched.designation && Boolean(errors.designation)}
                        helperText={touched.designation && errors.designation}
                        slotProps={{ input: { sx: { borderRadius: 2 } } }}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field name="department">
                    {({ field }) => (
                      <FormControl fullWidth size="medium" error={touched.department && Boolean(errors.department)}>
                        <InputLabel sx={{ borderRadius: 2 }}>Department</InputLabel>
                        <Select
                          {...field}
                          label="Department"
                          sx={{ borderRadius: 2 }}
                          onChange={(e) => setFieldValue('department', e.target.value)}
                        >
                          <MenuItem value="">Select Department</MenuItem>
                          {departmentOptions.map((dept) => (
                            <MenuItem key={dept._id} value={dept._id}>
                              {dept.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.department && errors.department && <FormHelperText>{errors.department}</FormHelperText>}
                      </FormControl>
                    )}
                  </Field>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field name="salary">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Salary"
                        type="number"
                        fullWidth
                        size="medium"
                        error={touched.salary && Boolean(errors.salary)}
                        helperText={touched.salary && errors.salary}
                        slotProps={{ input: { sx: { borderRadius: 2 } } }}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field name="joiningDate">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Joining Date"
                        type="date"
                        fullWidth
                        size="medium"
                        error={touched.joiningDate && Boolean(errors.joiningDate)}
                        helperText={touched.joiningDate && errors.joiningDate}
                        slotProps={{
                          input: { sx: { borderRadius: 2 } },
                          inputLabel: { shrink: true },
                        }}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field name="status">
                    {({ field }) => (
                      <FormControl fullWidth size="medium" error={touched.status && Boolean(errors.status)}>
                        <InputLabel sx={{ borderRadius: 2 }}>Status</InputLabel>
                        <Select
                          {...field}
                          label="Status"
                          sx={{ borderRadius: 2 }}
                          onChange={(e) => setFieldValue('status', e.target.value)}
                        >
                          {Object.entries(EMPLOYEE_STATUS).map(([key, val]) => (
                            <MenuItem key={key} value={val}>
                              {val.charAt(0).toUpperCase() + val.slice(1)}
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.status && errors.status && <FormHelperText>{errors.status}</FormHelperText>}
                      </FormControl>
                    )}
                  </Field>
                </Grid>
              </Grid>
            </Paper>

            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Contact Information
              </Typography>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field name="email">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Email"
                        type="email"
                        fullWidth
                        size="medium"
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        slotProps={{ input: { sx: { borderRadius: 2 } } }}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field name="phone">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Phone"
                        fullWidth
                        size="medium"
                        error={touched.phone && Boolean(errors.phone)}
                        helperText={touched.phone && errors.phone}
                        slotProps={{ input: { sx: { borderRadius: 2 } } }}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field name="street">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Street"
                        fullWidth
                        size="medium"
                        slotProps={{ input: { sx: { borderRadius: 2 } } }}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field name="city">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="City"
                        fullWidth
                        size="medium"
                        slotProps={{ input: { sx: { borderRadius: 2 } } }}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field name="state">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="State"
                        fullWidth
                        size="medium"
                        slotProps={{ input: { sx: { borderRadius: 2 } } }}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field name="country">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Country"
                        fullWidth
                        size="medium"
                        slotProps={{ input: { sx: { borderRadius: 2 } } }}
                      />
                    )}
                  </Field>
                </Grid>
              </Grid>
            </Paper>

            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Skills
              </Typography>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field name="primarySkill">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Primary Skill"
                        fullWidth
                        size="medium"
                        slotProps={{ input: { sx: { borderRadius: 2 } } }}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field name="experienceYears">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Years of Experience"
                        type="number"
                        fullWidth
                        size="medium"
                        slotProps={{ input: { sx: { borderRadius: 2 } } }}
                      />
                    )}
                  </Field>
                </Grid>
              </Grid>
            </Paper>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/employees')}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || loading}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Save size={18} />}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              >
                {loading ? 'Saving...' : isEdit ? 'Update Employee' : 'Create Employee'}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default EmployeeForm;
