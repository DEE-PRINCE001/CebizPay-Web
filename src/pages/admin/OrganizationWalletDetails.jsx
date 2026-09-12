import React, { useState, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Breadcrumb from '../../components/common/Breadcrumb.jsx';
import SearchInput from '../../components/forms/SearchInput.jsx';
import Button from '../../components/common/Button.jsx';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/common/table/index.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import FilterDropdown from '../../components/forms/FilterDropdown.jsx';
import { ChevronDown, PiggyBank } from 'lucide-react';

// Isolated Phase 1 Mock Data (easily replaced by live TanStack queries in Phase 2)
import {
  MOCK_ORGANIZATION_WALLETS,
  MOCK_ORGANIZATION_SALARIES,
  MOCK_ORGANIZATION_SAVINGS,
} from '../../data/mockWallets.js';

export default function OrganizationWalletDetails() {
  const { id } = useParams();
  const location = useLocation();

  // Find organization or use fallback from location state or mock list
  const organization = useMemo(() => {
    return (
      location.state?.organization ||
      MOCK_ORGANIZATION_WALLETS.find((org) => org.id === id) ||
      MOCK_ORGANIZATION_WALLETS[0]
    );
  }, [id, location.state]);

  const [activeTab, setActiveTab] = useState('Salaries'); // 'Salaries' | 'Organization Saving Plan'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const orgName = organization?.name || 'Cebis';
  const currentBalance = organization?.currentBalance ?? 238000909;
  const totalSalaryPaid = organization?.totalSalaryPaid ?? 238000909;
  const totalLoanFund = organization?.totalLoanPaid ?? 238000909;

  // Filter salaries by search query and status
  const filteredSalaries = useMemo(() => {
    return MOCK_ORGANIZATION_SALARIES.filter((item) => {
      const matchesSearch =
        !searchQuery.trim() ||
        item.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.accountOrWalletId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.month.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        !selectedStatus || item.status.toLowerCase() === selectedStatus.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatus]);

  const totalSalariesCount = 130; // Matches reference image of 130
  const totalPages = Math.max(1, Math.ceil(totalSalariesCount / pageSize));

  const handleExportSalaries = () => {
    const headers = 'Amount,Transaction ID,Method,Acct/Wallet ID,Months,Date n Time,Status';
    const rows = filteredSalaries.map((s) =>
      `"${s.amount.toLocaleString()}","${s.transactionId}","${s.method}","${s.accountOrWalletId}","${s.month}","${s.dateTime}","${s.status}"`
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `salaries_${orgName.replace(/\s+/g, '_')}_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        {/* Breadcrumb Header matching '< Cebis - Wallet' */}
        <Breadcrumb
          parentLabel={orgName}
          parentTo="/wallets/organization"
          currentLabel="Wallet"
        />

        {/* Top 3 Summary Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* Card 1: Current Balance */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 flex flex-col justify-center">
            <h2 className="text-xs sm:text-sm font-semibold text-slate-500 mb-4">
              Current Balance
            </h2>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary-text tracking-tight">
              ₦{Number(currentBalance).toLocaleString('en-US')}
            </p>
          </div>

          {/* Card 2: Total Salary Paid */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 flex flex-col justify-center">
            <h2 className="text-xs sm:text-sm font-semibold text-slate-500 mb-4">
              Total Salary Paid
            </h2>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary-text tracking-tight">
              ₦{Number(totalSalaryPaid).toLocaleString('en-US')}
            </p>
          </div>

          {/* Card 3: Total Loan Fund */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 flex flex-col justify-center">
            <h2 className="text-xs sm:text-sm font-semibold text-slate-500 mb-4">
              Total Loan Fund
            </h2>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary-text tracking-tight">
              ₦{Number(totalLoanFund).toLocaleString('en-US')}
            </p>
          </div>
        </div>

        {/* Bottom Card Container with Tabs */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xs border border-slate-100 flex flex-col space-y-6">
          {/* Tab Navigation Header */}
          <div className="flex items-center space-x-6 sm:space-x-8 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('Salaries')}
              className={`pb-3 text-xs sm:text-sm transition-colors cursor-pointer select-none ${
                activeTab === 'Salaries'
                  ? 'border-b-2 border-primary font-bold text-primary -mb-px'
                  : 'text-slate-500 hover:text-slate-700 font-medium'
              }`}
            >
              Salaries
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('Organization Saving Plan')}
              className={`pb-3 text-xs sm:text-sm transition-colors cursor-pointer select-none ${
                activeTab === 'Organization Saving Plan'
                  ? 'border-b-2 border-primary font-bold text-primary -mb-px'
                  : 'text-slate-500 hover:text-slate-700 font-medium'
              }`}
            >
              Organization Saving Plan
            </button>
          </div>

          {/* Tab Content 1: Salaries */}
          {activeTab === 'Salaries' ? (
            <div className="flex flex-col space-y-6">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="w-full sm:w-auto">
                  <SearchInput
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    onClear={() => setSearchQuery('')}
                    placeholder="Search"
                    className="w-full sm:w-72"
                  />
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-auto relative">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleExportSalaries}
                    className="w-auto px-6 py-2"
                  >
                    Export
                  </Button>

                  <div className="relative">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => setIsFilterOpen((prev) => !prev)}
                      className="w-auto px-6 py-2 flex items-center space-x-2"
                    >
                      <span>Filter</span>
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </Button>

                    <FilterDropdown
                      isOpen={isFilterOpen}
                      onClose={() => setIsFilterOpen(false)}
                      onSelect={(status) => {
                        setSelectedStatus(status);
                        setCurrentPage(1);
                      }}
                      selectedStatus={selectedStatus}
                    />
                  </div>
                </div>
              </div>

              {/* Salaries Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Amount</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Acct/Wallet ID</TableHead>
                      <TableHead>Months</TableHead>
                      <TableHead>Date n Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSalaries.length > 0 ? (
                      filteredSalaries.map((sal) => (
                        <TableRow key={sal.id}>
                          <TableCell className="text-xs sm:text-sm font-semibold text-primary-text">
                            {Number(sal.amount).toLocaleString('en-US')}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm text-slate-600">
                            {sal.transactionId}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm text-slate-600">
                            {sal.method}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm text-slate-600">
                            {sal.accountOrWalletId}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm text-slate-600">
                            {sal.month}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm text-slate-600 whitespace-nowrap">
                            {sal.dateTime}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={sal.status} />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                          No salary transactions found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Table Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalSalariesCount}
                onPageChange={setCurrentPage}
              />
            </div>
          ) : (
            /* Tab Content 2: Organization Saving Plan */
            <div className="py-4">
              {MOCK_ORGANIZATION_SAVINGS.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {MOCK_ORGANIZATION_SAVINGS.map((plan) => (
                    <div key={plan.id} className="py-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <PiggyBank className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary-text text-sm sm:text-base">{plan.name}</h4>
                          <p className="text-xs text-slate-400">
                            Target: ₦{Number(plan.targetAmount).toLocaleString()} • {plan.frequency}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-sm sm:text-base text-primary">
                          ₦{Number(plan.currentAmount).toLocaleString()}
                        </span>
                        <div className="mt-0.5">
                          <StatusBadge status={plan.status} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <PiggyBank className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold text-primary-text">No Saving Plans</h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
                    This organization does not have any active corporate savings plans enrolled.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
