import React, { useState, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

/**
 * ChipInput allows managing an array of tags (e.g., department roles, team members).
 * Matches the visual design in CreateDepartments.png and CreateLevel.png.
 */
export default function ChipInput({
  label,
  items = [],
  onChange,
  placeholder = 'Add new...',
  className = '',
  disabled = false,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleAddItem = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !items.includes(trimmed)) {
      onChange?.([...items, trimmed]);
    }
    setInputValue('');
    setIsAdding(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setInputValue('');
    }
  };

  const handleRemoveItem = (indexToRemove) => {
    if (disabled) return;
    onChange?.(items.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className={`w-full flex flex-col space-y-1.5 ${className}`}>
      {label && (
        <label className="text-xs sm:text-sm font-semibold text-primary-text select-none">
          {label}
        </label>
      )}

      <div className="w-full min-h-[96px] p-3 rounded-xl border border-slate-200 bg-white flex flex-wrap items-center gap-2.5 transition-colors focus-within:border-primary">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#EEF2F6] text-primary-text font-semibold text-xs select-none shadow-2xs group"
          >
            <span>{item}</span>
            {!disabled && (
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="text-slate-400 hover:text-red-500 transition-colors p-0.5 rounded-full cursor-pointer ml-1"
                aria-label={`Remove ${item}`}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}

        {isAdding ? (
          <div className="inline-flex items-center space-x-1">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleAddItem}
              placeholder={placeholder}
              className="py-1 px-2.5 text-xs rounded-lg border border-primary text-primary-text outline-none bg-white shadow-2xs"
            />
          </div>
        ) : (
          !disabled && (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="w-7 h-7 rounded-full bg-[#EEF2F6] hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer select-none"
              aria-label="Add new item"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )
        )}
      </div>
    </div>
  );
}
