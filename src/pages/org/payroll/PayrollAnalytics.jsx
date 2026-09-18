import React, { useState } from 'react';
import OrgDashboardLayout from '../../../components/layout/OrgDashboardLayout.jsx';
import Breadcrumb from '../../../components/common/Breadcrumb.jsx';
import Button from '../../../components/common/Button.jsx';
import OrgMetricCard from '../../../components/cards/OrgMetricCard.jsx';
import {
  MOCK_PAYROLL_METRICS,
  MOCK_ANALYTICS_BREAKDOWN,
} from '../../../data/mockPayrollData.js';

const TABS = [
  { id: 'general', label: 'General Analytics' },
  { id: 'payrollSpend', label: 'Payroll Spend Breakdown' },
  { id: 'salariesAnalytics', label: 'Salaries Analytics' },
  { id: 'othersAnalytics', label: 'Others Analytics' },
];

export default function PayrollAnalytics() {
  const [activeTab, setActiveTab] = useState('general');

  const currentCards =
    MOCK_ANALYTICS_BREAKDOWN[activeTab] || MOCK_ANALYTICS_BREAKDOWN.general;

  const handleToggleMenu = () => {
    window.dispatchEvent(new CustomEvent('toggle-payroll-menu'));
  };

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

        {/* 4 Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <OrgMetricCard
            title="Total Payroll Spend (local)"
            value={MOCK_PAYROLL_METRICS.totalSpendLocal}
            currency={MOCK_PAYROLL_METRICS.localCurrencySymbol}
            subtext={MOCK_PAYROLL_METRICS.localSpendTrend}
          />
          <OrgMetricCard
            title="Total Payroll Spend (International)"
            value={MOCK_PAYROLL_METRICS.totalSpendInternational}
            currency={MOCK_PAYROLL_METRICS.internationalCurrencySymbol}
            subtext={MOCK_PAYROLL_METRICS.internationalSpendTrend}
          />
          <OrgMetricCard
            title="Total Payroll Spend (USDT)"
            value={MOCK_PAYROLL_METRICS.totalSpendUsdt}
            currency={MOCK_PAYROLL_METRICS.usdtCurrencySymbol}
            subtext={MOCK_PAYROLL_METRICS.usdtSpendTrend}
          />
          <OrgMetricCard
            title="Total No. of Employee Paid"
            value={MOCK_PAYROLL_METRICS.totalEmployeesPaid}
            currency=""
            subtext={MOCK_PAYROLL_METRICS.employeesPaidTrend}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            {currentCards.map((card) => (
              <div
                key={card.id}
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
        </div>
      </div>
    </OrgDashboardLayout>
  );
}
