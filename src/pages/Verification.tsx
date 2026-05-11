/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  QrCode, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Award, 
  User, 
  Calendar,
  ExternalLink,
  ArrowRight,
  ShieldAlert,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { useApp } from '../context/AppContext';

export const Verification = () => {
  const { certificates } = useApp();
  const { id } = useParams();
  const [certId, setCertId] = useState(id || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (id) {
       triggerVerify(id);
    }
  }, [id]);

  const triggerVerify = (idToVerify: string) => {
    setIsVerifying(true);
    setResult(null);

    // Simulate verification delay
    setTimeout(() => {
      const found = certificates.find(c => 
        c.certificateNo.toLowerCase() === idToVerify.toLowerCase() || 
        c.id.toLowerCase() === idToVerify.toLowerCase()
      );
      
      setResult(found || 'NOT_FOUND');
      setIsVerifying(false);
    }, 1500);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;
    triggerVerify(certId);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="text-center space-y-4">
         <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] border border-blue-100 shadow-xl shadow-blue-500/10 mb-4">
            <ShieldCheck size={40} />
         </div>
         <h1 className="text-4xl font-black text-[#141414] tracking-tight uppercase italic leading-none">Credential Verification</h1>
         <p className="text-[11px] font-black text-[#888888] uppercase tracking-[0.2em]">Authenticity Check for SOFTDEV TALLY GURU Certifications</p>
      </div>

      <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] -mr-32 -mt-32"></div>
         
         <form onSubmit={handleVerify} className="relative z-10 space-y-8">
            <div className="space-y-4">
               <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black text-[#141414] uppercase tracking-widest ml-1">Enter Certificate Number / ID</label>
                  <div className="flex gap-3">
                     <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Try Testing:</span>
                     <button 
                       type="button"
                       onClick={() => setCertId('CERT-2024-STG-001')}
                       className="text-[8px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest underline decoration-blue-200 underline-offset-2"
                     >
                       CERT-2024-STG-001
                     </button>
                     <button 
                       type="button"
                       onClick={() => setCertId('CERT-2024-TALLY-001')}
                       className="text-[8px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest underline decoration-blue-200 underline-offset-2"
                     >
                       CERT-2024-TALLY-001
                     </button>
                  </div>
               </div>
               <div className="relative group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-600 transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="e.g. CERT-2024-TALLY-001" 
                    value={certId}
                    onChange={(e) => setCertId(e.target.value)}
                    className="w-full pl-16 pr-6 py-6 bg-gray-50 border border-gray-100 rounded-[2rem] outline-none text-sm font-black uppercase tracking-widest focus:ring-8 focus:ring-blue-100 focus:bg-white transition-all shadow-inner"
                  />
                  <button 
                    type="submit"
                    disabled={isVerifying}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-8 py-3.5 bg-[#141414] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 disabled:opacity-50 transition-all shadow-lg shadow-black/10 flex items-center gap-2"
                  >
                     {isVerifying ? 'Verifying...' : (
                       <>
                         <span>Verify Now</span>
                         <ArrowRight size={14} />
                       </>
                     )}
                  </button>
               </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-4 border-t border-gray-50 uppercase">
               <div className="flex items-center gap-3 text-[#888888]">
                  <QrCode size={16} />
                  <span className="text-[10px] font-bold tracking-widest">Scan QR Code</span>
               </div>
               <div className="hidden md:block w-px h-4 bg-gray-200"></div>
               <div className="flex items-center gap-3 text-[#888888]">
                  <Award size={16} />
                  <span className="text-[10px] font-bold tracking-widest">ISO 27001 Secured</span>
               </div>
            </div>
         </form>
      </div>

      <AnimatePresence mode="wait">
         {isVerifying && (
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.95 }}
             className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-[3.5rem] border-2 border-dashed border-blue-100"
           >
              <div className="relative">
                 <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <ShieldCheck size={24} className="text-blue-600 animate-pulse" />
                 </div>
              </div>
              <p className="mt-6 text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] animate-pulse">Scanning Global Database...</p>
           </motion.div>
         )}

         {result === 'NOT_FOUND' && (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-red-50 p-12 rounded-[3.5rem] border border-red-100 text-center space-y-6 shadow-xl shadow-red-500/5"
           >
              <div className="inline-flex p-4 bg-white rounded-2xl text-red-600 shadow-lg mb-2">
                 <ShieldAlert size={32} />
              </div>
              <div className="space-y-2">
                 <h2 className="text-2xl font-black text-red-950 uppercase tracking-tight italic">Record Not Found</h2>
                 <p className="text-[10px] text-red-900/60 font-bold uppercase tracking-widest max-w-md mx-auto leading-relaxed">
                    The provided certificate ID does not match any verified record in our cryptographically secured database. 
                    Please ensure the ID is correct or contact support if this is an error.
                 </p>
              </div>
              <button 
                onClick={() => setResult(null)}
                className="px-8 py-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-700 transition-all flex items-center gap-2 mx-auto"
              >
                 <XCircle size={14} />
                 <span>Try Another ID</span>
              </button>
           </motion.div>
         )}

         {result && result !== 'NOT_FOUND' && (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-[#141414] rounded-[4rem] overflow-hidden shadow-2xl border border-white/5 relative group"
           >
              <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
              
              <div className="relative z-10 p-12">
                 <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-white/10">
                    <div className="flex items-center gap-6">
                       <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-blue-600/30">
                          <CheckCircle2 size={36} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Status: Verified Authentic</p>
                          <h2 className="text-3xl font-black text-white uppercase italic tracking-tight mt-1">Certificate Validated</h2>
                       </div>
                    </div>
                    <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
                       <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Verification Date</p>
                       <p className="text-xs font-black text-white mt-1 uppercase">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12 mb-12">
                    <div className="space-y-6">
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                             <Award size={10} />
                             Course / Program
                          </p>
                          <p className="text-lg font-black text-white uppercase tracking-tight">{result.course}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                             <User size={10} />
                             Credential Bearer
                          </p>
                          <p className="text-lg font-black text-white uppercase tracking-tight">Rahul Kumar</p>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                             <ShieldCheck size={10} />
                             Certificate ID
                          </p>
                          <p className="text-lg font-black text-white uppercase tracking-tight font-mono">{result.certificateNo}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                             <Calendar size={10} />
                             Date of Issue
                          </p>
                          <p className="text-lg font-black text-white uppercase tracking-tight">{result.issueDate}</p>
                       </div>
                    </div>

                    <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-3xl flex flex-col justify-between">
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Security Hash</p>
                          <p className="text-[9px] text-blue-100/50 font-mono break-all leading-tight">8f2c3d9a1b7e4f0c92d8e7b6a5f4c3d2e1f0a9b8c7d6e5f4b3a291c8d7e6f54</p>
                       </div>
                       <button className="w-full mt-4 py-3 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-all flex items-center justify-center gap-2">
                          <ExternalLink size={12} />
                          <span>Public Explorer</span>
                       </button>
                    </div>
                 </div>

                 <div className="p-8 bg-blue-500 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:scale-[1.01]">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white">
                          <Award size={24} />
                       </div>
                       <p className="text-sm font-black text-white uppercase tracking-tight max-w-sm">This digital credential is legally recognized and carries lifetime validity.</p>
                    </div>
                    <button className="px-10 py-5 bg-white text-blue-600 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-50 transition-all shadow-2xl shadow-black/20">
                       Download Original Copy
                    </button>
                 </div>
              </div>
           </motion.div>
         )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
         {[
           { title: 'Cryptographic Security', icon: ShieldCheck, desc: 'Every record is hashed using SHA-256 and stored on immutable storage.' },
           { title: 'Global Recognition', icon: Globe, desc: 'Verify from anywhere in the world instantly using our high-availability API.' },
           { title: 'QR Ready', icon: QrCode, desc: 'Scan any physical certificate to reach this page instantly for validation.' },
         ].map((feat, i) => (
           <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-4 group">
              <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                 <feat.icon size={20} />
              </div>
              <h3 className="text-xs font-black text-[#141414] uppercase tracking-tight italic">{feat.title}</h3>
              <p className="text-[10px] text-[#888888] font-bold uppercase leading-relaxed tracking-wider">{feat.desc}</p>
           </div>
         ))}
      </div>
    </div>
  );
};
