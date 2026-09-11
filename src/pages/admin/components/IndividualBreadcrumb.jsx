import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function IndividualBreadcrumb({ name }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center space-x-2 text-primary-text mb-6 px-1">
      <button
        type="button"
        onClick={() => navigate('/individual')}
        className="inline-flex items-center text-primary-text hover:text-primary transition-colors cursor-pointer"
        aria-label="Back to Individuals"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        <span className="text-xl sm:text-2xl font-semibold">Individual</span>
      </button>
      <span className="text-xl sm:text-2xl font-semibold text-slate-400">-</span>
      <h1 className="text-xl sm:text-2xl font-bold text-primary-text truncate">
        {name || 'Individual'}
      </h1>
    </div>
  );
}
