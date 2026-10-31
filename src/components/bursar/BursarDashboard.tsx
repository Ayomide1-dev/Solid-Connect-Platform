import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { formatNaira } from '../../lib/constants';
import type { Invoice, PaymentReceipt, Student, ClassArm } from '../../types';
import { ReceiptModal } from '../fees/ReceiptModal';
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  Building2,
  X,
  ShieldCheck,
  Clock,
} from 'lucide-react';

export const BursarDashboard: React.FC = () => {
  const { currentUser, currentSchool } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassArm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState<'all' | 'unpaid' | 'partial' | 'paid'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);
  const [selectedReceiptForView, setSelectedReceiptForView] = useState<PaymentReceipt | null>(null);

  // New Invoice Form
  const [invoiceForm, setInvoiceForm] = useState({
    studentId: '',
    term: '1st Term',
    session: '2024/2025',
    dueDate: '2025-04-15',
    items: [
      { title: 'Tuition & Academic Instruction', amount: 260000 },
      { title: 'ICT & STEM Laboratory Practical', amount: 45000 },
      { title: 'Textbooks, Stationery & Workbooks', amount: 50000 },
      { title: 'PTA Development Levy', amount: 15000 },
      { title: 'Sports & Extra-Curricular Clubs', amount: 15000 },
    ],
  });

  // Payment Form
  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    paymentMethod: 'Paystack' as 'Paystack' | 'Flutterwave' | 'Bank Transfer' | 'Cash',
    reference: '',
    notes: '',
  });

  const [statusMessage, setStatusMessage] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [invList, rcptList, stdList, clsList] = await Promise.all([
        api.getInvoices(),
        api.getReceipts(),
        api.getStudents(),
        api.getClasses(),
      ]);
      setInvoices(invList);
      setReceipts(rcptList);
      setStudents(stdList);
      setClasses(clsList);

      if (stdList.length > 0 && !invoiceForm.studentId) {
        setInvoiceForm((prev) => ({ ...prev, studentId: stdList[0].id }));
      }
    } catch (err) {
      console.error('Failed to load bursary records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalInvoiced = invoices.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalCollected = invoices.reduce((acc, curr) => acc + curr.amountPaid, 0);
  const totalOutstanding = invoices.reduce((acc, curr) => acc + curr.balance, 0);
  const collectionRate =
    totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0;

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const std = students.find((s) => s.id === invoiceForm.studentId);
    if (!std) return;

    try {
      await api.createInvoice({
        studentId: std.id,
        studentName: `${std.firstName} ${std.lastName}`,
        admissionNo: std.admissionNo,
        classId: std.classId,
        className: `${std.className} ${std.arm}`,
        term: invoiceForm.term,
        session: invoiceForm.session,
        dueDate: invoiceForm.dueDate,
        items: invoiceForm.items,
        bursarId: currentUser?.id,
        bursarName: currentUser?.name,
      });

      setIsNewInvoiceModalOpen(false);
      setStatusMessage('Invoice issued successfully.');
      setTimeout(() => setStatusMessage(''), 4000);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create invoice');
    }
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceForPayment) return;

    try {
      const res = await api.processPayment({
        invoiceId: selectedInvoiceForPayment.id,
        amount: Number(paymentForm.amount),
        paymentMethod: paymentForm.paymentMethod,
        reference: paymentForm.reference,
        notes: paymentForm.notes,
        bursarId: currentUser?.id,
        bursarName: currentUser?.name,
      });

      setIsRecordPaymentModalOpen(false);
      setSelectedInvoiceForPayment(null);
      setSelectedReceiptForView(res.receipt);
      setStatusMessage('Payment verified and official receipt generated.');
      setTimeout(() => setStatusMessage(''), 4000);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Payment processing failed');
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = filterStatus === 'all' || inv.status === filterStatus;
    const matchesSearch =
      inv.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>School Fees, Invoicing & Bursary Portal</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage tuition billing, verify bank transfers, process Paystack/Flutterwave collections, and issue stamped receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewInvoiceModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Issue Fee Invoice</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="flex items-center gap-1.5 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Financial Overview KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Total Invoiced</span>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums font-mono mt-1">
            {formatNaira(totalInvoiced)}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">{invoices.length} active invoices</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            Total Fees Collected
          </span>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums font-mono mt-1">
            {formatNaira(totalCollected)}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">{collectionRate}% collection rate</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
            Outstanding Balance
          </span>
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400 tabular-nums font-mono mt-1">
            {formatNaira(totalOutstanding)}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Pending payment</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            Verified Receipts Issued
          </span>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400 tabular-nums font-mono mt-1">
            {receipts.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Audited official transactions</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search invoice by student name or admission number..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-full sm:w-auto">
          {(['all', 'unpaid', 'partial', 'paid'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors cursor-pointer ${
                filterStatus === st
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                <th className="p-3.5">Invoice ID</th>
                <th className="p-3.5">Student / Admission No</th>
                <th className="p-3.5">Class</th>
                <th className="p-3.5">Term</th>
                <th className="p-3.5 text-right font-mono">Total Billed</th>
                <th className="p-3.5 text-right font-mono">Paid</th>
                <th className="p-3.5 text-right font-mono">Balance</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    Loading invoices...
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    No fee invoices match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const receipt = receipts.find((r) => r.invoiceId === inv.id);
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                      <td className="p-3.5 font-mono text-slate-500 font-medium">{inv.id}</td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {inv.studentName}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {inv.admissionNo}
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-400">{inv.className}</td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-400">{inv.term}</td>
                      <td className="p-3.5 text-right font-mono tabular-nums text-slate-900 dark:text-slate-100">
                        {formatNaira(inv.totalAmount)}
                      </td>
                      <td className="p-3.5 text-right font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-semibold">
                        {formatNaira(inv.amountPaid)}
                      </td>
                      <td className="p-3.5 text-right font-mono tabular-nums text-amber-600 dark:text-amber-400 font-semibold">
                        {formatNaira(inv.balance)}
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                            inv.status === 'paid'
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                              : inv.status === 'partial'
                              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2 whitespace-nowrap">
                        {inv.balance > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedInvoiceForPayment(inv);
                              setPaymentForm({
                                amount: inv.balance,
                                paymentMethod: 'Bank Transfer',
                                reference: `ZENITH_NIP_${Date.now().toString().slice(-6)}`,
                                notes: `School fee payment for ${inv.term}`,
                              });
                              setIsRecordPaymentModalOpen(true);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                          >
                            Record Payment
                          </button>
                        )}
                        {receipt && (
                          <button
                            type="button"
                            onClick={() => setSelectedReceiptForView(receipt)}
                            className="p-1.5 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 rounded-md cursor-pointer"
                            title="View Stamped Official Receipt"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Invoice Modal */}
      {isNewInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Issue Termly School Fee Invoice
              </h2>
              <button
                onClick={() => setIsNewInvoiceModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Target Student *
                </label>
                <select
                  value={invoiceForm.studentId}
                  onChange={(e) =>
                    setInvoiceForm({ ...invoiceForm, studentId: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.admissionNo}) — {s.className} {s.arm}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Term
                  </label>
                  <select
                    value={invoiceForm.term}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, term: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1st Term">1st Term</option>
                    <option value="2nd Term">2nd Term</option>
                    <option value="3rd Term">3rd Term</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={invoiceForm.dueDate}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Fee Categories Breakdown */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Fee Schedule Line Items (NGN)
                </label>
                {invoiceForm.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const items = [...invoiceForm.items];
                        items[idx].title = e.target.value;
                        setInvoiceForm({ ...invoiceForm, items });
                      }}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) => {
                        const items = [...invoiceForm.items];
                        items[idx].amount = Number(e.target.value) || 0;
                        setInvoiceForm({ ...invoiceForm, items });
                      }}
                      className="w-28 px-3 py-1.5 text-xs font-mono tabular-nums text-right rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
                <span>Total Invoice Amount:</span>
                <span className="font-mono tabular-nums text-blue-600 dark:text-blue-400">
                  {formatNaira(
                    invoiceForm.items.reduce((acc, curr) => acc + (curr.amount || 0), 0)
                  )}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewInvoiceModalOpen(false)}
                  className="px-3 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
                >
                  Confirm & Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record / Verify Payment Modal */}
      {isRecordPaymentModalOpen && selectedInvoiceForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Record / Verify Fee Payment
                </h2>
                <p className="text-xs text-slate-500">
                  {selectedInvoiceForPayment.studentName} ({selectedInvoiceForPayment.admissionNo})
                </p>
              </div>
              <button
                onClick={() => setIsRecordPaymentModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">Outstanding Balance:</span>
              <span className="font-bold text-blue-700 dark:text-blue-300 font-mono tabular-nums">
                {formatNaira(selectedInvoiceForPayment.balance)}
              </span>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Amount to Credit (NGN) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={selectedInvoiceForPayment.balance}
                  value={paymentForm.amount}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Payment Method / Gateway Channel
                </label>
                <select
                  value={paymentForm.paymentMethod}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      paymentMethod: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Paystack">Paystack Online Payment</option>
                  <option value="Flutterwave">Flutterwave Gateway</option>
                  <option value="Bank Transfer">Direct Bank Transfer (Zenith Bank)</option>
                  <option value="Cash">Cash at Bursary Office</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Bank / Gateway Transaction Reference
                </label>
                <input
                  type="text"
                  required
                  value={paymentForm.reference}
                  onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                  placeholder="e.g. ZENITH_NIP_TRF_1298492"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRecordPaymentModalOpen(false)}
                  className="px-3 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
                >
                  Verify & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stamped Receipt Viewer Modal */}
      {selectedReceiptForView && (
        <ReceiptModal
          receipt={selectedReceiptForView}
          school={currentSchool}
          onClose={() => setSelectedReceiptForView(null)}
        />
      )}
    </div>
  );
};
