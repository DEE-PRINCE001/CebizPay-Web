import React from 'react';

export const ToggleSwitch = ({ checked, onChange, disabled = false, label = 'Toggle status' }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className="focus:outline-none transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={label}
    >
      {checked ? (
        <div className="flex items-center bg-green-600 rounded-full px-1 py-0.5 text-[10px] font-bold text-white space-x-1 w-14 h-7 justify-between shadow-xs">
          <span className="pl-1.5 uppercase select-none">On</span>
          <div className="w-5 h-5 bg-white rounded-full shadow-xs" />
        </div>
      ) : (
        <div className="flex items-center bg-zinc-900 rounded-full px-1 py-0.5 text-[10px] font-bold text-white space-x-1 w-14 h-7 justify-between shadow-xs">
          <div className="w-5 h-5 bg-white rounded-full shadow-xs" />
          <span className="pr-1.5 uppercase select-none">Off</span>
        </div>
      )}
    </button>
  );
};

export default ToggleSwitch;
