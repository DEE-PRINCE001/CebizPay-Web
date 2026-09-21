import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BaseModal from '../BaseModal.jsx';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { organizationService } from '../../../api/services/organization.service.js';

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
    isError,
    error,
    refetch,
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

  // Compute final departments list from live data
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
    }
    return source.filter((d) => !localRemovedIds.has(d.id));
  }, [initialDepartments, deptData, localRemovedIds]);

  const handleRemove = async (dept) => {
    setLocalRemovedIds((prev) => new Set(prev).add(dept.id));
    onRemoveDepartment?.(dept.id);

    if (dept.id) {
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

        {isError && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center justify-between border border-red-200">
            <div className="flex items-center space-x-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error?.message || 'Failed to load departments'}</span>
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

            {!isError && departments.length === 0 && (
              <div className="py-10 text-center flex flex-col items-center justify-center space-y-1.5">
                <p className="text-xs sm:text-sm font-semibold text-slate-700">
                  No departments found
                </p>
                <p className="text-xs text-slate-400 max-w-[280px]">
                  Create your first department using the department creation menu.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </BaseModal>
  );
}
