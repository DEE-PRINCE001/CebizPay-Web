import React, { useState } from 'react';
import { X } from 'lucide-react';
import Input from '../forms/Input.jsx';
import Button from '../common/Button.jsx';
import FormError from '../forms/FormError.jsx';
import { adminService } from '../../api/services/admin.service.js';

export default function AddAdminModal({
  isOpen,
  onClose,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await adminService.manage.inviteAdmin({
        email: formData.email.trim(),
        role: 2, // AdminRoleType enum: 1=SuperAdmin, 2=Admin, 3=Auditor
      });

      setFormData({ name: '', email: '', description: '' });
      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error('Failed to invite admin:', err);
      setErrorMessage(
        err?.message || 'Failed to send invite. Please verify the email and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white w-full max-w-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer disabled:opacity-40"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <h2 className="text-xl font-bold text-primary-text mb-6">
          Add New Admin
        </h2>

        {errorMessage && (
          <div className="mb-4">
            <FormError message={errorMessage} />
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 sm:space-y-5">
          <Input
            label="Name"
            name="name"
            placeholder=""
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            disabled={isSubmitting}
            required
          />

          <Input
            label="Email"
            type="email"
            name="email"
            placeholder=""
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            disabled={isSubmitting}
            required
          />

          <Input
            label="Description"
            name="description"
            multiline
            rows={3}
            placeholder=""
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            disabled={isSubmitting}
          />

          {/* Action Button: Sent Invites */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              disabled={isSubmitting}
              className="w-auto px-7 py-2.5 rounded-xl text-sm font-medium"
            >
              Sent Invites
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
