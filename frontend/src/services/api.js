import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';
import { isNetworkError, isServerError } from '../utils/errorHandler';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error.config?.url?.startsWith('/auth/');

    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/auth/login';
      return Promise.reject({ ...error, message: 'Session expired. Please login again.' });
    }

    const message =
      error.response?.data?.message || error.response?.data?.error || error.message || 'Something went wrong';

    if (error.config?.silent !== true) {
      const shouldToast = error.config?.showToast !== false;

      if (shouldToast) {
        if (isNetworkError(error)) {
          toast.error('Network error. Please check your connection.');
        } else if (isServerError(error)) {
          toast.error('Server error. Please try again later.');
        } else if (error.response?.status === 403) {
          toast.error('You do not have permission to perform this action.');
        } else if (error.response?.status === 404) {
          toast.error('The requested resource was not found.');
        } else if (error.response?.status === 429) {
          toast.error('Too many requests. Please slow down.');
        } else {
          toast.error(Array.isArray(message) ? message.join(', ') : message);
        }
      }
    }

    return Promise.reject({ ...error, message: Array.isArray(message) ? message.join(', ') : message });
  }
);

export default api;
