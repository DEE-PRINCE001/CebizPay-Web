import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BaseModal from '../BaseModal.jsx';
import { ChevronDown, ChevronUp, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { organizationService } from '../../../api/services/organization.service.js';

/**
 * ManageLevelsModal matches ManageLevels.png:
 * Header with "All Levels" and "Create Level" action button,
 * and collapsible/accordion items for each salary level.
 */
export default function ManageLevelsModal({
  isOpen,
  onClose,
  levels: initialLevels,
  onCreateLevel,
  onEditLevel,
  onRemoveLevel,
}) {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState(null);
  const [localRemovedIds, setLocalRemovedIds] = useState(new Set());

  // Fetch salary levels from live backend
  const {
    data: levelsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['org-salary-levels'],
    queryFn: () => organizationService.levels.list({ currency: 'NGN', pageNumber: 1, pageSize: 50 }),
    enabled: isOpen,
    staleTime: 30 * 1000,
  });

  // Delete level mutation
  const deleteMutation = useMutation({
    mutationFn: (levelId) => organizationService.levels.delete(levelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-salary-levels'] });
    },
  });

  // Compute final levels list from live data
  const levels = useMemo(() => {
    const rawItems = levelsData?.items || (Array.isArray(levelsData) ? levelsData : []);
    let source = [];
    if (initialLevels && initialLevels.length > 0) {
      source = initialLevels;
    } else if (rawItems.length > 0) {
      source = rawItems.map((lvl) => ({
        id: lvl.id,
        name: lvl.levelName || lvl.name,
        amount:
          lvl.baseAmount != null
            ? `${lvl.currency || 'NGN'} ${Number(lvl.baseAmount).toLocaleString()}`
            : lvl.amount,
        activeStaffCount: lvl.activeStaffCount ?? 0,
        members:
          lvl.members ||
          (lvl.activeStaffCount != null ? [`${lvl.activeStaffCount} active staff`] : []),
      }));
    }
    return source.filter((lvl) => !localRemovedIds.has(lvl.id));
  }, [initialLevels, levelsData, localRemovedIds]);

  const toggleExpand = (levelId) => {
    setExpandedId((prev) => (prev === levelId ? null : levelId));
  };

  const handleRemove = async (lvl) => {
    setLocalRemovedIds((prev) => new Set(prev).add(lvl.id));
    onRemoveLevel?.(lvl.id);

    if (lvl.id) {
      try {
        await deleteMutation.mutateAsync(lvl.id);
      } catch (err) {
        console.error('Failed to delete salary level from backend:', err);
      }
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="All Levels"
      maxWidth="max-w-[440px]"
    >
      <div className="flex flex-col space-y-4 -mt-1">
        {/* Top-Right "Create Level" Button */}
        <div className="flex justify-end -mt-8 mb-2">
          <button
            type="button"
            onClick={() => {
              onCreateLevel?.();
            }}
            className="px-5 py-2 bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer select-none"
          >
            Create Level
          </button>
        </div>

        {/* Error Banner */}
        {isError && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center justify-between border border-red-200">
            <div className="flex items-center space-x-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error?.message || 'Failed to load salary levels'}</span>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="font-semibold underline hover:text-red-900 inline-flex items-center space-x-0.5 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry
            </button>
          </div>
        )}

        {/* Levels List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex flex-col space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {levels.map((lvl) => {
              const isExpanded = expandedId === lvl.id;
              const isDeleting =
                deleteMutation.isPending && deleteMutation.variables === lvl.id;

              return (
                <div
                  key={lvl.id}
                  className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-all shadow-2xs"
                >
                  <div
                    onClick={() => toggleExpand(lvl.id)}
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 select-none transition-colors"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        toggleExpand(lvl.id);
                      }
                    }}
                  >
                    <span className="text-xs sm:text-sm font-medium text-slate-800">
                      {lvl.name}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-100 flex flex-col space-y-3 bg-slate-50/50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Base Salary:</span>
                        <span className="text-xs font-bold text-primary-text">
                          {lvl.amount || 'NGN 0.00'}
                        </span>
                      </div>

                      {lvl.members && lvl.members.length > 0 && (
                        <div className="flex flex-col space-y-1.5">
                          <span className="text-[11px] text-slate-500">Assigned Members:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {lvl.members.map((member, idx) => (
                              <span
                                key={`${member}-${idx}`}
                                className="px-2.5 py-1 rounded-md bg-[#EEF2F6] text-primary-text text-[11px] font-medium"
                              >
                                {member}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(lvl);
                          }}
                          className="text-xs text-red-500 hover:text-red-700 underline font-medium cursor-pointer disabled:opacity-50"
                        >
                          {isDeleting ? 'Removing...' : 'Remove'}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditLevel?.(lvl);
                          }}
                          className="text-xs text-primary hover:underline font-semibold cursor-pointer"
                        >
                          Edit Level
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {!isError && levels.length === 0 && (
              <div className="py-10 text-center flex flex-col items-center justify-center space-y-1.5">
                <p className="text-xs sm:text-sm font-semibold text-slate-700">
                  No salary levels configured
                </p>
                <p className="text-xs text-slate-400 max-w-[280px]">
                  Establish salary grades for your organization using the create level button above.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </BaseModal>
  );
}
