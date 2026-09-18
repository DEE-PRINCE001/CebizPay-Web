import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * OrgMetricCard displays a corporate metric title with a large bold monetary or numerical value.
 * Strict adherence to design tokens: bg-white, text-primary-text, Satoshi typography.
 */
export default function OrgMetricCard({
  title,
  value = '0.00',
  currency = '₦',
  isLoading = false,
  isError = false,
  errorMessage = '',
  subtext = '',
  className = '',
}) {
  return (
    <div
      className={`bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-100 flex flex-col justify-center ${className}`}
    >
      <h3 className="text-xs sm:text-sm font-medium text-slate-500 mb-2 truncate">
        {title}
      </h3>

      {isLoading ? (
        <div className="flex items-center space-x-2 py-2 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-xs font-medium">Loading...</span>
        </div>
      ) : isError ? (
        <span className="text-xs text-rejected font-semibold py-2">
          {errorMessage || 'Error'}
        </span>
      ) : (
        <>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-text tracking-tight leading-none truncate">
            {currency ? <span className="font-sans mr-0.5">{currency}</span> : null}
            {value}
          </h2>
          {subtext && (
            <p className="text-xs text-slate-500 mt-2.5 font-medium truncate">
              {subtext}
            </p>
          )}
        </>
      )}
    </div>
  );
}
