/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileCheck, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Calendar,
  Users,
  AlertCircle,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { Exam } from '../../types';

const mockExams: Exam[] = []; // Removed since we use AppContext

export const ExamMaster = () => {
  const { exams, addExam, updateExam, deleteExam, courses, sessions } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExam, setNewExam] = useState<Partial<Exam>>({
    session: sessions.find(s => s.isDefault)?.name || '',
    status: 'UPCOMING'
  });

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    const exam: Exam = {
      ...newExam as Exam,
      id: `EXM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    addExam(exam);
    setShowAddModal(false);
    setNewExam({});
  };

  const filteredExams = exams.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.trade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-gray-200 pb-8">
        <div>
          <h1 className="text-3xl font-black text-[#141414] tracking-tight italic uppercase">Examination Master</h1>
          <p className="text-sm font-bold text-[#888888] uppercase tracking-widest">Global Examination & Invigilation Control</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-8 py-4 bg-[#141414] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:bg-blue-600 transition-all flex items-center space-x-3"
        >
          <Plus size={18} />
          <span>Schedule New Exam</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888888] group-focus-within:text-blue-600 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search by Exam ID, Name or Trade..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#E5E5E5] rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm font-semibold text-[#141414] hover:bg-gray-50">
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-[#E5E5E5]">
                <th className="px-6 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest">Sr No.</th>
                <th className="px-6 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest">Exam ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest">Session</th>
                <th className="px-6 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest">Trade</th>
                <th className="px-6 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest">Unit</th>
                <th className="px-6 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest">Start Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest">End Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest">Remarks</th>
                <th className="px-6 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest">Invigilator</th>
                <th className="px-6 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0F0]">
              {filteredExams.map((exam, index) => (
                <tr key={exam.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-[#888888]">{index + 1}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono font-bold text-blue-600">{exam.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-[#141414]">{exam.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-[#141414] font-medium">{exam.session}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-[#141414] font-medium">{exam.trade}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-[#141414] font-medium">{exam.unit}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-[#141414]">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-xs font-medium">{exam.startDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-[#141414]">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-xs font-medium">{exam.endDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-[#888888] max-w-[150px] truncate" title={exam.remarks}>{exam.remarks}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      "px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest",
                      exam.status === 'UPCOMING' && "bg-blue-50 text-blue-600",
                      exam.status === 'ONGOING' && "bg-emerald-50 text-emerald-600 animate-pulse",
                      exam.status === 'COMPLETED' && "bg-gray-100 text-gray-600",
                      exam.status === 'CANCELLED' && "bg-red-50 text-red-600"
                    )}>
                      {exam.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                       <Users size={14} className="text-gray-400" />
                       <span className="text-xs font-medium text-[#141414]">{exam.invigilator}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 text-[#888888] hover:text-[#141414] hover:bg-gray-100 rounded-lg transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Exam Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl"
          >
            <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50">
               <div>
                  <h2 className="text-2xl font-black text-[#141414] uppercase tracking-tight">Schedule New Exam</h2>
                  <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest mt-1">Official Controller of Examinations</p>
               </div>
               <button onClick={() => setShowAddModal(false)} className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm">
                  <X size={24} />
               </button>
            </div>
            
            <form onSubmit={handleAddExam} className="p-10 space-y-6">
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-[#888888] ml-2">Exam Name</label>
                     <input 
                        type="text" 
                        required
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                        value={newExam.name || ''}
                        onChange={e => setNewExam({...newExam, name: e.target.value})}
                        placeholder="e.g. Final Theory Exam"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-[#888888] ml-2">Academic Session</label>
                     <select 
                        required
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all outline-none appearance-none"
                        value={newExam.session || ''}
                        onChange={e => setNewExam({...newExam, session: e.target.value})}
                     >
                        <option value="">Select Session</option>
                        {sessions.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                     </select>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-[#888888] ml-2">Course / Trade</label>
                     <select 
                        required
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all outline-none appearance-none"
                        value={newExam.trade || ''}
                        onChange={e => setNewExam({...newExam, trade: e.target.value})}
                     >
                        <option value="">Select Course</option>
                        {courses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-[#888888] ml-2">Exam Unit</label>
                     <input 
                        type="text" 
                        required
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                        value={newExam.unit || ''}
                        onChange={e => setNewExam({...newExam, unit: e.target.value})}
                        placeholder="e.g. Unit 1 or Final"
                     />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-[#888888] ml-2">Start Date</label>
                     <input 
                        type="date" 
                        required
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                        value={newExam.startDate || ''}
                        onChange={e => setNewExam({...newExam, startDate: e.target.value})}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-[#888888] ml-2">End Date</label>
                     <input 
                        type="date" 
                        required
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                        value={newExam.endDate || ''}
                        onChange={e => setNewExam({...newExam, endDate: e.target.value})}
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#888888] ml-2">Invigilator Name</label>
                  <input 
                     type="text" 
                     required
                     className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                     value={newExam.invigilator || ''}
                     onChange={e => setNewExam({...newExam, invigilator: e.target.value})}
                     placeholder="e.g. Dr. Rajesh Sharma"
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#888888] ml-2">Remarks</label>
                  <textarea 
                     className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all outline-none resize-none"
                     rows={3}
                     value={newExam.remarks || ''}
                     onChange={e => setNewExam({...newExam, remarks: e.target.value})}
                     placeholder="Additional instructions..."
                  />
               </div>

               <div className="pt-6 flex items-center space-x-4">
                  <button 
                     type="button"
                     onClick={() => setShowAddModal(false)}
                     className="flex-1 py-4 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-all"
                  >
                     Cancel
                  </button>
                  <button 
                     type="submit"
                     className="flex-[2] py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all"
                  >
                     Schedule Exam
                  </button>
               </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
