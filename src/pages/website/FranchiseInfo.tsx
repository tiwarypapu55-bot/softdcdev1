/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WebsiteLayout } from '../../components/WebsiteLayout';
import { motion } from 'motion/react';
import { Handshake, TrendingUp, ShieldCheck, Globe, Users, Zap, Mail, Smartphone, ArrowRight, X } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

export const FranchiseInfo = () => {
  const [showApplicationModal, setShowApplicationModal] = React.useState(false);
  const [formData, setFormData] = React.useState({
    instituteName: '',
    directorName: '',
    address: '',
    phone: '',
    mobile: '',
    email: '',
    orgDetails: '',
    block: '',
    state: '',
    district: '',
    pincode: '',
  });

  const [verificationInput, setVerificationInput] = React.useState('');
  const [generatedCode, setGeneratedCode] = React.useState('');

  const generateNewCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGeneratedCode(code);
  };

  React.useEffect(() => {
    generateNewCode();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationInput !== generatedCode) {
      alert('Invalid verification code');
      return;
    }
    alert('Thank you for your detailed application! Our administrator will review your profile and contact you within 48 business hours.');
    setShowApplicationModal(false);
    // Reset form
    setFormData({
      instituteName: '',
      directorName: '',
      address: '',
      phone: '',
      mobile: '',
      email: '',
      orgDetails: '',
      block: '',
      state: '',
      district: '',
      pincode: '',
    });
    setVerificationInput('');
    generateNewCode();
  };

  return (
    <WebsiteLayout>
      <section className="bg-blue-600 text-white py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-8">
           <p className="text-xs font-black text-blue-200 uppercase tracking-widest">Business Partnership</p>
           <h1 className="text-5xl lg:text-8xl font-black tracking-tight leading-none uppercase">Grow With <br/> The Leader</h1>
           <p className="text-xl text-blue-100 font-medium max-w-2xl mx-auto">Open a Softdev Tally Guru center in your city and join India's fastest-growing vocational training network.</p>
           <button 
             onClick={() => setShowApplicationModal(true)}
             className="px-12 py-5 bg-white text-blue-600 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-50 transition-all shadow-2xl shadow-blue-900/20"
           >
             Apply Now
           </button>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
             <h2 className="text-4xl font-black text-[#141414] tracking-tight">WHY FRANCHISE WITH US?</h2>
             <p className="text-[#888888] font-medium max-w-xl mx-auto">We provide the complete ecosystem you need to run a successful, profitable education center from Day 1.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { icon: TrendingUp, title: 'Proven Business Model', desc: 'Over 250+ successful centers running across semi-urban and urban India.' },
              { icon: ShieldCheck, title: 'Institutional Trust', desc: 'Authorized certifications and ISO branding that students trust instantly.' },
              { icon: Globe, title: 'Centralized CRM', desc: 'Full access to our "Classflow" management software for automated billing & academic tracking.' },
              { icon: Users, title: 'Marketing Support', desc: 'Pan-India marketing campaigns and localized digital lead generation support.' },
              { icon: Zap, title: 'Faculty Training', desc: 'Continuous upgrading of your teachers via our central academic board.' },
              { icon: Handshake, title: 'Transparent Payouts', desc: 'Fair revenue sharing model with regular wallet settlement and reporting.' }
            ].map((benefit, i) => (
              <div key={i} className="space-y-6 p-8 bg-background rounded-[3rem] border border-gray-100 hover:border-blue-200 transition-colors group">
                 <div className="p-4 bg-white text-blue-600 rounded-3xl w-fit shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <benefit.icon size={24} />
                 </div>
                 <h4 className="text-lg font-black text-[#141414] uppercase">{benefit.title}</h4>
                 <p className="text-sm text-[#888888] leading-relaxed font-medium">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Onboarding Process */}
      <section className="py-32 bg-[#141414] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                 <h2 className="text-4xl lg:text-6xl font-black tracking-tight leading-none mb-12 uppercase">Become a Partner <br/> In 4 Steps</h2>
                 <div className="space-y-12">
                   {[
                     { step: '01', title: 'Submit Application', desc: 'Fill the inquiry form with your location and investment capacity.' },
                     { step: '02', title: 'Site Inspection', desc: 'Our regional manager visits your location for feasibility check.' },
                     { step: '03', title: 'Legal Formalities', desc: 'Agreement signing and setup of your personalized Classflow dashboard.' },
                     { step: '04', title: 'Inauguration', desc: 'Staff training, marketing launch and official center opening.' }
                   ].map((item, i) => (
                     <div key={i} className="flex items-start space-x-6 relative">
                        <span className="text-3xl font-black text-blue-600 opacity-50">{item.step}</span>
                        <div>
                           <h4 className="text-lg font-black">{item.title}</h4>
                           <p className="text-sm text-gray-400 mt-1 font-medium">{item.desc}</p>
                        </div>
                     </div>
                   ))}
                 </div>
              </div>
              <div id="interest-form" className="bg-white/5 border border-white/10 p-4 rounded-[4rem]">
                 <div className="bg-white rounded-[3.5rem] p-12 text-[#141414]">
                    <h3 className="text-2xl font-black mb-8 uppercase tracking-tight">Express Interest</h3>
                    <form className="space-y-4">
                       <input type="text" placeholder="Your Full Name" className="w-full p-4 bg-background border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium" />
                       <input type="tel" placeholder="Mobile Number" className="w-full p-4 bg-background border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium" />
                       <input type="email" placeholder="Email Address" className="w-full p-4 bg-background border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium" />
                       <input type="text" placeholder="Proposed City" className="w-full p-4 bg-background border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium" />
                       <textarea placeholder="Tell us about your background or requirements..." className="w-full p-4 bg-background border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium min-h-[100px]"></textarea>
                       <button type="button" onClick={() => alert('Interest submitted! For detailed registration, please click Apply Now.')} className="w-full py-5 bg-blue-600 text-white text-[10px] font-bold rounded-2xl uppercase tracking-widest shadow-xl shadow-blue-100/50 hover:bg-blue-700 transition-all">Send Quick Inquiry</button>
                    </form>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Application Modal */}
      <AnimatePresence>
        {showApplicationModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApplicationModal(false)}
              className="absolute inset-0 bg-[#141414]/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl flex flex-col max-h-full overflow-hidden"
            >
              <div className="p-8 lg:px-12 lg:py-10 border-b border-gray-100 flex justify-between items-center bg-background/50">
                <div>
                   <h2 className="text-3xl font-black text-[#141414] uppercase tracking-tight leading-none">Branch Partnership Application</h2>
                   <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-3">SOFTDEV TALLY GURU OFFICIAL ONBOARDING FORM</p>
                </div>
                <button 
                  onClick={() => setShowApplicationModal(false)}
                  className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-red-500 transition-all shadow-sm"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
                <form onSubmit={handleSubmit} className="space-y-12">
                   {/* 1. Personal Information */}
                   <section className="space-y-6">
                      <div className="flex items-center space-x-3">
                         <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                         <h3 className="text-xs font-black text-[#141414] uppercase tracking-widest">Personal Information</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Institute Name</label>
                            <input required type="text" value={formData.instituteName} onChange={(e) => setFormData({...formData, instituteName: e.target.value})} className="w-full p-4 bg-gray-50 border border-transparent focus:border-blue-600 rounded-2xl focus:ring-0 outline-none text-sm font-medium transition-all" placeholder="Full name of institute" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Director's Name</label>
                            <input required type="text" value={formData.directorName} onChange={(e) => setFormData({...formData, directorName: e.target.value})} className="w-full p-4 bg-background border border-transparent focus:border-blue-600 rounded-2xl focus:ring-0 outline-none text-sm font-medium transition-all" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Phone No</label>
                            <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-4 bg-background border border-transparent focus:border-blue-600 rounded-2xl focus:ring-0 outline-none text-sm font-medium transition-all" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Mobile Number</label>
                            <input required type="tel" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} className="w-full p-4 bg-background border border-transparent focus:border-blue-600 rounded-2xl focus:ring-0 outline-none text-sm font-medium transition-all" />
                         </div>
                         <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Email Address</label>
                            <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-4 bg-background border border-transparent focus:border-blue-600 rounded-2xl focus:ring-0 outline-none text-sm font-medium transition-all" />
                         </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 border-dashed">
                            <p className="text-[10px] font-black text-blue-600 uppercase mb-4 tracking-widest">Upload Director Photo</p>
                            <div className="flex items-center space-x-4">
                               <label htmlFor="dir-photo-modal" className="px-6 py-3 bg-white border border-blue-200 rounded-xl text-[10px] font-black cursor-pointer hover:bg-blue-600 hover:text-white transition-all uppercase shadow-sm">Select Image</label>
                               <span className="text-xs text-gray-400 font-medium italic">Max 2MB, JPG/PNG</span>
                            </div>
                            <input type="file" id="dir-photo-modal" className="hidden" />
                         </div>
                         <div className="p-6 bg-purple-50/50 rounded-3xl border border-purple-100 border-dashed">
                            <p className="text-[10px] font-black text-purple-600 uppercase mb-4 tracking-widest">Upload Institute Logo</p>
                            <div className="flex items-center space-x-4">
                               <label htmlFor="inst-logo-modal" className="px-6 py-3 bg-white border border-purple-200 rounded-xl text-[10px] font-black cursor-pointer hover:bg-purple-600 hover:text-white transition-all uppercase shadow-sm">Select Image</label>
                               <span className="text-xs text-gray-400 font-medium italic">Max 2MB, JPG/PNG</span>
                            </div>
                            <input type="file" id="inst-logo-modal" className="hidden" />
                         </div>
                      </div>
                   </section>

                   {/* 2. Organization Information */}
                   <section className="space-y-6">
                      <div className="flex items-center space-x-3">
                         <div className="w-1.5 h-6 bg-emerald-600 rounded-full"></div>
                         <h3 className="text-xs font-black text-[#141414] uppercase tracking-widest">Organization Information</h3>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Organization Details</label>
                         <textarea value={formData.orgDetails} onChange={(e) => setFormData({...formData, orgDetails: e.target.value})} className="w-full p-6 bg-background border border-transparent focus:border-emerald-600 rounded-[2rem] focus:ring-0 outline-none text-sm font-medium transition-all min-h-[120px]" placeholder="Briefly describe your current business, infrastructure, and experience in education..." />
                      </div>
                   </section>

                   {/* 3. Contact Information */}
                   <section className="space-y-6">
                      <div className="flex items-center space-x-3">
                         <div className="w-1.5 h-6 bg-amber-600 rounded-full"></div>
                         <h3 className="text-xs font-black text-[#141414] uppercase tracking-widest">Contact Information</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Office Address / Location</label>
                            <input required type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full p-4 bg-background border border-transparent focus:border-amber-600 rounded-2xl focus:ring-0 outline-none text-sm font-medium transition-all" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Block</label>
                            <input type="text" value={formData.block} onChange={(e) => setFormData({...formData, block: e.target.value})} className="w-full p-4 bg-background border border-transparent focus:border-amber-600 rounded-2xl focus:ring-0 outline-none text-sm font-medium transition-all" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">District</label>
                            <input required type="text" value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value})} className="w-full p-4 bg-gray-50 border border-transparent focus:border-amber-600 rounded-2xl focus:ring-0 outline-none text-sm font-medium transition-all" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">State</label>
                            <input required type="text" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="w-full p-4 bg-gray-50 border border-transparent focus:border-amber-600 rounded-2xl focus:ring-0 outline-none text-sm font-medium transition-all" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Pincode</label>
                            <input required type="text" value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} className="w-full p-4 bg-gray-50 border border-transparent focus:border-amber-600 rounded-2xl focus:ring-0 outline-none text-sm font-medium transition-all" />
                         </div>
                      </div>
                   </section>

                   {/* 4. Verification */}
                   <section className="space-y-6 bg-background p-8 rounded-[2.5rem] border border-gray-100">
                      <div className="flex items-center space-x-3">
                         <div className="w-1.5 h-6 bg-red-600 rounded-full"></div>
                         <h3 className="text-xs font-black text-[#141414] uppercase tracking-widest">Submission Verification</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Type Security Code</label>
                            <input 
                              required 
                              type="text" 
                              value={verificationInput}
                              onChange={(e) => setVerificationInput(e.target.value.toUpperCase())}
                              className="w-full p-5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-600 outline-none text-xl font-black uppercase text-center tracking-[0.2em] shadow-sm transition-all" 
                            />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1 text-right block mr-1">Generated Code</label>
                            <div className="p-5 bg-gray-900 border border-white/10 rounded-2xl text-2xl font-black text-center tracking-[0.6em] text-white select-none shadow-xl relative overflow-hidden group">
                               <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-blue-600/20 transition-all"></div>
                               <span className="relative z-10 font-mono italic opacity-90">{generatedCode}</span>
                            </div>
                         </div>
                      </div>
                   </section>

                   <div className="pt-8">
                      <button type="submit" className="w-full py-6 bg-[#141414] text-white text-xs font-black rounded-[1.5rem] uppercase tracking-widest shadow-2xl hover:bg-blue-600 transform hover:-translate-y-1 transition-all duration-300">Submit Official Application</button>
                      <p className="text-center text-[10px] font-bold text-gray-400 mt-6 uppercase tracking-widest">By submitting, you agree to our Franchise Terms & Institutional Policies.</p>
                   </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Support Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
           <div className="inline-block p-1 bg-gray-100 rounded-full mb-8">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-sm">
                 <Smartphone size={14} className="text-blue-600" />
                 <span className="text-[10px] font-black uppercase tracking-widest">+91 91234 56780</span>
              </div>
           </div>
           <h2 className="text-4xl font-black text-[#141414] mb-4">FRANCHISE SUPPORT DESK</h2>
           <p className="text-sm text-[#888888] font-bold uppercase tracking-widest">Available MON-SAT | 10:00 AM - 6:00 PM</p>
        </div>
      </section>
    </WebsiteLayout>
  );
};
