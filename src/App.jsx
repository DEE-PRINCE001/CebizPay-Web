import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient.js';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProtectedRoute, OrgGuard, AdminGuard } from './components/guards/index.js';
import { useAuth } from './hooks/useAuth.js';

function DashboardPlaceholder() {
  const { user, logout, hasOrgContext, isAdmin } = useAuth();
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Welcome to CebizPay</h1>
      <p>Logged in as: <strong>{user?.name || user?.email}</strong></p>
      <p>Context: <strong>{hasOrgContext ? 'Organization Member' : 'Individual Account'}</strong></p>
      <p>Role(s): <strong>{user?.roles?.join(', ') || 'Standard User'}</strong></p>
      {isAdmin && <p style={{ color: '#2563eb', fontWeight: 600 }}>Platform Administrator Privileges Active</p>}
      <button
        onClick={logout}
        style={{
          padding: '0.5rem 1rem',
          background: '#ef4444',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Log Out
      </button>
    </div>
  );
}

function LoginPlaceholder() {
  return (
    <div className='text-4xl text-primary-text bg-background p-5 rounded-xl m-5'>
      <h2 className='text-2xl font-bold mb-4 font-satoshi text-primary'>CebizPay Login</h2>
      <p>Ready for authentication screen integration.</p>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPlaceholder />} />

            {/* Protected Routes (All Authenticated Users) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPlaceholder />} />

              {/* Organization Protected Routes */}
              <Route element={<OrgGuard />}>
                {/* Workforce, Payroll, ERP routes will be placed here */}
              </Route>

              {/* Platform Admin Protected Routes */}
              <Route element={<AdminGuard />}>
                {/* Audit logs, EDD cases, reconciliation, platform fee policies */}
              </Route>
            </Route>

            {/* Default Route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
