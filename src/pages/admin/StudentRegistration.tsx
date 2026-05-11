/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  GraduationCap, 
  MapPin, 
  FileText, 
  Camera, 
  CheckCircle2, 
  Save, 
  X,
  CreditCard,
  BookOpen,
  Calendar,
  Building2,
  Phone,
  Mail,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { Student } from '../../types';
import { compressImage } from '../../lib/storage';

export const StudentRegistration = () => {
  const { franchises, courses, addStudent, currentUser } = useApp();
  const [isSuccess, setIsSuccess] = useState(false);

  const isFranchise = currentUser?.role === 'FRANCHISE';

  const [formData, setFormData] = useState<Partial<Student>>({
    name: '',
    fatherName: '',
    motherName: '',
    dob: '',
    gender: '',
    contact: '',
    guardianContact: '',
    email: '',
    casteCategory: '',
    religion: '',
    maritalStatus: '',
    identityType: '',
    idNumber: '',
    apparId: '',
    
    studyCenter: isFranchise ? (franchises.find(f => f.id === currentUser.franchiseId)?.name || 'Your Center') : '',
    franchiseId: isFranchise ? currentUser.franchiseId : '',
    session: '2025-26',
    courseCategory: '',
    course: '',
    courseDuration: '',
    admissionDate: new Date().toISOString().split('T')[0],
    enrollmentNo: `SF${Date.now().toString().slice(-6)}`,
    
    highestQualification: '',
    qualificationDetail: '',
    passingYear: '',
    
    address: '',
    state: '',
    district: '',
    pincode: '',
    
    remark: '',
    enquirySource: '',
    verificationCode: Math.random().toString(36).substring(7).toUpperCase(),
    
    feeStatus: 'PENDING',
    kycStatus: 'PENDING',
    kycDocs: [],
    totalFees: 0,
    paidAmount: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStudent({
      ...formData as Student,
      id: `s${Date.now()}`
    });
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const handleFranchiseChange = (id: string) => {
    const franchise = franchises.find(f => f.id === id);
    setFormData({
      ...formData,
      franchiseId: id,
      studyCenter: franchise?.name || ''
    });
  };

  const handleCourseChange = (courseTitle: string) => {
    const course = courses.find(c => c.title === courseTitle);
    setFormData({
      ...formData,
      course: courseTitle,
      courseCategory: course?.category || '',
      courseDuration: course?.duration || ''
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size too large. Please select an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const compressed = await compressImage(reader.result as string, 400, 0.7);
          setFormData({
            ...formData,
            photoUrl: compressed
          });
        } catch (error) {
          console.error('Compression failed:', error);
          setFormData({
            ...formData,
            photoUrl: reader.result as string
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const Section = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
    <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm space-y-6">
      <div className="flex items-center space-x-3 pb-6 border-b border-gray-50">
        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
          <Icon size={20} />
        </div>
        <h2 className="text-sm font-black text-[#141414] uppercase tracking-widest">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </div>
  );

  const InputField = ({ label, required, type = "text", value, onChange, placeholder, options }: any) => (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {options ? (
        <select 
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold appearance-none transition-all"
        >
          <option value="">-- Select {label} --</option>
          {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input 
          required={required}
          type={type} 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all placeholder:text-gray-300"
        />
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#141414] tracking-tight uppercase">Student Registration</h1>
          <p className="text-sm text-[#888888] font-mono">Admission processing for new software curriculum candidates</p>
        </div>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 px-6 py-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl"
          >
            <CheckCircle2 size={18} />
            <span className="text-sm font-black uppercase tracking-widest text-[10px]">Student Registered Successfully!</span>
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Center & Course Details */}
        <Section title="Center & Course Details" icon={Building2}>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">
              Study Center {<span className="text-red-500">*</span>}
            </label>
            <select 
              required
              disabled={isFranchise}
              value={formData.franchiseId}
              onChange={(e) => handleFranchiseChange(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold appearance-none transition-all disabled:opacity-75 disabled:cursor-not-allowed"
            >
              <option value="">-- Select Center --</option>
              {franchises.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <InputField 
            label="Session" 
            required 
            value={formData.session}
            onChange={(val: string) => setFormData({...formData, session: val})}
            options={['2024-25', '2025-26', '2026-27']}
          />
          <InputField 
            label="Course Category" 
            value={formData.courseCategory}
            onChange={(val: string) => setFormData({...formData, courseCategory: val})}
            placeholder="Auto-filled from course"
          />
          <InputField 
            label="Course Name" 
            required 
            value={formData.course}
            onChange={handleCourseChange}
            options={courses.map(c => c.title)}
          />
          <InputField 
            label="Course Duration" 
            value={formData.courseDuration}
            onChange={(val: string) => setFormData({...formData, courseDuration: val})}
            placeholder="e.g., 3 Months"
          />
          <InputField 
            label="Admission Date" 
            type="date"
            required 
            value={formData.admissionDate}
            onChange={(val: string) => setFormData({...formData, admissionDate: val})}
          />
          <InputField 
            label="Enrollment No." 
            value={formData.enrollmentNo}
            onChange={(val: string) => setFormData({...formData, enrollmentNo: val})}
          />
          <InputField 
            label="Admission No / Roll No" 
            required 
            value={formData.admissionNo}
            onChange={(val: string) => setFormData({...formData, admissionNo: val})}
            placeholder="e.g., ST0828"
          />
        </Section>

        {/* Student Details */}
        <Section title="Student Details" icon={User}>
          <InputField 
            label="Full Name" 
            required 
            value={formData.name}
            onChange={(val: string) => setFormData({...formData, name: val})}
            placeholder="As per ID proofs"
          />
          <InputField 
            label="Father's Name" 
            required 
            value={formData.fatherName}
            onChange={(val: string) => setFormData({...formData, fatherName: val})}
          />
          <InputField 
            label="Mother's Name" 
            required 
            value={formData.motherName}
            onChange={(val: string) => setFormData({...formData, motherName: val})}
          />
          <InputField 
            label="Date of Birth" 
            type="date"
            required 
            value={formData.dob}
            onChange={(val: string) => setFormData({...formData, dob: val})}
          />
          <InputField 
            label="Gender" 
            required 
            value={formData.gender}
            onChange={(val: string) => setFormData({...formData, gender: val})}
            options={['Male', 'Female', 'Other']}
          />
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Contact No *</label>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                required
                type="tel" 
                value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
                className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
              />
            </div>
          </div>
          <InputField 
            label="Guardian No" 
            type="tel"
            value={formData.guardianContact}
            onChange={(val: string) => setFormData({...formData, guardianContact: val})}
          />
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
              />
            </div>
          </div>
          <InputField 
            label="Caste Category" 
            value={formData.casteCategory}
            onChange={(val: string) => setFormData({...formData, casteCategory: val})}
            options={['General', 'OBC', 'SC', 'ST', 'EWS']}
          />
          <InputField 
            label="Religion" 
            value={formData.religion}
            onChange={(val: string) => setFormData({...formData, religion: val})}
            options={['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other']}
          />
          <InputField 
            label="Marital Status" 
            value={formData.maritalStatus}
            onChange={(val: string) => setFormData({...formData, maritalStatus: val})}
            options={['Single', 'Married', 'Divorced', 'Widowed']}
          />
          <InputField 
            label="Identity Type" 
            value={formData.identityType}
            onChange={(val: string) => setFormData({...formData, identityType: val})}
            options={['Aadhar Card', 'Voter ID', 'Passport', 'Driving License']}
          />
          <InputField 
            label="ID Number" 
            value={formData.idNumber}
            onChange={(val: string) => setFormData({...formData, idNumber: val})}
            placeholder="Enter document number"
          />
          <InputField 
            label="Appar ID / ABC ID" 
            value={formData.apparId}
            onChange={(val: string) => setFormData({...formData, apparId: val})}
          />
        </Section>

        {/* Profile Photo */}
        <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center space-x-3 pb-6 border-b border-gray-50 mb-6">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Camera size={20} />
            </div>
            <h2 className="text-sm font-black text-[#141414] uppercase tracking-widest">Profile Photo</h2>
          </div>
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            <div 
              className="w-40 h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-400 group cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all relative overflow-hidden"
              onClick={() => document.getElementById('student-photo-input')?.click()}
            >
              {formData.photoUrl ? (
                <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Camera size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase text-center px-4">Click to upload</span>
                </>
              )}
              <input 
                id="student-photo-input"
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handlePhotoUpload}
              />
            </div>
            <div className="text-left">
              <p className="text-sm font-black text-[#141414] mb-1">
                {formData.photoUrl ? 'Photo uploaded successfully' : 'Click on image to upload photo'}
              </p>
              <p className="text-[10px] text-[#888888] font-mono leading-relaxed">Accepted formats: JPG, PNG, WEBP.<br/>Max size: 2MB. Recommendation: 400x400px.</p>
              {formData.photoUrl && (
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, photoUrl: ''})}
                  className="mt-2 text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline"
                >
                  Remove Photo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Qualification Details */}
        <Section title="Qualification Details" icon={Award}>
          <InputField 
            label="Highest Qualification" 
            required 
            value={formData.highestQualification}
            onChange={(val: string) => setFormData({...formData, highestQualification: val})}
            options={['10th Pass', '12th Pass', 'Graduate', 'Post Graduate', 'Diploma', 'Other']}
          />
          <InputField 
            label="Qualification Board/University" 
            value={formData.qualificationDetail}
            onChange={(val: string) => setFormData({...formData, qualificationDetail: val})}
            placeholder="e.g., CBSE"
          />
          <InputField 
            label="Passing Year" 
            value={formData.passingYear}
            onChange={(val: string) => setFormData({...formData, passingYear: val})}
            placeholder="e.g., 2023"
          />
        </Section>

        {/* Address Details */}
        <Section title="Address Details" icon={MapPin}>
          <div className="md:col-span-2 lg:col-span-3 space-y-2">
            <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Full Address</label>
            <textarea 
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold min-h-[100px]"
              placeholder="House, Street, Area..."
            />
          </div>
          <InputField 
            label="State" 
            value={formData.state}
            onChange={(val: string) => setFormData({...formData, state: val})}
            placeholder="e.g., Uttar Pradesh"
          />
          <InputField 
            label="District" 
            value={formData.district}
            onChange={(val: string) => setFormData({...formData, district: val})}
            placeholder="e.g., Lucknow"
          />
          <InputField 
            label="Pincode" 
            value={formData.pincode}
            onChange={(val: string) => setFormData({...formData, pincode: val})}
            placeholder="6-digit code"
          />
        </Section>

        {/* Extra Details */}
        <Section title="Extra Details" icon={FileText}>
          <div className="md:col-span-2 lg:col-span-1 space-y-2">
            <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Remarks</label>
            <input 
              type="text" 
              value={formData.remark}
              onChange={(e) => setFormData({...formData, remark: e.target.value})}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
            />
          </div>
          <InputField 
            label="Enquiry Source" 
            value={formData.enquirySource}
            onChange={(val: string) => setFormData({...formData, enquirySource: val})}
            options={['Social Media', 'Newspaper', 'Friend/Referral', 'Walk-in', 'Banner/Poster']}
          />
          <InputField 
            label="Verification Code" 
            value={formData.verificationCode}
            onChange={(val: string) => setFormData({...formData, verificationCode: val})}
          />
        </Section>

        <div className="flex flex-col md:flex-row items-center gap-4 pt-8">
          <button 
            type="button" 
            className="w-full md:w-auto px-12 py-5 bg-gray-100 text-[#141414] rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all flex items-center justify-center space-x-2"
          >
            <X size={16} />
            <span>Cancel</span>
          </button>
          <button 
            type="submit" 
            className="w-full md:flex-1 py-5 bg-[#141414] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 transition-all shadow-2xl shadow-black/20 flex items-center justify-center space-x-3"
          >
            <Save size={18} />
            <span>Register Student Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
