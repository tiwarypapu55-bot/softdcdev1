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
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

interface Exam {
  id: string;
  name: string;
  session: string;
  trade: string;
  unit: string;
  startDate: string;
  endDate: string;
  remarks: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  invigilator: string;
}

const mockExams: Exam[] = [
  {
    id: 'EXM-2024-001',
    name: 'Mid-term Tally Theory',
    session: '2024-25',
    trade: 'Accounting',
    unit: 'Unit 1',
    startDate: '2024-05-15',
    endDate: '2024-05-15',
    remarks: 'Focus on GST Vouchers',
    status: 'UPCOMING',
    invigilator: 'Dr. Rajesh Sharma'
  },
  {
    id: 'EXM-2024-002',
    name: 'Advanced Excel Practical',
    session: '2024-25',
    trade: 'Data Analytics',
    unit: 'Final',
    startDate: '2024-05-10',
    endDate: '2024-05-12',
    remarks: 'MACRO proficiency required',
    status: 'ONGOING',
    invigilator: 'Prof. Anita Desai'
  },
  {
    id: 'EXM-2024-003',
    name: 'Business Comm. Oral',
    session: '2023-24',
    trade: 'Soft Skills',
    unit: 'Unit 3',
    startDate: '2024-04-20',
    endDate: '2024-04-22',
    remarks: 'Viva Voce included',
    status: 'COMPLETED',
    invigilator: 'Mr. Kevin Peter'
  }
];

export const ExamMaster = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-gray-200 pb-8">
        <div>
          <h1 className="text-3xl font-black text-[#141414] tracking-tight">Examination Master</h1>
          <p className="text-sm text-[#888888]">Manage institutional exams, schedules and invigilation.</p>
        </div>
        <button className="px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center space-x-2">
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
              {mockExams.map((exam, index) => (
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
    </div>
  );
};
