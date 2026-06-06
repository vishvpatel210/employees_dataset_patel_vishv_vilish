import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../utils/constants';

const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: storedTheme,
    sidebarOpen: true,
    loading: false,
    alerts: [],
  },
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEYS.THEME, state.theme);
    },
    setTheme(state, action) {
      state.theme = action.payload;
      localStorage.setItem(STORAGE_KEYS.THEME, state.theme);
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    addAlert(state, action) {
      state.alerts.push({ id: Date.now(), ...action.payload });
    },
    removeAlert(state, action) {
      state.alerts = state.alerts.filter((a) => a.id !== action.payload);
    },
  },
});

export const { toggleTheme, setTheme, toggleSidebar, setLoading, addAlert, removeAlert } = uiSlice.actions;
export default uiSlice.reducer;
