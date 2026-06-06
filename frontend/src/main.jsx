import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider, useSelector } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import store from './store'
import './index.css'

const ThemedApp = () => {
  const themeMode = useSelector((state) => state.ui.theme);
  const isDark = themeMode === 'dark';

  const theme = createTheme({
    palette: {
      mode: themeMode,
      ...(isDark
        ? {
            background: { default: '#030712', paper: '#111827' },
            primary: { main: '#3b82f6' },
            divider: '#1f2937',
            error: { main: '#ef4444', light: '#7f1d1d', dark: '#fca5a5' },
            warning: { main: '#f59e0b', light: '#78350f', dark: '#fcd34d' },
            grey: { 50: '#111827', 100: '#1f2937', 200: '#374151', 300: '#4b5563', 400: '#9ca3af', 500: '#6b7280' },
          }
        : {
            background: { default: '#f8fafc', paper: '#ffffff' },
            primary: { main: '#2563eb' },
            divider: '#e5e7eb',
            error: { main: '#ef4444', light: '#fef2f2', dark: '#dc2626' },
            warning: { main: '#f59e0b', light: '#fffbeb', dark: '#d97706' },
            grey: { 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280' },
          }),
    },
    typography: { fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif' },
    shape: { borderRadius: 8 },
    components: {
      MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
};

const ThemedToaster = () => {
  const themeMode = useSelector((state) => state.ui.theme);
  const isDark = themeMode === 'dark';

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: '10px',
          background: isDark ? '#1e293b' : '#fff',
          color: isDark ? '#f8fafc' : '#1e293b',
          fontSize: '0.875rem',
          border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
          boxShadow: isDark
            ? '0 10px 40px rgba(0,0,0,0.4)'
            : '0 10px 40px rgba(0,0,0,0.1)',
        },
        success: {
          iconTheme: { primary: '#22c55e', secondary: isDark ? '#1e293b' : '#fff' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: isDark ? '#1e293b' : '#fff' },
        },
      }}
    />
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemedApp />
        <ThemedToaster />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
