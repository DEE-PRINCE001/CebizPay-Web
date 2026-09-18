import React, { useState } from 'react';
import BaseModal from '../BaseModal.jsx';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { MOCK_LEVELS } from '../../../data/mockPayrollData.js';

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
}) {
  const [levels] = useState(() =>
    initialLevels && initialLevels.length > 0 ? initialLevels : MOCK_LEVELS
  );
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (levelId) => {
    setExpandedId((prev) => (prev === levelId ? null : levelId));
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

        {/* Levels List */}
        <div className="flex flex-col space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
          {levels.map((lvl) => {
            const isExpanded = expandedId === lvl.id;
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
                        {lvl.amount || 'NGN 150,000'}
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

                    <div className="flex justify-end pt-1">
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

          {levels.length === 0 && (
            <p className="py-6 text-center text-xs text-slate-400">
              No salary levels configured.
            </p>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
