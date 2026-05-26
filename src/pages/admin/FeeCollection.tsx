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
  GraduationCap,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { Student, FeePayment, FeeHeadDetail, PaymentModeDetail } from '../../types';

const discountOptions = [0, 50, 100, 200, 300, 500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 8000, 10000];
const penaltyRateOptions = [0, 5, 10, 20, 50, 100, 150, 200];

const getClubbedFeePayments = (payments: FeePayment[]): FeePayment[] => {
  if (!payments || payments.length === 0) return [];
  
  // Group by studentId and date
  const groups: { [key: string]: FeePayment[] } = {};
  payments.forEach(p => {
    const key = `${p.studentId}_${p.date}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(p);
  });

  const clubbed: FeePayment[] = [];
  
  Object.values(groups).forEach(group => {
    if (group.length === 1) {
      clubbed.push(group[0]);
      return;
    }
    
    // Sort group chronologically (oldest first) to accurately trace balance decrement
    const sortedGroup = [...group].sort((a, b) => a.id.localeCompare(b.id));
    const first = sortedGroup[0];
    const last = sortedGroup[sortedGroup.length - 1];
    
    // Merge receipt numbers
    const uniqueReceipts = Array.from(new Set(sortedGroup.map(g => g.receiptNo).filter(Boolean)));
    const receiptNo = uniqueReceipts.join(' + ');
    
    // Merge fee types
    const uniqueFeeTypes = Array.from(new Set(sortedGroup.map(g => g.feeType).filter(Boolean)));
    const feeType = uniqueFeeTypes.join(', ');
    
    // Merge heads
    const allHeads: FeeHeadDetail[] = [];
    sortedGroup.forEach(p => {
      if (p.heads && p.heads.length > 0) {
        allHeads.push(...p.heads);
      } else {
        allHeads.push({
          type: p.feeType,
          amount: p.amount || 0,
          discount: p.discount || 0,
          penalty: p.penalty || 0,
          dueDate: p.dueDate,
          penaltyRate: p.penaltyRate
        });
      }
    });

    // Merge payment modes
    const allPaymentModes: PaymentModeDetail[] = [];
    sortedGroup.forEach(p => {
      if (p.paymentModes && p.paymentModes.length > 0) {
        allPaymentModes.push(...p.paymentModes);
      } else {
        allPaymentModes.push({
          mode: p.paymentMode || 'Cash',
          amount: p.paidAmount || 0,
          transactionId: p.transactionId || ''
        });
      }
    });
    
    // De-duplicate paymentModes by mode name
    const mergedModesMap: { [mode: string]: PaymentModeDetail } = {};
    allPaymentModes.forEach(m => {
      if (!mergedModesMap[m.mode]) {
        mergedModesMap[m.mode] = { ...m };
      } else {
        mergedModesMap[m.mode].amount += m.amount;
        if (m.transactionId && !mergedModesMap[m.mode].transactionId?.includes(m.transactionId)) {
          mergedModesMap[m.mode].transactionId = mergedModesMap[m.mode].transactionId 
            ? `${mergedModesMap[m.mode].transactionId}, ${m.transactionId}`
            : m.transactionId;
        }
      }
    });
    const mergedPaymentModes = Object.values(mergedModesMap);
    const paymentMode = mergedPaymentModes.map(m => m.mode).join(' + ');
    
    const amount = sortedGroup.reduce((sum, p) => sum + (p.amount || 0), 0);
    const discount = sortedGroup.reduce((sum, p) => sum + (p.discount || 0), 0);
    const penalty = sortedGroup.reduce((sum, p) => sum + (p.penalty || 0), 0);
    const paidAmount = sortedGroup.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
    
    const balance = last.balance;
    const finalStatus = balance <= 0 ? 'Paid' : (paidAmount > 0 ? 'Partial' : 'Pending');
    
    const uniqueRemarks = Array.from(new Set(sortedGroup.map(g => g.remarks).filter(Boolean)));
    const remarks = uniqueRemarks.join(' | ');
    const collectionTime = first.collectionTime || '';

    clubbed.push({
      id: first.id,
      studentId: first.studentId,
      receiptNo,
      date: first.date,
      collectionTime,
      feeType,
      heads: allHeads,
      amount,
      discount,
      penalty,
      paidAmount,
      balance,
      paymentMode,
      paymentModes: mergedPaymentModes,
      status: finalStatus,
      remarks,
      dueDate: last.dueDate || first.dueDate,
      penaltyRate: last.penaltyRate || first.penaltyRate
    } as FeePayment);
  });
  
  return clubbed;
};

export const FeeCollection = () => {
  const { students, feePayments, feeStructures, addFeePayment, businessProfile, courses, franchises } = useApp();
  const clubbedFeePayments = getClubbedFeePayments(feePayments || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('ALL');
  const [filterBranch, setFilterBranch] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState<FeePayment | null>(null);
  const [receiptType, setReceiptType] = useState<'SINGLE' | 'HISTORY'>('SINGLE');
  const [printPaperSize, setPrintPaperSize] = useState<'A4' | 'A5'>('A5');

  const [showFullPayments, setShowFullPayments] = useState(false);
  const [fullPageSearchTerm, setFullPageSearchTerm] = useState('');
  const [fullPageFilterCourse, setFullPageFilterCourse] = useState('ALL');
  const [fullPageFilterBranch, setFullPageFilterBranch] = useState('ALL');
  const [fullPageFilterStatus, setFullPageFilterStatus] = useState('ALL');

  const getCalculatedPenalty = (dueDateStr: string, rate: number) => {
    if (!dueDateStr) return 0;
    const today = new Date();
    today.setHours(0,0,0,0);
    const due = new Date(dueDateStr);
    due.setHours(0,0,0,0);
    if (today > due) {
      const diffTime = today.getTime() - due.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays * rate);
    }
    return 0;
  };
  
  const [paymentData, setPaymentData] = useState({
    heads: [{ type: 'Course Fee', amount: 0, discount: 0, penalty: 0, dueDate: new Date().toISOString().split('T')[0], penaltyRate: 50 }],
    paymentModes: [{ mode: 'Cash', amount: 0, transactionId: '' }],
    remarks: ''
  });

  // Reset payment data and load default matching course fee when modal opens or student changes
  React.useEffect(() => {
    if (showPaymentModal && selectedStudent) {
      const matched = (feeStructures || []).find(f => 
        f.status === 'ACTIVE' && 
        f.head === 'Course Fee' && 
        (f.courseName === selectedStudent.course || f.courseId === 'all' || f.courseName === 'All IT Courses') &&
        f.session === selectedStudent.session
      ) || (feeStructures || []).find(f => 
        f.status === 'ACTIVE' && 
        f.head === 'Course Fee' && 
        (f.courseName === selectedStudent.course || f.courseId === 'all' || f.courseName === 'All IT Courses')
      );

      const baseAmount = Math.max(0, (selectedStudent.totalFees || 0) - (selectedStudent.paidAmount || 0));
      const discount = 0;
      const penaltyRate = matched ? (matched.latePenalty ?? 50) : 50;
      const dueDate = new Date().toISOString().split('T')[0];
      const penalty = getCalculatedPenalty(dueDate, penaltyRate);
      const finalPaid = Math.max(0, (baseAmount + penalty) - discount);

      setPaymentData({
        heads: [{ 
          type: 'Course Fee', 
          amount: baseAmount, 
          discount: discount, 
          penalty: penalty,
          dueDate: dueDate,
          penaltyRate: penaltyRate
        }],
        paymentModes: [{ mode: 'Cash', amount: finalPaid, transactionId: '' }],
        remarks: ''
      });
    }
  }, [showPaymentModal, selectedStudent, feeStructures]);

  const totalPayable = paymentData.heads.reduce((acc, h) => acc + (h.amount + (h.penalty || 0) - (h.discount || 0)), 0);
  const totalPaidInModes = paymentData.paymentModes.reduce((acc, m) => acc + m.amount, 0);

  const filteredStudents = (searchTerm.length > 0 || filterCourse !== 'ALL' || filterBranch !== 'ALL')
    ? (students || []).filter(s => {
        const franchise = (franchises || []).find(f => f.id === s.franchiseId);
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (s.enrollmentNo && s.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
                             (franchise && franchise.name.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesCourse = filterCourse === 'ALL' || s.course === filterCourse;
        const matchesBranch = filterBranch === 'ALL' || s.franchiseId === filterBranch;
        
        return matchesSearch && matchesCourse && matchesBranch;
      })
    : [];

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setSearchTerm('');
  };

  const addHead = () => {
    const matched = (feeStructures || []).find(f => 
      f.status === 'ACTIVE' && 
      f.head === 'Course Fee' && 
      (f.courseName === selectedStudent?.course || f.courseId === 'all' || f.courseName === 'All IT Courses') &&
      f.session === selectedStudent?.session
    ) || (feeStructures || []).find(f => 
      f.status === 'ACTIVE' && 
      f.head === 'Course Fee' && 
      (f.courseName === selectedStudent?.course || f.courseId === 'all' || f.courseName === 'All IT Courses')
    );

    const baseAmount = matched ? (matched.amount || 0) : 0;
    const discount = matched ? (matched.discount || 0) : 0;
    const penaltyRate = matched ? (matched.latePenalty ?? 50) : 50;
    const dueDate = new Date().toISOString().split('T')[0];
    const penalty = getCalculatedPenalty(dueDate, penaltyRate);

    const newHeads = [
      ...paymentData.heads,
      { 
        type: 'Course Fee', 
        amount: baseAmount, 
        discount: discount, 
        penalty: penalty,
        dueDate: dueDate,
        penaltyRate: penaltyRate
      }
    ];

    const newTotalPayable = newHeads.reduce((acc, h) => acc + (h.amount + (h.penalty || 0) - (h.discount || 0)), 0);
    const newModes = paymentData.paymentModes.map((m, idx) => idx === 0 ? { ...m, amount: newTotalPayable } : m);

    setPaymentData({
      ...paymentData,
      heads: newHeads,
      paymentModes: newModes
    });
  };

  const removeHead = (index: number) => {
    if (paymentData.heads.length > 1) {
      const newHeads = [...paymentData.heads];
      newHeads.splice(index, 1);
      const newTotalPayable = newHeads.reduce((acc, h) => acc + (h.amount + (h.penalty || 0) - (h.discount || 0)), 0);
      const newModes = paymentData.paymentModes.map((m, idx) => idx === 0 ? { ...m, amount: newTotalPayable } : m);
      setPaymentData({ ...paymentData, heads: newHeads, paymentModes: newModes });
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
      collectionTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
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
      remarks: paymentData.remarks,
      dueDate: paymentData.heads[0]?.dueDate,
      penaltyRate: paymentData.heads[0]?.penaltyRate
    };

    addFeePayment(newPayment);
    setShowPaymentModal(false);
    setShowReceipt(newPayment);
    
    // Reset form
    setPaymentData({
      heads: [{ type: 'Course Fee', amount: 0, discount: 0, penalty: 0, dueDate: new Date().toISOString().split('T')[0], penaltyRate: 50 }],
      paymentModes: [{ mode: 'Cash', amount: 0, transactionId: '' }],
      remarks: ''
    });
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
    const totalPaid = (feePayments || []).filter(p => p.studentId === student.id).reduce((acc, p) => acc + p.paidAmount, 0);
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
    const totalPaid = (feePayments || []).filter(p => p.studentId === student.id).reduce((acc, p) => acc + p.paidAmount, 0);
    const finalBalance = student.totalFees - totalPaid;
    
    const message = `*PAYMENT SUCCESSFUL - SOFTDEV TALLY GURU*\n\nDear *${student.name}*,\nThank you for your payment of *₹${payment.paidAmount}* via *${payment.paymentMode}* ${payment.transactionId ? `(Ref: ${payment.transactionId})` : ''}.\n\n*Receipt Details:*\nReceipt No: ${payment.receiptNo}\nFee Type: ${payment.feeType}\nBalance Due: ₹${finalBalance}\n\nDownload full receipt from portal or contact office. Thank you!`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/91${student.contact.replace(/\D/g, '')}?text=${encodedMessage}`, '_blank');
  };

  const getInstallmentNumber = (currentDate: string, studentId: string) => {
    const studentPayments = (clubbedFeePayments || [])
      .filter(p => p.studentId === studentId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const uniqueDates = Array.from(new Set((studentPayments || []).map(p => p.date)));
    const dateIndex = uniqueDates.indexOf(currentDate);
    
    return dateIndex !== -1 ? `Installment ${dateIndex + 1}` : 'N/A';
  };

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 print:hidden">
        <style>{`
          @media print {
            @page {
              size: ${printPaperSize === 'A5' && receiptType === 'SINGLE' ? 'A5 landscape' : 'A4 portrait'};
              margin: 5mm;
            }
            body {
              visibility: hidden !important;
              background: white !important;
              color: black !important;
            }
            #printable-receipt, #printable-receipt * {
               visibility: visible !important;
            }
            #printable-receipt {
              visibility: visible !important;
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              border: 0 !important;
              box-shadow: none !important;
              background: white !important;
            }
            #printable-receipt .bg-white {
              border: 0 !important;
              box-shadow: none !important;
              padding: 4mm !important;
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            ${printPaperSize === 'A5' && receiptType === 'SINGLE' ? `
              #printable-receipt * {
                font-size: 8px !important;
                line-height: 1.15 !important;
              }
              #printable-receipt .h-10 {
                height: 1.75rem !important;
              }
              #printable-receipt td, #printable-receipt th {
                padding-top: 5px !important;
                padding-bottom: 5px !important;
              }
              #printable-receipt .mb-8 {
                margin-bottom: 0.75rem !important;
              }
              #printable-receipt .mb-6 {
                margin-bottom: 0.5rem !important;
              }
              #printable-receipt .p-8 {
                padding: 10px !important;
               }
              #printable-receipt .p-4 {
                padding: 8px !important;
              }
            ` : ''}
          }
        `}</style>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-3xl font-black text-[#141414] tracking-tight uppercase">Fee Collection</h1>
          <p className="text-sm text-[#888888] font-mono">Process student fees, generate receipts and manage dues</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  placeholder="Name, Enrollment, Adm No or Branch..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select 
                  value={filterBranch}
                  onChange={(e) => setFilterBranch(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-[8px] uppercase tracking-widest appearance-none cursor-pointer"
                >
                  <option value="ALL">All Branches</option>
                  {(franchises || []).map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>

                <select 
                  value={filterCourse}
                  onChange={(e) => setFilterCourse(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-[8px] uppercase tracking-widest appearance-none cursor-pointer"
                >
                  <option value="ALL">All Courses</option>
                  {(courses || []).map(c => (
                    <option key={c.id} value={c.title}>{c.title}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <AnimatePresence>
              {(searchTerm.length > 2 || filterCourse !== 'ALL' || filterBranch !== 'ALL') && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden"
                >
                  {(filteredStudents || []).length > 0 ? (
                    (filteredStudents || []).map(s => {
                      const sFranchise = (franchises || []).find(f => f.id === s.franchiseId);
                      return (
                        <button 
                          key={s.id}
                          onClick={() => handleSelectStudent(s)}
                          className="w-full p-4 flex items-center space-x-3 hover:bg-blue-50 text-left transition-colors border-b border-gray-50 last:border-0"
                        >
                          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 flex-shrink-0">
                            <User size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-baseline justify-between gap-1">
                              <p className="text-xs font-black text-[#141414] uppercase truncate">{s.name}</p>
                              {s.fatherName && (
                                <span className="text-[9px] font-bold text-gray-500 capitalize truncate">S/O: {s.fatherName}</span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1 text-[8px] font-black text-gray-400 uppercase tracking-tight">
                              <span className="text-blue-600 tracking-widest font-mono">{s.admissionNo}</span>
                              {s.contact && <span>• {s.contact}</span>}
                              <span className="text-cyan-600 max-w-[120px] truncate">{s.course}</span>
                              {sFranchise && <span className="text-purple-600 max-w-[100px] truncate">• {sFranchise.name}</span>}
                            </div>
                          </div>
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectStudent(s);
                              const studentPayments = (clubbedFeePayments || []).filter(p => p.studentId === s.id);
                              if (studentPayments.length > 0) {
                                setReceiptType('HISTORY');
                                setShowReceipt(studentPayments[studentPayments.length - 1]);
                              } else {
                                alert('No payment records found for this student.');
                              }
                            }}
                            className="p-2 border border-gray-100 rounded-lg hover:bg-white hover:text-purple-600 text-gray-400 transition-all flex-shrink-0"
                            title="Print Summary"
                          >
                            <FileText size={14} />
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">No matching results</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedStudent ? (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#141414] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group h-full flex flex-col justify-between"
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
                    <p className="text-[11px] font-bold text-white truncate">{selectedStudent.course} ({selectedStudent.courseDuration || "N/A"})</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-2xl">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Admission Date</p>
                    <p className="text-[11px] font-bold text-white uppercase">{selectedStudent.admissionDate}</p>
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-2">
                    <button 
                      onClick={() => setShowPaymentModal(true)}
                      className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/20"
                    >
                      <Plus size={16} />
                      <span>Post New Payment</span>
                    </button>
                    <button 
                      onClick={() => {
                        const studentPayments = (clubbedFeePayments || []).filter(p => p.studentId === selectedStudent.id);
                        if (studentPayments.length > 0) {
                          setReceiptType('HISTORY');
                          setShowReceipt(studentPayments[studentPayments.length - 1]);
                        } else {
                          alert('No payment records found for this student.');
                        }
                      }}
                      className="w-full py-4 bg-white text-[#141414] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center space-x-2 border-2 border-[#141414] shadow-sm"
                    >
                      <Printer size={16} />
                      <span>Print Course Fee Summary</span>
                    </button>
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
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2.5rem] h-full min-h-[300px] flex flex-col items-center justify-center p-8 text-center text-gray-400">
              <User size={32} className="mb-2" />
              <p className="text-xs font-black uppercase tracking-widest text-[#888888]">Please select a student to view details & post payments</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <History className="text-blue-600" size={20} />
                <h2 className="text-sm font-black text-[#141414] uppercase tracking-widest">Recent Payments</h2>
              </div>
              <button onClick={() => setShowFullPayments(true)} className="px-4 py-2 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-[#888888] rounded-xl hover:bg-gray-100">View All</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-8 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest">Receipt</th>
                    <th className="px-8 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest">Inst.</th>
                    <th className="px-8 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest">Student</th>
                    <th className="px-8 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest">Father's Name</th>
                    <th className="px-8 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest">Mobile No</th>
                    <th className="px-8 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest">Course Name</th>
                    <th className="px-8 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest">Fee Type</th>
                    <th className="px-8 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest">Due Date</th>
                    <th className="px-8 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest">Total Fees</th>
                    <th className="px-8 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest">Discount</th>
                    <th className="px-8 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest">Late Fees</th>
                    <th className="px-8 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest">Paid</th>
                    <th className="px-8 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest">Balance</th>
                    <th className="px-8 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(clubbedFeePayments || []).filter(p => !selectedStudent || p.studentId === selectedStudent.id).slice().reverse().map(payment => {
                    const student = (students || []).find(s => s.id === payment.studentId);
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
                        <td className="px-8 py-6 font-bold text-[10px] text-[#141414] uppercase tracking-tight">{student?.fatherName || '--'}</td>
                        <td className="px-8 py-6 font-bold text-[10px] text-[#141414] uppercase tracking-tight">{student?.contact || '--'}</td>
                        <td className="px-8 py-6 font-bold text-[10px] text-blue-600 uppercase tracking-tight">{student?.course || '--'}</td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 bg-gray-50 text-[8px] font-black uppercase tracking-widest rounded-full">{payment.feeType}</span>
                        </td>
                        <td className="px-8 py-6 text-xs font-mono font-bold text-red-600 uppercase">
                          {payment.dueDate || '--'}
                        </td>
                        <td className="px-8 py-6 text-xs font-black text-gray-800">₹{(payment.amount ?? 0).toLocaleString()}</td>
                        <td className="px-8 py-6 text-xs font-black text-orange-500">₹{(payment.discount ?? 0).toLocaleString()}</td>
                        <td className="px-8 py-6 text-xs font-black text-red-500">₹{(payment.penalty ?? 0).toLocaleString()}</td>
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
                                 const studentPayments = clubbedFeePayments.filter(p => p.studentId === payment.studentId);
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
              {(clubbedFeePayments.length === 0 || (selectedStudent && clubbedFeePayments.filter(p => p.studentId === selectedStudent.id).length === 0)) && (
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

      {/* Full Page View of Recent Payments */}
      <AnimatePresence>
        {showFullPayments && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed inset-0 z-50 bg-[#fafafa] flex flex-col overflow-hidden font-sans print:hidden"
          >
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-8 py-5 flex flex-col md:flex-row md:items-center md:justify-between shrink-0 gap-4 shadow-sm">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setShowFullPayments(false)} 
                  className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl text-gray-700 transition-all flex items-center justify-center border border-gray-100 shadow-sm"
                  title="Close and Back"
                >
                  <X size={20} />
                </button>
                <div>
                  <div className="flex items-center space-x-2">
                    <History className="text-blue-600" size={24} />
                    <h1 className="text-xl font-black text-[#141414] uppercase tracking-widest">Recent Payments</h1>
                  </div>
                  <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest mt-1">Full-screen audit ledger, searches and transaction controls</p>
                </div>
              </div>

              {/* Mini Stats Card */}
              {(() => {
                const visible = (clubbedFeePayments || []).filter(p => {
                  const student = (students || []).find(s => s.id === p.studentId);
                  if (!student) return false;

                  const matchesSearch = p.receiptNo.toLowerCase().includes(fullPageSearchTerm.toLowerCase()) || 
                    student.name.toLowerCase().includes(fullPageSearchTerm.toLowerCase()) ||
                    (student.fatherName && student.fatherName.toLowerCase().includes(fullPageSearchTerm.toLowerCase())) ||
                    student.contact.toLowerCase().includes(fullPageSearchTerm.toLowerCase());

                  const matchesCourse = fullPageFilterCourse === 'ALL' || student.course === fullPageFilterCourse;
                  const matchesBranch = fullPageFilterBranch === 'ALL' || student.franchiseId === fullPageFilterBranch;
                  
                  let matchesStatus = true;
                  if (fullPageFilterStatus === 'FULLY_PAID') {
                    matchesStatus = p.balance === 0;
                  } else if (fullPageFilterStatus === 'BALANCE_DUE') {
                    matchesStatus = p.balance > 0;
                  }

                  return matchesSearch && matchesCourse && matchesBranch && matchesStatus;
                });

                const totalPaidAmount = visible.reduce((total, p) => total + p.paidAmount, 0);
                const totalOutstanding = visible.reduce((total, p) => total + (p.balance || 0), 0);
                const totalDiscount = visible.reduce((total, p) => total + (p.discount || 0), 0);

                return (
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-2 text-center shadow-sm">
                      <span className="block text-[8px] font-black uppercase text-emerald-600 tracking-wider">Total Revenue</span>
                      <span className="text-sm font-black text-emerald-700 mt-0.5 block">₹{totalPaidAmount.toLocaleString()}</span>
                    </div>
                    <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-2 text-center shadow-sm">
                      <span className="block text-[8px] font-black uppercase text-red-600 tracking-wider">Total Outstanding</span>
                      <span className="text-sm font-black text-red-700 mt-0.5 block">₹{totalOutstanding.toLocaleString()}</span>
                    </div>
                    <div className="bg-orange-50 border border-orange-100 rounded-2xl px-5 py-2 text-center shadow-sm">
                      <span className="block text-[8px] font-black uppercase text-orange-600 tracking-wider">Discounts Allowed</span>
                      <span className="text-sm font-black text-orange-700 mt-0.5 block">₹{totalDiscount.toLocaleString()}</span>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-2 text-center shadow-sm">
                      <span className="block text-[8px] font-black uppercase text-gray-500 tracking-wider">Transactions</span>
                      <span className="text-sm font-black text-gray-700 mt-0.5 block">{visible.length}</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Controls Bar */}
            <div className="bg-white border-b border-gray-100 px-8 py-4 flex flex-col lg:flex-row items-center gap-4 shrink-0 shadow-sm">
              <div className="relative w-full lg:max-w-xs">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="SEARCH RECEIPT, STUDENT, PHONE..." 
                  value={fullPageSearchTerm}
                  onChange={(e) => setFullPageSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-[10px] font-black uppercase tracking-widest pl-11 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white placeholder-gray-400 transition-all text-gray-700"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto lg:ml-auto">
                {/* Branch Selection */}
                <div className="flex items-center space-x-1">
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-wider">Branch:</span>
                  <select 
                    value={fullPageFilterBranch}
                    onChange={(e) => setFullPageFilterBranch(e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 text-gray-700"
                  >
                    <option value="ALL">ALL BRANCHES</option>
                    {(franchises || []).map(f => (
                      <option key={f.id} value={f.id}>{f.name.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                {/* Course Selection */}
                <div className="flex items-center space-x-1">
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-wider">Course:</span>
                  <select 
                    value={fullPageFilterCourse}
                    onChange={(e) => setFullPageFilterCourse(e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 text-gray-700"
                  >
                    <option value="ALL">ALL COURSES</option>
                    {(Array.from(new Set((students || []).map(s => s.course)))).filter(Boolean).map(c => (
                      <option key={String(c)} value={String(c)}>{String(c).toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                {/* Status Selection */}
                <div className="flex items-center space-x-1">
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-wider">Status:</span>
                  <select 
                    value={fullPageFilterStatus}
                    onChange={(e) => setFullPageFilterStatus(e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 text-gray-700"
                  >
                    <option value="ALL">ALL STATUSES</option>
                    <option value="FULLY_PAID">FULLY PAID</option>
                    <option value="BALANCE_DUE">BALANCE DUE</option>
                  </select>
                </div>

                {/* Reset Button */}
                {(fullPageSearchTerm || fullPageFilterCourse !== 'ALL' || fullPageFilterBranch !== 'ALL' || fullPageFilterStatus !== 'ALL') && (
                  <button 
                    onClick={() => {
                      setFullPageSearchTerm('');
                      setFullPageFilterCourse('ALL');
                      setFullPageFilterBranch('ALL');
                      setFullPageFilterStatus('ALL');
                    }}
                    className="px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-auto bg-white custom-scrollbar">
              <div className="min-w-max">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-gray-50 z-10">
                    <tr className="border-b border-gray-200 bg-gray-100 text-[#111111] text-[11px] font-extrabold uppercase tracking-wider">
                      <th className="px-8 py-5">Receipt</th>
                      <th className="px-8 py-5">Inst.</th>
                      <th className="px-8 py-5">Student</th>
                      <th className="px-8 py-5">Father's Name</th>
                      <th className="px-8 py-5">Mobile No</th>
                      <th className="px-8 py-5">Course Name</th>
                      <th className="px-8 py-5">Fee Type</th>
                      <th className="px-8 py-5">Due Date</th>
                      <th className="px-8 py-5">Total Fees</th>
                      <th className="px-8 py-5">Discount</th>
                      <th className="px-8 py-5">Late Fees</th>
                      <th className="px-8 py-5">Paid</th>
                      <th className="px-8 py-5">Balance</th>
                      <th className="px-8 py-5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-250 bg-white">
                    {(() => {
                      const filteredPayments = (clubbedFeePayments || []).filter(p => {
                        const student = (students || []).find(s => s.id === p.studentId);
                        if (!student) return false;

                        const matchesSearch = p.receiptNo.toLowerCase().includes(fullPageSearchTerm.toLowerCase()) || 
                          student.name.toLowerCase().includes(fullPageSearchTerm.toLowerCase()) ||
                          (student.fatherName && student.fatherName.toLowerCase().includes(fullPageSearchTerm.toLowerCase())) ||
                          student.contact.toLowerCase().includes(fullPageSearchTerm.toLowerCase());

                        const matchesCourse = fullPageFilterCourse === 'ALL' || student.course === fullPageFilterCourse;
                        const matchesBranch = fullPageFilterBranch === 'ALL' || student.franchiseId === fullPageFilterBranch;
                        
                        let matchesStatus = true;
                        if (fullPageFilterStatus === 'FULLY_PAID') {
                          matchesStatus = p.balance === 0;
                        } else if (fullPageFilterStatus === 'BALANCE_DUE') {
                          matchesStatus = p.balance > 0;
                        }

                        return matchesSearch && matchesCourse && matchesBranch && matchesStatus;
                      });

                      if (filteredPayments.length === 0) {
                        return (
                          <tr>
                            <td colSpan={14} className="py-24 text-center">
                              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300 mb-4 shadow-inner">
                                <History size={32} />
                              </div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No matching payments found in ledger</p>
                            </td>
                          </tr>
                        );
                      }

                      return filteredPayments.slice().reverse().map(payment => {
                        const student = (students || []).find(s => s.id === payment.studentId);
                        const instStr = getInstallmentNumber(payment.date, payment.studentId);
                        const instNumber = instStr.match(/\d+/) ? instStr.match(/\d+/)![0] : (instStr === 'N/A' || !instStr ? '--' : instStr);

                        return (
                          <tr key={payment.id} className="hover:bg-blue-50/20 transition-colors group">
                            {/* Receipt */}
                            <td className="px-8 py-5">
                              <div className="flex flex-col">
                                <span className="text-[13px] font-extrabold text-[#111111] uppercase tracking-normal">{payment.receiptNo}</span>
                                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-normal mt-1">{payment.date}</span>
                              </div>
                            </td>

                            {/* Inst. */}
                            <td className="px-8 py-5">
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black text-blue-800 uppercase tracking-wider leading-none">INSTALLMENT</span>
                                <span className="text-[14px] font-black text-blue-800 mt-1.5 leading-none font-sans">{instNumber}</span>
                              </div>
                            </td>

                            {/* Student */}
                            <td className="px-8 py-5 font-black text-sm text-[#111111] uppercase tracking-tight">
                              {student?.name || 'Unknown'}
                            </td>

                            {/* FatherName */}
                            <td className="px-8 py-5 font-extrabold text-xs text-[#222222] uppercase tracking-tight">
                              {student?.fatherName || '--'}
                            </td>

                            {/* Contact */}
                            <td className="px-8 py-5 font-extrabold text-xs text-gray-950 uppercase tracking-normal">
                              {student?.contact || '--'}
                            </td>

                            {/* Course Name */}
                            <td className="px-8 py-5 font-black text-sm text-blue-800 uppercase tracking-normal">
                              {student?.course || '--'}
                            </td>

                            {/* Fee Type Badges stack */}
                            <td className="px-8 py-5">
                              <div className="flex flex-col gap-1.5 items-start">
                                {payment.feeType.split(/[\s,_|]+/).filter(Boolean).map((word, wIdx) => (
                                  <span key={wIdx} className="px-2.5 py-1 bg-gray-200 text-[10px] font-extrabold text-gray-900 uppercase tracking-wider rounded-lg border border-gray-300">
                                    {word}
                                  </span>
                                ))}
                              </div>
                            </td>

                            {/* Due Date */}
                            <td className="px-8 py-5 text-sm font-mono font-black text-red-600 uppercase tracking-wide">
                              {payment.dueDate || '--'}
                            </td>

                            {/* Total Fees */}
                            <td className="px-8 py-5 text-sm font-black text-gray-900">
                              ₹{(payment.amount ?? 0).toLocaleString()}
                            </td>

                            {/* Discount */}
                            <td className="px-8 py-5 text-sm font-black text-orange-600">
                              ₹{(payment.discount ?? 0).toLocaleString()}
                            </td>

                            {/* Late Fee */}
                            <td className="px-8 py-5 text-sm font-black text-red-600">
                              ₹{(payment.penalty ?? 0).toLocaleString()}
                            </td>

                            {/* Paid */}
                            <td className="px-8 py-5 text-sm font-black text-emerald-700">
                              ₹{payment.paidAmount.toLocaleString()}
                            </td>

                            {/* Balance */}
                            <td className="px-8 py-5 text-sm font-black text-red-600">
                              ₹{payment.balance.toLocaleString()}
                            </td>

                            {/* Actions */}
                            <td className="px-8 py-5">
                              <div className="flex items-center justify-center space-x-2">
                                 <button 
                                   onClick={() => {
                                     setReceiptType('SINGLE');
                                     setShowReceipt(payment);
                                   }}
                                   className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-100"
                                   title="Print Receipt"
                                  >
                                   <Printer size={16} />
                                 </button>
                                 <button 
                                   onClick={() => {
                                     const studentPayments = clubbedFeePayments.filter(p => p.studentId === payment.studentId);
                                     setReceiptType('HISTORY');
                                     setShowReceipt(studentPayments[studentPayments.length - 1]);
                                   }}
                                   className="p-2.5 text-gray-400 hover:text-purple-600 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-100"
                                   title="Print Summary"
                                 >
                                   <FileText size={16} />
                                 </button>
                                 <button 
                                   onClick={() => student && sendWhatsAppReceipt(payment, student)}
                                   className="p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-100"
                                   title="WhatsApp Reminder"
                                 >
                                   <MessageCircle size={16} />
                                 </button>
                              </div>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Fee Heads / Categories</h3>
                    <button type="button" onClick={addHead} className="text-[10px] font-black text-blue-600 uppercase flex items-center space-x-1 hover:underline">
                      <Plus size={12} />
                      <span>Add Head</span>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {paymentData.heads.map((head, idx) => (
                      <div key={idx} className="space-y-4 p-4 bg-gray-50 rounded-3xl relative group border border-gray-200">
                        {paymentData.heads.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => removeHead(idx)} 
                            className="absolute right-4 top-4 p-1.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-full bg-transparent border-0 font-bold transition-all shadow-sm z-10"
                            title="Remove Head"
                          >
                            <X size={14} />
                          </button>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[8px] font-black text-[#888888] uppercase tracking-widest">Type</label>
                            <select 
                              required
                              value={head.type}
                              onChange={(e) => {
                                const chosenType = e.target.value;
                                const newHeads = [...paymentData.heads];
                                newHeads[idx].type = chosenType;

                                const matched = (feeStructures || []).find(f => 
                                  f.status === 'ACTIVE' && 
                                  f.head === chosenType && 
                                  (f.courseName === selectedStudent?.course || f.courseId === 'all' || f.courseName === 'All IT Courses') &&
                                  f.session === selectedStudent?.session
                                ) || (feeStructures || []).find(f => 
                                  f.status === 'ACTIVE' && 
                                  f.head === chosenType && 
                                  (f.courseName === selectedStudent?.course || f.courseId === 'all' || f.courseName === 'All IT Courses')
                                );

                                const baseAmount = matched ? (matched.amount || 0) : 0;
                                const discount = matched ? (matched.discount || 0) : 0;
                                const pRate = matched ? (matched.latePenalty ?? 50) : 50;
                                const dDate = (head as any).dueDate || new Date().toISOString().split('T')[0];
                                
                                newHeads[idx].amount = chosenType === 'Course Fee' ? Math.max(0, (selectedStudent?.totalFees || 0) - (selectedStudent?.paidAmount || 0)) : baseAmount;
                                newHeads[idx].discount = chosenType === 'Course Fee' ? 0 : discount;
                                (newHeads[idx] as any).penaltyRate = pRate;
                                (newHeads[idx] as any).dueDate = dDate;
                                
                                // Recalculate dynamic penalty based on due date
                                newHeads[idx].penalty = getCalculatedPenalty(dDate, pRate);

                                const newTotalPayable = newHeads.reduce((acc, h) => acc + (h.amount + (h.penalty || 0) - (h.discount || 0)), 0);
                                const newModes = paymentData.paymentModes.map((m, mIdx) => mIdx === 0 ? { ...m, amount: newTotalPayable } : m);

                                setPaymentData({ 
                                  ...paymentData, 
                                  heads: newHeads,
                                  paymentModes: newModes
                                });
                              }}
                              className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-600 font-bold text-[10px] appearance-none"
                            >
                              <option value="Course Fee">Course Fee</option>
                              {(feeStructures || []).map(f => <option key={f.id} value={f.head}>{f.head}</option>)}
                              <option value="Admission Fee">Admission Fee</option>
                              <option value="Monthly Fee">Monthly Fee</option>
                              <option value="Exam Fee">Exam Fee</option>
                              <option value="Registration Fee">Registration Fee</option>
                              <option value="Certificate Fee">Certificate Fee</option>
                              <option value="Late Penalty">Late Penalty</option>
                              <option value="Prospectus Fee">Prospectus Fee</option>
                              <option value="Backpaper Fee">Backpaper Fee</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Due Date *</label>
                            <input 
                              type="date"
                              required
                              value={(head as any).dueDate || ''}
                              onChange={(e) => {
                                const dDate = e.target.value;
                                const newHeads = [...paymentData.heads];
                                (newHeads[idx] as any).dueDate = dDate;
                                
                                const pRate = (newHeads[idx] as any).penaltyRate || 0;
                                newHeads[idx].penalty = getCalculatedPenalty(dDate, pRate);
                                
                                const newTotalPayable = newHeads.reduce((acc, iH) => acc + (iH.amount + (iH.penalty || 0) - (iH.discount || 0)), 0);
                                const newModes = paymentData.paymentModes.map((m, mIdx) => mIdx === 0 ? { ...m, amount: newTotalPayable } : m);
                                
                                setPaymentData({ ...paymentData, heads: newHeads, paymentModes: newModes });
                              }}
                              className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none font-bold text-[10px]"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[8px] font-black text-[#888888] uppercase tracking-widest">Penalty Rate (₹/Day)</label>
                            <select
                              value={penaltyRateOptions.includes((head as any).penaltyRate ?? 0) ? ((head as any).penaltyRate ?? 0).toString() : 'custom'}
                              onChange={(e) => {
                                const val = e.target.value;
                                const pRate = val === 'custom' ? ((head as any).penaltyRate ?? 1) : Number(val);
                                const newHeads = [...paymentData.heads];
                                (newHeads[idx] as any).penaltyRate = pRate;
                                const dDate = (newHeads[idx] as any).dueDate || '';
                                newHeads[idx].penalty = getCalculatedPenalty(dDate, pRate);
                                const newTotalPayable = newHeads.reduce((acc, iH) => acc + (iH.amount + (iH.penalty || 0) - (iH.discount || 0)), 0);
                                const newModes = paymentData.paymentModes.map((m, mIdx) => mIdx === 0 ? { ...m, amount: newTotalPayable } : m);
                                setPaymentData({ ...paymentData, heads: newHeads, paymentModes: newModes });
                              }}
                              className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none font-bold text-[10px] appearance-none cursor-pointer"
                            >
                              {penaltyRateOptions.map(opt => (
                                <option key={opt} value={opt}>₹{opt}/Day</option>
                              ))}
                              <option value="custom">Custom...</option>
                            </select>
                            {!penaltyRateOptions.includes((head as any).penaltyRate ?? 0) && (
                              <input 
                                type="number"
                                required
                                value={(head as any).penaltyRate ?? ''}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => {
                                  const pRate = e.target.value === '' ? 0 : Number(e.target.value);
                                  const newHeads = [...paymentData.heads];
                                  (newHeads[idx] as any).penaltyRate = pRate;
                                  const dDate = (newHeads[idx] as any).dueDate || '';
                                  newHeads[idx].penalty = getCalculatedPenalty(dDate, pRate);
                                  const newTotalPayable = newHeads.reduce((acc, iH) => acc + (iH.amount + (iH.penalty || 0) - (iH.discount || 0)), 0);
                                  const newModes = paymentData.paymentModes.map((m, mIdx) => mIdx === 0 ? { ...m, amount: newTotalPayable } : m);
                                  setPaymentData({ ...paymentData, heads: newHeads, paymentModes: newModes });
                                }}
                                className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none font-bold text-[10px] mt-1"
                                placeholder="Enter rate..."
                              />
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                          <div className="space-y-1">
                            <label className="text-[8px] font-black text-[#141414] uppercase tracking-widest">Base Fee (₹)</label>
                            <input 
                              type="number"
                              required
                              value={head.amount || ''}
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => {
                                const v = e.target.value === '' ? 0 : Number(e.target.value);
                                const newHeads = [...paymentData.heads];
                                newHeads[idx].amount = v;
                                const newTotalPayable = newHeads.reduce((acc, iH) => acc + (iH.amount + (iH.penalty || 0) - (iH.discount || 0)), 0);
                                const newModes = paymentData.paymentModes.map((m, mIdx) => mIdx === 0 ? { ...m, amount: newTotalPayable } : m);
                                setPaymentData({ ...paymentData, heads: newHeads, paymentModes: newModes });
                              }}
                              className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none font-bold text-[10px]"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Disc (₹)</label>
                            <select
                              value={discountOptions.includes(head.discount ?? 0) ? (head.discount ?? 0).toString() : 'custom'}
                              onChange={(e) => {
                                const val = e.target.value;
                                const discountVal = val === 'custom' ? (head.discount ?? 1) : Number(val);
                                const newHeads = [...paymentData.heads];
                                newHeads[idx].discount = discountVal;
                                const newTotalPayable = newHeads.reduce((acc, iH) => acc + (iH.amount + (iH.penalty || 0) - (iH.discount || 0)), 0);
                                const newModes = paymentData.paymentModes.map((m, mIdx) => mIdx === 0 ? { ...m, amount: newTotalPayable } : m);
                                setPaymentData({ ...paymentData, heads: newHeads, paymentModes: newModes });
                              }}
                              className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none font-bold text-[10px] text-emerald-600 appearance-none cursor-pointer"
                            >
                              {discountOptions.map(opt => (
                                <option key={opt} value={opt}>₹{opt}</option>
                              ))}
                              <option value="custom">Custom...</option>
                            </select>
                            {!discountOptions.includes(head.discount ?? 0) && (
                              <input 
                                type="number"
                                required
                                value={head.discount || ''}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => {
                                  const v = e.target.value === '' ? 0 : Number(e.target.value);
                                  const newHeads = [...paymentData.heads];
                                  newHeads[idx].discount = v;
                                  const newTotalPayable = newHeads.reduce((acc, iH) => acc + (iH.amount + (iH.penalty || 0) - (iH.discount || 0)), 0);
                                  const newModes = paymentData.paymentModes.map((m, mIdx) => mIdx === 0 ? { ...m, amount: newTotalPayable } : m);
                                  setPaymentData({ ...paymentData, heads: newHeads, paymentModes: newModes });
                                }}
                                className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none font-bold text-[10px] text-emerald-600 mt-1"
                                placeholder="Enter discount..."
                              />
                            )}
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <label className="text-[8px] font-black text-red-500 uppercase tracking-widest">Pen / Late Fine (₹)</label>
                              {(() => {
                                const dDate = (head as any).dueDate;
                                if (dDate) {
                                  const today = new Date();
                                  today.setHours(0,0,0,0);
                                  const due = new Date(dDate);
                                  due.setHours(0,0,0,0);
                                  if (today > due) {
                                    const diffTime = today.getTime() - due.getTime();
                                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                                    return <span className="text-[7px] font-black text-red-500 uppercase bg-red-50 px-1 rounded">({diffDays} days late)</span>;
                                  }
                                }
                                return null;
                              })()}
                            </div>
                            <input 
                              type="number"
                              required
                              value={head.penalty !== undefined && head.penalty !== null ? head.penalty : ''}
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => {
                                const v = e.target.value === '' ? 0 : Number(e.target.value);
                                const newHeads = [...paymentData.heads];
                                newHeads[idx].penalty = v;
                                const newTotalPayable = newHeads.reduce((acc, iH) => acc + (iH.amount + (iH.penalty || 0) - (iH.discount || 0)), 0);
                                const newModes = paymentData.paymentModes.map((m, mIdx) => mIdx === 0 ? { ...m, amount: newTotalPayable } : m);
                                setPaymentData({ ...paymentData, heads: newHeads, paymentModes: newModes });
                              }}
                              className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none font-bold text-[10px] text-red-600"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Payment Modes / Transactions</h3>
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
                            <option>Cheque</option>
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
                            value={pm.amount || ''}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => {
                              const newModes = [...paymentData.paymentModes];
                              newModes[idx].amount = e.target.value === '' ? 0 : Number(e.target.value);
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

      <AnimatePresence>
        {showReceipt && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10 bg-black/60 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static print:overflow-visible">
            <motion.div 
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="bg-white rounded-[2rem] w-full max-w-4xl p-0 shadow-2xl relative my-auto min-h-max print:shadow-none print:p-0 print:max-w-full print:rounded-none"
            >
                <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between z-10 rounded-t-[2rem] print:hidden">
                   <h3 className="text-sm font-black text-[#141414] uppercase tracking-widest">
                     {receiptType === 'SINGLE' ? 'Fee Receipt Preview' : 'Student Fee Statement Preview'}
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

               <div className="p-8 relative bg-gray-50/50 print:bg-white print:p-0" id="printable-receipt">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 print:hidden">
                    {receiptType === 'SINGLE' && (
                      <div className="flex items-center space-x-2 bg-gray-100 p-1.5 rounded-2xl border border-gray-250">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-3">Paper Size:</span>
                        <button
                          type="button"
                          onClick={() => setPrintPaperSize('A5')}
                          className={clsx(
                            "px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all",
                            printPaperSize === 'A5' ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-gray-600 hover:bg-gray-200"
                          )}
                        >
                          A5 Landscape
                        </button>
                        <button
                          type="button"
                          onClick={() => setPrintPaperSize('A4')}
                          className={clsx(
                            "px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all",
                            printPaperSize === 'A4' ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-gray-600 hover:bg-gray-200"
                          )}
                        >
                          A4 Portrait
                        </button>
                      </div>
                    )}
                    <div className="flex items-center space-x-3 ml-auto">
                      <button 
                        onClick={() => {
                          const student = students.find(s => s.id === showReceipt.studentId);
                          if (student) sendWhatsAppReceipt(showReceipt, student);
                        }}
                        className="flex items-center space-x-2 px-6 py-4 bg-white border border-gray-200 text-[#141414] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                      >
                        <MessageCircle size={16} className="text-emerald-600" />
                        <span>Send on WhatsApp</span>
                      </button>
                      <button 
                        onClick={() => {
                          window.print();
                        }}
                        type="button"
                        className="flex items-center space-x-2 px-8 py-4 bg-[#141414] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-black/20 active:scale-95"
                      >
                        <Printer size={16} />
                        <span>Print Official Copy</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white relative shadow-sm border border-gray-200 p-8 max-w-[210mm] mx-auto print:border-0 print:shadow-none print:p-4">
                     {/* Watermark Logo */}
                     <div className="absolute inset-0 z-0 opacity-[0.03] flex items-center justify-center pointer-events-none overflow-hidden grayscale">
                        {businessProfile.receiptHeaderUrl ? (
                           <img src={businessProfile.receiptHeaderUrl} alt="Logo" className="w-[80%] h-auto rotate-[-30deg]" />
                        ) : businessProfile.headerImageUrl && (
                           <img src={businessProfile.headerImageUrl} alt="Logo" className="w-[80%] h-auto rotate-[-30deg]" />
                        )}
                     </div>

                     <div className="relative z-10">
                        {/* Header Image Block */}
                        <div className="border-b-2 border-black pb-2 mb-4">
                           {businessProfile.receiptHeaderUrl ? (
                              <img src={businessProfile.receiptHeaderUrl} alt="Header" className="w-full h-auto object-contain block" style={{ maxHeight: '180px' }} />
                           ) : businessProfile.headerImageUrl ? (
                              <img src={businessProfile.headerImageUrl} alt="Header" className="w-full h-auto object-contain block" style={{ maxHeight: '180px' }} />
                           ) : (
                              <div className="flex flex-col items-center text-center">
                                 <p className="text-[10px] font-bold text-gray-800">An ISO 9001 : 2015 Certified Institute</p>
                                 <h1 className="text-4xl font-black text-red-600 tracking-tight uppercase leading-none mt-1">{businessProfile.name}</h1>
                                 <p className="text-[10px] font-black">{businessProfile.address} - Pin: {businessProfile.pincode}</p>
                                 <p className="text-[10px] font-black">Contact: {businessProfile.contact} | {businessProfile.email}</p>
                              </div>
                           )}
                        </div>

                        <div className="flex items-center justify-center mb-6">
                           <span className={clsx(
                             "px-8 py-2 border-2 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-sm",
                             receiptType === 'SINGLE' ? "border-blue-600 text-blue-600" : "border-emerald-600 text-emerald-600"
                           )}>
                              {receiptType === 'SINGLE' ? 'FEE RECEIPT' : 'STUDENT FEE STATEMENT'}
                           </span>
                        </div>

                        {(() => {
                           const student = students.find(s => s.id === showReceipt.studentId);
                           if (!student) return null;

                           return (
                             <div className="grid grid-cols-2 divide-x-2 divide-black border-2 border-black mb-8 text-[11px]">
                               <div className="divide-y-2 divide-black">
                                 <div className="grid grid-cols-2 divide-x-2 divide-black h-10">
                                   <div className="px-4 flex items-center font-black bg-blue-50 text-[10px]">Branch / Franchise</div>
                                   <div className="px-4 flex items-center font-bold uppercase truncate text-[10px] text-blue-600">{student.studyCenter || franchises.find(f => f.id === student.franchiseId)?.name || 'N/A'}</div>
                                 </div>
                                 <div className="grid grid-cols-2 divide-x-2 divide-black h-10">
                                   <div className="px-4 flex items-center font-black bg-blue-50 text-[10px]">Admission Date</div>
                                   <div className="px-4 flex items-center font-bold uppercase text-[10px]">{student.admissionDate}</div>
                                 </div>
                                 <div className="grid grid-cols-2 divide-x-2 divide-black h-10">
                                   <div className="px-4 flex items-center font-black bg-blue-50 text-[10px]">Course</div>
                                   <div className="px-4 flex items-center font-black text-[10px] text-red-600 leading-tight">{student.course} ({student.courseDuration || 'N/A'})</div>
                                 </div>
                                 <div className="grid grid-cols-2 divide-x-2 divide-black h-10">
                                   <div className="px-4 flex items-center font-black bg-blue-50 text-[10px]">Mobile</div>
                                   <div className="px-4 flex items-center font-bold uppercase text-[10px]">{student.contact}</div>
                                 </div>
                                 <div className="grid grid-cols-2 divide-x-2 divide-black h-10">
                                   <div className="px-4 flex items-center font-black bg-blue-50 text-blue-600 text-[10px]">Student Name</div>
                                   <div className="px-4 flex items-center font-black uppercase text-blue-600 text-[10px]">{student.name}</div>
                                 </div>
                               </div>

                               <div className="divide-y-2 divide-black text-left">
                                 <div className="grid grid-cols-2 divide-x-2 divide-black h-10">
                                   <div className="px-4 flex items-center font-black bg-blue-50 text-[10px]">Receipt No</div>
                                   <div className="px-4 flex items-center font-bold uppercase text-[10px]">{showReceipt.receiptNo}</div>
                                 </div>
                                 <div className="grid grid-cols-2 divide-x-2 divide-black h-10">
                                   <div className="px-4 flex items-center font-black bg-blue-50 text-[10px]">Date / Time</div>
                                   <div className="px-4 flex items-center font-bold uppercase text-[10px]">
                                     {showReceipt.date} {showReceipt.collectionTime && `| ${showReceipt.collectionTime}`}
                                   </div>
                                 </div>
                                 <div className="grid grid-cols-2 divide-x-2 divide-black h-10">
                                   <div className="px-4 flex items-center font-black bg-blue-50 text-[10px]">Enrollment No</div>
                                   <div className="px-4 flex items-center font-black uppercase text-blue-600 text-[10px]">{student.enrollmentNo || student.admissionNo || '--'}</div>
                                 </div>
                                 <div className="grid grid-cols-2 divide-x-2 divide-black h-10">
                                   <div className="px-4 flex items-center font-black bg-blue-50 text-[10px]">Father's Name</div>
                                   <div className="px-4 flex items-center font-bold uppercase text-[10px]">{student.fatherName}</div>
                                 </div>
                                 <div className="grid grid-cols-2 divide-x-2 divide-black h-10">
                                   <div className="px-4 flex items-center font-black bg-blue-50 text-[10px]">Total Course Fee</div>
                                   <div className="px-4 flex items-center font-bold uppercase text-[10px]">₹{student.totalFees || '--'}</div>
                                  </div>
                                  <div className="grid grid-cols-2 divide-x-2 divide-black h-10">
                                    <div className="px-4 flex items-center font-black bg-blue-50 text-blue-600 text-[10px]">INSTALLMENT</div>
                                    <div className="px-4 flex items-center font-black uppercase text-blue-600 text-[10px]">
                                      {getInstallmentNumber(showReceipt.date, showReceipt.studentId)}
                                    </div>
                                 </div>
                               </div>
                             </div>
                           );
                        })()}

                        {/* Course Fee Summary Section */}
                        <div className="mb-6">
                           <div className="bg-[#141414] text-white px-4 py-2 flex items-center mb-2">
                              <FileText size={14} className="mr-2" />
                              <span className="text-[10px] font-black uppercase tracking-widest">
                                 Course Fee Summary
                              </span>
                           </div>
                           <table className="w-full border-t-[1.5px] border-l-[1.5px] border-black text-center text-[9px] mb-6 overflow-hidden">
                              <thead>
                                 <tr className="bg-gray-100 divide-x-[1.5px] divide-black border-b-[1.5px] border-black font-black uppercase text-[#141414]">
                                    <th className="py-2.5 w-10">#</th>
                                    <th className="py-2.5 px-4 text-left">Fees Type</th>
                                    <th className="py-2.5">Amount</th>
                                    <th className="py-2.5">Discount</th>
                                    <th className="py-2.5">Penalty</th>
                                    <th className="py-2.5">Paid</th>
                                    <th className="py-2.5">Balance</th>
                                    <th className="py-2.5">Status</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y-[1.5px] divide-black border-b-[1.5px] border-r-[1.5px] border-black font-bold uppercase text-gray-900">
                                 {(() => {
                                   const student = students.find(s => s.id === showReceipt.studentId);
                                   if (!student) return null;
                                   
                                   const studentPayments = clubbedFeePayments.filter(p => p.studentId === student.id);
                                   const summary: Record<string, { amount: number, discount: number, penalty: number, paid: number }> = {};
                                   
                                   summary['Course Fee'] = {
                                     amount: student.totalFees || 0,
                                     discount: 0,
                                     penalty: 0,
                                     paid: 0
                                   };

                                   studentPayments.forEach(p => {
                                     const heads = p.heads || [{ type: p.feeType, amount: p.amount, discount: p.discount, penalty: p.penalty }];
                                     heads.forEach(h => {
                                       if (!summary[h.type]) {
                                          summary[h.type] = { amount: h.amount, discount: 0, penalty: 0, paid: 0 };
                                       }
                                     });
                                   });

                                   studentPayments.forEach(p => {
                                      const heads = p.heads || [{ type: p.feeType, amount: p.amount, discount: p.discount, penalty: p.penalty }];
                                      heads.forEach(h => {
                                         if (summary[h.type]) {
                                            const headPayable = h.amount + (h.penalty || 0) - (h.discount || 0);
                                            const receiptPayable = (p.heads || []).reduce((sum, h2) => sum + (h2.amount + (h2.penalty || 0) - (h2.discount || 0)), 0) || (p.amount + (p.penalty || 0) - (p.discount || 0)) || 1;
                                            summary[h.type].paid += p.paidAmount * (headPayable / receiptPayable);
                                            summary[h.type].discount += h.discount || 0;
                                            summary[h.type].penalty += h.penalty || 0;
                                         }
                                      });
                                   });

                                   return Object.entries(summary)
                                     // Included Course Fee in Summary
                                     .map(([type, data], idx) => {
                                     const isCourseFee = type === 'Course Fee';
                                     const displayAmount = isCourseFee ? (data.amount + data.discount) : data.amount;
                                     const balance = Math.max(0, (displayAmount + data.penalty) - data.discount - data.paid);
                                     const status = balance <= 0 ? 'Paid' : (data.paid > 0 ? 'Partial' : 'Pending');
                                     
                                     return (
                                       <tr key={idx} className="divide-x-[1.5px] divide-black bg-white">
                                          <td className="py-2.5">{idx + 1}</td>
                                          <td className="py-2.5 px-4 text-left font-black">{type}</td>
                                          <td className="py-2.5 font-black text-emerald-600 font-black">₹{displayAmount.toFixed(2)}</td>
                                          <td className="py-2.5 text-orange-500 font-black">₹{data.discount.toFixed(2)}</td>
                                          <td className="py-2.5 text-red-600 font-black">₹{data.penalty.toFixed(2)}</td>
                                          <td className="py-2.5 text-blue-600 font-black font-black">₹{data.paid.toFixed(2)}</td>
                                          <td className="py-2.5 font-black text-[#141414]">₹{balance.toFixed(2)}</td>
                                          <td className="py-2.5">
                                             <span className={clsx(
                                                "px-2 py-0.5 rounded text-[8px] font-black uppercase text-white shadow-sm",
                                                status === 'Paid' ? "bg-emerald-500" : status === 'Partial' ? "bg-orange-500" : "bg-red-500"
                                             )}>{status}</span>
                                          </td>
                                       </tr>
                                     );
                                   });
                                 })()}
                              </tbody>
                           </table>
                        </div>
                        
                        {receiptType === 'SINGLE' ? (
                          <>
                             <div className="bg-blue-600 text-white px-4 py-2 flex items-center mb-0 print:bg-blue-600">
                                <FileText size={14} className="mr-2" />
                                <span className="text-[10px] font-black uppercase tracking-widest">FEES DEPOSITED DETAILS</span>
                             </div>

                             <table className="w-full border-t-[1.5px] border-l-[1.5px] border-black text-center text-[9px] mb-0">
                                <thead>
                                   <tr className="bg-gray-100 divide-x-[1.5px] divide-black border-b-[1.5px] border-black font-black uppercase text-[#141414]">
                                      <th className="py-2.5 px-4 text-left">PARTICULARS</th>
                                      <th className="py-2.5">AMOUNT</th>
                                      <th className="py-2.5">DISC.</th>
                                      <th className="py-2.5">PEN.</th>
                                      <th className="py-2.5">TOTAL</th>
                                   </tr>
                                </thead>
                                <tbody className="divide-y-[1.5px] divide-black border-b-[1.5px] border-r-[1.5px] border-black font-bold uppercase">
                                   {(showReceipt.heads && showReceipt.heads.length > 0 ? showReceipt.heads : [{ type: showReceipt.feeType, amount: showReceipt.amount, discount: showReceipt.discount, penalty: showReceipt.penalty, dueDate: showReceipt.dueDate }]).map((h, idx) => (
                                      <tr key={idx} className="divide-x-[1.5px] divide-black bg-white">
                                         <td className="py-2.5 px-4 text-left font-black">
                                           {h.type}
                                           {h.dueDate && <span className="text-[8px] text-red-600 block lowercase font-mono"> (due: {h.dueDate})</span>}
                                         </td>
                                         <td className="py-2.5">₹{h.amount.toFixed(2)}</td>
                                         <td className="py-2.5 text-orange-500">₹{h.discount.toFixed(2)}</td>
                                         <td className="py-2.5 text-red-600">₹{h.penalty.toFixed(2)}</td>
                                         <td className="py-2.5 font-black">₹{(h.amount + h.penalty - h.discount).toFixed(2)}</td>
                                      </tr>
                                   ))}
                                   <tr className="bg-gray-50 border-t-[1.5px] border-black font-black divide-x-[1.5px] divide-black border-r-[1.5px] border-black text-[10px]">
                                      <td className="py-2.5 px-4 text-left uppercase">
                                         TOTAL PAID (IN WORDS: {numberToWords(showReceipt.paidAmount)} ONLY)
                                      </td>
                                      <td colSpan={4} className="py-2.5 text-[11px] font-black text-center">
                                         ₹{showReceipt.paidAmount.toLocaleString()}
                                      </td>
                                   </tr>
                                 </tbody>
                              </table>

                              <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="space-y-0">
                                   <div className="bg-emerald-600 text-white px-4 py-2 flex items-center print:bg-emerald-600">
                                      <Clock size={14} className="mr-2" />
                                      <span className="text-[9px] font-black uppercase tracking-widest">PAYMENT MODES</span>
                                   </div>
                                   <div className="border-[1.5px] border-black p-4 min-h-[80px] flex flex-col justify-center">
                                      {showReceipt.paymentModes?.map((m, i) => (
                                         <div key={i} className="flex justify-between text-[11px] font-black border-b border-gray-100 last:border-0 pb-1">
                                            <span className="uppercase">{m.mode} {m.transactionId && `[ ${m.transactionId} ]`}</span>
                                            <span>₹{m.amount.toLocaleString()}</span>
                                         </div>
                                      )) || (
                                         <div className="flex justify-between text-[11px] font-black">
                                            <span className="uppercase">{showReceipt.paymentMode}</span>
                                            <span>₹{showReceipt.paidAmount.toLocaleString()}</span>
                                         </div>
                                      )}
                                      {showReceipt.remarks && (
                                         <div className="pt-2 text-[8px] font-bold italic border-t border-black/10 mt-2">
                                            Note: {showReceipt.remarks}
                                         </div>
                                      )}
                                   </div>
                                </div>
 
                                <div className="space-y-0">
                                   <div className="bg-red-600 text-white px-4 py-2 flex items-center print:bg-red-600">
                                      <GraduationCap size={14} className="mr-2" />
                                      <span className="text-[9px] font-black uppercase tracking-widest">FEE SUMMARY</span>
                                   </div>
                                   <div className="border-[1.5px] border-black p-4 min-h-[80px] flex flex-col justify-center bg-gray-50/50">
                                      <div className="flex justify-between items-center text-[12px] font-black">
                                         <span className="uppercase tracking-wider">BALANCE DUE</span>
                                         <span className="text-red-600 text-lg tracking-tight">₹{showReceipt.balance.toLocaleString()}</span>
                                      </div>
                                   </div>
                                </div>
                             </div>
                          </>
                        ) : (
                          <>
                             <div className="bg-emerald-600/5 p-3 text-center border-y border-emerald-600/20 mb-4">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-700">
                                   DEPOSITED FEE HISTORY
                                </h2>
                             </div>

                            <table className="w-full border-t-[1.5px] border-l-[1.5px] border-black text-center text-[9px] mb-8">
                                <thead className="bg-[#141414] text-white">
                                   <tr className="divide-x-[1.5px] divide-black border-b-[1.5px] border-black">
                                      <th className="py-2 uppercase font-black w-8">#</th>
                                      <th className="py-2 uppercase font-black">Installment</th>
                                      <th className="py-2 uppercase font-black">Receipt No.</th>
                                      <th className="py-2 uppercase font-black">Fee Type</th>
                                      <th className="py-2 uppercase font-black">Amount</th>
                                      <th className="py-2 uppercase font-black">Pay Mode</th>
                                      <th className="py-2 uppercase font-black">Date</th>
                                   </tr>
                                </thead>
                                <tbody className="divide-y-[1.5px] divide-black border-b-[1.5px] border-r-[1.5px] border-black">
                                   {(() => {
                                      const studentPayments = (clubbedFeePayments || [])
                                        .filter(p => p.studentId === showReceipt.studentId)
                                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                                      
                                      let rowIdx = 1;
                                      return studentPayments.flatMap((p) => {
                                        const modes = p.paymentModes && p.paymentModes.length > 0 
                                          ? p.paymentModes 
                                          : [{ mode: p.paymentMode, amount: p.paidAmount }];
                                        
                                        return modes.map((m, mIdx) => (
                                          <tr key={`${p.id}-${mIdx}`} className="divide-x-[1.5px] divide-black font-bold">
                                             <td className="py-2">{rowIdx++}</td>
                                             <td className="py-2">{getInstallmentNumber(p.date, p.studentId)}</td>
                                             <td className="py-2">{p.receiptNo}</td>
                                             <td className="py-2 uppercase">{p.feeType}</td>
                                             <td className="py-2">₹{m.amount.toLocaleString()}</td>
                                             <td className="py-2 uppercase">{m.mode}</td>
                                             <td className="py-2">{p.date}</td>
                                          </tr>
                                        ));
                                      });
                                   })()}
                                   {(() => {
                                       const studentPayments = (clubbedFeePayments || []).filter(p => p.studentId === showReceipt.studentId);
                                       const totalPaid = studentPayments.reduce((acc, p) => acc + p.paidAmount, 0);
                                       
                                       return (
                                          <>
                                            <tr className="divide-x-[1.5px] divide-black bg-gray-50 font-black text-[10px]">
                                                <td colSpan={4} className="py-3 uppercase text-right px-6">Total Paid Fees</td>
                                                <td colSpan={3} className="py-3 text-emerald-600 border-r-[1.5px] border-black">₹{totalPaid.toLocaleString()}</td>
                                            </tr>
                                            <tr className="divide-x-[1.5px] divide-black bg-gray-50 font-black text-[10px] border-t-[1.5px] border-black">
                                                <td colSpan={7} className="py-2.5 px-4 text-left uppercase text-[9px] border-r-[1.5px] border-black">
                                                   TOTAL PAID (IN WORDS): {numberToWords(totalPaid)} ONLY
                                                </td>
                                            </tr>
                                          </>
                                        );
                                    })()}
                                 </tbody>
                             </table>
                          </>
                        )}

                        <div className="flex justify-between items-end mt-12 border-t-2 border-black pt-8">
                           <div className="text-[9px] font-black space-y-4 max-w-[65%]">
                              <p className="text-red-600 underline">Instructions:</p>
                              <ol className="list-decimal list-inside space-y-1">
                                 <li>Fees once paid are non-refundable.</li>
                                 <li>Once the fee has been paid, it will neither be refunded under any circumstances nor transferred or adjusted to any other course or student.</li>
                                 <li>Kindly deposit the fee on time.</li>
                                 <li>A late fee of ₹50 per day will be charged after the due date.</li>
                              </ol>
                           </div>
                           <div className="text-center">
                              <div className="w-32 border-b-2 border-black mb-1 mx-auto"></div>
                              <p className="text-[10px] font-black uppercase">Center Head Signature</p>
                              <p className="text-[8px] font-bold text-gray-500">(Office Seal Required)</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
