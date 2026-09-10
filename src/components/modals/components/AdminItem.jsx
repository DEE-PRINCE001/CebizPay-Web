import React from 'react';
import { Trash2 } from 'lucide-react';
import ToggleSwitch from './ToggleSwitch.jsx';

export const AdminItem = ({ admin, isLast = false, onToggle, onDelete, disabled = false }) => {
  const displayName = admin?.name || admin?.fullName || (admin?.email ? admin.email.split('@')[0] : 'Admin User');

  return (
    <div
      className={`flex items-center justify-between p-3 sm:p-4 ${
        !isLast ? 'border-b border-dashed border-sky-400' : ''
      }`}
    >
      {/* Admin Name / Identifier */}
      <span className="text-gray-800 text-sm sm:text-base font-normal truncate max-w-[180px] sm:max-w-[220px]">
        {displayName}
      </span>

      {/* Controls Container */}
      <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
        {/* Toggle Switch */}
        <ToggleSwitch
          checked={Boolean(admin?.isActive)}
          disabled={disabled}
          onChange={() => onToggle && onToggle(admin.id)}
          label={`Toggle status for ${displayName}`}
        />

        {/* Vertical Divider */}
        <div className="h-7 sm:h-8 w-px bg-gray-300" />

        {/* Delete Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onDelete && onDelete(admin.id)}
          className="p-1.5 text-blue-400 hover:text-red-500 hover:bg-gray-100 rounded-full border border-gray-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`Delete ${displayName}`}
        >
          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};

export default AdminItem;
