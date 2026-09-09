import React from 'react'
import Navbar from './Navbar.jsx'
const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background pt-8 px-12 flex flex-col space-y-5">
        <Navbar />
        <div className="flex-1">
            {children}
        </div>

    </div>

  )
}

export default DashboardLayout