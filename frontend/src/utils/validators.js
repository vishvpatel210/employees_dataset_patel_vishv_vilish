import * as yup from 'yup';

const passwordRules = {
  minLength: 8,
  maxLength: 128,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 0,
};

export const loginSchema = yup.object({
  email: yup.string().email('Enter a valid email address').required('Email is required'),
  password: yup.string().required('Password is required'),
  rememberMe: yup.boolean(),
});

export const registerSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
    .required('Full name is required'),
  email: yup.string().email('Enter a valid email address').required('Email is required'),
  password: yup
    .string()
    .min(passwordRules.minLength, `Password must be at least ${passwordRules.minLength} characters`)
    .max(passwordRules.maxLength, `Password must be at most ${passwordRules.maxLength} characters`)
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  role: yup.string().oneOf(['User', 'Employee', 'HR', 'Admin'], 'Select a valid role').required('Role is required'),
});

export const forgotPasswordSchema = yup.object({
  email: yup.string().email('Enter a valid email address').required('Email is required'),
});

export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .min(passwordRules.minLength, `Password must be at least ${passwordRules.minLength} characters`)
    .max(passwordRules.maxLength, `Password must be at most ${passwordRules.maxLength} characters`)
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

const phoneRegex = /^\+?[\d\s-()]{7,15}$/;

export const employeeSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .required('Name is required'),
  email: yup.string().email('Enter a valid email address').required('Email is required'),
  phone: yup.string().matches(phoneRegex, 'Enter a valid phone number').required('Phone is required'),
  department: yup.string().required('Department is required'),
  designation: yup.string().required('Designation is required'),
  salary: yup
    .number()
    .typeError('Salary must be a number')
    .positive('Salary must be a positive number')
    .required('Salary is required'),
  status: yup
    .string()
    .oneOf(['active', 'inactive', 'suspended'], 'Select a valid status')
    .required('Status is required'),
});
