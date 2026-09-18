import React, { useState } from 'react';
import BaseModal from '../BaseModal.jsx';
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
  const [departments, setDepartments] = useState(() =>
    initialDepartments && initialDepartments.length > 0
      ? initialDepartments
      : MOCK_DEPARTMENTS
  );

  const handleRemove = (deptId) => {
    setDepartments((prev) => prev.filter((d) => d.id !== deptId));
    onRemoveDepartment?.(deptId);
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

        <div className="flex flex-col divide-y divide-slate-100 max-h-[380px] overflow-y-auto pr-1">
          {departments.map((dept) => (
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
                  onClick={() => handleRemove(dept.id)}
                  className="text-xs text-red-500 hover:text-red-700 underline font-medium cursor-pointer transition-colors"
                >
                  Remove
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
          ))}

          {departments.length === 0 && (
            <p className="py-6 text-center text-xs text-slate-400">
              No departments found.
            </p>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
