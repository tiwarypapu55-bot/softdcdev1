/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
  Monitor,
  X,
  Trash2,
  Edit2
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from "clsx";

export const TimeTable = () => {
  const { sessions } = useApp();
  const [selectedDay, setSelectedDay] = useState('MONDAY');
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  const academicSessions = sessions && sessions.length > 0 ? sessions : [
    { id: 'sess-1', name: '2024-25', status: 'ACTIVE', isDefault: true },
    { id: 'sess-2', name: '2025-26', status: 'INACTIVE', isDefault: false }
  ];

  const defaultSessionName = academicSessions.find(s => s.isDefault || s.status === 'ACTIVE')?.name || academicSessions[0]?.name || '2024-25';
  
  const [currentSessionName, setCurrentSessionName] = useState(() => {
    const saved = localStorage.getItem('timetable_current_session');
    return saved || defaultSessionName;
  });

  const [schedule, setSchedule] = useState<any[]>(() => {
    const saved = localStorage.getItem('timetable_schedule');
    return saved ? JSON.parse(saved) : [
      { id: '1', day: 'MONDAY', time: '09:00 AM - 10:30 AM', subject: 'Advanced Tally Prime', faculty: 'Vinay Singh', room: 'Lab 01', type: 'PRACTICAL' },
      { id: '2', day: 'MONDAY', time: '11:00 AM - 12:30 PM', subject: 'GST Professional', faculty: 'Anita Rao', room: 'Theory 02', type: 'THEORY' },
      { id: '3', day: 'MONDAY', time: '01:30 PM - 03:00 PM', subject: 'Financial Accounting', faculty: 'Rajesh K', room: 'Lab 03', type: 'PRACTICAL' },
      { id: '4', day: 'TUESDAY', time: '09:00 AM - 10:30 AM', subject: 'Excel Mastery', faculty: 'Sonia M', room: 'Lab 02', type: 'PRACTICAL' },
      { id: '5', day: 'TUESDAY', time: '11:00 AM - 12:30 PM', subject: 'Account Transactions', faculty: 'Vinay Singh', room: 'Theory 01', type: 'THEORY' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('timetable_schedule', JSON.stringify(schedule));
  }, [schedule]);

  const [showSessionDropdown, setShowSessionDropdown] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Modal State for Add & Edit
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    day: 'MONDAY',
    time: '09:00 AM - 10:30 AM',
    subject: '',
    faculty: '',
    room: '',
    type: 'PRACTICAL'
  });

  const currentDaySchedule = schedule.filter(s => s.day === selectedDay);
  const weeklySlots = schedule.length;
  const utilization = weeklySlots > 0 ? Math.min(100, Math.round(weeklySlots * 16)) : 0;

  const handleExportSchedule = () => {
    const headers = ['Day', 'Time Slot', 'Subject/Topic', 'Faculty Coach', 'Room', 'Type'];
    const data = schedule.map(item => [
      item.day,
      `"${item.time}"`,
      `"${item.subject}"`,
      `"${item.faculty}"`,
      `"${item.room}"`,
      item.type
    ]);

    const csvContent = [headers, ...data].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Academic_Timetable_Session_${currentSessionName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddSlotOpen = () => {
    setEditingSlotId(null);
    setFormData({
      day: selectedDay,
      time: '09:00 AM - 10:30 AM',
      subject: '',
      faculty: '',
      room: '',
      type: 'PRACTICAL'
    });
    setShowFormModal(true);
  };

  const handleEditSlotOpen = (slot: any) => {
    setEditingSlotId(slot.id);
    setFormData({
      day: slot.day,
      time: slot.time,
      subject: slot.subject,
      faculty: slot.faculty,
      room: slot.room,
      type: slot.type
    });
    setShowFormModal(true);
    setOpenMenuId(null);
  };

  const handleDeleteSlot = (id: string) => {
    if (confirm('Are you sure you want to delete this schedule slot?')) {
      setSchedule(prev => prev.filter(s => s.id !== id));
      setOpenMenuId(null);
    }
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.faculty || !formData.room) {
      alert('Please fill out all fields.');
      return;
    }

    if (editingSlotId) {
      setSchedule(prev => prev.map(s => s.id === editingSlotId ? { ...s, ...formData } : s));
    } else {
      const newSlot = {
        id: 'slot_' + Date.now(),
        ...formData
      };
      setSchedule(prev => [...prev, newSlot]);
    }
    setShowFormModal(false);
  };

  const daysOfWeekFull = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const currentDayOfWeekIdx = new Date().getDay();
  const currentDayOfWeekName = daysOfWeekFull[currentDayOfWeekIdx];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-[#141414] tracking-tight uppercase italic">Academic Timetable</h1>
          <p className="text-sm text-[#888888] font-bold mt-1 uppercase tracking-widest">Optimized session scheduling and faculty allocation</p>
        </div>
        <div className="flex items-center space-x-3 relative">
          <div className="relative">
            <button 
              type="button"
              onClick={() => setShowSessionDropdown(!showSessionDropdown)}
              className="px-6 py-3 bg-white border border-gray-100 text-[#141414] text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-all shadow-sm flex items-center space-x-2 cursor-pointer"
            >
              <Calendar size={14} className="text-blue-600" />
              <span>Session: {currentSessionName}</span>
            </button>
            {showSessionDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 z-50 space-y-3 animate-in fade-in slide-in-from-top-2 duration-155">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Academic Sessions</span>
                  <button type="button" onClick={() => setShowSessionDropdown(false)} className="text-gray-400 hover:text-gray-650 p-1 cursor-pointer">
                    <X size={14} />
                  </button>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {academicSessions.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setCurrentSessionName(s.name);
                        localStorage.setItem('timetable_current_session', s.name);
                        setShowSessionDropdown(false);
                      }}
                      className={clsx(
                        "w-full text-left p-2.5 rounded-xl text-[10px] font-black uppercase tracking-tight flex items-center justify-between transition-all cursor-pointer",
                        currentSessionName === s.name 
                          ? "bg-blue-50 text-blue-600" 
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      <span>Session {s.name}</span>
                      {(s.isDefault || s.status === 'ACTIVE') && (
                        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 font-black text-[7px] rounded-sm">Active</span>
                      )}
                    </button>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (days.includes(currentDayOfWeekName)) {
                        setSelectedDay(currentDayOfWeekName);
                      } else {
                        setSelectedDay('MONDAY');
                      }
                      setShowSessionDropdown(false);
                    }}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[9px] font-black uppercase tracking-widest text-center transition-all flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>Jump to Today ({currentDayOfWeekName})</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button 
            type="button"
            onClick={handleAddSlotOpen}
            className="px-5 py-3 bg-white border border-gray-200 text-[#141414] text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-50 transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Plus size={14} className="text-blue-600" />
            <span>Add Slot</span>
          </button>

          <button 
            type="button"
            onClick={handleExportSchedule}
            className="px-6 py-3 bg-[#141414] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-black/10 hover:bg-blue-600 transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Download size={14} />
            <span>Export Schedule</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-2 p-2 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
         {days.map(day => (
           <button
             key={day}
             type="button"
             onClick={() => setSelectedDay(day)}
             className={clsx(
               "py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all cursor-pointer",
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
                 <div className="flex items-center justify-between relative">
                    <div className={clsx(
                      "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                      session.type === 'PRACTICAL' ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-orange-50 text-orange-600 border-orange-100"
                    )}>
                       {session.type}
                    </div>
                    <div className="relative">
                      <button 
                        type="button"
                        onClick={() => setOpenMenuId(openMenuId === session.id ? null : session.id)}
                        className="p-2 text-gray-400 hover:text-[#141414] rounded-lg transition-colors cursor-pointer"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openMenuId === session.id && (
                        <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 z-40 w-32 animate-in fade-in zoom-in-95 duration-100">
                          <button
                            type="button"
                            onClick={() => handleEditSlotOpen(session)}
                            className="w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-wider text-gray-700 hover:bg-gray-50 flex items-center space-x-2 cursor-pointer"
                          >
                            <Edit2 size={12} className="text-blue-600" />
                            <span>Edit Slot</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSlot(session.id)}
                            className="w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-wider text-red-600 hover:bg-red-50 flex items-center space-x-2 cursor-pointer"
                          >
                            <Trash2 size={12} className="text-red-600" />
                            <span>Delete Slot</span>
                          </button>
                        </div>
                      )}
                    </div>
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
                          {session.faculty ? session.faculty.split(' ').map(n => n[0]).join('') : 'FC'}
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
              <button 
                type="button"
                onClick={handleAddSlotOpen}
                className="px-6 py-3 bg-white border border-gray-100 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:border-blue-600 transition-all flex items-center space-x-2 mx-auto cursor-pointer shadow-sm"
              >
                 <Plus size={14} className="text-blue-600" />
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
                  <p className="text-3xl font-black">{weeklySlots}</p>
               </div>
               <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Utilization</p>
                  <p className="text-3xl font-black text-blue-400">{utilization}%</p>
               </div>
            </div>
         </div>
      </div>

      {/* Add / Edit Slot Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 w-full max-w-lg p-8 relative animate-in zoom-in-95 duration-200">
            <button 
              type="button"
              onClick={() => setShowFormModal(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-[#141414] rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-black text-[#141414] uppercase tracking-tight italic mb-1">
              {editingSlotId ? "Edit Timetable Slot" : "Add Timetable Slot"}
            </h3>
            <p className="text-xs text-[#888888] font-bold uppercase tracking-widest mb-6">
              {editingSlotId ? "Update class slot settings" : "Schedule a new class slot"}
            </p>

            <form onSubmit={handleSaveSlot} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Day of Week</label>
                  <select
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    className="w-full bg-[#F9F9F9] border border-gray-200 hover:border-gray-300 focus:border-blue-600 outline-none p-3.5 rounded-xl text-xs font-black uppercase tracking-wider h-12"
                  >
                    {days.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Class Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-[#F9F9F9] border border-gray-200 hover:border-gray-300 focus:border-blue-600 outline-none p-3.5 rounded-xl text-xs font-black uppercase tracking-wider h-12"
                  >
                    <option value="PRACTICAL">PRACTICAL</option>
                    <option value="THEORY">THEORY</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Class Hours (Time Slot)</label>
                <input
                  type="text"
                  placeholder="e.g. 09:00 AM - 10:30 AM"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full bg-[#F9F9F9] border border-gray-200 hover:border-gray-300 focus:border-blue-600 outline-none p-3.5 rounded-xl text-xs font-semibold h-12 px-4 shadow-inner"
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Subject / Topic Details</label>
                <input
                  type="text"
                  placeholder="e.g. GST Professional or Financial Accounting"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-[#F9F9F9] border border-gray-200 hover:border-gray-300 focus:border-blue-600 outline-none p-3.5 rounded-xl text-xs font-semibold h-12 px-4 shadow-inner"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Faculty Coach</label>
                  <input
                    type="text"
                    placeholder="e.g. Anita Rao"
                    value={formData.faculty}
                    onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                    className="w-full bg-[#F9F9F9] border border-gray-200 hover:border-gray-300 focus:border-blue-600 outline-none p-3.5 rounded-xl text-xs font-semibold h-12 px-4 shadow-inner"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Assigned Area (Room / Lab)</label>
                  <input
                    type="text"
                    placeholder="e.g. Lab 01"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="w-full bg-[#F9F9F9] border border-gray-200 hover:border-gray-300 focus:border-blue-600 outline-none p-3.5 rounded-xl text-xs font-semibold h-12 px-4 shadow-inner"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-6 py-3.5 hover:bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  {editingSlotId ? "Save Changes" : "Create Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
