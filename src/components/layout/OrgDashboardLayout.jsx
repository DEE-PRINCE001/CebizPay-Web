import React from 'react';
import OrgNavbar from './OrgNavbar.jsx';

export default function OrgDashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:py-8 lg:px-12 flex flex-col space-y-6 overflow-y-auto print:bg-white print:p-0 print:space-y-0">
      <OrgNavbar />
      <main className="flex-1 w-full print:p-0">
        {children}
      </main>
    </div>
  );
}
