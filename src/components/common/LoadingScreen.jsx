import React from 'react';
import logo from '../../assets/logo.jpg';

export default function LoadingScreen({
  message = 'Securing session...',
  fullScreen = true,
}) {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-background min-h-screen px-4 overflow-hidden select-none'
    : 'w-full py-16 flex flex-col items-center justify-center bg-background select-none';

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <div className="absolute w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none -top-10 -right-10" />
      <div className="absolute w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none -bottom-10 -left-10" />

      <div className="relative flex flex-col items-center max-w-xs text-center z-10">
        <div className="relative flex items-center justify-center w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-primary/15 border-t-primary animate-spin" />
          <div className="absolute inset-1.5 rounded-full border border-primary/20 animate-ping opacity-25" />
          <div className="w-16 h-16 rounded-full overflow-hidden p-0.5 bg-white shadow-md shadow-primary/10 border border-slate-100 flex items-center justify-center">
            <img
              src={logo}
              alt="CebizPay"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        <h2 className="text-primary-text font-bold text-lg tracking-tight mb-1.5">
          CebizPay
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm font-medium animate-pulse mb-5">
          {message}
        </p>

        <div className="w-36 h-1 bg-slate-200/80 rounded-full overflow-hidden relative">
          <div
            className="absolute top-0 bottom-0 bg-primary rounded-full"
            style={{
              animation: 'loadingSlide 1.6s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes loadingSlide {
          0% {
            left: -50%;
            width: 30%;
          }
          50% {
            left: 30%;
            width: 60%;
          }
          100% {
            left: 100%;
            width: 30%;
          }
        }
      `}</style>
    </div>
  );
}
