import React, { useState } from 'react';
import BaseModal from '../BaseModal.jsx';
import { ChevronDown } from 'lucide-react';

const BANK_OPTIONS = [
  'GTBank',
  'Kuda Bank',
  'Access Bank',
  'Zenith Bank',
  'First Bank of Nigeria',
  'Providus Bank',
  'United Bank for Africa',
];

const CURRENCY_OPTIONS = [
  'Naira (NGN)',
  'US Dollar (USD)',
  'USDT',
];

export default function EditPaymentDetailsModal({
  isOpen,
  onClose,
  initialData = null,
  onUpdate,
}) {
  const [formData, setFormData] = useState({
    dateCreated: initialData?.dateCreated || '30/08/2023',
    paymentId: initialData?.paymentId || '001',
    receivingBank: initialData?.receivingBank || 'GTBank',
    payingBank: initialData?.payingBank || 'Kuda',
    amount: initialData?.amountNumber || '300, 000',
    currency: initialData?.currency || 'Naira (NGN)',
    remarks: initialData?.remarksSummary || 'Write remarks',
    description: initialData?.description || 'Write a message',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    onUpdate?.(formData);
    onClose?.();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Payment Details"
      subtitle="Lorem ipsum dolor sit amet consectetur. Quis quis ac quis vitae platea"
      maxWidth="max-w-[450px]"
    >
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        {/* Date created */}
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-semibold text-primary-text select-none">
            Date created
          </label>
          <input
            type="text"
            value={formData.dateCreated}
            onChange={(e) => handleChange('dateCreated', e.target.value)}
            placeholder="dd/mm/yyyy"
            className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-primary-text placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        {/* Payment ID */}
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-semibold text-primary-text select-none">
            Payment ID
          </label>
          <input
            type="text"
            value={formData.paymentId}
            onChange={(e) => handleChange('paymentId', e.target.value)}
            placeholder="001"
            className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-primary-text placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        {/* Receiving Bank */}
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-semibold text-primary-text select-none">
            Receiving Bank
          </label>
          <div className="relative">
            <select
              value={formData.receivingBank}
              onChange={(e) => handleChange('receivingBank', e.target.value)}
              className="w-full py-2.5 px-3.5 pr-9 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-primary-text appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer"
            >
              {BANK_OPTIONS.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Paying Bank */}
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-semibold text-primary-text select-none">
            Paying Bank
          </label>
          <div className="relative">
            <select
              value={formData.payingBank}
              onChange={(e) => handleChange('payingBank', e.target.value)}
              className="w-full py-2.5 px-3.5 pr-9 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-primary-text appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer"
            >
              {BANK_OPTIONS.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Amount */}
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-semibold text-primary-text select-none">
            Amount
          </label>
          <input
            type="text"
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            placeholder="300, 000"
            className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-primary-text placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        {/* Currency */}
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-semibold text-primary-text select-none">
            Currency
          </label>
          <div className="relative">
            <select
              value={formData.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="w-full py-2.5 px-3.5 pr-9 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-primary-text appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer"
            >
              {CURRENCY_OPTIONS.map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Remarks */}
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-semibold text-primary-text select-none">
            Remarks
          </label>
          <input
            type="text"
            value={formData.remarks}
            onChange={(e) => handleChange('remarks', e.target.value)}
            placeholder="Write remarks"
            className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-primary-text placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-semibold text-primary-text select-none">
            Description
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Write a message"
            className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-primary-text placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-2.5 rounded-full border border-primary/40 text-primary hover:bg-blue-50/50 text-xs sm:text-sm font-semibold transition-colors cursor-pointer select-none"
          >
            CANCEL
          </button>
          <button
            type="submit"
            className="px-8 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer select-none shadow-xs"
          >
            UPDATE
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
