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
  const { walletTransactions = [], vouchers = [], addVoucher, currentUser, franchises } = useApp();
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'LEDGER' | 'REQUESTS'>('LEDGER');
  const [showThresholdModal, setShowThresholdModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [balanceThreshold, setBalanceThreshold] = useState('1000');
  const [maskBalances, setMaskBalances] = useState(false);

  const myFranchiseId = currentUser?.franchiseId || currentUser?.id;
  const myFranchise = franchises.find(f => f.id === myFranchiseId);

  const myTransactions = walletTransactions.filter(tx => tx.franchiseId === myFranchiseId);
  const myVouchers = vouchers.filter(v => v.franchiseId === myFranchiseId);

  const balance = myTransactions.reduce((acc, tx) => {
    return tx.type === 'CREDIT' ? acc + tx.amount : acc - tx.amount;
  }, 0);

  const handleRechargeRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(rechargeAmount);
    if (isNaN(amount) || amount <= 0) return;

    addVoucher({
      id: Math.random().toString(36).substr(2, 9),
      voucherNo: `REQ-${Date.now().toString().slice(-6)}`,
      franchiseId: myFranchiseId || 'f1',
      centerName: myFranchise?.name || 'Your Center',
      amount,
      date: new Date().toISOString().split('T')[0],
      status: 'PENDING'
    });

    setRechargeAmount('');
    setShowRechargeModal(false);
    setActiveTab('REQUESTS');
    alert('Fund request submitted to admin for approval.');
  };

  const handleDownloadStatement = () => {
    if (walletTransactions.length === 0) {
      alert('No transactions to download');
      return;
    }

    const headers = ['Date', 'Type', 'Purpose', 'Amount', 'Status'];
    const csvContent = [
      headers.join(','),
      ...myTransactions.map(tx => [
        new Date(tx.timestamp).toLocaleString(),
        tx.type,
        `"${tx.purpose.replace(/"/g, '""')}"`,
        tx.amount,
        tx.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `wallet_statement_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <span>Request Funds</span>
        </button>
      </div>

      <div className="flex items-center space-x-8 border-b border-gray-100">
        <button 
          onClick={() => setActiveTab('LEDGER')}
          className={clsx(
            "pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative",
            activeTab === 'LEDGER' ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
          )}
        >
          <span>Transaction Ledger</span>
          {activeTab === 'LEDGER' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
        </button>
        <button 
          onClick={() => setActiveTab('REQUESTS')}
          className={clsx(
            "pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative",
            activeTab === 'REQUESTS' ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
          )}
        >
          <span>Fund Requests</span>
          {activeTab === 'REQUESTS' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
          {myVouchers.filter(v => v.status === 'PENDING').length > 0 && (
            <span className="absolute -top-2 -right-3 w-4 h-4 bg-red-500 text-white text-[8px] rounded-full flex items-center justify-center font-bold">
              {myVouchers.filter(v => v.status === 'PENDING').length}
            </span>
          )}
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
                 ₹{maskBalances ? '••••••' : balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
               </h2>
               <p className="text-xs text-white/40 font-mono mt-4 flex items-center space-x-2">
                 <CheckCircle2 size={12} className="text-emerald-500" />
                 <span>Funds available for student registrations & certificates</span>
                 {balance < parseFloat(balanceThreshold) && !maskBalances && (
                   <span className="ml-4 px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-[9px] font-bold animate-pulse uppercase">
                     Low Balance Alert
                   </span>
                 )}
               </p>
            </div>

            <div className="flex items-center space-x-4 pt-4">
              <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
                 <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Total Spent (MTD)</p>
                 <p className="text-sm font-black">
                   ₹{maskBalances ? '•••' : myTransactions
                     .filter(tx => tx.type === 'DEBIT' && new Date(tx.timestamp).getMonth() === new Date().getMonth())
                     .reduce((acc, tx) => acc + tx.amount, 0)
                     .toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                 </p>
              </div>
              <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
                 <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Last Recharge</p>
                 <p className="text-sm font-black">
                   ₹{maskBalances ? '•••' : (myTransactions.find(tx => tx.type === 'CREDIT')?.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                 </p>
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
                 <button 
                   onClick={handleDownloadStatement}
                   className="w-full p-4 bg-gray-50 text-[#141414] font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all text-left flex items-center justify-between group"
                 >
                    <span>Download Statement</span>
                    <Download size={14} className="text-gray-400 group-hover:text-[#141414]" />
                 </button>
                 <button 
                   onClick={() => setShowThresholdModal(true)}
                   className="w-full p-4 bg-gray-50 text-[#141414] font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all text-left flex items-center justify-between group"
                 >
                    <span>Low Balance Alert</span>
                    <Plus size={14} className="text-gray-400 group-hover:text-[#141414]" />
                 </button>
                 <button 
                   onClick={() => setShowPrivacyModal(true)}
                   className="w-full p-4 bg-gray-50 text-[#141414] font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all text-left flex items-center justify-between group"
                 >
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
            <span>{activeTab === 'LEDGER' ? 'Transaction History' : 'Fund Request History'}</span>
          </h3>
          <div className="flex items-center space-x-3">
             <div className="flex items-center bg-white border border-gray-100 px-4 py-2 rounded-xl">
                <Search size={14} className="text-gray-400" />
                <input type="text" placeholder="Search..." className="ml-2 text-[10px] border-none outline-none font-bold bg-transparent" />
             </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
          {activeTab === 'LEDGER' ? (
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
                {myTransactions.map((tx: any) => (
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
                        {tx.type === 'CREDIT' ? '+' : '-'} ₹{maskBalances ? '•••' : tx.amount.toLocaleString('en-IN')}
                      </p>
                    </td>
                  </tr>
                ))}
                {myTransactions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">No transaction history found</td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[9px] font-black text-[#888888] uppercase tracking-[0.2em] text-left">
                  <th className="px-8 py-5">Voucher Details</th>
                  <th className="px-8 py-5">Request Date</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {myVouchers.map((v: any) => (
                  <tr key={v.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs">
                          {v.voucherNo.split('-')[0]}
                        </div>
                        <div>
                          <p className="text-sm font-black text-[#141414] tracking-tight">{v.voucherNo}</p>
                          <p className="text-[10px] font-medium text-[#888888] uppercase tracking-widest">Fund Request</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-bold text-[#141414]">{new Date(v.date).toLocaleDateString()}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={clsx(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                        v.status === 'VERIFIED' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600 animate-pulse"
                      )}>
                        {v.status === 'VERIFIED' ? 'APPROVED' : 'PENDING'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-lg font-black tracking-tight text-[#141414]">
                        ₹{maskBalances ? '•••' : v.amount.toLocaleString('en-IN')}
                      </p>
                    </td>
                  </tr>
                ))}
                {myVouchers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">No fund requests found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showPrivacyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[3rem] w-full max-w-sm p-10 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowPrivacyModal(false)}
                className="absolute right-8 top-8 p-3 text-gray-400 hover:text-[#141414] hover:bg-gray-100 rounded-2xl"
              >
                <X size={20} />
              </button>
              
              <div className="mb-8">
                <h3 className="text-xl font-black text-[#141414] uppercase tracking-tight">Privacy Controls</h3>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Wallet Data Visibility</p>
              </div>

              <div className="space-y-6">
                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div>
                       <p className="text-xs font-black text-[#141414]">Mask Balances</p>
                       <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Hide sensitive figures</p>
                    </div>
                    <button 
                      onClick={() => setMaskBalances(!maskBalances)}
                      className={clsx(
                        "w-12 h-6 rounded-full transition-all relative",
                        maskBalances ? "bg-blue-600" : "bg-gray-200"
                      )}
                    >
                       <div className={clsx(
                         "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                         maskBalances ? "left-7" : "left-1"
                       )} />
                    </button>
                 </div>

                 <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-[9px] font-medium text-blue-900/60 leading-relaxed italic">
                    Masking balances helps in preventing accidental exposure of financial data in public environments or while sharing screens.
                 </div>

                 <button 
                  onClick={() => setShowPrivacyModal(false)}
                  className="w-full py-4 bg-[#141414] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest"
                 >
                   Save Preferences
                 </button>
              </div>
            </motion.div>
          </div>
        )}

        {showThresholdModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[3rem] w-full max-w-sm p-10 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowThresholdModal(false)}
                className="absolute right-8 top-8 p-3 text-gray-400 hover:text-[#141414] hover:bg-gray-100 rounded-2xl"
              >
                <X size={20} />
              </button>
              
              <div className="mb-8">
                <h3 className="text-xl font-black text-[#141414] uppercase tracking-tight">Balance Alert</h3>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Configure Thresholds</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Minimum Threshold (₹)</label>
                  <input 
                    type="number" 
                    value={balanceThreshold}
                    onChange={(e) => setBalanceThreshold(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-black text-lg" 
                  />
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-[9px] font-medium text-amber-900/60 leading-relaxed italic">
                   A "Low Balance" indicator will appear in your wallet dashboard when current funds fall below this amount.
                </div>

                <button 
                  onClick={() => setShowThresholdModal(false)}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-500/20"
                >
                  Set Configuration
                </button>
              </div>
            </motion.div>
          </div>
        )}
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
                <h3 className="text-2xl font-black text-[#141414] uppercase tracking-tight">Request Funds</h3>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Submit Fund Request to Admin</p>
              </div>

              <form onSubmit={handleRechargeRequest} className="space-y-8">
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
                       onFocus={(e) => e.target.select()}
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
                      <span>Request will be settled after Admin Approval</span>
                   </p>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all font-sans"
                >
                  Submit Request
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
