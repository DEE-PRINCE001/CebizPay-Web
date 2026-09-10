import React from 'react';
import { X, Building2, Mail, MapPin, Tag } from 'lucide-react';
import StatusBadge from '../common/StatusBadge.jsx';
import Button from '../common/Button.jsx';
import defaultProfile from '../../assets/default-profile.svg';

export default function OrganizationDetailsModal({
  isOpen,
  onClose,
  organization,
}) {
  if (!isOpen || !organization) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="org-details-title"
    >
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-slate-100 bg-slate-100">
            <img
              src={defaultProfile}
              alt={organization.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 id="org-details-title" className="text-xl font-bold text-primary-text">
              {organization.name}
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-slate-500 font-medium">Status:</span>
              <StatusBadge status={organization.status} />
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="space-y-4 border-t border-b border-slate-100 py-5 my-5">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-slate-500 flex items-center gap-2">
              <Tag className="w-4 h-4 text-slate-400" /> Category
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-800">
              {organization.category || 'General'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-slate-500 flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" /> Email Address
            </span>
            <span className="text-xs sm:text-sm font-medium text-slate-800">
              {organization.email}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-slate-500 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" /> Office Address
            </span>
            <span className="text-xs sm:text-sm font-medium text-slate-800 text-right max-w-xs">
              {organization.address}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-slate-500 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" /> Organization ID
            </span>
            <span className="text-xs font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md">
              {organization.id}
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            className="w-auto px-6 py-2"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
