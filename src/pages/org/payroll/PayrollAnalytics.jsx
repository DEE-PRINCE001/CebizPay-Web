import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import OrgDashboardLayout from '../../../components/layout/OrgDashboardLayout.jsx';
import Breadcrumb from '../../../components/common/Breadcrumb.jsx';
import Button from '../../../components/common/Button.jsx';
import OrgMetricCard from '../../../components/cards/OrgMetricCard.jsx';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { payrollService } from '../../../api/services/payroll.service.js';

const TABS = [
  { id: 'general', label: 'General Analytics' },
  { id: 'payrollSpend', label: 'Payroll Spend Breakdown' },
  { id: 'salariesAnalytics', label: 'Salaries Analytics' },
  { id: 'othersAnalytics', label: 'Others Analytics' },
];

function formatMetricAmount(amount) {
  if (amount == null) return '0.00';
  return Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function PayrollAnalytics() {
  const [activeTab, setActiveTab] = useState('general');
  const currentYear = new Date().getFullYear();

  const handleToggleMenu = () => {
    window.dispatchEvent(new CustomEvent('toggle-payroll-menu'));
  };

  // Fetch live organization analytics
  const {
    data: analyticsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['org-payroll-analytics', currentYear],
    queryFn: () => payrollService.getAnalytics({ year: currentYear, currency: 'NGN' }),
    staleTime: 60 * 1000,
  });

  const metrics = analyticsData?.metrics;
  const breakdown = analyticsData?.breakdown;
  const currentCards = (breakdown && breakdown[activeTab]) || [];

  return (
    <OrgDashboardLayout>
      <div className="flex flex-col space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Breadcrumb
            parentLabel="Cebis"
            currentLabel="Payroll Analytics"
            parentTo="/org/dashboard"
            className="!mb-0"
          />

          <div className="flex items-center space-x-3 self-end sm:self-auto">
            <Button
              variant="outline"
              size="md"
              onClick={handleToggleMenu}
              className="w-auto px-6 py-2 text-xs sm:text-sm font-medium"
            >
              Payrolls
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {}}
              className="w-auto px-6 py-2 text-xs sm:text-sm font-semibold"
            >
              Pay Salaries
            </Button>
          </div>
        </div>

        {/* Global Fetch Error Banner */}
        {isError && (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-4 flex items-center justify-between text-red-700">
            <div className="flex items-center space-x-2 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                {error?.message || 'Unable to load payroll analytics data at this time.'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center space-x-1 text-xs font-semibold underline hover:text-red-900 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* 4 Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <OrgMetricCard
            title="Total Payroll Spend (local)"
            value={formatMetricAmount(metrics?.totalSpendLocal?.amount)}
            currency="₦"
            isLoading={isLoading}
            isError={isError}
            subtext={metrics?.totalSpendLocal?.trendDescription || ''}
          />
          <OrgMetricCard
            title="Total Payroll Spend (International)"
            value={formatMetricAmount(metrics?.totalSpendInternational?.amount)}
            currency="$"
            isLoading={isLoading}
            isError={isError}
            subtext={metrics?.totalSpendInternational?.trendDescription || ''}
          />
          <OrgMetricCard
            title="Total Payroll Spend (USDT)"
            value={formatMetricAmount(metrics?.totalSpendUsdt?.amount)}
            currency="₮"
            isLoading={isLoading}
            isError={isError}
            subtext={metrics?.totalSpendUsdt?.trendDescription || ''}
          />
          <OrgMetricCard
            title="Total No. of Employee Paid"
            value={metrics?.totalEmployeesPaid?.count != null ? String(metrics.totalEmployeesPaid.count) : '0'}
            currency=""
            isLoading={isLoading}
            isError={isError}
            subtext={metrics?.totalEmployeesPaid?.trendDescription || ''}
          />
        </div>

        {/* Main Analytics Container with Tabs */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 shadow-xs border border-slate-100 flex flex-col space-y-6">
          {/* Tab Navigation */}
          <div className="w-full border-b border-slate-200 overflow-x-auto">
            <div className="flex items-center space-x-8 min-w-max">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 text-xs sm:text-sm transition-all relative select-none cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'font-bold text-primary-text'
                        : 'font-medium text-slate-500 hover:text-primary-text'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {isActive && (
                      <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary rounded-full animate-in fade-in" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              {[1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className="border border-slate-100 rounded-2xl p-6 sm:p-8 bg-slate-50/50 min-h-[380px] flex flex-col justify-center items-center text-center animate-pulse"
                >
                  <Loader2 className="w-6 h-6 animate-spin text-primary mb-3" />
                  <span className="text-xs text-slate-400 font-medium">Loading insight...</span>
                </div>
              ))}
            </div>
          ) : currentCards.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center space-y-2">
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                No analytics breakdown available for this category yet.
              </p>
              <p className="text-xs text-slate-400">
                Disbursements and payroll runs in this period will populate insights here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              {currentCards.map((card) => (
                <div
                  key={card.id || card.title}
                  className="border border-slate-200 rounded-2xl p-6 sm:p-8 bg-white min-h-[380px] flex flex-col justify-start items-center text-center shadow-2xs hover:border-slate-300 transition-all"
                >
                  <h4 className="text-sm sm:text-base font-bold text-primary-text mb-3">
                    {card.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xs">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </OrgDashboardLayout>
  );
}
