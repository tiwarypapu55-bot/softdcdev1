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
  Star,
  Search
} from 'lucide-react';
import { AcademicSession, CourseCategory, Program } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';

type TabType = 'SESSION' | 'CATEGORY' | 'COURSE' | 'SUBJECT' | 'PROGRAM' | 'SETTING';

export const AcademicMaster = () => {
  const { currentUser } = useApp();
  const isViewOnly = currentUser?.role === 'FRANCHISE';
  const [activeTab, setActiveTab] = useState<TabType>('SESSION');

  const tabs = [
    { id: 'SESSION', name: 'Sessions', icon: Calendar },
    { id: 'CATEGORY', name: 'Course Categories', icon: Layers },
    { id: 'COURSE', name: 'Course Master', icon: BookOpen },
    { id: 'SUBJECT', name: 'Subject Matrix', icon: Book },
    { id: 'PROGRAM', name: 'Combo Programs', icon: ListPlus },
    { id: 'SETTING', name: 'Masters Setting', icon: Settings },
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
                  className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all border border-transparent"
                  title="Delete Session"
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
  const { courseCategories, addCourseCategory, deleteCourseCategory, updateCourseCategory, courses } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCat, setEditingCat] = useState<CourseCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    bannerUrl: ''
  });

  const handleOpen = (cat?: CourseCategory) => {
    if (cat) {
      setEditingCat(cat);
      setFormData({
        name: cat.name,
        description: cat.description || '',
        imageUrl: cat.imageUrl || '',
        bannerUrl: cat.bannerUrl || ''
      });
    } else {
      setEditingCat(null);
      setFormData({
        name: '',
        description: '',
        imageUrl: '',
        bannerUrl: ''
      });
    }
    setShowModal(true);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, field: 'imageUrl' | 'bannerUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCat) {
      updateCourseCategory(editingCat.id, formData);
    } else {
      addCourseCategory({
        id: `cat-${Date.now()}`,
        ...formData
      });
    }
    setShowModal(false);
  };

  const inferredCategories = Array.from(new Set(courses.map(c => c.category)))
    .filter(name => name && !courseCategories.find(cat => cat.name === name))
    .map(name => ({
      id: `inferred-${name}`,
      name,
      description: 'Auto-detected from Course Master',
      isInferred: true
    }));

  const allCategories = [...courseCategories, ...inferredCategories];

  const filtered = allCategories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cat.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-lg font-black text-[#141414]">Course Categories</h3>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input 
              type="text" 
              placeholder="Search category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
            />
          </div>
          {!isViewOnly && (
            <button 
              onClick={() => handleOpen()}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-[10px] font-bold rounded-lg uppercase tracking-widest shadow-lg shadow-blue-100 whitespace-nowrap"
            >
              <Plus size={14} />
              <span>New Category</span>
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((cat, idx) => (
          <div key={cat.id || `cat-${idx}`} className="bg-[#FBFBFB] border border-[#F0F0F0] rounded-2xl overflow-hidden group">
            {cat.bannerUrl ? (
              <img src={cat.bannerUrl} alt={cat.name} className="w-full h-24 object-cover" />
            ) : (
              <div className="w-full h-24 bg-gray-100 flex items-center justify-center text-gray-300">
                <Layers size={32} />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                 {cat.imageUrl ? (
                   <img src={cat.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
                 ) : (
                   <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Layers size={16} /></div>
                 )}
                 {!isViewOnly && (
                   <div className="flex space-x-2">
                     <button 
                       onClick={() => handleOpen(cat)}
                       className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
                       title="Edit Category"
                     >
                       <Edit2 size={14} />
                     </button>
                     {!cat.isInferred && (
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           if (window.confirm(`Delete category "${cat.name}"? This will also unassign it from all courses.`)) {
                             deleteCourseCategory(cat.id);
                           }
                         }}
                         className="p-1.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-all shadow-sm flex items-center justify-center cursor-pointer relative z-10"
                         title="Delete Category"
                       >
                         <Trash2 size={16} />
                       </button>
                     )}
                   </div>
                 )}
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-sm font-black text-[#141414]">{cat.name}</p>
                {cat.isInferred && (
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[8px] font-black uppercase tracking-tighter rounded border border-amber-200">Inferred</span>
                )}
              </div>
              <p className="text-[10px] text-[#888888] mt-1 font-bold">
                {courses.filter(c => c.category?.trim().toLowerCase() === cat.name?.trim().toLowerCase()).length} Courses Included
              </p>
            </div>
          </div>
        ))}
        {courseCategories.length === 0 && <p key="no-categories" className="text-sm text-gray-400 italic">No categories defined yet.</p>}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2rem] w-full max-w-sm p-8 shadow-2xl relative overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute right-6 top-6 p-2 text-gray-400 hover:text-[#141414] hover:bg-gray-100 rounded-xl"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-xl font-black text-[#141414] uppercase tracking-tight mb-8">
                {editingCat ? 'Edit Category' : 'Add Category'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest pl-1">Category Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Accounting Courses"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-sm" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest pl-1">Thumbnail (PNG/JPG)</label>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFile(e, 'imageUrl')}
                        className="hidden" 
                        id="cat-thumb"
                      />
                      <label htmlFor="cat-thumb" className="block w-full p-4 bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-center cursor-pointer hover:bg-gray-100">
                        {formData.imageUrl ? <img src={formData.imageUrl} className="h-8 mx-auto" /> : <Plus size={20} className="mx-auto text-gray-400" />}
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest pl-1">Banner Image</label>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFile(e, 'bannerUrl')}
                        className="hidden" 
                        id="cat-banner"
                      />
                      <label htmlFor="cat-banner" className="block w-full p-4 bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-center cursor-pointer hover:bg-gray-100">
                        {formData.bannerUrl ? <img src={formData.bannerUrl} className="h-8 mx-auto" /> : <Plus size={20} className="mx-auto text-gray-400" />}
                      </label>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-100"
                >
                  {editingCat ? 'Update Category' : 'Create Category'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CourseManager = ({ isViewOnly }: { isViewOnly: boolean }) => {
  const { courses, addCourse, updateCourse, deleteCourse, courseCategories } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    duration: '',
    description: '',
    level: 'Beginner',
    rating: 4.5,
    imageUrl: '',
    bannerUrl: ''
  });

  const handleOpen = (course?: any) => {
    if (course) {
      setEditingCourse(course);
      setFormData(course);
    } else {
      setEditingCourse(null);
      setFormData({
        title: '',
        category: courseCategories[0]?.name || '',
        duration: '',
        description: '',
        level: 'Beginner',
        rating: 4.5,
        imageUrl: '',
        bannerUrl: ''
      });
    }
    setShowModal(true);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, field: 'imageUrl' | 'bannerUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse) {
      updateCourse(editingCourse.id, formData);
    } else {
      addCourse({
        ...formData,
        id: `c${Date.now()}`
      } as any);
    }
    setShowModal(false);
  };

  const filtered = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-lg font-black text-[#141414]">Academic Courses</h3>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input 
              type="text" 
              placeholder="Search course..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-600 shadow-sm"
            />
          </div>
          {!isViewOnly && (
            <button 
              onClick={() => handleOpen()}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white text-[10px] font-bold rounded-lg uppercase tracking-widest shadow-lg shadow-emerald-100 whitespace-nowrap"
            >
              <Plus size={14} />
              <span>New Course</span>
            </button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#F0F0F0]">
              <th className="py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest">Preview</th>
              <th className="py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest">Course Name</th>
              <th className="py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest">Category</th>
              <th className="py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest">Duration</th>
              <th className="py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest">Rating</th>
              {!isViewOnly && <th className="py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest text-right">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F0F0]">
            {filtered.map((course) => (
              <tr key={course.id} className="group">
                <td className="py-4">
                  {course.imageUrl ? (
                    <img src={course.imageUrl} className="w-10 h-10 rounded-lg object-cover" alt="" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300">
                      <BookOpen size={16} />
                    </div>
                  )}
                </td>
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
                       <button 
                        onClick={() => handleOpen(course)}
                        className="p-2 text-[#888888] hover:text-[#141414] hover:bg-gray-100 rounded-lg"
                       >
                        <Edit2 size={14} />
                       </button>
                       <button 
                        type="button"
                        onClick={() => { if(window.confirm('Are you sure you want to delete this course?')) deleteCourse(course.id) }} 
                        className="p-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-all shadow-sm cursor-pointer"
                        title="Delete Course"
                       >
                        <Trash2 size={14} />
                       </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-sm text-gray-400 italic">No courses added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2rem] w-full max-w-lg p-8 shadow-2xl relative overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute right-6 top-6 p-2 text-gray-400 hover:text-[#141414] hover:bg-gray-100 rounded-xl"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-xl font-black text-[#141414] uppercase tracking-tight mb-8">
                {editingCourse ? 'Edit Course' : 'Add New Course'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest pl-1">Course Title</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Tally Prime"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-600 font-bold text-sm" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest pl-1">Category</label>
                    <select 
                      required 
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-600 font-bold text-sm appearance-none" 
                    >
                      <option value="">Select Category</option>
                      {Array.from(new Map<string, any>(courseCategories.map(cat => [cat.name.trim().toUpperCase(), cat])).values()).map((cat: any) => (
                        <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>
                      ))}
                      {formData.category && !courseCategories.find(c => c.name.trim().toUpperCase() === formData.category.trim().toUpperCase()) && (
                        <option key={`current-custom-${formData.category}`} value={formData.category}>{formData.category} (Current)</option>
                      )}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest pl-1">Duration</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. 3 Months"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-600 font-bold text-sm" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest pl-1">Level</label>
                  <select 
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-600 font-bold text-sm appearance-none" 
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Expert</option>
                    <option>Professional</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest pl-1">Photo (PNG/JPG)</label>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFile(e, 'imageUrl')}
                        className="hidden" 
                        id="course-photo"
                      />
                      <label htmlFor="course-photo" className="block w-full p-4 bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-center cursor-pointer hover:bg-gray-100">
                        {formData.imageUrl ? <img src={formData.imageUrl} className="h-8 mx-auto" /> : <Plus size={20} className="mx-auto text-gray-400" />}
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest pl-1">Banner Image</label>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFile(e, 'bannerUrl')}
                        className="hidden" 
                        id="course-banner"
                      />
                      <label htmlFor="course-banner" className="block w-full p-4 bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-center cursor-pointer hover:bg-gray-100">
                        {formData.bannerUrl ? <img src={formData.bannerUrl} className="h-8 mx-auto" /> : <Plus size={20} className="mx-auto text-gray-400" />}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest pl-1">Description</label>
                  <textarea 
                    required 
                    placeholder="Course details..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-sm min-h-[100px]" 
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-100"
                >
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SubjectManager = ({ isViewOnly }: { isViewOnly: boolean }) => {
  const { courses, subjects, addSubject, deleteSubject } = useApp();
  const [formData, setFormData] = useState({
     courseId: '',
     name: '',
     creditHours: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     const course = courses.find(c => c.id === formData.courseId);
     if (!course) return;

     addSubject({
       id: `sub-${Date.now()}`,
       name: formData.name,
       courseId: formData.courseId,
       courseName: course.title,
       creditHours: Number(formData.creditHours)
     });
     setFormData({ ...formData, name: '', creditHours: '' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {!isViewOnly ? (
        <div className="space-y-6">
           <h3 className="text-lg font-black text-[#141414]">Add Subject</h3>
           <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                 <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Select Course</label>
                 <select 
                   required
                   value={formData.courseId}
                   onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                   className="w-full p-3 bg-[#F5F5F5] border-none rounded-xl text-sm outline-none font-bold appearance-none"
                 >
                    <option value="">Choose Course...</option>
                    {courses.map(course => <option key={course.id} value={course.id}>{course.title}</option>)}
                 </select>
              </div>
              <div className="space-y-1.5">
                 <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Subject Name</label>
                 <input 
                   required
                   type="text" 
                   value={formData.name}
                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                   className="w-full p-3 bg-[#F5F5F5] border-none rounded-xl text-sm outline-none font-bold" 
                   placeholder="e.g. Voucher Entry" 
                 />
              </div>
              <div className="space-y-1.5">
                 <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Credit Hours</label>
                 <input 
                   required
                   type="number" 
                   value={formData.creditHours}
                   onFocus={(e) => e.target.select()}
                   onChange={(e) => setFormData({ ...formData, creditHours: e.target.value })}
                   className="w-full p-3 bg-[#F5F5F5] border-none rounded-xl text-sm outline-none font-bold" 
                   placeholder="40" 
                 />
              </div>
              <button type="submit" className="w-full py-4 bg-[#141414] text-white text-xs font-bold rounded-2xl uppercase tracking-widest shadow-xl shadow-black/10">Register Subject</button>
           </form>
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
          {subjects.map((sub) => (
            <div key={sub.id} className="p-4 bg-[#FBFBFB] border border-[#F0F0F0] rounded-2xl flex items-center justify-between">
               <div>
                  <p className="text-sm font-bold text-[#141414]">{sub.name}</p>
                  <p className="text-[10px] text-[#888888] uppercase font-bold">{sub.courseName} • {sub.creditHours} Hrs</p>
               </div>
               {!isViewOnly && (
                 <button 
                  onClick={() => deleteSubject(sub.id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-white rounded-lg transition-all"
                 >
                  <Trash2 size={16} />
                 </button>
               )}
            </div>
          ))}
          {subjects.length === 0 && <p className="text-sm text-gray-400 italic">No subjects registered yet.</p>}
       </div>
    </div>
  </div>
);
};

const ProgramManager = ({ isViewOnly }: { isViewOnly: boolean }) => {
  const { programs, addProgram, updateProgram, deleteProgram, courses } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [formData, setFormData] = useState<Partial<Program>>({
    title: '',
    description: '',
    includedCourseIds: [],
    duration: '',
    level: 'Professional',
    imageUrl: '',
    bannerUrl: ''
  });

  const handleOpen = (program?: Program) => {
    if (program) {
      setEditingProgram(program);
      setFormData(program);
    } else {
      setEditingProgram(null);
      setFormData({
        title: '',
        description: '',
        includedCourseIds: [],
        duration: '',
        level: 'Professional',
        imageUrl: '',
        bannerUrl: ''
      });
    }
    setShowModal(true);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, field: 'imageUrl' | 'bannerUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProgram) {
      updateProgram(editingProgram.id, formData);
    } else {
      addProgram({
        ...formData as Program,
        id: `pgm-${Date.now()}`
      });
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
         <h3 className="text-lg font-black text-[#141414]">Academic Programs</h3>
         {!isViewOnly && (
           <button 
             onClick={() => handleOpen()}
             className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white text-[10px] font-bold rounded-lg uppercase tracking-widest shadow-lg shadow-orange-100"
           >
             <Plus size={14} />
             <span>New Program</span>
           </button>
         )}
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {programs.map(program => (
           <div key={program.id} className="bg-white border border-[#E5E5E5] rounded-3xl overflow-hidden group shadow-sm hover:shadow-md transition-all">
             {program.bannerUrl ? (
               <img src={program.bannerUrl} alt="" className="w-full h-32 object-cover" />
             ) : (
               <div className="w-full h-32 bg-orange-50 flex items-center justify-center text-orange-200">
                  <ListPlus size={48} />
               </div>
             )}
             <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-sm font-black text-[#141414] uppercase leading-tight">{program.title}</h4>
                  {!isViewOnly && (
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => handleOpen(program)} 
                        className="p-1.5 hover:bg-orange-50 text-orange-600 rounded-lg transition-all"
                        title="Edit Program"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete program "${program.title}"?`)) {
                            deleteProgram(program.id);
                          }
                        }} 
                        className="p-1.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-all cursor-pointer"
                        title="Delete Program"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-gray-500 line-clamp-2 mb-4">{program.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {program.includedCourseIds.slice(0, 3).map((id, idx) => {
                    const c = courses.find(course => course.id === id);
                    return c ? (
                      <span key={`${program.id}-${id}-${idx}`} className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[8px] font-black uppercase tracking-tight rounded">
                        {c.title}
                      </span>
                    ) : null;
                  })}
                  {program.includedCourseIds.length > 3 && (
                    <span className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[8px] font-black uppercase tracking-tight rounded">
                      +{program.includedCourseIds.length - 3} More
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">{program.duration}</span>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{program.level}</span>
                </div>
             </div>
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
               className="bg-white rounded-[2rem] w-full max-w-lg p-8 shadow-2xl relative overflow-y-auto max-h-[90vh]"
             >
               <button 
                 onClick={() => setShowModal(false)}
                 className="absolute right-6 top-6 p-2 text-gray-400 hover:text-[#141414] hover:bg-gray-100 rounded-xl"
               >
                 <X size={20} />
               </button>
               
               <h3 className="text-xl font-black text-[#141414] uppercase tracking-tight mb-8">
                 {editingProgram ? 'Edit Program' : 'Create Program'}
               </h3>

               <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest pl-1">Program Title</label>
                   <input 
                     type="text" 
                     required 
                     placeholder="e.g. Master in Financial Accounting"
                     value={formData.title}
                     onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                     className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-600 font-bold text-sm" 
                   />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest pl-1">Duration</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. 12 Months"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-600 font-bold text-sm" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest pl-1">Level</label>
                      <select 
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-600 font-bold text-sm appearance-none" 
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Professional</option>
                        <option>Expert</option>
                      </select>
                    </div>
                 </div>

                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest pl-1">Description</label>
                   <textarea 
                     required 
                     placeholder="Program focus..."
                     value={formData.description}
                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                     className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-600 font-medium text-sm min-h-[80px]" 
                   />
                 </div>

                 <div className="space-y-2">
                   <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest pl-1">Include Courses</p>
                   <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-2xl min-h-[60px]">
                      {courses.map(course => (
                        <button
                          key={course.id}
                          type="button"
                          onClick={() => {
                            const current = formData.includedCourseIds || [];
                            if (current.includes(course.id)) {
                              setFormData({ ...formData, includedCourseIds: current.filter(id => id !== course.id) });
                            } else {
                              setFormData({ ...formData, includedCourseIds: [...current, course.id] });
                            }
                          }}
                          className={clsx(
                            "px-3 py-1 rounded-lg text-[9px] font-black uppercase transition-all",
                            (formData.includedCourseIds || []).includes(course.id)
                              ? "bg-orange-600 text-white"
                              : "bg-white border border-gray-100 text-gray-400 hover:border-orange-200"
                          )}
                        >
                          {course.title}
                        </button>
                      ))}
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest pl-1">Thumbnail</label>
                      <div className="relative">
                        <input type="file" accept="image/*" onChange={(e) => handleFile(e, 'imageUrl')} className="hidden" id="pgm-thumb" />
                        <label htmlFor="pgm-thumb" className="block w-full p-4 bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-center cursor-pointer hover:bg-gray-100">
                          {formData.imageUrl ? <img src={formData.imageUrl} className="h-8 mx-auto" /> : <Plus size={20} className="mx-auto text-gray-400" />}
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest pl-1">Banner</label>
                      <div className="relative">
                        <input type="file" accept="image/*" onChange={(e) => handleFile(e, 'bannerUrl')} className="hidden" id="pgm-banner" />
                        <label htmlFor="pgm-banner" className="block w-full p-4 bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-center cursor-pointer hover:bg-gray-100">
                          {formData.bannerUrl ? <img src={formData.bannerUrl} className="h-8 mx-auto" /> : <Plus size={20} className="mx-auto text-gray-400" />}
                        </label>
                      </div>
                    </div>
                 </div>

                 <button 
                   type="submit"
                   className="w-full py-5 bg-orange-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-orange-100"
                 >
                   {editingProgram ? 'Update Program' : 'Confirm & Build Program'}
                 </button>
               </form>
             </motion.div>
           </div>
         )}
       </AnimatePresence>
    </div>
  );
};

const CourseSettingManager = ({ isViewOnly }: { isViewOnly: boolean }) => {
  const { globalCourseSettings, updateGlobalCourseSettings, clearData } = useApp();

  return (
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
                      <button 
                        disabled={isViewOnly}
                        onClick={() => updateGlobalCourseSettings({ autoGenerateCode: !globalCourseSettings.autoGenerateCode })}
                        className={clsx(
                          "w-12 h-6 rounded-full relative p-1 transition-all",
                          isViewOnly ? "bg-gray-200 cursor-not-allowed opacity-50" : (globalCourseSettings.autoGenerateCode ? "bg-blue-600" : "bg-gray-300")
                        )}
                      >
                         <div className={clsx(
                           "w-4 h-4 bg-white rounded-full transition-all",
                           globalCourseSettings.autoGenerateCode ? "ml-auto" : "ml-0"
                         )}></div>
                      </button>
                   </div>
                   <div className="p-6 bg-[#FBFBFB] border border-[#F0F0F0] rounded-3xl flex items-center justify-between">
                      <div>
                         <p className="text-xs font-black text-[#141414]">Prerequisite Check</p>
                         <p className="text-[10px] text-[#888888]">Mandate level-based course progression</p>
                      </div>
                      <button 
                        disabled={isViewOnly}
                        onClick={() => updateGlobalCourseSettings({ prerequisiteCheck: !globalCourseSettings.prerequisiteCheck })}
                        className={clsx(
                          "w-12 h-6 rounded-full relative p-1 transition-all",
                          isViewOnly ? "bg-gray-100 cursor-not-allowed" : (globalCourseSettings.prerequisiteCheck ? "bg-blue-600" : "bg-gray-300")
                        )}
                      >
                         <div className={clsx(
                           "w-4 h-4 bg-white rounded-full transition-all",
                           globalCourseSettings.prerequisiteCheck ? "ml-auto" : "ml-0"
                         )}></div>
                      </button>
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
                           value={globalCourseSettings.passPercentage || ''} 
                           onFocus={(e) => e.target.select()}
                           onChange={(e) => updateGlobalCourseSettings({ passPercentage: e.target.value === '' ? 0 : parseInt(e.target.value) })}
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
                           value={globalCourseSettings.minAttendance || ''} 
                           onFocus={(e) => e.target.select()}
                           onChange={(e) => updateGlobalCourseSettings({ minAttendance: e.target.value === '' ? 0 : parseInt(e.target.value) })}
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

           <div className="p-8 bg-red-50 rounded-3xl border border-red-100">
              <div className="flex items-center space-x-3 mb-6">
                 <Trash2 size={20} className="text-red-600" />
                 <h4 className="text-sm font-black uppercase tracking-tight text-red-600">System Maintenance</h4>
              </div>
              <p className="text-[10px] text-red-700/60 font-bold uppercase leading-relaxed mb-6">
                 Clear all transactional and student data from the system. This action is irreversible and should only be performed during major system resets.
              </p>
              <button 
                onClick={clearData}
                disabled={isViewOnly}
                className={clsx(
                  "w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-red-200/50",
                  isViewOnly ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none" : "bg-red-600 text-white hover:bg-black"
                )}
              >
                 Delete All Old Data
              </button>
           </div>
        </div>
     </div>
    </div>
  );
};

const MoreActions = () => (
  <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-all text-[#888888]"><CheckCircle2 size={16} /></button>
);
