/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Megaphone, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Edit2,
  Trash2,
  X,
  Bell,
  CheckCircle2,
  Clock,
  Send
} from 'lucide-react';
import { Announcement, UserRole } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';

export const Announcements = () => {
  const { currentUser, announcements = [], addAnnouncement, updateAnnouncement, deleteAnnouncement } = useApp() as any;
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    target: 'ALL' as UserRole[] | 'ALL',
    date: new Date().toISOString().split('T')[0],
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
    status: 'PUBLISHED' as 'PUBLISHED' | 'DRAFT'
  });

  const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'ADMINISTRATOR';

  const handleOpen = (ann?: Announcement) => {
    if (ann) {
      setEditingAnnouncement(ann);
      setFormData({
        title: ann.title,
        content: ann.content,
        target: ann.target,
        date: ann.date,
        priority: ann.priority,
        status: ann.status
      });
    } else {
      setEditingAnnouncement(null);
      setFormData({
        title: '',
        content: '',
        target: 'ALL',
        date: new Date().toISOString().split('T')[0],
        priority: 'MEDIUM',
        status: 'PUBLISHED'
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAnnouncement) {
      updateAnnouncement(editingAnnouncement.id, formData);
    } else {
      const newAnn: Announcement = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData
      };
      addAnnouncement(newAnn);
    }
    setShowModal(false);
  };

  const filteredAnnouncements = announcements.filter((a: Announcement) => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
    const canSee = a.target === 'ALL' || (currentUser && a.target.includes(currentUser.role));
    return matchesSearch && canSee;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto bg-background min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#141414] tracking-tight">Announcements</h1>
          <p className="text-sm text-[#888888] font-mono">Broadcast news, updates and notifications to the system.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => handleOpen()}
            className="flex items-center space-x-2 px-6 py-3 bg-[#141414] text-white text-[10px] font-black rounded-2xl uppercase tracking-[0.2em] shadow-xl shadow-black/10 hover:bg-blue-600 transition-all"
          >
            <Plus size={16} />
            <span>Create Announcement</span>
          </button>
        )}
      </div>

      <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-[#E5E5E5] shadow-sm">
        <div className="flex items-center bg-[#F5F5F5] px-4 py-2.5 rounded-2xl w-96">
           <Search size={18} className="text-[#888888]" />
           <input 
             type="text" 
             placeholder="Search announcements..." 
             className="ml-3 bg-transparent border-none text-sm w-full outline-none font-bold" 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <div className="flex items-center space-x-3">
           <button className="px-4 py-2.5 bg-gray-50 border border-gray-100 text-[10px] font-black rounded-xl flex items-center space-x-2 text-[#888888] uppercase tracking-widest hover:bg-gray-100">
             <Filter size={14} />
             <span>Recent First</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-[#E5E5E5]">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell size={32} className="text-gray-300" />
             </div>
             <p className="text-[#888888] font-black uppercase tracking-widest text-xs">No active announcements</p>
             <p className="text-[10px] text-gray-400 mt-2">When institutional updates are published, they will appear here.</p>
          </div>
        ) : (
          filteredAnnouncements.map((ann: Announcement) => (
            <motion.div 
              key={ann.id}
              layout
              className={clsx(
                "group bg-white p-8 rounded-[2.5rem] border transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-black/5 relative overflow-hidden",
                ann.priority === 'HIGH' ? "border-red-100" : "border-gray-100"
              )}
            >
              {ann.priority === 'HIGH' && (
                <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>
              )}
              
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className={clsx(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                      ann.priority === 'HIGH' ? "bg-red-50 text-red-600" : 
                      ann.priority === 'MEDIUM' ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"
                    )}>
                      {ann.priority} Priority
                    </span>
                    <span className="text-[10px] font-bold text-[#888888] flex items-center space-x-1 uppercase tracking-widest">
                       <Clock size={12} />
                       <span>{new Date(ann.date).toLocaleDateString()}</span>
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                       Target: {ann.target === 'ALL' ? 'Everyone' : ann.target.join(', ')}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-black text-[#141414] tracking-tight group-hover:text-blue-600 transition-colors">
                    {ann.title}
                  </h2>
                  
                  <p className="text-sm text-[#888888] leading-relaxed font-medium">
                    {ann.content}
                  </p>

                  <div className="pt-4 flex items-center space-x-4">
                     <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-xl">
                        <div className="w-6 h-6 rounded-lg bg-[#141414] flex items-center justify-center">
                           <span className="text-[10px] text-white font-black">S</span>
                        </div>
                        <span className="text-[10px] font-black text-[#141414] uppercase tracking-widest">System Admin</span>
                     </div>
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleOpen(ann)}
                      className="p-3 text-[#888888] hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm('Delete this announcement?')) deleteAnnouncement(ann.id);
                      }}
                      className="p-3 text-[#888888] hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[3rem] w-full max-w-2xl p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute right-8 top-8 p-3 text-gray-400 hover:text-[#141414] hover:bg-gray-100 rounded-2xl"
              >
                <X size={20} />
              </button>
              
              <div className="mb-10">
                <h3 className="text-2xl font-black text-[#141414] uppercase tracking-tight">
                  {editingAnnouncement ? 'Modify Broadcast' : 'New System Broadcast'}
                </h3>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Institutional Communication Hub</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Announcement Title</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Important: System Maintenance Window"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#141414] font-bold text-sm" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Message Content</label>
                  <textarea 
                    required 
                    rows={4}
                    placeholder="Provide full details of your announcement here..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#141414] font-bold text-sm resize-none" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Target Audience</label>
                    <select 
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#141414] font-bold text-sm"
                      value={formData.target === 'ALL' ? 'ALL' : formData.target[0]}
                      onChange={(e) => setFormData({ ...formData, target: e.target.value === 'ALL' ? 'ALL' : [e.target.value as any] })}
                    >
                      <option value="ALL">Everyone (All Roles)</option>
                      <option value="FRANCHISE">Franchise Centers Only</option>
                      <option value="TEACHER">Staff / Teachers Only</option>
                      <option value="STUDENT">Students Only</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Priority Level</label>
                    <select 
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#141414] font-bold text-sm font-black uppercase text-blue-600"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    >
                      <option value="LOW">Low - Update</option>
                      <option value="MEDIUM">Medium - Normal</option>
                      <option value="HIGH">High - Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-blue-50 rounded-[2rem] border border-blue-100">
                  <div className="flex items-center space-x-4">
                     <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                        <Send size={20} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Ready to Broadcast?</p>
                        <p className="text-[9px] text-blue-600 font-bold uppercase tracking-widest">This will be visible on chosen dashboards.</p>
                     </div>
                  </div>
                  <button 
                    type="submit"
                    className="px-8 py-4 bg-[#141414] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-blue-600 transition-all shadow-xl shadow-black/10"
                  >
                    {editingAnnouncement ? 'Save Changes' : 'Broadcast Now'}
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
