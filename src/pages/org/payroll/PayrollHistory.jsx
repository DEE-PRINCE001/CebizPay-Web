import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import FilterDropdown from '../../../components/forms/FilterDropdown.jsx';
import { ChevronDown } from 'lucide-react';
import { MOCK_PAYROLL_HISTORY } from '../../../data/mockPayrollData.js';

export default function PayrollHistory() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  const handleToggleMenu = () => {
    window.dispatchEvent(new CustomEvent('toggle-payroll-menu'));
  };

  const handleExport = () => {
    const headers = ['Payment Period', 'Pay Date', 'Total Payment (NGN)', 'No. of Employees'];
    const rows = MOCK_PAYROLL_HISTORY.map((item) => [
      `"${item.paymentPeriod}"`,
      `"${item.payDate}"`,
      `"${item.totalPayment}"`,
      `"${item.noOfEmployees}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `payroll_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (batch) => {
    navigate(`/org/payroll/history/${batch.id}`, { state: { batch } });
  };

  const filteredHistory = MOCK_PAYROLL_HISTORY.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.paymentPeriod.toLowerCase().includes(q) ||
      item.payDate.toLowerCase().includes(q) ||
      item.totalPayment.toLowerCase().includes(q)
    );
  });

  return (
    <OrgDashboardLayout>
      <div className="flex flex-col space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Breadcrumb
            parentLabel="Cebis"
            currentLabel="Payroll History"
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
          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input on Left */}
            <div className="w-full sm:w-72">
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                placeholder="Search"
                className="w-full"
              />
            </div>

            {/* Actions on Right: Export, Date, Filter */}
            <div className="flex items-center space-x-3 self-end sm:self-auto relative">
              <button
                type="button"
                onClick={handleExport}
                className="px-6 py-2 rounded-full border border-primary/30 text-primary hover:bg-blue-50/50 text-xs sm:text-sm font-medium transition-colors cursor-pointer select-none"
              >
                Export
              </button>

              <button
                type="button"
                className="px-6 py-2 rounded-full border border-primary/30 text-primary hover:bg-blue-50/50 text-xs sm:text-sm font-medium transition-colors cursor-pointer select-none"
              >
                Date
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsFilterOpen((prev) => !prev)}
                  className="px-6 py-2 rounded-full bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-medium flex items-center space-x-1.5 transition-colors cursor-pointer select-none"
                >
                  <span>Filter</span>
                  <ChevronDown className="w-4 h-4 shrink-0" />
                </button>

                <FilterDropdown
                  isOpen={isFilterOpen}
                  onClose={() => setIsFilterOpen(false)}
                  onSelect={(status) => {
                    setSelectedStatus(status);
                    setCurrentPage(1);
                  }}
                  selectedStatus={selectedStatus}
                />
              </div>
            </div>
          </div>

          {/* Payroll History Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-transparent">
                  <TableHead className="w-1/5">Payment Period</TableHead>
                  <TableHead className="w-1/4">Pay Date</TableHead>
                  <TableHead className="w-1/4">Total Payment (NGN)</TableHead>
                  <TableHead className="w-1/5">No. of Employees</TableHead>
                  <TableHead className="w-16 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredHistory.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-normal text-slate-800">
                      {row.paymentPeriod}
                    </TableCell>
                    <TableCell className="font-normal text-slate-800">
                      {row.payDate}
                    </TableCell>
                    <TableCell className="font-normal text-slate-800">
                      {row.totalPayment}
                    </TableCell>
                    <TableCell className="font-normal text-slate-800">
                      {row.noOfEmployees}
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        type="button"
                        onClick={() => handleView(row)}
                        className="text-xs sm:text-sm font-semibold text-active hover:underline cursor-pointer select-none"
                      >
                        View
                      </button>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredHistory.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                      No payroll records found.
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
