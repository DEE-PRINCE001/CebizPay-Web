import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Loader2 } from 'lucide-react';
import { userService } from '../../api/services/user.service.js';

function formatAnnouncementDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = date.getDate();
  const suffix = ['th', 'st', 'nd', 'rd'][
    day % 10 > 3 || Math.floor((day % 100) / 10) === 1 ? 0 : day % 10
  ];
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${day}${suffix} ${month}, ${year}`;
}

export default function AnnouncementsModal({
  isOpen,
  onClose,
  onAddAnnouncement,
}) {
  const queryClient = useQueryClient();

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

  // Fetch Workplace Announcements only (matching reference design)
  const {
    data: workplaceData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['workplace-announcements'],
    queryFn: () => userService.getWorkplaceAnnouncements({ pageSize: 50 }),
    enabled: isOpen,
    staleTime: 30 * 1000,
    retry: false,
  });

  // Delete Announcement Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => userService.deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workplace-announcements'] });
    },
    onError: (err) => {
      console.error('Failed to delete announcement:', err);
    },
  });

  if (!isOpen) return null;

  const items = workplaceData?.items || [];

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
        {/* Header matching AnnouncementModal.png */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0A1931] tracking-tight">
            Announcements
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content List matching AnnouncementModal.png card layout */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
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
            items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 space-y-2.5 shadow-xs"
              >
                <h3 className="text-sm sm:text-base font-bold text-[#0A1931]">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed whitespace-pre-line">
                  {item.description || item.content}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs sm:text-sm font-bold text-[#0A1931]">
                    {formatAnnouncementDate(item.publishedAtUtc || item.createdAtUtc)}
                  </span>

                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(item.id)}
                    disabled={deleteMutation.isPending && deleteMutation.variables === item.id}
                    className="px-4 py-1.5 rounded-lg text-xs font-medium text-red-400 bg-red-50 hover:bg-red-100 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {deleteMutation.isPending && deleteMutation.variables === item.id
                      ? 'Deleting...'
                      : 'Delete'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-400 text-sm">
              No announcements published yet.
            </div>
          )}
        </div>

        {/* Modal Bottom matching AnnouncementModal.png: Add Annoucement link */}
        <div className="pt-3 border-t border-slate-100 flex justify-end shrink-0">
          <button
            type="button"
            onClick={() => {
              onClose?.();
              onAddAnnouncement?.();
            }}
            className="text-primary text-xs sm:text-sm font-medium underline hover:text-primary/80 transition-colors cursor-pointer"
          >
            Add Annoucement
          </button>
        </div>
      </div>
    </div>
  );
}
