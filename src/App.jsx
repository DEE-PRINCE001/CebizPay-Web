import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient.js';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProtectedRoute, OrgGuard, AdminGuard } from './components/guards/index.js';
import { useAuth } from './hooks/useAuth.js';
import Login from './pages/auth/Login.jsx';
import RegisterBusiness1 from './pages/auth/RegisterBusiness1.jsx';
import RegisterBusiness2 from './pages/auth/RegisterBusiness2.jsx';
import Navbar from './components/layout/Navbar.jsx';
import DashboardLayout from './components/layout/DashboardLayout.jsx';

function DashboardPlaceholder() {
  const { user, logout, hasOrgContext, isAdmin } = useAuth();
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Welcome to CebizPay</h1>
      <p>Logged in as: <strong>{user?.fullName || user?.name || user?.email}</strong></p>
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            
            <Route path="/dashboard-test" element={<DashboardLayout/> } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Navigate to="/register/business" replace />} />
            <Route path="/register/business" element={<RegisterBusiness1 />} />
            <Route path="/register/business/step-1" element={<RegisterBusiness1 />} />
            <Route path="/register/business/step-2" element={<RegisterBusiness2 />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPlaceholder />} />

              {/* Organization Protected Routes */}
              <Route element={<OrgGuard />}>
                {/* Workforce, Payroll, ERP routes */}
              </Route>

              {/* Platform Admin Protected Routes */}
              <Route element={<AdminGuard />}>
                {/* Admin routes */}
              </Route>
            </Route>

            {/* Default Route */}
            <Route path="*" element={<Navigate to="/dashboard-test" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
