import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as employeeService from '../../services/employeeService';

export const fetchEmployees = createAsyncThunk(
  'employees/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await employeeService.getEmployees(params);
      const currentPage = params?.page || 1;
      const pageLimit = params?.limit || 10;
      const pagination = data.pagination || {};
      const count = data.data?.length || data.count || 0;
      const total = pagination.next
        ? (pagination.next.page - 1) * pageLimit + count + 1
        : (currentPage - 1) * pageLimit + count;
      return {
        employees: data.data || data.employees || [],
        total,
        page: currentPage,
        limit: pageLimit,
        pagination,
      };
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
    sort: '',
    order: '',
    search: '',
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
    setEmployeeSort(state, action) {
      state.sort = action.payload.sort;
      state.order = action.payload.order;
    },
    setEmployeeSearch(state, action) {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.employees;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.items.unshift(action.payload.data || action.payload.employee || action.payload);
        state.total += 1;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const updated = action.payload.data || action.payload.employee || action.payload;
        const index = state.items.findIndex((e) => (e._id || e.id) === (updated._id || updated.id));
        if (index !== -1) state.items[index] = updated;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.items = state.items.filter((e) => (e._id || e.id) !== action.payload);
        state.total = Math.max(0, state.total - 1);
      });
  },
});

export const { setCurrentEmployee, clearEmployeeError, setEmployeeSort, setEmployeeSearch } = employeeSlice.actions;
export default employeeSlice.reducer;
