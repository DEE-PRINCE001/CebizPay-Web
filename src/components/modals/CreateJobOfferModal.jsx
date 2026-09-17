import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Input from '../forms/Input.jsx';
import FileUpload from '../forms/FileUpload.jsx';
import Button from '../common/Button.jsx';
import FormError from '../forms/FormError.jsx';
import { uploadToCloudinary } from '../../lib/cloudinary.js';

const JOB_TYPE_OPTIONS = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Internship', label: 'Internship' },
];

const WORK_MODE_OPTIONS = [
  { value: 'Remote', label: 'Remote' },
  { value: 'Onsite', label: 'Onsite' },
  { value: 'Hybrid', label: 'Hybrid' },
];

export default function CreateJobOfferModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    jobType: 'Full-time',
    workMode: 'Hybrid',
    experience: '',
    requirements: '',
    description: '',
    bannerFile: null,
    closingPeriod: '',
    processType: 'email', // 'email' | 'form'
    applicationEmail: '',
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        location: '',
        jobType: 'Full-time',
        workMode: 'Hybrid',
        experience: '',
        requirements: '',
        description: '',
        bannerFile: null,
        closingPeriod: '',
        processType: 'email',
        applicationEmail: '',
      });
      setErrors({});
      setGeneralError('');
      setIsUploadingBanner(false);
    }
  }, [isOpen]);

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

    if (!formData.title.trim()) newErrors.title = 'Job title is required.';
    if (!formData.location.trim()) newErrors.location = 'Job location is required.';
    if (!formData.experience.trim()) newErrors.experience = 'Experience requirement is required.';
    if (!formData.requirements.trim()) newErrors.requirements = 'Job requirements are required.';
    if (!formData.description.trim()) newErrors.description = 'Job description is required.';
    if (!formData.closingPeriod.trim()) newErrors.closingPeriod = 'Closing period is required.';

    if (formData.processType === 'email' && !formData.applicationEmail.trim()) {
      newErrors.applicationEmail = 'Application email address is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      let bannerUrl = '';
      if (formData.bannerFile) {
        setIsUploadingBanner(true);
        const uploaded = await uploadToCloudinary(formData.bannerFile, { folder: 'recruitment/banners' });
        bannerUrl = uploaded?.url || '';
        setIsUploadingBanner(false);
      }

      onSubmit?.({
        ...formData,
        bannerUrl,
      });
    } catch (uploadErr) {
      setIsUploadingBanner(false);
      setGeneralError(uploadErr?.message || 'Failed to upload job banner. Please try again.');
    }
  };

  const isSubmitting = isLoading || isUploadingBanner;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pinned Header */}
        <div className="flex items-center justify-between px-6 sm:px-9 py-5 border-b border-slate-100 shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-text tracking-tight">
            Job Offer
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

        {/* Form wrapping scrollable content and pinned footer */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-9 py-5 sm:py-6 space-y-4 sm:space-y-5">
            {generalError && (
              <div className="mb-2">
                <FormError message={generalError} />
              </div>
            )}
          {/* Row 1: Job Title & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Job Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="e.g. Senior Frontend Engineer"
              disabled={isSubmitting}
              required
            />
            <Input
              label="Job Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
              placeholder="e.g. Lagos, Nigeria"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Row 2: Job Type & Work Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Job Type"
              name="jobType"
              options={JOB_TYPE_OPTIONS}
              value={formData.jobType}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <Input
              label="Work Mode"
              name="workMode"
              options={WORK_MODE_OPTIONS}
              value={formData.workMode}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          {/* Row 3: Experience */}
          <Input
            label="Experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            error={errors.experience}
            placeholder="e.g. 3+ years experience in fintech or web apps"
            disabled={isSubmitting}
            required
          />

          {/* Row 4: Job Requirements */}
          <Input
            label="Job Requirements"
            name="requirements"
            multiline
            rows={3}
            value={formData.requirements}
            onChange={handleChange}
            error={errors.requirements}
            placeholder="Outline qualifications, skills, and candidate background..."
            disabled={isSubmitting}
            required
          />

          {/* Row 5: Job Descriptions & Upload Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <Input
              label="Job Descriptions"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
              placeholder="Detailed day-to-day responsibilities..."
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
          </div>

          {/* Row 6: Closing Period */}
          <Input
            label="Closing Period"
            name="closingPeriod"
            value={formData.closingPeriod}
            onChange={handleChange}
            error={errors.closingPeriod}
            placeholder="e.g. 30 October, 2026"
            disabled={isSubmitting}
            required
          />

          {/* Row 7: Application Process */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
              Application Process
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Send to mail */}
              <div
                onClick={() => setFormData((prev) => ({ ...prev, processType: 'email' }))}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  formData.processType === 'email'
                    ? 'border-primary/60 bg-blue-50/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex-1 mr-3">
                  <span className="text-xs sm:text-sm font-semibold text-primary-text block">
                    Send to mail
                  </span>
                  <input
                    type="email"
                    name="applicationEmail"
                    value={formData.applicationEmail}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    onClick={(e) => e.stopPropagation()}
                    disabled={formData.processType !== 'email' || isSubmitting}
                    className="w-full mt-1.5 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-primary text-slate-800 disabled:opacity-50"
                  />
                  {errors.applicationEmail && (
                    <span className="text-[11px] text-red-500 font-medium mt-0.5 block">
                      {errors.applicationEmail}
                    </span>
                  )}
                </div>
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                    formData.processType === 'email'
                      ? 'border-2 border-primary'
                      : 'border border-slate-300'
                  }`}
                >
                  {formData.processType === 'email' && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
              </div>

              {/* Option 2: Application Form */}
              <div
                onClick={() => setFormData((prev) => ({ ...prev, processType: 'form' }))}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  formData.processType === 'form'
                    ? 'border-primary/60 bg-blue-50/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm font-semibold text-primary-text">
                    Application Form
                  </span>
                  <span className="text-xs text-primary underline font-medium">
                    Create form
                  </span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                    formData.processType === 'form'
                      ? 'border-2 border-primary'
                      : 'border border-slate-300'
                  }`}
                >
                  {formData.processType === 'form' && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
              </div>
            </div>
          </div>

          </div>

          {/* Pinned Action Footer */}
          <div className="px-6 sm:px-9 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-medium"
            >
              Cancel
            </Button>
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
