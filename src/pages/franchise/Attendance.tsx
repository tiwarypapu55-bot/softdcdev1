/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Search,
  Filter,
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

export const Attendance = () => {
  const { students } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [attendance, setAttendance] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'LATE'>>({});

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAttendance = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-[#141414] tracking-tight uppercase italic">Attendance Portal</h1>
          <p className="text-sm text-[#888888] font-bold mt-1 uppercase tracking-widest">Mark and track daily student presence</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-3">
             <button className="p-2 hover:bg-gray-50 rounded-xl transition-all"><ChevronLeft size={16} /></button>
             <input 
               type="date" 
               value={selectedDate}
               onChange={(e) => setSelectedDate(e.target.value)}
               className="text-xs font-black uppercase tracking-widest outline-none bg-transparent"
             />
             <button className="p-2 hover:bg-gray-50 rounded-xl transition-all"><ChevronRight size={16} /></button>
          </div>
          <button className="px-6 py-3 bg-[#141414] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-black/10 hover:bg-blue-600 transition-all flex items-center space-x-2">
             <Download size={14} />
             <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="SEARCH STUDENT..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                 <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all"><Filter size={18} /></button>
                 <button className="px-6 py-4 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-600 hover:text-white transition-all">Submit Attendance</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-5 text-left text-[10px] font-black text-[#888888] uppercase tracking-[0.2em]">Student Details</th>
                    <th className="px-8 py-5 text-center text-[10px] font-black text-[#888888] uppercase tracking-[0.2em]">Daily Status</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-[#888888] uppercase tracking-[0.2em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xs border border-blue-100">
                             {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-black text-[#141414] uppercase tracking-tight">{student.name}</p>
                            <p className="text-[10px] font-mono text-[#888888] mt-0.5">{student.enrollmentNo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center space-x-3">
                          <button 
                            onClick={() => toggleAttendance(student.id, 'PRESENT')}
                            className={clsx(
                              "flex items-center space-x-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                              attendance[student.id] === 'PRESENT' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "bg-gray-100 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600"
                            )}
                          >
                             <CheckCircle2 size={12} />
                             <span>P</span>
                          </button>
                          <button 
                            onClick={() => toggleAttendance(student.id, 'ABSENT')}
                            className={clsx(
                              "flex items-center space-x-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                              attendance[student.id] === 'ABSENT' ? "bg-red-600 text-white shadow-lg shadow-red-200" : "bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-600"
                            )}
                          >
                             <XCircle size={12} />
                             <span>A</span>
                          </button>
                          <button 
                            onClick={() => toggleAttendance(student.id, 'LATE')}
                            className={clsx(
                              "flex items-center space-x-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                              attendance[student.id] === 'LATE' ? "bg-amber-500 text-white shadow-lg shadow-amber-100" : "bg-gray-100 text-gray-400 hover:bg-amber-50 hover:text-amber-600"
                            )}
                          >
                             <Clock size={12} />
                             <span>L</span>
                          </button>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <button className="p-2 text-gray-400 hover:text-[#141414] hover:bg-white rounded-xl border border-transparent hover:border-gray-100 transition-all">
                            <MoreVertical size={16} />
                         </button>
                      </td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-20 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                           <Users size={24} className="text-gray-300" />
                        </div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No students found matching search criteria</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#141414] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full"></div>
            <div className="relative z-10 space-y-6">
               <div className="flex items-center space-x-3">
                  <Calendar className="text-blue-400" size={20} />
                  <h3 className="text-sm font-black uppercase tracking-widest">Stats Overview</h3>
               </div>
               <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Students</p>
                     <p className="text-2xl font-black mt-1">{students.length}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Marked Today</p>
                     <p className="text-2xl font-black mt-1">{Object.keys(attendance).length}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Attendance %</p>
                     <p className="text-2xl font-black mt-1 text-emerald-400">92.4%</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-6">
             <h3 className="text-sm font-black text-[#141414] uppercase tracking-widest">Recent Logs</h3>
             <div className="space-y-4">
                {[
                  { name: 'Rahul Kumar', time: '09:05 AM', status: 'PRESENT' },
                  { name: 'Anjali Sharma', time: '09:15 AM', status: 'LATE' },
                  { name: 'Vikram Singh', time: '09:30 AM', status: 'PRESENT' },
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                     <div>
                        <p className="text-[11px] font-black text-[#141414] uppercase tracking-tight">{log.name}</p>
                        <p className="text-[9px] font-bold text-[#888888] uppercase tracking-widest">{log.time}</p>
                     </div>
                     <span className={clsx(
                       "text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest",
                       log.status === 'PRESENT' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                     )}>{log.status}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
