import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle2, Building2, UserCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { complianceService } from '../../api/services/index.js';
import { uploadToCloudinary } from '../../lib/cloudinary.js';
import AuthLayout from '../../components/layout/AuthLayout.jsx';
import Input from '../../components/forms/Input.jsx';
import FileUpload from '../../components/forms/FileUpload.jsx';
import Button from '../../components/common/Button.jsx';
import FormError from '../../components/forms/FormError.jsx';

export default function RegisterBusiness2() {
  const { activeOrgId, refetchUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const organizationId = location.state?.organizationId || activeOrgId || '';
  const initialCompanyName = location.state?.companyName || '';

  const [formData, setFormData] = useState({
    cacNumber: '',
    cacCertificateFile: null,
    logoFile: null,
  });

  const [cacVerifiedData, setCacVerifiedData] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);

  const lookupCacMutation = useMutation({
    mutationFn: (payload) => complianceService.lookupCac(payload),
    onSuccess: (data) => {
      setCacVerifiedData(data);
      setGeneralError('');
      setFieldErrors((prev) => ({ ...prev, cacNumber: null }));
    },
    onError: (err) => {
      setCacVerifiedData(null);
      setGeneralError(err.message || 'CAC verification failed. Please ensure the CAC number is correct.');
    },
  });

  const step2Mutation = useMutation({
    mutationFn: (payload) => complianceService.registerKybStep2(payload),
    onSuccess: async () => {
      await refetchUser?.();
      navigate('/org/dashboard', { replace: true });
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
    setFormData((prev) => ({ ...prev, [name]: value }));

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

  const handleVerifyCac = () => {
    const cac = formData.cacNumber.trim();
    if (!cac) {
      setFieldErrors((prev) => ({ ...prev, cacNumber: 'CAC registration number is required.' }));
      return;
    }

    lookupCacMutation.mutate({
      organizationId,
      cacNumber: cac,
      companyName: initialCompanyName,
    });
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
      setGeneralError(uploadErr.message || 'Failed to upload documents. Please check your connection.');
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
      <form onSubmit={handleSubmit} className="flex flex-col space-y-8 sm:space-y-12">
        <div className="flex flex-col space-y-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary-text mb-1">
              Business Verification (KYB)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Verify your CAC registry records and upload compliance documents.
            </p>
          </div>

          {generalError && <FormError message={generalError} />}

          <div className="flex flex-col space-y-2">
            <div className="flex gap-2 items-end">
            
                <Input
                  label="CAC Registration Number"
                  name="cacNumber"
                  value={formData.cacNumber}
                  onChange={handleChange}
                  error={fieldErrors.cacNumber || fieldErrors.CacNumber}
                  placeholder="e.g. RC123456"
                  required
                />
              <div className="flex-1">
              <Button
                type="button"
                variant="outline"
                size="md"
                loading={lookupCacMutation.isPending}
                disabled={lookupCacMutation.isPending || !formData.cacNumber.trim()}
                onClick={handleVerifyCac}
                className="w-auto px-5 py-3 h-[46px] rounded-xl shrink-0"
                >
                Verify CAC
              </Button>
                </div>
            </div>
          </div>

          {cacVerifiedData && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-active/10 text-active flex items-center justify-center shrink-0">
                    <Building2 size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary-text">
                      {cacVerifiedData.companyName}
                    </p>
                    <p className="text-xs text-slate-400">
                      {cacVerifiedData.cacNumber} • {cacVerifiedData.companyType?.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-active/10 text-active font-semibold">
                  {cacVerifiedData.status || 'ACTIVE'}
                </span>
              </div>

              {cacVerifiedData.address && (
                <p className="text-xs text-slate-500 border-t border-slate-100 pt-2">
                  <span className="font-semibold text-slate-700">Registered Address:</span> {cacVerifiedData.address}
                </p>
              )}

              {cacVerifiedData.directors && cacVerifiedData.directors.length > 0 && (
                <div className="border-t border-slate-100 pt-2">
                  <p className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                    <UserCheck size={13} className="text-primary" />
                    Registered Directors:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {cacVerifiedData.directors.map((d, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 rounded-md bg-background text-slate-700 border border-slate-200"
                      >
                        {d.name} {d.designation ? `(${d.designation})` : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

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
            {isUploadingFiles ? 'Uploading Documents...' : 'Submit Application'}
          </Button>

          <p className="text-xs sm:text-sm text-slate-600 text-center">
            Already registered?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Login Now
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}