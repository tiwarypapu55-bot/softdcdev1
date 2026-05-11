/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  CreditCard,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';

export const Wallet = () => {
  const { walletTransactions = [], addWalletTransaction, currentUser } = useApp();
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');

  const balance = walletTransactions.reduce((acc, tx) => {
    return tx.type === 'CREDIT' ? acc + tx.amount : acc - tx.amount;
  }, 0);

  const handleRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(rechargeAmount);
    if (isNaN(amount) || amount <= 0) return;

    addWalletTransaction({
      id: Math.random().toString(36).substr(2, 9),
      franchiseId: currentUser?.id || 'f1',
      amount,
      type: 'CREDIT',
      purpose: 'Wallet Recharge via UPI/Card',
      timestamp: new Date().toISOString(),
      status: 'SUCCESS'
    });

    setRechargeAmount('');
    setShowRechargeModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto bg-background min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#141414] tracking-tight">Finance Wallet</h1>
          <p className="text-sm text-[#888888] font-mono">Manage your operational balance and transactions.</p>
        </div>
        <button 
          onClick={() => setShowRechargeModal(true)}
          className="flex items-center space-x-2 px-8 py-4 bg-blue-600 text-white text-[10px] font-black rounded-2xl uppercase tracking-[0.2em] shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all"
        >
          <Plus size={16} />
          <span>Add Funds</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-[#141414] rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-black/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full -mr-32 -mt-32"></div>
          
          <div className="relative z-10 space-y-12">
            <div className="flex items-center justify-between">
               <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                     <WalletIcon size={20} className="text-blue-400" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Current Balance</span>
               </div>
               <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-blue-400">
                  Business Account
               </div>
            </div>

            <div>
               <h2 className="text-6xl font-black tracking-tighter">
                 ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
               </h2>
               <p className="text-xs text-white/40 font-mono mt-4 flex items-center space-x-2">
                 <CheckCircle2 size={12} className="text-emerald-500" />
                 <span>Funds available for student registrations & certificates</span>
               </p>
            </div>

            <div className="flex items-center space-x-4 pt-4">
              <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
                 <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Total Spent (MTD)</p>
                 <p className="text-sm font-black">₹4,200.00</p>
              </div>
              <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
                 <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Last Recharge</p>
                 <p className="text-sm font-black">₹5,000.00</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] p-8 border border-gray-100 flex flex-col justify-between shadow-sm">
           <div className="space-y-6">
              <h3 className="text-xs font-black text-[#141414] uppercase tracking-widest flex items-center space-x-2">
                <CreditCard size={14} className="text-blue-600" />
                <span>Quick Actions</span>
              </h3>
              <div className="space-y-3">
                 <button className="w-full p-4 bg-gray-50 text-[#141414] font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all text-left flex items-center justify-between group">
                    <span>Download Statement</span>
                    <Download size={14} className="text-gray-400 group-hover:text-[#141414]" />
                 </button>
                 <button className="w-full p-4 bg-gray-50 text-[#141414] font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all text-left flex items-center justify-between group">
                    <span>Set Auto-Recharge</span>
                    <Plus size={14} className="text-gray-400 group-hover:text-[#141414]" />
                 </button>
                 <button className="w-full p-4 bg-gray-50 text-[#141414] font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all text-left flex items-center justify-between group">
                    <span>Privacy Controls</span>
                    <History size={14} className="text-gray-400 group-hover:text-[#141414]" />
                 </button>
              </div>
           </div>
           
           <div className="mt-8 p-6 bg-blue-50 rounded-3xl border border-blue-100 italic text-[10px] text-blue-900/60 leading-relaxed">
             * Note: Fees for certificate generation and student registration are automatically deducted from this wallet.
           </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-[#141414] uppercase tracking-widest flex items-center space-x-2">
            <History size={16} className="text-gray-400" />
            <span>Transaction History</span>
          </h3>
          <div className="flex items-center space-x-3">
             <div className="flex items-center bg-white border border-gray-100 px-4 py-2 rounded-xl">
                <Search size={14} className="text-gray-400" />
                <input type="text" placeholder="Search transactions..." className="ml-2 text-[10px] border-none outline-none font-bold bg-transparent" />
             </div>
             <button className="p-2 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
                <Filter size={16} className="text-gray-400" />
             </button>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[9px] font-black text-[#888888] uppercase tracking-[0.2em] text-left">
                <th className="px-8 py-5">Transaction Details</th>
                <th className="px-8 py-5">Date & Time</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {walletTransactions.map((tx: any) => (
                <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className={clsx(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        tx.type === 'CREDIT' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                      )}>
                        {tx.type === 'CREDIT' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                      </div>
                      <div>
                        <p className="text-sm font-black text-[#141414] tracking-tight">{tx.type === 'CREDIT' ? 'Credit' : 'Debit'}</p>
                        <p className="text-[10px] font-medium text-[#888888] uppercase tracking-widest">{tx.purpose}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-[#141414]">{new Date(tx.timestamp).toLocaleDateString()}</p>
                    <p className="text-[10px] font-mono text-[#888888]">{new Date(tx.timestamp).toLocaleTimeString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={clsx(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                      tx.status === 'SUCCESS' ? "bg-emerald-50 text-emerald-600" : 
                      tx.status === 'PENDING' ? "bg-orange-50 text-orange-600" : "bg-red-50 text-red-600"
                    )}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <p className={clsx(
                      "text-lg font-black tracking-tight",
                      tx.type === 'CREDIT' ? "text-emerald-600" : "text-red-600"
                    )}>
                      {tx.type === 'CREDIT' ? '+' : '-'} ₹{tx.amount.toLocaleString('en-IN')}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showRechargeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[3rem] w-full max-w-lg p-10 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowRechargeModal(false)}
                className="absolute right-8 top-8 p-3 text-gray-400 hover:text-[#141414] hover:bg-gray-100 rounded-2xl"
              >
                <X size={20} />
              </button>
              
              <div className="mb-10">
                <h3 className="text-2xl font-black text-[#141414] uppercase tracking-tight">Add Funds</h3>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Recharge Finance Wallet</p>
              </div>

              <form onSubmit={handleRecharge} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Enter Amount (₹)</label>
                  <div className="relative">
                     <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-black text-[#141414]">₹</span>
                     <input 
                       type="number" 
                       required 
                       min="100"
                       placeholder="0.00"
                       value={rechargeAmount}
                       onChange={(e) => setRechargeAmount(e.target.value)}
                       className="w-full p-6 pl-12 bg-gray-50 border border-gray-100 rounded-3xl outline-none focus:ring-4 focus:ring-blue-100 font-black text-2xl transition-all" 
                     />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                   {[500, 1000, 5000].map(amt => (
                     <button 
                       key={amt}
                       type="button" 
                       onClick={() => setRechargeAmount(amt.toString())}
                       className="py-3 bg-gray-50 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 hover:text-white transition-all border border-gray-100"
                     >
                       + ₹{amt}
                     </button>
                   ))}
                </div>

                <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 text-center">
                   <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest flex items-center justify-center space-x-2">
                      <Clock size={14} />
                      <span>Instant Settlement via Gateway</span>
                   </p>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all font-sans"
                >
                  Proceed to Secure Payment
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
