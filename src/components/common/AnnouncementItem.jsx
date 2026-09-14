import React from 'react';

const INDICATOR_COLORS = {
  primary: 'bg-primary',
  blue: 'bg-primary',
  green: 'bg-emerald-500',
  purple: 'bg-purple-600',
  orange: 'bg-amber-500',
  yellow: 'bg-amber-400',
  red: 'bg-red-500',
};

const AnnouncementItem = ({
  title = '',
  description = '',
  maxTitleLength = 45,
  maxDescLength = 95,
  indicatorColor = 'primary',
  className = '',
}) => {
  const truncatedTitle = title.length > maxTitleLength 
    ? `${title.slice(0, maxTitleLength).trim()}...` 
    : title;

  const truncatedDesc = description.length > maxDescLength
    ? `${description.slice(0, maxDescLength).trim()}...`
    : description;

  const barColorClass = INDICATOR_COLORS[indicatorColor] || INDICATOR_COLORS.primary;

  return (
    <div className={`flex space-x-3 ${className}`}>
      <div className={`${barColorClass} w-[2px] rounded-full shrink-0 self-stretch min-h-8`}></div>
      <div className="flex flex-col space-y-0.5 min-w-0">
        <h3 className="font-semibold text-xs sm:text-sm text-primary-text truncate" title={title}>
          {truncatedTitle}
        </h3>
        <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-2 leading-relaxed" title={description}>
          {truncatedDesc}
        </p>
      </div>
    </div>
  );
};

export default AnnouncementItem;