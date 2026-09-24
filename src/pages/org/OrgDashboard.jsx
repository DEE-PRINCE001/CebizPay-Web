import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import OrgDashboardLayout from '../../components/layout/OrgDashboardLayout.jsx';
import WalletCard from '../../components/cards/WalletCard.jsx';
import EarningChart from '../../components/common/EarningChart.jsx';
import AnnouncementsModal from '../../components/modals/AnnouncementsModal.jsx';
import CreateTenantAnnouncementModal from '../../components/modals/CreateTenantAnnouncementModal.jsx';
import AddMoneyOptionsModal from '../../components/modals/wallet/AddMoneyOptionsModal.jsx';
import TransferOptionsModal from '../../components/modals/wallet/TransferOptionsModal.jsx';
import AddMoneyTransferModal from '../../components/modals/wallet/AddMoneyTransferModal.jsx';
import AddMoneyCardModal from '../../components/modals/wallet/AddMoneyCardModal.jsx';
import TransferProcessModal from '../../components/modals/wallet/TransferProcessModal.jsx';
import TransactionPinModal from '../../components/modals/wallet/TransactionPinModal.jsx';
import TransactionSuccessModal from '../../components/modals/wallet/TransactionSuccessModal.jsx';
import SetupPinModal from '../../components/modals/wallet/SetupPinModal.jsx';
import { useTransactionPinGuard } from '../../hooks/useTransactionPinGuard.js';
import { walletService } from '../../api/services/wallet.service.js';
import { cardsService } from '../../api/services/cards.service.js';
import { userService } from '../../api/services/user.service.js';
import { AnnouncementScopeValues } from '../../data/enums.js';
import { Bell, Loader2 } from 'lucide-react';

export default function OrgDashboard() {
  const queryClient = useQueryClient();
  const [isAnnouncementsModalOpen, setIsAnnouncementsModalOpen] = useState(false);
  const [isCreateAnnouncementOpen, setIsCreateAnnouncementOpen] = useState(false);
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

  const {
    executeWithPinGuard,
    isSetupPinOpen,
    closeSetupPin,
    onPinSetupSuccess,
  } = useTransactionPinGuard();

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

  // Fetch Workplace Announcements only (matching reference design)
  const { data: workplaceAnnouncements, isLoading: isAnnouncementsLoading } = useQuery({
    queryKey: ['workplace-announcements'],
    queryFn: () => userService.getWorkplaceAnnouncements({ pageSize: 10 }),
    staleTime: 30 * 1000,
    retry: false,
  });

  const recentAnnouncements = workplaceAnnouncements?.items || [];

  // Create Announcement Mutation
  const announcementMutation = useMutation({
    mutationFn: (payload) =>
      userService.createAnnouncement({
        title: payload.title,
        description: payload.description,
        bannerUrl: payload.bannerUrl || null,
        scope: AnnouncementScopeValues.Workplace, // 2 = Workplace
        publishImmediately: true,
      }),
    onSuccess: () => {
      setIsCreateAnnouncementOpen(false);
      queryClient.invalidateQueries({ queryKey: ['workplace-announcements'] });
    },
  });

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
                  onClick={() => executeWithPinGuard(() => setIsTransferOptionsOpen(true))}
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

            {isAnnouncementsLoading ? (
              <div className="py-8 flex flex-col items-center justify-center space-y-2 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-xs">Loading announcements...</span>
              </div>
            ) : recentAnnouncements.length > 0 ? (
              <div className="space-y-4 py-1">
                {recentAnnouncements.slice(0, 3).map((item, idx) => {
                  const borderColors = [
                    'border-l-emerald-500',
                    'border-l-pink-500',
                    'border-l-amber-500',
                  ];
                  const barColor = borderColors[idx % borderColors.length];

                  return (
                    <div
                      key={item.id || idx}
                      className={`border-l-2 ${barColor} pl-3 py-0.5 space-y-0.5`}
                    >
                      <h3 className="text-sm sm:text-base font-bold text-primary-text line-clamp-1 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {item.description || item.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-2 text-slate-400">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                  <Bell className="w-5 h-5" />
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-600">No Announcements</p>
                <p className="text-[11px] text-slate-400 max-w-xs">
                  Workplace updates and company notices will appear here.
                </p>
              </div>
            )}
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

      {/* Announcements Modal matching AnnouncementModal.png */}
      <AnnouncementsModal
        isOpen={isAnnouncementsModalOpen}
        onClose={() => setIsAnnouncementsModalOpen(false)}
        onAddAnnouncement={() => {
          setIsAnnouncementsModalOpen(false);
          setIsCreateAnnouncementOpen(true);
        }}
      />

      {/* Create Announcement Modal */}
      <CreateTenantAnnouncementModal
        isOpen={isCreateAnnouncementOpen}
        onClose={() => setIsCreateAnnouncementOpen(false)}
        onSubmit={(payload) => announcementMutation.mutate(payload)}
        isLoading={announcementMutation.isPending}
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
          executeWithPinGuard(() => {
            setIsAddMoneyCardOpen(false);
            setPendingTransaction({
              type: 'fund',
              ...data,
            });
            setPinErrorMessage('');
            setIsPinModalOpen(true);
          });
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
          executeWithPinGuard(() => {
            setIsTransferProcessOpen(false);
            setPendingTransaction({
              type: 'transfer',
              ...data,
            });
            setPinErrorMessage('');
            setIsPinModalOpen(true);
          });
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

      <SetupPinModal
        isOpen={isSetupPinOpen}
        onClose={closeSetupPin}
        onSuccess={onPinSetupSuccess}
      />
    </OrgDashboardLayout>
  );
}
