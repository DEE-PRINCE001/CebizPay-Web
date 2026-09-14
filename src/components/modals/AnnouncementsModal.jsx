import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, Bell, Loader2 } from 'lucide-react';
import Button from '../common/Button.jsx';
import { userService } from '../../api/services/user.service.js';

export default function AnnouncementsModal({
  isOpen,
  onClose,
}) {
  const {
    data: announcementsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['all-platform-announcements'],
    queryFn: () => userService.getPlatformAnnouncements({ pageSize: 50 }),
    enabled: isOpen,
    staleTime: 30 * 1000,
    retry: false,
  });

  if (!isOpen) return null;

  const items = announcementsData?.items || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-primary-text">
                All Announcements
              </h2>
              <p className="text-xs text-slate-400">
                {items.length} {items.length === 1 ? 'announcement' : 'announcements'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 divide-y divide-slate-100">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-2 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs">Loading announcements...</span>
            </div>
          ) : isError ? (
            <div className="py-12 text-center text-xs text-rejected">
              {error?.message || 'Failed to load announcements.'}
            </div>
          ) : items.length > 0 ? (
            items.map((item) => {
              const formattedDate = item.publishedAtUtc || item.createdAtUtc
                ? new Date(item.publishedAtUtc || item.createdAtUtc).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : null;

              return (
                <div key={item.id} className="pt-4 first:pt-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-primary-text text-sm sm:text-base">
                      {item.title}
                    </h3>
                    {formattedDate && (
                      <span className="text-[11px] text-slate-400 whitespace-nowrap">
                        {formattedDate}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed whitespace-pre-line">
                    {item.description || item.content}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-400 text-sm">
              No announcements published yet.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            className="w-auto px-6 py-2 text-xs sm:text-sm"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
