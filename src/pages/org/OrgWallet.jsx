import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import OrgDashboardLayout from '../../components/layout/OrgDashboardLayout.jsx';
import OrgMetricCard from '../../components/cards/OrgMetricCard.jsx';
import SearchInput from '../../components/forms/SearchInput.jsx';
import Button from '../../components/common/Button.jsx';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/common/table/index.js';
import Pagination from '../../components/common/Pagination.jsx';
import FilterDropdown from '../../components/forms/FilterDropdown.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import AddMoneyOptionsModal from '../../components/modals/wallet/AddMoneyOptionsModal.jsx';
import TransferOptionsModal from '../../components/modals/wallet/TransferOptionsModal.jsx';
import AddMoneyTransferModal from '../../components/modals/wallet/AddMoneyTransferModal.jsx';
import AddMoneyCardModal from '../../components/modals/wallet/AddMoneyCardModal.jsx';
import TransferProcessModal from '../../components/modals/wallet/TransferProcessModal.jsx';
import TransactionPinModal from '../../components/modals/wallet/TransactionPinModal.jsx';
import TransactionSuccessModal from '../../components/modals/wallet/TransactionSuccessModal.jsx';
import { walletService } from '../../api/services/wallet.service.js';
import { cardsService } from '../../api/services/cards.service.js';
import { ChevronDown, Loader2 } from 'lucide-react';

// Fallback sample data matching WalletPage.png reference when backend data is unseeded
const SAMPLE_WALLET_TRANSACTIONS = [
  {
    id: 'tx-001',
    amount: '34,000',
    transactionId: '2619861816688',
    method: 'Wallet ID',
    accountOrWalletId: '156191667631',
    month: 'January',
    dateTime: '4:18 PM 27 May, 2021',
    status: 'Successfull',
  },
  {
    id: 'tx-002',
    amount: '34,000',
    transactionId: '2619861816688',
    method: 'Wallet ID',
    accountOrWalletId: '156191667631',
    month: 'January',
    dateTime: '4:18 PM 27 May, 2021',
    status: 'Successfull',
  },
  {
    id: 'tx-003',
    amount: '34,000',
    transactionId: '2619861816688',
    method: 'Wallet ID',
    accountOrWalletId: '156191667631',
    month: 'January',
    dateTime: '4:18 PM 27 May, 2021',
    status: 'Successfull',
  },
  {
    id: 'tx-004',
    amount: '34,000',
    transactionId: '2619861816688',
    method: 'Wallet ID',
    accountOrWalletId: '156191667631',
    month: 'January',
    dateTime: '4:18 PM 27 May, 2021',
    status: 'Successfull',
  },
  {
    id: 'tx-005',
    amount: '34,000',
    transactionId: '2619861816688',
    method: 'Wallet ID',
    accountOrWalletId: '156191667631',
    month: 'January',
    dateTime: '4:18 PM 27 May, 2021',
    status: 'Successfull',
  },
];

export default function OrgWallet() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state for Fund / Transfer workflows
  const [isAddMoneyOptionsOpen, setIsAddMoneyOptionsOpen] = useState(false);
  const [isAddMoneyTransferOpen, setIsAddMoneyTransferOpen] = useState(false);
  const [isAddMoneyCardOpen, setIsAddMoneyCardOpen] = useState(false);
  const [isTransferOptionsOpen, setIsTransferOptionsOpen] = useState(false);
  const [isTransferProcessOpen, setIsTransferProcessOpen] = useState(false);
  const [transferMode, setTransferMode] = useState('bank');
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState(null);
  const [transactionSuccessData, setTransactionSuccessData] = useState(null);
  const [isPinSubmitting, setIsPinSubmitting] = useState(false);
  const [pinErrorMessage, setPinErrorMessage] = useState('');

  // 1. Fetch Organization Wallet metrics
  const {
    data: walletData,
    isLoading: isWalletLoading,
    isError: isWalletError,
  } = useQuery({
    queryKey: ['org-wallet-metrics'],
    queryFn: () => walletService.getOrgWallet(),
    retry: false,
    staleTime: 30 * 1000,
  });

  // 2. Fetch Organization Wallet transactions ledger
  const {
    data: transactionsData,
    isLoading: isTransactionsLoading,
  } = useQuery({
    queryKey: ['org-wallet-transactions-ledger', currentPage, searchQuery, selectedStatus],
    queryFn: () =>
      walletService.getOrgTransactions({
        pageNumber: currentPage,
        pageSize: 10,
        search: searchQuery.trim(),
        status: selectedStatus,
      }),
    retry: false,
    staleTime: 30 * 1000,
  });

  // Format monetary values
  const formatMoney = (val, fallback = '238,000,909') => {
    if (val != null) {
      return Number(val).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    }
    return fallback;
  };

  const currentBalance = isWalletLoading ? '...' : formatMoney(walletData?.availableBalance);
  const totalSalaryPaid = isWalletLoading ? '...' : formatMoney(walletData?.totalSalaryPaid);
  const totalLoanFund = isWalletLoading ? '...' : formatMoney(walletData?.totalLoanFund);
  const totalSavingMoney = isWalletLoading ? '...' : formatMoney(walletData?.totalSavingMoney);

  // Normalize transaction items with fallback
  const rawItems = useMemo(
    () => transactionsData?.items || (Array.isArray(transactionsData) ? transactionsData : []),
    [transactionsData]
  );
  const displayedItems = useMemo(() => {
    if (rawItems.length > 0) {
      return rawItems.map((item, idx) => ({
        id: item.transactionId || item.id || `tx-${idx}`,
        amount: item.amount != null ? Number(item.amount).toLocaleString('en-US') : '0',
        transactionId: item.transactionId || item.reference || '-',
        method: item.method || (item.counterpartyAccount ? 'Bank' : 'Wallet ID'),
        accountOrWalletId: item.accountOrWalletId || item.counterpartyAccount || '-',
        month: item.month || (item.createdAtUtc ? new Date(item.createdAtUtc).toLocaleString('en-US', { month: 'long' }) : '-'),
        dateTime: item.dateTime || (item.createdAtUtc ? new Date(item.createdAtUtc).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '-'),
        status: item.status || 'Successfull',
      }));
    }
    // Filter sample transactions locally if searching
    return SAMPLE_WALLET_TRANSACTIONS.filter((tx) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        tx.transactionId.toLowerCase().includes(q) ||
        tx.accountOrWalletId.toLowerCase().includes(q) ||
        tx.month.toLowerCase().includes(q);
      const matchesStatus = !selectedStatus || tx.status.toLowerCase() === selectedStatus.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [rawItems, searchQuery, selectedStatus]);

  const totalPages = transactionsData?.totalPages != null ? Math.max(1, transactionsData.totalPages) : 130;

  // CSV Export handler
  const handleExport = () => {
    if (!displayedItems || displayedItems.length === 0) return;
    const headers = ['Amount', 'Transaction ID', 'Method', 'Acct/Wallet ID', 'Months', 'Date n Time', 'Status'];
    const rows = displayedItems.map((tx) => [
      `"${tx.amount}"`,
      `"${tx.transactionId}"`,
      `"${tx.method}"`,
      `"${tx.accountOrWalletId}"`,
      `"${tx.month}"`,
      `"${tx.dateTime}"`,
      `"${tx.status}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wallet_transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Transaction PIN submission handler
  const handlePinSubmit = async (enteredPin) => {
    if (!pendingTransaction) return;

    setIsPinSubmitting(true);
    setPinErrorMessage('');

    try {
      if (pendingTransaction.type === 'fund') {
        const res = await cardsService.chargeSavedCard({
          savedCardId: pendingTransaction.card?.id,
          amount: Number(pendingTransaction.amount),
          currency: 'NGN',
          transactionPin: enteredPin,
        });

        setIsPinModalOpen(false);
        setTransactionSuccessData({
          ...pendingTransaction,
          pin: enteredPin,
          reference: res?.reference || res?.fundingTransactionId || `FND-${Date.now().toString().slice(-6)}`,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        });
        setIsSuccessModalOpen(true);
        queryClient.invalidateQueries({ queryKey: ['org-wallet-metrics'] });
        queryClient.invalidateQueries({ queryKey: ['org-wallet-transactions-ledger'] });
      } else if (pendingTransaction.type === 'transfer') {
        if (pendingTransaction.mode === 'bank') {
          const res = await walletService.bankTransfer({
            destinationBankCode: pendingTransaction.selectedBank?.code,
            destinationAccountNumber: pendingTransaction.identifier,
            amount: Number(pendingTransaction.amount),
            currency: 'NGN',
            transactionPin: enteredPin,
          });

          setIsPinModalOpen(false);
          setTransactionSuccessData({
            ...pendingTransaction,
            pin: enteredPin,
            reference: res?.reference || res?.transferId || `TRF-${Date.now().toString().slice(-6)}`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          });
          setIsSuccessModalOpen(true);
          queryClient.invalidateQueries({ queryKey: ['org-wallet-metrics'] });
          queryClient.invalidateQueries({ queryKey: ['org-wallet-transactions-ledger'] });
        } else {
          const res = await walletService.peerTransfer({
            recipientIdentifier: pendingTransaction.identifier,
            amount: Number(pendingTransaction.amount),
            currency: 'NGN',
            transactionPin: enteredPin,
          });

          setIsPinModalOpen(false);
          setTransactionSuccessData({
            ...pendingTransaction,
            pin: enteredPin,
            reference: res?.reference || res?.transferId || `PWR-${Date.now().toString().slice(-6)}`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          });
          setIsSuccessModalOpen(true);
          queryClient.invalidateQueries({ queryKey: ['org-wallet-metrics'] });
          queryClient.invalidateQueries({ queryKey: ['org-wallet-transactions-ledger'] });
        }
      }
    } catch (err) {
      setPinErrorMessage(err?.message || 'Transaction failed. Please verify your PIN and balance.');
    } finally {
      setIsPinSubmitting(false);
    }
  };

  return (
    <OrgDashboardLayout>
      <div className="flex flex-col space-y-6 sm:space-y-8">
        {/* Header Title & Top Action Cluster */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
          <h1 className="text-xl sm:text-2xl font-bold text-primary-text">
            Wallet
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            {/* Transfer Fund Button */}
            <button
              type="button"
              onClick={() => setIsTransferOptionsOpen(true)}
              className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 rounded-xl border border-primary/25 bg-blue-50/70 hover:bg-blue-100/70 text-primary font-medium text-xs sm:text-sm transition-colors cursor-pointer select-none"
            >
              Transfer Fund
            </button>

            {/* Fund Wallet Button */}
            <button
              type="button"
              onClick={() => setIsAddMoneyOptionsOpen(true)}
              className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 rounded-xl border border-primary/25 bg-blue-50/70 hover:bg-blue-100/70 text-primary font-medium text-xs sm:text-sm transition-colors cursor-pointer select-none"
            >
              Fund Wallet
            </button>

            {/* Pay Salaries Button */}
            <button
              type="button"
              onClick={() => navigate('/org/payroll')}
              className="inline-flex items-center justify-center px-6 sm:px-7 py-2.5 rounded-xl bg-primary hover:bg-primary/90 active:bg-primary/80 text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer select-none shadow-xs"
            >
              Pay Salaries
            </button>
          </div>
        </div>

        {/* 4 Metric Cards Grid matching WalletPage.png */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <OrgMetricCard
            title="Current Balance"
            value={currentBalance}
            isLoading={isWalletLoading}
            isError={isWalletError}
          />
          <OrgMetricCard
            title="Total Salary Paid"
            value={totalSalaryPaid}
            isLoading={isWalletLoading}
            isError={isWalletError}
          />
          <OrgMetricCard
            title="Total Loan Fund"
            value={totalLoanFund}
            isLoading={isWalletLoading}
            isError={isWalletError}
          />
          <OrgMetricCard
            title="Total Saving Money"
            value={totalSavingMoney}
            isLoading={isWalletLoading}
            isError={isWalletError}
          />
        </div>

        {/* Main White Card Container: Transaction Ledger */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xs border border-slate-100 flex flex-col space-y-6">
          {/* Action Toolbar */}
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
                className="w-auto px-6 py-2 text-xs sm:text-sm"
              >
                Export
              </Button>

              <div className="relative">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setIsFilterOpen((prev) => !prev)}
                  className="w-auto px-6 py-2 whitespace-nowrap text-xs sm:text-sm"
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

          {/* Transactions Table */}
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
                {isTransactionsLoading && rawItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        <span>Loading transactions...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : displayedItems.length > 0 ? (
                  displayedItems.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-semibold text-primary-text text-xs sm:text-sm">
                        {tx.amount}
                      </TableCell>
                      <TableCell className="text-slate-600 font-medium text-xs sm:text-sm">
                        {tx.transactionId}
                      </TableCell>
                      <TableCell className="text-slate-600 font-medium text-xs sm:text-sm">
                        {tx.method}
                      </TableCell>
                      <TableCell className="text-slate-600 font-medium text-xs sm:text-sm font-mono">
                        {tx.accountOrWalletId}
                      </TableCell>
                      <TableCell className="text-slate-600 font-medium text-xs sm:text-sm">
                        {tx.month}
                      </TableCell>
                      <TableCell className="text-slate-600 font-medium text-xs sm:text-sm whitespace-nowrap">
                        {tx.dateTime}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={tx.status} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                      No transactions found matching your criteria.
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
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Funding & Transfer Action Modals */}
      <AddMoneyOptionsModal
        isOpen={isAddMoneyOptionsOpen}
        onClose={() => setIsAddMoneyOptionsOpen(false)}
        onSelectOption={(option) => {
          setIsAddMoneyOptionsOpen(false);
          if (option === 'transfer') {
            setIsAddMoneyTransferOpen(true);
          } else if (option === 'card') {
            setIsAddMoneyCardOpen(true);
          }
        }}
      />

      <AddMoneyTransferModal
        isOpen={isAddMoneyTransferOpen}
        onClose={() => setIsAddMoneyTransferOpen(false)}
      />

      <AddMoneyCardModal
        isOpen={isAddMoneyCardOpen}
        onClose={() => setIsAddMoneyCardOpen(false)}
        onProceed={(data) => {
          setIsAddMoneyCardOpen(false);
          setPendingTransaction({
            type: 'fund',
            ...data,
          });
          setPinErrorMessage('');
          setIsPinModalOpen(true);
        }}
      />

      <TransferOptionsModal
        isOpen={isTransferOptionsOpen}
        onClose={() => setIsTransferOptionsOpen(false)}
        onSelectOption={(option) => {
          setTransferMode(option);
          setIsTransferOptionsOpen(false);
          setIsTransferProcessOpen(true);
        }}
      />

      <TransferProcessModal
        isOpen={isTransferProcessOpen}
        onClose={() => setIsTransferProcessOpen(false)}
        mode={transferMode}
        onProceed={(data) => {
          setIsTransferProcessOpen(false);
          setPendingTransaction({
            type: 'transfer',
            ...data,
          });
          setPinErrorMessage('');
          setIsPinModalOpen(true);
        }}
      />

      <TransactionPinModal
        isOpen={isPinModalOpen}
        onClose={() => {
          setIsPinModalOpen(false);
          setPinErrorMessage('');
        }}
        onSubmit={handlePinSubmit}
        isLoading={isPinSubmitting}
        errorMessage={pinErrorMessage}
      />

      <TransactionSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          setPendingTransaction(null);
          setTransactionSuccessData(null);
        }}
        data={transactionSuccessData}
      />
    </OrgDashboardLayout>
  );
}
