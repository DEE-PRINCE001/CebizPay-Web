import React, { useState } from 'react';
import womanPhoto from '../../../assets/woman.svg';
import IndividualBreadcrumb from './IndividualBreadcrumb.jsx';
import IndividualTransactionsTab from './IndividualTransactionsTab.jsx';
import IndividualWalletTab from './IndividualWalletTab.jsx';
import IndividualSavingsTab from './IndividualSavingsTab.jsx';

export default function IndividualActiveView({
  individual,
  transactions = [],
  wallet = null,
  savingsPlans = [],
  onSuspend,
  onReactivate,
  onExportTransactions,
}) {
  const [activeTab, setActiveTab] = useState('Transaction'); // 'Transaction' | 'Wallet' | 'Saving Plans'

  const userName = individual?.name || 'Individual';
  const status = individual?.status || 'Active';
  const isSuspended = status === 'Suspended';
  const photo = individual?.photoUrl || individual?.avatarUrl || womanPhoto;

  return (
    <div className="flex flex-col space-y-6">
      {/* Breadcrumb Header */}
      <IndividualBreadcrumb name={userName} />

      {/* Top Profile Summary Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-5 sm:space-x-6">
          {/* Photo in Blue Bordered Container */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-primary shrink-0 bg-slate-50 shadow-xs">
            <img
              src={photo}
              alt={userName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* User Name & Status */}
          <div className="flex flex-col space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-text">
              {userName}
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm font-medium text-slate-500">Status</span>
              <span className={`text-xs sm:text-sm font-bold ${isSuspended ? 'text-suspended' : 'text-emerald-600'}`}>
                {isSuspended ? 'Suspended' : 'Active'}
              </span>
            </div>
          </div>
        </div>

        {/* Top-Right Action Button: Suspend / Re-Activate */}
        <div className="self-end sm:self-center">
          {isSuspended ? (
            <button
              type="button"
              onClick={onReactivate}
              className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 active:bg-primary/80 text-white font-medium text-xs sm:text-sm px-8 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs select-none"
            >
              Re-Activate
            </button>
          ) : (
            <button
              type="button"
              onClick={onSuspend}
              className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 active:bg-primary/80 text-white font-medium text-xs sm:text-sm px-8 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs select-none"
            >
              Suspend
            </button>
          )}
        </div>
      </div>

      {/* Bottom Card: Tabs & Content */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xs border border-slate-100 flex flex-col space-y-6">
        {/* Tab Headers */}
        <div className="flex items-center space-x-6 sm:space-x-8 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('Transaction')}
            className={`pb-3 text-xs sm:text-sm transition-colors cursor-pointer select-none ${
              activeTab === 'Transaction'
                ? 'border-b-2 border-primary font-bold text-primary -mb-px'
                : 'text-slate-500 hover:text-slate-700 font-medium'
            }`}
          >
            Transaction
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('Wallet')}
            className={`pb-3 text-xs sm:text-sm transition-colors cursor-pointer select-none ${
              activeTab === 'Wallet'
                ? 'border-b-2 border-primary font-bold text-primary -mb-px'
                : 'text-slate-500 hover:text-slate-700 font-medium'
            }`}
          >
            Wallet
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('Saving Plans')}
            className={`pb-3 text-xs sm:text-sm transition-colors cursor-pointer select-none ${
              activeTab === 'Saving Plans'
                ? 'border-b-2 border-primary font-bold text-primary -mb-px'
                : 'text-slate-500 hover:text-slate-700 font-medium'
            }`}
          >
            Saving Plans
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'Transaction' ? (
          <IndividualTransactionsTab
            transactions={transactions}
            onExport={onExportTransactions}
          />
        ) : activeTab === 'Wallet' ? (
          <IndividualWalletTab wallet={wallet || individual?.wallet} />
        ) : (
          <IndividualSavingsTab savings={savingsPlans?.length ? savingsPlans : (individual?.savingsPlans || [])} />
        )}
      </div>
    </div>
  );
}
