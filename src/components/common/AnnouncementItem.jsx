import React from 'react';

const AnnouncementItem = ({ title = '', description = '', maxTitleLength = 45, maxDescLength = 95 }) => {
  const truncatedTitle = title.length > maxTitleLength 
    ? `${title.slice(0, maxTitleLength).trim()}...` 
    : title;

  const truncatedDesc = description.length > maxDescLength
    ? `${description.slice(0, maxDescLength).trim()}...`
    : description;

  return (
    <div className="flex space-x-3">
      <div className="bg-primary w-px shrink-0 self-stretch"></div>
      <div className="flex flex-col space-y-1 min-w-0">
        <h3 className="font-semibold text-sm sm:text-base text-primary-text truncate" title={title}>
          {truncatedTitle}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2" title={description}>
          {truncatedDesc}
        </p>
      </div>
    </div>
  );
};

export default AnnouncementItem;