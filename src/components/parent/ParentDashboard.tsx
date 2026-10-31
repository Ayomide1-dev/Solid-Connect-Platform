import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { formatNaira, ASSETS } from '../../lib/constants';
import type { Student, Parent, ReportCard, Invoice, PaymentReceipt, SchoolMessage, Announcement } from '../../types';
import { ReportCardModal } from '../common/ReportCardModal';
import { ReceiptModal } from '../fees/ReceiptModal';
import {
  GraduationCap,
  CalendarCheck,
  FileText,
  CreditCard,
  Send,
  Printer,
  CheckCircle2,
  AlertCircle,
  X,
  MessageSquare,
} from 'lucide-react';

export const ParentDashboard: React.FC = () => {
  const { currentUser, currentSchool } = useAuth();
  const [parent, setParent] = useState<Parent | null>(null);
  const [children, setChildren] = useState<Student[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [reportCards, setReportCards] = useState<ReportCard[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [messages, setMessages] = useState<SchoolMessage[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [selectedReportCard, setSelectedReportCard] = useState<ReportCard | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(null);
  const [isPayFeesModalOpen, setIsPayFeesModalOpen] = useState(false);
  const [selectedInvoiceToPay, setSelectedInvoiceToPay] = useState<Invoice | null>(null);

  // Enquiry modal
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquirySubject, setEnquirySubject] = useState('');
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquirySuccess, setEnquirySuccess] = useState('');

  // Payment form state
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentChannel, setPaymentChannel] = useState<'Paystack' | 'Flutterwave' | 'Bank Transfer'>('Paystack');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [allParents, allStudents, allReports, allInvoices, allReceipts, allMsg, allAnn] =
        await Promise.all([
          api.getParents(),
          api.getStudents(),
          api.getResults(),
          api.getInvoices(),
          api.getReceipts(),
          api.getMessages(),
          api.getAnnouncements(),
        ]);

      // Match current parent
      const matchedParent =
        allParents.find((p) => p.email.toLowerCase() === currentUser?.email.toLowerCase()) ||
        allParents[0];

      setParent(matchedParent);

      // Match children
      const linked = allStudents.filter((s) =>
        matchedParent?.linkedStudentIds?.includes(s.id) || s.parentId === matchedParent?.id
      );

      const finalChildren = linked.length > 0 ? linked : [allStudents[0]];
      setChildren(finalChildren);

      if (finalChildren.length > 0) {
        setSelectedChildId(finalChildren[0].id);
      }

      setReportCards(allReports.filter((r) => r.status === 'published'));
      setInvoices(allInvoices);
      setReceipts(allReceipts);
      setMessages(allMsg);
      setAnnouncements(allAnn);
    } catch (err) {
      console.error('Failed to load parent portal data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const activeChild = children.find((c) => c.id === selectedChildId) || children[0];
  const childReportCards = reportCards.filter((r) => r.studentId === activeChild?.id);
  const childInvoices = invoices.filter((i) => i.studentId === activeChild?.id);
  const childReceipts = receipts.filter((r) => r.studentId === activeChild?.id);

  const totalOutstanding = childInvoices.reduce((acc, curr) => acc + curr.balance, 0);

  const handlePayFees = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceToPay) return;

    setIsProcessingPayment(true);
    try {
      const generatedRef =
        paymentChannel === 'Paystack'
          ? `PSTK_LIVE_REF_${Date.now()}`
          : paymentChannel === 'Flutterwave'
          ? `FLW_TRX_${Date.now()}`
          : `ZENITH_NIP_${Date.now().toString().slice(-6)}`;

      const res = await api.processPayment({
        invoiceId: selectedInvoiceToPay.id,
        amount: paymentAmount,
        paymentMethod: paymentChannel,
        reference: generatedRef,
        payerName: parent?.name || currentUser?.name,
        notes: `School fee payment via ${paymentChannel} for ${selectedInvoiceToPay.term}`,
      });

      setIsPayFeesModalOpen(false);
      setSelectedReceipt(res.receipt);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Payment transaction failed');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleSendEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquirySubject || !enquiryMessage) return;

    try {
      await api.sendMessage({
        parentId: parent?.id || 'par_1',
        parentName: parent?.name || currentUser?.name || 'Parent',
        studentName: `${activeChild?.firstName} ${activeChild?.lastName}`,
        subject: enquirySubject,
        message: enquiryMessage,
      });

      setEnquirySuccess('Enquiry delivered to School Administration. You will be notified of responses.');
      setEnquirySubject('');
      setEnquiryMessage('');
      setTimeout(() => {
        setIsEnquiryModalOpen(false);
        setEnquirySuccess('');
      }, 2500);

      const refreshed = await api.getMessages();
      setMessages(refreshed);
    } catch (err: any) {
      alert(err.message || 'Failed to dispatch enquiry');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Child Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Parent & Guardian Portal</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Welcome, {parent?.name || currentUser?.name}. Monitor your child's academic growth and settlement of school fees.
          </p>
        </div>

        {/* Children Switcher Selector (if parent has multiple wards) */}
        {children.length > 0 && (
          <div className="flex items-center gap-2 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 px-2">Ward:</span>
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  selectedChildId === child.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {child.firstName} ({child.className})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Child Overview Hero Card */}
      {activeChild && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-200 uppercase tracking-wider">
                <span>{activeChild.className} {activeChild.arm}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{activeChild.admissionNo}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {activeChild.firstName} {activeChild.lastName} {activeChild.otherNames ? `(${activeChild.otherNames})` : ''}
              </h2>
              <p className="text-xs text-blue-100/90 leading-relaxed">
                Admitted: {activeChild.admissionDate} · Blood Group: {activeChild.bloodGroup || 'O+'} · Medical: {activeChild.medicalNotes || 'None'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setIsEnquiryModalOpen(true)}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-colors cursor-pointer backdrop-blur-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message School</span>
              </button>

              {totalOutstanding > 0 && (
                <button
                  onClick={() => {
                    const unpaid = childInvoices.find((i) => i.balance > 0);
                    if (unpaid) {
                      setSelectedInvoiceToPay(unpaid);
                      setPaymentAmount(unpaid.balance);
                      setIsPayFeesModalOpen(true);
                    }
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay School Fees</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Attendance */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Class Attendance Rate</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-slate-800 text-emerald-600">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            97%
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Active and punctual in lessons
          </div>
        </div>

        {/* Academic Performance */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Latest Term Results</span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
            {childReportCards[0] ? `${childReportCards[0].averageScore.toFixed(1)}%` : 'Pending'}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            {childReportCards[0]
              ? `Position: ${childReportCards[0].classPosition} of ${childReportCards[0].classTotalStudents}`
              : 'Term assessment in progress'}
          </div>
        </div>

        {/* Fees Status */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Outstanding School Fees</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-slate-800 text-amber-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums font-mono">
            {formatNaira(totalOutstanding)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            {totalOutstanding === 0 ? 'All fees settled for current term' : 'Term invoice pending balance'}
          </div>
        </div>
      </div>

      {/* Two Column Section: Academic Results & Fee Statements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Published Report Cards */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Published Termly Report Cards</span>
            </h2>
          </div>

          <div className="space-y-3">
            {childReportCards.length === 0 ? (
              <p className="text-xs text-slate-400 p-4 text-center">
                No official report cards published yet for this session.
              </p>
            ) : (
              childReportCards.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                      {rep.term} — {rep.session}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      Average: <strong className="text-blue-600">{rep.averageScore.toFixed(1)}%</strong> · Position:{' '}
                      <strong>{rep.classPosition} of {rep.classTotalStudents}</strong>
                    </div>
                    <p className="text-[11px] text-slate-500 italic line-clamp-1">
                      Principal: “{rep.principalComment}”
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedReportCard(rep)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>View Report</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Fee Statements & Receipts */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>School Fees Statement & Receipts</span>
          </h2>

          <div className="space-y-3">
            {childInvoices.map((inv) => {
              const rcpt = childReceipts.find((r) => r.invoiceId === inv.id);
              return (
                <div
                  key={inv.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        {inv.term} Tuition & Services
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">Due: {inv.dueDate}</div>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                        inv.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inv.status === 'partial'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total Billed:</span>
                      <span className="font-mono font-medium">{formatNaira(inv.totalAmount)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Amount Paid:</span>
                      <span className="font-mono font-medium text-emerald-600">
                        {formatNaira(inv.amountPaid)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Balance Due:</span>
                      <span className="font-mono font-bold text-amber-600">
                        {formatNaira(inv.balance)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    {rcpt && (
                      <button
                        onClick={() => setSelectedReceipt(rcpt)}
                        className="px-3 py-1 text-xs font-semibold text-slate-700 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Official Receipt</span>
                      </button>
                    )}
                    {inv.balance > 0 && (
                      <button
                        onClick={() => {
                          setSelectedInvoiceToPay(inv);
                          setPaymentAmount(inv.balance);
                          setIsPayFeesModalOpen(true);
                        }}
                        className="px-3.5 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                      >
                        Pay Balance ({formatNaira(inv.balance)})
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Message School Administration History */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>My Communication with School Administration</span>
          </h2>
          <button
            onClick={() => setIsEnquiryModalOpen(true)}
            className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
          >
            + New Enquiry
          </button>
        </div>

        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-2 text-xs"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{m.subject}</h3>
                <span className="text-[10px] text-slate-400 tabular-nums">
                  {new Date(m.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300">{m.message}</p>
              {m.reply && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-100 dark:border-blue-900 text-blue-900 dark:text-blue-200">
                  <div className="text-[10px] font-semibold uppercase text-blue-700 dark:text-blue-400 mb-0.5">
                    Official Response ({m.repliedBy}):
                  </div>
                  <p>{m.reply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pay Fees Modal with Paystack / Flutterwave Simulation */}
      {isPayFeesModalOpen && selectedInvoiceToPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Online School Fee Payment
                </h2>
                <p className="text-xs text-slate-500">
                  Secure checkout for {activeChild?.firstName} ({selectedInvoiceToPay.term})
                </p>
              </div>
              <button
                onClick={() => setIsPayFeesModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePayFees} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Payment Amount (NGN) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={selectedInvoiceToPay.balance}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Payment Provider / Gateway:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Paystack', 'Flutterwave', 'Bank Transfer'] as const).map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setPaymentChannel(ch)}
                      className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-colors cursor-pointer ${
                        paymentChannel === ch
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              {paymentChannel === 'Bank Transfer' && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs space-y-1 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase">
                    Direct Bank Transfer Details
                  </div>
                  <div>Bank: <strong>{currentSchool?.bankName || 'Zenith Bank PLC'}</strong></div>
                  <div>Account Name: <strong>{currentSchool?.bankAccountName || 'Crown Heights Int School'}</strong></div>
                  <div>Account Number: <strong className="font-mono text-blue-600">{currentSchool?.bankAccountNumber || '1014829384'}</strong></div>
                </div>
              )}

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <span>Total to Pay:</span>
                <span className="font-mono tabular-nums">{formatNaira(paymentAmount)}</span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPayFeesModalOpen(false)}
                  className="px-3 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{isProcessingPayment ? 'Processing Gateway...' : `Authorize ${formatNaira(paymentAmount)}`}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Enquiry Modal */}
      {isEnquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Send Enquiry to School Administration
              </h2>
              <button
                onClick={() => setIsEnquiryModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {enquirySuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{enquirySuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleSendEnquiry} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Subject / Concern *
                  </label>
                  <input
                    type="text"
                    required
                    value={enquirySubject}
                    onChange={(e) => setEnquirySubject(e.target.value)}
                    placeholder="e.g. Enquiry about School Bus Route or Science Competition"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={enquiryMessage}
                    onChange={(e) => setEnquiryMessage(e.target.value)}
                    placeholder="Write detailed question or note for the principal and academic office..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsEnquiryModalOpen(false)}
                    className="px-3 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Report Card Sheet Modal */}
      {selectedReportCard && (
        <ReportCardModal
          reportCard={selectedReportCard}
          school={currentSchool}
          onClose={() => setSelectedReportCard(null)}
        />
      )}

      {/* Payment Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal
          receipt={selectedReceipt}
          school={currentSchool}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
};
