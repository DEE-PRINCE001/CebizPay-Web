import React from 'react';

const STATUS_STYLES = {
  // Positive / Terminal Success
  active: 'text-active',
  verified: 'text-verified',
  completed: 'text-active',
  successful: 'text-active',
  successfull: 'text-active', // backwards compatibility
  succeeded: 'text-active',
  settled: 'text-active',
  published: 'text-active',
  paid: 'text-active',

  // Pending / Processing In-Flight
  pending: 'text-pending',
  processing: 'text-pending',

  // Negative / Terminal Rejection or Default
  suspended: 'text-suspended',
  rejected: 'text-rejected',
  failed: 'text-rejected',
  reversed: 'text-rejected',
  terminated: 'text-rejected',
  defaulted: 'text-rejected',
  overdue: 'text-rejected',

  // Draft / Inactive
  draft: 'text-slate-500',
  archived: 'text-slate-400',
  closed: 'text-slate-500',
};

export default function StatusBadge({ status, className = '' }) {
  if (!status) return null;

  const normalized = String(status).trim().toLowerCase();
  const colorClass = STATUS_STYLES[normalized] || 'text-slate-600';

  return (
    <span className={`inline-block font-medium text-xs sm:text-sm ${colorClass} ${className}`}>
      {status}
    </span>
  );
}
