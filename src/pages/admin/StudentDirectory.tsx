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
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { Student } from '../../types';
import { useNavigate } from 'react-router-dom';

export const StudentDirectory = () => {
  const { students, franchises, courses, deleteStudent, currentUser } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranch, setFilterBranch] = useState(currentUser?.role === 'FRANCHISE' ? currentUser.franchiseId : 'ALL');
  const [filterCourse, setFilterCourse] = useState('ALL');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    course: '',
    feeStatus: 'PENDING' as any,
    kycStatus: 'PENDING' as any
  });

  const handleEdit = (s: Student) => {
    setEditingStudent(s);
    setFormData({
      name: s.name,
      contact: s.contact,
      email: s.email,
      course: s.course,
      feeStatus: s.feeStatus,
      kycStatus: s.kycStatus
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      const { updateStudent } = useApp(); // Get it from context
      updateStudent(editingStudent.id, formData);
      setEditingStudent(null);
    }
  };

  const filteredStudents = students.filter(s => {
    // If franchise, only show their students
    if (currentUser?.role === 'FRANCHISE' && s.franchiseId !== currentUser.franchiseId) {
      return false;
    }

    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase());
    
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, ID or enrollment..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
          />
        </div>
        <div>
          <select 
            disabled={currentUser?.role === 'FRANCHISE'}
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold appearance-none disabled:bg-gray-100 disabled:text-gray-400"
          >
            <option value="ALL">All Branches</option>
            {franchises.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>
        <div>
          <select 
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold appearance-none"
          >
            <option value="ALL">All Courses</option>
            {courses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
          </select>
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
      <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-8 py-6 text-[10px] font-black text-[#888888] uppercase tracking-widest">Student Info</th>
                <th className="px-8 py-6 text-[10px] font-black text-[#888888] uppercase tracking-widest">Enrollment No</th>
                <th className="px-8 py-6 text-[10px] font-black text-[#888888] uppercase tracking-widest">Branch / Center</th>
                <th className="px-8 py-6 text-[10px] font-black text-[#888888] uppercase tracking-widest">Course Detail</th>
                <th className="px-8 py-6 text-[10px] font-black text-[#888888] uppercase tracking-widest">Fee Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-[#888888] uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                       <div className="w-12 h-12 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                          <img 
                            src={student.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} 
                            alt={student.name} 
                            className="w-full h-full object-cover"
                          />
                       </div>
                       <div className="min-w-0">
                          <p className="text-sm font-black text-[#141414] uppercase leading-none mb-1 truncate">{student.name}</p>
                          <div className="flex items-center space-x-2 text-[#888888]">
                             <Phone size={10} />
                             <span className="text-[10px] font-bold">{student.contact}</span>
                          </div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <span className="text-xs font-mono font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 inline-block">
                        {student.enrollmentNo || student.admissionNo}
                     </span>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex items-center space-x-2">
                        <Building2 size={12} className="text-gray-400" />
                        <span className="text-[10px] font-black text-[#141414] uppercase tracking-tighter">
                          {franchises.find(f => f.id === student.franchiseId)?.name || student.studyCenter}
                        </span>
                     </div>
                  </td>
                  <td className="px-8 py-6">
                     <div>
                        <p className="text-[10px] font-black text-[#141414] uppercase leading-none mb-1">{student.course}</p>
                        <p className="text-[8px] font-black text-[#888888] uppercase tracking-widest">Reg: {student.admissionDate}</p>
                     </div>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex flex-col gap-1">
                        <span className={clsx(
                          "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest inline-flex w-fit items-center gap-1",
                          student.feeStatus === 'PAID' ? "bg-emerald-50 text-emerald-600" : 
                          student.feeStatus === 'PARTIAL' ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                        )}>
                          <div className={clsx("w-1 h-1 rounded-full", 
                            student.feeStatus === 'PAID' ? "bg-emerald-600" : 
                            student.feeStatus === 'PARTIAL' ? "bg-amber-600" : "bg-red-600"
                          )}></div>
                          {student.feeStatus}
                        </span>
                        <span className={clsx(
                           "text-[7px] font-black uppercase tracking-[0.2em] ml-1",
                           student.kycStatus === 'APPROVED' ? "text-emerald-500" : "text-gray-400"
                        )}>
                          KYC {student.kycStatus}
                        </span>
                     </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                     <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {currentUser?.role === 'FRANCHISE' && (
                           <button 
                             onClick={() => navigate('/franchise/collection', { state: { studentId: student.id } })}
                             className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm border border-blue-100"
                             title="Collect Fee"
                           >
                              <CreditCard size={16} />
                           </button>
                        )}
                        <button className="p-2.5 bg-white border border-gray-100 text-gray-400 hover:text-blue-600 rounded-xl transition-all shadow-sm">
                           <Eye size={16} />
                        </button>
                        <button 
                           onClick={() => handleEdit(student)}
                           className="p-2.5 bg-white border border-gray-100 text-gray-400 hover:text-emerald-600 rounded-xl transition-all shadow-sm"
                        >
                           <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this student record?')) {
                              deleteStudent(student.id);
                            }
                          }}
                          className="p-2.5 bg-white border border-gray-100 text-gray-400 hover:text-red-500 rounded-xl transition-all shadow-sm"
                        >
                           <Trash2 size={16} />
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                   <td colSpan={6} className="py-32 text-center">
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
    </div>
  );
};
