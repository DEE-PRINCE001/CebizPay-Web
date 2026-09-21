import React, { useState, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { Loader2, RotateCw, Ban, AlertCircle } from 'lucide-react';
import { payrollService } from '../../../api/services/payroll.service.js';

function formatBreakdownDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function PaymentBreakdown() {
  const { batchId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const passedBatch = location.state?.batch;

  const handleToggleMenu = () => {
    window.dispatchEvent(new CustomEvent('toggle-payroll-menu'));
  };

  // Fetch batch details from live backend
  const {
    data: batchData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['org-payroll-batch', batchId, currentPage],
    queryFn: () => payrollService.getBatchById(batchId),
    enabled: !!batchId,
    staleTime: 30 * 1000,
  });

  // Retry Failed items mutation
  const retryMutation = useMutation({
    mutationFn: () => payrollService.retryFailed(batchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-payroll-batch', batchId] });
    },
  });

  // Cancel Batch mutation
  const cancelMutation = useMutation({
    mutationFn: () => payrollService.cancelBatch(batchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-payroll-batch', batchId] });
      navigate('/org/payroll/history');
    },
  });

  // Compute breakdown list from live API response
  const displayPayments = useMemo(() => {
    const rawItems = batchData?.items || (Array.isArray(batchData) ? batchData : []);
    return rawItems.map((item) => ({
      id: item.id || item.voucherId || `pay-${Math.random()}`,
      voucherId: item.voucherId || item.id,
      recipient:
        item.recipientName ||
        item.employeeName ||
        item.staffName ||
        item.recipient ||
        item.payeeName ||
        'Staff Member',
      paymentDate: formatBreakdownDate(
        item.paymentDate || item.paidAtUtc || item.createdAtUtc
      ),
      amount:
        item.amountFormatted ||
        (item.netAmount != null
          ? `NGN ${Number(item.netAmount).toLocaleString()}`
          : item.amount != null
          ? `NGN ${Number(item.amount).toLocaleString()}`
          : 'NGN 0.00'),
      amountNumber: item.netAmount ?? item.amount ?? 0,
      description:
        item.description ||
        item.narration ||
        item.remarks ||
        'Monthly Salary Disbursement',
      status: item.status || 'Completed',
      raw: item,
    }));
  }, [batchData]);

  const filteredPayments = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return displayPayments;
    return displayPayments.filter((item) => {
      return (
        item.recipient.toLowerCase().includes(q) ||
        item.paymentDate.toLowerCase().includes(q) ||
        String(item.amount).toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    });
  }, [displayPayments, searchQuery]);

  const totalPages =
    batchData?.totalPages != null && batchData.totalPages > 0
      ? batchData.totalPages
      : displayPayments.length > 0
      ? Math.ceil(displayPayments.length / 10)
      : 1;

  const handleViewPayment = (payment) => {
    navigate(`/org/payroll/payments/${payment.voucherId || payment.id}`, {
      state: { payment, batchId },
    });
  };

  const batchStatus = batchData?.status || passedBatch?.status;
  const canRetry = batchStatus === 'PartiallyCompleted' || batchStatus === 'Failed';
  const canCancel = batchStatus === 'Pending';

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
            {canRetry && (
              <Button
                variant="outline"
                size="md"
                disabled={retryMutation.isPending}
                onClick={() => retryMutation.mutate()}
                icon={RotateCw}
                className="w-auto px-4 py-2 text-xs sm:text-sm font-medium border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                {retryMutation.isPending ? 'Retrying...' : 'Retry Failed'}
              </Button>
            )}

            {canCancel && (
              <Button
                variant="outline"
                size="md"
                disabled={cancelMutation.isPending}
                onClick={() => cancelMutation.mutate()}
                icon={Ban}
                className="w-auto px-4 py-2 text-xs sm:text-sm font-medium border-red-300 text-red-600 hover:bg-red-50"
              >
                {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Batch'}
              </Button>
            )}

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
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <div className="flex items-center justify-center space-x-2 text-primary">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-xs font-medium">Loading payment breakdown...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && isError && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center space-y-2 text-rose-500">
                        <AlertCircle className="w-6 h-6" />
                        <span className="text-xs font-medium text-slate-700">
                          Failed to load payment breakdown. Please try again.
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => refetch()}
                          className="w-auto px-4 py-1.5 text-xs font-medium border-rose-300 text-rose-600 hover:bg-rose-50"
                        >
                          Try Again
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && !isError && filteredPayments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                      No payment breakdown items found for this batch.
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading &&
                  !isError &&
                  filteredPayments.map((row) => (
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
              </TableBody>
            </Table>
          </div>

          {/* Table Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </OrgDashboardLayout>
  );
}
