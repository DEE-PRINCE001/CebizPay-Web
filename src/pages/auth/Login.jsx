import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth.js';
import logo from '../../assets/logo.jpg';
import Input from '../../components/forms/Input.jsx';
import Button from '../../components/common/Button.jsx';
import FormError from '../../components/forms/FormError.jsx';
import backgroundImage from '../../assets/login-background.svg';
import woman from '../../assets/woman.svg';

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

  // TanStack Query Mutation for Login
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
      if (err.errors) {
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
    <div className="font-satoshi flex items-center justify-center min-h-screen w-full bg-background">
      {/* Left Form Section (Responsive for Mobile, Tablet & Desktop) */}
      <div className="w-full lg:w-[50%] p-6 sm:p-10 lg:p-15 lg:px-20 flex flex-col min-h-screen lg:h-screen justify-center lg:justify-start space-y-10 sm:space-y-14 lg:space-y-18 max-w-md sm:max-w-lg lg:max-w-none mx-auto">
        <div className="aspect-square rounded-full w-12 sm:w-15 overflow-hidden shrink-0">
          <img src={logo} alt="Logo" className="w-full h-full object-cover" />
        </div>

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
              
              required
              
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={fieldErrors.password || fieldErrors.Password}
              
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
                <Link to="/register" className="text-primary font-bold hover:underline">
                  Register Now
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>

      {/* Right Hero Section (Hidden on Mobile/Tablet, Displayed on Large Screens) */}
      <div
        className="hidden lg:flex lg:w-[50%] h-screen bg-cover bg-center items-center justify-center p-15"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="w-full h-full ml-5 shadow-[inset_0_0_30px_rgb(255_255_255/50%)] border border-white rounded-lg backdrop-blur-xl relative overflow-hidden">
          <p className="text-white text-3xl xl:text-4xl font-extrabold absolute top-7 left-7 leading-10 xl:leading-11">
            Smart Way To Build <br /> Your Finance
          </p>
          <div className="absolute top-40 left-7 h-20 w-px bg-white/70"></div>
          <img src={woman} alt="Hero" className="absolute bottom-0 -right-20 select-none pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default Login;