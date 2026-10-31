import React from 'react';
import type { PaymentReceipt, School } from '../../types';
import { formatNaira, ASSETS } from '../../lib/constants';
import { X, Printer, CheckCircle, ShieldCheck } from 'lucide-react';

interface ReceiptModalProps {
  receipt: PaymentReceipt;
  school: School | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, school, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white text-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Top Control Bar (hidden in print) */}
        <div className="no-print p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official Bursary Payment Receipt</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Stamped Official Receipt Sheet */}
        <div className="p-8 space-y-6 bg-white font-sans">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
            <div className="flex items-center gap-3">
              <img
                src={school?.logo || ASSETS.logo}
                alt="School Crest"
                className="w-14 h-14 object-contain rounded-md border border-slate-200 p-0.5"
                referrerPolicy="no-referrer"
              />
              <div>
                <h1 className="text-base font-black text-slate-900 uppercase tracking-tight">
                  {school?.name || 'Crown Heights International School'}
                </h1>
                <p className="text-[10px] text-slate-500">{school?.address}</p>
                <p className="text-[10px] text-slate-500">Bursary Department · Fee Receipt</p>
              </div>
            </div>
          </div>

          {/* Receipt Number & Date */}
          <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Receipt Number:</span>
              <span className="font-mono font-bold text-blue-900">{receipt.receiptNumber}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase block">Date & Time:</span>
              <span className="font-mono text-slate-700">
                {new Date(receipt.paidAt).toLocaleString('en-NG')}
              </span>
            </div>
          </div>

          {/* Student & Payment Details */}
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Received From (Student):</span>
              <span className="font-bold text-slate-900">{receipt.studentName}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Admission Number:</span>
              <span className="font-mono text-slate-800">{receipt.admissionNo}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Class & Arm:</span>
              <span className="font-medium text-slate-800">{receipt.className}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Payment Gateway / Channel:</span>
              <span className="font-semibold text-slate-800">{receipt.paymentMethod}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Transaction Reference:</span>
              <span className="font-mono text-slate-700 text-[11px]">{receipt.reference}</span>
            </div>
            <div className="flex justify-between py-2 bg-emerald-50 px-3 rounded-lg border border-emerald-200">
              <span className="text-emerald-800 font-bold">Amount Paid (NGN):</span>
              <span className="text-base font-extrabold text-emerald-800 tabular-nums font-mono">
                {formatNaira(receipt.amount)}
              </span>
            </div>
          </div>

          {receipt.notes && (
            <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-md border border-slate-100">
              Description: {receipt.notes}
            </p>
          )}

          {/* Bursar Official Verification Stamp */}
          <div className="pt-6 border-t-2 border-dashed border-slate-300 flex items-center justify-between text-xs">
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Authorized Bursar Signatory:</p>
              <p className="font-semibold text-slate-800">{receipt.verifiedBy || 'Bursar Office'}</p>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Verified & Credited to School Account</span>
              </div>
            </div>

            {/* Simulated Official Rubber Stamp */}
            <div className="border-2 border-emerald-600 text-emerald-700 p-2 rounded-lg text-center transform -rotate-3 text-[10px] font-black uppercase tracking-wider">
              <div>CROWN HEIGHTS BURSARY</div>
              <div className="text-xs">PAID & VERIFIED</div>
              <div>LAGOS, NIGERIA</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
