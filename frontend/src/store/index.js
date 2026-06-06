import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import employeeReducer from './slices/employeeSlice';
import departmentReducer from './slices/departmentSlice';
import projectReducer from './slices/projectSlice';
import taskReducer from './slices/taskSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    departments: departmentReducer,
    projects: projectReducer,
    tasks: taskReducer,
    ui: uiReducer,
  },
});

export default store;
