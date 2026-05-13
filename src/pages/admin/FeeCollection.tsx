/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Printer, 
  MessageCircle, 
  User, 
  History,
  Plus,
  Send,
  X,
  FileText,
  Clock,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Student, FeePayment } from '../../types';

export const FeeCollection = () => {
  const { students, feePayments, feeStructures, addFeePayment, businessProfile } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState<FeePayment | null>(null);
  const [receiptType, setReceiptType] = useState<'SINGLE' | 'HISTORY'>('SINGLE');
  
  const [paymentData, setPaymentData] = useState({
    heads: [{ type: '', amount: 0, discount: 0, penalty: 0 }],
    paymentModes: [{ mode: 'Cash', amount: 0, transactionId: '' }],
    remarks: ''
  });

  const totalPayable = paymentData.heads.reduce((acc, h) => acc + (h.amount + h.penalty - h.discount), 0);
  const totalPaidInModes = paymentData.paymentModes.reduce((acc, m) => acc + m.amount, 0);

  const filteredStudents = searchTerm.length > 2 
    ? students.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setSearchTerm('');
  };

  const addHead = () => {
    setPaymentData({
      ...paymentData,
      heads: [...paymentData.heads, { type: '', amount: 0, discount: 0, penalty: 0 }]
    });
  };

  const removeHead = (index: number) => {
    if (paymentData.heads.length > 1) {
      const newHeads = [...paymentData.heads];
      newHeads.splice(index, 1);
      setPaymentData({ ...paymentData, heads: newHeads });
    }
  };

  const addPaymentMode = () => {
    setPaymentData({
      ...paymentData,
      paymentModes: [...paymentData.paymentModes, { mode: 'Cash', amount: 0, transactionId: '' }]
    });
  };

  const removePaymentMode = (index: number) => {
    if (paymentData.paymentModes.length > 1) {
      const newModes = [...paymentData.paymentModes];
      newModes.splice(index, 1);
      setPaymentData({ ...paymentData, paymentModes: newModes });
    }
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    if (totalPaidInModes === 0) {
      alert('Paid amount cannot be zero');
      return;
    }

    const subTotalAmount = paymentData.heads.reduce((acc, h) => acc + h.amount, 0);
    const subTotalDiscount = paymentData.heads.reduce((acc, h) => acc + h.discount, 0);
    const subTotalPenalty = paymentData.heads.reduce((acc, h) => acc + h.penalty, 0);
    const balance = totalPayable - totalPaidInModes;
    
    const newPayment: FeePayment = {
      id: `p${Date.now()}`,
      studentId: selectedStudent.id,
      receiptNo: `RCPT${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      feeType: paymentData.heads.map(h => h.type).filter(Boolean).join(', '),
      heads: paymentData.heads,
      amount: subTotalAmount,
      discount: subTotalDiscount,
      penalty: subTotalPenalty,
      paidAmount: totalPaidInModes,
      balance: balance > 0 ? balance : 0,
      paymentMode: paymentData.paymentModes.map(m => m.mode).join(' + '),
      paymentModes: paymentData.paymentModes,
      status: balance <= 0 ? 'Paid' : (totalPaidInModes > 0 ? 'Partial' : 'Pending'),
      remarks: paymentData.remarks
    };

    addFeePayment(newPayment);
    setShowPaymentModal(false);
    setShowReceipt(newPayment);
    
    // Reset form
    setPaymentData({
      heads: [{ type: '', amount: 0, discount: 0, penalty: 0 }],
      paymentModes: [{ mode: 'Cash', amount: 0, transactionId: '' }],
      remarks: ''
    });
  };

  const numberToWords = (num: number): string => {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if ((num = num.toString().split('.')[0] as any) > 999999999) return 'overflow';
    let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';
    let str = '';
    str += (Number(n[1]) != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (Number(n[2]) != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (Number(n[3]) != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Hundred ' : '';
    str += (Number(n[4]) != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Only ' : '';
    return str || 'Zero Only';
  };

  const sendWhatsAppReminder = (student: Student, type: 'DUE' | 'UPCOMING') => {
    const totalPaid = feePayments.filter(p => p.studentId === student.id).reduce((acc, p) => acc + p.paidAmount, 0);
    const totalDue = student.totalFees - totalPaid;
    
    let message = '';
    if (type === 'DUE') {
      message = `*FEE REMINDER - SOFTDEV TALLY GURU*\n\nHello *${student.name}* (ID: ${student.admissionNo}), this is a reminder regarding your pending fees of *₹${totalDue}* for the course *${student.course}*. Please clear your dues at the earliest to avoid late penalties.\n\n_Your progress is our purpose._`;
    } else {
      message = `*UPCOMING FEE NOTIFICATION*\n\nHello *${student.name}*, your next installment for your course *${student.course}* is approaching. Balance to be paid: *₹${totalDue}*. Kindly keep the payment ready. Thank you!`;
    }
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/91${student.contact.replace(/\D/g, '')}?text=${encodedMessage}`, '_blank');
  };

  const sendWhatsAppReceipt = (payment: FeePayment, student: Student) => {
    const totalPaid = feePayments.filter(p => p.studentId === student.id).reduce((acc, p) => acc + p.paidAmount, 0);
    const finalBalance = student.totalFees - totalPaid;
    
    const message = `*PAYMENT SUCCESSFUL - SOFTDEV TALLY GURU*\n\nDear *${student.name}*,\nThank you for your payment of *₹${payment.paidAmount}* via *${payment.paymentMode}* ${payment.transactionId ? `(Ref: ${payment.transactionId})` : ''}.\n\n*Receipt Details:*\nReceipt No: ${payment.receiptNo}\nFee Type: ${payment.feeType}\nBalance Due: ₹${finalBalance}\n\nDownload full receipt from portal or contact office. Thank you!`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/91${student.contact.replace(/\D/g, '')}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-3xl font-black text-[#141414] tracking-tight uppercase">Fee Collection</h1>
          <p className="text-sm text-[#888888] font-mono">Process student fees, generate receipts and manage dues</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Student Search & Selection */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-[#888888]">Find Student</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Name or Admission No..."
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
              />
            </div>
            
            <AnimatePresence>
              {searchTerm.length > 2 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden"
                >
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map(s => (
                      <button 
                        key={s.id}
                        onClick={() => handleSelectStudent(s)}
                        className="w-full p-4 flex items-center space-x-3 hover:bg-blue-50 text-left transition-colors border-b border-gray-50 last:border-0"
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-[#141414] uppercase">{s.name}</p>
                          <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest">{s.admissionNo}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">No matching results</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {selectedStudent && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#141414] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStudent.name}`} alt="" className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight">{selectedStudent.name}</h3>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">ID: {selectedStudent.admissionNo}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/5 rounded-2xl">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Course</p>
                    <p className="text-[11px] font-bold text-white truncate">{selectedStudent.course}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-2xl">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Admission No</p>
                    <p className="text-[11px] font-bold text-white uppercase">{selectedStudent.admissionNo}</p>
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-2">
                    <button 
                      onClick={() => setShowPaymentModal(true)}
                      className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center space-x-2"
                    >
                      <Plus size={16} />
                      <span>Post New Payment</span>
                    </button>
                    <div className="grid grid-cols-1">
                      <button 
                         onClick={() => {
                           const studentPayments = feePayments.filter(p => p.studentId === selectedStudent.id);
                           if (studentPayments.length > 0) {
                             setReceiptType('HISTORY');
                             setShowReceipt(studentPayments[studentPayments.length - 1]);
                           } else {
                             alert('No payment history found for this student.');
                           }
                         }}
                         className="w-full py-3 bg-gray-100 text-[#141414] rounded-2xl text-[8px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center space-x-2 border border-black/5"
                      >
                         <Printer size={14} />
                         <span>Print Payment History</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => sendWhatsAppReminder(selectedStudent, 'DUE')}
                      className="py-3 bg-emerald-600 text-white rounded-2xl text-[8px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center space-x-2"
                    >
                      <MessageCircle size={14} />
                      <span>Reminder</span>
                    </button>
                    <button 
                      onClick={() => setSelectedStudent(null)}
                      className="py-3 bg-white/10 text-white rounded-2xl text-[8px] font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center space-x-2 border border-white/5"
                    >
                      <X size={14} />
                      <span>Clear Selection</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column: Deposited Fee & Receipts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <History className="text-blue-600" size={20} />
                <h2 className="text-sm font-black text-[#141414] uppercase tracking-widest">Recent Payments</h2>
              </div>
              <button className="px-4 py-2 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-[#888888] rounded-xl hover:bg-gray-100">View All</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-8 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest">Receipt</th>
                    <th className="px-8 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest">Student</th>
                    <th className="px-8 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest">Fee Type</th>
                    <th className="px-8 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest">Paid</th>
                    <th className="px-8 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest">Balance</th>
                    <th className="px-8 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {feePayments.filter(p => !selectedStudent || p.studentId === selectedStudent.id).slice().reverse().map(payment => {
                    const student = students.find(s => s.id === payment.studentId);
                    return (
                      <tr key={payment.id} className="hover:bg-blue-50/20 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-[#141414] uppercase tracking-tighter">{payment.receiptNo}</span>
                            <span className="text-[8px] font-black text-gray-400 uppercase">{payment.date}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 font-bold text-[10px] text-blue-600 uppercase tracking-tight">{student?.name || 'Unknown'}</td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 bg-gray-50 text-[8px] font-black uppercase tracking-widest rounded-full">{payment.feeType}</span>
                        </td>
                        <td className="px-8 py-6 text-xs font-black text-emerald-600">₹{payment.paidAmount.toLocaleString()}</td>
                        <td className="px-8 py-6 text-xs font-black text-red-600">₹{payment.balance.toLocaleString()}</td>
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-center space-x-2">
                             <button 
                               onClick={() => {
                                 setReceiptType('SINGLE');
                                 setShowReceipt(payment);
                               }}
                               className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all"
                             >
                               <Printer size={16} />
                             </button>
                             <button 
                               onClick={() => student && sendWhatsAppReceipt(payment, student)}
                               className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-white rounded-lg transition-all"
                             >
                               <MessageCircle size={16} />
                             </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {(feePayments.length === 0 || (selectedStudent && feePayments.filter(p => p.studentId === selectedStudent.id).length === 0)) && (
                <div className="p-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                    <History size={32} />
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No payment records found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-8 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#141414] uppercase tracking-tighter text-blue-600">Collect Student Fee</h2>
                  <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Processing payment for {selectedStudent.name}</p>
                </div>
                <button onClick={() => setShowPaymentModal(false)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-all shadow-sm">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handlePayment} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {/* Fee Heads Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest tracking-widest">Fee Heads / Categories</h3>
                    <button type="button" onClick={addHead} className="text-[10px] font-black text-blue-600 uppercase flex items-center space-x-1 hover:underline">
                      <Plus size={12} />
                      <span>Add Head</span>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {paymentData.heads.map((head, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-2xl relative group">
                        <div className="md:col-span-1 space-y-1">
                          <label className="text-[8px] font-black text-[#888888] uppercase tracking-widest">Type</label>
                          <select 
                            required
                            value={head.type}
                            onChange={(e) => {
                              const newHeads = [...paymentData.heads];
                              newHeads[idx].type = e.target.value;
                              setPaymentData({ ...paymentData, heads: newHeads });
                            }}
                            className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-600 font-bold text-[10px]"
                          >
                            <option value="">Select Category</option>
                            {feeStructures.map(f => <option key={f.id} value={f.head}>{f.head}</option>)}
                            <option value="Admission Fee">Admission Fee</option>
                            <option value="Monthly Fee">Monthly Fee</option>
                            <option value="Exam Fee">Exam Fee</option>
                            <option value="Registration Fee">Registration Fee</option>
                            <option value="Certificate Fee">Certificate Fee</option>
                            <option value="Late Penalty">Late Penalty</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-[#888888] uppercase tracking-widest">Base Fee (₹)</label>
                          <input 
                            type="number"
                            required
                            value={head.amount}
                            onChange={(e) => {
                              const newHeads = [...paymentData.heads];
                              newHeads[idx].amount = Number(e.target.value);
                              setPaymentData({ ...paymentData, heads: newHeads });
                            }}
                            className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none font-bold text-[10px]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Disc (₹)</label>
                          <input 
                            type="number"
                            value={head.discount}
                            onChange={(e) => {
                              const newHeads = [...paymentData.heads];
                              newHeads[idx].discount = Number(e.target.value);
                              setPaymentData({ ...paymentData, heads: newHeads });
                            }}
                            className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none font-bold text-[10px] text-emerald-600"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-red-500 uppercase tracking-widest">Pen (₹)</label>
                          <div className="flex items-center space-x-2">
                             <input 
                                type="number"
                                value={head.penalty}
                                onChange={(e) => {
                                  const newHeads = [...paymentData.heads];
                                  newHeads[idx].penalty = Number(e.target.value);
                                  setPaymentData({ ...paymentData, heads: newHeads });
                                }}
                                className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none font-bold text-[10px] text-red-600"
                             />
                             {paymentData.heads.length > 1 && (
                                <button type="button" onClick={() => removeHead(idx)} className="p-1 text-gray-300 hover:text-red-500 transition-colors">
                                   <X size={14} />
                                </button>
                             )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Modes Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest tracking-widest">Payment Modes / Transactions</h3>
                    <div className="flex items-center space-x-4">
                       <p className="text-[10px] font-black text-[#141414] uppercase">Total Payable: <span className="text-blue-600">₹{totalPayable.toLocaleString()}</span></p>
                       <button type="button" onClick={addPaymentMode} className="text-[10px] font-black text-emerald-600 uppercase flex items-center space-x-1 hover:underline">
                         <Plus size={12} />
                         <span>Add Mode</span>
                       </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {paymentData.paymentModes.map((pm, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-emerald-50/30 rounded-2xl relative border border-emerald-100/50">
                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-[#888888] uppercase tracking-widest">Mode</label>
                          <select 
                            value={pm.mode}
                            onChange={(e) => {
                              const newModes = [...paymentData.paymentModes];
                              newModes[idx].mode = e.target.value;
                              setPaymentData({ ...paymentData, paymentModes: newModes });
                            }}
                            className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-emerald-600 font-bold text-[10px]"
                          >
                            <option>Cash</option>
                            <option>UPI / Online</option>
                            <option>Bank Transfer</option>
                            <option>Check</option>
                            <option>Card</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-[8px] font-black text-[#888888] uppercase tracking-widest">Paid (₹)</label>
                            {idx === 0 && (
                               <button 
                                  type="button" 
                                  onClick={() => {
                                     const newModes = [...paymentData.paymentModes];
                                     newModes[0].amount = totalPayable;
                                     setPaymentData({ ...paymentData, paymentModes: newModes });
                                  }}
                                  className="text-[7px] font-black text-emerald-600 uppercase hover:underline"
                               >Set Remaining</button>
                            )}
                          </div>
                          <input 
                            type="number"
                            required
                            value={pm.amount}
                            onChange={(e) => {
                              const newModes = [...paymentData.paymentModes];
                              newModes[idx].amount = Number(e.target.value);
                              setPaymentData({ ...paymentData, paymentModes: newModes });
                            }}
                            className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none font-bold text-[10px] text-blue-600"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-[#888888] uppercase tracking-widest">Transaction Ref</label>
                          <div className="flex items-center space-x-2">
                             <input 
                                type="text"
                                value={pm.transactionId}
                                onChange={(e) => {
                                  const newModes = [...paymentData.paymentModes];
                                  newModes[idx].transactionId = e.target.value;
                                  setPaymentData({ ...paymentData, paymentModes: newModes });
                                }}
                                placeholder="TXN ID / CHQ NO"
                                className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none font-bold text-[10px]"
                             />
                             {paymentData.paymentModes.length > 1 && (
                                <button type="button" onClick={() => removePaymentMode(idx)} className="p-1 text-gray-300 hover:text-red-500 transition-colors">
                                   <X size={14} />
                                </button>
                             )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-between">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Total Summary</p>
                      <p className="text-xl font-black text-[#141414]">₹{totalPayable.toLocaleString()} <span className="text-[10px] font-bold text-[#888888] align-middle">TOTAL DUE</span></p>
                   </div>
                   <div className="text-right space-y-1">
                      <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Total Paid</p>
                      <p className="text-xl font-black text-emerald-600">₹{totalPaidInModes.toLocaleString()}</p>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[9px] font-black text-[#888888] uppercase tracking-widest ml-1">Remarks</label>
                   <textarea 
                     value={paymentData.remarks}
                     onChange={(e) => setPaymentData({...paymentData, remarks: e.target.value})}
                     className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-sm"
                     placeholder="Additional notes about this payment..."
                     rows={2}
                   />
                </div>

                <div className="pt-6 grid grid-cols-2 gap-4">
                  <button 
                    type="button" 
                    onClick={() => setShowPaymentModal(false)}
                    className="py-4 bg-gray-100 text-[#141414] text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-all"
                  >
                    DISCARD
                  </button>
                  <button 
                    type="submit" 
                    className="py-4 bg-[#141414] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-black/20 flex items-center justify-center space-x-3"
                  >
                     <Send size={18} />
                     <span>Finalize Receipt</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Receipt Modal (Print View Overlay) */}
      <AnimatePresence>
        {showReceipt && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10 bg-black/60 backdrop-blur-md overflow-y-auto pt-20 pb-20">
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="bg-white rounded-[2rem] w-full max-w-4xl p-0 shadow-2xl relative my-auto min-h-max"
            >
                <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between z-10 rounded-t-[2rem]">
                   <h3 className="text-sm font-black text-[#141414] uppercase tracking-widest">
                     {receiptType === 'SINGLE' ? 'Fee Receipt Preview' : 'Payment History Statement'}
                   </h3>
                   <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => {
                        const student = students.find(s => s.id === showReceipt.studentId);
                        if (student) sendWhatsAppReceipt(showReceipt, student);
                      }}
                      className="px-6 py-2 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all flex items-center space-x-2"
                    >
                      <MessageCircle size={14} />
                      <span>WhatsApp</span>
                    </button>
                    <button 
                      onClick={() => window.print()}
                      className="px-6 py-2 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all flex items-center space-x-2"
                    >
                      <Printer size={14} />
                      <span>Print Receipt</span>
                    </button>
                    <button onClick={() => setShowReceipt(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-all"><X size={20} /></button>
                  </div>
               </div>

               {/* Receipt Layout */}
               <div className="p-12 relative print:p-0" id="printable-receipt">
                  <div className="border-[3px] border-black relative bg-white overflow-hidden max-w-[210mm] mx-auto print:border-0 print:max-w-none">
                     {/* Watermark */}
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.08] select-none z-0 overflow-hidden">
                        <div className="flex flex-col items-center rotate-[-35deg] scale-125">
                           {businessProfile.logoUrl ? (
                             <img src={businessProfile.logoUrl} alt="" className="w-80 h-80 object-contain grayscale brightness-90 contrast-125" />
                           ) : (
                             <GraduationCap size={300} className="text-gray-400" />
                           )}
                           <h1 className="text-[5rem] font-black whitespace-nowrap uppercase text-gray-400 -mt-12 tracking-tighter">{businessProfile.name}</h1>
                        </div>
                     </div>

                     <div className="relative z-10 w-full bg-white/40">
                        {/* Header Selection: Custom Header Image takes precedence */}
                        {businessProfile.headerImageUrl ? (
                          <div className="w-full">
                            <img 
                              src={businessProfile.headerImageUrl} 
                              alt="Institute Header" 
                              className="w-full h-auto object-contain border-b-2 border-black block"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ) : businessProfile.banners && businessProfile.banners.length > 0 ? (
                          <div className="w-full">
                           <img 
                             src={businessProfile.banners[0]} 
                             alt="Institute Banner" 
                             className="w-full h-auto object-contain border-b-2 border-black block"
                             referrerPolicy="no-referrer"
                           />
                        </div>
                     ) : businessProfile.logoUrl ? (
                        <div className="p-8 pb-0">
                           <div className="flex items-center space-x-6 border-b-2 border-black pb-6 w-full">
                              <img 
                                 src={businessProfile.logoUrl} 
                                 alt="Logo" 
                                 className="w-28 h-28 object-contain" 
                                 referrerPolicy="no-referrer" 
                              />
                              <div className="text-left flex-1">
                                 <h1 className="text-3xl font-black uppercase tracking-tighter text-[#141414] leading-tight">
                                    {businessProfile.name}
                                 </h1>
                                 <p className="text-[10px] font-bold text-gray-600 uppercase mt-1">
                                    {businessProfile.legalName}
                                 </p>
                                 <div className="mt-2 space-y-0.5">
                                    <p className="text-[9px] font-medium text-gray-500 uppercase flex items-center">
                                       <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-1.5"></span>
                                       {businessProfile.address}
                                    </p>
                                    <p className="text-[9px] font-medium text-gray-500 uppercase flex items-center">
                                       <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-1.5"></span>
                                       Email: {businessProfile.email} | web: {businessProfile.website}
                                    </p>
                                    <p className="text-[9px] font-bold text-blue-600 uppercase mt-1 tracking-widest">
                                       Reg No: {businessProfile.regNo} | ISO {businessProfile.isoNo}
                                    </p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ) : (
                        <div className="p-8 pb-0">
                           <div className="w-full h-24 bg-gray-50 border-2 border-black flex items-center justify-center">
                              <h1 className="text-2xl font-black uppercase tracking-widest">{businessProfile.name}</h1>
                           </div>
                        </div>
                     )}

                     <div className="p-8 pt-6">
                        <div className="bg-gray-100 p-2 text-center border-y-2 border-black mb-6">
                           <h2 className="text-sm font-black uppercase tracking-widest underline decoration-2 underline-offset-4">
                             {receiptType === 'SINGLE' ? 'FEE RECEIPT' : 'PAYMENT HISTORY / STATEMENT'}
                           </h2>
                        </div>

                     {/* Info Grid */}
                     <div className="grid grid-cols-2 divide-x-2 divide-black border-2 border-black mb-6">
                        <div className="divide-y-2 divide-black">
                           <div className="grid grid-cols-2 divide-x-2 divide-black h-10">
                              <div className="px-4 flex items-center text-[9px] font-black bg-blue-50">Branch / Franchise</div>
                              <div className="px-4 flex items-center text-[9px] font-bold uppercase">{students.find(s => s.id === showReceipt.studentId)?.studyCenter}</div>
                           </div>
                           <div className="grid grid-cols-2 divide-x-2 divide-black h-10">
                              <div className="px-4 flex items-center text-[9px] font-black bg-blue-50">Admission Date</div>
                              <div className="px-4 flex items-center text-[9px] font-bold uppercase">{students.find(s => s.id === showReceipt.studentId)?.admissionDate}</div>
                           </div>
                           <div className="grid grid-cols-2 divide-x-2 divide-black h-10">
                              <div className="px-4 flex items-center text-[9px] font-black bg-blue-50">Course (Duration)</div>
                              <div className="px-4 flex items-center text-[9px] font-bold uppercase truncate">
                                 {(() => {
                                   const s = students.find(st => st.id === showReceipt.studentId);
                                   return `${s?.course} (${s?.courseDuration})`;
                                 })()}
                              </div>
                           </div>
                           <div className="grid grid-cols-2 divide-x-2 divide-black h-10">
                              <div className="px-4 flex items-center text-[9px] font-black bg-blue-50">Mobile</div>
                              <div className="px-4 flex items-center text-[9px] font-bold">{students.find(s => s.id === showReceipt.studentId)?.contact}</div>
                           </div>
                        </div>
                        <div className="divide-y-2 divide-black">
                           <div className="grid grid-cols-2 divide-x-2 divide-black h-10">
                              <div className="px-4 flex items-center text-[9px] font-black bg-blue-50">Receipt No</div>
                              <div className="px-4 flex items-center text-[9px] font-bold uppercase">{showReceipt.receiptNo}</div>
                           </div>
                           <div className="grid grid-cols-2 divide-x-2 divide-black h-10">
                              <div className="px-4 flex items-center text-[9px] font-black bg-blue-50">Date</div>
                              <div className="px-4 flex items-center text-[9px] font-bold">{showReceipt.date}</div>
                           </div>
                           <div className="grid grid-cols-2 divide-x-2 divide-black h-10">
                              <div className="px-4 flex items-center text-[9px] font-black bg-blue-50">Student Name</div>
                              <div className="px-4 flex items-center text-[9px] font-bold uppercase">{students.find(s => s.id === showReceipt.studentId)?.name}</div>
                           </div>
                           <div className="grid grid-cols-2 divide-x-2 divide-black h-10">
                              <div className="px-4 flex items-center text-[9px] font-black bg-blue-50">Father Name</div>
                              <div className="px-4 flex items-center text-[9px] font-bold uppercase">{students.find(s => s.id === showReceipt.studentId)?.fatherName}</div>
                           </div>
                           <div className="grid grid-cols-2 divide-x-2 divide-black h-10">
                              <div className="px-4 flex items-center text-[9px] font-black bg-blue-50">Enrollment No</div>
                              <div className="px-4 flex items-center text-[9px] font-bold uppercase">{students.find(s => s.id === showReceipt.studentId)?.enrollmentNo}</div>
                           </div>
                        </div>
                     </div>

                      {/* Fees Summary Table */}
                      <div className="mb-6">
                         <div className="bg-blue-600 text-white px-4 py-2 flex items-center space-x-2 mb-2">
                            <FileText size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                               {receiptType === 'SINGLE' ? 'CURRENT PAYMENT DETAILS' : 'FULL PAYMENT HISTORY'}
                            </span>
                         </div>
                         <table className="w-full border-2 border-black text-center text-[9px]">
                            <thead>
                               <tr className="bg-blue-50 divide-x-2 divide-black border-b-2 border-black">
                                  <th className="py-2">#</th>
                                  {receiptType === 'HISTORY' && <th className="py-2">Receipt No</th>}
                                  <th className="py-2">Fees Type / Head</th>
                                  <th className="py-2">Amount</th>
                                  <th className="py-2">Discount</th>
                                  <th className="py-2">Penalty</th>
                                  <th className="py-2">Sub-Total</th>
                                  <th className="py-2 font-black text-blue-600">Paid Amt</th>
                                  <th className="py-2">Status</th>
                                  <th className="py-2">Date</th>
                                  <th className="py-2">Status</th>
                                  <th className="py-2">Date</th>
                               </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-black font-bold">
                               {receiptType === 'SINGLE' ? (
                                  <>
                                  {(showReceipt.heads && showReceipt.heads.length > 0 ? showReceipt.heads : [{ type: showReceipt.feeType, amount: showReceipt.amount, discount: showReceipt.discount, penalty: showReceipt.penalty }]).map((h, idx) => (
                                     <tr key={idx} className="divide-x-2 divide-black">
                                        <td className="py-2">{idx + 1}</td>
                                        <td className="py-2 uppercase">{h.type}</td>
                                        <td className="py-2">₹{h.amount}</td>
                                        <td className="py-2">₹{h.discount}</td>
                                        <td className="py-2">₹{h.penalty}</td>
                                        <td className="py-2">₹{h.amount + h.penalty - h.discount}</td>
                                        <td className="py-2 text-emerald-600">{showReceipt.status}</td>
                                        <td className="py-2 bg-blue-50 font-black">
                                           {idx === 0 ? `₹${showReceipt.paidAmount}` : '--'}
                                        </td>
                                        <td className="py-2">{showReceipt.date}</td>
                                     </tr>
                                  ))}
                                  </>
                               ) : (
                                 feePayments.filter(p => p.studentId === showReceipt.studentId).map((hp, idx) => (
                                    <tr key={hp.id} className="divide-x-2 divide-black">
                                       <td className="py-2">{idx + 1}</td>
                                       <td className="py-2 uppercase">{hp.receiptNo}</td>
                                       <td className="py-2 uppercase">{hp.feeType}</td>
                                       <td className="py-2">₹{hp.amount}</td>
                                       <td className="py-2">₹{hp.discount}</td>
                                       <td className="py-2">₹{hp.penalty}</td>
                                       <td className="py-2">₹{hp.amount + hp.penalty - hp.discount}</td>
                                       <td className="py-2 bg-blue-50 font-black text-blue-600">₹{hp.paidAmount}</td>
                                       <td className="py-2 text-emerald-600 font-bold">{hp.status}</td>
                                       <td className="py-2">{hp.date}</td>
                                       <td className="py-2 uppercase">{hp.paymentMode}</td>
                                       
                                    </tr>
                                 ))
                               )}
                            </tbody>
                         </table>
                      </div>

                      {receiptType === 'SINGLE' && (
                        <div className="mb-6">
                            <div className="bg-blue-600 text-white px-4 py-2 inline-flex items-center space-x-2 mb-2 rounded-lg">
                              <History size={14} />
                              <span className="text-[9px] font-black uppercase tracking-widest">Previous Deposited Fee</span>
                            </div>
                            <table className="w-full border-2 border-black text-center text-[9px]">
                               <thead>
                                  <tr className="bg-emerald-600 text-white divide-x-2 divide-black border-b-2 border-black">
                                     <th className="py-2">Receipt No</th>
                                     <th className="py-2">Fee Type</th>
                                     <th className="py-2">Amount</th>
                                     <th className="py-2">Mode</th>
                                     <th className="py-2">Date</th>
                                  </tr>
                               </thead>
                               <tbody className="divide-y-2 divide-black font-bold">
                                  {feePayments
                                    .filter(p => p.studentId === showReceipt.studentId && p.id !== showReceipt.id)
                                    .slice(-3)
                                    .map(p => (
                                    <tr key={p.id} className="divide-x-2 divide-black">
                                       <td className="py-2 uppercase">{p.receiptNo}</td>
                                       <td className="py-2 uppercase">{p.feeType}</td>
                                       <td className="py-2">₹{p.paidAmount}</td>
                                       <td className="py-2">{p.paymentMode}</td>
                                       <td className="py-2">{p.date}</td>
                                    </tr>
                                  ))}
                               </tbody>
                            </table>
                        </div>
                      )}

                                             {receiptType === 'SINGLE' && showReceipt.paymentModes && showReceipt.paymentModes.length > 0 && (
                          <div className="mb-6">
                             <div className="bg-emerald-600 text-white px-4 py-2 inline-flex items-center space-x-2 mb-2 rounded-lg">
                               <Plus size={14} />
                               <span className="text-[9px] font-black uppercase tracking-widest">Transaction Details (Modes)</span>
                             </div>
                             <table className="w-full border-2 border-black text-center text-[9px]">
                                <thead>
                                   <tr className="bg-emerald-50 divide-x-2 divide-black border-b-2 border-black font-black uppercase">
                                      <th className="py-2">Payment Mode</th>
                                      <th className="py-2">Paid Amount</th>
                                      <th className="py-2 truncate">Transaction ID / Reference</th>
                                   </tr>
                                </thead>
                                <tbody className="divide-y-2 divide-black font-bold uppercase">
                                   {showReceipt.paymentModes.map((pm, idx) => (
                                      <tr key={idx} className="divide-x-2 divide-black">
                                         <td className="py-2">{pm.mode}</td>
                                         <td className="py-2">₹{pm.amount}</td>
                                         <td className="py-2">{pm.transactionId || 'CASH TRANSACTION'}</td>
                                      </tr>
                                   ))}
                                </tbody>
                             </table>
                          </div>
                       )}

                       <div className="text-right mt-2 space-y-1">
                          <p className="text-[10px] font-black">
                             {receiptType === 'SINGLE' ? `Current Paid: ₹ ${showReceipt.paidAmount}` : `Total Paid to Date: ₹ ${feePayments.filter(p => p.studentId === showReceipt.studentId).reduce((acc, curr) => acc + curr.paidAmount, 0)}`}
                          </p>
                          <p className="text-[8px] font-bold italic text-gray-500 uppercase">
                             Amount In Words: Rupees {numberToWords(receiptType === 'SINGLE' ? showReceipt.paidAmount : feePayments.filter(p => p.studentId === showReceipt.studentId).reduce((acc, curr) => acc + curr.paidAmount, 0))}
                          </p>
                           {(() => {
                             const student = students.find(s => s.id === showReceipt.studentId);
                             if (!student) return null;
                             const totalPaid = feePayments.filter(p => p.studentId === showReceipt.studentId).reduce((acc, curr) => acc + curr.paidAmount, 0);
                             return (
                               <div className="pt-2 border-t border-gray-100 mt-2">
                                 <p className="text-[9px] font-black text-blue-600 uppercase">Total Course Fee: ₹{student.totalFees}</p>
                                 <p className="text-[9px] font-black text-red-600 uppercase">Remaining Balance: ₹{student.totalFees - totalPaid}</p>
                               </div>
                             );
                           })()}
                      </div>
                     </div>

                     {/* Signatures */}
                     <div className="flex justify-between mt-20 pb-8 border-t-2 border-black pt-12">
                        <div className="text-center">
                           <div className="w-40 border-t border-black mb-1"></div>
                           <p className="text-[9px] font-black uppercase">Student Signature</p>
                        </div>
                        <div className="text-center">
                           <div className="w-40 border-t border-black mb-1"></div>
                           <p className="text-[9px] font-black uppercase">Authorized / Cashier Signature</p>
                        </div>
                     </div>

                     {/* Instructions Box */}
                     <div className="border-[2px] border-dotted border-blue-600 p-6 rounded-2xl bg-blue-50/20">
                        <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 underline">Instructions:</h4>
                        <ul className="text-[8px] font-bold text-gray-700 space-y-1 list-disc list-inside leading-relaxed uppercase">
                           <li>Fees once paid is non-refundable.</li>
                           <li>Keep this receipt safely.</li>
                           <li>This is a system generated receipt.</li>
                           <li>Once the fee has been paid, it will not be refunded under any circumstances, nor can it be transferred or adjusted to any other course or student.</li>
                        </ul>
                     </div>
                   </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body { 
            visibility: hidden !important; 
            background: white !important;
          }
          #active-app-root {
            display: none !important;
          }
          #printable-receipt { 
            visibility: visible !important;
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 148.5mm !important; /* Half of A4 (297/2) */
            margin: 0 !important;
            padding: 5mm !important;
            display: flex !important;
            flex-direction: column;
            justify-content: center;
            overflow: hidden;
            box-sizing: border-box;
            background: white !important;
            z-index: 9999999;
          }
          #printable-receipt > div {
             border: 2px solid black !important;
             height: 100% !important;
             overflow: hidden;
          }
          #printable-receipt * { 
            visibility: visible !important; 
          }
          .print\:hidden { display: none !important; }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
};
