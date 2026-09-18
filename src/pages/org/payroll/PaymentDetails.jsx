import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OrgDashboardLayout from '../../../components/layout/OrgDashboardLayout.jsx';
import Breadcrumb from '../../../components/common/Breadcrumb.jsx';
import EditPaymentDetailsModal from '../../../components/modals/payroll/EditPaymentDetailsModal.jsx';
import logo from '../../../assets/logo.jpg';
import { MOCK_PAYMENT_DETAILS } from '../../../data/mockPayrollData.js';

export default function PaymentDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [details, setDetails] = useState(() => {
    const passed = location.state?.payment;
    return passed ? { ...MOCK_PAYMENT_DETAILS, ...passed } : MOCK_PAYMENT_DETAILS;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleUpdate = (updatedFields) => {
    setDetails((prev) => ({
      ...prev,
      paymentId: updatedFields.paymentId,
      receivingBank: updatedFields.receivingBank,
      payingBank: updatedFields.payingBank,
      amountFormatted: `${updatedFields.currency.includes('USD') ? '$' : 'NGN'} ${updatedFields.amount}`,
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
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-14 shadow-xs border border-slate-100 flex flex-col space-y-6 max-w-4xl mx-auto w-full print:border-none print:shadow-none print:p-0">
          {/* Header with Organization and Contact info */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100 shrink-0">
                <img src={logo} alt="Cebizpay" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-primary-text tracking-wide uppercase">
                {details.companyName}
              </h2>
            </div>

            <div className="text-right flex flex-col space-y-0.5 text-xs text-primary-text font-normal self-end sm:self-auto">
              <p>{details.companyAddress}</p>
              <p>{details.companyEmail}</p>
              <p>{details.companyPhones}</p>
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
                Payment ID: {details.paymentId}
              </p>
              <p className="text-[11px] text-slate-500 font-normal">
                Payment Date: {details.paymentDate}
              </p>
            </div>
          </div>

          {/* Beneficiary Details */}
          <div className="flex flex-col space-y-1 text-xs text-slate-700">
            <p>
              <strong className="text-primary-text font-bold">Receiving Bank:</strong>{' '}
              {details.receivingBank}
            </p>
            <p>
              <strong className="text-primary-text font-bold">Account Name:</strong>{' '}
              {details.accountName}
            </p>
            <p>
              <strong className="text-primary-text font-bold">E-mail:</strong>{' '}
              {details.email}
            </p>
            <p>
              <strong className="text-primary-text font-bold">Address:</strong>{' '}
              {details.address}
            </p>
          </div>

          <hr className="border-t border-slate-300" />

          {/* Transaction Summary */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex flex-col space-y-1 text-xs text-slate-700">
              <p>
                <strong className="text-primary-text font-bold">Transaction ID :</strong>{' '}
                {details.transactionId}
              </p>
              <p>
                <strong className="text-primary-text font-bold">Amount:</strong>{' '}
                {details.amountFormatted}
              </p>
              <p>
                <strong className="text-primary-text font-bold">Amount in words:</strong>{' '}
                {details.amountInWords}
              </p>
            </div>

            <div className="text-right text-xs text-slate-700 self-end sm:self-auto">
              <p>
                <strong className="text-primary-text font-bold">Paying bank:</strong>{' '}
                {details.payingBank}
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
              {details.description}
            </p>
          </div>

          <hr className="border-t border-slate-300" />

          {/* Remarks Section */}
          <div className="flex flex-col space-y-2">
            <h4 className="text-xs sm:text-sm font-black text-primary-text tracking-wide uppercase">
              REMARKS:
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed text-justify">
              {details.remarks}
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
      </div>

      {/* Edit Payment Details Modal */}
      <EditPaymentDetailsModal
        key={isEditOpen ? `edit-${details.paymentId}` : 'edit-closed'}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        initialData={details}
        onUpdate={handleUpdate}
      />
    </OrgDashboardLayout>
  );
}
