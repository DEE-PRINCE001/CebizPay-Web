import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage = 1,
  totalPages = 130,
  onPageChange,
  className = '',
}) {
  const handlePrev = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 w-full pt-4 ${className}`}>
      {/* Left Action: Next pill button */}
      <div>
        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center justify-center px-6 py-2 border border-slate-200 rounded-full text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none"
        >
          Next
        </button>
      </div>

      {/* Right Controls: Previous arrow, page indicator, next arrow, total page count */}
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentPage <= 1}
          className="p-2 border border-slate-200 rounded-lg text-slate-500 bg-white hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="px-3 py-1 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-700 bg-white select-none">
          {currentPage}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          className="p-2 border border-slate-200 rounded-lg text-slate-500 bg-white hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <span className="text-xs sm:text-sm font-medium text-slate-500 pl-1 select-none">
          of {totalPages}
        </span>
      </div>
    </div>
  );
}
