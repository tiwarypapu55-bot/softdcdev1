/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  BadgeCheck, 
  Save, 
  Image as ImageIcon,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Users,
  Clock,
  Info,
  X,
  Upload,
  Database,
  Download,
  RefreshCcw,
  ShieldCheck,
  Settings,
  MousePointer2,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BusinessProfile as BusinessProfileType } from '../../types';
import { clsx } from 'clsx';
import { compressImage, downloadFile } from '../../lib/storage';

export const BusinessProfile = () => {
  const { businessProfile, updateBusinessProfile, clearData } = useApp();
  const [isSaving, setIsSaving] = useState(false);
  const [activeModal, setActiveModal] = useState<'signature' | 'backup' | 'logo' | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const headerInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const prospectusInputRef = useRef<HTMLInputElement>(null);
  const directorPhotoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const aboutUsInputRef = useRef<HTMLInputElement>(null);
  const contactUsInputRef = useRef<HTMLInputElement>(null);
  const featuredCoursesInputRef = useRef<HTMLInputElement>(null);
  const successStoriesInputRef = useRef<HTMLInputElement>(null);
  const receiptHeaderInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const [formData, setFormData] = React.useState(businessProfile);

  React.useEffect(() => {
    setFormData(businessProfile);
  }, [businessProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateBusinessProfile(formData);
      alert('Business Profile saved and synchronized successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save Business Profile changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string, 512, 0.7, 'image/jpeg');
        setFormData(prev => ({ ...prev, logoUrl: compressed }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeaderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        // Headers are typically wider, so we compress with a larger width but lower quality to save space
        const compressed = await compressImage(reader.result as string, 1200, 0.6, 'image/jpeg');
        setFormData(prev => ({ ...prev, headerImageUrl: compressed }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReceiptHeaderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string, 1200, 0.6, 'image/jpeg');
        setFormData(prev => ({ ...prev, receiptHeaderUrl: compressed }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string, 400, 0.8);
        setFormData(prev => ({ ...prev, signatureUrl: compressed }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDirectorPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string, 400, 0.7);
        setFormData(prev => ({ ...prev, directorPhotoUrl: compressed }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileList = Array.from(files);
      fileList.forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const compressed = await compressImage(reader.result as string, 1600, 0.6);
          setFormData(prev => ({
            ...prev,
            banners: [...(prev.banners || []), compressed]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileList = Array.from(files);
      fileList.forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const compressed = await compressImage(reader.result as string, 1200, 0.6);
          setFormData(prev => ({
            ...prev,
            gallery: [...(prev.gallery || []), { 
              id: Math.random().toString(36).substr(2, 9), 
              url: compressed,
              caption: 'New Gallery Image'
            }]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleExtraImageUrlUpload = (field: keyof BusinessProfileType, width: number = 1200) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string, width, 0.6);
        setFormData(prev => ({ ...prev, [field]: compressed }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProspectusUpload = (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const size = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      setFormData({
        ...formData,
        prospectus: {
          name: file.name,
          size: size,
          url: reader.result as string,
          version: `v${new Date().getFullYear()}.${new Date().getMonth() + 1}.0`
        }
      });
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleProspectusUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleProspectusUpload(file);
  };

  const handleManualBackup = () => {
    setIsBackingUp(true);
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href",     dataStr);
      downloadAnchorNode.setAttribute("download", `business_profile_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      
      setTimeout(() => {
        setIsBackingUp(false);
      }, 1000);
    } catch (error) {
      console.error('Backup failed:', error);
      setIsBackingUp(false);
      alert('Backup failed. Storage might be too large.');
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target?.result as string);
          setFormData(importedData);
          alert('Backup data loaded into form. Please click "Save Profile" to apply changes.');
        } catch (error) {
          alert('Invalid backup file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#141414] tracking-tight">Business Profile</h1>
          <p className="text-sm text-[#888888] font-mono">Configure your institute's public identity & settings</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-2 px-8 py-3 bg-[#141414] text-white rounded-2xl hover:bg-blue-600 transition-all font-black uppercase tracking-widest text-[10px] shadow-xl shadow-black/10"
        >
          {isSaving ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <Save size={16} />
            </motion.div>
          ) : <Save size={16} />}
          <span>{isSaving ? 'Saving Changes...' : 'Save Profile'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8 pb-20">
        {/* Basic Information */}
        <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex items-center space-x-3">
            <Building2 className="text-blue-600" size={20} />
            <h2 className="text-xs font-black uppercase tracking-widest text-[#141414]">Basic Information</h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Institute Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Legal Entity Name</label>
              <input type="text" value={formData.legalName} onChange={(e) => setFormData({...formData, legalName: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">ISO Certification No.</label>
              <input type="text" value={formData.isoNo} onChange={(e) => setFormData({...formData, isoNo: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Registration Number</label>
              <input type="text" value={formData.regNo} onChange={(e) => setFormData({...formData, regNo: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
            </div>
          </div>
        </section>

        {/* Contact Details */}
        <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex items-center space-x-3">
            <Phone className="text-emerald-600" size={20} />
            <h2 className="text-xs font-black uppercase tracking-widest text-[#141414]">Contact Details</h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Contact Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Head Office Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Regional Office Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" value={formData.regionalAddress || ''} onChange={(e) => setFormData({...formData, regionalAddress: e.target.value})} className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
              </div>
            </div>
            <div className="space-y-2 md:col-span-1">
              <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Pin Code</label>
              <input type="text" value={formData.pincode || ''} onChange={(e) => setFormData({...formData, pincode: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" placeholder="E.g. 272001" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Website URL</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Working Hours</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" value={formData.workingHours} onChange={(e) => setFormData({...formData, workingHours: e.target.value})} className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
              </div>
            </div>
          </div>
        </section>

        {/* Branding & Media */}
        <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex items-center space-x-3">
            <ImageIcon className="text-purple-600" size={20} />
            <h2 className="text-xs font-black uppercase tracking-widest text-[#141414]">Branding & Media</h2>
          </div>
          <div className="p-8 space-y-8">
            <div className="flex items-center space-x-8">
               <div 
                 onClick={() => logoInputRef.current?.click()}
                 className="w-32 h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center text-gray-400 hover:border-blue-600 hover:text-blue-600 transition-all cursor-pointer relative overflow-hidden group"
               >
                  {formData.logoUrl ? (
                    <img src={formData.logoUrl} alt="Logo Preview" className="w-full h-full object-contain" />
                  ) : (
                    <>
                      <ImageIcon size={32} />
                      <span className="text-[9px] font-black uppercase tracking-widest mt-2">Update Logo</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={logoInputRef} 
                    onChange={handleLogoUpload} 
                    className="hidden" 
                    accept="image/*"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Upload className="text-white" size={24} />
                  </div>
               </div>
               <div className="flex-1 space-y-4">
                  <h4 className="text-sm font-black text-[#141414] uppercase tracking-tight">Institute Logo</h4>
                  <p className="text-xs text-[#888888] font-medium leading-relaxed">Recommended size 512x512px. Transparent PNG or SVG preferred. This logo will appear on all digital certificates and reports.</p>
                  <div className="flex space-x-3">
                     <button 
                       type="button"
                       onClick={() => setFormData({ ...formData, logoUrl: '' })}
                       className="px-6 py-2 bg-gray-100 text-[#141414] text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all"
                     >
                       Remove
                     </button>
                     <button 
                       type="button"
                       onClick={() => logoInputRef.current?.click()}
                       className="px-6 py-2 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                     >
                       Replace
                     </button>
                  </div>
               </div>
            </div>

            <div className="pt-8 border-t border-gray-100 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                   <h4 className="text-sm font-black text-[#141414] uppercase tracking-tight">Receipt Header Image</h4>
                   <p className="text-xs text-[#888888] font-medium leading-relaxed">This image will appear at the very top of all fee receipts. Best if pre-designed with logo & address.</p>
                </div>
                 <button 
                  type="button"
                  onClick={() => receiptHeaderInputRef.current?.click()}
                  className="px-6 py-2 bg-purple-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20"
                >
                  {formData.receiptHeaderUrl ? 'Replace Header' : 'Upload Header'}
                </button>
                <input 
                  type="file" 
                  ref={receiptHeaderInputRef} 
                  onChange={handleReceiptHeaderUpload} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>

              {formData.receiptHeaderUrl ? (
                <div className="relative group rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                  <img src={formData.receiptHeaderUrl} alt="Header Preview" className="w-full h-auto max-h-48 object-contain mx-auto" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity space-x-4">
                    <button 
                      type="button" 
                      onClick={() => receiptHeaderInputRef.current?.click()}
                      className="p-3 bg-white text-[#141414] rounded-full shadow-xl hover:scale-110 transition-transform"
                    >
                      <Upload size={20} />
                    </button>
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, receiptHeaderUrl: '' })}
                      className="p-3 bg-red-600 text-white rounded-full shadow-xl hover:scale-110 transition-transform"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => receiptHeaderInputRef.current?.click()}
                  className="w-full h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-blue-600 hover:text-blue-600 transition-all cursor-pointer"
                >
                  <ImageIcon size={32} />
                  <span className="text-[10px] font-black uppercase tracking-widest mt-2">No custom header uploaded</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-gray-100">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Facebook Profile</label>
                  <div className="relative">
                    <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
                    <input type="text" value={formData.facebookUrl || ''} onChange={(e) => setFormData({...formData, facebookUrl: e.target.value})} className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" placeholder="URL" />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Instagram Profile</label>
                  <div className="relative">
                    <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-600" size={18} />
                    <input type="text" value={formData.instagramUrl || ''} onChange={(e) => setFormData({...formData, instagramUrl: e.target.value})} className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" placeholder="URL" />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">LinkedIn Page</label>
                  <div className="relative">
                    <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-700" size={18} />
                    <input type="text" value={formData.linkedinUrl || ''} onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})} className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" placeholder="URL" />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Twitter (X)</label>
                  <div className="relative">
                    <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 text-[#141414]" size={18} />
                    <input type="text" value={formData.twitterUrl || ''} onChange={(e) => setFormData({...formData, twitterUrl: e.target.value})} className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" placeholder="URL" />
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Global Settings */}
        <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex items-center space-x-3">
            <Info className="text-orange-600" size={20} />
            <h2 className="text-xs font-black uppercase tracking-widest text-[#141414]">Policy & Disclaimers</h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Short Mission Statement (Footer)</label>
              <textarea value={formData.mission} onChange={(e) => setFormData({...formData, mission: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-medium text-sm min-h-[100px]"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 space-y-4">
                  <div className="flex items-center space-x-3 text-blue-600">
                     <BadgeCheck size={20} />
                     <h4 className="text-xs font-black uppercase tracking-widest">Digital Signatures</h4>
                  </div>
                  <p className="text-[11px] text-blue-900/60 font-medium leading-relaxed">Automatic application of digital signatures to system-generated certificates is ENABLED.</p>
                  <button 
                    type="button"
                    onClick={() => setActiveModal('signature')}
                    className="flex items-center space-x-2 text-[9px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-lg border border-blue-200 transition-all"
                  >
                    <MousePointer2 size={12} />
                    <span>Manage Signatures</span>
                  </button>
               </div>
               <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 space-y-4">
                  <div className="flex items-center space-x-3 text-orange-600">
                     <Clock size={20} />
                     <h4 className="text-xs font-black uppercase tracking-widest">Backup & Recovery</h4>
                  </div>
                  <p className="text-[11px] text-orange-900/60 font-medium leading-relaxed">Last system-wide backup completed successfully 2 hours ago. Daily backups are active.</p>
                  <button 
                    type="button"
                    onClick={() => setActiveModal('backup')}
                    className="flex items-center space-x-2 text-[9px] font-black text-orange-600 uppercase tracking-widest hover:bg-orange-600 hover:text-white px-3 py-1.5 rounded-lg border border-orange-200 transition-all"
                  >
                    <Settings size={12} />
                    <span>Configure Recovery</span>
                  </button>
               </div>
            </div>
          </div>
        </section>

        {/* Leadership & Vision */}
        <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex items-center space-x-3">
            <ShieldCheck className="text-blue-600" size={20} />
            <h2 className="text-xs font-black uppercase tracking-widest text-[#141414]">Director Profile</h2>
          </div>
          <div className="p-8 space-y-8">
            <div className="flex items-center space-x-8">
              <div 
                onClick={() => directorPhotoInputRef.current?.click()}
                className="w-32 h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center text-gray-400 hover:border-blue-600 hover:text-blue-600 transition-all cursor-pointer relative overflow-hidden group"
              >
                {formData.directorPhotoUrl ? (
                  <img src={formData.directorPhotoUrl} alt="Director Photo" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Upload size={32} />
                    <span className="text-[9px] font-black uppercase tracking-widest mt-2 text-center">Director Photo</span>
                  </>
                )}
                <input 
                  type="file" 
                  ref={directorPhotoInputRef} 
                  onChange={handleDirectorPhotoUpload} 
                  className="hidden" 
                  accept="image/*"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Upload className="text-white" size={24} />
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Director Name</label>
                  <input type="text" value={formData.directorName || ''} onChange={(e) => setFormData({...formData, directorName: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" placeholder="Full Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Director Message</label>
                  <textarea value={formData.directorMessage || ''} onChange={(e) => setFormData({...formData, directorMessage: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-medium text-sm min-h-[120px]" placeholder="Director's official message..."></textarea>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visionaries Management */}
        <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="text-emerald-600" size={20} />
              <h2 className="text-xs font-black uppercase tracking-widest text-[#141414]">Our Visionaries (Leadership Team)</h2>
            </div>
            <button 
              type="button" 
              onClick={() => {
                const newVisionary = { id: Math.random().toString(36).substr(2, 9), name: '', role: '', imageUrl: '' };
                setFormData(prev => ({ ...prev, visionaries: [...(prev.visionaries || []), newVisionary] }));
              }}
              className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline"
            >
              Add Visionary
            </button>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(formData.visionaries || []).map((visionary, index) => (
                <div key={visionary.id} className="space-y-4 group relative">
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, visionaries: prev.visionaries?.filter(v => v.id !== visionary.id) }))}
                      className="absolute -top-2 -right-2 p-1.5 bg-red-600 text-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <X size={12} />
                    </button>
                    <div 
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e: any) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = async () => {
                              const compressed = await compressImage(reader.result as string, 600, 0.7);
                              setFormData(prev => ({
                                ...prev,
                                visionaries: prev.visionaries?.map(v => v.id === visionary.id ? { ...v, imageUrl: compressed } : v)
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                      }}
                      className="aspect-[4/5] bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center text-gray-400 hover:border-blue-600 hover:text-blue-600 transition-all cursor-pointer relative overflow-hidden group"
                    >
                      {visionary.imageUrl ? (
                        <img src={visionary.imageUrl} alt={visionary.name} className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Upload size={32} />
                          <span className="text-[9px] font-black uppercase tracking-widest mt-2">Upload Photo</span>
                        </>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Upload className="text-white" size={24} />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        value={visionary.name} 
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          visionaries: prev.visionaries?.map(v => v.id === visionary.id ? { ...v, name: e.target.value } : v)
                        }))}
                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-black uppercase tracking-tight outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Visionary Name"
                      />
                      <input 
                        type="text" 
                        value={visionary.role} 
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          visionaries: prev.visionaries?.map(v => v.id === visionary.id ? { ...v, role: e.target.value } : v)
                        }))}
                        className="w-full p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-[10px] font-black text-emerald-700 uppercase tracking-widest outline-none focus:ring-2 focus:ring-emerald-600"
                        placeholder="Role / Designation"
                      />
                    </div>
                </div>
              ))}
              {(formData.visionaries || []).length === 0 && (
                <div className="md:col-span-3 py-12 text-center text-gray-300 border-2 border-dashed border-gray-100 rounded-[2rem]">
                  <Users size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No visionaries added yet.</p>
                  <button 
                    type="button"
                    onClick={() => {
                      const newVisionary = { id: Math.random().toString(36).substr(2, 9), name: '', role: '', imageUrl: '' };
                      setFormData(prev => ({ ...prev, visionaries: [newVisionary] }));
                    }}
                    className="mt-4 text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                  >
                    Add Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Website Banners */}
        <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ImageIcon className="text-blue-600" size={20} />
              <h2 className="text-xs font-black uppercase tracking-widest text-[#141414]">Website Home Banners</h2>
            </div>
            <button 
              type="button" 
              onClick={() => bannerInputRef.current?.click()}
              className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
            >
              Add Banners
            </button>
            <input type="file" ref={bannerInputRef} onChange={handleBannerUpload} className="hidden" accept="image/*" multiple />
          </div>
          <div className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.banners?.map((banner, index) => (
                <div key={index} className="aspect-video bg-gray-50 rounded-2xl relative group overflow-hidden border border-gray-100">
                  <img src={banner} alt={`Banner ${index + 1}`} className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, banners: formData.banners?.filter((_, i) => i !== index) })}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <div 
                onClick={() => bannerInputRef.current?.click()}
                className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-blue-600 hover:text-blue-600 cursor-pointer transition-all"
              >
                <Upload size={24} />
                <span className="text-[9px] font-black uppercase tracking-widest mt-1">Upload</span>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Management */}
        <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ImageIcon className="text-emerald-600" size={20} />
              <h2 className="text-xs font-black uppercase tracking-widest text-[#141414]">Institute Gallery</h2>
            </div>
            <button 
              type="button" 
              onClick={() => galleryInputRef.current?.click()}
              className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline"
            >
              Upload Photos
            </button>
            <input type="file" ref={galleryInputRef} onChange={handleGalleryUpload} className="hidden" accept="image/*" multiple />
          </div>
          <div className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {formData.gallery?.map((img) => (
                <div key={img.id} className="space-y-3">
                  <div className="aspect-square bg-gray-50 rounded-[2rem] relative group overflow-hidden border border-gray-100 shadow-sm">
                    <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, gallery: formData.gallery?.filter(g => g.id !== img.id) })}
                      className="absolute top-4 right-4 p-2 bg-red-600 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <input 
                    type="text" 
                    value={img.caption || ''} 
                    onChange={(e) => setFormData({
                      ...formData,
                      gallery: formData.gallery?.map(g => g.id === img.id ? { ...g, caption: e.target.value } : g)
                    })}
                    className="w-full p-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Add caption..."
                  />
                </div>
              ))}
              <div 
                onClick={() => galleryInputRef.current?.click()}
                className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center text-gray-400 hover:border-blue-600 hover:text-blue-600 cursor-pointer transition-all"
              >
                <Upload size={32} />
                <span className="text-[10px] font-black uppercase tracking-widest mt-2">Add Photo</span>
              </div>
            </div>
          </div>
        </section>

        {/* Website Content Management */}
        <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex items-center space-x-3">
            <Globe className="text-blue-600" size={20} />
            <h2 className="text-xs font-black uppercase tracking-widest text-[#141414]">Website Static Page Images</h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* About Us Image */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest">About Us Page Banner</label>
                <button type="button" onClick={() => aboutUsInputRef.current?.click()} className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline">Upload</button>
              </div>
              <div className="aspect-video bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 overflow-hidden group relative flex items-center justify-center">
                {formData.aboutUsUrl ? (
                  <img src={formData.aboutUsUrl} alt="About Us" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-300">
                    <ImageIcon size={32} className="mx-auto mb-2" />
                    <p className="text-[8px] font-black uppercase tracking-widest">No Image Set</p>
                  </div>
                )}
                <input type="file" ref={aboutUsInputRef} className="hidden" accept="image/*" onChange={handleExtraImageUrlUpload('aboutUsUrl')} />
                {formData.aboutUsUrl && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center space-x-2">
                    <button type="button" onClick={() => aboutUsInputRef.current?.click()} className="p-2 bg-white text-[#141414] rounded-lg shadow-xl"><Upload size={14} /></button>
                    <button type="button" onClick={() => setFormData({...formData, aboutUsUrl: ''})} className="p-2 bg-red-600 text-white rounded-lg shadow-xl"><X size={14} /></button>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Us Image */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Contact Information Banner</label>
                <button type="button" onClick={() => contactUsInputRef.current?.click()} className="text-[9px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Upload</button>
              </div>
              <div className="aspect-video bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 overflow-hidden group relative flex items-center justify-center">
                {formData.contactUsUrl ? (
                  <img src={formData.contactUsUrl} alt="Contact Us" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-300">
                    <ImageIcon size={32} className="mx-auto mb-2" />
                    <p className="text-[8px] font-black uppercase tracking-widest">No Image Set</p>
                  </div>
                )}
                <input type="file" ref={contactUsInputRef} className="hidden" accept="image/*" onChange={handleExtraImageUrlUpload('contactUsUrl')} />
                {formData.contactUsUrl && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center space-x-2">
                    <button type="button" onClick={() => contactUsInputRef.current?.click()} className="p-2 bg-white text-[#141414] rounded-lg shadow-xl"><Upload size={14} /></button>
                    <button type="button" onClick={() => setFormData({...formData, contactUsUrl: ''})} className="p-2 bg-red-600 text-white rounded-lg shadow-xl"><X size={14} /></button>
                  </div>
                )}
              </div>
            </div>

            {/* Featured Courses Image */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Featured Courses Section Image</label>
                <button type="button" onClick={() => featuredCoursesInputRef.current?.click()} className="text-[9px] font-black text-purple-600 uppercase tracking-widest hover:underline">Upload</button>
              </div>
              <div className="aspect-video bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 overflow-hidden group relative flex items-center justify-center">
                {formData.featuredCoursesBannerUrl ? (
                  <img src={formData.featuredCoursesBannerUrl} alt="Featured Courses" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-300">
                    <ImageIcon size={32} className="mx-auto mb-2" />
                    <p className="text-[8px] font-black uppercase tracking-widest">No Image Set</p>
                  </div>
                )}
                <input type="file" ref={featuredCoursesInputRef} className="hidden" accept="image/*" onChange={handleExtraImageUrlUpload('featuredCoursesBannerUrl')} />
                {formData.featuredCoursesBannerUrl && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center space-x-2">
                    <button type="button" onClick={() => featuredCoursesInputRef.current?.click()} className="p-2 bg-white text-[#141414] rounded-lg shadow-xl"><Upload size={14} /></button>
                    <button type="button" onClick={() => setFormData({...formData, featuredCoursesBannerUrl: ''})} className="p-2 bg-red-600 text-white rounded-lg shadow-xl"><X size={14} /></button>
                  </div>
                )}
              </div>
            </div>

            {/* Success Stories Image */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Success Stories / Impact Banner</label>
                <button type="button" onClick={() => successStoriesInputRef.current?.click()} className="text-[9px] font-black text-orange-600 uppercase tracking-widest hover:underline">Upload</button>
              </div>
              <div className="aspect-video bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 overflow-hidden group relative flex items-center justify-center">
                {formData.successStoriesBannerUrl ? (
                  <img src={formData.successStoriesBannerUrl} alt="Success Stories" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-300">
                    <ImageIcon size={32} className="mx-auto mb-2" />
                    <p className="text-[8px] font-black uppercase tracking-widest">No Image Set</p>
                  </div>
                )}
                <input type="file" ref={successStoriesInputRef} className="hidden" accept="image/*" onChange={handleExtraImageUrlUpload('successStoriesBannerUrl')} />
                {formData.successStoriesBannerUrl && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center space-x-2">
                    <button type="button" onClick={() => successStoriesInputRef.current?.click()} className="p-2 bg-white text-[#141414] rounded-lg shadow-xl"><Upload size={14} /></button>
                    <button type="button" onClick={() => setFormData({...formData, successStoriesBannerUrl: ''})} className="p-2 bg-red-600 text-white rounded-lg shadow-xl"><X size={14} /></button>
                  </div>
                )}
              </div>
            </div>

            {/* Receipt Header Image */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-red-600 uppercase tracking-widest">Official Fee Receipt Top Header (Wide Image)</label>
                <button type="button" onClick={() => receiptHeaderInputRef.current?.click()} className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline">Upload Official Header</button>
              </div>
              <div className="aspect-[4/1] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 overflow-hidden group relative flex items-center justify-center">
                {formData.receiptHeaderUrl ? (
                  <img src={formData.receiptHeaderUrl} alt="Receipt Header" className="w-full h-full object-contain bg-white" />
                ) : (
                  <div className="text-center text-gray-300">
                    <ImageIcon size={32} className="mx-auto mb-2" />
                    <p className="text-[8px] font-black uppercase tracking-widest">No Receipt Header Set (Default Layout will be used)</p>
                  </div>
                )}
                <input type="file" ref={receiptHeaderInputRef} className="hidden" accept="image/*" onChange={handleExtraImageUrlUpload('receiptHeaderUrl', 2000)} />
                {formData.receiptHeaderUrl && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center space-x-2">
                    <button type="button" onClick={() => receiptHeaderInputRef.current?.click()} className="p-2 bg-white text-[#141414] rounded-lg shadow-xl"><Upload size={14} /></button>
                    <button type="button" onClick={() => setFormData({...formData, receiptHeaderUrl: ''})} className="p-2 bg-red-600 text-white rounded-lg shadow-xl"><X size={14} /></button>
                  </div>
                )}
              </div>
              <p className="text-[9px] font-bold text-gray-400 uppercase italic">* Upload a wide image that contains your institute name, logo, and address details for the receipt.</p>
            </div>
          </div>
        </section>
        <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden" id="prospectus-section">
          <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="text-blue-600" size={20} />
              <h2 className="text-xs font-black uppercase tracking-widest text-[#141414]">Academic Prospectus</h2>
            </div>
            <div className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest">Active: 2026 Edition</div>
          </div>
          <div className="p-8">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-1 space-y-4">
                   <div className="aspect-[3/4] bg-gray-50 border border-gray-100 rounded-2xl relative overflow-hidden flex items-center justify-center group">
                      <div className="flex flex-col items-center space-y-2 text-gray-300">
                         <FileText size={48} className={formData.prospectus ? "text-blue-200" : "text-gray-300"} />
                         <span className="text-[9px] font-black uppercase tracking-widest">{formData.prospectus ? "PDF READY" : "PDF PREVIEW"}</span>
                      </div>
                      {formData.prospectus && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                           <FileText size={48} className="text-blue-600 mb-2" />
                           <p className="text-[10px] font-black text-[#141414] truncate w-full">{formData.prospectus.name}</p>
                           <p className="text-[8px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{formData.prospectus.size}</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                         <button type="button" className="p-3 bg-white text-[#141414] rounded-full shadow-xl hover:scale-110 transition-transform" onClick={() => {
                           if (formData.prospectus?.url) {
                             downloadFile(formData.prospectus.url, formData.prospectus.name || 'Prospectus.pdf');
                           }
                         }}>
                            <Download size={20} />
                         </button>
                      </div>
                   </div>
                   <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[#888888]">
                      <span>Size: {formData.prospectus?.size || "0.0 MB"}</span>
                      <span>{formData.prospectus?.version || "v0.0.0"}</span>
                   </div>
                </div>
                
                <div className="lg:col-span-2 space-y-6">
                   <div className="space-y-2">
                       <h3 className="text-sm font-black text-[#141414] uppercase tracking-tight">Upload New Prospectus</h3>
                       <p className="text-xs text-[#888888] font-medium leading-relaxed">Ensure the document is in PDF format and contains the latest course curriculum, fee structure, and institutional policies. Maximum file size allowed is 10MB.</p>
                   </div>
                   
                   <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => prospectusInputRef.current?.click()}
                      className={clsx(
                        "p-8 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center space-y-4 transition-all cursor-pointer group",
                        isDragOver ? "border-blue-600 bg-blue-50/50" : "border-gray-100 bg-transparent hover:border-blue-600 hover:bg-blue-50/30"
                      )}
                   >
                      <input 
                        type="file" 
                        ref={prospectusInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="application/pdf"
                      />
                      <div className={clsx(
                        "w-16 h-16 rounded-2xl flex items-center justify-center transition-all shrink-0",
                        isDragOver ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600"
                      )}>
                         <Upload size={24} />
                      </div>
                      <div className="text-center">
                         <p className="text-[10px] font-black text-[#141414] uppercase tracking-widest">{isDragOver ? "Drop to upload" : "Drag and drop file here"}</p>
                         <p className="text-[9px] font-bold text-[#888888] uppercase tracking-widest mt-1">or click to browse locally</p>
                      </div>
                   </div>
                   
                   <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <div className="flex items-start space-x-3">
                         <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                            <ShieldCheck size={18} />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Verified Distribution</p>
                            <p className="text-[11px] text-emerald-900/60 font-medium mt-1 leading-relaxed">Once uploaded, the new prospectus will be instantly available for download on the public website and student portal.</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-white rounded-[2rem] border border-red-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 bg-red-50/50 border-b border-red-100 flex items-center space-x-3">
            <X className="text-red-600" size={20} />
            <h2 className="text-xs font-black uppercase tracking-widest text-red-600">Danger Zone</h2>
          </div>
          <div className="p-8">
            <div className="p-6 bg-red-50 border border-red-100 rounded-2xl">
              <h3 className="text-sm font-black text-red-600 uppercase tracking-tight mb-2">Reset Application Data</h3>
              <p className="text-xs text-red-700/70 mb-6 leading-relaxed">
                This action will permanently delete all student records, fee payments, franchise records, and business transactions. 
                The menus and settings will remain active, but all data will be wiped. This Cannot be undone.
              </p>
              <button 
                type="button"
                onClick={clearData}
                className="px-8 py-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-200"
              >
                Delete All Data & Factory Reset
              </button>
            </div>
          </div>
        </section>
      </form>

      {/* Signature Management Modal */}
      <AnimatePresence>
        {activeModal === 'signature' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl"
            >
                <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                     <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><BadgeCheck /></div>
                     <div>
                        <h2 className="text-lg font-black text-[#141414] uppercase tracking-tight">Signature Setup</h2>
                        <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Authorized digital verification</p>
                     </div>
                  </div>
                  <button onClick={() => setActiveModal(null)} className="p-3 hover:bg-gray-100 rounded-2xl transition-all">
                    <X size={20} className="text-gray-400" />
                  </button>
               </div>
               <div className="p-8 space-y-6">
                  <div className="p-6 bg-gray-50 border border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center space-y-4">
                     <div className="w-full h-32 bg-white rounded-xl shadow-inner flex items-center justify-center relative overflow-hidden group">
                        {formData.signatureUrl ? (
                           <img src={formData.signatureUrl} alt="Signature" className="max-h-full max-w-full object-contain" />
                        ) : (
                           <span className="text-gray-300 font-mono italic">[ No Signature Uploaded ]</span>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer" onClick={() => signatureInputRef.current?.click()}>
                           <Upload className="text-white" size={24} />
                        </div>
                     </div>
                     <input 
                        type="file" 
                        ref={signatureInputRef} 
                        onChange={handleSignatureUpload} 
                        className="hidden" 
                        accept="image/*"
                     />
                     <div className="flex space-x-4">
                        <button 
                           type="button" 
                           onClick={() => signatureInputRef.current?.click()}
                           className="flex items-center space-x-2 text-[10px] font-black uppercase text-blue-600 hover:underline"
                        >
                           <Upload size={14} />
                           <span>Upload New Signature</span>
                        </button>
                        {formData.signatureUrl && (
                           <button 
                              type="button" 
                              onClick={() => setFormData({ ...formData, signatureUrl: '' })}
                              className="flex items-center space-x-2 text-[10px] font-black uppercase text-red-600 hover:underline"
                           >
                              <X size={14} />
                              <span>Remove</span>
                           </button>
                        )}
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <span className="text-[10px] font-black uppercase tracking-widest">Approve Certificates</span>
                        <div className="w-10 h-5 bg-blue-600 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl opacity-50">
                        <span className="text-[10px] font-black uppercase tracking-widest">Two-Factor OTP for Writes</span>
                        <div className="w-10 h-5 bg-gray-300 rounded-full relative"><div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
                     </div>
                  </div>
                  <button onClick={() => setActiveModal(null)} className="w-full py-4 bg-[#141414] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Update Verification Settings</button>
               </div>
            </motion.div>
          </div>
        )}

        {activeModal === 'backup' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl"
            >
               <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-orange-50/30">
                  <div className="flex items-center space-x-4">
                     <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center"><Database /></div>
                     <div>
                        <h2 className="text-lg font-black text-[#141414] uppercase tracking-tight">System Continuity</h2>
                        <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Backup & Disaster Recovery</p>
                     </div>
                  </div>
                  <button onClick={() => setActiveModal(null)} className="p-3 hover:bg-orange-100 rounded-2xl transition-all">
                    <X size={20} className="text-gray-400" />
                  </button>
               </div>
               <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={handleManualBackup}
                        disabled={isBackingUp}
                        className="p-6 bg-gray-50 border border-gray-100 rounded-[2rem] flex flex-col items-center justify-center space-y-3 hover:bg-white hover:shadow-xl transition-all group"
                      >
                         <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center", isBackingUp ? "bg-orange-50 text-orange-600 animate-spin" : "bg-white text-[#141414] shadow-sm")}>
                            <RefreshCcw size={18} />
                         </div>
                         <span className="text-[9px] font-black uppercase tracking-widest">{isBackingUp ? 'Syncing...' : 'Export JSON'}</span>
                      </button>
                      <label className="p-6 bg-gray-50 border border-gray-100 rounded-[2rem] flex flex-col items-center justify-center space-y-3 hover:bg-white hover:shadow-xl transition-all group cursor-pointer">
                         <div className="w-10 h-10 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                            <Upload size={18} />
                         </div>
                         <span className="text-[9px] font-black uppercase tracking-widest text-[#141414]">Import JSON</span>
                         <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                      </label>
                  </div>
                  <div className="p-6 border border-orange-100 bg-orange-50/50 rounded-2xl space-y-3">
                     <div className="flex items-center space-x-2 text-orange-600">
                        <ShieldCheck size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Automatic Maintenance</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-orange-900/60">Auto-backup Frequency</span>
                        <select className="bg-white border-none outline-none text-[10px] font-black uppercase py-1 px-3 rounded-lg shadow-sm">
                           <option>Hourly</option>
                           <option>Daily</option>
                           <option>Weekly</option>
                        </select>
                     </div>
                  </div>
                  <div className="flex items-center space-x-4 overflow-hidden pt-4 border-t border-gray-100">
                     <div className="flex-1">
                        <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest mb-1">Local Identity (URL)</p>
                        <p className="text-xs font-mono font-bold truncate text-gray-500 underline">https://ais-dev-pzzj54zbvfrllp25htfrww.run.app</p>
                     </div>
                     <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">Update URL</button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
