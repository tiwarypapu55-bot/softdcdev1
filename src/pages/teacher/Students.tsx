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
  MoreVertical, 
  Mail, 
  Phone, 
  BookOpen, 
  Award,
  ChevronRight,
  TrendingUp,
  MessageCircle,
  FileBarChart
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

export const Students = () => {
  const { students } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const teacherStudents = students.slice(0, 8); // Simulate specific students for this teacher

  const filteredStudents = teacherStudents.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-[#141414] tracking-tight uppercase italic leading-none">Student Directory</h1>
          <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest mt-2">Managing 48 Students across 3 Batches</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-600 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search by ID or Name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none text-[10px] font-black uppercase tracking-widest w-full md:w-96 focus:ring-4 focus:ring-blue-100 shadow-inner group-hover:bg-white transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredStudents.map((student) => (
          <motion.div 
            key={student.id}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-lg relative overflow-hidden group border-b-4 border-b-blue-600/10"
          >
            <div className="flex justify-between items-start mb-6">
               <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center p-1 border border-gray-100 group-hover:scale-105 transition-transform">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.id}`} className="w-full h-full rounded-xl" alt="Student" />
               </div>
               <button className="p-2 text-gray-300 hover:text-[#141414] hover:bg-gray-100 rounded-xl transition-all">
                  <MoreVertical size={16} />
               </button>
            </div>

            <div className="space-y-4">
               <div>
                  <h3 className="text-sm font-black text-[#141414] uppercase truncate">{student.name}</h3>
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-0.5">{student.course}</p>
               </div>

               <div className="space-y-2 border-t border-gray-50 pt-4">
                  <div className="flex items-center space-x-2 text-[#888888]">
                     <Mail size={12} />
                     <span className="text-[9px] font-bold truncate">{student.id.toLowerCase()}@stg.in</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[#888888]">
                     <TrendingUp size={12} className="text-emerald-500" />
                     <span className="text-[9px] font-black uppercase tracking-widest">Performance: <span className="text-emerald-600">High</span></span>
                  </div>
               </div>

               <div className="flex items-center gap-2 pt-2">
                  <button className="flex-1 py-2.5 bg-[#141414] text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all">Details</button>
                  <button className="p-2.5 bg-gray-50 text-[#888888] hover:text-blue-600 hover:border-blue-200 border border-transparent rounded-xl transition-all">
                     <MessageCircle size={16} />
                  </button>
               </div>
            </div>
          </motion.div>
        ))}
        {filteredStudents.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-300 uppercase text-[10px] font-black tracking-widest italic">No students found matching your search.</div>
        )}
      </div>

      <div className="bg-[#141414] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 blur-[100px] -mr-40 -mt-40"></div>
        <div className="relative z-10">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-white/10 pb-6">
              <div className="flex items-center space-x-4">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400">
                    <FileBarChart size={24} />
                 </div>
                 <div>
                    <h2 className="text-xl font-black uppercase tracking-tight">Performance Overview</h2>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Aggregate analytics of your current batch</p>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Avg Attendance', value: '94%', icon: Users },
                { label: 'Assessments Pass Rate', value: '88%', icon: Award },
                { label: 'Course Progress', value: '62%', icon: BookOpen },
              ].map((stat, i) => (
                <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-3xl group hover:bg-white/10 transition-all">
                   <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-white/10 rounded-xl text-white/60"><stat.icon size={18} /></div>
                      <ChevronRight size={14} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                   </div>
                   <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{stat.label}</p>
                   <p className="text-3xl font-black mt-1 tracking-tighter">{stat.value}</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
