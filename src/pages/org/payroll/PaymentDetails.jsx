import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import OrgDashboardLayout from '../../../components/layout/OrgDashboardLayout.jsx';
import Breadcrumb from '../../../components/common/Breadcrumb.jsx';
import Button from '../../../components/common/Button.jsx';
import EditPaymentDetailsModal from '../../../components/modals/payroll/EditPaymentDetailsModal.jsx';
import { Loader2, AlertCircle } from 'lucide-react';
import logo from '../../../assets/logo.jpg';
import { payrollService } from '../../../api/services/payroll.service.js';

function isUuid(str) {
  return (
    typeof str === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)
  );
}

function formatDetailDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function PaymentDetails() {
  const { paymentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [localOverrides, setLocalOverrides] = useState({});

  const passed = location.state?.payment;
  const targetVoucherId = paymentId || passed?.voucherId || passed?.id;

  // Fetch live voucher details if target ID available
  const {
    data: voucherData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['org-payroll-voucher', targetVoucherId],
    queryFn: () => payrollService.getVoucherById(targetVoucherId),
    enabled: Boolean(targetVoucherId && isUuid(targetVoucherId)),
    staleTime: 30 * 1000,
  });

  const activeDetails = useMemo(() => {
    const src = voucherData || passed?.raw || passed;
    if (!src) return null;

    const amountNum =
      localOverrides.amountNumber ??
      src.amount ??
      src.netAmount ??
      passed?.amountNumber ??
      null;

    const formattedAmt =
      localOverrides.amountFormatted ||
      src.amountFormatted ||
      (amountNum != null
        ? `${src.currency || 'NGN'} ${Number(amountNum).toLocaleString()}`
        : '-');

    return {
      paymentId:
        localOverrides.paymentId ||
        src.voucherNumber ||
        src.paymentId ||
        src.voucherId ||
        targetVoucherId ||
        '-',
      voucherId: targetVoucherId || src.id,
      companyName: src.organizationName || src.companyName || 'Organization',
      companyAddress: src.organizationAddress || src.companyAddress || '-',
      companyEmail: src.organizationEmail || src.companyEmail || '-',
      companyPhones: src.organizationPhones || src.organizationPhone || src.companyPhones || '-',
      receivingBank: localOverrides.receivingBank || src.bankName || src.receivingBank || '-',
      accountName: src.accountName || src.payeeName || src.recipient || src.employeeName || '-',
      email: src.payeeEmail || src.email || src.payeeDetails || '-',
      address: src.payeeAddress || src.address || '-',
      amountFormatted: formattedAmt,
      amountNumber: amountNum,
      amountInWords: src.amountInWords || '-',
      currency: localOverrides.currency || src.currency || 'NGN',
      transactionId:
        src.transactionId ||
        src.reference ||
        src.ledgerTransactionId ||
        '-',
      payingBank: localOverrides.payingBank || src.payingBank || src.disbursingBank || '-',
      remarks: localOverrides.remarks || src.remarks || src.notes || '-',
      description: localOverrides.description || src.description || src.narration || src.purpose || '-',
      paymentDate:
        formatDetailDate(src.paymentDate || src.paidAtUtc || src.createdAtUtc) || '-',
    };
  }, [voucherData, passed, targetVoucherId, localOverrides]);

  const handlePrint = () => {
    window.print();
  };

  const handleUpdate = (updatedFields) => {
    setLocalOverrides((prev) => ({
      ...prev,
      paymentId: updatedFields.paymentId,
      receivingBank: updatedFields.receivingBank,
      payingBank: updatedFields.payingBank,
      amountFormatted: `${
        String(updatedFields.currency).includes('USD') ? '$' : 'NGN'
      } ${updatedFields.amount}`,
      amountNumber: updatedFields.amount,
      remarks: updatedFields.remarks,
      description: updatedFields.description,
    }));
  };

  return (
    <OrgDashboardLayout>
      <div className="flex flex-col space-y-6">
        {/* Breadcrumb Header */}
        <div className="print:hidden">
          <Breadcrumb
            parentLabel="Cebis"
            currentLabel="Payment Details"
            onBack={() => navigate(-1)}
            className="!mb-0"
          />
        </div>

        {/* Voucher Receipt Container */}
        {isLoading ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-12 shadow-xs border border-slate-100 flex flex-col items-center justify-center space-y-3 max-w-4xl mx-auto w-full">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs font-medium text-slate-500">Loading payment details...</p>
          </div>
        ) : !activeDetails || isError ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-12 shadow-xs border border-slate-100 flex flex-col items-center justify-center space-y-4 max-w-4xl mx-auto w-full text-center">
            <AlertCircle className="w-10 h-10 text-rose-500" />
            <div className="flex flex-col space-y-1">
              <h3 className="text-base font-bold text-slate-800">Payment Details Not Found</h3>
              <p className="text-xs text-slate-500 max-w-md">
                We couldn't retrieve the voucher details for this payment. It may have been removed or the record does not exist.
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="w-auto px-4 py-2 text-xs font-medium"
              >
                Go Back
              </Button>
              {isError && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => refetch()}
                  className="w-auto px-4 py-2 text-xs font-medium"
                >
                  Try Again
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-14 shadow-xs border border-slate-100 flex flex-col space-y-6 max-w-4xl mx-auto w-full print:border-none print:shadow-none print:p-0">
            {/* Header with Organization and Contact info */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100 shrink-0">
                  <img src={logo} alt="Cebizpay" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-base sm:text-lg font-black text-primary-text tracking-wide uppercase">
                  {activeDetails.companyName}
                </h2>
              </div>

              <div className="text-right flex flex-col space-y-0.5 text-xs text-primary-text font-normal self-end sm:self-auto">
                <p>{activeDetails.companyAddress}</p>
                <p>{activeDetails.companyEmail}</p>
                <p>{activeDetails.companyPhones}</p>
              </div>
            </div>

            <hr className="border-t border-slate-300" />

            {/* Payment Title & Metadata */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-base sm:text-lg font-black text-primary-text tracking-wide uppercase">
                PAYMENT DETAILS
              </h3>

              <div className="text-right self-end sm:self-auto">
                <p className="text-xs sm:text-sm font-bold text-primary-text">
                  Payment ID: {activeDetails.paymentId}
                </p>
                <p className="text-[11px] text-slate-500 font-normal">
                  Payment Date: {activeDetails.paymentDate}
                </p>
              </div>
            </div>

            {/* Beneficiary Details */}
            <div className="flex flex-col space-y-1 text-xs text-slate-700">
              <p>
                <strong className="text-primary-text font-bold">Receiving Bank:</strong>{' '}
                {activeDetails.receivingBank}
              </p>
              <p>
                <strong className="text-primary-text font-bold">Account Name:</strong>{' '}
                {activeDetails.accountName}
              </p>
              <p>
                <strong className="text-primary-text font-bold">E-mail:</strong>{' '}
                {activeDetails.email}
              </p>
              <p>
                <strong className="text-primary-text font-bold">Address:</strong>{' '}
                {activeDetails.address}
              </p>
            </div>

            <hr className="border-t border-slate-300" />

            {/* Transaction Summary */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex flex-col space-y-1 text-xs text-slate-700">
                <p>
                  <strong className="text-primary-text font-bold">Transaction ID :</strong>{' '}
                  {activeDetails.transactionId}
                </p>
                <p>
                  <strong className="text-primary-text font-bold">Amount:</strong>{' '}
                  {activeDetails.amountFormatted}
                </p>
                <p>
                  <strong className="text-primary-text font-bold">Amount in words:</strong>{' '}
                  {activeDetails.amountInWords}
                </p>
              </div>

              <div className="text-right text-xs text-slate-700 self-end sm:self-auto">
                <p>
                  <strong className="text-primary-text font-bold">Paying bank:</strong>{' '}
                  {activeDetails.payingBank}
                </p>
              </div>
            </div>

            <hr className="border-t border-slate-300" />

            {/* Description Section */}
            <div className="flex flex-col space-y-2">
              <h4 className="text-xs sm:text-sm font-black text-primary-text tracking-wide uppercase">
                DESCRIPTION
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed text-justify">
                {activeDetails.description}
              </p>
            </div>

            <hr className="border-t border-slate-300" />

            {/* Remarks Section */}
            <div className="flex flex-col space-y-2">
              <h4 className="text-xs sm:text-sm font-black text-primary-text tracking-wide uppercase">
                REMARKS:
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed text-justify">
                {activeDetails.remarks}
              </p>
            </div>

            {/* Document Bottom Actions */}
            <div className="flex items-center justify-between pt-6 print:hidden">
              <button
                type="button"
                onClick={handlePrint}
                className="px-10 py-2.5 rounded-xl border border-primary/40 text-primary hover:bg-blue-50/60 font-semibold text-xs sm:text-sm transition-colors cursor-pointer select-none"
              >
                Print
              </button>

              <button
                type="button"
                onClick={() => setIsEditOpen(true)}
                className="px-12 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer select-none shadow-xs"
              >
                Edit
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Payment Details Modal */}
      <EditPaymentDetailsModal
        key={isEditOpen ? `edit-${activeDetails.paymentId}` : 'edit-closed'}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        initialData={activeDetails}
        onUpdate={handleUpdate}
      />
    </OrgDashboardLayout>
  );
}
