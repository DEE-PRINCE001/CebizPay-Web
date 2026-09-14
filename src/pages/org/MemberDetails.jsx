import React, { useState, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import OrgDashboardLayout from '../../components/layout/OrgDashboardLayout.jsx';
import Breadcrumb from '../../components/common/Breadcrumb.jsx';
import SearchInput from '../../components/forms/SearchInput.jsx';
import Button from '../../components/common/Button.jsx';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/common/table/index.js';
import Pagination from '../../components/common/Pagination.jsx';
import FilterDropdown from '../../components/forms/FilterDropdown.jsx';
import ActionConfirmModal from '../../components/modals/ActionConfirmModal.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { ChevronDown, PiggyBank } from 'lucide-react';
import womanPhoto from '../../assets/woman.svg';

const MOCK_SALARIES = [
  {
    id: 'sal-1',
    amount: '34,000',
    transactionId: '2619861816688',
    method: 'Wallet ID',
    accountOrWalletId: '156191667631',
    month: 'January',
    dateTime: '4:18 PM 27 May, 2021',
    status: 'Successfull',
  },
  {
    id: 'sal-2',
    amount: '34,000',
    transactionId: '2619861816688',
    method: 'Wallet ID',
    accountOrWalletId: '156191667631',
    month: 'January',
    dateTime: '4:18 PM 27 May, 2021',
    status: 'Successfull',
  },
  {
    id: 'sal-3',
    amount: '34,000',
    transactionId: '2619861816688',
    method: 'Wallet ID',
    accountOrWalletId: '156191667631',
    month: 'January',
    dateTime: '4:18 PM 27 May, 2021',
    status: 'Successfull',
  },
  {
    id: 'sal-4',
    amount: '34,000',
    transactionId: '2619861816688',
    method: 'Wallet ID',
    accountOrWalletId: '156191667631',
    month: 'January',
    dateTime: '4:18 PM 27 May, 2021',
    status: 'Successfull',
  },
  {
    id: 'sal-5',
    amount: '34,000',
    transactionId: '2619861816688',
    method: 'Wallet ID',
    accountOrWalletId: '156191667631',
    month: 'January',
    dateTime: '4:18 PM 27 May, 2021',
    status: 'Successfull',
  },
];

export default function MemberDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const passedMember = location.state?.member;
  const [memberStatus, setMemberStatus] = useState(passedMember?.status || 'Active');
  const [activeTab, setActiveTab] = useState('Salaries'); // 'Salaries' | 'Organization Saving Plan'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const memberName = passedMember?.name || 'Mike Johnson';
  const memberPhoto = passedMember?.avatarUrl || womanPhoto;
  const isSuspended = memberStatus.toLowerCase() === 'suspended';

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

  const handleProceed = () => {
    const nextStatus = modalConfig.pendingStatus;
    setMemberStatus(nextStatus);

    let successTitle = 'Successfully Suspended';
    let successMessage = `( ${memberName} ) has been suspended from using this service`;

    if (nextStatus === 'Active') {
      successTitle = 'Successfully Re-Activated';
      successMessage = `( ${memberName} ) has been re-activated and is now free to enjoy all the benefit that comes with this service`;
    }

    setModalConfig((prev) => ({
      ...prev,
      step: 'success',
      title: successTitle,
      message: successMessage,
      subMessage: '',
    }));
  };

  const handleCloseModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false, errorMessage: '' }));
  };

  const filteredSalaries = useMemo(() => {
    return MOCK_SALARIES.filter((item) => {
      const matchesSearch =
        !searchQuery.trim() ||
        item.transactionId.includes(searchQuery) ||
        item.accountOrWalletId.includes(searchQuery) ||
        item.month.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        !selectedStatus || item.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatus]);

  const handleExport = () => {
    if (!filteredSalaries || filteredSalaries.length === 0) return;
    const headers = ['Amount', 'Transaction ID', 'Method', 'Acct/Wallet ID', 'Months', 'Date n Time', 'Status'];
    const rows = filteredSalaries.map((s) => [
      `"${s.amount}"`,
      `"${s.transactionId}"`,
      `"${s.method}"`,
      `"${s.accountOrWalletId}"`,
      `"${s.month}"`,
      `"${s.dateTime}"`,
      `"${s.status}"`,
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
            {/* Member Photo */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
              <img
                src={memberPhoto}
                alt={memberName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Member Info & Status */}
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

              {/* View Link (stays on page as requested) */}
              <button
                type="button"
                onClick={(e) => e.preventDefault()}
                className="text-xs sm:text-sm font-semibold text-primary underline hover:text-primary/80 transition-colors self-start cursor-pointer pt-2"
              >
                View
              </button>
            </div>
          </div>

          {/* Top-Right Action Button: Suspend / Re-Activated */}
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
                    {filteredSalaries.length > 0 ? (
                      filteredSalaries.map((sal) => (
                        <TableRow key={sal.id}>
                          <TableCell className="font-semibold text-primary-text text-xs sm:text-sm">
                            {sal.amount}
                          </TableCell>

                          <TableCell className="text-slate-600 font-medium text-xs sm:text-sm">
                            {sal.transactionId}
                          </TableCell>

                          <TableCell className="text-slate-600 font-medium text-xs sm:text-sm">
                            {sal.method}
                          </TableCell>

                          <TableCell className="text-slate-600 font-medium text-xs sm:text-sm">
                            {sal.accountOrWalletId}
                          </TableCell>

                          <TableCell className="text-slate-600 font-medium text-xs sm:text-sm">
                            {sal.month}
                          </TableCell>

                          <TableCell className="text-slate-600 font-medium text-xs sm:text-sm whitespace-nowrap">
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
                totalPages={130}
                onPageChange={setCurrentPage}
              />
            </div>
          ) : (
            /* Tab Content 2: Organization Saving Plan */
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <PiggyBank className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-primary-text">No Saving Plans Enrolled</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
                This member does not have any active target or corporate saving plans configured.
              </p>
            </div>
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
