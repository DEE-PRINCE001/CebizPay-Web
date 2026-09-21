import React, { useState } from 'react';
import BaseModal from '../BaseModal.jsx';
import ChipInput from '../../forms/ChipInput.jsx';
import Button from '../../common/Button.jsx';

/**
 * CreateDepartmentModal matches CreateDepartments.png:
 * Form with Department name input, "Add Roles" interactive chip cloud,
 * and "Create Department" primary action button.
 * Also supports edit mode if editing an existing department.
 */
export default function CreateDepartmentModal({
  isOpen,
  onClose,
  initialData = null,
  onSubmit,
}) {
  const [departmentName, setDepartmentName] = useState(
    initialData?.name || ''
  );
  const [roles, setRoles] = useState(() => {
    if (!initialData?.roles) return [];
    return initialData.roles.map((r) => (typeof r === 'string' ? r : r.title || r.name || ''));
  });

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!departmentName.trim()) return;
    onSubmit?.({
      id: initialData?.id,
      name: departmentName.trim(),
      description: departmentName.trim(),
      roles: roles.filter(Boolean),
    });
    onClose?.();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Department' : 'Create Departments'}
      maxWidth="max-w-[420px]"
    >
      <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
        {/* Department Name Input */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs sm:text-sm font-semibold text-primary-text select-none">
            Department
          </label>
          <input
            type="text"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            placeholder="e.g. UI/UX Design"
            required
            className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-primary-text placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        {/* Add Roles Chip Input */}
        <ChipInput
          label="Add Roles"
          items={roles}
          onChange={setRoles}
          placeholder="Type role & Enter..."
        />

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-auto px-7 py-3 rounded-xl text-xs sm:text-sm font-semibold shadow-xs"
          >
            {initialData ? 'Update Department' : 'Create Department'}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}
