import React from 'react'
import Navbar from './Navbar.jsx'
const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:py-8 lg:px-12 flex flex-col space-y-5 overflow-y-auto">
        <Navbar />
        <div className="flex-1">
            {children}
        </div>

    </div>

  )
}

export default DashboardLayout