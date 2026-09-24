import React, { useEffect, useState } from 'react';
import { X, Copy, Check, Calendar, User, Shield, Globe, Terminal, FileCode } from 'lucide-react';

function formatTimestamp(isoString) {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  return date.toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

function tryFormatJson(raw) {
  if (!raw) return null;
  if (typeof raw === 'object') return JSON.stringify(raw, null, 2);
  try {
    const parsed = JSON.parse(raw);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return String(raw);
  }
}

export default function AuditLogDetailsModal({ isOpen, onClose, log }) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [activeTab, setActiveTab] = useState('after');

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !log) return null;

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const beforeFormatted = tryFormatJson(log.beforeJson);
  const afterFormatted = tryFormatJson(log.afterJson);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 shrink-0">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border-primary/20">
                {log.action || 'Action'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {log.id ? `${log.id.slice(0, 8)}...` : ''}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-primary-text tracking-tight mt-1">
              Audit Event Details
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6 pr-1">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100 space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
                <Calendar className="w-3.5 h-3.5" />
                <span>Occurred At</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">
                {formatTimestamp(log.occurredAtUtc)}
              </p>
            </div>

            <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <div className="flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Actor ID</span>
                </div>
                {log.actorId && (
                  <button
                    type="button"
                    onClick={() => handleCopy(log.actorId, 'actorId')}
                    className="text-slate-400 hover:text-primary transition-colors cursor-pointer"
                    title="Copy Actor ID"
                  >
                    {copiedKey === 'actorId' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
              <p className="text-sm font-mono text-slate-800 truncate" title={log.actorId || 'N/A'}>
                {log.actorId || 'System / Anonymous'}
              </p>
            </div>

            <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <div className="flex items-center space-x-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Target Resource</span>
                </div>
                {log.resourceId && (
                  <button
                    type="button"
                    onClick={() => handleCopy(log.resourceId, 'resourceId')}
                    className="text-slate-400 hover:text-primary transition-colors cursor-pointer"
                    title="Copy Resource ID"
                  >
                    {copiedKey === 'resourceId' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
              <p className="text-sm font-semibold text-slate-800">
                {log.resourceType || 'Resource'}
                {log.resourceId && (
                  <span className="ml-1.5 text-xs font-mono text-slate-500 font-normal">
                    ({log.resourceId.slice(0, 8)}...)
                  </span>
                )}
              </p>
            </div>

            <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100 space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
                <Globe className="w-3.5 h-3.5" />
                <span>IP Address</span>
              </div>
              <p className="text-sm font-mono text-slate-800">
                {log.ipAddress || 'Not recorded'}
              </p>
            </div>
          </div>

          {/* Optional Correlation / Organization Row */}
          {(log.correlationId || log.organizationId) && (
            <div className="bg-slate-50/60 rounded-xl p-3.5 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {log.organizationId && (
                <div className="space-y-0.5">
                  <span className="text-slate-400">Organization ID:</span>
                  <p className="font-mono text-slate-700 truncate" title={log.organizationId}>
                    {log.organizationId}
                  </p>
                </div>
              )}
              {log.correlationId && (
                <div className="space-y-0.5">
                  <span className="text-slate-400">Correlation ID:</span>
                  <p className="font-mono text-slate-700 truncate" title={log.correlationId}>
                    {log.correlationId}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* User Agent */}
          {log.userAgent && (
            <div className="bg-slate-50/60 rounded-xl p-3 border border-slate-100 space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
                <Terminal className="w-3.5 h-3.5" />
                <span>User Agent</span>
              </div>
              <p className="text-xs font-mono text-slate-600 break-all">
                {log.userAgent}
              </p>
            </div>
          )}

          {/* Payload Changes Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-semibold text-primary-text">Payload State Changes</h3>
              </div>

              {(beforeFormatted || afterFormatted) && (
                <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg text-xs">
                  {beforeFormatted && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('before')}
                      className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                        activeTab === 'before'
                          ? 'bg-white text-primary font-semibold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Before State
                    </button>
                  )}
                  {afterFormatted && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('after')}
                      className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                        activeTab === 'after'
                          ? 'bg-white text-primary font-semibold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      After State
                    </button>
                  )}
                </div>
              )}
            </div>

            {beforeFormatted || afterFormatted ? (
              <div className="relative bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs overflow-x-auto max-h-60 border border-slate-800">
                <div className="absolute top-3 right-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        activeTab === 'before' ? beforeFormatted : afterFormatted,
                        'payload'
                      )
                    }
                    className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                    title="Copy JSON"
                  >
                    {copiedKey === 'payload' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <pre className="pr-8">
                  {activeTab === 'before' ? beforeFormatted : afterFormatted}
                </pre>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-xl p-6 text-center border border-slate-100">
                <p className="text-xs text-slate-500">
                  No state mutation payload was recorded for this event.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
