import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth.js';
import { complianceService } from '../../api/services/index.js';
import AuthLayout from '../../components/layout/AuthLayout.jsx';
import Input from '../../components/forms/Input.jsx';
import Button from '../../components/common/Button.jsx';
import FormError from '../../components/forms/FormError.jsx';

const RegisterBusiness1 = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const step1Mutation = useMutation({
    mutationFn: (payload) => complianceService.registerKybStep1(payload),
    onSuccess: (data) => {
      navigate('/register/business/step-2', {
        state: {
          organizationId: data?.organizationId || data?.id || '',
          companyName: formData.companyName,
          email: formData.email,
          phone: formData.phone,
        },
      });
    },
    onError: (err) => {
      setGeneralError(err.message || 'Registration step 1 failed. Please review your details.');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setGeneralError('');
    setFieldErrors({});

    const companyName = formData.companyName.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();

    const errors = {};
    if (!companyName) errors.companyName = 'Company name is required.';
    if (!email) errors.email = 'Company email address is required.';
    if (!phone) errors.phone = 'Contact phone number is required.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    step1Mutation.mutate({
      companyName,
      email,
      phone,
      ownerUserId: user?.userId || user?.id || '',
    });
  };

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
            label="Company Name"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            error={fieldErrors.companyName || fieldErrors.CompanyName}
            placeholder="Enter your registered company name"
            required
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={fieldErrors.email || fieldErrors.Email}
            placeholder="Enter official company email"
            required
          />

          <Input
            label="Contact Number"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={fieldErrors.phone || fieldErrors.Phone}
            placeholder="Enter company phone number"
            required
          />
        </div>

        <div className="flex flex-col items-center space-y-5">
          <Button
            type="submit"
            loading={step1Mutation.isPending}
            disabled={step1Mutation.isPending}
            className="shadow-lg shadow-primary-text/30"
            size="lg"
          >
            Continue
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

export default RegisterBusiness1;