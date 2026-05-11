/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Award, 
  Calendar, 
  CreditCard,
  Download,
  CheckCircle2,
  Clock,
  ExternalLink,
  QrCode,
  Zap,
  TrendingUp,
  Target,
  ArrowRight,
  ChevronRight,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { clsx } from 'clsx';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const progressData = [
  { name: 'Week 1', score: 45 },
  { name: 'Week 2', score: 52 },
  { name: 'Week 3', score: 48 },
  { name: 'Week 4', score: 70 },
  { name: 'Week 5', score: 65 },
  { name: 'Week 6', score: 85 },
];

const StudentStatCard = ({ title, value, icon: Icon, gradient, subValue }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={clsx("relative overflow-hidden p-6 rounded-[2rem] shadow-xl border border-white/20 text-white", gradient)}
  >
    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
    <div className="relative z-10 space-y-4">
      <div className="p-2 bg-white/20 rounded-xl w-fit backdrop-blur-md">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">{title}</p>
        <p className="text-3xl font-black tracking-tighter">{value}</p>
        {subValue && <p className="text-[8px] font-bold mt-1 opacity-60 uppercase">{subValue}</p>}
      </div>
    </div>
  </motion.div>
);

export const StudentDashboard = () => {
  const { currentUser, students, certificates } = useApp();
  const navigate = useNavigate();
  const student = students.find(s => s.id === 's1'); // Mock link for demo
  const myCerts = certificates.filter(c => c.studentId === student?.id);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-100">
        <div className="flex items-center space-x-5">
           <div className="relative group">
              <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-3xl shadow-2xl transition-transform group-hover:scale-105">
                {student?.name.substring(0, 1)}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center shadow-lg">
                 <CheckCircle2 size={14} className="text-white" />
              </div>
           </div>
           <div className="space-y-1">
             <h1 className="text-3xl font-black text-[#141414] tracking-tight uppercase leading-none">Welcome back, {student?.name.split(' ')[0]}!</h1>
             <p className="text-sm font-bold text-[#888888] uppercase tracking-widest">{student?.course} • ID: {student?.id}</p>
           </div>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={() => window.open('https://tallysolutions.com/learning-hub/', '_blank')}
             className="px-8 py-4 bg-[#141414] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all flex items-center space-x-2 shadow-xl shadow-black/10"
           >
             <BookOpen size={16} />
             <span>Launch Learning Pad</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StudentStatCard 
          title="Overall Progress" 
          value="75%" 
          icon={TrendingUp} 
          gradient="bg-gradient-to-br from-blue-600 to-blue-800"
          subValue="Module 4 of 6 Completed"
        />
        <StudentStatCard 
          title="Attendance" 
          value="92%" 
          icon={Calendar} 
          gradient="bg-gradient-to-br from-indigo-500 to-indigo-700"
          subValue="Consistently Present"
        />
        <StudentStatCard 
          title="Total Paid" 
          value={`₹${(student?.paidAmount ?? 0).toLocaleString()}`} 
          icon={CreditCard} 
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-700"
          subValue="No Pending Dues"
        />
        <StudentStatCard 
          title="Certificates" 
          value={myCerts.length} 
          icon={Award} 
          gradient="bg-gradient-to-br from-amber-500 to-amber-700"
          subValue="Ready for Download"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {/* Performance Graph */}
           <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[100px] -mr-32 -mt-32"></div>
              <div className="relative z-10">
                 <div className="flex items-center justify-between mb-10">
                    <div>
                       <h3 className="text-xl font-black text-[#141414] uppercase tracking-tight">Academic Performance</h3>
                       <p className="text-[10px] text-[#888888] font-black uppercase tracking-widest mt-1">Weekly Quiz & Assignment scores</p>
                    </div>
                    <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                       <Zap size={10} />
                       <span>Top 10% of Batch</span>
                    </div>
                 </div>
                 <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={progressData}>
                          <defs>
                             <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis 
                             dataKey="name" 
                             axisLine={false} 
                             tickLine={false} 
                             tick={{ fontSize: 10, fill: '#888888', fontWeight: 900 }}
                          />
                          <YAxis 
                             axisLine={false} 
                             tickLine={false} 
                             tick={{ fontSize: 10, fill: '#888888', fontWeight: 900 }}
                          />
                          <Tooltip 
                             contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }}
                          />
                          <Area type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>

           {/* Certificates Section */}
           <div className="bg-[#141414] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600/10 blur-[100px] -mr-40 -mb-40"></div>
              <div className="relative z-10">
                 <div className="flex items-center justify-between mb-10 border-b border-white/10 pb-6">
                    <div className="flex items-center space-x-3">
                       <Award className="text-amber-400" />
                       <h3 className="text-xl font-black uppercase tracking-tight">Professional Credentials</h3>
                    </div>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-amber-400">
                       {myCerts.length} Verified
                    </span>
                 </div>
                 
                 {myCerts.length > 0 ? (
                   <div className="grid md:grid-cols-2 gap-6">
                     {myCerts.map((cert) => (
                       <motion.div 
                         key={cert.id} 
                         whileHover={{ scale: 1.02 }}
                         className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group"
                       >
                         <div className="flex justify-between items-start mb-6">
                           <div className="w-14 h-14 bg-white flex items-center justify-center rounded-2xl shadow-xl transition-transform group-hover:rotate-6">
                             <QRCodeSVG value={cert.qrCodeData} size={40} />
                           </div>
                           <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[8px] font-black uppercase tracking-widest">
                              <CheckCircle2 size={10} />
                              <span>Authentic</span>
                           </div>
                         </div>
                         <p className="font-black text-lg uppercase leading-tight">{cert.course}</p>
                         <p className="text-[10px] font-bold text-white/40 mt-1 uppercase tracking-widest">CERT NO: {cert.certificateNo}</p>
                         <div className="mt-8 flex gap-3">
                            <button 
                              onClick={() => navigate('/student/certificates')}
                              className="flex-1 py-3 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-400 hover:text-white transition-all flex items-center justify-center space-x-2"
                            >
                               <Download size={14} />
                               <span>E-Certificate</span>
                            </button>
                            <button 
                               onClick={() => navigate('/verify')}
                               className="p-3 bg-white/10 text-white hover:bg-white/20 border border-white/10 rounded-xl transition-all"
                            >
                               <ExternalLink size={16} />
                            </button>
                         </div>
                       </motion.div>
                     ))}
                   </div>
                 ) : (
                   <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2.5rem] bg-white/2 text-center">
                      <Award size={40} className="text-white/10 mb-4" />
                      <p className="text-white/40 font-black uppercase tracking-widest text-xs">No certificates issued yet.</p>
                      <p className="text-[10px] text-white/20 mt-2 uppercase font-black">Complete your assessments to qualify</p>
                   </div>
                 )}
              </div>
           </div>
        </div>

        <div className="space-y-8">
           {/* Quick Status / Documents */}
           <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-emerald-100 transition-all"></div>
              <h3 className="text-lg font-black text-[#141414] uppercase tracking-tight border-b border-gray-100 pb-6 mb-8">KYC Status</h3>
              <div className="space-y-6 flex-1">
                 <div className="flex items-center justify-between group/item">
                    <div className="flex items-center space-x-4">
                       <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100 transition-transform group-hover/item:scale-110">
                          <CheckCircle2 size={18} />
                       </div>
                       <div>
                          <p className="text-xs font-black text-[#141414] uppercase">Identity Card</p>
                          <p className="text-[9px] text-[#888888] font-black uppercase tracking-widest mt-0.5 text-emerald-600">Verified</p>
                       </div>
                    </div>
                    <ChevronRight size={14} className="text-gray-300" />
                 </div>
                 <div className="flex items-center justify-between group/item">
                    <div className="flex items-center space-x-4">
                       <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100 transition-transform group-hover/item:scale-110">
                          <CheckCircle2 size={18} />
                       </div>
                       <div>
                          <p className="text-xs font-black text-[#141414] uppercase">Academic Records</p>
                          <p className="text-[9px] text-[#888888] font-black uppercase tracking-widest mt-0.5 text-emerald-600">Verified</p>
                       </div>
                    </div>
                    <ChevronRight size={14} className="text-gray-300" />
                 </div>
                 <div className="flex items-center justify-between group/item">
                    <div className="flex items-center space-x-4">
                       <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center border border-amber-100 transition-transform group-hover/item:scale-110 animate-pulse">
                          <Clock size={18} />
                       </div>
                       <div>
                          <p className="text-xs font-black text-[#141414] uppercase">Profile Avatar</p>
                          <p className="text-[9px] text-[#888888] font-black uppercase tracking-widest mt-0.5 text-amber-600">Pending Review</p>
                       </div>
                    </div>
                    <ChevronRight size={14} className="text-gray-300" />
                 </div>
              </div>
              <button 
                onClick={() => navigate('/student/documents')}
                className="w-full mt-10 py-4 bg-gray-50 text-[#141414] text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 hover:text-white transition-all border border-gray-100"
              >
                Full Repository
              </button>
           </div>

           {/* QR Profile */}
           <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
              <div className="relative z-10 text-center">
                 <h3 className="text-lg font-black uppercase tracking-tight mb-4">Digital Identity</h3>
                 <p className="text-[10px] text-white/60 font-medium leading-relaxed mb-8 uppercase tracking-widest">Instant Career Pass • Scan to Verify</p>
                 <div className="p-6 bg-white rounded-[2.5rem] inline-block shadow-2xl group-hover:scale-105 transition-transform duration-500">
                    <QRCodeSVG value={`https://stg-portal.com/verify/${student?.id}`} size={160} />
                 </div>
                 <div className="mt-8 flex items-center justify-center space-x-2 text-white/40">
                    <QrCode size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">ID Card QR Access</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
