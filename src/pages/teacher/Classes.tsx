/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Video, 
  Calendar,
  Search,
  Filter,
  ChevronRight,
  Play
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

export const Classes = () => {
  const { currentUser } = useApp();
  const [filter, setFilter] = useState('ALL');

  const myClasses = [
    {
      id: 'c1',
      subject: 'Advanced Tally Prime',
      batch: 'Batch A - Morning',
      time: '10:00 AM - 12:00 PM',
      room: 'Lab 1',
      students: 18,
      status: 'ONGOING',
      icon: BookOpen,
      color: 'blue'
    },
    {
      id: 'c2',
      subject: 'GST Compliance & Filing',
      batch: 'Batch B - Afternoon',
      time: '01:30 PM - 03:30 PM',
      room: 'Room 202',
      students: 22,
      status: 'UPCOMING',
      icon: CheckCircle2,
      color: 'emerald'
    },
    {
      id: 'c3',
      subject: 'Business Accounting',
      batch: 'Evening Professionals',
      time: '05:00 PM - 07:00 PM',
      room: 'Online/Virtual',
      students: 12,
      status: 'UPCOMING',
      icon: Video,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-[#141414] tracking-tight uppercase italic leading-none">Class Schedule</h1>
          <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest mt-2">Managing Batches for SOFTDEV TALLY GURU</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
           {['ALL', 'ONGOING', 'UPCOMING'].map((t) => (
             <button
               key={t}
               onClick={() => setFilter(t)}
               className={clsx(
                 "px-6 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all",
                 filter === t ? "bg-white text-[#141414] shadow-sm" : "text-gray-500 hover:text-[#141414]"
               )}
             >
               {t}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {myClasses
            .filter(c => filter === 'ALL' || c.status === filter)
            .map((cls) => (
            <motion.div 
              key={cls.id}
              whileHover={{ y: -4 }}
              className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl relative overflow-hidden group"
            >
              <div className={clsx(
                "absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 -mr-12 -mt-12",
                cls.color === 'blue' ? 'bg-blue-600' : cls.color === 'emerald' ? 'bg-emerald-600' : 'bg-purple-600'
              )}></div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center space-x-6">
                   <div className={clsx(
                     "w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg",
                     cls.color === 'blue' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 
                     cls.color === 'emerald' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                     'bg-purple-50 text-purple-600 border border-purple-100'
                   )}>
                      <cls.icon size={24} />
                   </div>
                   <div>
                      <h3 className="text-xl font-black text-[#141414] tracking-tight truncate max-w-[200px] md:max-w-xs">{cls.subject}</h3>
                      <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest mt-1">{cls.batch}</p>
                   </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                   <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <Clock size={12} className="text-[#888888]" />
                      <span className="text-[10px] font-bold text-[#141414]">{cls.time}</span>
                   </div>
                   <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <MapPin size={12} className="text-[#888888]" />
                      <span className="text-[10px] font-bold text-[#141414] uppercase">{cls.room}</span>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 pt-8 border-t border-gray-50 relative z-10">
                 <div className="flex items-center space-x-4">
                    <div className="flex -space-x-2">
                       {[1,2,3].map(i => (
                         <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-[#F0F0F0] flex items-center justify-center overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="Student" />
                         </div>
                       ))}
                       <div className="w-8 h-8 rounded-full border-2 border-white bg-[#141414] text-white flex items-center justify-center text-[10px] font-black">
                          +{cls.students - 3}
                       </div>
                    </div>
                    <span className="text-[10px] font-black text-[#888888] uppercase tracking-widest">{cls.students} Enrolled Students</span>
                 </div>

                 <div className="flex items-center justify-end space-x-3">
                    <button className={clsx(
                      "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl",
                      cls.status === 'ONGOING' 
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20' 
                        : 'bg-[#141414] text-white hover:bg-gray-800 shadow-black/10'
                    )}>
                       {cls.status === 'ONGOING' ? 'Return to Room' : 'Start Session'}
                    </button>
                    <button className="p-3 bg-gray-50 text-[#888888] hover:text-[#141414] hover:bg-gray-100 rounded-xl transition-all border border-gray-100">
                       <Play size={14} className="fill-current" />
                    </button>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-8">
           <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
              <h3 className="text-lg font-black uppercase tracking-tight mb-4 flex items-center gap-2">
                 <Calendar className="text-white/60" size={18} />
                 Upcoming Events
              </h3>
              <div className="space-y-4 relative z-10">
                 {[
                   { title: 'Faculty Meet', date: 'Tomorrow, 09:00 AM', type: 'MEETING' },
                   { title: 'Advanced Tally Exam', date: '15 May, 10:00 AM', type: 'EXAM' },
                 ].map((event, i) => (
                   <div key={i} className="p-4 bg-white/10 rounded-2xl border border-white/10 hover:bg-white/15 transition-all">
                      <p className="text-xs font-black uppercase">{event.title}</p>
                      <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest mt-1">{event.date}</p>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-6 py-3 bg-white text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all">
                 View Full Calendar
              </button>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden relative group">
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-amber-50 rounded-full blur-3xl opacity-50 group-hover:scale-110 transition-transform"></div>
              <h3 className="text-lg font-black text-[#141414] uppercase tracking-tight mb-6">Quick Links</h3>
              <div className="space-y-3 relative z-10">
                 {[
                   { name: 'Download Class Log', icon: Download },
                   { name: 'Manage Batches', icon: Filter },
                   { name: 'Subject Materials', icon: BookOpen },
                 ].map((link, i) => (
                   <button key={i} className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50 transition-all group/btn">
                      <div className="flex items-center space-x-3">
                         <link.icon size={16} className="text-[#888888] group-hover/btn:text-blue-600" />
                         <span className="text-[10px] font-black text-[#141414] uppercase tracking-widest">{link.name}</span>
                      </div>
                      <ChevronRight size={14} className="text-gray-300 group-hover/btn:text-blue-600" />
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const Download = ({ size, className }: any) => (
   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
   </svg>
);
