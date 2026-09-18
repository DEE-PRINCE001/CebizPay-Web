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
import { MOCK_PAYMENT_BREAKDOWN } from '../../../data/mockPayrollData.js';

export default function PaymentBreakdown() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleToggleMenu = () => {
    window.dispatchEvent(new CustomEvent('toggle-payroll-menu'));
  };

  const handleViewPayment = (payment) => {
    navigate(`/org/payroll/payments/${payment.id}`, { state: { payment } });
  };

  const filteredPayments = MOCK_PAYMENT_BREAKDOWN.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.recipient.toLowerCase().includes(q) ||
      item.paymentDate.toLowerCase().includes(q) ||
      item.amount.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  });

  return (
    <OrgDashboardLayout>
      <div className="flex flex-col space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Breadcrumb
            parentLabel="Cebis"
            currentLabel="Payment Breakdown"
            parentTo="/org/payroll/history"
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

          {/* Breakdown Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-transparent">
                  <TableHead className="w-1/4">Recipient</TableHead>
                  <TableHead className="w-1/6">Payment Date</TableHead>
                  <TableHead className="w-1/5">Amount</TableHead>
                  <TableHead className="w-1/4">Payment Decsription</TableHead>
                  <TableHead className="w-24 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredPayments.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-normal text-slate-800">
                      {row.recipient}
                    </TableCell>
                    <TableCell className="font-normal text-slate-800">
                      {row.paymentDate}
                    </TableCell>
                    <TableCell className="font-normal text-slate-800">
                      {row.amount}
                    </TableCell>
                    <TableCell className="font-normal text-slate-800">
                      {row.description}
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        type="button"
                        onClick={() => handleViewPayment(row)}
                        className="text-xs sm:text-sm font-semibold text-primary hover:underline cursor-pointer select-none"
                      >
                        View payment
                      </button>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredPayments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                      No payment breakdown items found.
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
