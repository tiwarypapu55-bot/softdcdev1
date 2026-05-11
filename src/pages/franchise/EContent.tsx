/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, 
  Play, 
  FileText, 
  Download, 
  Search, 
  Filter,
  Star,
  Clock,
  MoreVertical,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

export const EContent = () => {
  const { courses } = useApp();
  const [activeTab, setActiveTab] = useState<'VIDEO' | 'PDF' | 'QUIZ'>('VIDEO');
  const [searchTerm, setSearchTerm] = useState('');

  const contentItems = [
    { id: '1', title: 'Tally Prime Fundamentals', type: 'VIDEO', duration: '45 mins', author: 'Vinay Singh', rating: 4.8, thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop', views: '1.2k' },
    { id: '2', title: 'GST Return Filing Guide', type: 'PDF', size: '2.4 MB', author: 'Anita Rao', rating: 4.9, thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop', views: '800' },
    { id: '3', title: 'Advanced Excel Hacks', type: 'VIDEO', duration: '30 mins', author: 'Rajesh K', rating: 4.7, thumbnail: 'https://images.unsplash.com/photo-1543286386-713ea5183efc?w=400&h=250&fit=crop', views: '2.1k' },
    { id: '4', title: 'Accounting Mock Test v1', type: 'QUIZ', questions: '50 Qs', author: 'Exam Board', rating: 4.5, thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop', views: '500' },
    { id: '5', title: 'Stock Management Basics', type: 'VIDEO', duration: '20 mins', author: 'Vinay Singh', rating: 4.6, thumbnail: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=400&h=250&fit=crop', views: '1.5k' },
    { id: '6', title: 'Payroll Configuration in Tally', type: 'PDF', size: '1.8 MB', author: 'Anita Rao', rating: 5.0, thumbnail: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400&h=250&fit=crop', views: '3.2k' },
  ];

  const filteredItems = contentItems.filter(item => 
    (item.type === activeTab) && 
    (item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     item.author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-[#141414] tracking-tight uppercase italic">E-Learning Library</h1>
          <p className="text-sm text-[#888888] font-bold mt-1 uppercase tracking-widest">Premium study material and digital resources</p>
        </div>
        <div className="relative w-full md:w-96">
           <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
           <input 
             type="text" 
             placeholder="SEARCH LESSONS..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
           />
        </div>
      </div>

      <div className="flex items-center space-x-6 pb-2 overflow-x-auto no-scrollbar">
         {[
           { id: 'VIDEO', label: 'Video Lessons', icon: Play },
           { id: 'PDF', label: 'Study Guides', icon: FileText },
           { id: 'QUIZ', label: 'Practice Tests', icon: HelpCircle },
         ].map((tab) => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={clsx(
               "flex items-center space-x-3 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap",
               activeTab === tab.id 
                 ? "bg-[#141414] text-white shadow-xl shadow-black/10" 
                 : "bg-white border border-gray-100 text-[#888888] hover:border-gray-200"
             )}
           >
              <tab.icon size={16} />
              <span>{tab.label}</span>
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {filteredItems.map((item) => (
           <motion.div 
             key={item.id}
             whileHover={{ y: -8 }}
             className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden group flex flex-col"
           >
              <div className="relative aspect-video overflow-hidden">
                 <img 
                   src={item.thumbnail} 
                   alt={item.title} 
                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                 />
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#141414] shadow-2xl transition-transform duration-300 group-hover:scale-110">
                       {item.type === 'VIDEO' ? <Play size={24} fill="#141414" /> : <Download size={24} />}
                    </button>
                 </div>
                 <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[8px] font-black uppercase tracking-widest text-[#141414] shadow-sm">
                       {item.type}
                    </span>
                 </div>
                 <div className="absolute bottom-4 right-4">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur rounded-full text-[8px] font-black uppercase tracking-widest text-white shadow-sm flex items-center space-x-1">
                       <Clock size={10} />
                       <span>{item.duration || item.size || item.questions}</span>
                    </span>
                 </div>
              </div>
              
              <div className="p-8 space-y-4 flex-1 flex flex-col">
                 <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{item.author}</p>
                    <div className="flex items-center space-x-1 text-amber-500">
                       <Star size={12} fill="currentColor" />
                       <span className="text-[10px] font-black">{item.rating}</span>
                    </div>
                 </div>
                 
                 <h3 className="text-lg font-black text-[#141414] uppercase tracking-tight line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {item.title}
                 </h3>
                 
                 <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                    <div className="flex items-center space-x-2 text-[#888888]">
                       <span className="text-[10px] font-bold uppercase tracking-widest">{item.views} Enrolled</span>
                    </div>
                    <button className="text-[10px] font-black text-[#141414] uppercase tracking-[0.2em] flex items-center space-x-2 group-hover:translate-x-1 transition-transform">
                       <span>Access Now</span>
                       <ChevronRight size={14} />
                    </button>
                 </div>
              </div>
           </motion.div>
         ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="py-20 text-center space-y-4">
           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
              <BookOpen size={32} className="text-gray-300" />
           </div>
           <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No available e-content matches your selection</p>
        </div>
      )}
    </div>
  );
};

const HelpCircle = (props: any) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);
