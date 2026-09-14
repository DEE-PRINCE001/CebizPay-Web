import React, { useState } from 'react';
import { X } from 'lucide-react';
import Input from '../forms/Input.jsx';
import Button from '../common/Button.jsx';
import FormError from '../forms/FormError.jsx';
import { userService } from '../../api/services/user.service.js';

export default function PublishAnnouncementModal({
  isOpen,
  onClose,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    title: '',
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

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await userService.createAnnouncement({
        title: formData.title.trim(),
        description: formData.description.trim(),
        scope: 1, // Platform scope
        publishImmediately: true,
      });

      setFormData({ title: '', description: '' });
      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error('Failed to publish announcement:', err);
      setErrorMessage(
        err?.message || 'Failed to publish announcement. Please try again.'
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
          Annoucements
        </h2>

        {errorMessage && (
          <div className="mb-4">
            <FormError message={errorMessage} />
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 sm:space-y-5">
          <Input
            label="Title"
            name="title"
            placeholder=""
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
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
            required
          />

          {/* Action Button: Publish */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              disabled={isSubmitting}
              className="w-auto px-8 py-2.5 rounded-xl text-sm font-medium"
            >
              Publish
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
