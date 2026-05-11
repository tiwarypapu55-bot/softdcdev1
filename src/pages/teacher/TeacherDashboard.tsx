/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/Layout';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  FileCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';

export const TeacherDashboard = () => {
  const { currentUser } = useApp();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-gray-200 pb-8">
        <div>
          <h1 className="text-3xl font-black text-[#141414] tracking-tight">Teacher Workspace</h1>
          <p className="text-sm text-[#888888]">Managing Classes for SOFTDEV TALLY GURU</p>
        </div>
        <div className="flex items-center space-x-3">
           <div className="text-right">
              <p className="text-sm font-black text-[#141414]">{currentUser?.name}</p>
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Faculty Code: TCH-092</p>
           </div>
           <img src={currentUser?.avatar} className="w-10 h-10 rounded-full border border-gray-200" alt="Teacher" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <StatCard title="Active Classes" value="3" icon={BookOpen} color="blue" />
        <StatCard title="My Students" value="48" icon={Users} color="green" />
        <StatCard title="Today's Attendance" value="94%" icon={Calendar} color="orange" />
        <StatCard title="Pending Grading" value="12" icon={FileCheck} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-10 rounded-xl border border-[#E5E5E5] shadow-sm">
            <h3 className="text-xl font-black text-[#141414] mb-6">Today's Schedule</h3>
            <div className="space-y-4">
               {[
                 { time: '10:00 AM', subject: 'Advanced Tally Prime', room: 'Lab 1' },
                 { time: '12:30 PM', subject: 'Business Accounting', room: 'Room 202' },
                 { time: '03:00 PM', subject: 'GST Compliance', room: 'Online' },
               ].map((session, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-[#FBFBFB] rounded-2xl border border-[#F0F0F0]">
                    <div className="flex items-center space-x-4">
                       <Clock size={20} className="text-blue-500" />
                       <div>
                          <p className="text-sm font-bold text-[#141414]">{session.subject}</p>
                          <p className="text-[10px] text-[#888888]">{session.time} • {session.room}</p>
                       </div>
                    </div>
                    <Link 
                      to="/teacher/attendance"
                      className="px-3 py-1.5 bg-[#141414] text-white text-[10px] font-bold rounded-lg uppercase tracking-widest hover:bg-blue-600 transition-all"
                    >
                      Mark Attendance
                    </Link>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-white p-10 rounded-xl border border-[#E5E5E5] shadow-sm">
            <h3 className="text-xl font-black text-[#141414] mb-6">Recent Student Activity</h3>
            <div className="space-y-4">
               {[
                 { student: 'Rahul Kumar', action: 'Submitted Assignment', time: '2h ago' },
                 { student: 'Priya Singh', action: 'Requested Leave', time: '5h ago' },
                 { student: 'Sameer Khan', action: 'Completed Unit 1', time: 'Yesterday' },
               ].map((item, i) => (
                 <div key={i} className="flex items-center space-x-4 p-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                       <p className="text-sm font-medium"><span className="font-bold">{item.student}</span> {item.action}</p>
                       <p className="text-[10px] text-[#888888]">{item.time}</p>
                    </div>
                    <CheckCircle2 size={16} className="text-green-500" />
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};
