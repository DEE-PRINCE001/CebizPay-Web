import React, { useState, useEffect, useRef } from 'react';

const FILTER_OPTIONS = [
  { id: 'verified', label: 'Verified', value: 'Verified' },
  { id: 'pending', label: 'Pending', value: 'Pending' },
  { id: 'suspended', label: 'Supended', value: 'Suspended' },
  { id: 'rejected', label: 'Rejected', value: 'Rejected' },
];

export default function FilterDropdown({
  isOpen,
  onClose,
  selectedStatus,
  onApply,
  className = '',
}) {
  const [prevSelected, setPrevSelected] = useState(selectedStatus || '');
  const [tempSelected, setTempSelected] = useState(selectedStatus || '');
  const dropdownRef = useRef(null);

  if (prevSelected !== (selectedStatus || '')) {
    setPrevSelected(selectedStatus || '');
    setTempSelected(selectedStatus || '');
  }

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose?.();
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose?.();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (value) => {
    // Toggle off if already selected, or select new
    setTempSelected((prev) => (prev === value ? '' : value));
  };

  const handleApply = () => {
    onApply?.(tempSelected);
    onClose?.();
  };

  return (
    <div
      ref={dropdownRef}
      className={`absolute right-0 top-full mt-2 w-44 sm:w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-5 z-50 select-none ${className}`}
      role="dialog"
      aria-label="Filter options"
    >
      <h3 className="text-sm font-semibold text-primary-text mb-4">Show for</h3>

      <div className="space-y-3.5">
        {FILTER_OPTIONS.map((option) => {
          const isChecked = tempSelected === option.value;
          return (
            <div
              key={option.id}
              onClick={() => handleSelect(option.value)}
              className="flex items-center space-x-3 cursor-pointer group"
              role="radio"
              aria-checked={isChecked}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect(option.value);
                }
              }}
            >
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  isChecked
                    ? 'border-2 border-primary'
                    : 'border border-slate-300 group-hover:border-slate-400'
                }`}
              >
                {isChecked && <div className="w-2 h-2 rounded-full bg-primary" />}
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-700 group-hover:text-slate-900">
                {option.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={handleApply}
          className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-medium text-xs px-5 py-2 rounded-lg shadow-xs cursor-pointer transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
