/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  BookOpen, 
  Clock, 
  Tag, 
  Star,
  X,
  Save,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { Course } from '../../types';

export const CourseManagement = () => {
  const { courses, addCourse, updateCourse, deleteCourse, courseCategories } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<Partial<Course>>({
    title: '',
    category: '',
    duration: '',
    description: '',
    level: 'Beginner',
    rating: 4.5,
    imageUrl: '',
    bannerUrl: ''
  });

  const categories = Array.from(new Set([...courseCategories.map(c => c.name), ...courses.map(c => c.category)]));

  const handleOpenModal = (course?: Course) => {
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
    setIsModalOpen(true);
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse) {
      updateCourse(editingCourse.id, formData);
    } else {
      addCourse({
        ...formData as Course,
        id: `c${Date.now()}`
      });
    }
    setIsModalOpen(false);
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#141414] tracking-tight uppercase">Course Management</h1>
          <p className="text-sm text-[#888888] font-mono">Create, update and synchronize institute curriculums</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center space-x-2 px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-500/20"
        >
          <Plus size={16} />
          <span>Add New Course</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search courses by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 pl-12 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-medium shadow-sm transition-all"
          />
        </div>
        <div className="flex gap-2">
           {categories.map((cat, idx) => (
             <button 
                key={`${cat}-${idx}`}
                onClick={() => setSearchTerm(cat)}
                className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all whitespace-nowrap"
             >
                {cat}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <motion.div 
            layout
            key={course.id}
            className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col h-full"
          >
            <div className="relative h-48 bg-gray-100">
              {course.bannerUrl ? (
                <img src={course.bannerUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <BookOpen size={48} />
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm">{course.category}</span>
              </div>
              <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(course)} className="p-2 bg-white/90 backdrop-blur-md text-gray-600 rounded-lg hover:text-blue-600 shadow-sm transition-colors">
                  <Edit2 size={14} />
                </button>
                <button 
                  type="button"
                  onClick={(e) => { 
                    e.preventDefault();
                    e.stopPropagation();
                    if(window.confirm('Delete course?')) deleteCourse(course.id);
                  }} 
                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-500 hover:text-white shadow-sm transition-all border border-red-100 cursor-pointer relative z-40"
                  title="Delete Course"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-center space-x-3 mb-4">
                {course.imageUrl && <img src={course.imageUrl} className="w-10 h-10 rounded-lg object-cover" alt="" />}
                <h3 className="text-lg font-black text-[#141414] leading-tight group-hover:text-blue-600 transition-colors uppercase">{course.title}</h3>
              </div>
              <p className="text-xs text-[#888888] line-clamp-2 mb-6 flex-grow">{course.description}</p>
              
              <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1.5 text-[#141414]">
                    <Clock size={14} className="text-blue-600" />
                    <span className="text-[10px] font-black">{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-[#141414]">
                    <Star size={14} className="text-orange-400 fill-orange-400" />
                    <span className="text-[10px] font-black">{course.rating}</span>
                  </div>
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{course.level}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="px-8 py-6 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-black text-[#141414] uppercase tracking-tight">
                  {editingCourse ? 'Edit Course' : 'Create New Course'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:rotate-90 transition-all">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Course Title</label>
                    <input 
                      required
                      type="text" 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g., Tally Prime Advanced"
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Category</label>
                    <select 
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold appearance-none"
                    >
                      <option value="">Select Category</option>
                      {Array.from(new Map<string, any>(courseCategories.map(cat => [cat.name.trim().toUpperCase(), cat])).values()).map((cat: any) => (
                        <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Duration</label>
                    <input 
                      required
                      type="text" 
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      placeholder="e.g., 3 Months"
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Level</label>
                    <select 
                      value={formData.level}
                      onChange={(e) => setFormData({...formData, level: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold appearance-none"
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Expert</option>
                      <option>Professional</option>
                      <option>All Levels</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Photo (Square preferred)</label>
                    <div className="relative">
                      <input type="file" accept="image/*" onChange={(e) => handleFile(e, 'imageUrl')} className="hidden" id="c-thumb-mgmt" />
                      <label htmlFor="c-thumb-mgmt" className="block w-full p-4 bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-center cursor-pointer hover:bg-gray-100">
                        {formData.imageUrl ? <img src={formData.imageUrl} className="h-8 mx-auto" /> : <Plus size={20} className="mx-auto text-gray-400" />}
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Banner (16:9 preferred)</label>
                    <div className="relative">
                      <input type="file" accept="image/*" onChange={(e) => handleFile(e, 'bannerUrl')} className="hidden" id="c-banner-mgmt" />
                      <label htmlFor="c-banner-mgmt" className="block w-full p-4 bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-center cursor-pointer hover:bg-gray-100">
                        {formData.bannerUrl ? <img src={formData.bannerUrl} className="h-8 mx-auto" /> : <Plus size={20} className="mx-auto text-gray-400" />}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Description</label>
                  <textarea 
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Short summary of the course curriculum..."
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-medium min-h-[120px]"
                  />
                </div>

                <div className="pt-4 flex space-x-3">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-gray-100 text-[#141414] rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-4 bg-[#141414] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 transition-all shadow-xl shadow-black/10 flex items-center justify-center space-x-2"
                  >
                    <Save size={16} />
                    <span>{editingCourse ? 'Update Course' : 'Create Course'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
