import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Input from '../forms/Input.jsx';
import Button from '../common/Button.jsx';
import FormError from '../forms/FormError.jsx';

export default function CreateLoanPlanModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: '',
    interestRate: '',
    eligibility: '',
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        description: '',
        amount: '',
        interestRate: '',
        eligibility: '',
      });
      setErrors({});
      setGeneralError('');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (generalError) setGeneralError('');
  };

  const handleAmountChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    if (!raw) {
      setFormData((prev) => ({ ...prev, amount: '' }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      amount: `NGN ${Number(raw).toLocaleString('en-US')}`,
    }));
    if (errors.amount) setErrors((prev) => ({ ...prev, amount: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGeneralError('');
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Loan plan name is required.';
    if (!formData.description.trim()) newErrors.description = 'Loan description is required.';
    if (!formData.amount.trim()) newErrors.amount = 'Loan amount is required.';
    if (!formData.interestRate.trim()) newErrors.interestRate = 'Interest rate is required.';
    if (!formData.eligibility.trim()) newErrors.eligibility = 'Eligibility requirements are required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const cleanAmount = formData.amount.replace(/[^0-9]/g, '');
    const cleanRate = formData.interestRate.replace(/[^0-9.]/g, '');

    onSubmit?.({
      ...formData,
      rawAmount: cleanAmount ? Number(cleanAmount) : 0,
      numericInterestRate: cleanRate ? parseFloat(cleanRate) : 0,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-9 shadow-2xl border border-slate-100 relative my-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-text tracking-tight">
            Create Loan Plan
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {generalError && (
          <div className="mb-4">
            <FormError message={generalError} />
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 sm:space-y-5">
          <Input
            label="Loan Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Enter corporate loan plan name"
            disabled={isLoading}
            required
          />

          <Input
            label="Loan Description"
            name="description"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            placeholder="Describe the loan purpose and repayment duration"
            disabled={isLoading}
            required
          />

          <Input
            label="Amount"
            name="amount"
            value={formData.amount}
            onChange={handleAmountChange}
            error={errors.amount}
            placeholder="NGN 200, 000"
            disabled={isLoading}
            required
          />

          <Input
            label="Interests"
            name="interestRate"
            value={formData.interestRate}
            onChange={handleChange}
            error={errors.interestRate}
            placeholder="10%"
            disabled={isLoading}
            required
          />

          <Input
            label="Eligibility"
            name="eligibility"
            multiline
            rows={4}
            value={formData.eligibility}
            onChange={handleChange}
            error={errors.eligibility}
            placeholder="Detail employee eligibility requirements, terms and guarantor requirements"
            disabled={isLoading}
            required
          />

          {/* Action Button */}
          <div className="pt-3">
            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              disabled={isLoading}
              className="w-auto px-8 py-2.5 rounded-xl text-xs sm:text-sm font-medium"
            >
              Create Loan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
