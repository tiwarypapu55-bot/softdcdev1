/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Layers, 
  BookOpen, 
  Book, 
  Settings, 
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  ListPlus,
  X,
  Star
} from 'lucide-react';
import { AcademicSession } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';

type TabType = 'SESSION' | 'CATEGORY' | 'COURSE' | 'SUBJECT' | 'PROGRAM' | 'SETTING';

export const AcademicMaster = () => {
  const { currentUser } = useApp();
  const isViewOnly = currentUser?.role === 'FRANCHISE';
  const [activeTab, setActiveTab] = useState<TabType>('SESSION');

  const tabs = [
    { id: 'SESSION', name: 'Academic Session', icon: Calendar },
    { id: 'CATEGORY', name: 'Category', icon: Layers },
    { id: 'COURSE', name: 'Course', icon: BookOpen },
    { id: 'SUBJECT', name: 'Subject', icon: Book },
    { id: 'PROGRAM', name: 'Add Program', icon: ListPlus },
    { id: 'SETTING', name: 'Course Setting', icon: Settings },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto bg-background min-h-screen">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-black text-[#141414] tracking-tight">Academic Master</h1>
        <p className="text-sm text-[#888888]">Configure core institutional settings and academic structures.</p>
        {isViewOnly && (
          <div className="mt-4 px-4 py-2 bg-amber-50 border border-amber-100 rounded-xl flex items-center space-x-2 text-amber-700">
            <CheckCircle2 size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">View Only Mode: Franchise access restricted to reading data</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={clsx(
                "flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all",
                isActive 
                  ? "bg-white text-[#141414] shadow-sm" 
                  : "text-[#888888] hover:text-[#141414] hover:bg-gray-200/50"
              )}
            >
              <Icon size={16} />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl border border-[#E5E5E5] shadow-sm p-8 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'SESSION' && <SessionManager isViewOnly={isViewOnly} />}
            {activeTab === 'CATEGORY' && <CategoryManager isViewOnly={isViewOnly} />}
            {activeTab === 'COURSE' && <CourseManager isViewOnly={isViewOnly} />}
            {activeTab === 'SUBJECT' && <SubjectManager isViewOnly={isViewOnly} />}
            {activeTab === 'PROGRAM' && <ProgramManager isViewOnly={isViewOnly} />}
            {activeTab === 'SETTING' && <CourseSettingManager isViewOnly={isViewOnly} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const SessionManager = ({ isViewOnly }: { isViewOnly: boolean }) => {
  const { sessions, addSession, updateSession, deleteSession } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState<AcademicSession | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    isDefault: false
  });

  const handleOpen = (session?: AcademicSession) => {
    if (session) {
      setEditingSession(session);
      setFormData({
        name: session.name,
        startDate: session.startDate,
        endDate: session.endDate,
        status: session.status,
        isDefault: session.isDefault
      });
    } else {
      setEditingSession(null);
      setFormData({
        name: '',
        startDate: '',
        endDate: '',
        status: 'ACTIVE',
        isDefault: false
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSession) {
      updateSession(editingSession.id, formData);
    } else {
      const newSession: AcademicSession = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData
      };
      addSession(newSession);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-[#141414]">Academic Sessions</h3>
        {!isViewOnly && (
          <button 
            onClick={() => handleOpen()}
            className="flex items-center space-x-2 px-4 py-2 bg-[#141414] text-white text-[10px] font-bold rounded-lg uppercase tracking-widest shadow-lg shadow-black/10"
          >
            <Plus size={14} />
            <span>Add Session</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sessions.map((session) => (
          <div key={session.id} className="p-6 bg-[#FBFBFB] border border-[#F0F0F0] rounded-2xl flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <p className="text-sm font-black text-[#141414]">{session.name}</p>
                {session.isDefault && (
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-tighter rounded">Default</span>
                )}
              </div>
              <p className={clsx(
                "text-[10px] font-bold uppercase tracking-widest",
                session.status === 'ACTIVE' ? "text-green-600" : "text-gray-400"
              )}>
                {session.status}
              </p>
              <p className="text-[9px] text-[#888888] font-mono mt-1">{session.startDate} to {session.endDate}</p>
            </div>
            {!isViewOnly && (
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleOpen(session)}
                  className="p-2 text-[#888888] hover:text-[#141414] hover:bg-white rounded-lg transition-all border border-transparent hover:border-[#F0F0F0]"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this session?')) {
                      deleteSession(session.id);
                    }
                  }}
                  className="p-2 text-[#888888] hover:text-red-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-[#F0F0F0]"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute right-6 top-6 p-2 text-gray-400 hover:text-[#141414] hover:bg-gray-100 rounded-xl"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-xl font-black text-[#141414] uppercase tracking-tight mb-8">
                {editingSession ? 'Edit Academic Session' : 'Add New Session'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest pl-1">Session Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. 2024-25"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#141414] font-bold text-sm" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest pl-1">Start Date</label>
                    <input 
                      type="date" 
                      required 
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#141414] font-bold text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest pl-1">End Date</label>
                    <input 
                      type="date" 
                      required 
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#141414] font-bold text-sm" 
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div>
                    <p className="text-[10px] font-black text-[#141414] uppercase tracking-tight">Active Status</p>
                    <p className="text-[8px] text-[#888888] font-bold uppercase tracking-widest">Mark this session as active</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, status: formData.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' })}
                    className={clsx(
                      "w-12 h-6 rounded-full relative p-1 transition-colors",
                      formData.status === 'ACTIVE' ? "bg-green-600" : "bg-gray-300"
                    )}
                  >
                    <div className={clsx(
                      "w-4 h-4 bg-white rounded-full transition-transform",
                      formData.status === 'ACTIVE' ? "translate-x-6" : "translate-x-0"
                    )}></div>
                  </button>
                </div>

                <div className="flex items-center space-x-3 p-4">
                  <input 
                    type="checkbox" 
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-[#141414] focus:ring-[#141414]"
                  />
                  <label htmlFor="isDefault" className="text-[10px] font-black text-[#888888] uppercase tracking-widest cursor-pointer">Set as Default Session</label>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-[#141414] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-black/10 hover:bg-gray-800 transition-colors"
                >
                  {editingSession ? 'Update Session' : 'Confirm & Save Session'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CategoryManager = ({ isViewOnly }: { isViewOnly: boolean }) => {
  const { courses } = useApp();
  const categories = Array.from(new Set(courses.map(c => c.category)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-[#141414]">Course Categories</h3>
        {!isViewOnly && (
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-[10px] font-bold rounded-lg uppercase tracking-widest shadow-lg shadow-blue-100">
            <Plus size={14} />
            <span>New Category</span>
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat} className="p-6 bg-[#FBFBFB] border border-[#F0F0F0] rounded-2xl group">
            <div className="flex items-center justify-between mb-4">
               <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Layers size={16} /></div>
               {!isViewOnly && <MoreActions />}
            </div>
            <p className="text-sm font-black text-[#141414]">{cat}</p>
            <p className="text-[10px] text-[#888888] mt-1 font-bold">
              {courses.filter(c => c.category === cat).length} Courses Included
            </p>
          </div>
        ))}
        {categories.length === 0 && <p className="text-sm text-gray-400 italic">No categories defined yet.</p>}
      </div>
    </div>
  );
};

const CourseManager = ({ isViewOnly }: { isViewOnly: boolean }) => {
  const { courses, deleteCourse } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-[#141414]">Academic Courses</h3>
        {!isViewOnly && (
          <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white text-[10px] font-bold rounded-lg uppercase tracking-widest shadow-lg shadow-emerald-100">
            <Plus size={14} />
            <span>New Course</span>
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#F0F0F0]">
              <th className="py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest">Course Name</th>
              <th className="py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest">Category</th>
              <th className="py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest">Duration</th>
              <th className="py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest">Rating</th>
              {!isViewOnly && <th className="py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest text-right">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F0F0]">
            {courses.map((course) => (
              <tr key={course.id} className="group">
                <td className="py-4">
                  <p className="text-sm font-bold text-[#141414]">{course.title}</p>
                </td>
                <td className="py-4">
                  <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{course.category}</span>
                </td>
                <td className="py-4 text-xs text-[#888888]">{course.duration}</td>
                <td className="py-4 text-xs font-black text-[#141414] flex items-center space-x-1">
                   <span>{course.rating}</span>
                   <Star size={10} className="fill-amber-400 text-amber-400" />
                </td>
                {!isViewOnly && (
                  <td className="py-4 text-right">
                    <div className="flex justify-end space-x-2">
                       <button className="p-2 text-[#888888] hover:text-[#141414] hover:bg-gray-100 rounded-lg"><Edit2 size={14} /></button>
                       <button onClick={() => deleteCourse(course.id)} className="p-2 text-[#888888] hover:text-red-600 hover:bg-gray-100 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-gray-400 italic">No courses added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SubjectManager = ({ isViewOnly }: { isViewOnly: boolean }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {!isViewOnly ? (
      <div className="space-y-6">
         <h3 className="text-lg font-black text-[#141414]">Add Subject</h3>
         <div className="space-y-4">
            <div className="space-y-1.5">
               <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Select Course</label>
               <select className="w-full p-3 bg-[#F5F5F5] border-none rounded-xl text-sm outline-none">
                  <option>Advanced Tally Prime</option>
                  <option>GST Professional</option>
               </select>
            </div>
            <div className="space-y-1.5">
               <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Subject Name</label>
               <input type="text" className="w-full p-3 bg-[#F5F5F5] border-none rounded-xl text-sm outline-none" placeholder="e.g. Voucher Entry" />
            </div>
            <div className="space-y-1.5">
               <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Credit Hours</label>
               <input type="number" className="w-full p-3 bg-[#F5F5F5] border-none rounded-xl text-sm outline-none" placeholder="40" />
            </div>
            <button className="w-full py-4 bg-[#141414] text-white text-xs font-bold rounded-2xl uppercase tracking-widest shadow-xl shadow-black/10">Register Subject</button>
         </div>
      </div>
    ) : (
      <div className="space-y-6 p-8 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
         <div className="text-2xl">📋</div>
         <h3 className="text-sm font-black text-[#141414] uppercase">Subject Registration</h3>
         <p className="text-[10px] text-gray-500 font-bold uppercase leading-relaxed">
            New subject registration is only available for system administrators. 
            Franchises can view existing subjects in the list provided.
         </p>
      </div>
    )}
    <div className="space-y-6">
       <h3 className="text-lg font-black text-[#141414]">Existing Subjects</h3>
       <div className="space-y-3">
          {[
            { name: 'Fundamentals of Accounting', course: 'Tally Prime' },
            { name: 'Taxation Rules', course: 'GST Expert' },
            { name: 'Data Management', course: 'Excel Advanced' },
          ].map((sub, i) => (
            <div key={i} className="p-4 bg-[#FBFBFB] border border-[#F0F0F0] rounded-2xl flex items-center justify-between">
               <div>
                  <p className="text-sm font-bold text-[#141414]">{sub.name}</p>
                  <p className="text-[10px] text-[#888888] uppercase font-bold">{sub.course}</p>
               </div>
               {!isViewOnly && <button className="p-2 text-red-400 hover:text-red-600"><Trash2 size={16} /></button>}
            </div>
          ))}
       </div>
    </div>
  </div>
);

const ProgramManager = ({ isViewOnly }: { isViewOnly: boolean }) => (
  <div className="space-y-8">
     <div className="bg-orange-50 border border-orange-100 p-6 rounded-3xl flex items-start space-x-4">
        <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl"><ListPlus size={24} /></div>
        <div>
           <h4 className="text-sm font-black text-orange-900 uppercase">Program Bundle Builder</h4>
           <p className="text-xs text-orange-700 mt-1 max-w-lg">Programs allow you to group multiple courses into a single certification path (e.g. "Diploma in Business Accounting").</p>
        </div>
     </div>
     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {!isViewOnly ? (
          <div className="space-y-4 p-8 bg-white border border-[#E5E5E5] rounded-3xl">
             <h3 className="text-lg font-black text-[#141414]">Program Details</h3>
             <div className="space-y-4">
                <input type="text" className="w-full p-4 bg-[#F5F5F5] border-none rounded-2xl outline-none text-sm" placeholder="Program Title" />
                <textarea className="w-full p-4 bg-[#F5F5F5] border-none rounded-2xl outline-none text-sm min-h-[100px]" placeholder="Program Description" />
                <div className="space-y-2">
                   <p className="text-[10px] font-bold text-[#888888] uppercase tracking-widest px-1">Included Courses</p>
                   <div className="flex flex-wrap gap-2">
                      {['Tally', 'Excel', 'GST'].map(tag => (
                        <span key={tag} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-[#141414] flex items-center space-x-2">
                           <span>{tag}</span>
                           <X size={12} className="cursor-pointer" />
                        </span>
                      ))}
                      <button className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-bold text-blue-600">+ Add</button>
                   </div>
                </div>
                <button className="w-full py-4 bg-orange-600 text-white text-xs font-bold rounded-2xl uppercase tracking-widest shadow-xl shadow-orange-100">Create Program</button>
             </div>
          </div>
        ) : (
          <div className="p-8 bg-gray-50 border border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-4">
             <div className="text-4xl opacity-50">🔒</div>
             <div>
                <p className="text-xs font-black text-[#141414] uppercase tracking-tight">Access Restricted</p>
                <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">Program creation is managed by the administrator</p>
             </div>
          </div>
        )}
     </div>
  </div>
);

const CourseSettingManager = ({ isViewOnly }: { isViewOnly: boolean }) => (
  <div className="space-y-8">
     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
           <section className="space-y-4">
              <h3 className="text-lg font-black text-[#141414]">Global Course Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="p-6 bg-[#FBFBFB] border border-[#F0F0F0] rounded-3xl flex items-center justify-between">
                    <div>
                       <p className="text-xs font-black text-[#141414]">Auto-Generate Code</p>
                       <p className="text-[10px] text-[#888888]">Enable automatic course ID generation</p>
                    </div>
                    <div className={clsx(
                      "w-12 h-6 rounded-full relative p-1 transition-all",
                      isViewOnly ? "bg-gray-200 cursor-not-allowed opacity-50" : "bg-blue-600 cursor-pointer"
                    )}>
                       <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                    </div>
                 </div>
                 <div className="p-6 bg-[#FBFBFB] border border-[#F0F0F0] rounded-3xl flex items-center justify-between">
                    <div>
                       <p className="text-xs font-black text-[#141414]">Prerequisite Check</p>
                       <p className="text-[10px] text-[#888888]">Mandate level-based course progression</p>
                    </div>
                    <div className={clsx(
                      "w-12 h-6 rounded-full relative p-1 transition-all",
                      isViewOnly ? "bg-gray-100 cursor-not-allowed" : "bg-gray-300 cursor-pointer"
                    )}>
                       <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                 </div>
              </div>
           </section>

           <section className="space-y-4">
              <h3 className="text-lg font-black text-[#141414]">Attendance & Grading</h3>
              <div className="p-8 bg-white border border-[#E5E5E5] rounded-3xl space-y-6">
                 <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-[#141414]">Pass Percentage</p>
                    <div className="flex items-center space-x-3">
                       <input 
                         type="number" 
                         defaultValue={35} 
                         disabled={isViewOnly}
                         className={clsx(
                           "w-20 p-2 border-none rounded-xl text-center font-black text-sm outline-none",
                           isViewOnly ? "bg-gray-100 text-gray-500" : "bg-[#F5F5F5] text-[#141414]"
                         )} 
                       />
                       <span className="text-xs font-bold text-[#141414]">%</span>
                    </div>
                 </div>
                 <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-[#141414]">Min Attendance Required</p>
                    <div className="flex items-center space-x-3">
                       <input 
                         type="number" 
                         defaultValue={75} 
                         disabled={isViewOnly}
                         className={clsx(
                           "w-20 p-2 border-none rounded-xl text-center font-black text-sm outline-none",
                           isViewOnly ? "bg-gray-100 text-gray-500" : "bg-[#F5F5F5] text-[#141414]"
                         )} 
                       />
                       <span className="text-xs font-bold text-[#141414]">%</span>
                    </div>
                 </div>
              </div>
           </section>
        </div>
        
        <div className="space-y-4">
           <div className="p-8 bg-[#141414] rounded-3xl text-white">
              <div className="flex items-center space-x-3 mb-6">
                 <Settings size={20} className="text-blue-400" />
                 <h4 className="text-sm font-black uppercase tracking-tight">Status Monitor</h4>
              </div>
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">System Integrity</span>
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-[8px] font-black uppercase tracking-widest">Normal</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Master Sync</span>
                    <span className="text-[10px] font-black">2m ago</span>
                 </div>
              </div>
           </div>
        </div>
     </div>
  </div>
);

const MoreActions = () => (
  <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-all text-[#888888]"><CheckCircle2 size={16} /></button>
);
