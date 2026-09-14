import React from 'react';
import OrgNavbar from './OrgNavbar.jsx';

export default function OrgDashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:py-8 lg:px-12 flex flex-col space-y-6 overflow-y-auto">
      <OrgNavbar />
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}
