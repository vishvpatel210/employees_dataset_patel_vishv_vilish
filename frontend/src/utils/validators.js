import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
});

export const registerSchema = yup.object({
  name: yup.string().min(2, 'Min 2 characters').required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export const forgotPasswordSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
});

export const resetPasswordSchema = yup.object({
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export const employeeSchema = yup.object({
  name: yup.string().min(2, 'Min 2 characters').required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  department: yup.string().required('Department is required'),
  designation: yup.string().required('Designation is required'),
  salary: yup.number().positive('Must be positive').required('Salary is required'),
  status: yup.string().oneOf(['active', 'inactive', 'suspended']).required('Status is required'),
});
