import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import AuthLayout from '../../components/layout/AuthLayout.jsx';
import Input from '../../components/forms/Input.jsx';
import Button from '../../components/common/Button.jsx';
import FormError from '../../components/forms/FormError.jsx';

export default function RegisterIndividual() {
  const { registerPhone, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: '',
    code: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const deviceId = useMemo(() => {
    let id = localStorage.getItem('cebizpay_device_id');
    if (!id) {
      id = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `dev-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('cebizpay_device_id', id);
    }
    return id;
  }, []);

  const sendOtpMutation = useMutation({
    mutationFn: (payload) => registerPhone(payload),
    onSuccess: () => {
      setFieldErrors({});
      setGeneralError('');
      setStep(2);
    },
    onError: (err) => {
      setGeneralError(err.message || 'Failed to send OTP. Please check your phone number and try again.');
      if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
        setFieldErrors(err.fieldErrors);
      } else if (err.errors && typeof err.errors === 'object' && !Array.isArray(err.errors)) {
        setFieldErrors(err.errors);
      }
    },
  });

  const completeRegistrationMutation = useMutation({
    mutationFn: (payload) => verifyOtp(payload),
    onSuccess: () => {
      navigate('/individual/kyc', { replace: true });
    },
    onError: (err) => {
      setGeneralError(err.message || 'Registration failed. Please verify your OTP code and credentials.');
      if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
        setFieldErrors(err.fieldErrors);
      } else if (err.errors && typeof err.errors === 'object' && !Array.isArray(err.errors)) {
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

  const handleSendOtp = (e) => {
    e.preventDefault();
    setGeneralError('');
    setFieldErrors({});

    const phone = formData.phone.trim();
    if (!phone) {
      setFieldErrors({ phone: 'Phone number is required.' });
      return;
    }

    sendOtpMutation.mutate({ phone, deviceId });
  };

  const handleCompleteRegistration = (e) => {
    e.preventDefault();
    setGeneralError('');
    setFieldErrors({});

    const errors = {};
    if (!formData.code.trim()) errors.code = 'Verification OTP code is required.';
    if (!formData.firstName.trim()) errors.firstName = 'First name is required.';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required.';
    if (!formData.email.trim()) errors.email = 'Email address is required.';
    if (!formData.password) errors.password = 'Password is required.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    completeRegistrationMutation.mutate({
      phone: formData.phone.trim(),
      code: formData.code.trim(),
      email: formData.email.trim(),
      password: formData.password,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
    });
  };

  return (
    <AuthLayout
      heroTitle={'Get Started! \n Finance Your Dreams, \n Effortlessly!'}
      reverse={true}
      dividerTop="top-45"
      womanClass="h-85 absolute bottom-0 right-0"
    >
      <div className="flex flex-col space-y-8 sm:space-y-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-text mb-2">
            {step === 1 ? 'Create Your Account' : 'Verify & Set Up Profile'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {step === 1
              ? 'Enter your mobile phone number to receive a one-time verification code.'
              : `We sent a verification code to ${formData.phone}. Complete your details below.`}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-5">
              {generalError && <FormError message={generalError} />}

              <Input
                label="Mobile Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={fieldErrors.phone || fieldErrors.Phone}
                placeholder="e.g. +2348012345678"
                required
              />
            </div>

            <div className="flex flex-col items-center space-y-5">
              <Button
                type="submit"
                loading={sendOtpMutation.isPending}
                disabled={sendOtpMutation.isPending}
                className="shadow-lg shadow-primary-text/30"
                size="lg"
              >
                Continue
              </Button>

              <p className="text-xs sm:text-sm text-slate-600 text-center">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-bold hover:underline">
                  Login Now
                </Link>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCompleteRegistration} className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-4">
              {generalError && <FormError message={generalError} />}

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  Change Phone Number
                </button>

                <button
                  type="button"
                  disabled={sendOtpMutation.isPending}
                  onClick={() => sendOtpMutation.mutate({ phone: formData.phone.trim(), deviceId })}
                  className="text-xs text-slate-500 hover:text-primary font-medium underline cursor-pointer disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </div>

              <Input
                label="OTP Verification Code"
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                error={fieldErrors.code || fieldErrors.Code}
                placeholder="Enter 6-digit OTP code"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={fieldErrors.firstName || fieldErrors.FirstName}
                  placeholder="John"
                  required
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={fieldErrors.lastName || fieldErrors.LastName}
                  placeholder="Doe"
                  required
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={fieldErrors.email || fieldErrors.Email}
                placeholder="name@example.com"
                required
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={fieldErrors.password || fieldErrors.Password}
                placeholder="Create a strong password"
                required
              />
            </div>

            <div className="flex flex-col items-center space-y-5">
              <Button
                type="submit"
                loading={completeRegistrationMutation.isPending}
                disabled={completeRegistrationMutation.isPending}
                className="shadow-lg shadow-primary-text/30"
                size="lg"
              >
                Complete Registration
              </Button>

              <p className="text-xs sm:text-sm text-slate-600 text-center">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-bold hover:underline">
                  Login Now
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
