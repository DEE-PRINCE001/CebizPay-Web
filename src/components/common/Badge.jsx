import React from 'react'

const Badge = ({icon: Icon = null, variant='secondary', size='md'}) => {

    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-7 w-7'
    }
  return (
    <div className={`w-fit items-center p-3 rounded-full text-xs font-medium ${variant === 'primary' ? 'bg-primary text-white' : 'bg-background text-black'}`}>
      {Icon && <Icon className={`${sizes[size]} text-inherit`} />}
      
    </div>
  )
}

export default Badge