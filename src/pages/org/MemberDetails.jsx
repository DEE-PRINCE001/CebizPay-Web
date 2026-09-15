import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import OrgDashboardLayout from '../../components/layout/OrgDashboardLayout.jsx';
import Breadcrumb from '../../components/common/Breadcrumb.jsx';
import SearchInput from '../../components/forms/SearchInput.jsx';
import Button from '../../components/common/Button.jsx';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/common/table/index.js';
import Pagination from '../../components/common/Pagination.jsx';
import FilterDropdown from '../../components/forms/FilterDropdown.jsx';
import ActionConfirmModal from '../../components/modals/ActionConfirmModal.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { ChevronDown, PiggyBank, Loader2, AlertCircle } from 'lucide-react';
import womanPhoto from '../../assets/woman.svg';
import { organizationService } from '../../api/services/organization.service.js';

export default function MemberDetails() {
  const { id } = useParams();
  const location = useLocation();
  const queryClient = useQueryClient();

  const passedMember = location.state?.member;

  // Query fresh member profile if available
  const { data: memberProfile } = useQuery({
    queryKey: ['staff-member', id],
    queryFn: () => organizationService.staff.getById(id),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });

  const activeProfile = memberProfile || passedMember;
  const [memberStatus, setMemberStatus] = useState(activeProfile?.status || 'Active');
  const [activeTab, setActiveTab] = useState('Salaries');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const memberName = activeProfile?.name || `${activeProfile?.firstName || ''} ${activeProfile?.lastName || ''}`.trim() || activeProfile?.email || 'Staff Member';
  const memberPhoto = activeProfile?.avatarUrl || womanPhoto;
  const isSuspended = memberStatus.toLowerCase() === 'suspended';

  // Query salary disbursements
  const {
    data: salariesData,
    isLoading: isSalariesLoading,
    isError: isSalariesError,
    error: salariesError,
    refetch: refetchSalaries,
  } = useQuery({
    queryKey: ['staff-salaries', id, currentPage],
    queryFn: () =>
      organizationService.staff.getSalaries(id, {
        pageNumber: currentPage,
        pageSize: 10,
      }),
    enabled: Boolean(id) && activeTab === 'Salaries',
    staleTime: 30 * 1000,
  });

  // Query savings plans
  const {
    data: savingsData,
    isLoading: isSavingsLoading,
    isError: isSavingsError,
    error: savingsError,
  } = useQuery({
    queryKey: ['staff-savings', id],
    queryFn: () => organizationService.staff.getSavings(id),
    enabled: Boolean(id) && activeTab === 'Organization Saving Plan',
    staleTime: 30 * 1000,
  });

  const rawSalaries = salariesData?.items || (Array.isArray(salariesData) ? salariesData : []);
  const filteredSalaries = rawSalaries.filter((item) => {
    const txnId = item.transactionId || item.reference || item.id || '';
    const acct = item.accountOrWalletId || item.accountNumber || '';
    const month = item.month || '';
    const status = item.status || 'Successful';

    const matchesSearch =
      !searchQuery.trim() ||
      txnId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acct.includes(searchQuery) ||
      month.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      !selectedStatus || status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalPages = salariesData?.totalPages != null ? Math.max(1, salariesData.totalPages) : 1;
  const savingsList = savingsData?.items || (Array.isArray(savingsData) ? savingsData : []);

  // Action Confirmation Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    step: 'confirm',
    title: '',
    message: '',
    subMessage: '',
    cancelText: 'Cancel',
    proceedText: 'Proceed',
    successButtonText: 'Okay',
    showCloseButton: true,
    isLoading: false,
    errorMessage: '',
    pendingStatus: null,
  });

  const handleOpenSuspend = () => {
    setModalConfig({
      isOpen: true,
      step: 'confirm',
      title: 'Suspend Member?',
      message: `You are about to suspend ( ${memberName} ) from using this service`,
      subMessage: 'Do you wish to proceed with this action?',
      cancelText: 'Cancel',
      proceedText: 'Proceed',
      successButtonText: 'Okay',
      showCloseButton: true,
      isLoading: false,
      errorMessage: '',
      pendingStatus: 'Suspended',
    });
  };

  const handleOpenReactivate = () => {
    setModalConfig({
      isOpen: true,
      step: 'confirm',
      title: 'Re-Activate Member?',
      message: `You are about to re-activate ( ${memberName} ) to use this service`,
      subMessage: 'Do you wish to proceed with this action?',
      cancelText: 'Cancel',
      proceedText: 'Proceed',
      successButtonText: 'Okay',
      showCloseButton: true,
      isLoading: false,
      errorMessage: '',
      pendingStatus: 'Active',
    });
  };

  const handleProceed = async () => {
    const nextStatus = modalConfig.pendingStatus;
    setModalConfig((prev) => ({ ...prev, isLoading: true, errorMessage: '' }));

    try {
      if (nextStatus === 'Suspended') {
        await organizationService.staff.suspend(id, { reason: 'Administrative suspension' });
      } else {
        await organizationService.staff.reactivate(id);
      }

      setMemberStatus(nextStatus);
      queryClient.invalidateQueries({ queryKey: ['org-staff-roster'] });
      queryClient.invalidateQueries({ queryKey: ['staff-member', id] });

      const successTitle = nextStatus === 'Active' ? 'Successfully Re-Activated' : 'Successfully Suspended';
      const successMessage =
        nextStatus === 'Active'
          ? `( ${memberName} ) has been re-activated.`
          : `( ${memberName} ) has been suspended.`;

      setModalConfig((prev) => ({
        ...prev,
        isLoading: false,
        step: 'success',
        title: successTitle,
        message: successMessage,
        subMessage: '',
      }));
    } catch (err) {
      setModalConfig((prev) => ({
        ...prev,
        isLoading: false,
        errorMessage: err?.message || 'Failed to update member status.',
      }));
    }
  };

  const handleCloseModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false, errorMessage: '' }));
  };

  const handleExport = () => {
    if (!filteredSalaries || filteredSalaries.length === 0) return;
    const headers = ['Amount', 'Transaction ID', 'Method', 'Acct/Wallet ID', 'Months', 'Date n Time', 'Status'];
    const rows = filteredSalaries.map((s) => [
      `"${s.amount}"`,
      `"${s.transactionId || s.id}"`,
      `"${s.method || 'Wallet ID'}"`,
      `"${s.accountOrWalletId || '-'}"`,
      `"${s.month || '-'}"`,
      `"${s.disbursedAtUtc || s.dateTime || '-'}"`,
      `"${s.status || 'Successful'}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `salaries_${memberName.replace(/\s+/g, '_')}_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <OrgDashboardLayout>
      <div className="flex flex-col space-y-6">
        {/* Breadcrumb Header */}
        <Breadcrumb
          parentLabel="Members"
          parentTo="/org/members"
          currentLabel={memberName}
        />

        {/* Top Profile Summary Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-5 sm:space-x-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
              <img
                src={memberPhoto}
                alt={memberName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col space-y-1 sm:space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary-text">
                {memberName}
              </h1>

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

              <button
                type="button"
                onClick={(e) => e.preventDefault()}
                className="text-xs sm:text-sm font-semibold text-primary underline hover:text-primary/80 transition-colors self-start cursor-pointer pt-2"
              >
                View
              </button>
            </div>
          </div>

          <div className="self-end sm:self-center">
            {isSuspended ? (
              <button
                type="button"
                onClick={handleOpenReactivate}
                className="inline-flex items-center justify-center px-6 sm:px-7 py-2 rounded-full font-medium text-xs sm:text-sm bg-active/15 hover:bg-active/25 active:bg-active/30 text-active transition-colors cursor-pointer select-none"
              >
                Re-Activated
              </button>
            ) : (
              <button
                type="button"
                onClick={handleOpenSuspend}
                className="inline-flex items-center justify-center px-6 sm:px-7 py-2 rounded-full font-medium text-xs sm:text-sm bg-rejected/15 hover:bg-rejected/25 active:bg-rejected/30 text-rejected transition-colors cursor-pointer select-none"
              >
                Suspend
              </button>
            )}
          </div>
        </div>

        {/* Bottom Tabbed Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xs border border-slate-100 flex flex-col space-y-6">
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
                    onClick={handleExport}
                    className="w-auto px-6 py-2"
                  >
                    Export
                  </Button>

                  <div className="relative">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => setIsFilterOpen((prev) => !prev)}
                      className="w-auto px-6 py-2 whitespace-nowrap"
                    >
                      <span>Filter</span>
                      <ChevronDown className="w-4 h-4 ml-1 shrink-0" />
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
                    <TableRow className="border-b border-transparent">
                      <TableHead className="w-1/7">Amount</TableHead>
                      <TableHead className="w-1/5">Transaction ID</TableHead>
                      <TableHead className="w-1/6">Method</TableHead>
                      <TableHead className="w-1/6">Acct/Wallet ID</TableHead>
                      <TableHead className="w-1/7">Months</TableHead>
                      <TableHead className="w-1/5">Date n Time</TableHead>
                      <TableHead className="w-1/8">Status</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {isSalariesLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                          <div className="flex items-center justify-center space-x-2">
                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                            <span>Loading salary disbursement history...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : isSalariesError ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <span className="text-xs text-red-600 font-medium">
                              {salariesError?.message || 'Failed to load salary vouchers.'}
                            </span>
                            <button
                              type="button"
                              onClick={() => refetchSalaries()}
                              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                            >
                              Retry
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredSalaries.length > 0 ? (
                      filteredSalaries.map((sal, idx) => {
                        const salId = sal.id || sal.transactionId || idx;
                        const formattedAmt = sal.amount != null ? Number(sal.amount).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00';
                        const dt = sal.disbursedAtUtc ? new Date(sal.disbursedAtUtc).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : (sal.dateTime || '-');

                        return (
                          <TableRow key={salId}>
                            <TableCell className="font-semibold text-primary-text text-xs sm:text-sm">
                              ₦{formattedAmt}
                            </TableCell>

                            <TableCell className="text-slate-600 font-medium text-xs sm:text-sm">
                              {sal.transactionId || sal.reference || '-'}
                            </TableCell>

                            <TableCell className="text-slate-600 font-medium text-xs sm:text-sm">
                              {sal.method || 'Wallet ID'}
                            </TableCell>

                            <TableCell className="text-slate-600 font-medium text-xs sm:text-sm">
                              {sal.accountOrWalletId || sal.accountNumber || '-'}
                            </TableCell>

                            <TableCell className="text-slate-600 font-medium text-xs sm:text-sm">
                              {sal.month || '-'}
                            </TableCell>

                            <TableCell className="text-slate-600 font-medium text-xs sm:text-sm whitespace-nowrap">
                              {dt}
                            </TableCell>

                            <TableCell>
                              <StatusBadge status={sal.status || 'Successful'} />
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                          No salary disbursement records found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          ) : (
            /* Tab Content 2: Organization Saving Plan */
            isSavingsLoading ? (
              <div className="py-16 flex flex-col items-center justify-center space-y-2 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-xs">Loading savings plans...</span>
              </div>
            ) : isSavingsError ? (
              <div className="py-16 flex flex-col items-center justify-center text-center space-y-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-xs text-red-600">{savingsError?.message || 'Failed to load savings plans.'}</p>
              </div>
            ) : savingsList.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <PiggyBank className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-primary-text">No Saving Plans Enrolled</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
                  This member does not have any active target or corporate saving plans configured.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savingsList.map((plan, idx) => (
                  <div key={plan.id || idx} className="p-4 rounded-xl border border-slate-100 bg-white shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-primary-text text-sm">{plan.planName || 'Savings Plan'}</span>
                      <StatusBadge status={plan.status || 'Active'} />
                    </div>
                    <div className="text-xs text-slate-500 space-y-1">
                      <div>Target: ₦{Number(plan.targetAmount || 0).toLocaleString()}</div>
                      <div>Current Balance: ₦{Number(plan.currentBalance || 0).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Action Confirmation Modal */}
      <ActionConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={handleCloseModal}
        step={modalConfig.step}
        title={modalConfig.title}
        message={modalConfig.message}
        subMessage={modalConfig.subMessage}
        cancelText={modalConfig.cancelText}
        proceedText={modalConfig.proceedText}
        successButtonText={modalConfig.successButtonText}
        showCloseButton={modalConfig.showCloseButton}
        isLoading={modalConfig.isLoading}
        errorMessage={modalConfig.errorMessage}
        onProceed={handleProceed}
        onSuccessClose={handleCloseModal}
      />
    </OrgDashboardLayout>
  );
}
