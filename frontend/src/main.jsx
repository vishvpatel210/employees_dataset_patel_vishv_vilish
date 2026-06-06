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
  const theme = createTheme({
    palette: {
      mode: themeMode,
      ...(themeMode === 'dark'
        ? {
            background: { default: '#030712', paper: '#111827' },
            primary: { main: '#3b82f6' },
            divider: '#1f2937',
            grey: { 50: '#111827', 100: '#1f2937', 200: '#374151' },
          }
        : {
            background: { default: '#f8fafc', paper: '#ffffff' },
            primary: { main: '#2563eb' },
            divider: '#e5e7eb',
            grey: { 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb' },
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemedApp />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { borderRadius: '10px', background: '#1e293b', color: '#f8fafc', fontSize: '0.875rem' },
            success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
