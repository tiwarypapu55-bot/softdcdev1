/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/Layout';
import { 
  Users, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  MoreVertical,
  Plus,
  X,
  Search,
  Filter,
  ShieldCheck,
  Wallet,
  Calendar,
  FileText,
  Ban,
  Trash2,
  Edit2
} from 'lucide-react';
import { Franchise } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { compressImage } from '../../lib/storage';

export const AdminFranchiseManagement = () => {
  const { franchises, updateFranchise, addFranchise, deleteFranchise } = useApp();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'ALL' | 'APPROVED' | 'PENDING' | 'REJECTED' | 'BLOCKED'>('ALL');
  const [showOnboardModal, setShowOnboardModal] = React.useState(false);
  const [editingFranchise, setEditingFranchise] = React.useState<Franchise | null>(null);
  
  // New branch form state
  const [newBranch, setNewBranch] = React.useState({
    branchId: `SKY${Math.floor(Math.random() * 900) + 100}`,
    instituteName: '',
    directorName: '',
    address: '',
    phone: '',
    mobile: '',
    email: '',
    orgDetails: '',
    blockName: '',
    state: '',
    district: '',
    pincode: '',
    revenueShare: 20,
    validityFrom: '',
    validityTo: '',
    loginId: '',
    password: '',
    certificateUrl: '',
    directorPhotoUrl: '',
    logoUrl: '',
    enabledMenus: ['DASHBOARD', 'STUDENTS']
  });

  const AVAILABLE_MENUS = [
    { id: 'STUDENTS', label: 'Student Directory' },
    { id: 'WALLET', label: 'Wallet & Ledger' },
    { id: 'EXAMS', label: 'Examination Portal' },
    { id: 'COLLECTION', label: 'Fee Collection' },
    { id: 'E_LEARNING', label: 'E-Learning Content' },
    { id: 'EMPLOYEES', label: 'Employee Management' },
    { id: 'NOTIFICATIONS', label: 'Notice Board' },
    { id: 'ACCOUNTS', label: 'Branch Accounts' },
    { id: 'ATTENDANCE', label: 'Student Attendance' },
    { id: 'TIMETABLE', label: 'Class TimeTable' },
  ];

  const handleDirectorPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string, 400, 0.7);
        setNewBranch({ ...newBranch, directorPhotoUrl: compressed });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string, 400, 0.8);
        setNewBranch({ ...newBranch, logoUrl: compressed });
      };
      reader.readAsDataURL(file);
    }
  };

  const [verificationInput, setVerificationInput] = React.useState('');
  const [generatedCode, setGeneratedCode] = React.useState('');

  React.useEffect(() => {
    if (showOnboardModal) {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      setGeneratedCode(code);
    }
  }, [showOnboardModal]);

  const filteredFranchises = franchises.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         f.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, status: 'APPROVED' | 'REJECTED' | 'BLOCKED') => {
    updateFranchise(id, { status });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this franchise? All associated data will be lost.')) {
      deleteFranchise(id);
    }
  };

  const handleEdit = (f: Franchise) => {
    setEditingFranchise(f);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFranchise) {
      updateFranchise(editingFranchise.id, editingFranchise);
      setEditingFranchise(null);
    }
  };

  const handleOnboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationInput !== generatedCode) {
      alert('Invalid verification code');
      return;
    }

    addFranchise({
      id: newBranch.branchId,
      name: newBranch.instituteName,
      ownerId: 'u' + Math.random().toString(36).substr(2, 9),
      contact: newBranch.mobile,
      address: `${newBranch.address}, ${newBranch.district}, ${newBranch.state} - ${newBranch.pincode}`,
      walletBalance: 0,
      status: 'APPROVED', // Default to approved when admin adds directly
      licenseDocs: [],
      revenueSharePercent: newBranch.revenueShare,
      createdAt: new Date().toISOString(),
      validityFrom: newBranch.validityFrom,
      validityTo: newBranch.validityTo,
      loginId: newBranch.loginId,
      password: newBranch.password,
      approvalCertificateUrl: newBranch.certificateUrl || `https://example.com/certs/${newBranch.branchId}.pdf`,
      directorPhotoUrl: newBranch.directorPhotoUrl,
      logoUrl: newBranch.logoUrl,
      enabledMenus: newBranch.enabledMenus || ['DASHBOARD', 'STUDENTS']
    });

    setNewBranch({ 
      branchId: `SKY${Math.floor(Math.random() * 900) + 100}`,
      instituteName: '',
      directorName: '',
      address: '',
      phone: '',
      mobile: '',
      email: '',
      orgDetails: '',
      blockName: '',
      state: '',
      district: '',
      pincode: '',
      revenueShare: 20,
      validityFrom: '',
      validityTo: '',
      loginId: '',
      password: '',
      certificateUrl: '',
      directorPhotoUrl: '',
      logoUrl: '',
      enabledMenus: ['DASHBOARD', 'STUDENTS']
    });
    setVerificationInput('');
    setShowOnboardModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#141414]">Franchise Nodes</h1>
          <p className="text-sm text-[#888888]">Manage registration, approvals and profit sharing configurations.</p>
        </div>
        <button 
          onClick={() => setShowOnboardModal(true)}
          className="px-6 py-2 bg-[#141414] text-white text-sm font-bold rounded-xl hover:bg-[#2A2A2A] transition-colors flex items-center space-x-2 shadow-xs"
        >
          <Plus size={18} />
          <span>Onboard New Branch</span>
        </button>
      </div>

      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#E5E5E5] shadow-xs">
        <div className="flex items-center bg-[#F5F5F5] px-4 py-2 rounded-xl w-96">
           <Search size={16} className="text-[#888888]" />
           <input 
             type="text" 
             placeholder="Search by name, ID or owner..." 
             className="ml-3 bg-transparent border-none text-sm w-full outline-hidden" 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <div className="flex items-center space-x-3">
           <div className="relative group">
             <button className="px-4 py-2 bg-white border border-[#E5E5E5] text-xs font-bold rounded-lg flex items-center space-x-2 text-[#888888] hover:text-[#141414]">
               <Filter size={14} />
               <span>{statusFilter === 'ALL' ? 'Filter' : statusFilter}</span>
             </button>
             <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E5E5E5] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                <button onClick={() => setStatusFilter('ALL')} className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-[#F5F5F5] transition-colors border-b border-[#F0F0F0]">All Branches</button>
                <button onClick={() => setStatusFilter('APPROVED')} className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-[#F5F5F5] transition-colors border-b border-[#F0F0F0]">Approved Only</button>
                <button onClick={() => setStatusFilter('PENDING')} className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-[#F5F5F5] transition-colors border-b border-[#F0F0F0]">Pending Review</button>
                <button onClick={() => setStatusFilter('BLOCKED')} className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-[#F5F5F5] transition-colors">Blocked Branches</button>
             </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredFranchises.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#E5E5E5]">
            <p className="text-[#888888] font-medium">No branches found matching your criteria.</p>
          </div>
        ) : (
          filteredFranchises.map((f) => (
            <motion.div 
              key={f.id}
              whileHover={{ scale: 1.005 }}
              className="bg-white p-6 rounded-2xl border border-[#E5E5E5] shadow-xs flex flex-wrap items-center justify-between gap-6"
            >
              <div className="flex items-center space-x-6 min-w-[300px]">
                 <div className="w-14 h-14 bg-[#141414] text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm">
                    {f.name.substring(0, 1)}
                 </div>
                 <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-bold text-[#141414]">{f.name}</h3>
                      <span className={clsx(
                        "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest",
                        f.status === 'APPROVED' ? "bg-green-50 text-green-600" : 
                        f.status === 'PENDING' ? "bg-orange-50 text-orange-600" : 
                        f.status === 'BLOCKED' ? "bg-red-600 text-white" :
                        "bg-red-50 text-red-600"
                      )}>
                        {f.status}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1 mt-1">
                      <div className="flex items-center space-x-4 text-[#888888]">
                        <div className="flex items-center space-x-1">
                           <MapPin size={12} />
                           <span className="text-[10px] font-medium">{f.address}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                           <Phone size={12} />
                           <span className="text-[10px] font-medium">{f.contact}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-blue-600/60 transition-colors hover:text-blue-600">
                        {f.validityFrom && f.validityTo && (
                          <div className="flex items-center space-x-1">
                            <Calendar size={12} />
                            <span className="text-[10px] font-black uppercase">Validity: {new Date(f.validityFrom).toLocaleDateString()} - {new Date(f.validityTo).toLocaleDateString()}</span>
                          </div>
                        )}
                        {f.approvalCertificateUrl && (
                          <a href={f.approvalCertificateUrl} target="_blank" rel="noreferrer" className="flex items-center space-x-1">
                            <FileText size={12} />
                            <span className="text-[10px] font-black uppercase underline">View Certificate</span>
                          </a>
                        )}
                      </div>
                      {f.loginId && (
                         <div className="flex items-center space-x-1 text-[#888888] mt-1">
                            <ShieldCheck size={10} />
                            <span className="text-[9px] font-bold uppercase">Login ID: {f.loginId}</span>
                         </div>
                      )}
                    </div>
                 </div>
              </div>

              <div className="flex items-center space-x-12">
                 <div className="text-center">
                    <p className="text-[10px] uppercase font-bold text-[#888888] tracking-widest mb-1">Revenue Share</p>
                    <div className="flex items-center space-x-1 justify-center">
                      <ShieldCheck size={14} className="text-[#141414]" />
                      <p className="text-sm font-bold text-[#141414]">{f.revenueSharePercent}%</p>
                    </div>
                 </div>
                 <div className="text-center">
                    <p className="text-[10px] uppercase font-bold text-[#888888] tracking-widest mb-1">Wallet Balance</p>
                    <div className="flex items-center space-x-1 justify-center">
                      <Wallet size={14} className="text-[#141414]" />
                      <p className="text-sm font-bold text-[#141414]">₹{f.walletBalance.toLocaleString()}</p>
                    </div>
                 </div>
              </div>

              <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {f.status === 'PENDING' ? (
                      <>
                      <button 
                        onClick={() => handleStatusChange(f.id, 'APPROVED')}
                        className="px-4 py-2 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleStatusChange(f.id, 'REJECTED')}
                        className="px-4 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Reject
                      </button>
                      </>
                    ) : f.status === 'APPROVED' ? (
                      <button 
                        onClick={() => handleStatusChange(f.id, 'BLOCKED')}
                        className="px-4 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition-all flex items-center space-x-2"
                      >
                        <Ban size={14} />
                        <span>Block</span>
                      </button>
                    ) : f.status === 'BLOCKED' ? (
                      <button 
                        onClick={() => handleStatusChange(f.id, 'APPROVED')}
                        className="px-4 py-2 bg-green-50 text-green-600 text-xs font-bold rounded-lg hover:bg-green-100 transition-all"
                      >
                        Unblock
                      </button>
                    ) : null}
                  </div>
                  
                  <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100">
                      <button 
                        onClick={() => handleEdit(f)}
                        className="p-2 text-[#888888] hover:text-blue-600 hover:bg-white rounded-lg transition-all"
                        title="Edit"
                      >
                         <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(f.id)}
                        className="p-2 text-[#888888] hover:text-red-500 hover:bg-white rounded-lg transition-all"
                        title="Delete"
                      >
                         <Trash2 size={16} />
                      </button>
                  </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Onboarding Modal */}
      <AnimatePresence>
        {showOnboardModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pb-20">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOnboardModal(false)}
              className="absolute inset-0 bg-[#141414]/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-[#F0F0F0] flex items-center justify-between bg-blue-50">
                <div>
                   <h2 className="text-xl font-bold text-blue-900">Add New Franchise</h2>
                   <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1">Full Registration & Verification</p>
                </div>
                <button onClick={() => setShowOnboardModal(false)} className="p-2 hover:bg-white/50 rounded-xl transition-colors"><X size={20} /></button>
              </div>
              
              <form onSubmit={handleOnboard} className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                 {/* 1. Personal Information */}
                 <section className="space-y-4">
                    <div className="flex items-center space-x-2 border-b border-gray-100 pb-2">
                       <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                       <h3 className="text-sm font-black text-[#141414] uppercase tracking-tight">Personal Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Branch ID</label>
                          <input readOnly value={newBranch.branchId} className="w-full p-3 bg-gray-100 border-none rounded-xl text-sm font-bold text-blue-600 outline-none" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Institute Name</label>
                          <input required type="text" value={newBranch.instituteName} onChange={(e) => setNewBranch({...newBranch, instituteName: e.target.value})} className="w-full p-3 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm" placeholder="Full name of institute" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Director's Name</label>
                          <input required type="text" value={newBranch.directorName} onChange={(e) => setNewBranch({...newBranch, directorName: e.target.value})} className="w-full p-3 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Branch Address</label>
                          <input required type="text" value={newBranch.address} onChange={(e) => setNewBranch({...newBranch, address: e.target.value})} className="w-full p-3 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Phone No</label>
                          <input type="tel" value={newBranch.phone} onChange={(e) => setNewBranch({...newBranch, phone: e.target.value})} className="w-full p-3 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Mobile Number</label>
                          <input required type="tel" value={newBranch.mobile} onChange={(e) => setNewBranch({...newBranch, mobile: e.target.value})} className="w-full p-3 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm" />
                       </div>
                       <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Email</label>
                          <input required type="email" value={newBranch.email} onChange={(e) => setNewBranch({...newBranch, email: e.target.value})} className="w-full p-3 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm" />
                       </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Upload Director Photo</label>
                          <div className="space-y-1">
                             <p className="text-[10px] font-bold text-[#141414] uppercase">Director Photo</p>
                             <div className="flex items-center space-x-3">
                                <label htmlFor="dir-photo" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-gray-100 uppercase shadow-xs transition-colors">Choose File</label>
                                <span className="text-[10px] text-gray-400 font-medium">No file chosen</span>
                             </div>
                             <input type="file" id="dir-photo" className="hidden" />
                          </div>
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Upload Logo</label>
                          <div className="space-y-1">
                             <p className="text-[10px] font-bold text-[#141414] uppercase">Upload Logo</p>
                             <div className="flex items-center space-x-3">
                                <label htmlFor="inst-logo" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-gray-100 uppercase shadow-xs transition-colors">Choose File</label>
                                <span className="text-[10px] text-gray-400 font-medium">No file chosen</span>
                             </div>
                             <input type="file" id="inst-logo" className="hidden" />
                          </div>
                       </div>
                    </div>
                 </section>

                 {/* 2. Organization Information */}
                 <section className="space-y-4">
                    <div className="flex items-center space-x-2 border-b border-gray-100 pb-2">
                       <div className="w-1.5 h-6 bg-emerald-600 rounded-full"></div>
                       <h3 className="text-sm font-black text-[#141414] uppercase tracking-tight">Organization Information</h3>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Organization Details</label>
                       <textarea value={newBranch.orgDetails} onChange={(e) => setNewBranch({...newBranch, orgDetails: e.target.value})} className="w-full p-4 bg-[#F5F5F5] border-none rounded-2xl focus:ring-2 focus:ring-emerald-600 outline-none text-sm min-h-[100px]" placeholder="Briefly describe the parent organization..." />
                    </div>
                 </section>

                 {/* 3. Contact Information */}
                 <section className="space-y-4">
                    <div className="flex items-center space-x-2 border-b border-gray-100 pb-2">
                       <div className="w-1.5 h-6 bg-purple-600 rounded-full"></div>
                       <h3 className="text-sm font-black text-[#141414] uppercase tracking-tight">Contact Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Address / Location</label>
                          <input required type="text" value={newBranch.address} onChange={(e) => setNewBranch({...newBranch, address: e.target.value})} className="w-full p-3 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-sm" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Block</label>
                          <input type="text" value={newBranch.block} onChange={(e) => setNewBranch({...newBranch, block: e.target.value})} className="w-full p-3 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-sm" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">District</label>
                          <input required type="text" value={newBranch.district} onChange={(e) => setNewBranch({...newBranch, district: e.target.value})} className="w-full p-3 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-sm" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">State</label>
                          <input required type="text" value={newBranch.state} onChange={(e) => setNewBranch({...newBranch, state: e.target.value})} className="w-full p-3 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-sm" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Pincode</label>
                          <input required type="text" value={newBranch.pincode} onChange={(e) => setNewBranch({...newBranch, pincode: e.target.value})} className="w-full p-3 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-sm" />
                       </div>
                    </div>
                 </section>

                 {/* 4. Approval & Credentials */}
                 <section className="space-y-4">
                    <div className="flex items-center space-x-2 border-b border-gray-100 pb-2">
                       <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                       <h3 className="text-sm font-black text-[#141414] uppercase tracking-tight">Approval & Access</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Validity From</label>
                          <input required type="date" value={newBranch.validityFrom} onChange={(e) => setNewBranch({...newBranch, validityFrom: e.target.value})} className="w-full p-3 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Validity Up To</label>
                          <input required type="date" value={newBranch.validityTo} onChange={(e) => setNewBranch({...newBranch, validityTo: e.target.value})} className="w-full p-3 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Assign Login ID</label>
                          <input required type="text" placeholder="e.g. SKY_BRANCH_01" value={newBranch.loginId} onChange={(e) => setNewBranch({...newBranch, loginId: e.target.value})} className="w-full p-3 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-bold" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Assign Password</label>
                          <input required type="text" value={newBranch.password} onChange={(e) => setNewBranch({...newBranch, password: e.target.value})} className="w-full p-3 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-bold" />
                       </div>
                       <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Revenue Share (%)</label>
                          <input required type="number" value={newBranch.revenueShare} onChange={(e) => setNewBranch({...newBranch, revenueShare: Number(e.target.value)})} className="w-full p-3 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm" />
                       </div>
                       <div className="space-y-4 md:col-span-2">
                          <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Franchise Approval Certificate</label>
                          <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center space-y-2 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer" onClick={() => setNewBranch({...newBranch, certificateUrl: 'https://example.com/certs/SKY123.pdf'})}>
                             <FileText size={24} className={newBranch.certificateUrl ? "text-blue-600" : "text-gray-400"} />
                             <p className="text-[10px] font-black text-[#141414] uppercase">
                               {newBranch.certificateUrl ? "Certificate Linked Successfully" : "Click to upload Approval PDF"}
                             </p>
                             <p className="text-[8px] text-gray-400 font-bold uppercase">Max size: 5MB</p>
                          </div>
                       </div>
                    </div>
                 </section>

                 {/* Center Menu (Developer Only) */}
                 <section className="space-y-4">
                    <div className="flex items-center space-x-2 border-b border-gray-100 pb-2">
                       <div className="w-1.5 h-6 bg-pink-600 rounded-full"></div>
                       <h3 className="text-sm font-black text-[#141414] uppercase tracking-tight italic text-pink-600">Center Menu Permissions (Developer Only)</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-6 bg-pink-50/30 rounded-3xl border border-pink-100">
                       {AVAILABLE_MENUS.map(menu => (
                          <label key={menu.id} className="flex items-center space-x-3 cursor-pointer group">
                             <input 
                                type="checkbox" 
                                checked={newBranch.enabledMenus?.includes(menu.id)} 
                                onChange={(e) => {
                                   const menus = newBranch.enabledMenus || [];
                                   if (e.target.checked) {
                                      setNewBranch({ ...newBranch, enabledMenus: [...menus, menu.id] });
                                   } else {
                                      setNewBranch({ ...newBranch, enabledMenus: menus.filter(m => m !== menu.id) });
                                   }
                                }}
                                className="w-4 h-4 rounded-md border-gray-300 text-pink-600 focus:ring-pink-500"
                             />
                             <span className="text-[10px] font-black text-[#141414] uppercase tracking-tight group-hover:text-pink-600 transition-all uppercase">{menu.label}</span>
                          </label>
                       ))}
                    </div>
                 </section>

                 {/* 4. Verification */}
                 <section className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <div className="flex items-center space-x-2 border-b border-gray-200 pb-2">
                       <div className="w-1.5 h-6 bg-red-600 rounded-full"></div>
                       <h3 className="text-sm font-black text-[#141414] uppercase tracking-tight">Verification</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Enter Code</label>
                          <input 
                            required 
                            type="text" 
                            value={verificationInput}
                            onChange={(e) => setVerificationInput(e.target.value)}
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none text-sm font-black uppercase" 
                          />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Generated Code</label>
                          <div className="p-3 bg-gray-100 border border-gray-200 rounded-xl text-lg font-black text-center tracking-[1em] text-gray-400 select-none bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.02)_10px,rgba(0,0,0,0.02)_20px)]">
                             {generatedCode}
                          </div>
                       </div>
                    </div>
                 </section>

                 <div className="flex space-x-3 pt-4">
                    <button type="button" onClick={() => setShowOnboardModal(false)} className="flex-1 py-4 text-sm font-bold text-[#888888] hover:text-[#141414] transition-colors">Cancel</button>
                    <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white text-sm font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">Submit Application</button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Franchise Modal */}
      <AnimatePresence>
        {editingFranchise && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pb-20">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingFranchise(null)}
              className="absolute inset-0 bg-[#141414]/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-[#F0F0F0] flex items-center justify-between bg-blue-600">
                <div>
                   <h2 className="text-xl font-bold text-white">Edit Franchise Details</h2>
                   <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest mt-1">ID: {editingFranchise.id}</p>
                </div>
                <button onClick={() => setEditingFranchise(null)} className="p-2 hover:bg-white/20 text-white rounded-xl transition-colors"><X size={20} /></button>
              </div>
              
              <form onSubmit={handleUpdate} className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                 <section className="space-y-4">
                    <div className="flex items-center space-x-2 border-b border-gray-100 pb-2">
                       <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                       <h3 className="text-sm font-black text-[#141414] uppercase tracking-tight">Basic Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Institute Name</label>
                          <input required type="text" value={editingFranchise.name} onChange={(e) => setEditingFranchise({...editingFranchise, name: e.target.value})} className="w-full p-3 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Contact Number</label>
                          <input required type="tel" value={editingFranchise.contact} onChange={(e) => setEditingFranchise({...editingFranchise, contact: e.target.value})} className="w-full p-3 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm" />
                       </div>
                       <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Address</label>
                          <input required type="text" value={editingFranchise.address} onChange={(e) => setEditingFranchise({...editingFranchise, address: e.target.value})} className="w-full p-3 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm" />
                       </div>
                    </div>
                 </section>

                 <section className="space-y-4">
                    <div className="flex items-center space-x-2 border-b border-gray-100 pb-2">
                       <div className="w-1.5 h-6 bg-emerald-600 rounded-full"></div>
                       <h3 className="text-sm font-black text-[#141414] uppercase tracking-tight">Permissions & Validity</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Validity From</label>
                          <input required type="date" value={editingFranchise.validityFrom || ''} onChange={(e) => setEditingFranchise({...editingFranchise, validityFrom: e.target.value})} className="w-full p-3 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none text-sm" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Validity Up To</label>
                          <input required type="date" value={editingFranchise.validityTo || ''} onChange={(e) => setEditingFranchise({...editingFranchise, validityTo: e.target.value})} className="w-full p-3 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none text-sm" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Login ID</label>
                          <input required type="text" value={editingFranchise.loginId || ''} onChange={(e) => setEditingFranchise({...editingFranchise, loginId: e.target.value})} className="w-full p-3 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none text-sm font-black" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Password</label>
                          <input required type="text" value={editingFranchise.password || ''} onChange={(e) => setEditingFranchise({...editingFranchise, password: e.target.value})} className="w-full p-3 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none text-sm font-black" />
                       </div>
                       <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Revenue Share (%)</label>
                          <input required type="number" value={editingFranchise.revenueSharePercent} onChange={(e) => setEditingFranchise({...editingFranchise, revenueSharePercent: Number(e.target.value)})} className="w-full p-3 bg-[#F5F5F5] border-none rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none text-sm" />
                       </div>
                    </div>
                 </section>

                 {/* Center Menu Permissions (Developer Only) */}
                 <section className="space-y-4 mb-4">
                    <div className="flex items-center space-x-2 border-b border-gray-100 pb-2">
                       <div className="w-1.5 h-6 bg-pink-600 rounded-full"></div>
                       <h3 className="text-sm font-black text-[#141414] uppercase tracking-tight italic text-pink-600">Center Menu Permissions (Developer Only)</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-6 bg-pink-50/30 rounded-3xl border border-pink-100">
                       {AVAILABLE_MENUS.map(menu => (
                          <label key={menu.id} className="flex items-center space-x-3 cursor-pointer group">
                             <input 
                                type="checkbox" 
                                checked={editingFranchise.enabledMenus?.includes(menu.id)} 
                                onChange={(e) => {
                                   const menus = editingFranchise.enabledMenus || [];
                                   if (e.target.checked) {
                                      setEditingFranchise({ ...editingFranchise, enabledMenus: [...menus, menu.id] });
                                   } else {
                                      setEditingFranchise({ ...editingFranchise, enabledMenus: menus.filter(m => m !== menu.id) });
                                   }
                                }}
                                className="w-4 h-4 rounded-md border-gray-300 text-pink-600 focus:ring-pink-500"
                             />
                             <span className="text-[10px] font-black text-[#141414] uppercase tracking-tight group-hover:text-pink-600 transition-all uppercase">{menu.label}</span>
                          </label>
                       ))}
                    </div>
                 </section>

                 <div className="flex space-x-3 pt-4">
                    <button type="button" onClick={() => setEditingFranchise(null)} className="flex-1 py-4 text-sm font-bold text-[#888888] hover:text-[#141414] transition-colors">Cancel</button>
                    <button type="submit" className="flex-[2] py-4 bg-[#141414] text-white text-sm font-bold rounded-2xl hover:bg-[#2A2A2A] transition-all shadow-xl">Update Franchise</button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
