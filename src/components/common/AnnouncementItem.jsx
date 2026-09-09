import React from 'react'

const AnnouncementItem = ({ title, description }) => {
    return (
        <div className="flex space-x-3">
            <div className="bg-primary w-px h-full"></div>
            <div className="flex flex-col space-y-1">
                <h3 className='font-semibold'>{title}</h3>
                <p className='text-sm text-muted-foreground'>{description}</p>
            </div>
        </div>
    )
}

export default AnnouncementItem