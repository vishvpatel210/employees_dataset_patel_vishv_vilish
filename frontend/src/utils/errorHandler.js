import toast from 'react-hot-toast';

export const getErrorMessage = (err) => {
  if (!err) return 'Something went wrong';

  if (typeof err === 'string') return err;

  if (err.response?.data?.message) {
    const msg = err.response.data.message;
    return Array.isArray(msg) ? msg.join(', ') : msg;
  }

  if (err.response?.data?.error) {
    const msg = err.response.data.error;
    return Array.isArray(msg) ? msg.join(', ') : msg;
  }

  if (err.message) return err.message;

  return 'Something went wrong';
};

export const handleApiError = (err, customMessage) => {
  const message = customMessage || getErrorMessage(err);
  toast.error(message);
  return message;
};

export const handleApiSuccess = (message) => {
  toast.success(message);
};

export const isNetworkError = (err) => {
  return !err.response && err.message === 'Network Error';
};

export const isUnauthorized = (err) => {
  return err.response?.status === 401;
};

export const isForbidden = (err) => {
  return err.response?.status === 403;
};

export const isNotFound = (err) => {
  return err.response?.status === 404;
};

export const isValidationError = (err) => {
  return err.response?.status === 400;
};

export const isServerError = (err) => {
  return err.response?.status >= 500;
};
