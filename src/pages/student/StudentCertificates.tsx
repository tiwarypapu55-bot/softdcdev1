/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, 
  Download, 
  ExternalLink, 
  Search, 
  Filter, 
  CheckCircle2, 
  FileText,
  Clock,
  Printer,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { clsx } from 'clsx';

export const StudentCertificates = () => {
  const { certificates, students } = useApp();
  const student = students.find(s => s.id === 's1') || students[0];
  const myCerts = certificates.filter(c => c.studentId === student?.id);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="flex items-center space-x-4">
           <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-100 shadow-lg shadow-amber-500/10">
              <Award size={28} />
           </div>
           <div>
              <h1 className="text-3xl font-black text-[#141414] tracking-tight uppercase italic leading-none">My Certificates</h1>
              <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest mt-2">{myCerts.length} Verified Credentials Found</p>
           </div>
        </div>
        <div className="flex gap-2">
           <button className="px-6 py-3 bg-[#141414] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all flex items-center gap-2 shadow-xl shadow-black/10">
              <Printer size={14} />
              <span>Print All</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {myCerts.map((cert) => (
          <motion.div 
            key={cert.id}
            whileHover={{ y: -5 }}
            className="bg-white border border-gray-100 shadow-2xl rounded-[3rem] p-10 group relative overflow-hidden flex flex-col"
          >
             {/* Certificate Watermark Background */}
             <div className="absolute top-0 right-0 p-12 opacity-[0.03] select-none pointer-events-none group-hover:scale-110 group-hover:opacity-[0.05] transition-all">
                <Award size={200} />
             </div>

             <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="space-y-2">
                   <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[9px] font-black uppercase tracking-widest w-fit">
                      <ShieldCheck size={12} />
                      <span>Verified Record</span>
                   </div>
                   <h2 className="text-2xl font-black text-[#141414] uppercase tracking-tight leading-tight">{cert.course}</h2>
                </div>
                <div className="p-4 bg-white border border-gray-50 rounded-2xl shadow-xl transition-transform group-hover:rotate-3">
                   <QRCodeSVG value={cert.qrCodeData} size={48} />
                </div>
             </div>

             <div className="space-y-6 flex-1 relative z-10">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-[#888888] uppercase tracking-widest">Certificate No</p>
                      <p className="text-xs font-black text-[#141414] truncate font-mono">{cert.certificateNo}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-[#888888] uppercase tracking-widest">Issue Date</p>
                      <p className="text-xs font-black text-[#141414] uppercase">{cert.date}</p>
                   </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-[#888888] uppercase tracking-widest">Grade Achieved</span>
                      <span className="text-xs font-black text-blue-600 uppercase">Distinction</span>
                   </div>
                   <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 w-[94%]"></div>
                   </div>
                </div>
             </div>

             <div className="mt-10 flex gap-4 relative z-10">
                <button className="flex-1 py-4 bg-[#141414] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/10">
                   <Download size={16} />
                   <span>Download PDF</span>
                </button>
                <button className="p-4 bg-gray-50 text-[#888888] hover:text-[#141414] hover:bg-white rounded-2xl transition-all border border-transparent hover:border-gray-200 shadow-xs">
                   <ExternalLink size={20} />
                </button>
             </div>
          </motion.div>
        ))}

        {myCerts.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-6 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[3rem] text-[#888888]">
             <div className="p-6 bg-white rounded-full shadow-lg opacity-50">
                <Award size={40} />
             </div>
             <div>
                <p className="text-sm font-black uppercase tracking-widest">No Issued Credentials</p>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-2 max-w-xs leading-relaxed">
                   Certificates are automatically issued upon course completion and performance verification.
                </p>
             </div>
             <button className="px-8 py-3 bg-white text-[#141414] border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                Check Progress
             </button>
          </div>
        )}
      </div>

      {/* Verification Help Section */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-900 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group mt-12">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/30 blur-[100px] rounded-full group-hover:bg-blue-500/40 transition-all"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
           <div className="max-w-xl space-y-6">
              <div className="flex items-center space-x-3 text-blue-400">
                 <ShieldCheck size={28} />
                 <h3 className="text-2xl font-black uppercase tracking-tight">Security & Verification</h3>
              </div>
              <p className="text-sm font-medium text-white/70 leading-relaxed uppercase tracking-wide">
                All certificates issued by SOFTDEV TALLY GURU contain unique cryptographic hashes and digital signatures. 
                Employers can instantly verify your credentials by scanning the QR code or visiting our official verification portal.
              </p>
              <div className="flex items-center gap-8 pt-4">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Global Standard</p>
                    <p className="text-xs font-black uppercase tracking-tight">ISO 27001 Certified</p>
                 </div>
                 <div className="w-px h-10 bg-white/10"></div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Industry Validity</p>
                    <p className="text-xs font-black uppercase tracking-tight">Lifetime Accreditation</p>
                 </div>
              </div>
           </div>
           <button className="px-10 py-5 bg-white text-blue-900 rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-2xl shadow-black/20 flex items-center gap-3">
              <ExternalLink size={18} />
              <span>Verify Tool</span>
           </button>
        </div>
      </div>
    </div>
  );
};
