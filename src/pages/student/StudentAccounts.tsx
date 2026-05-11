/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CreditCard, 
  Receipt, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet,
  Clock,
  CheckCircle2,
  Download,
  Filter,
  BarChart3,
  DollarSign
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

export const StudentAccounts = () => {
  const { students } = useApp();
  const student = students.find(s => s.id === 's1') || students[0];

  const transactions = [
    { id: 'TX-101', date: '10 May 2024', amount: 5000, type: 'PAYMENT', status: 'SUCCESS', method: 'Online / UPI' },
    { id: 'TX-102', date: '12 April 2024', amount: 3000, type: 'PAYMENT', status: 'SUCCESS', method: 'Cash' },
    { id: 'TX-103', date: '15 March 2024', amount: 4500, type: 'PAYMENT', status: 'SUCCESS', method: 'Online / Card' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="flex items-center space-x-4">
           <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-xl shadow-emerald-500/10">
              <Wallet size={28} />
           </div>
           <div>
              <h1 className="text-3xl font-black text-[#141414] tracking-tight uppercase italic leading-none">Financial Ledger</h1>
              <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest mt-2">{student?.course} • Fees Record</p>
           </div>
        </div>
        <div className="flex gap-4">
           <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm text-right">
              <p className="text-[9px] font-black text-[#888888] uppercase tracking-[0.2em] mb-1">Total Course Fee</p>
              <p className="text-xl font-black text-[#141414]">₹{(student?.totalFee ?? 0).toLocaleString()}</p>
           </div>
           <button className="px-8 py-4 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-xl shadow-blue-500/20">
              <DollarSign size={16} />
              <span>Pay Fees</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Paid Amount', value: `₹${(student?.paidAmount ?? 0).toLocaleString()}`, icon: ArrowUpRight, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Balance Due', value: `₹${((student?.totalFee ?? 0) - (student?.paidAmount ?? 0)).toLocaleString()}`, icon: ArrowDownRight, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Payments', value: transactions.length.toString(), icon: Receipt, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl relative overflow-hidden"
          >
             <div className="flex items-center justify-between mb-4">
                <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform", stat.bg, stat.color)}>
                   <stat.icon size={24} />
                </div>
                <div className="h-10 w-20 flex items-end">
                   <div className="w-full h-1/2 flex items-end justify-between gap-0.5">
                      {[4,7,3,9,5,8,4].map((h, j) => (
                        <div key={j} className={clsx("w-1 rounded-full", stat.color.replace('text', 'bg'))} style={{ height: `${h * 10}%`, opacity: 0.2 + (j * 0.1) }}></div>
                      ))}
                   </div>
                </div>
             </div>
             <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest">{stat.label}</p>
             <p className="text-3xl font-black text-[#141414] mt-1 tracking-tighter">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 shadow-xl rounded-[3rem] overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
           <div className="flex items-center space-x-3">
              <Receipt className="text-[#888888]" size={20} />
              <h3 className="text-sm font-black text-[#141414] uppercase tracking-tight">Recent Transactions</h3>
           </div>
           <button className="p-3 bg-gray-50 text-gray-400 hover:text-[#141414] rounded-xl"><Filter size={16} /></button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead>
                <tr className="bg-gray-50/50">
                   <th className="px-8 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest">Transaction ID</th>
                   <th className="px-8 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest">Date</th>
                   <th className="px-8 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest">Amount</th>
                   <th className="px-8 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest">Status</th>
                   <th className="px-8 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest text-right">Invoice</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors group">
                     <td className="px-8 py-6">
                        <div className="flex items-center space-x-3">
                           <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                              <CreditCard size={14} />
                           </div>
                           <span className="text-sm font-black text-[#141414] font-mono">{tx.id}</span>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{tx.date}</p>
                     </td>
                     <td className="px-8 py-6">
                        <p className="text-sm font-black text-[#141414]">₹{tx.amount.toLocaleString()}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{tx.method}</p>
                     </td>
                     <td className="px-8 py-6">
                        <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                           <CheckCircle2 size={10} />
                           <span>{tx.status}</span>
                        </div>
                     </td>
                     <td className="px-8 py-6 text-right">
                        <button className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm">
                           <Download size={16} />
                        </button>
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[#141414] p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
         <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-600/20 blur-[100px] rounded-full group-hover:bg-blue-600/30 transition-all"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-6">
               <div className="flex items-center space-x-3 text-blue-400">
                  <BarChart3 size={32} />
                  <h3 className="text-2xl font-black uppercase tracking-tight">Fee Structure Insight</h3>
               </div>
               <p className="text-sm font-medium text-white/50 leading-relaxed uppercase tracking-wide max-w-xl">
                 Student ID <span className="text-white font-black">{student?.id}</span> is enrolled in the <span className="text-white font-black">{student?.course}</span> program. 
                 Base tuition and lab fees are inclusive of GST as per government regulations.
               </p>
               <div className="flex gap-4">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                     <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Discount Applied</p>
                     <p className="text-xs font-black uppercase mt-1 text-emerald-400">Scholarship Level 1</p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                     <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Next Due Date</p>
                     <p className="text-xs font-black uppercase mt-1 text-white">15 June 2024</p>
                  </div>
               </div>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-sm">
               <div className="w-48 h-48 rounded-2xl bg-white p-4 shadow-2xl flex items-center justify-center">
                  <div className="text-center">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Scan to Pay</p>
                     <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center text-gray-300">
                        <QRPlaceholder />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const QRPlaceholder = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <rect x="7" y="7" width="3" height="3" />
    <rect x="14" y="7" width="3" height="3" />
    <rect x="7" y="14" width="3" height="3" />
    <rect x="14" y="14" width="3" height="3" />
  </svg>
);
