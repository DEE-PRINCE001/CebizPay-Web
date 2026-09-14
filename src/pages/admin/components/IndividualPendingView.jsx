import React from 'react';
import womanPhoto from '../../../assets/woman.svg';
import IndividualBreadcrumb from './IndividualBreadcrumb.jsx';

export default function IndividualPendingView({
  individual,
  onReject,
  onVerify,
  onViewDocument,
}) {
  const userName = individual?.name || 'Individual';
  const email = individual?.email || 'N/A';
  const phoneNumber = individual?.phoneNumber || 'N/A';
  const photo = individual?.photoUrl || individual?.avatarUrl || womanPhoto;
  const credentials = individual?.credentials || [];

  return (
    <div className="flex flex-col space-y-6">
      {/* Breadcrumb Header */}
      <IndividualBreadcrumb name={userName} />

      {/* Split Content: Photo on Left, Details & Credentials on Right */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {/* Left Column: Portrait Photo */}
        <div className="w-full lg:w-5/12 xl:w-4/12 rounded-3xl overflow-hidden shadow-xs border border-slate-100 bg-white shrink-0 h-64 sm:h-80 lg:h-auto min-h-64 sm:min-h-80 lg:min-h-96">
          <img
            src={photo}
            alt={userName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Column: Metadata Overview Card & Credentials Card */}
        <div className="w-full lg:w-7/12 xl:w-8/12 flex flex-col space-y-6">
          {/* Top Card: Overview */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xs border border-slate-100">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-text mb-4">
              {userName}
            </h2>

            <div className="border-t border-slate-100 pt-5 mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 font-medium">Email Address</p>
                <p className="text-xs sm:text-sm font-semibold text-primary-text mt-1 truncate" title={email}>
                  {email}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-medium">Phone Number</p>
                <p className="text-xs sm:text-sm font-semibold text-primary-text mt-1 truncate">
                  {phoneNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Card: Credentials */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xs border border-slate-100 flex-1">
            <h3 className="text-base sm:text-lg font-bold text-primary-text mb-4">
              Credentails
            </h3>

            {credentials.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {credentials.map((doc) => (
                  <div
                    key={doc.id}
                    className="py-3.5 flex items-center justify-between gap-3"
                  >
                    <span className="text-xs sm:text-sm font-medium text-slate-700 pr-2">
                      {doc.title}
                    </span>

                    <button
                      type="button"
                      onClick={() => onViewDocument?.(doc)}
                      className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 active:bg-primary/80 text-white rounded-lg px-6 py-1.5 text-xs font-medium transition-colors cursor-pointer shrink-0 shadow-xs"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-sm">
                No credentials submitted yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons: Reject & Verify */}
      <div className="flex items-center justify-end space-x-3 sm:space-x-4 pt-2">
        <button
          type="button"
          onClick={onReject}
          className="inline-flex items-center justify-center bg-rejected/15 hover:bg-rejected/25 active:bg-rejected/30 text-rejected font-medium text-xs sm:text-sm px-6 sm:px-9 py-2.5 rounded-xl transition-colors cursor-pointer select-none"
        >
          Reject
        </button>

        <button
          type="button"
          onClick={onVerify}
          className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 active:bg-primary/80 text-white font-medium text-xs sm:text-sm px-6 sm:px-9 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs select-none"
        >
          Verify
        </button>
      </div>
    </div>
  );
}
