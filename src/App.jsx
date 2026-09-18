import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient.js';
import { AuthProvider } from './context/AuthContext.jsx';
import {
  ProtectedRoute,
  AdminGuard,
  OrgGuard,
  GuestRoute,
  RootRedirect,
} from './components/guards/index.js';
import Login from './pages/auth/Login.jsx';
import RegisterBusiness1 from './pages/auth/RegisterBusiness1.jsx';
import RegisterBusiness2 from './pages/auth/RegisterBusiness2.jsx';
import NotAuthorized from './pages/auth/NotAuthorized.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Organizations from './pages/admin/Organizations.jsx';
import OrganizationDetails from './pages/admin/OrganizationDetails.jsx';
import Individuals from './pages/admin/Individuals.jsx';
import IndividualDetails from './pages/admin/IndividualDetails.jsx';
import OrganizationWallets from './pages/admin/OrganizationWallets.jsx';
import OrganizationWalletDetails from './pages/admin/OrganizationWalletDetails.jsx';
import IndividualWallets from './pages/admin/IndividualWallets.jsx';
import OrgDashboard from './pages/org/OrgDashboard.jsx';
import Members from './pages/org/Members.jsx';
import MemberDetails from './pages/org/MemberDetails.jsx';
import OrgWallet from './pages/org/OrgWallet.jsx';
import OrgSettings from './pages/org/OrgSettings.jsx';
import PayrollAnalytics from './pages/org/payroll/PayrollAnalytics.jsx';
import PayrollSchedules from './pages/org/payroll/PayrollSchedules.jsx';
import PayrollHistory from './pages/org/payroll/PayrollHistory.jsx';
import PaymentBreakdown from './pages/org/payroll/PaymentBreakdown.jsx';
import PaymentDetails from './pages/org/payroll/PaymentDetails.jsx';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Guest-only routes */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Navigate to="/register/business" replace />} />
            </Route>

            {/* Authenticated routes */}
            <Route element={<ProtectedRoute />}>
              {/* Business registration */}
              <Route path="/register/business" element={<RegisterBusiness1 />} />
              <Route path="/register/business/step-1" element={<RegisterBusiness1 />} />
              <Route path="/register/business/step-2" element={<RegisterBusiness2 />} />

              {/* 403 Forbidden */}
              <Route path="/unauthorized" element={<NotAuthorized />} />

              {/* Platform Admin routes */}
              <Route element={<AdminGuard fallbackPath="/unauthorized" />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/organization" element={<Organizations />} />
                <Route path="/organization/:id" element={<OrganizationDetails />} />
                <Route path="/individual" element={<Individuals />} />
                <Route path="/individual/:id" element={<IndividualDetails />} />

                {/* Wallet routes */}
                <Route path="/wallets" element={<Navigate to="/wallets/organization" replace />} />
                <Route path="/wallet" element={<Navigate to="/wallets/organization" replace />} />
                <Route path="/wallets/organization" element={<OrganizationWallets />} />
                <Route path="/wallets/organizations" element={<OrganizationWallets />} />
                <Route path="/wallets/organization/:id" element={<OrganizationWalletDetails />} />
                <Route path="/wallets/individual" element={<IndividualWallets />} />
                <Route path="/wallets/individuals" element={<IndividualWallets />} />

                {/* Admin alias routes */}
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/organizations" element={<Organizations />} />
                <Route path="/admin/organizations/:id" element={<OrganizationDetails />} />
                <Route path="/admin/individuals" element={<Individuals />} />
                <Route path="/admin/individuals/:id" element={<IndividualDetails />} />
                <Route path="/admin/wallets/organization" element={<OrganizationWallets />} />
                <Route path="/admin/wallets/organization/:id" element={<OrganizationWalletDetails />} />
                <Route path="/admin/wallets/individual" element={<IndividualWallets />} />
              </Route>

              {/* Organization tenant routes */}
              <Route element={<OrgGuard fallbackPath="/unauthorized" />}>
                <Route path="/org/dashboard" element={<OrgDashboard />} />
                <Route path="/org/members" element={<Members />} />
                <Route path="/org/members/:id" element={<MemberDetails />} />
                <Route path="/org/wallet" element={<OrgWallet />} />
                <Route path="/org/settings" element={<OrgSettings />} />
                <Route path="/org/payroll" element={<PayrollAnalytics />} />
                <Route path="/org/payroll/analytics" element={<PayrollAnalytics />} />
                <Route path="/org/payroll/schedules" element={<PayrollSchedules />} />
                <Route path="/org/payroll/history" element={<PayrollHistory />} />
                <Route path="/org/payroll/history/:batchId" element={<PaymentBreakdown />} />
                <Route path="/org/payroll/breakdown" element={<PaymentBreakdown />} />
                <Route path="/org/payroll/payments/:paymentId" element={<PaymentDetails />} />
                <Route path="/org/payroll/details" element={<PaymentDetails />} />
              </Route>
            </Route>

            {/* Dynamic root dispatch & wildcard catch-all */}
            <Route path="/" element={<RootRedirect />} />
            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
