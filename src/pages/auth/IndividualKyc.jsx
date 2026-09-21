import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { CheckCircle2, ShieldCheck, Landmark, Copy, Check, ArrowRight } from 'lucide-react';
import Dojah from 'react-dojah-sdk-react-18';
import { useAuth } from '../../hooks/useAuth.js';
import { complianceService } from '../../api/services/compliance.service.js';
import AuthLayout from '../../components/layout/AuthLayout.jsx';
import Button from '../../components/common/Button.jsx';
import FormError from '../../components/forms/FormError.jsx';

export default function IndividualKyc() {
  const { user, refetchUser, logout } = useAuth();
  const navigate = useNavigate();

  const [widgetConfig, setWidgetConfig] = useState(null);
  const [isDojahOpen, setIsDojahOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    data: virtualAccount,
    isLoading: isCheckingAccount,
    refetch: refetchVirtualAccount,
  } = useQuery({
    queryKey: ['primary-virtual-account-ngn'],
    queryFn: () => complianceService.getPrimaryVirtualAccount({ currency: 'NGN' }),
    retry: false,
    staleTime: 60 * 1000,
  });

  const isAlreadyVerified = Boolean(
    virtualAccount?.accountNumber ||
    user?.kycStatus === 'Verified' ||
    user?.kycStatus === 2
  );

  const fetchConfigMutation = useMutation({
    mutationFn: () => complianceService.getKycWidgetConfig(),
    onSuccess: (data) => {
      setWidgetConfig(data);
      setIsDojahOpen(true);
      setErrorMsg('');
    },
    onError: (err) => {
      setErrorMsg(err.message || 'Failed to initialize verification. Please try again.');
    },
  });

  const handleStartVerification = () => {
    setErrorMsg('');
    fetchConfigMutation.mutate();
  };

  const handleDojahResponse = useCallback(
    async (type, data) => {
      if (type === 'success') {
        setIsDojahOpen(false);
        await refetchUser?.();
        await refetchVirtualAccount();
      } else if (type === 'error') {
        setIsDojahOpen(false);
        setErrorMsg('Verification was not completed. Please try again.');
        
      } else if (type === 'close') {
        setIsDojahOpen(false);
      }
    },
    [refetchUser, refetchVirtualAccount]
  );

  const handleCopyAccount = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayName =
    user?.firstName || user?.name?.split(' ')[0] || 'User';

  return (
    <AuthLayout
      heroTitle={'Smart Way To Build \n Your Finance'}
      reverse={false}
      dividerTop="top-40"
      womanClass="absolute bottom-0 -right-20"
    >
      <div className="flex flex-col space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
            <ShieldCheck size={14} />
            <span>Identity & Compliance Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-text mb-2">
            Welcome, {displayName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {isAlreadyVerified
              ? 'Your identity is verified and your dedicated account is now active.'
              : 'Complete a quick identity verification with your BVN/NIN and selfie liveness to activate your account.'}
          </p>
        </div>

        {errorMsg && <FormError message={errorMsg} />}

        {isAlreadyVerified && virtualAccount ? (
          <div className="flex flex-col space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-active/10 text-active flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Account Status</p>
                    <p className="text-sm font-bold text-active">Verified & Active</p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-active/10 text-active font-semibold">
                  {virtualAccount.currency || 'NGN'}
                </span>
              </div>

              <div className="border-t border-slate-100 pt-4 flex flex-col space-y-3">
                <div>
                  <p className="text-xs text-slate-400">Account Name</p>
                  <p className="text-base font-bold text-primary-text truncate">
                    {virtualAccount.accountName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'CebizPay Account'}
                  </p>
                </div>

                <div className="flex items-center justify-between bg-background p-3 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-xs text-slate-400">Bank Name</p>
                    <p className="text-sm font-semibold text-primary-text">
                      {virtualAccount.bankName || 'Wema Bank / Monnify'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Account Number</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-extrabold text-primary tracking-wide">
                        {virtualAccount.accountNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyAccount(virtualAccount.accountNumber)}
                        className="text-slate-400 hover:text-primary transition-colors p-1"
                        aria-label="Copy account number"
                      >
                        {copied ? <Check size={14} className="text-active" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4 pt-2">
              <Button
                size="lg"
                variant="primary"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => navigate('/register/business')}
                className="shadow-lg shadow-primary-text/30"
              >
                Register Your Business (KYB)
              </Button>

              <button
                type="button"
                onClick={async () => {
                  await logout();
                  navigate('/login');
                }}
                className="text-xs text-slate-500 hover:text-slate-700 underline font-medium cursor-pointer"
              >
                Sign out of account
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Landmark size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-primary-text">Automated NUBAN Provisioning</h3>
                  <p className="text-xs text-slate-500">
                    Verify once to instantly receive a dedicated Monnify NUBAN account.
                  </p>
                </div>
              </div>

              <div className="bg-background rounded-xl p-3 border border-slate-100 flex flex-col space-y-2 text-xs text-slate-600">
                <p className="font-semibold text-primary-text">Requirements:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-500">
                  <li>Valid Bank Verification Number (BVN) or National ID (NIN)</li>
                  <li>Clear selfie camera for liveness check</li>
                  <li>Approximate completion time: 2 minutes</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4 pt-2">
              <Button
                size="lg"
                variant="primary"
                loading={fetchConfigMutation.isPending || isCheckingAccount}
                disabled={fetchConfigMutation.isPending || isCheckingAccount}
                onClick={handleStartVerification}
                className="shadow-lg shadow-primary-text/30"
              >
                Start Verification
              </Button>

              <div className="flex items-center justify-between w-full text-xs text-slate-500 pt-2">
                <Link to="/register/business" className="text-primary font-semibold hover:underline">
                  Skip to Business Registration
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    navigate('/login');
                  }}
                  className="hover:text-slate-700 underline cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {isDojahOpen && widgetConfig && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl p-4 sm:p-6 shadow-2xl relative">
              <Dojah
                response={handleDojahResponse}
                appID={widgetConfig.appId}
                publicKey={widgetConfig.publicKey}
                type={widgetConfig.widgetType || 'custom'}
                config={{
                  debug: false,
                  widget_id: widgetConfig.widgetId || widgetConfig.widget_id || "6aaedfab3a077fd494f0bae5",
                  pages: widgetConfig.enabledPages || ['government-data', 'selfie'],
                  reference_id: widgetConfig.referenceId,
                }}
                userData={{
                  first_name: widgetConfig.userData?.firstName || user?.firstName || '',
                  last_name: widgetConfig.userData?.lastName || user?.lastName || '',
                  email: widgetConfig.userData?.email || user?.email || '',
                }}
                metadata={{
                  reference_id: widgetConfig.referenceId,
                  user_id: user?.userId || user?.id || '',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
