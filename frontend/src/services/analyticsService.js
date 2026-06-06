import api from './api';

export const getEmployeeAnalytics = () => api.get('/analytics/employees');

export const getEmployeeStats = () => api.get('/stats/employees');
