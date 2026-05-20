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
  Settings,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

export const DocumentVerification = () => {
  const { students, updateStudent } = useApp();
  const navigate = useNavigate();

  // Filter students who have documents (simulated by existing students for this demo)
  const pendingStudents = students.filter(s => s.kycStatus === 'PENDING');
  const [viewingStudent, setViewingStudent] = React.useState<Student | null>(null);

  const handleBulkApprove = () => {
    if (window.confirm(`Are you sure you want to approve all ${pendingStudents.length} pending KYC requests?`)) {
      pendingStudents.forEach(s => {
        updateStudent(s.id, { kycStatus: 'APPROVED' });
      });
      alert('Bulk KYC approval complete.');
    }
  };

  const handleApprove = (studentId: string, name: string) => {
    if (window.confirm(`Approve KYC for ${name}?`)) {
      updateStudent(studentId, { kycStatus: 'APPROVED' });
      if (viewingStudent?.id === studentId) {
        setViewingStudent({ ...viewingStudent, kycStatus: 'APPROVED' });
      }
    }
  };

  const handleReject = (studentId: string, name: string) => {
    if (window.confirm(`Reject KYC for ${name}?`)) {
      updateStudent(studentId, { kycStatus: 'REJECTED' });
      if (viewingStudent?.id === studentId) {
        setViewingStudent({ ...viewingStudent, kycStatus: 'REJECTED' });
      }
    }
  };

  const updateDocStatus = (studentId: string, docId: string, status: 'APPROVED' | 'REJECTED') => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const updatedDocs = (student.kycDocs || []).map(doc => 
      doc.id === docId ? { ...doc, status } : doc
    );

    // If all docs are approved, auto-set student status to APPROVED
    const allApproved = updatedDocs.every(d => d.status === 'APPROVED');
    // If any doc is rejected, set student status to REJECTED
    const anyRejected = updatedDocs.some(d => d.status === 'REJECTED');

    let newKycStatus = student.kycStatus;
    if (allApproved && updatedDocs.length > 0) newKycStatus = 'APPROVED';
    else if (anyRejected) newKycStatus = 'REJECTED';

    updateStudent(studentId, { 
      kycDocs: updatedDocs,
      kycStatus: newKycStatus as any
    });

    if (viewingStudent?.id === studentId) {
      setViewingStudent({
        ...student,
        kycDocs: updatedDocs,
        kycStatus: newKycStatus as any
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-[#141414] tracking-tight uppercase italic">KYC Verification</h1>
          <p className="text-sm text-[#888888] font-bold mt-1 uppercase tracking-widest">Global student document auditing & validation</p>
        </div>
        <div className="flex items-center space-x-2">
           <button 
             onClick={handleBulkApprove}
             disabled={pendingStudents.length === 0}
             className="px-6 py-3 bg-[#141414] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2zl shadow-xl shadow-black/10 hover:bg-blue-600 transition-all flex items-center space-x-2 disabled:bg-gray-400 disabled:shadow-none"
           >
              <ShieldCheck size={14} />
              <span>Bulk Approve ({pendingStudents.length})</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Pending Docs', value: pendingStudents.length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
           { label: 'Verified Total', value: students.filter(s => s.kycStatus === 'APPROVED').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
           { label: 'Rejected', value: students.filter(s => s.kycStatus === 'REJECTED').length, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
           { label: 'Total Students', value: students.length, icon: FileSearch, color: 'text-blue-600', bg: 'bg-blue-50' },
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
               <button className="text-blue-600 border-b-2 border-blue-600 pb-1">KYC Queue</button>
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
                     <th className="px-8 py-5 text-left text-[10px] font-black text-[#888888] uppercase tracking-[0.2em]">Student</th>
                     <th className="px-8 py-5 text-left text-[10px] font-black text-[#888888] uppercase tracking-[0.2em]">Course</th>
                     <th className="px-8 py-5 text-center text-[10px] font-black text-[#888888] uppercase tracking-[0.2em]">KYC Status</th>
                     <th className="px-8 py-5 text-right text-[10px] font-black text-[#888888] uppercase tracking-[0.2em]">Quick Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {students.map((student) => (
                     <tr key={student.id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-6">
                           <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all overflow-hidden border border-gray-100">
                                 <img src={student.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} alt={student.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                 <p className="text-sm font-black text-[#141414] tracking-tight">{student.name}</p>
                                 <p className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">{student.admissionNo}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div>
                              <p className="text-sm font-bold text-[#141414] uppercase">{student.course}</p>
                              <p className="text-[10px] text-[#888888] font-mono italic">{student.admissionDate}</p>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                           <span className={clsx(
                             "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                             student.kycStatus === 'APPROVED' ? "bg-emerald-50 text-emerald-600" : 
                             student.kycStatus === 'REJECTED' ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                           )}>{student.kycStatus || 'PENDING'}</span>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <div className="flex items-center justify-end space-x-2">
                              <button 
                                onClick={() => setViewingStudent(student)}
                                className="px-4 py-2 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center space-x-2 hover:bg-black transition-all"
                              >
                                 <Eye size={12} />
                                 <span>Dossier</span>
                              </button>
                              {student.kycStatus !== 'PENDING' && (
                                <button 
                                  onClick={() => updateStudent(student.id, { kycStatus: 'PENDING' })}
                                  className="p-2 bg-gray-100 text-gray-400 hover:text-[#141414] rounded-lg transition-all"
                                  title="Reset Status"
                                >
                                   <RefreshCw size={14} />
                                </button>
                              )}
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      <motion.div>
        {viewingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
               <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center space-x-4">
                     <div className="w-12 h-12 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                        <img src={viewingStudent.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${viewingStudent.name}`} alt="" className="w-full h-full object-cover" />
                     </div>
                     <div>
                        <h3 className="text-xl font-black text-[#141414] tracking-tight uppercase">{viewingStudent.name}</h3>
                        <p className="text-[10px] font-bold text-[#888888] uppercase tracking-widest italic">{viewingStudent.course} • ID: {viewingStudent.admissionNo}</p>
                     </div>
                  </div>
                  <div className="flex items-center space-x-3">
                     <button 
                       onClick={() => handleApprove(viewingStudent.id, viewingStudent.name)}
                       className="px-6 py-3 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-lg shadow-emerald-600/20"
                     >
                        Final Approve
                     </button>
                     <button 
                       onClick={() => handleReject(viewingStudent.id, viewingStudent.name)}
                       className="px-6 py-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-lg shadow-red-600/20"
                     >
                        Final Reject
                     </button>
                     <button 
                       onClick={() => setViewingStudent(null)}
                       className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-400 hover:text-red-500 transition-all shadow-sm"
                     >
                        <XCircle size={20} />
                     </button>
                  </div>
               </div>

                   <div className="flex-1 overflow-y-auto p-10 bg-white">
                      {viewingStudent && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                           <div>
                              <h4 className="text-[10px] font-black text-[#141414] uppercase tracking-[0.2em] mb-6 flex items-center">
                                 <FileSearch size={14} className="mr-2 text-blue-600" />
                                 Identity & Qualification Documents
                              </h4>
                              <div className="space-y-6">
                                 {(viewingStudent.kycDocs || []).map((doc) => (
                                    <div key={doc.id} className="p-6 rounded-[2rem] border border-gray-100 bg-gray-50/30 group hover:border-blue-200 hover:bg-white transition-all shadow-sm">
                                       <div className="flex items-center justify-between mb-4">
                                          <div>
                                             <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{doc.type}</p>
                                             <p className="text-sm font-black text-[#141414] mt-1">{doc.name}</p>
                                          </div>
                                          <span className={clsx(
                                             "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                                             doc.status === 'APPROVED' ? "bg-emerald-50 text-emerald-600" : 
                                             doc.status === 'REJECTED' ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                                          )}>{doc.status}</span>
                                       </div>
                                       
                                       <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden mb-4 relative group/doc">
                                          <img src={doc.url} alt={doc.name} className="w-full h-full object-contain" />
                                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/doc:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                             <a 
                                               href={doc.url} 
                                               target="_blank" 
                                               rel="noreferrer" 
                                               className="p-3 bg-white text-[#141414] rounded-full hover:scale-110 transition-transform shadow-xl"
                                               title="View Original"
                                             >
                                                <Eye size={18} />
                                             </a>
                                             <a 
                                               href={doc.url} 
                                               download={doc.name}
                                               className="p-3 bg-blue-600 text-white rounded-full hover:scale-110 transition-transform shadow-xl"
                                               title="Download"
                                             >
                                                <Download size={18} />
                                             </a>
                                          </div>
                                       </div>
      
                                       <div className="flex items-center space-x-2">
                                          <button 
                                            onClick={() => updateDocStatus(viewingStudent.id, doc.id, 'APPROVED')}
                                            className="flex-1 py-3 bg-white border border-emerald-100 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                          >
                                             Approve
                                          </button>
                                          <button 
                                            onClick={() => updateDocStatus(viewingStudent.id, doc.id, 'REJECTED')}
                                            className="flex-1 py-3 bg-white border border-red-100 text-red-600 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                          >
                                             Reject
                                          </button>
                                       </div>
                                    </div>
                                 ))}
                                 {(viewingStudent.kycDocs || []).length === 0 && (
                                   <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[2.5rem] opacity-50">
                                      <FileText size={32} className="mx-auto text-gray-300 mb-4" />
                                      <p className="text-[10px] font-black uppercase tracking-widest text-[#888888]">No KYC documents uploaded</p>
                                   </div>
                                 )}
                              </div>
                           </div>
                           <div className="space-y-10">
                              <div>
                                 <h4 className="text-[10px] font-black text-[#141414] uppercase tracking-[0.2em] mb-6 flex items-center">
                                    <LayoutGrid size={14} className="mr-2 text-blue-600" />
                                    Student Metadata
                                 </h4>
                                 <div className="bg-gray-50/50 rounded-3xl p-8 border border-gray-100 space-y-4">
                                    {[
                                      { label: 'Father\'s Name', value: viewingStudent.fatherName },
                                      { label: 'Contact', value: viewingStudent.contact },
                                      { label: 'Email', value: viewingStudent.email },
                                      { label: 'Qualification', value: viewingStudent.highestQualification },
                                      { label: 'Board', value: viewingStudent.qualificationDetail },
                                      { label: 'Identity No', value: viewingStudent.idNumber },
                                    ].map((info, i) => (
                                      <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                                         <p className="text-[9px] font-black text-[#888888] uppercase tracking-widest">{info.label}</p>
                                         <p className="text-[11px] font-bold text-[#141414] uppercase">{info.value || 'N/A'}</p>
                                      </div>
                                    ))}
                                 </div>
                              </div>
                              <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
                                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                                 <h4 className="text-xl font-black tracking-tight uppercase italic mb-2">Audit History</h4>
                                 <p className="text-[10px] text-blue-100 font-medium uppercase tracking-tighter mb-4">All verification actions are timestamped and logged globally for compliance.</p>
                                 <div className="space-y-3 opacity-80">
                                    <div className="flex items-start space-x-3 text-[9px] font-bold uppercase italic">
                                       <div className="w-1 h-8 bg-blue-300 rounded-full shrink-0" />
                                       <div>
                                          <p className="text-blue-100">Profile registered via {viewingStudent.studyCenter}</p>
                                          <p className="text-blue-300 mt-0.5">{new Date(viewingStudent.admissionDate).toLocaleDateString()}</p>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                      )}
                   </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export const CertificateStudio = () => {
  const navigate = useNavigate();
  const { certificates, students, courses } = useApp();
  const [selectedStudentId, setSelectedStudentId] = React.useState(students[0]?.id || '');
  const selectedStudent = students.find(s => s.id === selectedStudentId);
  const pendingCerts = students.filter(s => s.certificateStatus === 'APPLIED').length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-3xl font-black text-[#141414] tracking-tight uppercase italic">Certificate Studio</h1>
            <p className="text-sm text-[#888888] font-bold mt-1 uppercase tracking-widest">Designing & publishing digital credentials</p>
          </div>
          {students.length > 0 && (
            <select 
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-blue-600"
            >
              {students.slice(0, 10).map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          )}
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
             className="px-6 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2zl shadow-xl shadow-blue-100 hover:bg-black transition-all flex items-center space-x-2"
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
                  
                  <h3 className="text-4xl font-serif italic text-gray-900 border-b border-gray-200 pb-2 min-w-[300px]">
                    {selectedStudent?.name || 'Candidate Name'}
                  </h3>
                  
                  <div className="max-w-md space-y-2">
                     <p className="text-[10px] font-medium text-gray-500 leading-relaxed uppercase tracking-tighter">
                        for successfully completing the advanced certification program in
                     </p>
                     <p className="text-lg font-black text-[#141414] uppercase tracking-tight italic bg-blue-50 px-4 py-1 rounded inline-block">
                        {selectedStudent?.course || 'Selected Course Curriculum'}
                     </p>
                  </div>
                  
                  <div className="absolute bottom-20 left-20 text-left">
                     <div className="w-32 h-[1px] bg-gray-300 mb-2"></div>
                     <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Date Issued</p>
                     <p className="text-[10px] font-bold text-gray-700 uppercase tracking-tighter">
                       {selectedStudent?.admissionDate ? new Date(selectedStudent.admissionDate).toLocaleDateString() : 'Issued Date'}
                     </p>
                  </div>
                  
                  <div className="absolute bottom-20 right-20 text-right">
                     <div className="w-32 h-[1px] bg-gray-300 mb-2"></div>
                     <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Authorized Director</p>
                     <p className="text-[10px] font-bold text-gray-700 uppercase tracking-tighter italic font-serif">Director, STG Institute</p>
                  </div>
               </div>
               
               <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => navigate('/admin/certificates/create')}
                    className="px-8 py-4 bg-white text-[#141414] text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-2xl flex items-center space-x-3 transform -translate-y-4 group-hover:translate-y-0 transition-transform"
                  >
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
                    { id: '1', name: 'Classic Gold Edition', type: 'DIPLOMA', active: true },
                    { id: '2', name: 'Modern Minimal Blue', type: 'CERTIFICATION', active: false },
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
               <button 
                 onClick={() => navigate('/admin/certificates/templates')}
                 className="w-full py-4 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-white hover:text-black transition-all"
               >
                  Manage Templates
               </button>
            </div>

            <div 
              onClick={() => {
                if (pendingCerts > 0) {
                  alert(`Automation system batch-publishing ${pendingCerts} pending certificates. This will simulate a bulk issuance.`);
                } else {
                  alert('No pending certificate applications found.');
                }
              }}
              className="bg-emerald-600 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
               <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-white/20 backdrop-blur rounded-2xl"><Award size={32} /></div>
                  <h3 className="text-xl font-black uppercase tracking-tight italic">Quick Publish</h3>
                  <p className="text-emerald-100 text-xs font-medium uppercase tracking-tighter max-w-xs mx-auto">Publish and generate PDF certificates for all {pendingCerts} pending students automatically.</p>
                  <ChevronRight className="animate-bounce-x" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export const CertificateTemplates = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-[#141414] tracking-tight uppercase italic">Saved Templates</h1>
          <p className="text-sm text-[#888888] font-bold mt-1 uppercase tracking-widest">Manage your certificate designs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-3 py-20 border-2 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-4 opacity-50">
           <Award size={48} className="text-gray-300" />
           <p className="text-sm font-black text-[#888888] uppercase tracking-widest">No Saved Templates Available</p>
           <p className="text-[10px] text-gray-400 font-bold uppercase">Created templates will appear here</p>
        </div>
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
                  <button 
                    onClick={() => alert('Certificate template draft saved successfully.')}
                    className="flex-1 py-4 bg-[#141414] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-black/10 hover:bg-blue-600 transition-all"
                  >
                    Save Draft
                  </button>
                  <button 
                    onClick={() => alert('Certificate template published and is now available for student issuance.')}
                    className="flex-1 py-4 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-black transition-all"
                  >
                    Publish Live
                  </button>
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
