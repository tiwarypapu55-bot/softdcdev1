/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users,
  Search,
  Filter,
  CreditCard,
  History,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  ChevronDown,
  User,
  Building2,
  Calendar,
  X,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { Student, FeePayment } from '../../types';

export const StudentLedger = () => {
  const { students, feePayments, franchises, courses, currentUser, businessProfile } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranch, setFilterBranch] = useState(currentUser?.role === 'FRANCHISE' ? currentUser.franchiseId : 'ALL');
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  const filteredStudents = students.filter(s => {
    if (currentUser?.role === 'FRANCHISE' && s.franchiseId !== currentUser.franchiseId) return false;
    
    const franchise = franchises.find(f => f.id === s.franchiseId);
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (franchise && franchise.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBranch = filterBranch === 'ALL' || s.franchiseId === filterBranch;
    
    return matchesSearch && matchesBranch;
  });

  const getStudentLedger = (student: Student) => {
    const studentPayments = feePayments.filter(p => p.studentId === student.id);
    const totalPaid = studentPayments.reduce((acc, p) => acc + p.paidAmount, 0);
    const balance = (student.totalFees || 0) - totalPaid;

    // Build transaction list
    // 1. Initial Debit (Course Fee)
    const transactions = [
      {
        id: `debit-${student.id}`,
        date: student.admissionDate,
        description: `Course Admission: ${student.course}`,
        type: 'DEBIT',
        amount: student.totalFees || 0,
        balance: student.totalFees || 0
      }
    ];

    // 2. Credits (Payments)
    let runningBalance = student.totalFees || 0;
    const sortedPayments = [...studentPayments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    sortedPayments.forEach(p => {
      runningBalance -= p.paidAmount;
      transactions.push({
        id: p.id,
        date: p.date,
        description: `Fee Receipt: ${p.receiptNo} (${p.feeType})`,
        type: 'CREDIT',
        amount: p.paidAmount,
        balance: runningBalance
      });
    });

    return {
      transactions,
      totalPaid,
      balance,
      totalDebit: student.totalFees || 0
    };
  };

  const exportMasterLedger = () => {
    const headers = ['Student ID', 'Name', 'Course', 'Branch', 'Total Fee', 'Total Paid', 'Balance', 'Status'];
    const data = students.map(student => {
      const ledger = getStudentLedger(student);
      const branch = franchises.find(f => f.id === student.franchiseId);
      return [
        student.admissionNo,
        student.name,
        student.course,
        branch?.name || 'N/A',
        ledger.totalDebit,
        ledger.totalPaid,
        ledger.balance,
        ledger.balance <= 0 ? 'Full Paid' : 'Pending'
      ];
    });

    const csvContent = [headers, ...data].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `master_ledger_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [printStudent, setPrintStudent] = useState<Student | null>(null);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#141414] tracking-tight uppercase">Detailed Student Ledger</h1>
          <p className="text-sm text-[#888888] font-mono">Complete financial history (Debits & Credits) for every student</p>
        </div>
        <button 
          onClick={exportMasterLedger}
          className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#141414] hover:bg-gray-50 shadow-sm transition-all border-b-2"
        >
          <Download size={14} />
          <span>Export Master Ledger</span>
        </button>
      </div>

      <AnimatePresence>
        {printStudent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/60 backdrop-blur-md overflow-y-auto pt-20 pb-20">
            <motion.div 
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="bg-white rounded-[2rem] w-full max-w-4xl p-0 shadow-2xl relative my-auto min-h-[500px]"
            >
               <div className="p-6 border-b border-gray-100 flex items-center justify-between z-10 print:hidden">
                  <h3 className="text-xs font-black text-[#141414] uppercase tracking-widest">Statement of Account</h3>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => window.print()}
                      className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                    >
                      Print Statement
                    </button>
                    <button onClick={() => setPrintStudent(null)} className="p-3 bg-gray-100 text-gray-400 hover:text-red-500 rounded-2xl transition-all">
                      <X size={20} />
                    </button>
                  </div>
               </div>

               <div className="p-8 md:p-12 print:p-0" id="printable-ledger">
                  <div className="bg-white p-6 md:p-10 border border-gray-200 print:border-0 rounded-3xl print:rounded-none">
                    <div className="text-center mb-10 border-b-2 border-black pb-6">
                      {businessProfile.receiptHeaderUrl ? (
                        <img src={businessProfile.receiptHeaderUrl} alt="Header" className="w-full h-auto mx-auto" />
                      ) : (
                        <div className="flex flex-col items-center">
                          <h1 className="text-3xl font-black uppercase tracking-tighter text-blue-600">{businessProfile.name || 'Softdev Tally Guru'}</h1>
                          <p className="text-[10px] font-black uppercase tracking-widest mt-1">Detailed Student Ledger Statement</p>
                          <p className="text-[9px] font-bold text-gray-400 mt-2">Statement Generated On: {new Date().toLocaleString()}</p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-10">
                      <div className="space-y-2">
                        <div className="flex text-[11px]"><span className="w-24 font-black uppercase">Name:</span> <span className="font-bold uppercase flex-1">{printStudent.name}</span></div>
                        <div className="flex text-[11px]"><span className="w-24 font-black uppercase">ID:</span> <span className="font-bold uppercase flex-1">{printStudent.admissionNo}</span></div>
                        <div className="flex text-[11px]"><span className="w-24 font-black uppercase">Course:</span> <span className="font-bold uppercase flex-1">{printStudent.course} ({printStudent.courseDuration || 'N/A'})</span></div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex text-[11px]"><span className="w-24 font-black uppercase text-right md:text-left">Franchise:</span> <span className="font-bold uppercase flex-1 text-right md:text-left">{franchises.find(f => f.id === printStudent.franchiseId)?.name || 'N/A'}</span></div>
                        <div className="flex text-[11px]"><span className="w-24 font-black uppercase text-right md:text-left">Contact:</span> <span className="font-bold uppercase flex-1 text-right md:text-left">{printStudent.contact}</span></div>
                        <div className="flex text-[11px]"><span className="w-24 font-black uppercase text-right md:text-left">Date:</span> <span className="font-bold uppercase flex-1 text-right md:text-left">{printStudent.admissionDate}</span></div>
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-gray-300 mb-10">
                      <table className="w-full text-[10px]">
                        <thead>
                          <tr className="bg-gray-100 divide-x divide-gray-300 border-b border-gray-300">
                            <th className="p-3 text-left font-black uppercase">Date</th>
                            <th className="p-3 text-left font-black uppercase">Narration</th>
                            <th className="p-3 text-right font-black uppercase">Debit (Dr.)</th>
                            <th className="p-3 text-right font-black uppercase">Credit (Cr.)</th>
                            <th className="p-3 text-right font-black uppercase">Balance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300">
                          {getStudentLedger(printStudent).transactions.map((tx, idx) => (
                            <tr key={idx} className="divide-x divide-gray-300">
                              <td className="p-3 font-bold whitespace-nowrap">{tx.date}</td>
                              <td className="p-3 font-bold uppercase">{tx.description}</td>
                              <td className="p-3 text-right font-black text-red-600">{tx.type === 'DEBIT' ? `₹${tx.amount.toLocaleString()}` : '-'}</td>
                              <td className="p-3 text-right font-black text-emerald-600">{tx.type === 'CREDIT' ? `₹${tx.amount.toLocaleString()}` : '-'}</td>
                              <td className="p-3 text-right font-black">₹{tx.balance.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-end pr-4">
                      <div className="w-full md:w-64 space-y-3">
                        <div className="flex justify-between text-[11px] font-black border-b border-gray-100 pb-2">
                           <span className="uppercase text-gray-400">Total Fees:</span>
                           <span>₹{getStudentLedger(printStudent).totalDebit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-[11px] font-black border-b border-gray-100 pb-2">
                           <span className="uppercase text-gray-400">Total Paid:</span>
                           <span className="text-emerald-600">₹{getStudentLedger(printStudent).totalPaid.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-[14px] font-black pt-2">
                           <span className="uppercase">Net Balance:</span>
                           <span className="text-red-600">₹{getStudentLedger(printStudent).balance.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-20 pt-10 grid grid-cols-2 gap-12 text-center border-t border-gray-100">
                      <div><div className="border-b border-black w-40 mx-auto mb-2"></div><p className="text-[10px] font-black uppercase tracking-widest text-[#888888]">Student signature</p></div>
                      <div><div className="border-b border-black w-40 mx-auto mb-2"></div><p className="text-[10px] font-black uppercase tracking-widest text-[#888888]">Center Authorized</p></div>
                    </div>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #printable-ledger, #printable-ledger * { visibility: visible !important; }
          #printable-ledger { position: fixed !important; left: 0 !important; top: 0 !important; width: 100% !important; margin: 0 !important; padding: 2cm !important; background: white !important; z-index: 9999; }
          .print\:hidden { display: none !important; }
        }
      `}</style>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, roll no or branch..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
          />
        </div>
        <div>
          <select 
            disabled={currentUser?.role === 'FRANCHISE'}
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold appearance-none disabled:bg-gray-100 disabled:text-gray-400 text-[10px] uppercase tracking-widest"
          >
            <option value="ALL">All Branches</option>
            {franchises.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>
        <div className="bg-blue-600 p-4 rounded-2xl flex items-center justify-between text-white">
           <div className="flex items-center space-x-3">
              <CreditCard size={20} />
              <div>
                 <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Global Outstanding</p>
                 <p className="text-xl font-black leading-none">
                    ₹{filteredStudents.reduce((acc, s) => {
                      const ledger = getStudentLedger(s);
                      return acc + ledger.balance;
                    }, 0).toLocaleString()}
                 </p>
              </div>
           </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-8 py-5 text-[10px] font-black text-[#888888] uppercase tracking-widest">Student Information</th>
              <th className="px-8 py-5 text-[10px] font-black text-[#888888] uppercase tracking-widest">Branch</th>
              <th className="px-8 py-5 text-[10px] font-black text-[#888888] uppercase tracking-widest text-right">Debit (Fee)</th>
              <th className="px-8 py-5 text-[10px] font-black text-[#888888] uppercase tracking-widest text-right">Credit (Paid)</th>
              <th className="px-8 py-5 text-[10px] font-black text-[#888888] uppercase tracking-widest text-right">Balance Due</th>
              <th className="px-8 py-5 text-[10px] font-black text-[#888888] uppercase tracking-widest text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredStudents.map(student => {
              const ledger = getStudentLedger(student);
              const branch = franchises.find(f => f.id === student.franchiseId);
              const isExpanded = expandedStudent === student.id;

              return (
                <React.Fragment key={student.id}>
                  <tr 
                    onClick={() => setExpandedStudent(isExpanded ? null : student.id)}
                    className={clsx(
                      "group cursor-pointer transition-colors",
                      isExpanded ? "bg-blue-50/50" : "hover:bg-gray-50"
                    )}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                         <div className={clsx(
                           "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:rotate-90",
                           isExpanded ? "rotate-90 text-blue-600 bg-blue-100" : "text-gray-300"
                         )}>
                            <ChevronRight size={18} />
                         </div>
                         <div>
                            <p className="text-xs font-black text-[#141414] uppercase truncate max-w-[200px]">{student.name}</p>
                            <p className="text-[8px] font-black text-blue-600 font-mono tracking-widest uppercase">ID: {student.admissionNo}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-2 text-[#888888]">
                         <Building2 size={12} />
                         <span className="text-[10px] font-bold uppercase truncate max-w-[120px]">{branch?.name || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right font-mono font-black text-xs text-[#141414]">₹{ledger.totalDebit.toLocaleString()}</td>
                    <td className="px-8 py-6 text-right font-mono font-black text-xs text-emerald-600">₹{ledger.totalPaid.toLocaleString()}</td>
                    <td className="px-8 py-6 text-right font-mono font-black text-xs text-red-600">₹{ledger.balance.toLocaleString()}</td>
                    <td className="px-8 py-6">
                       <div className="flex justify-center">
                          <span className={clsx(
                            "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tight",
                            ledger.balance <= 0 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                          )}>
                             {ledger.balance <= 0 ? 'Full Paid' : 'Pending'}
                          </span>
                       </div>
                    </td>
                  </tr>

                  {/* Expanded Detailed View */}
                  <AnimatePresence>
                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="px-8 py-0 border-none">
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                             <div className="pb-8 pt-2">
                                <div className="bg-white border-x border-b border-gray-100 rounded-b-[2rem] shadow-inner p-8 space-y-6">
                                   <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                      <div className="flex items-center space-x-3">
                                         <History className="text-blue-600" size={18} />
                                         <h3 className="text-xs font-black text-[#141414] uppercase tracking-widest">Transaction Audit Log</h3>
                                         <button 
                                           onClick={(e) => {
                                             e.stopPropagation();
                                             setPrintStudent(student);
                                           }}
                                           className="ml-4 flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all transition-colors"
                                         >
                                           <Printer size={12} />
                                           <span>Statement</span>
                                         </button>
                                      </div>
                                      <p className="text-[9px] font-black text-[#888888] uppercase tracking-widest">Generated for student: {student.name}</p>
                                   </div>

                                   <div className="overflow-hidden rounded-2xl border border-gray-100">
                                      <table className="w-full">
                                         <thead>
                                            <tr className="bg-gray-50 text-left">
                                               <th className="px-6 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest">Date</th>
                                               <th className="px-6 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest">Narration / Description</th>
                                               <th className="px-6 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest text-right">Debit (Dr.)</th>
                                               <th className="px-6 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest text-right">Credit (Cr.)</th>
                                               <th className="px-6 py-4 text-[9px] font-black text-[#888888] uppercase tracking-widest text-right">Balance</th>
                                            </tr>
                                         </thead>
                                         <tbody className="divide-y divide-gray-50">
                                            {ledger.transactions.map((tx, idx) => (
                                               <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                                  <td className="px-6 py-4 text-[10px] font-bold text-[#141414] whitespace-nowrap">
                                                     <div className="flex items-center space-x-2">
                                                        <Calendar size={12} className="text-gray-400" />
                                                        <span>{tx.date}</span>
                                                     </div>
                                                  </td>
                                                  <td className="px-6 py-4">
                                                     <p className="text-[10px] font-black text-[#141414] uppercase tracking-tight">{tx.description}</p>
                                                  </td>
                                                  <td className="px-6 py-4 text-right">
                                                     {tx.type === 'DEBIT' ? (
                                                        <span className="text-xs font-black text-red-600 flex items-center justify-end">
                                                           <span>₹{tx.amount.toLocaleString()}</span>
                                                           <ArrowUpRight size={12} className="ml-1" />
                                                        </span>
                                                     ) : (
                                                        <span className="text-xs font-bold text-gray-300">-</span>
                                                     )}
                                                  </td>
                                                  <td className="px-6 py-4 text-right">
                                                     {tx.type === 'CREDIT' ? (
                                                        <span className="text-xs font-black text-emerald-600 flex items-center justify-end">
                                                           <span>₹{tx.amount.toLocaleString()}</span>
                                                           <ArrowDownLeft size={12} className="ml-1" />
                                                        </span>
                                                     ) : (
                                                        <span className="text-xs font-bold text-gray-300">-</span>
                                                     )}
                                                  </td>
                                                  <td className="px-6 py-4 text-right font-mono font-black text-xs text-[#141414]">₹{tx.balance.toLocaleString()}</td>
                                               </tr>
                                            ))}
                                         </tbody>
                                      </table>
                                   </div>

                                   <div className="flex justify-between items-center bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                      <div className="grid grid-cols-3 gap-12 w-full">
                                         <div>
                                            <p className="text-[9px] font-black text-[#888888] uppercase tracking-widest mb-1">Total Debit</p>
                                            <p className="text-lg font-black text-[#141414]">₹{ledger.totalDebit.toLocaleString()}</p>
                                         </div>
                                         <div>
                                            <p className="text-[9px] font-black text-[#888888] uppercase tracking-widest mb-1">Total Credit</p>
                                            <p className="text-lg font-black text-emerald-600">₹{ledger.totalPaid.toLocaleString()}</p>
                                         </div>
                                         <div className="text-right">
                                            <p className="text-[9px] font-black text-[#888888] uppercase tracking-widest mb-1">Net Balance Due</p>
                                            <p className={clsx(
                                              "text-lg font-black",
                                              ledger.balance > 0 ? "text-red-600" : "text-emerald-600"
                                            )}>₹{ledger.balance.toLocaleString()}</p>
                                         </div>
                                      </div>
                                   </div>
                                </div>
                             </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
