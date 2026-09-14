import React from 'react';
import Badge from '../common/Badge.jsx';
import { Loader2 } from 'lucide-react';

const KPICard = ({ title, value, icon, isLoading = false, isError = false, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl p-4 sm:p-5 flex flex-col space-y-3 justify-center shadow-xs ${className}`}>
      <Badge icon={icon} size="md" />
      <h2 className='font-semibold pt-3 sm:pt-5 text-sm sm:text-base text-primary-text'>{title}</h2>
      {isLoading ? (
        <div className="flex items-center space-x-1.5 py-1 text-slate-300">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <span className="text-sm text-rejected font-semibold">Error</span>
      ) : (
        <h1 className='text-2xl sm:text-[30px] font-extrabold leading-none tracking-tight'>{value}</h1>
      )}
    </div>
  );
};

export default KPICard;