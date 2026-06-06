export const API_BASE_URL = 'http://localhost:5000/api/v1';

export const ROLES = {
  ADMIN: 'Admin',
  USER: 'User',
  EMPLOYEE: 'Employee',
  HR: 'HR',
};

export const AUTH_PATHS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
};

export const STORAGE_KEYS = {
  TOKEN: 'esphere_token',
  USER: 'esphere_user',
  THEME: 'esphere_theme',
};

export const EMPLOYEE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
};
