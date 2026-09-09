import React from 'react'
import Badge from '../common/Badge.jsx'

const KPICard = ({ title, value, icon, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl p-4 sm:p-5 flex flex-col space-y-3 justify-center shadow-xs ${className}`}>
        <Badge icon={icon} size="md" />
        <h2 className='font-semibold pt-3 sm:pt-5 text-sm sm:text-base text-primary-text'>{title}</h2>
        <h1 className='text-2xl sm:text-[30px] font-extrabold leading-none tracking-tight'>{value}</h1>
    </div>
  )
}

export default KPICard