/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wallet, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight,
  CreditCard,
  Building2,
  Calendar,
  Clock,
  CheckCircle,
  MoreVertical,
  ChevronRight,
  X,
  Save,
  Trash2,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { FeeStructure } from '../../types';

export const FeeMaster = () => {
  const { feeStructures, courses, addFeeStructure, updateFeeStructure, deleteFeeStructure } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sessionFilter, setSessionFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<FeeStructure | null>(null);
  
  const [formData, setFormData] = useState<Partial<FeeStructure>>({
    head: '',
    courseId: '',
    courseName: '',
    frequency: 'Monthly',
    amount: 0,
    discount: 0,
    latePenalty: 0,
    session: '2025-26',
    type: 'Academic',
    status: 'ACTIVE'
  });

  const sessions = ['All', ...Array.from(new Set(feeStructures.map(f => f.session)))];
  const types = ['All', ...Array.from(new Set(feeStructures.map(f => f.type)))];

  const handleOpenModal = (fee?: FeeStructure) => {
    if (fee) {
      setEditingFee(fee);
      setFormData(fee);
    } else {
      setEditingFee(null);
      setFormData({
        head: '',
        courseId: '',
        courseName: '',
        frequency: 'Monthly',
        amount: 0,
        discount: 0,
        latePenalty: 0,
        session: '2025-26',
        type: 'Academic',
        status: 'ACTIVE'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const course = courses.find(c => c.id === formData.courseId);
    const finalData = {
      ...formData,
      courseName: formData.courseId === 'all' ? 'All IT Courses' : (course?.title || ''),
    } as FeeStructure;

    if (editingFee) {
      updateFeeStructure(editingFee.id, finalData);
    } else {
      addFeeStructure({
        ...finalData,
        id: `fs${Date.now()}`
      });
    }
    setIsModalOpen(false);
  };

  const filtered = feeStructures.filter(f => {
    const matchesSearch = f.head.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          f.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || f.type === typeFilter;
    const matchesSession = sessionFilter === 'All' || f.session === sessionFilter;
    return matchesSearch && matchesType && matchesSession;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#141414] tracking-tight uppercase">Fee Master</h1>
          <p className="text-sm text-[#888888] font-mono">Structure your institute revenue and course pricing models.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-8 py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Define Fee Structure</span>
        </button>
      </div>

      {/* Interactive Summary Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div whileHover={{ y: -5 }} className="bg-[#141414] p-8 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl">
           <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Fee Collection</p>
           <h3 className="text-3xl font-black mb-4 tracking-tighter">₹4,28,400</h3>
           <div className="flex items-center space-x-2 text-emerald-400">
              <ArrowUpRight size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">12.5% increase</span>
           </div>
        </motion.div>
        
        <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-[2.5rem] border border-[#F0F0F0] group shadow-sm hover:shadow-xl transition-all">
           <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest mb-1">Pending Fees</p>
           <h3 className="text-3xl font-black mb-4 tracking-tighter text-red-600">₹82,150</h3>
           <div className="flex items-center space-x-2 text-[#888888]">
              <Clock size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Check Overdues</span>
           </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="bg-blue-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl shadow-blue-500/20">
           <div className="absolute -right-4 -top-4 w-24 h-24 bg-black/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
           <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-1">Active Scholarship</p>
           <h3 className="text-3xl font-black mb-4 tracking-tighter">₹15,000</h3>
           <div className="flex items-center space-x-2 text-blue-100">
              <CheckCircle size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">4 Qualified</span>
           </div>
        </motion.div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888888]" size={18} />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by fee head or course..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-[#F0F0F0] rounded-[1.25rem] focus:outline-none focus:ring-4 focus:ring-blue-500/5 shadow-sm transition-all text-sm font-medium"
          />
        </div>
        <div className="flex flex-wrap gap-3">
            <div className="flex items-center bg-white border border-[#F0F0F0] rounded-2xl px-4 py-2">
               <Filter size={14} className="text-blue-600 mr-2" />
               <select 
                 value={typeFilter}
                 onChange={(e) => setTypeFilter(e.target.value)}
                 className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest cursor-pointer"
               >
                 {types.map(t => <option key={t} value={t}>{t} Type</option>)}
               </select>
            </div>
            <div className="flex items-center bg-white border border-[#F0F0F0] rounded-2xl px-4 py-2">
               <Calendar size={14} className="text-purple-600 mr-2" />
               <select 
                 value={sessionFilter}
                 onChange={(e) => setSessionFilter(e.target.value)}
                 className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest cursor-pointer"
               >
                 {sessions.map(s => <option key={s} value={s}>{s === 'All' ? 'All Sessions' : s}</option>)}
               </select>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-[#F0F0F0] shadow-xl overflow-hidden">
        <div className="p-8 border-b border-[#F5F5F5] flex items-center justify-between">
           <h3 className="text-xs font-black text-[#141414] uppercase tracking-widest">Configured Fee Structures</h3>
           <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-tighter">{filtered.length} Results</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-[#F0F0F0]">
                 <th className="px-8 py-6 text-[9px] font-black text-[#888888] uppercase tracking-widest">Fee Head</th>
                 <th className="px-8 py-6 text-[9px] font-black text-[#888888] uppercase tracking-widest">Course</th>
                 <th className="px-8 py-6 text-[9px] font-black text-[#888888] uppercase tracking-widest">Amount</th>
                 <th className="px-8 py-6 text-[9px] font-black text-[#888888] uppercase tracking-widest">Discount</th>
                 <th className="px-8 py-6 text-[9px] font-black text-[#888888] uppercase tracking-widest text-red-500">Late Penalty</th>
                 <th className="px-8 py-6 text-[9px] font-black text-[#888888] uppercase tracking-widest">Type</th>
                 <th className="px-8 py-6 text-[9px] font-black text-[#888888] uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F5]">
              {filtered.map((fee) => (
                <tr key={fee.id} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                       <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-white transition-all shadow-inner"><CreditCard size={18} /></div>
                       <div className="flex flex-col">
                          <span className="text-xs font-black text-[#141414] uppercase tracking-tight">{fee.head}</span>
                          <span className="text-[8px] font-black text-[#888888] uppercase tracking-widest">{fee.frequency}</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-bold text-[10px] text-blue-600 uppercase tracking-tight">{fee.courseName}</td>
                  <td className="px-8 py-6 text-xs font-black text-[#141414]">₹{fee.amount.toLocaleString()}</td>
                  <td className="px-8 py-6 text-[10px] font-black text-emerald-600">
                    {fee.discount > 0 ? `- ₹${fee.discount.toLocaleString()}` : '--'}
                  </td>
                  <td className="px-8 py-6 text-[10px] font-black text-red-500">₹{fee.latePenalty.toLocaleString()} / Day</td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-gray-50 text-[8px] font-black uppercase tracking-widest rounded-full">{fee.type}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center space-x-2">
                       <button 
                         onClick={() => handleOpenModal(fee)}
                         className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all"
                       >
                         <Edit2 size={16} />
                       </button>
                       <button 
                         onClick={() => deleteFeeStructure(fee.id)}
                         className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
             <div className="p-20 text-center space-y-4">
                <Search size={40} className="mx-auto text-gray-200" />
                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No matching fee structures found</p>
             </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl relative"
            >
               <div className="px-8 py-8 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-[#141414] uppercase tracking-tighter">
                      {editingFee ? 'Modify Fee Structure' : 'New Fee Definition'}
                    </h2>
                    <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Sync pricing with global standards</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-all shadow-sm">
                    <X size={20} />
                  </button>
               </div>

               <form onSubmit={handleSave} className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-[#888888] uppercase tracking-widest ml-1">Fee Head / Name</label>
                        <input 
                           required
                           type="text"
                           value={formData.head}
                           onChange={(e) => setFormData({...formData, head: e.target.value})}
                           className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold"
                           placeholder="e.g., Annual Tuition"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-[#888888] uppercase tracking-widest ml-1">Session</label>
                        <select 
                           value={formData.session}
                           onChange={(e) => setFormData({...formData, session: e.target.value})}
                           className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold appearance-none"
                        >
                           <option>2024-25</option>
                           <option>2025-26</option>
                           <option>2026-27</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-[#888888] uppercase tracking-widest ml-1">Apply To Course</label>
                        <select 
                           required
                           value={formData.courseId}
                           onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                           className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold appearance-none"
                        >
                           <option value="">Select Course</option>
                           <option value="all">Global (All Courses)</option>
                           {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-[#888888] uppercase tracking-widest ml-1">Frequency</label>
                        <select 
                           value={formData.frequency}
                           onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                           className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold appearance-none"
                        >
                           <option>One-time</option>
                           <option>Monthly</option>
                           <option>Quarterly</option>
                           <option>Annually</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-[#888888] uppercase tracking-widest ml-1">Base Amount (₹)</label>
                        <input 
                           type="number"
                           value={formData.amount}
                           onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                           className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-[#888888] uppercase tracking-widest ml-1 text-emerald-600">Discount Amount (₹)</label>
                        <input 
                           type="number"
                           value={formData.discount}
                           onChange={(e) => setFormData({...formData, discount: Number(e.target.value)})}
                           className="w-full p-4 bg-emerald-50 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-600 outline-none font-bold text-emerald-700"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-[#888888] uppercase tracking-widest ml-1 text-red-500">Late Penalty (₹ / Day)</label>
                        <input 
                           type="number"
                           value={formData.latePenalty}
                           onChange={(e) => setFormData({...formData, latePenalty: Number(e.target.value)})}
                           className="w-full p-4 bg-red-50 border border-red-100 rounded-2xl focus:ring-2 focus:ring-red-600 outline-none font-bold text-red-700"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-[#888888] uppercase tracking-widest ml-1">Category / Type</label>
                        <select 
                           value={formData.type}
                           onChange={(e) => setFormData({...formData, type: e.target.value})}
                           className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold appearance-none"
                        >
                           <option>Academic</option>
                           <option>Administrative</option>
                           <option>Infrastructure</option>
                           <option>Material</option>
                           <option>Service</option>
                        </select>
                     </div>
                  </div>

                  <div className="pt-6 flex gap-4">
                     <button 
                       type="button" 
                       onClick={() => setIsModalOpen(false)}
                       className="flex-1 py-4 bg-gray-100 text-[#141414] text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-all"
                     >
                       Discard
                     </button>
                     <button 
                       type="submit" 
                       className="flex-[2] py-4 bg-[#141414] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-black/20 flex items-center justify-center space-x-3"
                     >
                        <Save size={18} />
                        <span>{editingFee ? 'Confirm Update' : 'Finalize Structure'}</span>
                     </button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
