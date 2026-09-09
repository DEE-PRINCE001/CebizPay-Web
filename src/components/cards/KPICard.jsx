import React from 'react'
import Badge from '../common/Badge.jsx'

const KPICard = ({ title, value, icon }) => {
  return (
    <div className="flex-1 bg-white rounded-xl p-5 flex flex-col space-y-3 justify-center">
        <Badge icon={icon} size="md" />
        <h2 className='font-semibold pt-5'>{title}</h2>
        <h1 className='text-[30px] font-extrabold leading-none'>{value}</h1>
    </div>
  )
}

export default KPICard