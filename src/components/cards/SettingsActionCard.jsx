import React from 'react';
import { Plus } from 'lucide-react';

/**
 * SettingsActionCard renders a grouping of action rows matching SettingPage.png.
 * Each item has a title, a "View" action button, and an optional circular plus (+) action button.
 */
export function SettingsActionItem({
  title,
  onView,
  onAdd,
  showAdd = true,
  viewText = 'View',
  className = '',
}) {
  return (
    <div
      className={`flex items-center justify-between py-4 px-5 sm:px-6 hover:bg-slate-50/50 transition-colors ${className}`}
    >
      <span className="text-xs sm:text-sm font-medium text-slate-800">
        {title}
      </span>

      <div className="flex items-center space-x-3 sm:space-x-4">
        {onView && (
          <button
            type="button"
            onClick={onView}
            className="text-xs sm:text-sm font-semibold text-primary underline hover:text-primary/80 transition-colors cursor-pointer select-none"
          >
            {viewText}
          </button>
        )}

        {showAdd && onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs select-none"
            aria-label={`Add new ${title}`}
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function SettingsActionCard({ children, className = '' }) {
  return (
    <div
      className={`bg-white rounded-2xl sm:rounded-3xl shadow-xs border border-slate-100 overflow-hidden divide-y divide-slate-100 ${className}`}
    >
      {children}
    </div>
  );
}
