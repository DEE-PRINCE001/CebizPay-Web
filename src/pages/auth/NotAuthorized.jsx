import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import Button from '../../components/common/Button.jsx';
import logo from '../../assets/logo.jpg';

export default function NotAuthorized() {
  const navigate = useNavigate();
  const { user, isAdmin, hasOrgContext, activeOrg, logout } = useAuth();

  const getHomeRoute = () => {
    if (isAdmin) return '/dashboard';
    if (hasOrgContext) return '/org/dashboard';
    return '/register/business';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden select-none">
      <div className="absolute w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none -top-16 -right-16" />
      <div className="absolute w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none -bottom-16 -left-16" />

      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 sm:p-10 text-center relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>
        </div>

        <div className="inline-block mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-100 tracking-wide uppercase">
            403 · Access Denied
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-primary-text mb-3">
          Access Restricted
        </h1>

        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          You do not have the required permissions to access this page. If you believe this is an error, please contact your organization administrator or platform support.
        </p>

        {user && (
          <div className="bg-background rounded-2xl p-4 mb-8 text-left border border-slate-200/70">
            <p className="text-xs text-slate-500 font-medium mb-1">Current Signed-in Account</p>
            <p className="text-sm font-bold text-primary-text truncate">
              {user.email}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
                {isAdmin ? 'Platform Admin' : (activeOrg?.role || 'User')}
              </span>
              {activeOrg?.organizationName && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium truncate max-w-[200px]">
                  {activeOrg.organizationName}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
          <Button
            variant="primary"
            size="md"
            icon={LayoutDashboard}
            onClick={() => navigate(getHomeRoute(), { replace: true })}
            className="w-full sm:flex-1"
          >
            Go to Dashboard
          </Button>

          <Button
            variant="outline"
            size="md"
            icon={ArrowLeft}
            onClick={() => navigate(-1)}
            className="w-full sm:flex-1"
          >
            Go Back
          </Button>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-600 font-medium transition-colors cursor-pointer mt-2"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out or switch account
        </button>
      </div>

      <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
        <img src={logo} alt="CebizPay" className="w-4 h-4 rounded-full object-cover" />
        <span>CebizPay Security</span>
      </div>
    </div>
  );
}
