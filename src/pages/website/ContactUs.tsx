/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WebsiteLayout } from '../../components/WebsiteLayout';
import { motion } from 'motion/react';
import { MapPin, Smartphone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { EnquiryForm } from '../../components/EnquiryForm';
import { useApp } from '../../context/AppContext';

export const ContactUs = () => {
  const { businessProfile } = useApp();

  return (
    <WebsiteLayout>
      <section className="bg-background py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
           <div className="max-w-2xl space-y-4">
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Connect With Us</p>
              <h1 className="text-5xl font-black text-[#141414] tracking-tight uppercase leading-none">Let's Build Your <br/> Future Together</h1>
              <p className="text-[#888888] font-medium leading-relaxed">Have questions about our courses, certifications, or franchise opportunities? Our team of experts is here to help you.</p>
           </div>
        </div>
      </section>

      <section className="py-24">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
               {/* Contact Form */}
                <div className="lg:col-span-2 space-y-12">
                  <div className="space-y-4">
                     <h3 className="text-2xl font-black text-[#141414] uppercase tracking-tight">Admission Inquiry</h3>
                     <p className="text-sm text-[#888888] font-medium">Interested in a course? Send us an inquiry and our counselors will guide you.</p>
                  </div>
                  <EnquiryForm />
               </div>

               {/* Info Sidebar */}
               <div className="space-y-12">
                  <div className="p-10 bg-blue-600 rounded-[3rem] text-white space-y-12 shadow-2xl shadow-blue-100">
                     <h3 className="text-xl font-black uppercase tracking-tight">Contact Information</h3>
                     
                     <div className="space-y-10">
                        <div className="flex items-start space-x-6">
                           <div className="p-3 bg-white/10 rounded-2xl"><MapPin size={24} /></div>
                           <div>
                              <h4 className="text-sm font-black uppercase mb-1">Head Office</h4>
                              <p className="text-sm text-blue-100 font-medium leading-relaxed">{businessProfile.address}</p>
                           </div>
                        </div>
                        {businessProfile.regionalAddress && (
                          <div className="flex items-start space-x-6">
                             <div className="p-3 bg-white/10 rounded-2xl"><MapPin size={24} /></div>
                             <div>
                                <h4 className="text-sm font-black uppercase mb-1">Regional Office</h4>
                                <p className="text-sm text-blue-100 font-medium leading-relaxed">{businessProfile.regionalAddress}</p>
                             </div>
                          </div>
                        )}
                        <div className="flex items-start space-x-6">
                           <div className="p-3 bg-white/10 rounded-2xl"><Smartphone size={24} /></div>
                           <div>
                              <h4 className="text-sm font-black uppercase mb-1">Call Support</h4>
                              <p className="text-sm text-blue-100 font-medium">{businessProfile.phone}</p>
                           </div>
                        </div>
                        <div className="flex items-start space-x-6">
                           <div className="p-3 bg-white/10 rounded-2xl"><Mail size={24} /></div>
                           <div>
                              <h4 className="text-sm font-black uppercase mb-1">Email Us</h4>
                              <p className="text-sm text-blue-100 font-medium underline">{businessProfile.email}</p>
                           </div>
                        </div>
                     </div>

                     <div className="pt-10 border-t border-white/20">
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-6">Social Connect</p>
                        <div className="flex items-center space-x-6">
                           <Facebook size={20} className="hover:text-black cursor-pointer transition-all" />
                           <Twitter size={20} className="hover:text-black cursor-pointer transition-all" />
                           <Instagram size={20} className="hover:text-black cursor-pointer transition-all" />
                           <Linkedin size={20} className="hover:text-black cursor-pointer transition-all" />
                        </div>
                     </div>
                  </div>

                  <div className="p-10 bg-background rounded-[3rem] border border-gray-100 space-y-6">
                     <div className="flex items-center space-x-3 text-[#141414]">
                        <Clock size={20} />
                        <h4 className="text-sm font-black uppercase">Business Hours</h4>
                     </div>
                     <div className="space-y-3 text-xs font-bold text-[#888888] uppercase tracking-widest">
                        <div className="flex justify-between">
                           <span>Mon - Fri</span>
                           <span className="text-[#141414]">09:00 - 18:00</span>
                        </div>
                        <div className="flex justify-between">
                           <span>Saturday</span>
                           <span className="text-[#141414]">10:00 - 16:00</span>
                        </div>
                        <div className="flex justify-between text-red-500">
                           <span>Sunday</span>
                           <span>Closed</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Map Placeholder */}
      <section className="h-[400px] bg-gray-200">
         <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-50 flex items-center justify-center">
            <div className="p-6 bg-white rounded-3xl shadow-2xl flex items-center space-x-4 border border-gray-100">
               <MapPin size={24} className="text-red-600" />
               <p className="text-sm font-black text-[#141414] uppercase tracking-tight">Open in Google Maps</p>
            </div>
         </div>
      </section>
    </WebsiteLayout>
  );
};
