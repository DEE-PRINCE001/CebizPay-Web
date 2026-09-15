import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import OrgDashboardLayout from '../../components/layout/OrgDashboardLayout.jsx';
import WalletCard from '../../components/cards/WalletCard.jsx';
import AnnouncementItem from '../../components/common/AnnouncementItem.jsx';
import EarningChart from '../../components/common/EarningChart.jsx';
import AnnouncementsModal from '../../components/modals/AnnouncementsModal.jsx';
import AddMoneyOptionsModal from '../../components/modals/wallet/AddMoneyOptionsModal.jsx';
import TransferOptionsModal from '../../components/modals/wallet/TransferOptionsModal.jsx';
import AddMoneyTransferModal from '../../components/modals/wallet/AddMoneyTransferModal.jsx';
import AddMoneyCardModal from '../../components/modals/wallet/AddMoneyCardModal.jsx';
import TransferProcessModal from '../../components/modals/wallet/TransferProcessModal.jsx';
import TransactionPinModal from '../../components/modals/wallet/TransactionPinModal.jsx';
import TransactionSuccessModal from '../../components/modals/wallet/TransactionSuccessModal.jsx';
import { walletService } from '../../api/services/wallet.service.js';
import { cardsService } from '../../api/services/cards.service.js';
import { Bell } from 'lucide-react';

export default function OrgDashboard() {
  const queryClient = useQueryClient();
  const [isAnnouncementsModalOpen, setIsAnnouncementsModalOpen] = useState(false);
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

  // Fetch corporate wallet metrics
  const {
    data: walletData,
    isLoading: isWalletLoading,
  } = useQuery({
    queryKey: ['org-wallet-metrics'],
    queryFn: () => walletService.getOrgWallet(),
    retry: false,
    staleTime: 30 * 1000,
  });

  const formattedBalance = isWalletLoading
    ? '---'
    : walletData?.availableBalance != null
      ? Number(walletData.availableBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : '0.00';

  const currencySymbol = walletData?.currencySymbol || '₦';

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
        {/* Top Section: Wallet + Recent Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Left Card: Wallet Card with Fund & Transfer buttons */}
          <WalletCard
            title="Wallet"
            balance={formattedBalance}
            currency={currencySymbol}
            className="h-full"
            actions={
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddMoneyOptionsOpen(true)}
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl border border-primary/25 bg-blue-50/70 hover:bg-blue-100/70 text-primary font-medium text-xs sm:text-sm transition-colors cursor-pointer select-none"
                >
                  Fund Wallet
                </button>
                <button
                  type="button"
                  onClick={() => setIsTransferOptionsOpen(true)}
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl border border-primary/25 bg-blue-50/70 hover:bg-blue-100/70 text-primary font-medium text-xs sm:text-sm transition-colors cursor-pointer select-none"
                >
                  Transfer Fund
                </button>
              </div>
            }
          />

          {/* Right Card: Recent Announcement Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-[0_16px_35px_-8px_rgba(0,0,0,0.13),0_6px_14px_-4px_rgba(0,0,0,0.06)] border border-primary/40 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-semibold text-primary">
                Recent Announcement
              </h2>
              <button
                type="button"
                onClick={() => setIsAnnouncementsModalOpen(true)}
                className="text-xs sm:text-sm font-medium text-primary hover:underline cursor-pointer"
              >
                See more
              </button>
            </div>

            <div className="py-8 flex flex-col items-center justify-center text-center space-y-2 text-slate-400">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                <Bell className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-600">No Announcements</p>
              <p className="text-[11px] text-slate-400 max-w-xs">
                Important platform notices and organization updates will appear here.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Dual Finance Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-primary-text px-1">
              Finance
            </h3>
            <EarningChart
              title="Earning"
              totalEarnings="0.00"
              currency="₦"
              growthRate="0%"
              data={[]}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-primary-text px-1">
              Finance
            </h3>
            <EarningChart
              title="Earning"
              totalEarnings="0.00"
              currency="₦"
              growthRate="0%"
              data={[]}
            />
          </div>
        </div>
      </div>

      {/* Announcements Modal */}
      <AnnouncementsModal
        isOpen={isAnnouncementsModalOpen}
        onClose={() => setIsAnnouncementsModalOpen(false)}
      />

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
