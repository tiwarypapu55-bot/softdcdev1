/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Award, 
  Search, 
  Filter, 
  Download, 
  ChevronRight,
  MoreVertical,
  Layers,
  History,
  ShieldCheck,
  Eye,
  CheckCircle2,
  XCircle,
  FileSearch,
  LayoutGrid,
  Clock,
  Settings
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

export const DocumentVerification = () => {
  const documents = [
    { id: '1', name: 'Identity Proof', student: 'Rahul Kumar', type: 'AADHAR', status: 'VERIFIED', date: '2024-05-01' },
    { id: '2', name: 'High School Marksheet', student: 'Rahul Kumar', type: 'EDUCATIONAL', status: 'PENDING', date: '2024-05-02' },
    { id: '3', name: 'Address Proof', student: 'Rahul Kumar', type: 'ELECTRICITY BILL', status: 'VERIFIED', date: '2024-05-01' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-[#141414] tracking-tight uppercase italic">KYC Verification</h1>
          <p className="text-sm text-[#888888] font-bold mt-1 uppercase tracking-widest">Global student document auditing & validation</p>
        </div>
        <div className="flex items-center space-x-2">
           <button className="px-6 py-3 bg-[#141414] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-black/10 hover:bg-blue-600 transition-all flex items-center space-x-2">
              <ShieldCheck size={14} />
              <span>Bulk Approve</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Pending Docs', value: '142', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
           { label: 'Verified Today', value: '68', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
           { label: 'Rejection Rate', value: '1.2%', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
           { label: 'Total Audited', value: '2,492', icon: FileSearch, color: 'text-blue-600', bg: 'bg-blue-50' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center space-x-4">
              <div className={clsx("p-3 rounded-2xl", stat.bg, stat.color)}>
                 <stat.icon size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                 <p className="text-xl font-black text-[#141414] uppercase tracking-tight leading-none">{stat.value}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
         <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center space-x-6 text-[10px] font-black text-[#888888] uppercase tracking-widest overflow-x-auto no-scrollbar">
               <button className="text-blue-600 border-b-2 border-blue-600 pb-1">All Requests</button>
               <button className="hover:text-[#141414] pb-1 transition-colors">Pending</button>
               <button className="hover:text-[#141414] pb-1 transition-colors">Flagged</button>
               <button className="hover:text-[#141414] pb-1 transition-colors">Resolved</button>
            </div>
            <div className="flex items-center space-x-2">
               <button className="p-2 bg-gray-50 rounded-xl"><Download size={14} /></button>
               <button className="p-2 bg-gray-50 rounded-xl"><Filter size={14} /></button>
            </div>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full">
               <thead>
                  <tr className="bg-gray-50/50">
                     <th className="px-8 py-5 text-left text-[10px] font-black text-[#888888] uppercase tracking-[0.2em]">Document Name</th>
                     <th className="px-8 py-5 text-left text-[10px] font-black text-[#888888] uppercase tracking-[0.2em]">Submitted By</th>
                     <th className="px-8 py-5 text-center text-[10px] font-black text-[#888888] uppercase tracking-[0.2em]">Status</th>
                     <th className="px-8 py-5 text-right text-[10px] font-black text-[#888888] uppercase tracking-[0.2em]">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {documents.map((doc) => (
                     <tr key={doc.id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-6">
                           <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                                 <FileText size={18} />
                              </div>
                              <div>
                                 <p className="text-sm font-black text-[#141414] tracking-tight">{doc.name}</p>
                                 <p className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">{doc.type}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div>
                              <p className="text-sm font-bold text-[#141414]">{doc.student}</p>
                              <p className="text-[10px] text-[#888888] font-mono italic">{doc.date}</p>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                           <span className={clsx(
                             "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                             doc.status === 'VERIFIED' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600 animate-pulse"
                           )}>{doc.status}</span>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <div className="flex items-center justify-end space-x-2">
                              <button className="px-4 py-2 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center space-x-2 hover:bg-black transition-all">
                                 <Eye size={12} />
                                 <span>Review</span>
                              </button>
                              <button className="p-2 text-gray-400 hover:text-[#141414] rounded-lg transition-all"><MoreVertical size={16} /></button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export const CertificateStudio = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-[#141414] tracking-tight uppercase italic">Certificate Studio</h1>
          <p className="text-sm text-[#888888] font-bold mt-1 uppercase tracking-widest">Designing & publishing digital credentials</p>
        </div>
        <div className="flex items-center space-x-3">
           <button 
             onClick={() => navigate('/admin/certificates/templates')}
             className="px-6 py-3 bg-white border border-gray-100 text-[#141414] text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
           >
              Saved Templates
           </button>
           <button 
             onClick={() => navigate('/admin/certificates/create')}
             className="px-6 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-100 hover:bg-black transition-all flex items-center space-x-2"
           >
              <LayoutGrid size={14} />
              <span>Create Template</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-2xl relative aspect-[1.414/1] overflow-hidden group">
               <div className="absolute inset-0 border-[24px] border-[#DEB887] m-4"></div>
               <div className="absolute inset-0 border-2 border-dashed border-[#DEB887]/20 m-12"></div>
               
               <div className="relative z-10 h-full flex flex-col items-center justify-center space-y-8 text-center">
                  <div className="w-24 h-24 bg-gold-gradient rounded-full flex items-center justify-center opacity-40">
                     <Award size={48} className="text-[#DEB887]" />
                  </div>
                  
                  <div className="space-y-2">
                     <h2 className="text-[12px] font-serif font-bold uppercase tracking-[0.4em] text-[#DEB887]">Certificate of Completion</h2>
                     <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Proudly Presented To</p>
                  </div>
                  
                  <h3 className="text-4xl font-serif italic text-gray-900 border-b border-gray-200 pb-2 min-w-[300px]">John Doe Michael</h3>
                  
                  <div className="max-w-md space-y-2">
                     <p className="text-[10px] font-medium text-gray-500 leading-relaxed uppercase tracking-tighter">
                        for successfully completing the advanced certification program in
                     </p>
                     <p className="text-lg font-black text-[#141414] uppercase tracking-tight italic bg-blue-50 px-4 py-1 rounded inline-block">
                        Advanced Tally Prime with GST Professional
                     </p>
                  </div>
                  
                  <div className="absolute bottom-20 left-20 text-left">
                     <div className="w-32 h-[1px] bg-gray-300 mb-2"></div>
                     <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Date Issued</p>
                     <p className="text-[10px] font-bold text-gray-700 uppercase tracking-tighter">May 10, 2026</p>
                  </div>
                  
                  <div className="absolute bottom-20 right-20 text-right">
                     <div className="w-32 h-[1px] bg-gray-300 mb-2"></div>
                     <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Authorized Director</p>
                     <p className="text-[10px] font-bold text-gray-700 uppercase tracking-tighter italic font-serif">Softdev Guru Admins</p>
                  </div>
               </div>
               
               <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="px-8 py-4 bg-white text-[#141414] text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-2xl flex items-center space-x-3 transform -translate-y-4 group-hover:translate-y-0 transition-transform">
                     <Settings size={16} />
                     <span>Edit Template Layout</span>
                  </button>
               </div>
            </div>
         </div>

         <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#141414] p-8 rounded-[3rem] text-white shadow-2xl space-y-8">
               <div className="flex items-center space-x-3">
                  <Layers className="text-blue-400" size={20} />
                  <h3 className="text-sm font-black uppercase tracking-widest italic">Template Library</h3>
               </div>
               <div className="space-y-4">
                  {[
                    { name: 'Classic Gold Edition', type: 'DIPLOMA', active: true },
                    { name: 'Modern Minimal Blue', type: 'CERTIFICATION', active: false },
                    { name: 'Professional Accounts', type: 'SKILLS', active: false },
                  ].map((temp, i) => (
                    <div key={i} className={clsx(
                      "p-4 rounded-2xl border transition-all cursor-pointer group flex items-center justify-between",
                      temp.active ? "bg-white/10 border-blue-400" : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                    )}>
                       <div>
                          <p className="text-[11px] font-black uppercase tracking-tight">{temp.name}</p>
                          <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1">{temp.type}</p>
                       </div>
                       {temp.active && <CheckCircle2 size={16} className="text-blue-400" />}
                    </div>
                  ))}
               </div>
               <button className="w-full py-4 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-white hover:text-black transition-all">
                  Browse All Assets
               </button>
            </div>

            <div className="bg-emerald-600 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
               <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-white/20 backdrop-blur rounded-2xl"><Award size={32} /></div>
                  <h3 className="text-xl font-black uppercase tracking-tight italic">Quick Publish</h3>
                  <p className="text-emerald-100 text-xs font-medium uppercase tracking-tighter max-w-xs mx-auto">Publish and generate PDF certificates for all 24 pending students automatically.</p>
                  <ChevronRight className="animate-bounce-x" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export const CertificateTemplates = () => {
  const templates = [
    { id: '1', name: 'Classic Gold Edition', type: 'DIPLOMA', description: 'Formal design with gold borders', lastModified: '2024-05-10' },
    { id: '2', name: 'Modern Minimal Blue', type: 'CERTIFICATION', description: 'Clean and digital-first look', lastModified: '2024-05-08' },
    { id: '3', name: 'Professional Skills', type: 'SKILLS', description: 'Focused on specific skill set', lastModified: '2024-05-05' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-[#141414] tracking-tight uppercase italic">Saved Templates</h1>
          <p className="text-sm text-[#888888] font-bold mt-1 uppercase tracking-widest">Manage your certificate designs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {templates.map((temp) => (
          <div key={temp.id} className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl transition-all group">
             <div className="aspect-[1.414/1] bg-gray-50 rounded-2xl mb-6 flex items-center justify-center border-2 border-dashed border-gray-200 group-hover:border-blue-200 transition-colors">
                <Award size={48} className="text-gray-300 group-hover:text-blue-200 transition-colors" />
             </div>
             <h3 className="text-lg font-black text-[#141414] uppercase tracking-tight">{temp.name}</h3>
             <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">{temp.type}</p>
             <p className="text-xs text-gray-500 mt-4 leading-relaxed line-clamp-2">{temp.description}</p>
             
             <div className="mt-8 flex items-center justify-between">
                <p className="text-[9px] font-bold text-gray-400">MODIFIED: {temp.lastModified}</p>
                <button className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                   <Settings size={16} />
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CreateCertificateTemplate = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-[#141414] tracking-tight uppercase italic">Create Template</h1>
          <p className="text-sm text-[#888888] font-bold mt-1 uppercase tracking-widest">Design a new credential layout</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[3rem] p-12 shadow-2xl">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#141414] uppercase tracking-widest">Template Name</label>
                  <input type="text" className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 text-sm font-bold" placeholder="e.g. 2024 Professional Series" />
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#141414] uppercase tracking-widest">Certificate Type</label>
                  <select className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 text-sm font-bold">
                     <option>DIPLOMA</option>
                     <option>PROFESSIONAL CERTIFICATE</option>
                     <option>SKILL ASSESSMENT</option>
                  </select>
               </div>
               <div className="pt-8 flex gap-4">
                  <button className="flex-1 py-4 bg-[#141414] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-black/10 hover:bg-blue-600 transition-all">Save Draught</button>
                  <button className="flex-1 py-4 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-black transition-all">Publish Live</button>
               </div>
            </div>
            <div className="bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-center items-center justify-center p-8 text-center space-y-4">
               <div>
                  <Layers size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visual Editor Preview</p>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto">Live preview will appear here as you configure your template elements.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
