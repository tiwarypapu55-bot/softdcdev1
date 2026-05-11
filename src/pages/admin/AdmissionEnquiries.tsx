import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MessageSquare,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { AdmissionEnquiry } from '../../types';

export const AdmissionEnquiries = () => {
  const { enquiries, updateEnquiry, deleteEnquiry } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedEnquiry, setSelectedEnquiry] = useState<AdmissionEnquiry | null>(null);

  const filteredEnquiries = enquiries.filter(e => {
    const matchesSearch = 
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.phone.includes(searchTerm) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'FOLLOWED_UP': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ENROLLED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'CLOSED': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleStatusUpdate = (id: string, status: AdmissionEnquiry['status']) => {
    updateEnquiry(id, { status });
    if (selectedEnquiry?.id === id) {
      setSelectedEnquiry(prev => prev ? { ...prev, status } : null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#141414] uppercase tracking-tighter">Admission Enquiries</h1>
          <p className="text-sm font-bold text-[#888888] uppercase tracking-widest mt-1">Manage leads and student inquiries</p>
        </div>
        
        <div className="flex items-center space-x-4">
           <div className="flex items-center bg-white border border-gray-100 rounded-2xl px-4 py-2 shadow-sm">
              <Search size={18} className="text-[#888888]" />
              <input 
                type="text" 
                placeholder="Search leads..." 
                className="bg-transparent border-none outline-none text-sm ml-2 w-48 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex items-center bg-white border border-gray-100 rounded-2xl px-4 py-2 shadow-sm">
              <Filter size={18} className="text-[#888888]" />
              <select 
                className="bg-transparent border-none outline-none text-sm ml-2 font-black uppercase tracking-tight"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="FOLLOWED_UP">Followed Up</option>
                <option value="ENROLLED">Enrolled</option>
                <option value="CLOSED">Closed</option>
              </select>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         {/* Enquiries List */}
         <div className="xl:col-span-2 space-y-4">
            {filteredEnquiries.length === 0 ? (
              <div className="p-20 bg-white border border-dashed border-gray-200 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-4">
                 <div className="p-6 bg-gray-50 rounded-full text-gray-300">
                    <MessageSquare size={48} />
                 </div>
                 <div>
                    <h3 className="text-lg font-black text-[#141414] uppercase">No Enquiries Found</h3>
                    <p className="text-sm text-[#888888] font-medium">Try adjusting your search or filters.</p>
                 </div>
              </div>
            ) : (
              filteredEnquiries.map(enquiry => (
                <motion.div 
                  key={enquiry.id}
                  layoutId={enquiry.id}
                  onClick={() => setSelectedEnquiry(enquiry)}
                  className={`p-6 bg-white border rounded-[2rem] transition-all cursor-pointer group flex items-center justify-between ${selectedEnquiry?.id === enquiry.id ? 'border-blue-600 ring-4 ring-blue-50' : 'border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/5'}`}
                >
                   <div className="flex items-center space-x-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${getStatusColor(enquiry.status).split(' ')[0]} ${getStatusColor(enquiry.status).split(' ')[1]}`}>
                         {enquiry.name.charAt(0)}
                      </div>
                      <div className="space-y-1">
                         <div className="flex items-center space-x-3">
                            <h3 className="font-black text-[#141414] uppercase tracking-tight">{enquiry.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusColor(enquiry.status)}`}>
                               {enquiry.status.replace('_', ' ')}
                            </span>
                         </div>
                         <div className="flex items-center space-x-4 text-[10px] font-bold text-[#888888] uppercase tracking-widest">
                            <span className="flex items-center space-x-1"><Phone size={10} /> <span>{enquiry.phone}</span></span>
                            <span className="flex items-center space-x-1"><Calendar size={10} /> <span>{new Date(enquiry.createdAt).toLocaleDateString()}</span></span>
                         </div>
                         <p className="text-xs font-medium text-blue-600 mt-1">Interested in: {enquiry.course}</p>
                      </div>
                   </div>
                   <div className="flex items-center space-x-4">
                      <button className="p-3 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                         <ArrowUpRight size={18} />
                      </button>
                   </div>
                </motion.div>
              ))
            )}
         </div>

         {/* Enquiry Detail Sidebar */}
         <div className="space-y-8">
            <AnimatePresence mode="wait">
               {selectedEnquiry ? (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-8 bg-white border border-gray-100 rounded-[3rem] shadow-xl space-y-8 sticky top-8"
                  >
                     <div className="flex items-center justify-between">
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-[#888888] uppercase tracking-[0.2em]">Lead Information</p>
                           <h2 className="text-2xl font-black text-[#141414] uppercase tracking-tighter">{selectedEnquiry.name}</h2>
                        </div>
                        <button onClick={() => setSelectedEnquiry(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"><XCircle size={20} /></button>
                     </div>

                     <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-4">
                           <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                              <div className="p-3 bg-white text-blue-600 rounded-xl shadow-sm"><Mail size={20} /></div>
                              <div>
                                 <p className="text-[8px] font-black text-[#888888] uppercase">Email Address</p>
                                 <p className="text-sm font-bold text-[#141414]">{selectedEnquiry.email}</p>
                              </div>
                           </div>
                           <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                              <div className="p-3 bg-white text-emerald-600 rounded-xl shadow-sm"><Phone size={20} /></div>
                              <div>
                                 <p className="text-[8px] font-black text-[#888888] uppercase">Phone Number</p>
                                 <p className="text-sm font-bold text-[#141414]">{selectedEnquiry.phone}</p>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-3">
                           <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest px-1">Lead Status</p>
                           <div className="grid grid-cols-2 gap-2">
                              {['PENDING', 'FOLLOWED_UP', 'ENROLLED', 'CLOSED'].map((status) => (
                                 <button 
                                   key={status}
                                   onClick={() => handleStatusUpdate(selectedEnquiry.id, status as any)}
                                   className={`py-3 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${selectedEnquiry.status === status ? 'bg-[#141414] text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                                 >
                                    {status.replace('_', ' ')}
                                 </button>
                              ))}
                           </div>
                        </div>

                        <div className="space-y-3">
                           <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest px-1">Course Interest</p>
                           <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                              <p className="text-xs font-black text-blue-600 uppercase tracking-tight">{selectedEnquiry.course}</p>
                           </div>
                        </div>

                        <div className="space-y-3">
                           <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest px-1">Message / Requirements</p>
                           <div className="p-5 bg-gray-50 border border-gray-100 rounded-2xl">
                              <p className="text-xs text-[#141414] font-medium leading-relaxed italic">"{selectedEnquiry.message}"</p>
                           </div>
                        </div>

                        <div className="flex items-center justify-between pt-4">
                           <button 
                            onClick={() => deleteEnquiry(selectedEnquiry.id)}
                            className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline"
                           >
                            Delete Lead
                           </button>
                           <div className="flex items-center space-x-2 text-[8px] font-bold text-[#888888] uppercase">
                              <Clock size={10} />
                              <span>Last Updated: {new Date(selectedEnquiry.createdAt).toLocaleString()}</span>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               ) : (
                  <div className="p-12 border-4 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center text-center opacity-40">
                     <ArrowUpRight size={48} className="text-gray-300 mb-4" />
                     <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest leading-relaxed">Select an enquiry to view full details and manage the lead lifecycle</p>
                  </div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
};
