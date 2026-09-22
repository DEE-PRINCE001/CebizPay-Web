import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  CheckCircle2,
  ShieldCheck,
  Landmark,
  Copy,
  Check,
  ArrowRight,
  Loader2,
  Clock,
  RefreshCw,
  Smartphone,
  X,
} from 'lucide-react';
import Dojah from 'react-dojah-sdk-react-18';
import { useAuth } from '../../hooks/useAuth.js';
import { complianceService } from '../../api/services/compliance.service.js';
import { KycStatus, KycStatusValues } from '../../data/enums.js';
import AuthLayout from '../../components/layout/AuthLayout.jsx';
import Button from '../../components/common/Button.jsx';
import FormError from '../../components/forms/FormError.jsx';

const WEBHOOK_GRACE_PERIOD_MS = 4000;
const SYNC_INTERVAL_MS = 3000;
const MAX_SYNC_ATTEMPTS = 6;
const MODAL_POLL_INTERVAL_MS = 4000;

export default function IndividualKyc() {
  const { user, refetchUser, logout } = useAuth();
  const navigate = useNavigate();

  const [widgetConfig, setWidgetConfig] = useState(null);
  const [activeReferenceId, setActiveReferenceId] = useState(null);
  const [isDojahOpen, setIsDojahOpen] = useState(false);
  const [statusPhase, setStatusPhase] = useState('idle');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const webhookTimerRef = useRef(null);
  const pollTimerRef = useRef(null);
  const dojahBackgroundPollRef = useRef(null);
  const attemptsRef = useRef(0);
  const dojahPollCountRef = useRef(0);

  useEffect(() => {
    return () => {
      if (webhookTimerRef.current) clearTimeout(webhookTimerRef.current);
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
      if (dojahBackgroundPollRef.current) clearInterval(dojahBackgroundPollRef.current);
    };
  }, []);

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
    user?.kycStatus === KycStatus.Verified ||
    user?.kycStatus === KycStatusValues.Verified
  );

  const fetchConfigMutation = useMutation({
    mutationFn: () => complianceService.getKycWidgetConfig(),
    onSuccess: (data) => {
      setWidgetConfig(data);
      if (data?.referenceId) {
        setActiveReferenceId(data.referenceId);
      }
      setIsDojahOpen(true);
      setErrorMsg('');
    },
    onError: (err) => {
      setErrorMsg(err.message || 'Failed to initialize verification. Please try again.');
    },
  });

  const syncMutation = useMutation({
    mutationFn: (refId) => complianceService.syncKycStatus(refId),
  });

  const performSync = useCallback(
    async (refId) => {
      if (!refId) {
        await Promise.allSettled([refetchUser?.(), refetchVirtualAccount()]);
        setStatusPhase('idle');
        return;
      }

      try {
        const res = await syncMutation.mutateAsync(refId);

        if (res?.status === KycStatus.Verified || res?.status === KycStatusValues.Verified) {
          setStatusPhase('idle');
          attemptsRef.current = 0;
          await Promise.allSettled([refetchUser?.(), refetchVirtualAccount()]);
          return;
        }

        if (res?.status === KycStatus.Pending || res?.status === KycStatusValues.Pending) {
          if (attemptsRef.current < MAX_SYNC_ATTEMPTS) {
            attemptsRef.current += 1;
            pollTimerRef.current = setTimeout(() => {
              performSync(refId);
            }, SYNC_INTERVAL_MS);
          } else {
            setStatusPhase('delayed');
          }
          return;
        }

        if (res?.status === KycStatus.Rejected || res?.status === KycStatusValues.Rejected) {
          setStatusPhase('idle');
          setErrorMsg(res?.message || 'Verification was declined. Please try again.');
          return;
        }

        setStatusPhase('delayed');
      } catch (err) {
        if (attemptsRef.current < MAX_SYNC_ATTEMPTS) {
          attemptsRef.current += 1;
          pollTimerRef.current = setTimeout(() => {
            performSync(refId);
          }, SYNC_INTERVAL_MS);
        } else {
          setStatusPhase('delayed');
        }
      }
    },
    [syncMutation, refetchUser, refetchVirtualAccount]
  );

  // Background listener to detect cross-device phone completion while Dojah modal is open
  useEffect(() => {
    if (!isDojahOpen || !activeReferenceId) {
      if (dojahBackgroundPollRef.current) {
        clearInterval(dojahBackgroundPollRef.current);
        dojahBackgroundPollRef.current = null;
      }
      dojahPollCountRef.current = 0;
      return;
    }

    dojahPollCountRef.current = 0;
    dojahBackgroundPollRef.current = setInterval(async () => {
      dojahPollCountRef.current += 1;

      const [userRes, acctRes] = await Promise.allSettled([
        refetchUser?.(),
        refetchVirtualAccount(),
      ]);
      const acct = acctRes.status === 'fulfilled' ? acctRes.value?.data : null;
      const usr = userRes.status === 'fulfilled' ? userRes.value : null;

      if (
        acct?.accountNumber ||
        usr?.kycStatus === KycStatus.Verified ||
        usr?.kycStatus === KycStatusValues.Verified
      ) {
        setIsDojahOpen(false);
        if (dojahBackgroundPollRef.current) {
          clearInterval(dojahBackgroundPollRef.current);
          dojahBackgroundPollRef.current = null;
        }
        return;
      }

      // Query sync endpoint after ~12s of widget open to verify phone progress
      if (dojahPollCountRef.current >= 3 && activeReferenceId) {
        try {
          const syncRes = await complianceService.syncKycStatus(activeReferenceId);
          if (
            syncRes?.status === KycStatus.Verified ||
            syncRes?.status === KycStatusValues.Verified
          ) {
            setIsDojahOpen(false);
            if (dojahBackgroundPollRef.current) {
              clearInterval(dojahBackgroundPollRef.current);
              dojahBackgroundPollRef.current = null;
            }
            await Promise.allSettled([refetchUser?.(), refetchVirtualAccount()]);
          }
        } catch {
          // Continue polling silently
        }
      }
    }, MODAL_POLL_INTERVAL_MS);

    return () => {
      if (dojahBackgroundPollRef.current) {
        clearInterval(dojahBackgroundPollRef.current);
        dojahBackgroundPollRef.current = null;
      }
    };
  }, [isDojahOpen, activeReferenceId, refetchUser, refetchVirtualAccount]);

  const handleStartVerification = () => {
    setErrorMsg('');
    setStatusPhase('idle');
    fetchConfigMutation.mutate();
  };

  const handleMobileCompleted = async () => {
    setIsDojahOpen(false);
    setErrorMsg('');
    setStatusPhase('syncing');
    attemptsRef.current = 0;
    performSync(activeReferenceId);
  };

  const handleCloseDojah = async () => {
    setIsDojahOpen(false);
    setStatusPhase('syncing');
    const [userRes, acctRes] = await Promise.allSettled([
      refetchUser?.(),
      refetchVirtualAccount(),
    ]);
    const acct = acctRes.status === 'fulfilled' ? acctRes.value?.data : null;
    const usr = userRes.status === 'fulfilled' ? userRes.value : null;

    if (
      acct?.accountNumber ||
      usr?.kycStatus === KycStatus.Verified ||
      usr?.kycStatus === KycStatusValues.Verified
    ) {
      setStatusPhase('idle');
      return;
    }

    if (activeReferenceId) {
      try {
        const res = await syncMutation.mutateAsync(activeReferenceId);
        if (
          res?.status === KycStatus.Verified ||
          res?.status === KycStatusValues.Verified
        ) {
          setStatusPhase('idle');
          await Promise.allSettled([refetchUser?.(), refetchVirtualAccount()]);
          return;
        }
      } catch {
        // Fall back to idle
      }
    }
    setStatusPhase('idle');
  };

  const handleDojahResponse = useCallback(
    async (type, data) => {
      const refId =
        data?.reference_id ||
        data?.referenceId ||
        widgetConfig?.referenceId ||
        activeReferenceId;

      if (refId) {
        setActiveReferenceId(refId);
      }

      if (type === 'success') {
        setIsDojahOpen(false);
        setErrorMsg('');
        setStatusPhase('waiting_webhook');
        attemptsRef.current = 0;

        const [userRes, acctRes] = await Promise.allSettled([
          refetchUser?.(),
          refetchVirtualAccount(),
        ]);
        const initialAccount = acctRes.status === 'fulfilled' ? acctRes.value?.data : null;
        const initialUser = userRes.status === 'fulfilled' ? userRes.value : null;

        if (
          initialAccount?.accountNumber ||
          initialUser?.kycStatus === KycStatus.Verified ||
          initialUser?.kycStatus === KycStatusValues.Verified
        ) {
          setStatusPhase('idle');
          return;
        }

        webhookTimerRef.current = setTimeout(async () => {
          const [checkUserRes, checkAcctRes] = await Promise.allSettled([
            refetchUser?.(),
            refetchVirtualAccount(),
          ]);
          const freshAccount =
            checkAcctRes.status === 'fulfilled' ? checkAcctRes.value?.data : null;
          const freshUser =
            checkUserRes.status === 'fulfilled' ? checkUserRes.value : null;

          if (
            freshAccount?.accountNumber ||
            freshUser?.kycStatus === KycStatus.Verified ||
            freshUser?.kycStatus === KycStatusValues.Verified
          ) {
            setStatusPhase('idle');
            return;
          }

          setStatusPhase('syncing');
          performSync(refId);
        }, WEBHOOK_GRACE_PERIOD_MS);
      } else if (type === 'error' || type === 'close') {
        setIsDojahOpen(false);
        // Intercept to verify if completed on phone before treating as failure
        setStatusPhase('syncing');
        try {
          const [userRes, acctRes] = await Promise.allSettled([
            refetchUser?.(),
            refetchVirtualAccount(),
          ]);
          const acct = acctRes.status === 'fulfilled' ? acctRes.value?.data : null;
          const usr = userRes.status === 'fulfilled' ? userRes.value : null;

          if (
            acct?.accountNumber ||
            usr?.kycStatus === KycStatus.Verified ||
            usr?.kycStatus === KycStatusValues.Verified
          ) {
            setStatusPhase('idle');
            return;
          }

          if (refId) {
            const syncRes = await syncMutation.mutateAsync(refId);
            if (
              syncRes?.status === KycStatus.Verified ||
              syncRes?.status === KycStatusValues.Verified
            ) {
              setStatusPhase('idle');
              await Promise.allSettled([refetchUser?.(), refetchVirtualAccount()]);
              return;
            }
          }
        } catch {
          // Handled below
        }

        setStatusPhase('idle');
        if (type === 'error') {
          setErrorMsg('Verification was not completed. Please try again.');
        }
      }
    },
    [widgetConfig, activeReferenceId, refetchUser, refetchVirtualAccount, performSync, syncMutation]
  );

  const handleManualSync = () => {
    setErrorMsg('');
    setStatusPhase('syncing');
    attemptsRef.current = 0;
    performSync(activeReferenceId);
  };

  const handleCopyAccount = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayName =
    user?.firstName || user?.name?.split(' ')[0] || 'User';

  const isProcessing =
    statusPhase === 'waiting_webhook' || statusPhase === 'syncing';

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
              ? 'Your identity is verified and your account is now active.'
              : isProcessing
              ? 'Finalizing your verification and activating your account...'
              : statusPhase === 'delayed'
              ? 'Your verification is being finalized by our Team.'
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
                    {virtualAccount.accountName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim()}
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
        ) : isProcessing ? (
          <div className="flex flex-col space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center animate-spin">
                <Loader2 size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-primary-text">
                  Finalizing Account Setup
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
                  We are confirming your verification and provisioning your dedicated account. This typically takes just a few moments.
                </p>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                Please keep this page open...
              </span>
            </div>
          </div>
        ) : statusPhase === 'delayed' ? (
          <div className="flex flex-col space-y-6">
            <div className="bg-white rounded-2xl border border-amber-200 bg-amber-50/20 p-6 shadow-xs flex flex-col space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Verification In Progress
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Your verification was received and is currently being processed by our banking partner. Your account will be active shortly.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={RefreshCw}
                  loading={syncMutation.isPending}
                  disabled={syncMutation.isPending}
                  onClick={handleManualSync}
                >
                  Refresh Status
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={() => navigate('/register/business')}
                >
                  Continue to Business Registration
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-6">
            <div className="bg-primary rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col space-y-4">
              {/* <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Landmark size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-primary-text">Automated NUBAN Provisioning</h3>
                  <p className="text-xs text-slate-500">
                    Verify once to instantly receive a dedicated Monnify NUBAN account.
                  </p>
                </div>
              </div> */}

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
          <>
            <div className="fixed top-3 sm:top-5 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 w-auto sm:w-full sm:max-w-md z-[999999] bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-xl p-3 sm:p-3.5 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Smartphone size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-primary-text truncate">
                    Verifying on your phone?
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                    Click when finished to continue
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="primary"
                  loading={syncMutation.isPending}
                  disabled={syncMutation.isPending}
                  onClick={handleMobileCompleted}
                  className="text-xs px-3 py-1.5 h-auto whitespace-nowrap shadow-sm"
                >
                  I'm Done
                </Button>
                <button
                  type="button"
                  onClick={handleCloseDojah}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Close verification modal"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

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
          </>
        )}
      </div>
    </AuthLayout>
  );
}
