import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Button, Alert } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import EmployeeForm from './EmployeeForm';
import { getEmployeeById } from '../services/employeeService';

const EmployeeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await getEmployeeById(id);
        setEmployee(data.data || data.employee || data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load employee');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Button onClick={() => navigate('/employees')} startIcon={<ArrowLeft size={18} />} sx={{ borderRadius: 2, textTransform: 'none', mb: 2 }}>
          Back to Employees
        </Button>
        <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
      </Box>
    );
  }

  if (!employee) {
    return (
      <Box>
        <Button onClick={() => navigate('/employees')} startIcon={<ArrowLeft size={18} />} sx={{ borderRadius: 2, textTransform: 'none', mb: 2 }}>
          Back to Employees
        </Button>
        <Alert severity="warning" sx={{ borderRadius: 2 }}>Employee not found.</Alert>
      </Box>
    );
  }

  return <EmployeeForm employee={employee} isEdit />;
};

export default EmployeeEdit;
