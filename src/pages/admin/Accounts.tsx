/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download,
  Search,
  IndianRupee,
  Clock,
  ArrowRight,
  Calendar,
  Layers,
  CreditCard,
  Building2,
  FileText,
  DollarSign,
  X,
  CheckCircle,
  Coins,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { AnimatePresence } from 'motion/react';

export const Accounts = () => {
  const { businessTransactions, feePayments, students, franchises, addBusinessTransaction, currentUser, vouchers, verifyVoucher, addVoucher, businessProfile } = useApp();
  const isFranchise = currentUser?.role === 'FRANCHISE';
  const myFranchiseId = currentUser?.franchiseId;

  const filteredFeePayments = isFranchise 
    ? feePayments.filter(p => students.find(s => s.id === p.studentId)?.franchiseId === myFranchiseId)
    : feePayments;

  const filteredTransactions = isFranchise
    ? businessTransactions.filter(t => t.referenceId === myFranchiseId)
    : businessTransactions;

  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [transactionType, setTransactionType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [voucherSearch, setVoucherSearch] = useState('');
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  const [formData, setFormData] = useState({
    amount: '',
    category: 'Operational',
    description: '',
    paymentMode: 'Cash',
    date: new Date().toISOString().split('T')[0]
  });

  const [voucherData, setVoucherData] = useState({
    franchiseId: '',
    amount: '',
    remarks: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(formData.amount);
    if (isNaN(amountVal)) return;

    addBusinessTransaction({
      id: Math.random().toString(36).substr(2, 9),
      amount: transactionType === 'INCOME' ? amountVal : -amountVal,
      type: transactionType === 'INCOME' ? 'CREDIT' : 'DEBIT',
      category: formData.category,
      description: formData.description,
      date: formData.date,
      paymentMode: formData.paymentMode as any
    });

    setShowAddModal(false);
    setFormData({
      amount: '',
      category: 'Operational',
      description: '',
      paymentMode: 'Cash',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleAddVoucherRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(voucherData.amount);
    if (isNaN(amountVal) || !voucherData.franchiseId) return;

    const franchise = franchises.find(f => f.id === voucherData.franchiseId);
    
    addVoucher({
      id: Math.random().toString(36).substr(2, 9),
      voucherNo: `V${(vouchers.length + 1).toString().padStart(3, '0')}`,
      date: voucherData.date,
      amount: amountVal,
      franchiseId: voucherData.franchiseId,
      centerName: franchise?.name || 'Unknown',
      directorName: franchise?.ownerId || 'Director',
      remarks: voucherData.remarks,
      status: 'PENDING'
    });

    setShowVoucherModal(false);
    setVoucherData({
      franchiseId: '',
      amount: '',
      remarks: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  // Calculate totals
  const totalIncome = filteredFeePayments.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'DEBIT' || t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const netBalance = totalIncome - totalExpenses;

  // Monthly breakdown for chart
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const month = d.toLocaleString('default', { month: 'short' });
    const monthNum = d.getMonth();
    const year = d.getFullYear();

    const monthlyIncome = filteredFeePayments
      .filter(p => {
        const pDate = new Date(p.date);
        return pDate.getUTCMonth() === monthNum && pDate.getUTCFullYear() === year;
      })
      .reduce((sum, p) => sum + p.paidAmount, 0);

    const monthlyExpense = filteredTransactions
      .filter(t => {
        const tDate = new Date(t.date);
        return (t.type === 'DEBIT' || t.amount < 0) && tDate.getUTCMonth() === monthNum && tDate.getUTCFullYear() === year;
      })
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return { month, income: monthlyIncome, expense: monthlyExpense };
  });

  const recentActivities = [
    ...filteredFeePayments.map(p => ({
      id: p.id,
      date: p.date,
      type: 'INCOME',
      category: 'Student Fee',
      amount: p.paidAmount,
      description: `Fee received from ${students.find(s => s.id === p.studentId)?.name || 'Student'}`,
      mode: p.paymentMode
    })),
    ...filteredTransactions.map(t => ({
      id: t.id,
      date: t.date,
      type: t.amount >= 0 ? 'INCOME' : 'EXPENSE',
      category: t.category || 'General',
      amount: Math.abs(t.amount),
      description: t.description,
      mode: t.paymentMode || 'Cash'
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredActivities = recentActivities.filter(a => {
    if (filterType === 'ALL') return true;
    return a.type === filterType;
  });

  const filteredVouchers = vouchers.filter(v => 
    v.voucherNo.toLowerCase().includes(voucherSearch.toLowerCase()) ||
    v.centerName.toLowerCase().includes(voucherSearch.toLowerCase()) ||
    v.remarks.toLowerCase().includes(voucherSearch.toLowerCase())
  ).sort((a, b) => b.voucherNo.localeCompare(a.voucherNo));

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-20 bg-background min-h-screen">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-100 pb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#141414] tracking-tighter uppercase leading-none">Financial Accounts</h1>
          <p className="text-[10px] text-[#888888] font-black uppercase tracking-[0.2em] mt-3 bg-gray-50 inline-block px-3 py-1 rounded-full border border-gray-200">Central Ledger • Business Intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
             onClick={() => {
                setTransactionType('INCOME');
                setShowAddModal(true);
             }}
             className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 transition-all"
          >
            <ArrowUpRight size={14} />
            <span>Add Income</span>
          </button>
          <button 
             onClick={() => {
                setTransactionType('EXPENSE');
                setShowAddModal(true);
             }}
             className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 shadow-xl shadow-red-500/20 transition-all"
          >
            <ArrowDownRight size={14} />
            <span>Add Expense</span>
          </button>
          <button 
             onClick={() => setShowVoucherModal(true)}
             className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all"
          >
            <Coins size={14} />
            <span>Fund Provision</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#141414] hover:bg-gray-50 shadow-sm transition-all border-b-2">
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-gray-100 rounded-[3rem] p-10 flex flex-col justify-between shadow-xs group"
        >
          <div className="flex items-start justify-between">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <IndianRupee size={28} />
            </div>
            <div className="flex items-center space-x-1 px-3 py-1 bg-blue-50 rounded-full text-[9px] font-black text-blue-600">
              <TrendingUp size={12} />
              <span>+12.4%</span>
            </div>
          </div>
          <div className="mt-12">
            <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest mb-1">Total Net Balance</p>
            <h3 className="text-4xl font-black text-[#141414] tracking-tighter">₹{netBalance.toLocaleString()}</h3>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#ECFDF5] border-2 border-[#D1FAE5] rounded-[3rem] p-10 flex flex-col justify-between shadow-xs group"
        >
          <div className="flex items-start justify-between">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-[1.5rem] flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
              <TrendingUp size={28} />
            </div>
            <ArrowUpRight size={20} className="text-emerald-500" />
          </div>
          <div className="mt-12">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Income</p>
            <h3 className="text-4xl font-black text-[#064E3B] tracking-tighter">₹{totalIncome.toLocaleString()}</h3>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#FEF2F2] border-2 border-[#FEE2E2] rounded-[3rem] p-10 flex flex-col justify-between shadow-xs group"
        >
          <div className="flex items-start justify-between">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-[1.5rem] flex items-center justify-center group-hover:-rotate-12 transition-transform duration-500">
              <TrendingDown size={28} />
            </div>
            <ArrowDownRight size={20} className="text-red-500" />
          </div>
          <div className="mt-12">
            <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Total Expenses</p>
            <h3 className="text-4xl font-black text-[#7F1D1D] tracking-tighter">₹{totalExpenses.toLocaleString()}</h3>
          </div>
        </motion.div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-[3rem] p-10 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-50/30 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="relative flex items-center justify-between mb-12">
            <div>
              <h3 className="text-xl font-black text-[#141414] tracking-tighter uppercase italic">Cashflow Dynamics</h3>
              <p className="text-[9px] text-[#888888] font-black uppercase tracking-[0.2em] mt-1">Income vs Expense • Last 6 Months</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Income</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Expense</span>
              </div>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last6Months}>
                <defs>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D6EFD" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0D6EFD" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F87171" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#F87171" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#888888' }}
                  dy={15} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#888888' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: 'none', 
                    boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                    fontSize: '11px',
                    fontWeight: 900,
                    padding: '16px'
                  }} 
                />
                <Area 
                  name="Income"
                  type="monotone" 
                  dataKey="income" 
                  stroke="#0D6EFD" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorInc)" 
                />
                <Area 
                  name="Expense"
                  type="monotone" 
                  dataKey="expense" 
                  stroke="#F87171" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorExp)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Small Data Cards */}
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-[#141414] text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group h-full flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent flex items-center justify-center opacity-30 pointer-events-none">
                 <DollarSign size={200} className="text-white/10 rotate-12" />
              </div>
              <div className="relative">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6">Revenue Share</p>
                <h4 className="text-3xl font-black tracking-tighter leading-tight mb-2">Franchise Commissions</h4>
                <p className="text-xs text-white/50 font-medium">Estimated monthly royalty based on active branches.</p>
              </div>
              
              <div className="relative mt-8">
                <div className="flex items-center justify-between mb-2">
                   <span className="text-[10px] font-black uppercase tracking-widest">Efficiency</span>
                   <span className="text-[10px] font-black text-blue-400">92%</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                   <div className="w-[92%] h-full bg-blue-500 rounded-full"></div>
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Voucher Verification Section */}
      <div className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-sm">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
             <div className="text-4xl">💰</div>
             <div>
                <h2 className="text-2xl font-black text-[#141414] tracking-tight flex items-center gap-2 uppercase italic leading-none">Voucher Verification</h2>
                <p className="text-[10px] font-bold text-[#888888] uppercase tracking-widest mt-2">Franchise Fund Approval Control</p>
             </div>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input 
              type="text" 
              placeholder="Search vouchers..." 
              value={voucherSearch}
              onChange={(e) => setVoucherSearch(e.target.value)}
              className="pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none text-[10px] font-black uppercase tracking-widest w-full md:w-80 focus:ring-2 focus:ring-blue-600 shadow-inner"
            />
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-50 rounded-3xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest border-b border-gray-100">#</th>
                <th className="px-6 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest border-b border-gray-100">Voucher</th>
                <th className="px-6 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest border-b border-gray-100">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest border-b border-gray-100">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest border-b border-gray-100">Center Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest border-b border-gray-100">Director Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest border-b border-gray-100">Remarks</th>
                <th className="px-6 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest border-b border-gray-100">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredVouchers.map((voucher, idx) => (
                <tr key={voucher.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-gray-500">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <span className="text-blue-600 font-black tracking-tight cursor-pointer hover:underline">{voucher.voucherNo}</span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-600">
                    {new Date(voucher.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-[#141414]">
                    ₹ {voucher.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-tight">
                    {voucher.centerName}
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-tight">
                    {voucher.directorName}
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-600">
                    {voucher.remarks}
                  </td>
                  <td className="px-6 py-4">
                     {voucher.status === 'VERIFIED' ? (
                        <div className="flex items-center space-x-1.5 px-4 py-2 bg-[#22C55E] text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md shadow-emerald-500/20">
                           <Check size={12} strokeWidth={3} />
                           <span>Verified</span>
                        </div>
                     ) : (
                        <button 
                          onClick={() => verifyVoucher(voucher.id)}
                          className="flex items-center space-x-1.5 px-4 py-2 bg-amber-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-amber-600 shadow-md shadow-amber-500/20 transition-all"
                        >
                           <Clock size={12} strokeWidth={3} />
                           <span>Approve</span>
                        </button>
                     )}
                  </td>
                </tr>
              ))}
              {filteredVouchers.length === 0 && (
                <tr>
                   <td colSpan={8} className="py-20 text-center text-gray-400 uppercase text-[10px] font-black tracking-[0.2em] italic">No vouchers found in local database.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Ledger */}
      <div className="bg-white border border-gray-100 rounded-[3rem] overflow-hidden shadow-sm">
        <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Clock className="text-blue-600" size={18} />
              <h2 className="text-sm font-black text-[#141414] uppercase tracking-widest italic font-serif">Transaction Ledger</h2>
            </div>
            <p className="text-[10px] text-[#888888] font-black uppercase tracking-widest opacity-60">Full historical record of cashflow</p>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                {[
                  { id: 'ALL', label: 'All' },
                  { id: 'INCOME', label: 'Income' },
                  { id: 'EXPENSE', label: 'Expense' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterType(tab.id as any)}
                    className={clsx(
                      "px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                      filterType === tab.id 
                        ? "bg-white text-[#141414] shadow-sm ring-1 ring-black/5" 
                        : "text-[#888888] hover:text-[#141414]"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
             </div>
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Search ledger..." 
                  className="pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none text-[10px] font-black uppercase tracking-widest w-64 focus:ring-2 focus:ring-blue-600"
                />
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 text-left">
                <th className="px-10 py-6 text-[9px] font-black text-[#888888] uppercase tracking-widest opacity-70">Timestamp</th>
                <th className="px-10 py-6 text-[9px] font-black text-[#888888] uppercase tracking-widest opacity-70">Category</th>
                <th className="px-10 py-6 text-[9px] font-black text-[#888888] uppercase tracking-widest opacity-70">Description</th>
                <th className="px-10 py-6 text-[9px] font-black text-[#888888] uppercase tracking-widest opacity-70">Mode</th>
                <th className="px-10 py-6 text-[9px] font-black text-[#888888] uppercase tracking-widest opacity-70 text-right">Amount</th>
                <th className="px-10 py-6 text-[9px] font-black text-[#888888] uppercase tracking-widest opacity-70 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredActivities.map((activity) => (
                <tr key={activity.id} className="hover:bg-blue-50/10 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-[#141414] uppercase tracking-tighter truncate">{new Date(activity.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric'})}</span>
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{new Date(activity.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit'})}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={clsx(
                      "px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.1em]",
                      activity.type === 'INCOME' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                    )}>
                      {activity.category}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <p className="text-[11px] font-bold text-[#141414] max-w-md truncate">{activity.description}</p>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center space-x-2">
                       <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                       <span className="text-[9px] font-black text-[#888888] uppercase tracking-widest">{activity.mode}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <span className={clsx(
                      "text-sm font-black italic font-mono",
                      activity.type === 'INCOME' ? "text-emerald-600" : "text-red-500"
                    )}>
                      {activity.type === 'INCOME' ? '+' : '-'}₹{activity.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <button 
                      onClick={() => setSelectedReceipt(activity)}
                      className="p-3 text-gray-400 hover:text-blue-600 hover:bg-gray-50 rounded-2xl transition-all"
                    >
                      <FileText size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredActivities.length === 0 && (
                <tr>
                   <td colSpan={6} className="py-24 text-center">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                         <Layers size={40} />
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Zero transactions detected in this filter plane.</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[3rem] w-full max-w-lg p-10 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowAddModal(false)}
                className="absolute right-8 top-8 p-3 text-gray-400 hover:text-[#141414] hover:bg-gray-100 rounded-2xl"
              >
                <X size={20} />
              </button>
              
              <div className="mb-10">
                <h3 className="text-2xl font-black text-[#141414] uppercase tracking-tight">Record {transactionType === 'INCOME' ? 'Income' : 'Expense'}</h3>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Manual Ledger Entry</p>
              </div>

              <form onSubmit={handleAddTransaction} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Amount (₹)</label>
                  <input 
                    type="number" 
                    required 
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-black text-xl" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                  >
                     <option value="Operational">Operational</option>
                     <option value="Salary">Salary / Payroll</option>
                     <option value="Marketing">Marketing / Ads</option>
                     <option value="Maintenance">Maintenance</option>
                     <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Description</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Payment Mode</label>
                      <select 
                        value={formData.paymentMode}
                        onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                      >
                         <option value="Cash">Cash</option>
                         <option value="UPI">UPI</option>
                         <option value="Bank Transfer">Bank Transfer</option>
                         <option value="Card">Card</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Date</label>
                      <input 
                        type="date" 
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" 
                      />
                   </div>
                </div>

                <button 
                  type="submit"
                  className={clsx(
                    "w-full py-4 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all",
                    transactionType === 'INCOME' ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"
                  )}
                >
                  Record Transaction
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {showVoucherModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[3rem] w-full max-w-lg p-10 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowVoucherModal(false)}
                className="absolute right-8 top-8 p-3 text-gray-400 hover:text-[#141414] hover:bg-gray-100 rounded-2xl"
              >
                <X size={20} />
              </button>
              
              <div className="mb-10">
                <h3 className="text-2xl font-black text-[#141414] uppercase tracking-tight">Fund Provision Request</h3>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Manual Franchise Wallet Credit</p>
              </div>

              <form onSubmit={handleAddVoucherRequest} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Select Franchise</label>
                  <select 
                    required
                    value={voucherData.franchiseId}
                    onChange={(e) => setVoucherData({ ...voucherData, franchiseId: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                  >
                     <option value="">Select a center...</option>
                     {franchises.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                     ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Provision Amount (₹)</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="0.00"
                    value={voucherData.amount}
                    onChange={(e) => setVoucherData({ ...voucherData, amount: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-black text-2xl" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Remarks / Reference</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. DD No, Bank Trx ID, or reason"
                    value={voucherData.remarks}
                    onChange={(e) => setVoucherData({ ...voucherData, remarks: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" 
                  />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Verification Date</label>
                   <input 
                     type="date" 
                     value={voucherData.date}
                     onChange={(e) => setVoucherData({ ...voucherData, date: e.target.value })}
                     className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" 
                   />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-500/20 transition-all"
                >
                  Create Voucher Entry
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {selectedReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-[1rem] w-full max-w-2xl p-16 shadow-2xl relative my-8"
              style={{ minHeight: '800px', display: 'flex', flexDirection: 'column' }}
            >
               <button 
                onClick={() => setSelectedReceipt(null)}
                className="absolute right-8 top-8 p-3 text-gray-400 hover:text-[#141414] hover:bg-gray-100 rounded-2xl print:hidden"
              >
                <X size={20} />
              </button>

                   <div id="printable-accounts-receipt" className="flex-grow flex flex-col p-8 md:p-16">
                <div className="flex justify-between items-start mb-12">
                   <div className="space-y-4 w-full">
                      <div className="flex justify-center mb-6">
                         {businessProfile.logoUrl ? (
                            <img 
                              src={businessProfile.logoUrl} 
                              alt={businessProfile.name} 
                              className="h-20 w-auto object-contain"
                              referrerPolicy="no-referrer"
                            />
                         ) : (
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center p-1 shadow-lg shadow-blue-500/20">
                               <Building2 size={32} className="text-white" />
                            </div>
                         )}
                      </div>
                      <div className="flex justify-between items-start">
                         <div>
                            <h2 className="text-2xl font-black text-[#141414] tracking-tighter uppercase leading-none">{businessProfile.name}</h2>
                            <p className="text-[10px] text-[#888888] font-bold uppercase tracking-widest mt-1">{businessProfile.legalName}</p>
                         </div>
                         <div className="text-right">
                            <div className="inline-block px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] mb-4">Official Receipt</div>
                            <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest leading-none">Receipt No</p>
                            <p className="text-xl font-black text-[#141414] mt-1">#{selectedReceipt.id.toUpperCase()}</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-12 mb-12 border-t border-gray-100 pt-12">
                   <div>
                      <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest mb-2">Issued To</p>
                      <p className="text-lg font-black text-[#141414] leading-tight">{selectedReceipt.description.includes(':') ? selectedReceipt.description.split(': ')[1] : 'General Recipient'}</p>
                      <p className="text-[10px] text-[#888888] font-bold mt-1">Authorized for Educational Records</p>
                   </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest mb-2">Transaction Details</p>
                        <p className="text-sm font-black text-[#141414]">{new Date(selectedReceipt.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                        <p className="text-[10px] text-[#888888] font-bold mt-1">Time: {new Date(selectedReceipt.date).toLocaleTimeString()}</p>
                     </div>
                </div>
              </div>

              <div className="flex-grow">
                 <div className="w-full border rounded-2xl border-gray-100 overflow-hidden">
                    <table className="w-full">
                       <thead className="bg-gray-50/50">
                          <tr className="text-[10px] font-black text-[#888888] uppercase tracking-widest text-left">
                             <th className="px-6 py-4">Item Description</th>
                             <th className="px-6 py-4">Payment Mode</th>
                             <th className="px-6 py-4 text-right">Amount</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50">
                          <tr>
                             <td className="px-6 py-8">
                                <p className="text-sm font-black text-[#141414]">{selectedReceipt.category}</p>
                                <p className="text-[10px] text-gray-400 font-medium mt-1">Institutional Service Reference</p>
                             </td>
                             <td className="px-6 py-8">
                                <span className="px-3 py-1 bg-gray-100 rounded-lg text-[9px] font-black text-[#141414] uppercase tracking-widest">{selectedReceipt.mode}</span>
                             </td>
                             <td className="px-6 py-8 text-right font-black text-lg text-[#141414]">
                                ₹{selectedReceipt.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                             </td>
                          </tr>
                       </tbody>
                    </table>
                 </div>
              </div>

              <div className="mt-12 pt-12 border-t border-dashed border-gray-200">
                 <div className="flex justify-between items-end">
                    <div className="space-y-4">
                       <div className="flex items-center space-x-2">
                          <CheckCircle size={16} className="text-emerald-500" />
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Digitally Verified Document</p>
                       </div>
                       <div className="w-48 h-12 border-b border-[#141414]/10 relative">
                          <p className="text-[9px] font-black text-[#888888] absolute bottom-1 uppercase tracking-widest">Authorized Signatory</p>
                       </div>
                    </div>
                    <div className="text-right space-y-2">
                       <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Total Amount Paid</p>
                       <p className="text-5xl font-black text-[#141414] tracking-tighter">₹{selectedReceipt.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                    </div>
                 </div>
              </div>

              <div className="mt-16 flex space-x-4 print:hidden">
                 <button className="flex-1 py-4 bg-gray-50 text-[#141414] border border-gray-100 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center space-x-2">
                    <Download size={14} />
                    <span>Download PDF</span>
                 </button>
                 <button 
                  onClick={() => window.print()}
                  className="flex-1 py-4 bg-[#141414] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black/90 transition-all shadow-xl shadow-black/10"
                 >
                   Print Official Copy
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <style>{`
        @media print {
          body { 
            visibility: hidden !important; 
            background: white !important;
          }
          #printable-accounts-receipt { 
            visibility: visible !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            display: block !important;
          }
          #printable-accounts-receipt * { 
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
