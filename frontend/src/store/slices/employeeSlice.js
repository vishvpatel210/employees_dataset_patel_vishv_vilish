import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as employeeService from '../../services/employeeService';

export const fetchEmployees = createAsyncThunk(
  'employees/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await employeeService.getEmployees(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch employees');
    }
  }
);

export const createEmployee = createAsyncThunk(
  'employees/create',
  async (employeeData, { rejectWithValue }) => {
    try {
      const { data } = await employeeService.createEmployee(employeeData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create employee');
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/update',
  async ({ id, ...employeeData }, { rejectWithValue }) => {
    try {
      const { data } = await employeeService.updateEmployee(id, employeeData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update employee');
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (id, { rejectWithValue }) => {
    try {
      await employeeService.deleteEmployee(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete employee');
    }
  }
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    items: [],
    total: 0,
    page: 1,
    limit: 10,
    loading: false,
    error: null,
    current: null,
  },
  reducers: {
    setCurrentEmployee(state, action) {
      state.current = action.payload;
    },
    clearEmployeeError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.employees || action.payload.data || [];
        state.total = action.payload.total || action.payload.count || 0;
        state.page = action.payload.page || 1;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.items.unshift(action.payload.employee || action.payload.data || action.payload);
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const updated = action.payload.employee || action.payload.data || action.payload;
        const index = state.items.findIndex((e) => e._id === updated._id);
        if (index !== -1) state.items[index] = updated;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.items = state.items.filter((e) => e._id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      });
  },
});

export const { setCurrentEmployee, clearEmployeeError } = employeeSlice.actions;
export default employeeSlice.reducer;
