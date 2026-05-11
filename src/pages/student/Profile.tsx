/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UserCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Camera, 
  ShieldCheck, 
  Edit3,
  Globe,
  Settings,
  Bell,
  Lock,
  ChevronRight,
  Fingerprint,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

export const Profile = () => {
  const { students } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const student = students.find(s => s.id === 's1') || students[0];

  const [formData, setFormData] = useState({
    name: student?.name || 'Rahul Kumar',
    email: 'rahul.k@stg.com',
    phone: '+91 98765 00000',
    dob: '15 March 2004',
    citizenship: 'India',
    address: 'Mumbai, Maharashtra, IND',
  });

  const handleUpdate = () => {
    if (isEditing) {
      // Simulate save
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const fields = [
    { label: 'Full Legal Name', value: formData.name, key: 'name', icon: UserCircle },
    { label: 'Registered Email', value: formData.email, key: 'email', icon: Mail },
    { label: 'Mobile Number', value: formData.phone, key: 'phone', icon: Phone },
    { label: 'Date of Birth', value: formData.dob, key: 'dob', icon: Calendar },
    { label: 'Citizenship', value: formData.citizenship, key: 'citizenship', icon: Globe },
    { label: 'Permanent Address', value: formData.address, key: 'address', icon: MapPin },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-20">
      <div className="relative">
         {/* Cover Banner */}
         <div className="h-48 rounded-[3rem] bg-gradient-to-r from-[#071d41] via-blue-900 to-indigo-900 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-600/20 blur-3xl rounded-full"></div>
         </div>

         {/* Profile Info Overlay */}
         <div className="px-10 -mt-16 flex flex-col md:flex-row items-end gap-8 relative z-10">
            <div className="relative group">
               <div className="w-40 h-40 rounded-[2.5rem] bg-white p-2 shadow-2xl">
                  <div className="w-full h-full rounded-[2.2rem] bg-gray-50 flex items-center justify-center p-1 border border-gray-100 overflow-hidden relative">
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student?.id}`} className="w-full h-full rounded-[2rem]" alt="Profile" />
                     <button className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                        <Camera size={24} />
                     </button>
                  </div>
               </div>
               <div className="absolute top-4 right-4 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center shadow-lg"></div>
            </div>

            <div className="flex-1 pb-4">
               <div className="flex items-center space-x-3">
                  <h1 className="text-4xl font-black text-[#141414] tracking-tight uppercase italic">{formData.name}</h1>
                  <ShieldCheck className="text-blue-600" size={24} />
               </div>
               <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                  <Fingerprint size={12} />
                  Student ID: {student?.id}
               </p>
            </div>

            <div className="flex items-center gap-3 pb-8">
               <button 
                onClick={handleUpdate}
                className={clsx(
                  "px-6 py-3 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all flex items-center gap-2 shadow-xl shadow-black/10",
                  isEditing ? "bg-emerald-600 hover:bg-emerald-700" : "bg-[#141414] hover:bg-blue-600"
                )}
               >
                  {isEditing ? <CheckCircle2 size={14} /> : <Edit3 size={14} />}
                  <span>{isEditing ? 'Save Changes' : 'Update Profile'}</span>
               </button>
               <button className="p-3 bg-white border border-gray-200 text-[#141414] rounded-2xl hover:bg-gray-50 transition-all shadow-sm">
                  <Settings size={20} />
               </button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl space-y-10 group">
               <div className="border-b border-gray-50 pb-6 flex items-center justify-between">
                  <div>
                     <h3 className="text-xl font-black text-[#141414] uppercase tracking-tight">Personal Information</h3>
                     <p className="text-[10px] text-[#888888] font-bold uppercase tracking-widest mt-1">Official Data Records</p>
                  </div>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Lock size={20} /></div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
                  {fields.map((field) => (
                    <div key={field.key} className="space-y-2 group/field">
                       <div className="flex items-center space-x-2 text-[#888888]">
                          <field.icon size={12} className="group-hover/field:text-blue-600 transition-colors" />
                          <label className="text-[9px] font-black uppercase tracking-widest leading-none">{field.label}</label>
                       </div>
                       {isEditing ? (
                         <input 
                           type="text"
                           value={field.value}
                           onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                           className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm font-black text-[#141414] focus:ring-2 focus:ring-blue-100 outline-none"
                         />
                       ) : (
                         <p className="text-sm font-black text-[#141414] uppercase pl-5 group-hover/field:translate-x-1 transition-transform">{field.value}</p>
                       )}
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-[#141414] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -mr-32 -mt-32 transition-all group-hover:bg-blue-600/20"></div>
               <div className="relative z-10">
                  <h3 className="text-xl font-black uppercase tracking-tight mb-8">Academic Standing</h3>
                  <div className="space-y-6">
                     <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all cursor-pointer">
                        <div className="flex items-center space-x-4">
                           <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                              <UserCircle size={24} />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Selected Course</p>
                              <p className="text-lg font-black uppercase tracking-tight mt-0.5">{student?.course}</p>
                           </div>
                        </div>
                        <ChevronRight size={18} className="text-white/20" />
                     </div>

                     <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem]">
                           <div className="flex items-center justify-between mb-4">
                              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Attendance</p>
                              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                           </div>
                           <p className="text-3xl font-black tracking-tighter">92.4%</p>
                        </div>
                        <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem]">
                           <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4 text-left">Academic Rank</p>
                           <p className="text-3xl font-black tracking-tighter text-left">Gold Master</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl group">
               <h3 className="text-lg font-black text-[#141414] uppercase tracking-tight mb-8">Account Policy</h3>
               <div className="space-y-6">
                  {[
                    { label: 'Notifications', icon: Bell, active: true },
                    { label: 'Two-Factor Auth', icon: ShieldCheck, active: true },
                    { label: 'Public Profile', icon: Globe, active: false },
                  ].map((set, i) => (
                    <div key={i} className="flex items-center justify-between group/item">
                       <div className="flex items-center space-x-4">
                          <div className={clsx(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                            set.active ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-400"
                          )}>
                             <set.icon size={18} />
                          </div>
                          <span className="text-[10px] font-black text-[#141414] uppercase tracking-widest">{set.label}</span>
                       </div>
                       <div className={clsx(
                         "w-10 h-5 rounded-full relative p-1 transition-all cursor-pointer",
                         set.active ? "bg-blue-600" : "bg-gray-200"
                       )}>
                          <div className={clsx(
                            "w-3 h-3 bg-white rounded-full transition-all",
                            set.active ? "ml-auto" : "ml-0"
                          )}></div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-orange-50 p-10 rounded-[3rem] border border-orange-100 shadow-lg group relative overflow-hidden">
               <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-orange-200/50 rounded-full blur-2xl transition-transform group-hover:scale-110"></div>
               <h3 className="text-lg font-black text-orange-950 uppercase tracking-tight mb-4 flex items-center gap-2">
                  <AlertCircle size={18} />
                  Verification Limit
               </h3>
               <p className="text-[10px] text-orange-900/60 font-bold uppercase leading-relaxed mb-6">
                  Your profile details are locked while verification is in progress. 
                  Contact admin for any critical overrides.
               </p>
               <button className="w-full py-4 bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-orange-700 transition-all shadow-xl shadow-orange-500/20">
                  Request Access
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

const AlertCircle = ({ size, className }: any) => (
   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
   </svg>
);
