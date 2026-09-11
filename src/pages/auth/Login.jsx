import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth.js';
import AuthLayout from '../../components/layout/AuthLayout.jsx';
import Input from '../../components/forms/Input.jsx';
import Button from '../../components/common/Button.jsx';
import FormError from '../../components/forms/FormError.jsx';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const [formData, setFormData] = useState({
    email: localStorage.getItem('cebizpay_remembered_email') || '',
    password: '',
    rememberMe: Boolean(localStorage.getItem('cebizpay_remembered_email')),
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const loginMutation = useMutation({
    mutationFn: (credentials) => login(credentials),
    onSuccess: () => {
      if (formData.rememberMe) {
        localStorage.setItem('cebizpay_remembered_email', formData.email.trim());
      } else {
        localStorage.removeItem('cebizpay_remembered_email');
      }
      navigate(from, { replace: true });
    },
    onError: (err) => {
      setGeneralError(err.message || 'Invalid email or password. Please try again.');
      if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
        setFieldErrors(err.fieldErrors);
      } else if (err.errors && !Array.isArray(err.errors) && typeof err.errors === 'object') {
        setFieldErrors(err.errors);
      }
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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

    const email = formData.email.trim();
    const password = formData.password;

    if (!email) {
      setFieldErrors((prev) => ({ ...prev, email: 'Email address is required.' }));
      return;
    }

    if (!password) {
      setFieldErrors((prev) => ({ ...prev, password: 'Password is required.' }));
      return;
    }

    loginMutation.mutate({ email, password });
  };

  return (
    <AuthLayout
      heroTitle={'Smart Way To Build \n Your Finance'}
      reverse={false}
      dividerTop="top-40"
      womanClass="absolute bottom-0 -right-20"
    >
      <form onSubmit={handleSubmit} className="flex flex-col space-y-10 sm:space-y-14 lg:space-y-20">
        <div className="flex flex-col space-y-5">
          {generalError && <FormError message={generalError} />}

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={fieldErrors.email || fieldErrors.Email}
            placeholder="Enter your email address"
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={fieldErrors.password || fieldErrors.Password}
            placeholder="Enter your password"
            required
          />

          <div className="flex justify-between items-center text-xs sm:text-sm">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 accent-primary cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-primary-text cursor-pointer select-none">
                Remember Me
              </label>
            </div>
            <Link to="/forgot-password" className="text-primary-text hover:text-primary transition-colors">
              Forgot Password?
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-5">
          <Button
            type="submit"
            loading={loginMutation.isPending}
            disabled={loginMutation.isPending}
            className="shadow-lg shadow-primary-text/30"
            size="lg"
          >
            Login
          </Button>
          <div>
            <p className="text-xs sm:text-sm text-slate-600 text-center">
              Don't have an account?{' '}
              <Link to="/register/business" className="text-primary font-bold hover:underline">
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;