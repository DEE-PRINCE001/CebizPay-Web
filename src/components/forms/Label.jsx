import React from 'react';

/**
 * Standard Form Label with optional required indicator.
 */
export default function Label({
  children,
  htmlFor,
  required = false,
  className = ''
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-satoshi font-semibold text-primary-text mb-1.5 tracking-wider ${className}`}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}
