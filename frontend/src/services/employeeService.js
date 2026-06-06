import api from './api';

export const getEmployees = (params) => api.get('/employees', { params });

export const getEmployeeById = (id) => api.get(`/employees/${id}`);

export const createEmployee = (data) => api.post('/employees', data);

export const updateEmployee = (id, data) => api.patch(`/employees/${id}`, data);

export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

export const bulkDeleteEmployees = (ids) => api.delete('/employees/bulk-delete', { data: { ids } });
