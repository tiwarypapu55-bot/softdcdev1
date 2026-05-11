/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  UserCheck, 
  Users,
  Search,
  ChevronRight,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

export const TeacherAttendance = () => {
  const { students } = useApp();
  const [selectedBatch, setSelectedBatch] = useState('B1');
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});

  const batches = [
    { id: 'B1', name: 'Batch A - Advanced Tally', time: '10:00 AM' },
    { id: 'B2', name: 'Batch B - GST Filing', time: '01:30 PM' },
    { id: 'B3', name: 'Batch C - Business Accounting', time: '05:00 PM' },
  ];

  const batchStudents = students.slice(0, 10);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
    }, 2000);
  };

  const toggleAttendance = (id: string) => {
    setAttendance(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const presentCount = Object.values(attendance).filter(v => v).length;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-[#141414] tracking-tight uppercase italic leading-none">Attendance Log</h1>
          <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest mt-2">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center space-x-3">
           <div className="text-right">
              <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Marked for Session</p>
              <p className="text-sm font-black text-[#141414] uppercase">{presentCount} / {batchStudents.length} Present</p>
           </div>
           <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
              <UserCheck size={24} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
           {batches.map((batch) => (
             <button
               key={batch.id}
               onClick={() => setSelectedBatch(batch.id)}
               className={clsx(
                 "w-full text-left p-6 rounded-[2rem] border transition-all relative group",
                 selectedBatch === batch.id 
                   ? "bg-[#141414] text-white border-transparent shadow-xl" 
                   : "bg-white border-gray-100 text-[#141414] hover:border-gray-300"
               )}
             >
               <div className="flex flex-col space-y-4">
                  <div className={clsx(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    selectedBatch === batch.id ? "bg-white/10" : "bg-gray-50"
                  )}>
                     <Clock size={18} className={selectedBatch === batch.id ? "text-blue-400" : "text-gray-400"} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-tight">{batch.name}</h4>
                    <p className={clsx(
                      "text-[10px] font-bold uppercase tracking-widest mt-1",
                      selectedBatch === batch.id ? "text-white/40" : "text-[#888888]"
                    )}>Starts at {batch.time}</p>
                  </div>
               </div>
               {selectedBatch === batch.id && (
                 <div className="absolute right-6 top-1/2 -translate-y-1/2">
                    <ArrowRight size={18} className="text-blue-400" />
                 </div>
               )}
             </button>
           ))}

           <div className="p-6 bg-blue-50 border border-blue-100 rounded-[2rem] space-y-4 mt-8">
              <div className="flex items-center space-x-3 text-blue-600">
                 <AlertCircle size={18} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Attendance Policy</span>
              </div>
              <p className="text-[10px] text-blue-900/60 font-bold leading-relaxed uppercase">
                Attendance must be marked within 30 minutes of session commencement. 
                Manual overrides require admin approval.
              </p>
           </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-100 shadow-xl rounded-[3rem] overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
               <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                     <Search size={16} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Quick find in batch..." 
                    className="bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-gray-300 w-64"
                  />
               </div>
               <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => {
                       const newState: Record<string, boolean> = {};
                       batchStudents.forEach(s => newState[s.id] = true);
                       setAttendance(newState);
                    }}
                    className="text-[9px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all"
                  >
                    Mark All Present
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={clsx(
                      "px-6 py-3 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center gap-2",
                      isSubmitted ? "bg-emerald-500 shadow-emerald-500/20" : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
                    )}
                  >
                    {isSubmitting ? 'Processing...' : isSubmitted ? (
                      <>
                        <CheckCircle2 size={14} />
                        <span>Logged Successfully</span>
                      </>
                    ) : 'Submit Log'}
                  </button>
               </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest">Student Info</th>
                    <th className="px-8 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest">Last Entry</th>
                    <th className="px-8 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {batchStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                           <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center p-0.5 border border-gray-200">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.id}`} className="w-full h-full rounded-xl" alt="Profile" />
                           </div>
                           <div>
                              <p className="text-sm font-black text-[#141414] uppercase">{student.name}</p>
                              <p className="text-[9px] font-black text-[#888888] uppercase tracking-widest mt-0.5">ID: {student.id}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className={clsx(
                           "inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                           attendance[student.id] 
                             ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                             : "bg-red-50 text-red-600 border border-red-100"
                         )}>
                            <div className={clsx("w-1.5 h-1.5 rounded-full", attendance[student.id] ? "bg-emerald-600" : "bg-red-600")}></div>
                            <span>{attendance[student.id] ? 'Present' : 'Absent'}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-[10px] font-bold text-gray-400">
                         {attendance[student.id] ? 'Just now' : 'Yesterday, 10:05 AM'}
                      </td>
                      <td className="px-8 py-6 text-right">
                         <button 
                           onClick={() => toggleAttendance(student.id)}
                           className={clsx(
                             "px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                             attendance[student.id]
                               ? "bg-gray-100 text-[#141414] hover:bg-red-600 hover:text-white"
                               : "bg-[#141414] text-white hover:bg-emerald-600 shadow-xl shadow-black/10 hover:shadow-emerald-500/20"
                           )}
                         >
                            {attendance[student.id] ? 'Mark Absent' : 'Mark Present'}
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
