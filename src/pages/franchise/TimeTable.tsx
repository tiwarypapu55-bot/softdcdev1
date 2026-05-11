/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Clock, 
  User, 
  BookOpen, 
  Filter, 
  Download, 
  Search,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Monitor
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

export const TimeTable = () => {
  const [selectedDay, setSelectedDay] = useState('MONDAY');
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  const schedule = [
    { id: '1', day: 'MONDAY', time: '09:00 AM - 10:30 AM', subject: 'Advanced Tally Prime', faculty: 'Vinay Singh', room: 'Lab 01', type: 'PRACTICAL' },
    { id: '2', day: 'MONDAY', time: '11:00 AM - 12:30 PM', subject: 'GST Professional', faculty: 'Anita Rao', room: 'Theory 02', type: 'THEORY' },
    { id: '3', day: 'MONDAY', time: '01:30 PM - 03:00 PM', subject: 'Financial Accounting', faculty: 'Rajesh K', room: 'Lab 03', type: 'PRACTICAL' },
    { id: '4', day: 'TUESDAY', time: '09:00 AM - 10:30 AM', subject: 'Excel Mastery', faculty: 'Sonia M', room: 'Lab 02', type: 'PRACTICAL' },
    { id: '5', day: 'TUESDAY', time: '11:00 AM - 12:30 PM', subject: 'Voucher Entry', faculty: 'Vinay Singh', room: 'Theory 01', type: 'THEORY' },
  ];

  const currentDaySchedule = schedule.filter(s => s.day === selectedDay);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-[#141414] tracking-tight uppercase italic">Academic Timetable</h1>
          <p className="text-sm text-[#888888] font-bold mt-1 uppercase tracking-widest">Optimized session scheduling and faculty allocation</p>
        </div>
        <div className="flex items-center space-x-3">
           <button className="px-6 py-3 bg-white border border-gray-100 text-[#141414] text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-all shadow-sm">
              Current Session
           </button>
           <button className="px-6 py-3 bg-[#141414] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-black/10 hover:bg-blue-600 transition-all flex items-center space-x-2">
              <Download size={14} />
              <span>Export Schedule</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-2 p-2 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
         {days.map(day => (
           <button
             key={day}
             onClick={() => setSelectedDay(day)}
             className={clsx(
               "py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all",
               selectedDay === day 
                 ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                 : "text-[#888888] hover:bg-gray-50 hover:text-[#141414]"
             )}
           >
              {day}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {currentDaySchedule.map((session, i) => (
           <motion.div 
             key={session.id}
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: i * 0.1 }}
             className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl p-8 relative group hover:border-blue-200 transition-all"
           >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50/30 rounded-full blur-2xl group-hover:bg-blue-100/40 transition-all"></div>
              
              <div className="relative z-10 space-y-6">
                 <div className="flex items-center justify-between">
                    <div className={clsx(
                      "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                      session.type === 'PRACTICAL' ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-orange-50 text-orange-600 border-orange-100"
                    )}>
                       {session.type}
                    </div>
                    <button className="p-2 text-gray-400 hover:text-[#141414] rounded-lg transition-colors">
                       <MoreVertical size={16} />
                    </button>
                 </div>
                 
                 <div className="space-y-4 pt-4">
                    <div className="flex items-center space-x-3">
                       <div className="w-10 h-10 bg-[#F5F5F5] rounded-xl flex items-center justify-center text-[#141414]">
                          <Clock size={20} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Session Slot</p>
                          <p className="text-sm font-black text-[#141414] uppercase tracking-tight">{session.time}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                       <div className="w-10 h-10 bg-[#F5F5F5] rounded-xl flex items-center justify-center text-[#141414]">
                          <BookOpen size={20} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Topic Details</p>
                          <p className="text-sm font-black text-blue-600 uppercase tracking-tight">{session.subject}</p>
                       </div>
                    </div>
                 </div>

                 <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                       <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-[10px]">
                          {session.faculty.split(' ').map(n => n[0]).join('')}
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-[#141414] uppercase tracking-tight">{session.faculty}</p>
                          <p className="text-[8px] font-bold text-[#888888] uppercase tracking-widest">Faculty Coach</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="flex items-center space-x-1 justify-end text-emerald-600">
                          <Monitor size={12} />
                          <span className="text-[10px] font-black">{session.room}</span>
                       </div>
                       <p className="text-[8px] font-bold text-[#888888] uppercase tracking-widest italic">Assigned Area</p>
                    </div>
                 </div>
              </div>
           </motion.div>
         ))}

         {currentDaySchedule.length === 0 && (
           <div className="lg:col-span-3 py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
                 <Calendar size={32} className="text-gray-300" />
              </div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No classes scheduled for {selectedDay}</p>
              <button className="px-6 py-3 bg-white border border-gray-100 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:border-blue-600 transition-all flex items-center space-x-2 mx-auto">
                 <Plus size={14} />
                 <span>Add Slot</span>
              </button>
           </div>
         )}
      </div>

      <div className="bg-[#141414] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="max-w-md">
               <h3 className="text-2xl font-black uppercase tracking-tight leading-none mb-4 italic">Smart Schedule Manager</h3>
               <p className="text-white/60 text-sm font-medium leading-relaxed uppercase tracking-tighter">Manage conflicts, allocate labs, and track syllabus coverage across all programs in real-time.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
               <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Weekly Slots</p>
                  <p className="text-3xl font-black">124</p>
               </div>
               <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Utilization</p>
                  <p className="text-3xl font-black text-blue-400">88%</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
