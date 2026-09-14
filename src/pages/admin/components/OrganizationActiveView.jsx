import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Loader2 } from 'lucide-react';
import SearchInput from '../../../components/forms/SearchInput.jsx';
import Button from '../../../components/common/Button.jsx';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/common/table/index.js';
import StatusBadge from '../../../components/common/StatusBadge.jsx';
import Pagination from '../../../components/common/Pagination.jsx';
import FilterDropdown from '../../../components/forms/FilterDropdown.jsx';
import womanPhoto from '../../../assets/woman.svg';
import defaultProfile from '../../../assets/default-profile.svg';
import { adminService } from '../../../api/services/admin.service.js';

export default function OrganizationActiveView({
  organization,
  onSuspend,
  onReactivate,
  onPayrollSection,
  onViewStaff,
}) {
  const [activeTab, setActiveTab] = useState('staff');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const orgName = organization?.name || 'Organization';
  const isSuspended = organization?.status === 'Suspended';

  // 1. Live Staff Query: fetch from backend
  const {
    data: staffApiData,
    isLoading: isStaffLoading,
    isError: isStaffError,
    error: staffError,
  } = useQuery({
    queryKey: ['admin-org-staff', organization?.id, currentPage, searchQuery, selectedStatus],
    queryFn: () =>
      adminService.organizations.getStaff(organization?.id, {
        pageNumber: currentPage,
        pageSize: 10,
        search: searchQuery,
      }),
    enabled: !!organization?.id && activeTab === 'staff',
    staleTime: 30 * 1000,
    retry: false,
  });

  // 2. Live Payroll Analytics Query (live on backend)
  const { data: payrollAnalytics, isLoading: isPayrollLoading } = useQuery({
    queryKey: ['admin-org-payroll-analytics', organization?.id],
    queryFn: () => adminService.organizations.getPayrollAnalytics(organization?.id),
    enabled: !!organization?.id && activeTab === 'payroll',
    staleTime: 30 * 1000,
    retry: false,
  });

  const rawStaffList = useMemo(() => {
    if (staffApiData?.items && Array.isArray(staffApiData.items)) {
      return staffApiData.items.map((s) => ({
        id: s.id || s.staffId,
        name: s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Staff Member',
        walletId: s.walletId || s.accountNumber || 'N/A',
        bankAccount: s.bankAccount || s.bankAccountNumber || 'N/A',
        email: s.email || 'N/A',
        monthlySalary: s.monthlySalary != null ? String(s.monthlySalary) : 'N/A',
        status: s.status || 'Active',
        avatarUrl: s.avatarUrl || null,
      }));
    }
    return [];
  }, [staffApiData]);

  const filteredStaff = useMemo(() => {
    return rawStaffList.filter((staff) => {
      const matchesSearch =
        !searchQuery.trim() ||
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.walletId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.bankAccount.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        !selectedStatus ||
        staff.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [rawStaffList, searchQuery, selectedStatus]);

  const tabs = useMemo(() => [
    { id: 'staff', label: `Staff (${staffApiData?.totalCount ?? filteredStaff.length})` },
    { id: 'saving_plan', label: 'Saving Plan' },
    { id: 'wallet', label: 'Wallet' },
    { id: 'payroll', label: 'Payroll' },
  ], [staffApiData, filteredStaff.length]);

  const handleExport = () => {
    if (!filteredStaff || filteredStaff.length === 0) return;

    const headers = ['Name', 'Wallet ID', 'Bank Account', 'Email Address', 'Monthly Salary', 'Status'];
    const rows = filteredStaff.map((s) => [
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.walletId.replace(/"/g, '""')}"`,
      `"${s.bankAccount.replace(/"/g, '""')}"`,
      `"${s.email.replace(/"/g, '""')}"`,
      `"${s.monthlySalary.replace(/"/g, '""')}"`,
      `"${s.status.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${orgName}_staff_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-primary-text px-1">
        {orgName}
      </h1>

      {/* Top Banner Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 shadow-xs border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6">
        {/* Left: Avatar + Title & Status */}
        <div className="flex items-center space-x-4 sm:space-x-5">
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
            <img
              src={organization?.photoUrl || organization?.logoUrl || womanPhoto}
              alt={orgName}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center space-y-1 sm:space-y-1.5">
            <h2 className="text-xl sm:text-3xl font-bold text-primary-text">
              {orgName}
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Status{' '}
              <span
                className={
                  isSuspended
                    ? 'font-semibold text-suspended'
                    : 'font-semibold text-active'
                }
              >
                {isSuspended ? 'Suspended' : 'Active'}
              </span>
            </p>
          </div>
        </div>

        {/* Right: Action Pill & Payroll Section Link */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 sm:gap-4 self-stretch sm:self-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
          {isSuspended ? (
            <button
              type="button"
              onClick={onReactivate}
              className="inline-flex items-center justify-center px-6 sm:px-7 py-2 rounded-full font-medium text-xs sm:text-sm bg-active/15 hover:bg-active/25 active:bg-active/30 text-active transition-colors cursor-pointer select-none"
            >
              Re-activate
            </button>
          ) : (
            <button
              type="button"
              onClick={onSuspend}
              className="inline-flex items-center justify-center px-6 sm:px-7 py-2 rounded-full font-medium text-xs sm:text-sm bg-rejected/15 hover:bg-rejected/25 active:bg-rejected/30 text-rejected transition-colors cursor-pointer select-none"
            >
              Suspend
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setActiveTab('payroll');
              onPayrollSection?.();
            }}
            className="text-xs sm:text-sm font-semibold text-primary hover:underline cursor-pointer transition-colors"
          >
            Payroll Section
          </button>
        </div>
      </div>

      {/* Bottom Main Content Card (Tabs & Data Table) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xs border border-slate-100 flex flex-col space-y-6">
        {/* Tabs Bar */}
        <div className="flex items-center space-x-6 sm:space-x-8 border-b border-slate-100 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors relative cursor-pointer ${
                  isActive
                    ? 'text-primary-text font-bold border-b-2 border-primary -mb-px'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'staff' ? (
          <>
            {/* Toolbar: Search, Export, Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="w-full sm:w-auto">
                <SearchInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClear={() => setSearchQuery('')}
                  placeholder="Search"
                  className="w-full sm:w-72"
                />
              </div>

              <div className="flex items-center space-x-3 self-end sm:self-auto">
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleExport}
                  className="w-auto px-6 py-2"
                >
                  Export
                </Button>

                <div className="relative inline-block">
                  <Button
                    variant="primaryLink"
                    size="md"
                    icon={ChevronDown}
                    iconPosition="right"
                    onClick={() => setIsFilterOpen((prev) => !prev)}
                    className="w-auto px-6 py-2"
                    aria-expanded={isFilterOpen}
                    aria-haspopup="dialog"
                  >
                    Filter
                  </Button>

                  <FilterDropdown
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    selectedStatus={selectedStatus}
                    onApply={(status) => setSelectedStatus(status)}
                  />
                </div>
              </div>
            </div>

            {/* Staff Data Table */}
            <div className="w-full">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-transparent">
                    <TableHead className="w-1/6">Name</TableHead>
                    <TableHead className="w-1/6">Wallet ID</TableHead>
                    <TableHead className="w-1/6">Bank Account</TableHead>
                    <TableHead className="w-1/5">Email Address</TableHead>
                    <TableHead className="w-1/6">Monthly Salary</TableHead>
                    <TableHead className="w-1/6">Status</TableHead>
                    <TableHead className="w-16 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isStaffLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                        <div className="flex items-center justify-center space-x-2">
                          <Loader2 className="w-5 h-5 animate-spin text-primary" />
                          <span>Loading staff members...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : isStaffError ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-rejected">
                        {staffError?.message || 'Failed to load staff members.'}
                      </TableCell>
                    </TableRow>
                  ) : filteredStaff.length > 0 ? (
                    filteredStaff.map((staff) => (
                      <TableRow key={staff.id}>
                        {/* Name with circular avatar */}
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden shrink-0 border border-slate-100 bg-slate-100">
                              <img
                                src={staff.avatarUrl || defaultProfile}
                                alt={staff.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="font-semibold text-primary-text text-sm whitespace-nowrap">
                              {staff.name}
                            </span>
                          </div>
                        </TableCell>

                        {/* Wallet ID */}
                        <TableCell className="text-slate-700 font-medium">
                          {staff.walletId}
                        </TableCell>

                        {/* Bank Account */}
                        <TableCell className="text-slate-700 font-medium">
                          {staff.bankAccount}
                        </TableCell>

                        {/* Email Address */}
                        <TableCell className="text-slate-700 font-medium">
                          {staff.email}
                        </TableCell>

                        {/* Monthly Salary */}
                        <TableCell className="text-slate-700 font-medium">
                          {staff.monthlySalary}
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <StatusBadge status={staff.status} />
                        </TableCell>

                        {/* Action View Button */}
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => onViewStaff?.(staff)}
                            className="w-auto px-5 py-1.5 text-xs font-medium rounded-lg"
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                        No staff members found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={Math.max(1, staffApiData?.totalPages ?? 1)}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div>
            {activeTab === 'payroll' && (
              <div className="py-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-bold text-primary-text">
                    Payroll Aggregated Analytics
                  </h3>
                  {isPayrollLoading && (
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                      <span>Loading analytics...</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-5">
                    <p className="text-xs text-slate-400 font-medium">Total Batches</p>
                    <p className="text-xl sm:text-2xl font-bold text-primary-text mt-1">
                      {payrollAnalytics?.totalBatchesCount ?? 0}
                    </p>
                  </div>

                  <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-5">
                    <p className="text-xs text-slate-400 font-medium">Disbursed Staff Items</p>
                    <p className="text-xl sm:text-2xl font-bold text-primary-text mt-1">
                      {payrollAnalytics?.totalDisbursedItemsCount ?? 0}
                    </p>
                  </div>

                  <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-5">
                    <p className="text-xs text-slate-400 font-medium">Total Disbursed (NGN)</p>
                    <p className="text-xl sm:text-2xl font-bold text-primary-text mt-1">
                      ₦{Number(payrollAnalytics?.totalDisbursedNgn || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-5">
                    <p className="text-xs text-slate-400 font-medium">Total Disbursed (USDT)</p>
                    <p className="text-xl sm:text-2xl font-bold text-primary-text mt-1">
                      ${Number(payrollAnalytics?.totalDisbursedUsdt || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {payrollAnalytics?.lastPayrollExecutedAtUtc && (
                  <p className="text-xs text-slate-400 pt-2">
                    Last payroll executed on: {new Date(payrollAnalytics.lastPayrollExecutedAtUtc).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {activeTab === 'saving_plan' && (
              <div className="py-16 text-center text-slate-400 text-sm">
                Organization saving plan details will be displayed here.
              </div>
            )}

            {activeTab === 'wallet' && (
              <div className="py-16 text-center text-slate-400 text-sm">
                Organization master wallet details will be displayed here.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
