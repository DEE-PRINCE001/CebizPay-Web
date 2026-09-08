import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth.js';
import { complianceService } from '../../api/services/index.js';
import { uploadToCloudinary } from '../../lib/cloudinary.js';
import AuthLayout from '../../components/layout/AuthLayout.jsx';
import Input from '../../components/forms/Input.jsx';
import FileUpload from '../../components/forms/FileUpload.jsx';
import Button from '../../components/common/Button.jsx';
import FormError from '../../components/forms/FormError.jsx';

const RegisterBusiness2 = () => {
  const { activeOrgId } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const organizationId = location.state?.organizationId || activeOrgId || '';

  const [formData, setFormData] = useState({
    cacNumber: '',
    cacCertificateFile: null,
    logoFile: null,
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);

  const step2Mutation = useMutation({
    mutationFn: (payload) => complianceService.registerKybStep2(payload),
    onSuccess: () => {
      navigate('/dashboard', { replace: true });
    },
    onError: (err) => {
      setGeneralError(err.message || 'Registration step 2 failed. Please verify the submitted documents.');
      if (err.errors) {
        setFieldErrors(err.errors);
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (fieldErrors[name] || fieldErrors[name.charAt(0).toUpperCase() + name.slice(1)]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: null,
        [name.charAt(0).toUpperCase() + name.slice(1)]: null,
      }));
    }
    if (generalError) setGeneralError('');
  };

  const handleCacFileChange = (file) => {
    setFormData((prev) => ({ ...prev, cacCertificateFile: file }));
    if (fieldErrors.cacCertificateUrl || fieldErrors.cacCertificateFile) {
      setFieldErrors((prev) => ({ ...prev, cacCertificateUrl: null, cacCertificateFile: null }));
    }
    if (generalError) setGeneralError('');
  };

  const handleLogoFileChange = (file) => {
    setFormData((prev) => ({ ...prev, logoFile: file }));
    if (fieldErrors.logoUrl || fieldErrors.logoFile) {
      setFieldErrors((prev) => ({ ...prev, logoUrl: null, logoFile: null }));
    }
    if (generalError) setGeneralError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setFieldErrors({});

    const cacNumber = formData.cacNumber.trim();
    const errors = {};

    if (!cacNumber) errors.cacNumber = 'CAC registration number is required.';
    if (!formData.cacCertificateFile) errors.cacCertificateUrl = 'CAC Certificate document is required.';
    if (!formData.logoFile) errors.logoUrl = 'Company logo is required.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setIsUploadingFiles(true);

      // Upload CAC Certificate and Logo to Cloudinary
      const [cacUpload, logoUpload] = await Promise.all([
        uploadToCloudinary(formData.cacCertificateFile, { folder: 'kyb/certificates' }),
        uploadToCloudinary(formData.logoFile, { folder: 'kyb/logos' }),
      ]);

      setIsUploadingFiles(false);

      step2Mutation.mutate({
        organizationId,
        cacNumber,
        cacCertificateUrl: cacUpload.url,
        logoUrl: logoUpload.url,
      });
    } catch (uploadErr) {
      setIsUploadingFiles(false);
      setGeneralError(uploadErr.message || 'Failed to upload documents. Please check your network connection.');
    }
  };

  const isSubmitting = isUploadingFiles || step2Mutation.isPending;

  return (
    <AuthLayout
      heroTitle={'Get Started! \n Finance Your Dreams, \n Effortlessly!'}
      reverse={true}
      dividerTop="top-45"
      womanClass="h-85 absolute bottom-0 right-0"
    >
      <form onSubmit={handleSubmit} className="flex flex-col space-y-10 sm:space-y-14 lg:space-y-20">
        <div className="flex flex-col space-y-5">
          {generalError && <FormError message={generalError} />}

          <Input
            label="CAC Registration Number"
            name="cacNumber"
            value={formData.cacNumber}
            onChange={handleChange}
            error={fieldErrors.cacNumber || fieldErrors.CacNumber}
            placeholder="e.g. RC-1234567"
            required
          />

          <FileUpload
            label="Upload CAC Certificate"
            name="cacCertificate"
            accept="image/jpeg, image/png, application/pdf"
            helperText="(JPEG, PNG, or PDF up to 10MB)"
            error={fieldErrors.cacCertificateUrl || fieldErrors.CacCertificateUrl}
            onChange={handleCacFileChange}
            required
          />

          <FileUpload
            label="Upload Company Logo"
            name="logo"
            accept="image/jpeg, image/png"
            helperText="(JPEG or PNG up to 5MB)"
            error={fieldErrors.logoUrl || fieldErrors.LogoUrl}
            onChange={handleLogoFileChange}
            required
          />
        </div>

        <div className="flex flex-col items-center space-y-5">
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="shadow-lg shadow-primary-text/30"
            size="lg"
          >
            {isUploadingFiles ? 'Uploading Documents...' : 'Get Started'}
          </Button>
          <div>
            <p className="text-xs sm:text-sm text-slate-600 text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Login Now
              </Link>
            </p>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};

export default RegisterBusiness2;