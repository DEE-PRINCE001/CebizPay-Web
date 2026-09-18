import React, { useState } from 'react';
import OrgDashboardLayout from '../../../components/layout/OrgDashboardLayout.jsx';
import Breadcrumb from '../../../components/common/Breadcrumb.jsx';
import Button from '../../../components/common/Button.jsx';
import SearchInput from '../../../components/forms/SearchInput.jsx';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../../components/common/table/index.js';
import Pagination from '../../../components/common/Pagination.jsx';
import { X } from 'lucide-react';
import { MOCK_PAYROLL_SCHEDULES } from '../../../data/mockPayrollData.js';

export default function PayrollSchedules() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [schedules, setSchedules] = useState(MOCK_PAYROLL_SCHEDULES);

  const handleToggleMenu = () => {
    window.dispatchEvent(new CustomEvent('toggle-payroll-menu'));
  };

  const handleRemoveSchedule = (id) => {
    setSchedules((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredSchedules = schedules.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.description.toLowerCase().includes(q) ||
      item.department.toLowerCase().includes(q) ||
      item.amount.toLowerCase().includes(q)
    );
  });

  return (
    <OrgDashboardLayout>
      <div className="flex flex-col space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Breadcrumb
            parentLabel="Cebis"
            currentLabel="Payroll Schedules"
            parentTo="/org/dashboard"
            className="!mb-0"
          />

          <div className="flex items-center space-x-3 self-end sm:self-auto">
            <Button
              variant="outline"
              size="md"
              onClick={handleToggleMenu}
              className="w-auto px-6 py-2 text-xs sm:text-sm font-medium"
            >
              Payrolls
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {}}
              className="w-auto px-6 py-2 text-xs sm:text-sm font-semibold"
            >
              Pay Salaries
            </Button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 shadow-xs border border-slate-100 flex flex-col space-y-6">
          {/* Search Toolbar */}
          <div className="w-full sm:w-72">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search"
              className="w-full"
            />
          </div>

          {/* Schedules Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-transparent">
                  <TableHead className="w-1/3">Payment Decsription</TableHead>
                  <TableHead className="w-1/5">Payment Date</TableHead>
                  <TableHead className="w-1/5">Amount</TableHead>
                  <TableHead className="w-1/5">Department</TableHead>
                  <TableHead className="w-12 text-center" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredSchedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-normal text-slate-800">
                      {schedule.description}
                    </TableCell>
                    <TableCell className="font-normal text-slate-800">
                      {schedule.paymentDate}
                    </TableCell>
                    <TableCell className="font-normal text-slate-800">
                      {schedule.amount}
                    </TableCell>
                    <TableCell className="font-normal text-slate-800">
                      {schedule.department}
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveSchedule(schedule.id)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                        aria-label="Cancel schedule"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredSchedules.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                      No schedules found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Table Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={130}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </OrgDashboardLayout>
  );
}
