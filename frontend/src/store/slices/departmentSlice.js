import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as departmentService from '../../services/departmentService';

export const fetchDepartments = createAsyncThunk(
  'departments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await departmentService.getDepartments();
      return { departments: data.data || [] };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch departments');
    }
  }
);

export const createDepartment = createAsyncThunk(
  'departments/create',
  async (departmentData, { rejectWithValue }) => {
    try {
      const { data } = await departmentService.createDepartment(departmentData);
      return data.data || data.department || data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create department');
    }
  }
);

export const updateDepartment = createAsyncThunk(
  'departments/update',
  async ({ id, ...departmentData }, { rejectWithValue }) => {
    try {
      const { data } = await departmentService.updateDepartment(id, departmentData);
      return data.data || data.department || data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update department');
    }
  }
);

export const deleteDepartment = createAsyncThunk(
  'departments/delete',
  async (id, { rejectWithValue }) => {
    try {
      await departmentService.deleteDepartment(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete department');
    }
  }
);

const departmentSlice = createSlice({
  name: 'departments',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearDepartmentError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.departments;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.items.findIndex((d) => (d._id || d.id) === (updated._id || updated.id));
        if (index !== -1) state.items[index] = updated;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.items = state.items.filter((d) => (d._id || d.id) !== action.payload);
      });
  },
});

export const { clearDepartmentError } = departmentSlice.actions;
export default departmentSlice.reducer;
