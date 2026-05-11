/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WebsiteLayout } from '../../components/WebsiteLayout';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserPlus, ShieldCheck, FileCheck, History, Search, ArrowRight, Loader2, CheckCircle2, AlertCircle, Download, FileText } from 'lucide-react';
import { clsx } from 'clsx';

type TabType = 'registration' | 'student-verify' | 'cert-verify' | 'old-cert-verify';

export const StudentZone = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const activeTab = (queryParams.get('tab') as TabType) || 'registration';

  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<{ status: 'success' | 'error'; message: string } | null>(null);

  const handleTabChange = (tab: TabType) => {
    navigate(`/student-zone?tab=${tab}`);
    setResult(null);
  };

  const handleAutomatedAction = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    // Simulate automated/synchronized process
    setTimeout(() => {
      setIsLoading(false);
      setResult({
        status: 'success',
        message: 'Request processed successfully. Details have been synchronized with our central database.'
      });
    }, 2000);
  };

  const tabs = [
    { id: 'registration', label: 'Online Registration', icon: UserPlus },
    { id: 'student-verify', label: 'Student Verification', icon: ShieldCheck },
    { id: 'cert-verify', label: 'Certificate Verification', icon: FileCheck },
    { id: 'old-cert-verify', label: 'Old Student Verification', icon: History },
  ];

  return (
    <WebsiteLayout>
      {/* Header */}
      <section className="bg-transparent py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[130px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
           <div className="max-w-2xl space-y-4 text-center mx-auto">
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest text-center">Digital Portal</p>
              <h1 className="text-5xl font-black text-[#141414] tracking-tight uppercase leading-none">Student Zone</h1>
              <p className="text-slate-600 font-medium leading-relaxed">Access automated services for registration, verification, and academic records.</p>
           </div>
        </div>
      </section>

      <section className="py-24 bg-transparent min-h-[600px]">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-12">
               {/* Sidebar Tabs */}
               <div className="lg:w-1/3 space-y-3">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id as TabType)}
                      className={clsx(
                        "w-full flex items-center space-x-4 p-5 rounded-2xl transition-all text-left uppercase tracking-widest font-black text-xs",
                        activeTab === tab.id 
                          ? "bg-[#141414] text-white shadow-xl shadow-black/10" 
                          : "bg-background text-[#888888] hover:bg-gray-100"
                      )}
                    >
                      <tab.icon size={20} />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                  
                  <div className="p-8 bg-blue-50 rounded-3xl mt-8 space-y-4">
                     <div className="flex items-center space-x-2 text-blue-600">
                        <FileText size={16} />
                        <h4 className="text-xs font-black uppercase tracking-widest">New Prospectus 2026</h4>
                     </div>
                     <p className="text-xs text-blue-900/60 font-medium leading-relaxed">Download our latest prospectus to explore course details and institutional policies.</p>
                     <button 
                       onClick={() => window.open('#', '_blank')}
                       className="w-full py-4 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20"
                     >
                       <Download size={14} />
                       <span>Download Prospectus</span>
                     </button>
                  </div>

                  <div className="p-8 bg-background rounded-3xl mt-4 space-y-4">
                     <h4 className="text-xs font-black text-[#888888] uppercase tracking-widest">Need Help?</h4>
                     <p className="text-xs text-[#888888]/60 font-medium leading-relaxed">Our automated system synchronizes with the National Database every 15 minutes. For immediate support, contact your local branch.</p>
                  </div>
               </div>

               {/* Form Content */}
               <div className="lg:w-2/3 bg-background/50 rounded-[3rem] p-8 lg:p-16 border border-gray-100">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-12"
                    >
                      <div className="space-y-4">
                         <h2 className="text-3xl font-black text-[#141414] uppercase tracking-tight">
                            {tabs.find(t => t.id === activeTab)?.label}
                         </h2>
                         <p className="text-sm text-[#888888] font-medium leading-relaxed">
                            {activeTab === 'registration' && 'Complete the form below to register yourself for our elite technical courses.'}
                            {activeTab === 'student-verify' && 'Enter your Student ID to verify current enrollment status.'}
                            {activeTab === 'cert-verify' && 'Verify the authenticity of digital certificates using the unique Certificate ID.'}
                            {activeTab === 'old-cert-verify' && 'Request verification for certificates issued before the digital system (2010-2020).'}
                         </p>
                      </div>

                      <form onSubmit={handleAutomatedAction} className="space-y-8">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {activeTab === 'registration' && (
                               <>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Full Name</label>
                                    <input required type="text" className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-medium" placeholder="E.g. Rahul Sharma" />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Email</label>
                                    <input required type="email" className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-medium" placeholder="rahul@example.com" />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Select Course</label>
                                    <select className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-medium text-sm">
                                       <option>Tally Prime with GST</option>
                                       <option>Advanced Excel</option>
                                       <option>Office Automation (DCA)</option>
                                       <option>Software Development</option>
                                    </select>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Branch Code</label>
                                    <input required type="text" className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-medium" placeholder="E.g. DEL01" />
                                 </div>
                               </>
                            )}

                            {(activeTab === 'student-verify' || activeTab === 'cert-verify' || activeTab === 'old-cert-verify') && (
                               <div className="space-y-2 md:col-span-2">
                                 <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">
                                    {activeTab === 'student-verify' ? 'Student Registration ID' : 'Certificate Number'}
                                 </label>
                                 <div className="flex space-x-3">
                                    <input required type="text" className="flex-1 p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-black uppercase tracking-widest" placeholder="E.g. ST-2026-XXXX" />
                                    <button type="submit" disabled={isLoading} className="px-8 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center">
                                       {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Search size={24} />}
                                    </button>
                                 </div>
                               </div>
                            )}
                         </div>

                         {activeTab === 'registration' && (
                           <button type="submit" disabled={isLoading} className="w-full py-5 bg-[#141414] text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-black/10 flex items-center justify-center space-x-3">
                              {isLoading ? (
                                <Loader2 size={18} className="animate-spin" />
                              ) : (
                                <>
                                  <span>Submit Digital Registration</span>
                                  <ArrowRight size={16} />
                                </>
                              )}
                           </button>
                         )}
                      </form>

                      {result && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={clsx(
                            "p-6 rounded-3xl flex items-start space-x-4",
                            result.status === 'success' ? "bg-emerald-50 border border-emerald-100" : "bg-red-50 border border-red-100"
                          )}
                        >
                           {result.status === 'success' ? (
                             <CheckCircle2 className="text-emerald-500 mt-1 flex-shrink-0" size={24} />
                           ) : (
                             <AlertCircle className="text-red-500 mt-1 flex-shrink-0" size={24} />
                           )}
                           <div className="space-y-1">
                              <h4 className={clsx(
                                "text-sm font-black uppercase tracking-tight",
                                result.status === 'success' ? "text-emerald-900" : "text-red-900"
                              )}>
                                {result.status === 'success' ? 'Process Synchronized' : 'Process Error'}
                              </h4>
                              <p className={clsx(
                                "text-sm font-medium",
                                result.status === 'success' ? "text-emerald-700" : "text-red-700"
                              )}>{result.message}</p>
                           </div>
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>
               </div>
            </div>
         </div>
      </section>
    </WebsiteLayout>
  );
};
