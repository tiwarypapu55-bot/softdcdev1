/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WebsiteLayout } from '../../components/WebsiteLayout';
import { motion } from 'motion/react';
import { Search, Filter, BookOpen, Clock, Award, Star, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { useApp } from '../../context/AppContext';

import { Link } from 'react-router-dom';

export const Courses = () => {
  const { courses } = useApp();
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['ALL', ...Array.from(new Set(courses.map(c => c.category)))];

  const filtered = courses
    .filter(c => filter === 'ALL' || c.category === filter)
    .filter(c => 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <WebsiteLayout>
      <section className="bg-transparent py-24 border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
           <div className="max-w-2xl space-y-4">
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Knowledge Hub</p>
              <h1 className="text-5xl font-black text-[#141414] tracking-tight uppercase leading-none">Elite Professional <br/> Catalog</h1>
              <p className="text-slate-600 font-medium leading-relaxed">Choose from our curated selection of industry-grade courses designed to make you an immediate asset to any organization.</p>
           </div>
        </div>
      </section>

      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
           <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-12">
              <div className="flex flex-wrap gap-2">
                 {categories.map(cat => (
                   <button 
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={clsx(
                      "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      filter === cat ? "bg-[#141414] text-white shadow-xl shadow-black/10" : "bg-gray-100 text-[#888888] hover:bg-gray-200"
                    )}
                   >
                     {cat}
                   </button>
                 ))}
              </div>
              <div className="relative group w-full lg:w-80">
                 <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" />
                 <input 
                   type="text" 
                   placeholder="Search courses..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm" 
                 />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filtered.map((course, i) => (
                <Link to={`/courses/${course.id}`} key={i} className="flex h-full">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group bg-white/60 backdrop-blur-md border border-white/40 p-6 rounded-[2.5rem] hover:shadow-2xl hover:shadow-blue-200 hover:border-blue-200 transition-all cursor-pointer flex flex-col h-full w-full"
                  >
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                              <span className="text-[10px] font-black text-blue-600 bg-blue-50 w-6 h-6 flex items-center justify-center rounded-lg">{i + 1}</span>
                              <span className="px-3 py-1 bg-gray-50 text-[#888888] text-[8px] font-black uppercase tracking-widest rounded-full">{course.category}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                              <Star size={10} className="text-orange-400 fill-orange-400" />
                              <span className="text-[10px] font-black">{course.rating}</span>
                          </div>
                        </div>
                        <h3 className="text-lg font-black text-[#141414] group-hover:text-blue-600 transition-colors leading-tight">{course.title}</h3>
                        <div className="flex flex-wrap gap-3">
                          <div className="flex items-center space-x-1.5 text-[#888888]">
                              <Clock size={12} />
                              <span className="text-[10px] font-bold">{course.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1.5 text-[#888888]">
                              <BookOpen size={12} />
                              <span className="text-[10px] font-bold">{course.level}</span>
                          </div>
                        </div>
                    </div>
                    <div className="pt-6 mt-10 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest font-mono">View Details</p>
                        <button className="p-2 bg-[#F5F5F5] rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <Zap size={14} className="fill-current" />
                        </button>
                    </div>
                  </motion.div>
                </Link>
              ))}
           </div>
        </div>
      </section>

      {/* Certification Info */}
      <section className="py-40 bg-[#141414] text-white">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-8">
                  <div className="p-4 bg-blue-600 rounded-3xl w-fit"><Award size={32} /></div>
                  <h2 className="text-4xl font-black tracking-tight leading-none">GLOBALLY RECOGNIZED <br/> CERTIFICATIONS</h2>
                  <p className="text-gray-400 text-lg leading-relaxed font-medium">Every successful course completion awards you a Softdev Tally Guru Certification, encoded with a unique verification QR that can be used by employers globally to verify your credentials.</p>
                  <div className="space-y-4">
                     {['ISO 9001:2015 Compliance', 'Authorized Tally Training Partner', 'Industry Recognized Curriculum'].map(item => (
                       <div key={item} className="flex items-center space-x-3 text-sm font-bold">
                          <Zap size={14} className="text-blue-400" />
                          <span>{item}</span>
                       </div>
                     ))}
                  </div>
               </div>
               <div className="bg-white/5 border border-white/10 p-12 rounded-[4rem] flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-32 h-32 bg-white rounded-3xl p-2">
                     <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SoftdevVerification" alt="verify" className="w-full h-full" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Scan to Verify Sample</p>
                  <h4 className="text-2xl font-black">STUDENT VERIFICATION PORTAL</h4>
               </div>
            </div>
         </div>
      </section>
    </WebsiteLayout>
  );
};
