/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
  GraduationCap,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { Student, FeePayment } from '../../types';

export const FeeCollection = () => {
  const { students, feePayments, feeStructures, addFeePayment, currentUser, businessProfile, courses } = useApp();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState<FeePayment | null>(null);
  const [receiptType, setReceiptType] = useState<'SINGLE' | 'HISTORY'>('SINGLE');

  useEffect(() => {
    const state = location.state as { studentId?: string } | null;
    if (state?.studentId) {
      const student = students.find(s => s.id === state.studentId);
      if (student) {
        setSelectedStudent(student);
      }
    }
  }, [location.state, students]);
  
  const [paymentData, setPaymentData] = useState({
    feeType: '',
    amount: 0,
    discount: 0,
    penalty: 0,
    paidAmount: 0,
    paymentMode: 'Cash',
    transactionId: '',
    remarks: '',
    isFullPayment: true
  });

  // Filter students by franchise
  const franchiseStudents = students.filter(s => s.franchiseId === currentUser?.franchiseId);

  const filteredStudents = (searchTerm.length > 2 || filterCourse !== 'ALL')
    ? franchiseStudents.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (s.enrollmentNo && s.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesCourse = filterCourse === 'ALL' || s.course === filterCourse;
        
        return matchesSearch && matchesCourse;
      })
    : [];

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setSearchTerm('');
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const netAmount = (paymentData.amount + paymentData.penalty) - paymentData.discount;
    const balance = netAmount - paymentData.paidAmount;
    
    const newPayment: FeePayment = {
      id: `p${Date.now()}`,
      studentId: selectedStudent.id,
      receiptNo: `RCPT${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      collectionTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      feeType: paymentData.feeType,
      amount: paymentData.amount,
      discount: paymentData.discount,
      penalty: paymentData.penalty,
      paidAmount: paymentData.paidAmount,
      balance: balance > 0 ? balance : 0,
      paymentMode: paymentData.paymentMode,
      transactionId: paymentData.transactionId,
      status: balance <= 0 ? 'Paid' : (paymentData.paidAmount > 0 ? 'Partial' : 'Pending'),
      remarks: paymentData.remarks
    };

    addFeePayment(newPayment);
    setShowPaymentModal(false);
    setShowReceipt(newPayment);
  };

  const numberToWords = (num: number): string => {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if ((num = Math.floor(num)) > 999999999) return 'Overflow';
    let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';
    let str = '';
    str += (Number(n[1]) !== 0) ? (a[Number(n[1])] || b[Number(n[1][0])] + ' ' + a[Number(n[1][1])]) + 'Crore ' : '';
    str += (Number(n[2]) !== 0) ? (a[Number(n[2])] || b[Number(n[2][0])] + ' ' + a[Number(n[2][1])]) + 'Lakh ' : '';
    str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[Number(n[3][0])] + ' ' + a[Number(n[3][1])]) + 'Thousand ' : '';
    str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[Number(n[4][0])] + ' ' + a[Number(n[4][1])]) + 'Hundred ' : '';
    str += (Number(n[5]) !== 0) ? (a[Number(n[5])] || b[Number(n[5][0])] + ' ' + a[Number(n[5][1])]) : '';
    return (str ? str + 'Only' : 'Zero Only');
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

  const getInstallmentNumber = (currentDate: string, studentId: string) => {
    const studentPayments = feePayments
      .filter(p => p.studentId === studentId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const uniqueDates = Array.from(new Set(studentPayments.map(p => p.date)));
    const dateIndex = uniqueDates.indexOf(currentDate);
    
    return dateIndex !== -1 ? `Installment ${dateIndex + 1}` : 'N/A';
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
            
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Name, Enrollment or Adm No..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-xs"
                />
              </div>

              <select 
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-[10px] uppercase tracking-widest appearance-none cursor-pointer"
              >
                <option value="ALL">All Courses</option>
                {courses.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            
            <AnimatePresence>
              {(searchTerm.length > 2 || filterCourse !== 'ALL') && (
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
                        <div className="flex-1">
                          <p className="text-xs font-black text-[#141414] uppercase">{s.name}</p>
                          <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest">{s.admissionNo}</p>
                        </div>
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectStudent(s);
                            const studentPayments = feePayments.filter(p => p.studentId === s.id);
                            if (studentPayments.length > 0) {
                              setReceiptType('HISTORY');
                              setShowReceipt(studentPayments[studentPayments.length - 1]);
                            } else {
                              alert('No payment records found for this student.');
                            }
                          }}
                          className="p-2 border border-gray-100 rounded-lg hover:bg-white hover:text-purple-600 text-gray-400 transition-all"
                          title="Print Summary"
                        >
                          <FileText size={14} />
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
                     <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Admission Date</p>
                     <p className="text-[11px] font-bold text-white uppercase">{selectedStudent.admissionDate}</p>
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
                    <button 
                      onClick={() => {
                        const studentPayments = feePayments.filter(p => p.studentId === selectedStudent.id);
                        if (studentPayments.length > 0) {
                          setReceiptType('HISTORY');
                          setShowReceipt(studentPayments[studentPayments.length - 1]);
                        } else {
                          alert('No payment records found for this student.');
                        }
                      }}
                      className="w-full py-4 bg-white text-[#141414] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center space-x-2 border-2 border-[#141414] shadow-sm font-black"
                    >
                      <Printer size={16} />
                      <span>Print Course Fee Summary</span>
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
                    <th className="px-8 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest">Inst.</th>
                    <th className="px-8 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest">Student</th>
                    <th className="px-8 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest">Fee Type</th>
                    <th className="px-8 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest">Paid</th>
                    <th className="px-8 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest">Balance</th>
                    <th className="px-8 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {feePayments.filter(p => {
                    const s = students.find(student => student.id === p.studentId);
                    return s?.franchiseId === currentUser?.franchiseId && (!selectedStudent || p.studentId === selectedStudent.id);
                  }).slice().reverse().map(payment => {
                    const student = students.find(s => s.id === payment.studentId);
                    return (
                      <tr key={payment.id} className="hover:bg-blue-50/20 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-[#141414] uppercase tracking-tighter">{payment.receiptNo}</span>
                            <span className="text-[8px] font-black text-gray-400 uppercase">{payment.date}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{getInstallmentNumber(payment.date, payment.studentId)}</span>
                        </td>
                        <td className="px-8 py-6 font-bold text-[10px] text-[#141414] uppercase tracking-tight">{student?.name || 'Unknown'}</td>
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
                               title="Print Receipt"
                             >
                               <Printer size={16} />
                             </button>
                             <button 
                               onClick={() => {
                                 const studentPayments = feePayments.filter(p => p.studentId === payment.studentId);
                                 setReceiptType('HISTORY');
                                 setShowReceipt(studentPayments[studentPayments.length - 1]);
                               }}
                               className="p-2 text-gray-400 hover:text-purple-600 hover:bg-white rounded-lg transition-all"
                               title="Print Summary"
                             >
                               <FileText size={16} />
                             </button>
                             <button 
                               onClick={() => student && sendWhatsAppReceipt(payment, student)}
                               className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-white rounded-lg transition-all"
                               title="WhatsApp Reminder"
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

              <form onSubmit={handlePayment} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#888888] uppercase tracking-widest ml-1">Fee Type / Head</label>
                    <select 
                      required
                      value={paymentData.feeType}
                      onChange={(e) => setPaymentData({...paymentData, feeType: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                    >
                      <option value="">Select Category</option>
                      {feeStructures.map(f => <option key={f.id} value={f.head}>{f.head}</option>)}
                      <option value="Admission Fee">Admission Fee</option>
                      <option value="Monthly Fee">Monthly Fee</option>
                      <option value="Exam Fee">Exam Fee</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#888888] uppercase tracking-widest ml-1">Payment Mode</label>
                    <select 
                      value={paymentData.paymentMode}
                      onChange={(e) => setPaymentData({...paymentData, paymentMode: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                    >
                      <option>Cash</option>
                      <option>UPI / Online</option>
                      <option>Bank Transfer</option>
                      <option>Check</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#888888] uppercase tracking-widest ml-1">Total Fee Amount (₹)</label>
                    <input 
                      type="number"
                      required
                      value={paymentData.amount || ''}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setPaymentData({...paymentData, amount: e.target.value === '' ? 0 : Number(e.target.value)})}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest ml-1">Discount Given (₹)</label>
                    <input 
                      type="number"
                      value={paymentData.discount || ''}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setPaymentData({...paymentData, discount: e.target.value === '' ? 0 : Number(e.target.value)})}
                      className="w-full p-4 bg-emerald-50 border border-emerald-100 rounded-2xl outline-none font-bold text-emerald-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-red-500 uppercase tracking-widest ml-1">Penalty / Late Fee (₹)</label>
                    <input 
                      type="number"
                      value={paymentData.penalty || ''}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setPaymentData({...paymentData, penalty: e.target.value === '' ? 0 : Number(e.target.value)})}
                      className="w-full p-4 bg-red-50 border border-red-100 rounded-2xl outline-none font-bold text-red-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Paid Amount (₹) *</label>
                      <button 
                        type="button"
                        onClick={() => setPaymentData({...paymentData, paidAmount: (paymentData.amount + paymentData.penalty) - paymentData.discount})}
                        className="text-[8px] font-black text-blue-600 uppercase tracking-wider hover:underline"
                      >
                        Set Full Payment
                      </button>
                    </div>
                    <input 
                      type="number"
                      required
                      value={paymentData.paidAmount || ''}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setPaymentData({...paymentData, paidAmount: e.target.value === '' ? 0 : Number(e.target.value)})}
                      className="w-full p-4 bg-blue-50 border border-blue-100 rounded-2xl outline-none font-black text-blue-800 text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#888888] uppercase tracking-widest ml-1">Transaction ID / Ref (Optional)</label>
                    <input 
                      type="text"
                      value={paymentData.transactionId}
                      onChange={(e) => setPaymentData({...paymentData, transactionId: e.target.value})}
                      placeholder="e.g. TXN123456"
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[9px] font-black text-[#888888] uppercase tracking-widest ml-1">Remarks</label>
                   <textarea 
                     value={paymentData.remarks}
                     onChange={(e) => setPaymentData({...paymentData, remarks: e.target.value})}
                     className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold"
                     rows={2}
                   />
                </div>

                <div className="pt-6 grid grid-cols-2 gap-4">
                  <button 
                    type="button" 
                    onClick={() => setShowPaymentModal(false)}
                    className="py-4 bg-gray-100 text-[#141414] text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-all font-mono"
                  >
                    DISCARD
                  </button>
                  <button 
                    type="submit" 
                    className="py-4 bg-[#141414] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-black/20 flex items-center justify-center space-x-3"
                  >
                     <Send size={18} />
                     <span>Finalize Payment</span>
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
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="bg-white rounded-[2rem] w-full max-w-4xl p-0 shadow-2xl relative my-auto min-h-max"
            >
                <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between z-10 rounded-t-[2rem]">
                   <h3 className="text-sm font-black text-[#141414] uppercase tracking-widest">
                     {receiptType === 'SINGLE' ? 'Fee Receipt Preview' : 'Course Fee Summary Preview'}
                   </h3>
                   <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => setShowReceipt(null)}
                      className="p-3 bg-gray-100 text-gray-400 hover:text-red-500 rounded-2xl transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>
               </div>

               {/* Receipt Layout */}
               <div className="p-8 relative print:p-0 bg-gray-50/50" id="printable-receipt">
                  <div className="flex justify-end space-x-4 mb-6 print:hidden">
                    <button 
                      onClick={() => {
                        const student = students.find(s => s.id === showReceipt.studentId);
                        if (student) sendWhatsAppReceipt(showReceipt, student);
                      }}
                      className="flex items-center space-x-2 px-6 py-4 bg-white border border-gray-200 text-[#141414] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                    >
                      <Download size={16} />
                      <span>Download PDF</span>
                    </button>
                    <button 
                      onClick={() => window.print()}
                      className="flex items-center space-x-2 px-8 py-4 bg-[#141414] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-black/20 active:scale-95"
                    >
                      <span>Print Official Copy</span>
                    </button>
                  </div>

                  <div className="bg-white relative shadow-sm border border-gray-200 p-10 max-w-[210mm] mx-auto print:border-0 print:shadow-none print:p-4">
                     
                     {/* Dynamic Header from Admin Panel */}
                     {/* Receipt Header Image */}
                     <div className="mb-4">
                        {businessProfile.receiptHeaderUrl ? (
                          <img src={businessProfile.receiptHeaderUrl} alt="Header" className="w-full h-auto mx-auto" />
                        ) : (
                          <div className="flex flex-col items-center border-b-[1.5px] border-black pb-4 text-center">
                            <p className="text-[10px] font-bold text-gray-800">An ISO 9001 : 2015 Certified Institute</p>
                            <p className="text-[11px] font-black text-emerald-700">बस्ती मंडल का नं. 1 कंप्यूटर ट्रेनिंग इंस्टिट्यूट</p>
                            <h1 className="text-4xl font-black text-red-600 tracking-tight uppercase leading-none mt-1">{businessProfile.name}</h1>
                            <div className="bg-indigo-900/5 px-4 py-1 rounded text-[8px] font-bold text-indigo-900 border border-indigo-900/10 mt-1">
                               [ RUN UNDER : SOFTDEV TALLY GURU PRASHIKSHAN SANSTHAN SOCIETY ] [ REG No. : G-58913 / 1442 ]
                            </div>
                            <p className="text-[9px] font-black text-blue-800 mt-1">(A Complete Computer Education Institute) (An Authorised Tally Education Partner)</p>
                            <p className="text-[9px] font-bold text-red-600 uppercase">Head Office : {businessProfile.address} - {businessProfile.pincode || '272001'}</p>
                            <p className="text-[9px] font-black text-[#141414]">Website : {businessProfile.website}  Phone : {businessProfile.phone}</p>
                          </div>
                        )}
                     </div>

                     <div className="bg-blue-600 p-2 text-center border-y-2 border-black mb-8 text-white">
                        <h2 className="text-sm font-black uppercase tracking-widest underline decoration-2 underline-offset-4">
                          {receiptType === 'SINGLE' ? 'FEE RECEIPT' : 'COURSE FEE SUMMARY'}
                        </h2>
                     </div>

                     {/* Receipt Details Section */}
                     {(() => {
                        const student = students.find(s => s.id === showReceipt.studentId);
                        if (!student) return null;
                        return (
                          <div className="grid grid-cols-2 divide-x-2 divide-black border-2 border-black mb-8 text-[11px]">
                             <div className="divide-y-2 divide-black">
                                <div className="grid grid-cols-2 divide-x-2 divide-black h-10">
                                   <div className="px-4 flex items-center font-black bg-blue-50">Branch / Franchise</div>
                                   <div className="px-4 flex items-center font-bold uppercase">{student?.studyCenter || businessProfile.name}</div>
                                </div>
                                <div className="grid grid-cols-2 divide-x-2 divide-black h-10">
                                   <div className="px-4 flex items-center font-black bg-blue-50">Admission Date</div>
                                   <div className="px-4 flex items-center font-bold uppercase">{student.admissionDate}</div>
                                </div>
                                <div className="grid grid-cols-2 divide-x-2 divide-black min-h-[2.5rem]">
                                   <div className="px-4 py-2 flex items-center font-black bg-blue-50">Course</div>
                                   <div className="px-4 py-2 flex items-center font-bold uppercase">{student.course} ({student.courseDuration || 'N/A'})</div>
                                </div>
                                <div className="grid grid-cols-2 divide-x-2 divide-black h-10">
                                   <div className="px-4 flex items-center font-black bg-blue-50">Mobile</div>
                                   <div className="px-4 flex items-center font-bold">{student.contact}</div>
                                </div>
                                <div className="grid grid-cols-2 divide-x-2 divide-black h-10">
                                   <div className="px-4 flex items-center font-black bg-blue-50">Student Name</div>
                                   <div className="px-4 flex items-center font-bold uppercase">{student.name}</div>
                                </div>
                             </div>

                             <div className="divide-y-2 divide-black">
                                <div className="grid grid-cols-2 divide-x-2 divide-black h-10">
                                   <div className="px-4 flex items-center font-black bg-blue-50">Receipt No</div>
                                   <div className="px-4 flex items-center font-bold uppercase">{showReceipt.receiptNo}</div>
                                </div>
                                <div className="grid grid-cols-2 divide-x-2 divide-black h-10">
                                   <div className="px-4 flex items-center font-black bg-blue-50">Date / Time</div>
                                   <div className="px-4 flex items-center font-bold">
                                      {showReceipt.date} {showReceipt.collectionTime && `| ${showReceipt.collectionTime}`}
                                   </div>
                                </div>
                                <div className="grid grid-cols-2 divide-x-2 divide-black h-10">
                                   <div className="px-4 flex items-center font-black bg-blue-50">Installment No</div>
                                   <div className="px-4 flex items-center font-bold uppercase">
                                      {(() => {
                                        const studentPayments = feePayments
                                          .filter(p => p.studentId === showReceipt.studentId)
                                          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                                        const idx = studentPayments.findIndex(p => p.id === showReceipt.id);
                                        return idx !== -1 ? `${idx + 1}` : '--';
                                      })()}
                                   </div>
                                </div>
                                <div className="grid grid-cols-2 divide-x-2 divide-black h-10">
                                   <div className="px-4 flex items-center font-black bg-blue-50">Father's Name</div>
                                   <div className="px-4 flex items-center font-bold uppercase">{student.fatherName}</div>
                                </div>
                                <div className="grid grid-cols-2 divide-x-2 divide-black h-10 bg-gray-50/10">
                                   <div className="px-4 flex items-center font-black bg-blue-50"></div>
                                   <div className="px-4 flex items-center font-bold uppercase"></div>
                                </div>
                             </div>
                          </div>
                        );
                     })()}
                     
                     {/* Student Info Section */}

                     <div className="mb-6">
                        <div className="bg-blue-600 text-white px-4 py-2 flex items-center mb-2">
                           <FileText size={14} className="mr-2" />
                           <span className="text-[10px] font-black uppercase tracking-widest">
                               COURSE FEE SUMMARY
                           </span>
                        </div>
                        <table className="w-full border-t-[1.5px] border-l-[1.5px] border-black text-center text-[9px]">
                           <thead>
                              <tr className="bg-blue-50 divide-x-[1.5px] divide-black border-b-[1.5px] border-black font-black uppercase">
                                 <th className="py-2 min-w-[25px]">#</th>
                                 <th className="py-2 px-4 text-left">Fees Type</th>
                                 <th className="py-2">Amount</th>
                                 <th className="py-2">Discount</th>
                                 <th className="py-2">Penalty</th>
                                 <th className="py-2">Paid Amount</th>
                                 <th className="py-2">Balance</th>
                                 <th className="py-2">Status</th>
                                 <th className="py-2">Date</th>
                                 <th className="py-2">Pay Mode</th>
                                 <th className="py-2">Transaction ID</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y-[1.5px] divide-black border-b-[1.5px] border-r-[1.5px] border-black font-bold uppercase">
                              {(showReceipt.heads && showReceipt.heads.length > 0 ? showReceipt.heads : [{ type: showReceipt.feeType, amount: showReceipt.amount, discount: showReceipt.discount, penalty: showReceipt.penalty }]).map((h, idx) => (
                                 <tr key={idx} className="divide-x-[1.5px] divide-black">
                                    <td className="py-2">{idx + 1}</td>
                                    <td className="py-2 px-4 text-left">{h.type}</td>
                                    <td className="py-2">₹{h.amount.toFixed(2)}</td>
                                    <td className="py-2">₹{h.discount.toFixed(2)}</td>
                                    <td className="py-2">₹{h.penalty.toFixed(2)}</td>
                                    <td className="py-2 text-emerald-700 font-black">₹{idx === 0 ? showReceipt.paidAmount.toFixed(2) : '0.00'}</td>
                                    <td className="py-2 text-red-600">₹{idx === 0 ? showReceipt.balance.toFixed(2) : '0.00'}</td>
                                    <td className="py-2">
                                       <span className={clsx(
                                          "px-2 py-0.5 rounded text-[8px] font-black uppercase text-white shadow-sm",
                                          showReceipt.status === 'Paid' ? "bg-emerald-500" : "bg-red-500"
                                       )}>
                                          {showReceipt.status}
                                       </span>
                                    </td>
                                    <td className="py-2">{showReceipt.date}</td>
                                    <td className="py-2">{showReceipt.paymentMode}</td>
                                    <td className="py-2">{showReceipt.transactionId || '--'}</td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>

                     <div className="text-center my-6">
                        <h2 className="text-lg font-black text-blue-600 tracking-widest uppercase">DEPOSITED FEE</h2>
                     </div>

                      {/* Deposited Fees Table Grouped by Installment */}
                      <table className="w-full border-t-[1.5px] border-l-[1.5px] border-black text-[9px] mb-2 text-center overflow-hidden">
                         <thead>
                            <tr className="bg-blue-600 text-white divide-x-[1.5px] divide-black border-b-[1.5px] border-black">
                               <th className="py-1.5 px-2 min-w-[30px]">#</th>
                               <th className="py-1.5 px-2 text-left">Installment</th>
                               <th className="py-1.5 px-2 text-left">Receipt No..</th>
                              <th className="py-1.5 px-2 text-left">Fee Type</th>
                              <th className="py-1.5 px-2">Amount</th>
                              <th className="py-1.5 px-2 text-left">Pay Mode</th>
                              <th className="py-1.5 px-2">Date</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y-[1.5px] divide-black border-b-[1.5px] border-r-[1.5px] border-black font-bold">
                           {(() => {
                             const currentInstallmentNo = getInstallmentNumber(showReceipt.date, showReceipt.studentId);
                             const history = feePayments
                              .filter(p => p.studentId === showReceipt.studentId && (receiptType === 'HISTORY' || getInstallmentNumber(p.date, p.studentId) === currentInstallmentNo))
                              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                              
                             const rows: any[] = [];
                             history.forEach(p => {
                               const installment = getInstallmentNumber(p.date, p.studentId);
                               const billableTotal = (p.amount || 0) + (p.penalty || 0) - (p.discount || 0);
                               rows.push({
                                 installment,
                                 receiptNo: p.receiptNo,
                                 feeType: p.feeType,
                                 amount: billableTotal,
                                 mode: p.paymentMode,
                                 date: p.date
                               });
                             });

                             return rows.map((row, idx) => (
                               <tr key={idx} className="divide-x-[1.5px] divide-black">
                                  <td className="py-1.5">{idx + 1}</td>
                                  <td className="py-1.5 px-3 text-left uppercase text-blue-700">{row.installment}</td>
                                  
                                  <td className="py-1.5 px-3 text-left uppercase">{row.receiptNo}</td>
                                  <td className="py-1.5 px-3 text-left uppercase truncate max-w-[120px]">{row.feeType}</td>
                                  <td className="py-1.5 text-gray-900">{row.amount.toFixed(2)}</td>
                                  <td className="py-1.5 px-3 text-left uppercase text-indigo-700">{row.mode}</td>
                                  <td className="py-1.5">{row.date}</td>
                               </tr>
                             ));
                           })()}
                           <tr className="bg-gray-100 divide-x-[1.5px] divide-black font-black">
                              <td colSpan={4} className="py-1.5 px-4 text-left uppercase">Total</td>
                              <td className="py-1.5">
                                 {(() => {
                                   const currentInstallmentNo = getInstallmentNumber(showReceipt.date, showReceipt.studentId);
                                   const studentPayments = feePayments.filter(p => p.studentId === showReceipt.studentId && (receiptType === 'HISTORY' || getInstallmentNumber(p.date, p.studentId) === currentInstallmentNo));
                                   return studentPayments.reduce((acc, p) => acc + (p.amount + (p.penalty || 0) - (p.discount || 0)), 0).toFixed(2);
                                 })()}
                              </td>
                              <td colSpan={2}></td>
                           </tr>
                        </tbody>
                     </table>
                     
                     <div className="mb-12 px-2 flex justify-between items-center border-b border-gray-100 pb-4">
                        <p className="text-[12px] font-bold">
                           <span className="font-black">Amount In Words:</span> Rupees {numberToWords(receiptType === 'SINGLE' ? showReceipt.paidAmount : feePayments.filter(p => p.studentId === showReceipt.studentId).reduce((acc, curr) => acc + curr.paidAmount, 0))}
                        </p>
                        {(() => {
                           const student = students.find(s => s.id === showReceipt.studentId);
                           if (!student) return null;
                           const studentPayments = feePayments.filter(p => p.studentId === showReceipt.studentId);
                           const totalPaid = studentPayments.reduce((acc, curr) => acc + curr.paidAmount, 0);
                           const totalInvoiced = studentPayments.reduce((acc, p) => acc + (p.amount + (p.penalty || 0) - (p.discount || 0)), 0);
                           
                           return (
                             <div className="text-right border-l-4 border-blue-600 pl-6">
                               <p className="text-[11px] font-black text-blue-600 uppercase tracking-tight">Total Course Fee: ₹{totalInvoiced}</p>
                               <p className="text-[11px] font-black text-red-600 uppercase tracking-tight">Remaining Balance: ₹{totalInvoiced - totalPaid}</p>
                             </div>
                           );
                        })()}
                     </div>

                     {/* Signatures */}
                     <div className="flex justify-between mt-12 mb-10 px-4 border-t border-gray-200 pt-4">
                        <div className="text-center w-64 border-t border-black/40 pt-1">
                           <p className="text-[11px] font-black uppercase">Student Signature</p>
                        </div>
                        <div className="text-center w-64 border-t border-black/40 pt-1">
                           <p className="text-[11px] font-black uppercase">Cashier Signature</p>
                        </div>
                     </div>

                     {/* Instructions Box */}
                     <div className="border border-yellow-200 p-6 bg-yellow-50/50 rounded-xl mb-6">
                        <h4 className="text-[11px] font-black uppercase mb-3">Instructions:</h4>
                        <ul className="text-[10px] font-bold text-gray-700 space-y-1 mt-1 list-none leading-relaxed">
                           <li>• Fees once paid is non-refundable.</li>
                           <li>• Keep this receipt safely.</li>
                           <li>• This is system generated receipt.</li>
                           <li>• Once the fee has been paid, it will not be refunded under any circumstances, nor can it be transferred or adjusted to any other course or student.</li>
                        </ul>
                     </div>

                     <div className="flex justify-end print:hidden">
                       <button 
                         onClick={() => {
                           const student = students.find(s => s.id === showReceipt.studentId);
                           if (student) sendWhatsAppReceipt(showReceipt, student);
                         }}
                         className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors"
                       >
                         <MessageCircle size={16} />
                         <span className="text-[10px] font-black uppercase tracking-widest border-b border-emerald-600">Share on WhatsApp</span>
                       </button>
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
