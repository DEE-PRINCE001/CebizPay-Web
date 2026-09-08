import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, FileText, Loader2, X } from 'lucide-react';
import Label from './Label.jsx';
import FormError from './FormError.jsx';

export default function FileUpload({
  label,
  id,
  name,
  accept = 'image/jpeg, image/png, application/pdf',
  helperText = '(JPEG, PNG, or PDF up to 10MB)',
  required = false,
  disabled = false,
  loading = false,
  error = '',
  value = '',
  onChange,
  className = '',
}) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState(
    value ? (typeof value === 'string' ? value.split('/').pop() : value.name) : ''
  );
  const inputRef = useRef(null);
  const inputId = id || name;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || loading) return;

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled || loading) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFileName(file.name);
      if (onChange) onChange(file);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFileName(file.name);
      if (onChange) onChange(file);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedFileName('');
    if (inputRef.current) inputRef.current.value = '';
    if (onChange) onChange(null);
  };

  const handleClick = () => {
    if (!disabled && !loading && inputRef.current) {
      inputRef.current.click();
    }
  };

  const isPdf = selectedFileName.toLowerCase().endsWith('.pdf');

  return (
    <div className={`flex flex-col w-full text-left font-satoshi ${className}`}>
      {label && (
        <Label htmlFor={inputId} required={required}>
          {label}
        </Label>
      )}

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 relative select-none ${
          disabled || loading
            ? 'opacity-60 cursor-not-allowed bg-slate-50 border-slate-200'
            : error
            ? 'border-red-300 bg-red-50/20'
            : dragActive
            ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
            : 'border-slate-200 bg-gray-50/40 hover:bg-slate-50 hover:border-slate-300'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          id={inputId}
          name={name}
          className="hidden"
          accept={accept}
          disabled={disabled || loading}
          onChange={handleChange}
        />

        <div className="flex flex-col items-center justify-center px-4 text-center">
          {loading ? (
            <>
              <Loader2 size={24} className="animate-spin text-primary mb-2" />
              <p className="text-sm font-medium text-primary-text">Uploading document...</p>
            </>
          ) : selectedFileName ? (
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs max-w-[280px]">
              {isPdf ? (
                <FileText size={18} className="text-primary shrink-0" />
              ) : (
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              )}
              <span className="text-xs font-medium text-slate-800 truncate">{selectedFileName}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-slate-400 hover:text-red-500 transition-colors ml-1 cursor-pointer"
                  title="Remove file"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ) : (
            <>
              <UploadCloud size={24} className="mb-2 text-slate-400" />
              <p className="text-sm font-medium text-primary-text">
                Click to upload <span className="text-slate-500 font-normal">or drag and drop</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">{helperText}</p>
            </>
          )}
        </div>
      </div>

      {error && <FormError message={error} />}
    </div>
  );
}