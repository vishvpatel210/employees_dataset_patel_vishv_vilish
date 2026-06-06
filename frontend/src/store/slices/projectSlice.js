import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as projectService from '../../services/projectService';

export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await projectService.getProjects();
      return { projects: data.data || [] };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch projects');
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/create',
  async (projectData, { rejectWithValue }) => {
    try {
      const { data } = await projectService.createProject(projectData);
      return data.data || data.project || data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create project');
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ id, ...projectData }, { rejectWithValue }) => {
    try {
      const { data } = await projectService.updateProject(id, projectData);
      return data.data || data.project || data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update project');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (id, { rejectWithValue }) => {
    try {
      await projectService.deleteProject(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete project');
    }
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearProjectError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.projects;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.items.findIndex((p) => (p._id || p.id) === (updated._id || updated.id));
        if (index !== -1) state.items[index] = updated;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => (p._id || p.id) !== action.payload);
      });
  },
});

export const { clearProjectError } = projectSlice.actions;
export default projectSlice.reducer;
