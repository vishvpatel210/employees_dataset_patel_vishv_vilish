import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, getProfile, forgotPassword, resetPassword, logoutUser } from '../../services/authService';
import { STORAGE_KEYS } from '../../utils/constants';

const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await loginUser(credentials);
    localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
    return data;
  } catch (err) {
    const message = err.response?.data?.message || err.response?.data?.error || 'Login failed';
    return rejectWithValue(Array.isArray(message) ? message.join(', ') : message);
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await registerUser(userData);
    localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
    return data;
  } catch (err) {
    const message = err.response?.data?.message || err.response?.data?.error || 'Registration failed';
    return rejectWithValue(Array.isArray(message) ? message.join(', ') : message);
  }
});

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getProfile();
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
  }
});

export const forgotPasswordAction = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    const { data } = await forgotPassword(email);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to send reset email');
  }
});

export const resetPasswordAction = createAsyncThunk('auth/resetPassword', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await resetPassword(payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to reset password');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    isAuthenticated: !!storedToken,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    logout(state) {
      logoutUser().catch(() => {});
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.successMessage = null;
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    },
    clearError(state) {
      state.error = null;
    },
    clearSuccess(state) {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; state.successMessage = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; state.successMessage = null; })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        const userData = action.payload.data || action.payload.user || action.payload;
        state.user = userData;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      })
      .addCase(forgotPasswordAction.pending, (state) => { state.loading = true; state.error = null; state.successMessage = null; })
      .addCase(forgotPasswordAction.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || 'Password reset link sent to email';
      })
      .addCase(forgotPasswordAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetPasswordAction.pending, (state) => { state.loading = true; state.error = null; state.successMessage = null; })
      .addCase(resetPasswordAction.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || 'Password has been reset successfully';
      })
      .addCase(resetPasswordAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, clearSuccess } = authSlice.actions;
export default authSlice.reducer;
