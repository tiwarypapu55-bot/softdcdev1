/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Trash2, 
  Upload, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter,
  FileBadge,
  ShieldCheck,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

export const StudentDocuments = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [docs, setDocs] = useState([
    { id: 'd1', name: 'Identity Proof - Aadhar Card', type: 'PDF', size: '1.2 MB', date: '10 Oct 2025', status: 'VERIFIED' },
    { id: 'd2', name: '10th Standard Marksheet', type: 'PDF', size: '2.5 MB', date: '10 Oct 2025', status: 'VERIFIED' },
    { id: 'd3', name: '12th Standard Marksheet', type: 'JPG', size: '3.1 MB', date: '10 Oct 2025', status: 'VERIFIED' },
    { id: 'd4', name: 'Profile Passport Photo', type: 'PNG', size: '0.8 MB', date: '12 Oct 2025', status: 'PENDING' },
    { id: 'd5', name: 'Course Enrollment Form', type: 'PDF', size: '1.5 MB', date: '15 Oct 2025', status: 'VERIFIED' },
  ]);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      const newDoc = {
        id: `d${docs.length + 1}`,
        name: 'New Uploaded Document',
        type: 'PDF',
        size: '0.5 MB',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'PENDING'
      };
      setDocs([newDoc, ...docs]);
      setIsUploading(false);
    }, 1500);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-[#141414] tracking-tight uppercase italic leading-none">Document Vault</h1>
          <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest mt-2">{docs.length} Files Securely Encrypted & Stored</p>
        </div>
        <button 
          onClick={handleUpload}
          disabled={isUploading}
          className="px-8 py-4 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-3 shadow-xl shadow-blue-500/20"
        >
           <Upload size={16} strokeWidth={3} className={isUploading ? 'animate-bounce' : ''} />
           <span>{isUploading ? 'Uploading...' : 'Upload New File'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-8">
              <h3 className="text-sm font-black text-[#141414] uppercase tracking-tight">Storage Status</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-[#888888] uppercase">Used Space</p>
                    <p className="text-[10px] font-black text-[#141414] uppercase">9.1 MB / 50 MB</p>
                 </div>
                 <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-[18%]"></div>
                 </div>
              </div>
              <div className="space-y-3">
                 {[
                   { label: 'PDF Documents', count: 12, size: '6.2 MB', color: 'bg-blue-500' },
                   { label: 'Images / Photos', count: 4, size: '2.9 MB', color: 'bg-indigo-500' },
                 ].map((stat, i) => (
                   <div key={i} className="flex items-center space-x-3">
                      <div className={clsx("w-2 h-2 rounded-full", stat.color)}></div>
                      <div className="flex-1 flex items-center justify-between">
                         <span className="text-[9px] font-black uppercase text-gray-500">{stat.label}</span>
                         <span className="text-[9px] font-black text-[#141414]">{stat.size}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-[#141414] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><ShieldCheck size={100} /></div>
              <h3 className="text-sm font-black uppercase tracking-tight mb-4 relative z-10">Data Sovereignty</h3>
              <p className="text-[10px] text-white/50 font-bold uppercase leading-relaxed relative z-10">
                Your data is protected with AES-256 bank-grade encryption. No one, including administrators, can access private documents without authorization.
              </p>
           </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
           <div className="bg-white border border-gray-100 shadow-xl rounded-[3rem] overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="Search vault..." 
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl outline-none text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-600 transition-all font-mono"
                    />
                 </div>
                 <div className="flex items-center gap-2">
                    <button className="p-3 bg-gray-50 text-gray-400 hover:text-[#141414] rounded-xl"><Filter size={14} /></button>
                    <button className="p-3 bg-gray-50 text-gray-400 hover:text-[#141414] rounded-xl"><MoreVertical size={14} /></button>
                 </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50">
                       <th className="px-8 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest">Document Name</th>
                       <th className="px-8 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest">Added</th>
                       <th className="px-8 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest">Status</th>
                       <th className="px-8 py-4 text-[10px] font-black text-[#888888] uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {docs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50 transition-colors group">
                         <td className="px-8 py-6">
                            <div className="flex items-center space-x-4">
                               <div className={clsx(
                                 "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all",
                                 doc.type === 'PDF' ? "bg-red-50 text-red-600 border-red-100" : "bg-blue-50 text-blue-600 border-blue-100"
                               )}>
                                  <FileText size={20} />
                               </div>
                               <div>
                                  <p className="text-sm font-black text-[#141414] uppercase tracking-tight">{doc.name}</p>
                                  <div className="flex items-center space-x-3 mt-1.5">
                                     <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md uppercase tracking-widest">{doc.type}</span>
                                     <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{doc.size}</span>
                                  </div>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{doc.date}</p>
                         </td>
                         <td className="px-8 py-6">
                            <div className={clsx(
                              "inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest leading-none",
                              doc.status === 'VERIFIED' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                            )}>
                               {doc.status === 'VERIFIED' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                               <span>{doc.status}</span>
                            </div>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end space-x-2">
                               <button className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Eye size={16} /></button>
                               <button className="p-3 text-gray-400 hover:text-[#141414] hover:bg-gray-100 rounded-xl transition-all"><Download size={16} /></button>
                               <button className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                            </div>
                         </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>

           <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:scale-125 transition-transform"></div>
              <div className="flex items-center space-x-6 relative z-10">
                 <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-emerald-600 shadow-xl shadow-emerald-500/10">
                    <FileBadge size={32} />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-emerald-950 uppercase tracking-tight">Identity Verification</h3>
                    <p className="text-[10px] text-emerald-900/60 font-black uppercase tracking-widest mt-1">Status: Stage 2 Completed Successfully</p>
                 </div>
              </div>
              <button className="px-8 py-4 bg-white text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-xl shadow-emerald-500/10 relative z-10 flex items-center gap-2">
                 <span>Review Audit Trail</span>
                 <ChevronRight size={14} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
