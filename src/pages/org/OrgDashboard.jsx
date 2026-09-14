import React, { useState } from 'react';
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

const MOCK_FINANCE_DATA = [
  { name: 'Jan', value: 110 },
  { name: 'Feb', value: 130 },
  { name: 'Mar', value: 195 },
  { name: 'Apr', value: 180 },
  { name: 'May', value: 160 },
  { name: 'Jun', value: 175 },
  { name: 'Jul', value: 160 },
  { name: 'Aug', value: 185 },
  { name: 'Sep', value: 195 },
  { name: 'Oct', value: 188 },
  { name: 'Nov', value: 180 },
  { name: 'Dec', value: 190 },
];

const MOCK_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    title: 'Pending User',
    description: 'many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or .....',
    indicatorColor: 'green',
  },
  {
    id: 'ann-2',
    title: 'Pending User',
    description: 'many variations of passages of Lorem Ipsum available, but the......',
    indicatorColor: 'purple',
  },
  {
    id: 'ann-3',
    title: 'Pending User',
    description: 'many variations of passages of Lorem Ipsum available, but the......',
    indicatorColor: 'orange',
  },
];

export default function OrgDashboard() {
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

  return (
    <OrgDashboardLayout>
      <div className="flex flex-col space-y-6 sm:space-y-8">
        {/* Top Section: Wallet + Recent Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Left Card: Wallet Card with Fund & Transfer buttons */}
          <WalletCard
            title="Wallet"
            balance="238,000,909"
            currency="#"
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

            <div className="flex flex-col space-y-3.5 divide-y divide-slate-100/60">
              {MOCK_ANNOUNCEMENTS.map((ann, idx) => (
                <div key={ann.id} className={idx > 0 ? 'pt-3' : ''}>
                  <AnnouncementItem
                    title={ann.title}
                    description={ann.description}
                    indicatorColor={ann.indicatorColor}
                  />
                </div>
              ))}
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
              totalEarnings="3,445"
              currency="#"
              growthRate="+3.4%"
              data={MOCK_FINANCE_DATA}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-primary-text px-1">
              Finance
            </h3>
            <EarningChart
              title="Earning"
              totalEarnings="3,445"
              currency="#"
              growthRate="+3.4%"
              data={MOCK_FINANCE_DATA}
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
          setIsPinModalOpen(true);
        }}
      />

      <TransactionPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSubmit={(enteredPin) => {
          setIsPinModalOpen(false);
          setTransactionSuccessData({
            ...pendingTransaction,
            pin: enteredPin,
          });
          setIsSuccessModalOpen(true);
        }}
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
