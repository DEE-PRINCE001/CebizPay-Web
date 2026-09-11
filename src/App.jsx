import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient.js';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProtectedRoute } from './components/guards/index.js';
import Login from './pages/auth/Login.jsx';
import RegisterBusiness1 from './pages/auth/RegisterBusiness1.jsx';
import RegisterBusiness2 from './pages/auth/RegisterBusiness2.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Organizations from './pages/admin/Organizations.jsx';
import OrganizationDetails from './pages/admin/OrganizationDetails.jsx';
import Individuals from './pages/admin/Individuals.jsx';
import IndividualDetails from './pages/admin/IndividualDetails.jsx';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Navigate to="/register/business" replace />} />
            <Route path="/register/business" element={<RegisterBusiness1 />} />
            <Route path="/register/business/step-1" element={<RegisterBusiness1 />} />
            <Route path="/register/business/step-2" element={<RegisterBusiness2 />} />

            {/* Protected Routes (unauthenticated visitors redirect to /login) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/organization" element={<Organizations />} />
              <Route path="/organization/:id" element={<OrganizationDetails />} />
              <Route path="/individual" element={<Individuals />} />
              <Route path="/individual/:id" element={<IndividualDetails />} />

              {/* Admin alias routes */}
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/organizations" element={<Organizations />} />
              <Route path="/admin/organizations/:id" element={<OrganizationDetails />} />
              <Route path="/admin/individuals" element={<Individuals />} />
              <Route path="/admin/individuals/:id" element={<IndividualDetails />} />
            </Route>

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
