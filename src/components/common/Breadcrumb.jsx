import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function Breadcrumb({
  parentLabel = 'Back',
  parentTo,
  currentLabel = '',
  separator = '-',
  onBack,
  className = '',
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (parentTo) {
      navigate(parentTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={`flex items-center space-x-2 text-primary-text mb-6 px-1 ${className}`}>
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center text-primary-text hover:text-primary transition-colors cursor-pointer select-none"
        aria-label={`Back to ${parentLabel}`}
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        <span className="text-xl sm:text-2xl font-semibold">{parentLabel}</span>
      </button>

      {separator && (
        <span className="text-xl sm:text-2xl font-semibold text-slate-400">
          {separator}
        </span>
      )}

      {currentLabel && (
        <h1 className="text-xl sm:text-2xl font-bold text-primary-text truncate">
          {currentLabel}
        </h1>
      )}
    </div>
  );
}
