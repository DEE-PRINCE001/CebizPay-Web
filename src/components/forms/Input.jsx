import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Label from './Label';
import FormError from './FormError';

/**
 * Standard Text / Email / Number / Password Input with rounded-xl (12px) styling and error binding.
 * Uses design system color tokens from index.css.
 */
const Input = forwardRef(function Input({
  label,
  id,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  disabled = false,
  icon: Icon = null,
  iconPosition = 'left',
  showPasswordToggle = true,
  multiline = false,
  rows = 3,
  className = '',
  ...props
}, ref) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name;

  const isPassword = type === 'password';
  const computedType = isPassword && showPassword ? 'text' : type;

  const errorStyles = error
    ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/20'
    : 'border-slate-300 focus:ring-primary focus:border-primary bg-background';

  const hasRightToggle = isPassword && showPasswordToggle;
  const paddingLeft = Icon && iconPosition === 'left' ? 'pl-10' : 'pl-4';
  const paddingRight = hasRightToggle || (Icon && iconPosition === 'right') ? 'pr-10' : 'pr-4';

  return (
    <div className="w-full">
      {label && (
        <Label htmlFor={inputId} required={required}>
          {label}
        </Label>
      )}
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Icon size={16} />
          </div>
        )}
        {multiline ? (
          <textarea
            ref={ref}
            id={inputId}
            name={name}
            rows={rows}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            placeholder={placeholder}
            required={required}
            className={`w-full py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all resize-none disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${paddingLeft} ${paddingRight} ${errorStyles} ${className}`}
            {...props}
          />
        ) : (
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={computedType}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            placeholder={placeholder}
            required={required}
            className={`w-full py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${paddingLeft} ${paddingRight} ${errorStyles} ${className}`}
            {...props}
          />
        )}
        {!multiline && hasRightToggle ? (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        ) : (
          Icon && iconPosition === 'right' && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Icon size={16} />
            </div>
          )
        )}
      </div>
      {error && <FormError message={error} />}
      {!error && helperText && (
        <p className="text-xs text-slate-500 mt-1">{helperText}</p>
      )}
    </div>
  );
});

export default Input;
