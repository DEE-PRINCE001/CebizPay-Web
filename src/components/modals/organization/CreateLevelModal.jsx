import React, { useState } from 'react';
import BaseModal from '../BaseModal.jsx';
import ChipInput from '../../forms/ChipInput.jsx';
import Button from '../../common/Button.jsx';

/**
 * CreateLevelModal matches CreateLevel.png:
 * Form with Level name input, Amount input, Members chip cloud,
 * and "Create Level" primary action button.
 */
export default function CreateLevelModal({
  isOpen,
  onClose,
  initialData = null,
  onSubmit,
}) {
  const [levelName, setLevelName] = useState(
    initialData?.name || 'Level 10'
  );
  const [amount, setAmount] = useState(
    initialData?.amount || 'NGN500,000'
  );
  const [members, setMembers] = useState(
    initialData?.members || [
      'Adebola John',
      'Adebola John',
      'Adebola John',
      'Adebola John',
      'Adebola John',
      'Adebola John',
    ]
  );

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!levelName.trim()) return;
    onSubmit?.({
      id: initialData?.id || `lvl-${Date.now()}`,
      name: levelName.trim(),
      amount: amount.trim(),
      members,
    });
    onClose?.();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Level' : 'Create Level'}
      maxWidth="max-w-[420px]"
    >
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {/* Level Name */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs sm:text-sm font-semibold text-primary-text select-none">
            Level
          </label>
          <input
            type="text"
            value={levelName}
            onChange={(e) => setLevelName(e.target.value)}
            placeholder="e.g. Level 10"
            required
            className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-primary-text placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        {/* Amount */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs sm:text-sm font-semibold text-primary-text select-none">
            Amount
          </label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. NGN500,000"
            required
            className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-primary-text placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        {/* Members Chip Input */}
        <ChipInput
          label="Members"
          items={members}
          onChange={setMembers}
          placeholder="Member name & Enter..."
        />

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-auto px-7 py-3 rounded-xl text-xs sm:text-sm font-semibold shadow-xs"
          >
            {initialData ? 'Update Level' : 'Create Level'}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}
