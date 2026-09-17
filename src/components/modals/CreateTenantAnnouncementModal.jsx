import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Input from '../forms/Input.jsx';
import FileUpload from '../forms/FileUpload.jsx';
import Button from '../common/Button.jsx';
import FormError from '../forms/FormError.jsx';
import { uploadToCloudinary } from '../../lib/cloudinary.js';

export default function CreateTenantAnnouncementModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    bannerFile: null,
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        bannerFile: null,
      });
      setErrors({});
      setGeneralError('');
      setIsUploadingBanner(false);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (generalError) setGeneralError('');
  };

  const handleBannerChange = (file) => {
    setFormData((prev) => ({ ...prev, bannerFile: file }));
    if (errors.bannerFile) setErrors((prev) => ({ ...prev, bannerFile: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title of announcement is required.';
    if (!formData.description.trim()) newErrors.description = 'Description is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      let bannerUrl = '';
      if (formData.bannerFile) {
        setIsUploadingBanner(true);
        const uploaded = await uploadToCloudinary(formData.bannerFile, { folder: 'announcements/banners' });
        bannerUrl = uploaded?.url || '';
        setIsUploadingBanner(false);
      }

      onSubmit?.({
        title: formData.title.trim(),
        description: formData.description.trim(),
        bannerUrl,
      });
    } catch (uploadErr) {
      setIsUploadingBanner(false);
      setGeneralError(uploadErr?.message || 'Failed to upload banner image. Please try again.');
    }
  };

  const isSubmitting = isLoading || isUploadingBanner;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl p-6 sm:p-9 shadow-2xl border border-slate-100 relative my-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-text tracking-tight">
            Create Announcment
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {generalError && (
          <div className="mb-4">
            <FormError message={generalError} />
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 sm:space-y-5">
          <Input
            label="Title of Annoucement"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="Enter announcement headline"
            disabled={isSubmitting}
            required
          />

          <Input
            label="Description"
            name="description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            placeholder="Provide full announcement details..."
            disabled={isSubmitting}
            required
          />

          <FileUpload
            label="Upload Banner"
            name="banner"
            variant="banner"
            accept="image/jpeg, image/png"
            helperText="(JPEG and PNG)"
            onChange={handleBannerChange}
            disabled={isSubmitting}
          />

          {/* Action Button */}
          <div className="pt-3">
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              disabled={isSubmitting}
              className="w-auto px-8 py-2.5 rounded-xl text-xs sm:text-sm font-medium"
            >
              {isUploadingBanner ? 'Uploading...' : 'Publish'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
