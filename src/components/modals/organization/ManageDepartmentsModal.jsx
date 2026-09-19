import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BaseModal from '../BaseModal.jsx';
import { Loader2 } from 'lucide-react';
import { organizationService } from '../../../api/services/organization.service.js';
import { MOCK_DEPARTMENTS } from '../../../data/mockPayrollData.js';

/**
 * ManageDepartmentsModal matches ManageDepartments.png:
 * Displays all organization departments with "Remove" (red link)
 * and "Edit" (pill button) actions.
 */
export default function ManageDepartmentsModal({
  isOpen,
  onClose,
  departments: initialDepartments,
  onEditDepartment,
  onRemoveDepartment,
}) {
  const queryClient = useQueryClient();
  const [localRemovedIds, setLocalRemovedIds] = useState(new Set());

  // Fetch departments from live backend
  const {
    data: deptData,
    isLoading,
  } = useQuery({
    queryKey: ['org-departments'],
    queryFn: () => organizationService.departments.list({ pageNumber: 1, pageSize: 50 }),
    enabled: isOpen,
    staleTime: 30 * 1000,
  });

  // Delete department mutation
  const deleteMutation = useMutation({
    mutationFn: (deptId) => organizationService.departments.delete(deptId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-departments'] });
    },
  });

  // Compute final departments list with mock fallback
  const departments = useMemo(() => {
    const rawItems = deptData?.items || (Array.isArray(deptData) ? deptData : []);
    let source = [];
    if (initialDepartments && initialDepartments.length > 0) {
      source = initialDepartments;
    } else if (rawItems.length > 0) {
      source = rawItems.map((d) => ({
        id: d.id,
        name: d.name,
        description: d.description,
        roles: d.roles || [],
      }));
    } else {
      source = MOCK_DEPARTMENTS;
    }
    return source.filter((d) => !localRemovedIds.has(d.id));
  }, [initialDepartments, deptData, localRemovedIds]);

  const handleRemove = async (dept) => {
    setLocalRemovedIds((prev) => new Set(prev).add(dept.id));
    onRemoveDepartment?.(dept.id);

    // Call live backend delete if it's a persisted backend record
    const isLiveRecord = typeof dept.id === 'string' && !dept.id.startsWith('dept-');
    if (isLiveRecord) {
      try {
        await deleteMutation.mutateAsync(dept.id);
      } catch (err) {
        console.error('Failed to delete department from backend:', err);
      }
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Departments"
      maxWidth="max-w-[420px]"
    >
      <div className="flex flex-col space-y-3 -mt-1">
        <h4 className="text-xs font-semibold text-primary-text select-none">
          All Departments
        </h4>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-slate-100 max-h-[380px] overflow-y-auto pr-1">
            {departments.map((dept) => {
              const isDeleting =
                deleteMutation.isPending && deleteMutation.variables === dept.id;
              return (
                <div
                  key={dept.id}
                  className="py-3.5 flex items-center justify-between group transition-colors"
                >
                  <span className="text-xs sm:text-sm font-medium text-slate-800">
                    {dept.name}
                  </span>

                  <div className="flex items-center space-x-3 shrink-0">
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => handleRemove(dept)}
                      className="text-xs text-red-500 hover:text-red-700 underline font-medium cursor-pointer transition-colors disabled:opacity-50"
                    >
                      {isDeleting ? 'Removing...' : 'Remove'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onEditDepartment?.(dept);
                      }}
                      className="px-3.5 py-1 bg-blue-100/70 hover:bg-blue-200/80 text-primary text-xs font-semibold rounded-full cursor-pointer transition-colors select-none"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              );
            })}

            {departments.length === 0 && (
              <p className="py-6 text-center text-xs text-slate-400">
                No departments found.
              </p>
            )}
          </div>
        )}
      </div>
    </BaseModal>
  );
}
