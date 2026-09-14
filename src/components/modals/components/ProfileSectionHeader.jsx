import React from 'react';

export const ProfileSectionHeader = ({ title, value, className = '' }) => {
  return (
    <div className={`bg-white rounded-md py-3 px-6 sm:px-8 flex justify-between items-center shadow-xs ${className}`}>
      <h2 className="font-semibold text-primary-text leading-none text-sm sm:text-base">{title}</h2>
      <h4 className="text-sm sm:text-md font-medium text-slate-700 leading-none">{value}</h4>
    </div>
  );
};

export default ProfileSectionHeader;
