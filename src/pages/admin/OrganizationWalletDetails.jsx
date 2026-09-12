import React, { useState, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Breadcrumb from '../../components/common/Breadcrumb.jsx';
import SearchInput from '../../components/forms/SearchInput.jsx';
import Button from '../../components/common/Button.jsx';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/common/table/index.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import FilterDropdown from '../../components/forms/FilterDropdown.jsx';
import { ChevronDown, PiggyBank, Loader2, AlertCircle } from 'lucide-react';
import { adminService } from '../../api/services/admin.service.js';

export default function OrganizationWalletDetails() {
  const { id } = useParams();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('Salaries'); // 'Salaries' | 'Organization Saving Plan'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  // Live Query: Fetch organization profile
  const {
    data: orgApiData,
    isLoading: isOrgLoading,
    error: orgError,
  } = useQuery({
    queryKey: ['admin-organization-details', id],
    queryFn: () => adminService.organizations.getById(id),
    enabled: !!id,
    staleTime: 30 * 1000,
    retry: false,
  });

  // Live Query: Fetch organization wallet metrics
  const {
    data: walletApiData,
    isLoading: isWalletLoading,
  } = useQuery({
    queryKey: ['admin-organization-wallet', id],
    queryFn: () => adminService.wallets.organizations.getWallet(id),
    enabled: !!id,
    staleTime: 30 * 1000,
    retry: false,
  });

  // Live Query: Fetch salaries list
  const {
    data: salariesApiData,
    isLoading: isSalariesLoading,
    isError: isSalariesError,
    error: salariesError,
  } = useQuery({
    queryKey: ['admin-organization-salaries', id, { page: currentPage, search: searchQuery, status: selectedStatus }],
    queryFn: () =>
      adminService.wallets.organizations.getSalaries(id, {
        pageNumber: currentPage,
        pageSize: 10,
        search: searchQuery,
        status: selectedStatus,
      }),
    enabled: !!id && activeTab === 'Salaries',
    staleTime: 30 * 1000,
    retry: false,
  });

  // Live Query: Fetch savings plans
  const {
    data: savingsApiData,
    isLoading: isSavingsLoading,
  } = useQuery({
    queryKey: ['admin-organization-savings', id],
    queryFn: () => adminService.wallets.organizations.getSavings(id),
    enabled: !!id && activeTab === 'Organization Saving Plan',
    staleTime: 30 * 1000,
    retry: false,
  });

  // Base organization resolution
  const organization = useMemo(() => {
    return orgApiData || location.state?.organization || null;
  }, [orgApiData, location.state]);

  const orgName = organization?.name || 'Organization';
  const currentBalance = walletApiData?.currentBalance ?? organization?.currentBalance ?? 0;
  const totalSalaryPaid = walletApiData?.totalSalaryPaid ?? organization?.totalSalaryPaid ?? 0;
  const totalLoanFund = walletApiData?.totalLoanFund ?? organization?.totalLoanPaid ?? 0;

  // Transform salaries list
  const displayedSalaries = useMemo(() => {
    if (salariesApiData?.items && Array.isArray(salariesApiData.items)) {
      return salariesApiData.items.map((item) => ({
        id: item.id || item.disbursementId,
        amount: item.amount ?? 0,
        transactionId: item.transactionId || 'N/A',
        method: item.method || 'Wallet ID',
        accountOrWalletId: item.accountOrWalletId || 'N/A',
        month: item.month || 'N/A',
        dateTime: item.dateTime
          ? new Date(item.dateTime).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })
          : 'N/A',
        status: item.status || 'Successfull',
      }));
    }
    return [];
  }, [salariesApiData]);

  const totalSalariesCount = salariesApiData?.totalCount ?? displayedSalaries.length;
  const totalPages = salariesApiData?.totalPages && salariesApiData.totalPages > 0 ? salariesApiData.totalPages : 1;

  // Transform savings plans
  const displayedSavings = useMemo(() => {
    if (savingsApiData?.items && Array.isArray(savingsApiData.items)) {
      return savingsApiData.items;
    }
    return [];
  }, [savingsApiData]);

  // Live server-side CSV export for salaries
  const handleExportSalaries = async () => {
    try {
      setIsExporting(true);
      const blobData = await adminService.wallets.organizations.exportSalaries(id, {
        search: searchQuery,
        status: selectedStatus,
      });
      const blob = new Blob([blobData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `salaries_${orgName.replace(/\s+/g, '_')}_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export salaries:', err);
    } finally {
      setIsExporting(false);
    }
  };

  if (isOrgLoading && !organization) {
    return (
      <DashboardLayout>
        <div className="py-24 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-sm text-slate-500 font-medium">Loading organization wallet...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!organization && !isOrgLoading) {
    return (
      <DashboardLayout>
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-xs flex flex-col items-center justify-center text-center space-y-4 max-w-lg mx-auto mt-12">
          <AlertCircle className="w-10 h-10 text-rejected" />
          <h2 className="text-lg font-bold text-primary-text">Organization Not Found</h2>
          <p className="text-sm text-slate-500">
            {orgError?.message || 'We could not load the organization wallet details.'}
          </p>
        </div>
      </DashboardLayout>
    );
  }

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
            {isWalletLoading && !walletApiData ? (
              <div className="py-2 flex items-center space-x-2 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            ) : (
              <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary-text tracking-tight">
                ₦{Number(currentBalance).toLocaleString('en-US')}
              </p>
            )}
          </div>

          {/* Card 2: Total Salary Paid */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 flex flex-col justify-center">
            <h2 className="text-xs sm:text-sm font-semibold text-slate-500 mb-4">
              Total Salary Paid
            </h2>
            {isWalletLoading && !walletApiData ? (
              <div className="py-2 flex items-center space-x-2 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            ) : (
              <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary-text tracking-tight">
                ₦{Number(totalSalaryPaid).toLocaleString('en-US')}
              </p>
            )}
          </div>

          {/* Card 3: Total Loan Fund */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 flex flex-col justify-center">
            <h2 className="text-xs sm:text-sm font-semibold text-slate-500 mb-4">
              Total Loan Fund
            </h2>
            {isWalletLoading && !walletApiData ? (
              <div className="py-2 flex items-center space-x-2 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            ) : (
              <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary-text tracking-tight">
                ₦{Number(totalLoanFund).toLocaleString('en-US')}
              </p>
            )}
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
                    loading={isExporting}
                    disabled={isExporting || displayedSalaries.length === 0}
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
                    {isSalariesLoading && displayedSalaries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-16">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            <span className="text-xs text-slate-500 font-medium">Loading salary disbursements...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : isSalariesError && displayedSalaries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-rejected">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <AlertCircle className="w-6 h-6 text-rejected" />
                            <span className="text-xs font-medium">
                              {salariesError?.message || 'Failed to load salary disbursements.'}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : displayedSalaries.length > 0 ? (
                      displayedSalaries.map((sal) => (
                        <TableRow key={sal.id}>
                          <TableCell className="text-xs sm:text-sm font-semibold text-primary-text">
                            ₦{Number(sal.amount).toLocaleString('en-US')}
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
                          No salary disbursements recorded yet.
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
              {isSavingsLoading && displayedSavings.length === 0 ? (
                <div className="py-16 flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="text-xs text-slate-500 font-medium">Loading savings plans...</span>
                </div>
              ) : displayedSavings.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {displayedSavings.map((plan) => (
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
