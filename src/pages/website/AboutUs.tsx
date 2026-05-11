/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WebsiteLayout } from '../../components/WebsiteLayout';
import { motion } from 'motion/react';
import { ShieldCheck, Target, Users, BookOpen, Award, CheckCircle2 } from 'lucide-react';

export const AboutUs = () => {
  return (
    <WebsiteLayout>
      {/* Hero */}
      <section className="bg-[#141414] text-white py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600 skew-x-12 translate-x-1/3 opacity-20"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl space-y-6"
          >
            <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Our Legacy</p>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-none uppercase">Empowering Digital <br/> India Since 2010</h1>
            <p className="text-lg text-gray-400 font-medium leading-relaxed">Softdev Tally Guru was founded with a single mission: to provide practical, industry-standard education that translates directly into rewarding careers.</p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
               <div className="aspect-square bg-gray-100 rounded-[4rem] overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" alt="softdev culture" className="w-full h-full object-cover" />
               </div>
               <div className="absolute -bottom-10 -right-10 p-8 bg-blue-600 text-white rounded-[3rem] shadow-2xl">
                  <p className="text-3xl font-black mb-1">14+</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">Years of Experience</p>
               </div>
            </div>
            <div className="space-y-12">
               <div className="space-y-4">
                  <h2 className="text-4xl font-black text-[#141414] tracking-tight">THE SOFTDEV PHILOSOPHY</h2>
                  <p className="text-[#888888] text-lg font-medium leading-relaxed">We believe that education must be alive. The world of accounting and software changes every week, and our curriculum changes with it.</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit"><Target size={20} /></div>
                     <h4 className="text-sm font-black text-[#141414] uppercase">Our Mission</h4>
                     <p className="text-xs text-[#888888] font-bold leading-relaxed">To democratize access to high-end accounting software training for students across India, regardless of their location.</p>
                  </div>
                  <div className="space-y-4">
                     <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit"><ShieldCheck size={20} /></div>
                     <h4 className="text-sm font-black text-[#141414] uppercase">Our Standards</h4>
                     <p className="text-xs text-[#888888] font-bold leading-relaxed">Maintaining the highest levels of institutional transparency, faculty excellence and student placement support.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-32 bg-background border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center space-y-4 mb-20">
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Global Leadership</p>
              <h2 className="text-4xl font-black text-[#141414] tracking-tight">MEET THE VISIONARIES</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Dr. Vivek Sharma', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop' },
                { name: 'Sameer Sinha', role: 'Head of Academics', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop' },
                { name: 'Priya Verma', role: 'Placement Director', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop' }
              ].map((member, i) => (
                <div key={i} className="group">
                  <div className="aspect-[4/5] bg-gray-200 rounded-[3rem] overflow-hidden mb-6 relative">
                     <img src={member.img} alt={member.name} className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110" />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-60"></div>
                  </div>
                  <h4 className="text-xl font-black text-[#141414]">{member.name}</h4>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">{member.role}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
           <div className="bg-blue-600 rounded-[4rem] p-12 lg:p-20 text-white grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
              <div>
                 <p className="text-5xl font-black mb-2">250+</p>
                 <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">Live Centers</p>
              </div>
              <div>
                 <p className="text-5xl font-black mb-2">15,000</p>
                 <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">Active Students</p>
              </div>
              <div>
                 <p className="text-5xl font-black mb-2">48+</p>
                 <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">Courses</p>
              </div>
              <div>
                 <p className="text-5xl font-black mb-2">98%</p>
                 <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">Job Satisfaction</p>
              </div>
           </div>
        </div>
      </section>
    </WebsiteLayout>
  );
};
