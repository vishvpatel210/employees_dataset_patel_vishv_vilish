import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MasterLayout from './components/MasterLayout';
import RequireAuth from './components/RequireAuth';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
            <p className="text-center text-gray-500">Authentication form will go here</p>
          </div>
        </div>
      } />

      {/* Protected Routes inside Master Layout */}
      <Route element={<RequireAuth />}>
        <Route element={<MasterLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<div className="p-4">Employees Listing Page</div>} />
          <Route path="/analytics" element={<div className="p-4">Analytics Page</div>} />
          <Route path="/settings" element={<div className="p-4">Settings Page</div>} />
        </Route>
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
