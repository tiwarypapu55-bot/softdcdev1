/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  User, 
  Book, 
  Calendar, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Contact,
  CreditCard,
  History,
  FileCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

export const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students, franchises, feePayments } = useApp();
  
  const student = students.find(s => s.id === id);
  
  if (!student) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4">
        <p className="text-sm font-black text-[#888888] uppercase tracking-widest">Student Not Found</p>
        <button 
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-[#141414] text-white text-[10px] font-black uppercase tracking-widest rounded-xl"
        >
          Go Back
        </button>
      </div>
    );
  }

  const franchise = franchises.find(f => f.id === student.franchiseId);
  const studentPayments = feePayments.filter(p => p.studentId === student.id);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-20">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-[10px] font-black text-[#888888] uppercase tracking-widest hover:text-[#141414] transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Back to Directory</span>
      </button>

      <div className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50 rounded-full blur-[100px] -mr-40 -mt-40"></div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Profile Sidebar */}
          <div className="md:col-span-1 space-y-8">
            <div className="flex flex-col items-center text-center space-y-4">
               <div className="w-32 h-32 bg-blue-100 rounded-[2.5rem] flex items-center justify-center text-blue-600 font-black text-4xl shadow-inner uppercase">
                  {student.name.charAt(0)}
               </div>
               <div>
                  <h1 className="text-2xl font-black text-[#141414] uppercase tracking-tight">{student.name}</h1>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">ID: {student.admissionNo}</p>
               </div>
               <div className={clsx(
                 "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                 student.feeStatus === 'PAID' ? "bg-emerald-100 text-emerald-700" : 
                 student.feeStatus === 'PARTIAL' ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
               )}>
                 {student.feeStatus === 'PAID' ? 'FEES PAID' : student.feeStatus === 'PARTIAL' ? 'PARTIAL PAYMENT' : 'FEES PENDING'}
               </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-gray-100">
               <div className="flex items-center space-x-3 text-[#141414]">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-xs font-bold">{student.contact}</span>
               </div>
               <div className="flex items-center space-x-3 text-[#141414]">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-xs font-bold truncate">{student.email || 'No Email Added'}</span>
               </div>
               <div className="flex items-center space-x-3 text-[#141414]">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-xs font-bold">{student.district}, {student.state}</span>
               </div>
            </div>
          </div>

          {/* Main Details */}
          <div className="md:col-span-2 space-y-12">
            <div>
               <h2 className="text-sm font-black text-[#141414] uppercase tracking-[0.2em] mb-6 flex items-center border-b border-gray-100 pb-2">
                 <Book size={18} className="mr-3 text-blue-600" />
                 Academic Information
               </h2>
               <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Enrolled Course</label>
                    <p className="text-sm font-black text-[#141414] uppercase mt-1">{student.course}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Course Category</label>
                    <p className="text-sm font-black text-[#141414] uppercase mt-1">{student.courseCategory || 'General'}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Enrollment No</label>
                    <p className="text-sm font-black text-[#141414] uppercase mt-1">{student.enrollmentNo || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Admission Date</label>
                    <p className="text-sm font-black text-[#141414] mt-1">{student.admissionDate}</p>
                  </div>
               </div>
            </div>

            <div>
               <h2 className="text-sm font-black text-[#141414] uppercase tracking-[0.2em] mb-6 flex items-center border-b border-gray-100 pb-2">
                 <Building2 size={18} className="mr-3 text-purple-600" />
                 Registration Details
               </h2>
               <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Assigned Branch</label>
                    <p className="text-sm font-black text-purple-600 uppercase mt-1">{franchise?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Branch ID</label>
                    <p className="text-sm font-bold text-[#141414] mt-1">{student.franchiseId}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Father's Name</label>
                    <p className="text-sm font-bold text-[#141414] uppercase mt-1">{student.fatherName}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Mother's Name</label>
                    <p className="text-sm font-bold text-[#141414] uppercase mt-1">{student.motherName}</p>
                  </div>
               </div>
            </div>

            <div>
               <h2 className="text-sm font-black text-[#141414] uppercase tracking-[0.2em] mb-6 flex items-center border-b border-gray-100 pb-2">
                 <FileCheck size={18} className="mr-3 text-amber-600" />
                 Uploaded Documents (KYC)
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {student.documents && student.documents.length > 0 ? (
                   student.documents.map((doc) => (
                     <div key={doc.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                        <div className="flex justify-between items-start">
                           <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{doc.name}</span>
                        </div>
                        <div className="aspect-video bg-white rounded-xl border border-gray-100 overflow-hidden">
                           {doc.url ? (
                             <img src={doc.url} alt={doc.name} className="w-full h-full object-contain" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px] font-bold uppercase">No Document</div>
                           )}
                        </div>
                        {doc.url && (
                          <a 
                            href={doc.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block text-center py-2 bg-white border border-gray-200 text-[9px] font-black text-blue-600 uppercase tracking-widest rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            View Full Size
                          </a>
                        )}
                     </div>
                   ))
                 ) : (
                   <p className="text-[10px] text-gray-400 font-bold uppercase italic">No KYC documents uploaded yet.</p>
                 )}
               </div>
            </div>

            <div>
               <h2 className="text-sm font-black text-[#141414] uppercase tracking-[0.2em] mb-6 flex items-center border-b border-gray-100 pb-2">
                 <CreditCard size={18} className="mr-3 text-emerald-600" />
                 Financial Summary
               </h2>
               <div className="grid grid-cols-3 gap-8 p-6 bg-gray-50 rounded-3xl">
                  <div>
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Total Fees</label>
                    <p className="text-xl font-black text-[#141414] mt-1">₹{student.totalFees?.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest font-black text-emerald-600">Paid Amount</label>
                    <p className="text-xl font-black text-emerald-600 mt-1">₹{student.paidAmount?.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest font-black text-red-600">Balance Due</label>
                    <p className="text-xl font-black text-red-600 mt-1">₹{((student.totalFees || 0) - (student.paidAmount || 0)).toLocaleString()}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
