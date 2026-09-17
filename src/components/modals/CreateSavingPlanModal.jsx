import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Input from '../forms/Input.jsx';
import Button from '../common/Button.jsx';
import FormError from '../forms/FormError.jsx';

const SAVING_COLORS = [
  { id: 'blue', label: 'Primary Blue', hex: '#001EC5', bgClass: 'bg-primary' },
  { id: 'pink', label: 'Pink', hex: '#FF4081', bgClass: 'bg-[#FF4081]' },
  { id: 'green', label: 'Active Green', hex: '#15803D', bgClass: 'bg-active' },
  { id: 'brown', label: 'Brown', hex: '#8D4E16', bgClass: 'bg-[#8D4E16]' },
  { id: 'yellow', label: 'Amber Yellow', hex: '#C07D00', bgClass: 'bg-pending' },
];

const FREQUENCY_OPTIONS = [
  { value: 'Daily', label: 'Daily' },
  { value: 'Weekly', label: 'Weekly' },
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Yearly', label: 'Yearly' },
];

export default function CreateSavingPlanModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: '',
    startDate: '',
    endDate: '',
    frequency: 'Monthly',
    colorHex: SAVING_COLORS[0].hex,
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        description: '',
        amount: '',
        startDate: '',
        endDate: '',
        frequency: 'Monthly',
        colorHex: SAVING_COLORS[0].hex,
      });
      setErrors({});
      setGeneralError('');
    }
  }, [isOpen]);

  // Handle ESC key to dismiss
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

    if (!formData.name.trim()) newErrors.name = 'Saving plan name is required.';
    if (!formData.description.trim()) newErrors.description = 'Saving description is required.';
    if (!formData.amount.trim()) newErrors.amount = 'Amount is required.';
    if (!formData.startDate.trim()) newErrors.startDate = 'Start date is required.';
    if (!formData.endDate.trim()) newErrors.endDate = 'End date is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const cleanAmount = formData.amount.replace(/[^0-9]/g, '');
    onSubmit?.({
      ...formData,
      rawAmount: cleanAmount ? Number(cleanAmount) : 0,
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
            Create Saving Plan
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
            label="Saving Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Enter saving plan name"
            disabled={isLoading}
            required
          />

          <Input
            label="Saving Description"
            name="description"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            placeholder="Describe the plan terms or saving purpose"
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
            label="Start Date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            error={errors.startDate}
            placeholder="22 Dec"
            disabled={isLoading}
            required
          />

          <Input
            label="End Date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            error={errors.endDate}
            placeholder="22 Mar"
            disabled={isLoading}
            required
          />

          <Input
            label="Savings Frequency"
            name="frequency"
            options={FREQUENCY_OPTIONS}
            value={formData.frequency}
            onChange={handleChange}
            disabled={isLoading}
          />

          {/* Select Saving Color Palette */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2.5">
              Select Saving Color
            </label>
            <div className="flex items-center space-x-3">
              {SAVING_COLORS.map((swatch) => {
                const isSelected = formData.colorHex === swatch.hex;
                return (
                  <button
                    key={swatch.id}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, colorHex: swatch.hex }))}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md transition-all cursor-pointer select-none ${swatch.bgClass} ${
                      isSelected
                        ? 'ring-2 ring-offset-2 ring-primary scale-110 shadow-xs'
                        : 'hover:opacity-90'
                    }`}
                    aria-label={`Select color ${swatch.label}`}
                    title={swatch.label}
                  />
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-3">
            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              disabled={isLoading}
              className="w-auto px-8 py-2.5 rounded-xl text-xs sm:text-sm font-medium"
            >
              Create Plan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
