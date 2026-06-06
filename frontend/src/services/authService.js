import api from './api';

export const loginUser = (credentials) => api.post('/auth/login', credentials);

export const registerUser = (userData) => api.post('/auth/register', userData);

export const logoutUser = () => api.post('/auth/logout');

export const getProfile = () => api.get('/auth/profile');

export const updateProfile = (data) => api.patch('/auth/profile', data);

export const deleteProfile = () => api.delete('/auth/profile');

export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });

export const resetPassword = (data) => api.post('/auth/reset-password', data);

export const changePassword = (data) => api.post('/auth/change-password', data);

export const verifyEmail = (token) => api.post('/auth/verify-email', { token });

export const sendOtp = (email) => api.post('/auth/send-otp', { email });

export const verifyOtp = (email, otp) => api.post('/auth/verify-otp', { email, otp });

export const resendVerification = (email) => api.post('/auth/resend-verification', { email });
