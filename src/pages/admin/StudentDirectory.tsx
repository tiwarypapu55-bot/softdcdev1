/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users,
  UserCircle,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  Download,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Printer,
  FileText,
  Award,
  MessageCircle,
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileSearch,
  LayoutGrid,
  RefreshCw,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { Student } from '../../types';
import { useNavigate } from 'react-router-dom';

export const StudentDirectory = () => {
  const { students, franchises, courses, deleteStudent, currentUser, franchiseFees, addWalletTransaction, updateStudent, businessProfile } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranch, setFilterBranch] = useState(currentUser?.role === 'FRANCHISE' ? currentUser.franchiseId : 'ALL');
  const [filterCourse, setFilterCourse] = useState('ALL');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [studentToPrint, setStudentToPrint] = useState<Student | null>(null);
  const [viewType, setViewType] = useState<'VIEW' | 'PRINT'>('VIEW');

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    course: '',
    feeStatus: 'PENDING' as any,
    kycStatus: 'PENDING' as any,
    totalFees: 0
  });

  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  const handleEdit = (s: Student) => {
    const prefix = currentUser?.role === 'FRANCHISE' ? '/franchise' : '/admin';
    navigate(`${prefix}/registration/${s.id}`);
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

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      updateStudent(editingStudent.id, formData);
      setEditingStudent(null);
    }
  };

  const handlePrint = (student: Student) => {
    setStudentToPrint(student);
    setViewType('PRINT');
    setShowPrintModal(true);
  };

  const handleApplyCertificate = (student: Student) => {
    // 1. Find the marksheet fee for this center
    const centerFee = franchiseFees.find(ff => ff.franchiseId === student.franchiseId);
    const certFee = centerFee?.marksheetFees || 0;

    if (window.confirm(`Apply for Marksheet/Certificate for ${student.name}? Charges: ₹${certFee}`)) {
      try {
        addWalletTransaction({
          id: `cert-${Date.now()}`,
          franchiseId: student.franchiseId,
          amount: certFee,
          type: 'DEBIT',
          purpose: `Certificate Application: ${student.name} (${student.admissionNo})`,
          timestamp: new Date().toISOString(),
          status: 'SUCCESS'
        });
        
        // Update student status
        updateStudent(student.id, { certificateStatus: 'APPLIED' });
        
        alert('Certificate application submitted successfully. Deduction confirmed.');
      } catch (error: any) {
        alert(error.message || 'Failed to apply for certificate.');
      }
    }
  };

  const handleView = (student: Student) => {
    const prefix = currentUser?.role === 'FRANCHISE' ? '/franchise' : '/admin';
    navigate(`${prefix}/students/${student.id}`);
  };

  const sendWhatsApp = (student: Student) => {
    const message = `*HELLO ${student.name}*\n\nHow can we help you today?\n\n_SOFTDEV TALLY GURU_`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/91${student.contact.replace(/\D/g, '')}?text=${encodedMessage}`, '_blank');
  };

  const filteredStudents = students.filter(s => {
    // If franchise, only show their students
    if (currentUser?.role === 'FRANCHISE' && s.franchiseId !== currentUser.franchiseId) {
      return false;
    }

    const franchise = franchises.find(f => f.id === s.franchiseId);
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (s.enrollmentNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (franchise && franchise.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesBranch = filterBranch === 'ALL' || s.franchiseId === filterBranch;
    const matchesCourse = filterCourse === 'ALL' || s.course === filterCourse;

    return matchesSearch && matchesBranch && matchesCourse;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-20 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#141414] tracking-tight uppercase">Student Directory</h1>
          <p className="text-sm text-[#888888] font-mono">Centralized registry of all {currentUser?.role === 'FRANCHISE' ? 'your' : 'active'} students</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#141414] hover:bg-gray-50 shadow-sm transition-all border-b-2">
            <Download size={14} />
            <span>Export Data</span>
          </button>
          <button 
            onClick={() => navigate((currentUser?.role === 'ADMIN' || currentUser?.role === 'ADMINISTRATOR') ? '/admin/registration' : '/franchise/registration')}
            className="flex items-center space-x-2 px-6 py-3 bg-[#141414] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 shadow-xl shadow-black/20 transition-all"
          >
            <Plus size={14} />
            <span>New Admission</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search student by name, Branch , Roll No...." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border-2 border-emerald-500 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-gray-700 placeholder:text-gray-400 text-sm"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <select 
              disabled={currentUser?.role === 'FRANCHISE'}
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold appearance-none disabled:bg-gray-100 disabled:text-gray-400 text-[10px] uppercase tracking-widest"
            >
              <option value="ALL">All Branches</option>
              {franchises.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div>
            <select 
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold appearance-none text-[10px] uppercase tracking-widest"
            >
              <option value="ALL">All Courses</option>
              {courses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Enrolled', value: students.length, icon: Users, color: 'blue' },
          { label: 'Fee Pending', value: students.filter(s => s.feeStatus === 'PENDING').length, icon: AlertCircle, color: 'red' },
          { label: 'KYC Verified', value: students.filter(s => s.kycStatus === 'APPROVED').length, icon: CheckCircle, color: 'emerald' },
          { label: 'New This Month', value: students.filter(s => new Date(s.admissionDate).getMonth() === new Date().getMonth()).length, icon: GraduationCap, color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xs flex items-center space-x-4">
             <div className={clsx(
               "w-12 h-12 rounded-2xl flex items-center justify-center",
               stat.color === 'blue' ? "bg-blue-50 text-blue-600" : 
               stat.color === 'red' ? "bg-red-50 text-red-600" :
               stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600" : "bg-purple-50 text-purple-600"
             )}>
                <stat.icon size={20} />
             </div>
             <div>
                <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                <p className="text-xl font-black text-[#141414] leading-none">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Results Table */}
      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-2xl shadow-black/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#2D3748] text-white">
                <th className="px-4 py-5 text-[11px] font-black uppercase tracking-tight border-r border-gray-700/50">Sr No.</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-tight border-r border-gray-700/50">Course</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-tight border-r border-gray-700/50">Admission No.</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-tight border-r border-gray-700/50">Enrollment No.</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-tight border-r border-gray-700/50">Student's Name</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-tight border-r border-gray-700/50">Father's Name</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-tight border-r border-gray-700/50">Phone</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-tight border-r border-gray-700/50">Admission Date</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-tight border-r border-gray-700/50">Status</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-tight">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student, index) => (
                <tr key={student.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-4 py-5 text-[11px] font-bold text-gray-600 border-r border-gray-100">{index + 1}</td>
                  <td className="px-6 py-5 border-r border-gray-100">
                    <p className="text-[10px] font-black text-[#141414] uppercase leading-tight line-clamp-2 max-w-[150px]">{student.course}</p>
                  </td>
                  <td className="px-6 py-5 border-r border-gray-100 whitespace-nowrap">
                    <span className="text-[10px] font-mono font-black text-gray-500">{student.admissionNo}</span>
                  </td>
                  <td className="px-6 py-5 border-r border-gray-100 whitespace-nowrap">
                    <span className="text-[10px] font-mono font-black text-blue-600">{student.enrollmentNo || "-"}</span>
                  </td>
                  <td className="px-6 py-5 border-r border-gray-100">
                    <div className="flex items-center space-x-3">
                       <div className="w-8 h-8 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                          <img 
                            src={student.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} 
                            alt={student.name} 
                            className="w-full h-full object-cover"
                          />
                       </div>
                       <p className="text-[11px] font-black text-[#141414] uppercase truncate">{student.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 border-r border-gray-100 text-[11px] font-bold text-gray-600 uppercase">{student.fatherName || "-"}</td>
                  <td className="px-6 py-5 border-r border-gray-100 text-[11px] font-black text-[#141414]">{student.contact}</td>
                  <td className="px-6 py-5 border-r border-gray-100 text-[10px] font-bold text-gray-500 whitespace-nowrap">{student.admissionDate}</td>
                  <td className="px-6 py-5 border-r border-gray-100">
                     <span className={clsx(
                       "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight inline-flex items-center gap-1.5",
                       student.feeStatus === 'PAID' ? "bg-emerald-100 text-emerald-700" : 
                       student.feeStatus === 'PARTIAL' ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                     )}>
                       <div className={clsx("w-1.5 h-1.5 rounded-full animate-pulse", 
                         student.feeStatus === 'PAID' ? "bg-emerald-600" : 
                         student.feeStatus === 'PARTIAL' ? "bg-amber-600" : "bg-red-600"
                       )}></div>
                       {student.feeStatus}
                     </span>
                  </td>
                  <td className="px-6 py-5">
                     <div className="flex items-center space-x-1">
                        <button 
                           onClick={() => sendWhatsApp(student)}
                           className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                           title="Send WhatsApp Message"
                        >
                           <MessageCircle size={14} />
                        </button>
                        {currentUser?.role === 'FRANCHISE' && (
                           <button 
                             onClick={() => student.certificateStatus === 'APPLIED' || student.certificateStatus === 'ISSUED' ? alert('Certificate already applied or issued for this student.') : handleApplyCertificate(student)}
                             className={clsx(
                               "p-2 rounded-lg transition-all",
                               student.certificateStatus === 'APPLIED' ? "text-amber-600 bg-amber-50" : 
                               student.certificateStatus === 'ISSUED' ? "text-emerald-600 bg-emerald-50" : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                             )}
                             title="Apply for Marksheet/Certificate"
                           >
                              <Award size={14} />
                           </button>
                        )}
                        {currentUser?.role === 'FRANCHISE' && (
                           <button 
                             onClick={() => navigate('/franchise/collection', { state: { studentId: student.id } })}
                             className="p-2 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all"
                             title="Collect Fee"
                           >
                              <CreditCard size={14} />
                           </button>
                        )}
                        <button 
                           onClick={() => sendWhatsApp(student)}
                           className="p-2 text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-lg transition-all"
                           title="Send WhatsApp Message"
                        >
                           <MessageCircle size={14} />
                        </button>
                        <button 
                           onClick={() => setViewingStudent(student)}
                           className="p-2 text-[#6366f1] hover:bg-indigo-50 rounded-lg transition-all"
                           title="Quick KYC Dossier"
                        >
                           <FileCheck size={14} />
                        </button>
                        <button 
                           onClick={() => handleView(student)}
                           className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                           title="View Profile"
                        >
                           <Eye size={14} />
                        </button>
                        <button 
                           onClick={() => handleEdit(student)}
                           className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        >
                           <Edit2 size={14} />
                        </button>
                        <button 
                           onClick={() => handlePrint(student)}
                           className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                           title="Print Registration Form"
                        >
                           <Printer size={14} />
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this student record?')) {
                              deleteStudent(student.id);
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                           <Trash2 size={14} />
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                   <td colSpan={10} className="py-32 text-center">
                      <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                         <UserCircle size={48} />
                      </div>
                      <h3 className="text-sm font-black text-[#141414] uppercase tracking-widest">No Students Found</h3>
                      <p className="text-[10px] text-[#888888] font-mono mt-2 uppercase">Adjust your search or filters to see more results</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
           <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Showing {filteredStudents.length} of {students.length} students</p>
           <div className="flex items-center space-x-2">
              <button disabled className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-[#888888] opacity-50">Prev</button>
              <button disabled className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-[#888888] opacity-50">Next</button>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {viewingStudent && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
               <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 text-left">
                  <div className="flex items-center space-x-4">
                     <div className="w-12 h-12 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm shrink-0">
                        <img src={viewingStudent.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${viewingStudent.name}`} alt="" className="w-full h-full object-cover" />
                     </div>
                     <div>
                        <h3 className="text-xl font-black text-[#141414] tracking-tight uppercase truncate max-w-[300px]">{viewingStudent.name}</h3>
                        <p className="text-[10px] font-bold text-[#888888] uppercase tracking-widest italic">{viewingStudent.course} • ID: {viewingStudent.admissionNo}</p>
                     </div>
                  </div>
                  <button 
                    onClick={() => setViewingStudent(null)}
                    className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-400 hover:text-red-500 transition-all shadow-sm"
                  >
                    <X size={20} />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-10 bg-white text-left">
                  {viewingStudent && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div>
                          <h4 className="text-[10px] font-black text-[#141414] uppercase tracking-[0.2em] mb-6 flex items-center">
                             <FileSearch size={14} className="mr-2 text-blue-600" />
                             KYC Dossier - Documents
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
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/doc:opacity-100 transition-opacity flex items-center justify-center space-x-2 text-white">
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
                                Quick Info
                             </h4>
                             <div className="bg-gray-50/50 rounded-3xl p-8 border border-gray-100 space-y-4">
                                {[
                                  { label: 'Father\'s Name', value: viewingStudent.fatherName },
                                  { label: 'Contact', value: viewingStudent.contact },
                                  { label: 'KYC Status', value: viewingStudent.kycStatus },
                                ].map((info, i) => (
                                  <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                                     <p className="text-[9px] font-black text-[#888888] uppercase tracking-widest">{info.label}</p>
                                     <p className="text-[11px] font-bold text-[#141414] uppercase">{info.value || 'N/A'}</p>
                                  </div>
                                ))}
                             </div>
                          </div>
                       </div>
                    </div>
                  )}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-white rounded-[3rem] w-full max-w-lg p-10 shadow-2xl relative"
            >
               <button 
                onClick={() => setEditingStudent(null)}
                className="absolute right-8 top-8 p-3 text-gray-400 hover:text-[#141414] hover:bg-gray-100 rounded-2xl"
              >
                <X size={20} />
              </button>

              <div className="mb-10">
                <h3 className="text-2xl font-black text-[#141414] uppercase tracking-tight">Edit Student Profile</h3>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">ID: {editingStudent.admissionNo}</p>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" 
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Contact</label>
                       <input 
                         type="text" 
                         value={formData.contact}
                         onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                         className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Email</label>
                       <input 
                         type="email" 
                         value={formData.email}
                         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                         className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" 
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Course</label>
                    <select 
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                    >
                       {courses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                    </select>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Fee Status</label>
                       <select 
                         value={formData.feeStatus}
                         onChange={(e) => setFormData({ ...formData, feeStatus: e.target.value as any })}
                         className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                       >
                          <option value="PENDING">Pending</option>
                          <option value="PARTIAL">Partial</option>
                          <option value="PAID">Paid</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1 text-blue-600">Total Fee (₹)</label>
                       <input 
                         type="number" 
                         value={formData.totalFees}
                         onChange={(e) => setFormData({ ...formData, totalFees: Number(e.target.value) })}
                         className="w-full p-4 bg-blue-50 border border-blue-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-blue-700" 
                       />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">KYC Status</label>
                       <select 
                         value={formData.kycStatus}
                         onChange={(e) => setFormData({ ...formData, kycStatus: e.target.value as any })}
                         className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                       >
                          <option value="PENDING">Pending</option>
                          <option value="APPROVED">Approved</option>
                          <option value="REJECTED">Rejected</option>
                       </select>
                    </div>
                 </div>
                 <button type="submit" className="w-full py-4 bg-[#141414] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-black/10">Save Profile Updates</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPrintModal && studentToPrint && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:p-0 print:bg-white text-left">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto p-12 shadow-2xl relative print:shadow-none print:p-0 print:max-h-none print:overflow-visible print:rounded-none"
            >
              <div className="absolute right-8 top-8 flex items-center space-x-3 print:hidden">
                <button 
                  onClick={() => window.print()}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                >
                  <Printer size={16} />
                  <span>Print Now</span>
                </button>
                <button 
                  onClick={() => setShowPrintModal(false)}
                  className="p-3 bg-gray-100 text-gray-400 hover:text-red-500 rounded-2xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div id="printable-form" className="font-sans text-[#141414]">
                  {/* Header Section Matches Image */}
                  <div className="text-center space-y-1 mb-8">
                     {businessProfile.receiptHeaderUrl ? (
                       <img src={businessProfile.receiptHeaderUrl} alt="Header" className="w-full h-auto mx-auto" />
                     ) : (
                       <div className="flex flex-col items-center">
                         <p className="text-[10px] font-bold text-gray-800">An ISO 9001 : 2015 Certified Institute</p>
                         <p className="text-[11px] font-black text-emerald-700">बस्ती मंडल का नं. 1 कंप्यूटर ट्रेनिंग इंस्टिट्यूट</p>
                                                   <h1 className="text-4xl font-black text-red-600 tracking-tight uppercase leading-none mt-1">
                            {franchises.find(f => f.id === studentToPrint.franchiseId)?.name || businessProfile.name || "SOFTDEV TALLY GURU"}
                          </h1>
                         <div className="bg-indigo-900/5 px-4 py-1 rounded text-[8px] font-bold text-indigo-900 border border-indigo-900/10 mt-1">
                             [ RUN UNDER : SOFTDEV TALLY GURU PRASHIKSHAN SANSTHAN SOCIETY ] [ REG No. : G-58913 / 1442 ]
                         </div>
                         <p className="text-[9px] font-black text-blue-800 mt-1">(A Complete Computer Education Institute) (An Authorised Tally Education Partner)</p>
                         <p className="text-[9px] font-bold text-red-600 uppercase">Head Office : {businessProfile.address} - {businessProfile.pincode || '272001'}</p>
                         <p className="text-[9px] font-black text-[#141414]">Website : {businessProfile.website}  Phone : {businessProfile.phone}</p>
                       </div>
                     )}
                  </div>

                  <div className="flex justify-between items-start border-b-[1.5px] border-black pb-4 mb-6">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-blue-600 text-white flex items-center justify-center rounded-2xl overflow-hidden shrink-0">
                        <GraduationCap size={40} />
                      </div>
                      <div>
                        <h2 className="text-xl font-black tracking-tight uppercase leading-none mb-1 text-blue-800">Registration Details</h2>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="px-3 py-1 bg-gray-100 rounded-lg text-[9px] font-black uppercase text-gray-600">Center: {studentToPrint.studyCenter}</div>
                          <div className="px-3 py-1 bg-gray-100 rounded-lg text-[9px] font-black uppercase text-gray-600">Reg Date: {studentToPrint.admissionDate}</div>
                        </div>
                      </div>
                    </div>
                    <div className="w-24 h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-[8px] font-black text-gray-300 text-center uppercase p-2 overflow-hidden bg-gray-50">
                      {studentToPrint.photoUrl ? (
                        <img src={studentToPrint.photoUrl} alt="Student" className="w-full h-full object-cover" />
                      ) : (
                        "Affix Photo"
                      )}
                    </div>
                  </div>

                <div className="text-center mb-10">
                  <h2 className="text-2xl font-black uppercase tracking-[0.2em] bg-black text-white py-3 px-8 inline-block rounded-xl">
                    {viewType === 'PRINT' ? 'Admission Registration Form' : 'Student Profile Details'}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-x-12 gap-y-6 mb-12">
                   {[
                     { label: 'Full Name', value: studentToPrint.name },
                     { label: 'Father\'s Name', value: studentToPrint.fatherName },
                     { label: 'Mother\'s Name', value: studentToPrint.motherName },
                     { label: 'Date of Birth', value: studentToPrint.dob },
                     { label: 'Gender', value: studentToPrint.gender },
                     { label: 'Contact Number', value: studentToPrint.contact },
                     { label: 'Enrollment No.', value: studentToPrint.enrollmentNo },
                     { label: 'Admission No.', value: studentToPrint.admissionNo },
                     { label: 'Course Applied', value: studentToPrint.course },
                     { label: 'Course Duration', value: studentToPrint.courseDuration },
                     { label: 'Aadhar/ID Type', value: studentToPrint.identityType },
                     { label: 'ID Number', value: studentToPrint.idNumber },
                     { label: 'Qualification', value: studentToPrint.highestQualification },
                     { label: 'Board/University', value: studentToPrint.qualificationDetail },
                     { label: 'Passing Year', value: studentToPrint.passingYear },
                     { label: 'State', value: studentToPrint.state },
                     { label: 'District', value: studentToPrint.district },
                     { label: 'Pincode', value: studentToPrint.pincode },
                   ].map((item, i) => (
                     <div key={i} className="flex justify-between items-baseline border-b border-gray-100 pb-2">
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{item.label}</span>
                        <span className="text-sm font-bold uppercase">{item.value || 'N/A'}</span>
                     </div>
                   ))}
                </div>

                <div className="mb-12">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">Detailed Address</span>
                  <p className="text-sm font-bold uppercase p-4 bg-gray-50 rounded-2xl min-h-[60px]">{studentToPrint.address || 'N/A'}</p>
                </div>

                <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 mb-12 page-break-inside-avoid">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center border-b border-gray-200 pb-4">
                    <FileText size={16} className="mr-2 text-blue-600" />
                    No Refund & Non-Transferable Policy
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "Once admission is confirmed after counseling, the admission fee paid to Softdev Tally Guru is non-refundable.",
                      "All candidates are required to complete the course within the stipulated duration.",
                      "The no-refund policy applies to all courses, irrespective of the type of admission.",
                      "Admission is strictly non-transferable and cannot be transferred to another candidate.",
                      "In exceptional circumstances, if a candidate is unable to attend the course, an extension may be granted solely at the discretion of the management."
                    ].map((text, i) => (
                      <li key={i} className="flex items-start space-x-3 text-[11px] font-bold text-gray-600 leading-relaxed italic">
                        <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-1.5" />
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-12 pt-12 items-end">
                   <div className="text-center">
                      <div className="border-b-2 border-black w-48 mx-auto mb-3"></div>
                      <p className="text-[10px] font-black uppercase tracking-widest">Student Signature</p>
                   </div>
                   <div className="text-center">
                      <div className="border-b-2 border-black w-48 mx-auto mb-3"></div>
                      <p className="text-[10px] font-black uppercase tracking-widest">Counselor/Admin Signature</p>
                   </div>
                </div>

                <div className="mt-20 pt-8 border-t border-gray-100 text-center">
                   <p className="text-[9px] font-black uppercase tracking-widest text-gray-300">Computer Generated Document | Registration ID: {studentToPrint.id}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
