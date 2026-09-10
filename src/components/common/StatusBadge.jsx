import React from 'react';

const STATUS_STYLES = {
  suspended: 'text-suspended',
  pending: 'text-pending',
  verified: 'text-verified',
  rejected: 'text-rejected',
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
