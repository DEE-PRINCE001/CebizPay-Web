import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, Bell, Loader2 } from 'lucide-react';
import Button from '../common/Button.jsx';
import { userService } from '../../api/services/user.service.js';

export default function AnnouncementsModal({
  isOpen,
  onClose,
  scope = 'all',
}) {
  const [activeTab, setActiveTab] = useState(scope);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(scope || 'all');
    }
  }, [isOpen, scope]);

  // Handle ESC key and lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // 1. Fetch Workplace Announcements
  const {
    data: workplaceData,
    isLoading: isWorkplaceLoading,
    isError: isWorkplaceError,
    error: workplaceError,
  } = useQuery({
    queryKey: ['workplace-announcements'],
    queryFn: () => userService.getWorkplaceAnnouncements({ pageSize: 50 }),
    enabled: isOpen,
    staleTime: 30 * 1000,
    retry: false,
  });

  // 2. Fetch Platform Announcements
  const {
    data: platformData,
    isLoading: isPlatformLoading,
    isError: isPlatformError,
    error: platformError,
  } = useQuery({
    queryKey: ['platform-announcements'],
    queryFn: () => userService.getPlatformAnnouncements({ pageSize: 50 }),
    enabled: isOpen,
    staleTime: 30 * 1000,
    retry: false,
  });

  const workplaceItems = useMemo(
    () => (workplaceData?.items || []).map((item) => ({ ...item, _source: 'workplace' })),
    [workplaceData]
  );

  const platformItems = useMemo(
    () => (platformData?.items || []).map((item) => ({ ...item, _source: 'platform' })),
    [platformData]
  );

  const allItems = useMemo(() => {
    return [...workplaceItems, ...platformItems].sort((a, b) => {
      const dateA = new Date(a.publishedAtUtc || a.createdAtUtc || 0).getTime();
      const dateB = new Date(b.publishedAtUtc || b.createdAtUtc || 0).getTime();
      return dateB - dateA;
    });
  }, [workplaceItems, platformItems]);

  if (!isOpen) return null;

  const currentItems =
    activeTab === 'workplace'
      ? workplaceItems
      : activeTab === 'platform'
        ? platformItems
        : allItems;

  const isLoading = isWorkplaceLoading || isPlatformLoading;
  const isError =
    activeTab === 'workplace'
      ? isWorkplaceError
      : activeTab === 'platform'
        ? isPlatformError
        : isWorkplaceError && isPlatformError;
  const activeError = workplaceError || platformError;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-primary-text">
                Announcements
              </h2>
              <p className="text-xs text-slate-400">
                {currentItems.length} {currentItems.length === 1 ? 'announcement' : 'announcements'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Filter Tabs */}
        <div className="flex items-center gap-2 py-3 border-b border-slate-100 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none ${
              activeTab === 'all'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            All ({allItems.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('workplace')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none ${
              activeTab === 'workplace'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            Workplace ({workplaceItems.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('platform')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none ${
              activeTab === 'platform'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            Platform ({platformItems.length})
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 divide-y divide-slate-100 pr-1">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-2 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs">Loading announcements...</span>
            </div>
          ) : isError && currentItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-rejected">
              {activeError?.message || 'Failed to load announcements.'}
            </div>
          ) : currentItems.length > 0 ? (
            currentItems.map((item) => {
              const isPlatform = item.scope === 1 || item._source === 'platform';
              const formattedDate = item.publishedAtUtc || item.createdAtUtc
                ? new Date(item.publishedAtUtc || item.createdAtUtc).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : null;

              return (
                <div key={item.id} className="pt-4 first:pt-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isPlatform
                              ? 'bg-blue-50 text-primary border border-primary/20'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {isPlatform ? 'Platform' : 'Workplace'}
                        </span>
                        <h3 className="font-semibold text-primary-text text-sm sm:text-base">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    {formattedDate && (
                      <span className="text-[11px] text-slate-400 whitespace-nowrap shrink-0 mt-0.5">
                        {formattedDate}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                    {item.description || item.content}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-400 text-sm">
              {activeTab === 'workplace'
                ? 'No workplace announcements published yet.'
                : activeTab === 'platform'
                  ? 'No platform announcements published yet.'
                  : 'No announcements published yet.'}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-end shrink-0">
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            className="w-auto px-6 py-2 text-xs sm:text-sm cursor-pointer"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
