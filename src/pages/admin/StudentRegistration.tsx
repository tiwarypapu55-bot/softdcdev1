/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
  Award,
  Printer,
  RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { Student } from '../../types';
import { compressImage } from '../../lib/storage';
import { INDIAN_STATES, DISTRICTS_BY_STATE } from '../../constants/locationData';
import { useLocation } from 'react-router-dom';

const Section = ({ title, icon: Icon, children, variant = 'blue' }: { title: string, icon: any, children: React.ReactNode, variant?: 'blue' | 'orange' | 'green' | 'gray' }) => (
  <div className={clsx(
    "rounded-xl border shadow-sm space-y-6 pt-6 pb-10 px-8 transition-all duration-300",
    variant === 'blue' ? "bg-[#f8faff] border-blue-50/50" : 
    variant === 'orange' ? "bg-[#fffaf2] border-orange-50/50" : 
    variant === 'green' ? "bg-[#f7fcf9] border-emerald-50/50" : "bg-white border-gray-100"
  )}>
    <div className="flex items-center space-x-3 pb-4">
      <div className={clsx(
        "w-1.5 h-6 rounded-full shrink-0",
        variant === 'blue' ? "bg-blue-600" : 
        variant === 'orange' ? "bg-orange-500" : 
        variant === 'green' ? "bg-emerald-600" : "bg-gray-400"
      )} />
      <div className={clsx(
        "flex items-center space-x-2",
        variant === 'blue' ? "text-blue-600" : 
        variant === 'orange' ? "text-orange-600" : 
        variant === 'green' ? "text-emerald-700" : "text-gray-900"
      )}>
        <Icon size={20} className="stroke-[2.5px]" />
        <h2 className="text-base font-bold tracking-tight">{title}</h2>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  </div>
);

const InputField = ({ label, required, type = "text", value, onChange, placeholder, options }: any) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-gray-700 ml-0.5 block">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {options ? (
      <select 
        required={required}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-sm transition-all appearance-none"
      >
        <option value="">-- Select {label} --</option>
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    ) : (
      <input 
        required={required}
        type={type} 
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-sm placeholder:text-gray-300 transition-all"
      />
    )}
  </div>
);

export const StudentRegistration = () => {
  const { franchises, courses, addStudent, currentUser, businessProfile, feeStructures, franchiseFees, addWalletTransaction } = useApp();
  const location = useLocation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [lastStudent, setLastStudent] = useState<Student | null>(null);

  const isFranchise = currentUser?.role === 'FRANCHISE';
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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
    admissionNo: '',
    
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

  useEffect(() => {
    if (location.state) {
      const { name, email, contact, course } = location.state;
      const matchedCourse = courses.find(c => c.title === course);
      
      setFormData(prev => ({
        ...prev,
        name: name || prev.name,
        email: email || prev.email,
        contact: contact || prev.contact,
        course: course || prev.course,
        courseCategory: matchedCourse?.category || prev.courseCategory,
        courseDuration: matchedCourse?.duration || prev.courseDuration
      }));
    }
  }, [location.state, courses]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation check
    const requiredFields: (keyof Student)[] = ['name', 'fatherName', 'motherName', 'dob', 'gender', 'contact', 'admissionNo', 'course', 'franchiseId'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setShowConfirmDialog(true);
  };

  const actualSubmit = async () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);
    try {
      // Find the registration fee for this center
      const centerFee = franchiseFees.find(ff => ff.franchiseId === formData.franchiseId);
      const regFee = centerFee?.registrationFees || 0;

      if (regFee > 0) {
        try {
          addWalletTransaction({
            id: `reg-${Date.now()}`,
            franchiseId: formData.franchiseId!,
            amount: regFee,
            type: 'DEBIT',
            purpose: `Student Registration Fee: ${formData.name} (${formData.admissionNo})`,
            timestamp: new Date().toISOString(),
            status: 'SUCCESS'
          });
        } catch (walletError: any) {
          alert(walletError.message || 'Insufficient wallet balance for registration.');
          setIsSubmitting(false);
          return;
        }
      }

      const newStudent = {
        ...formData as Student,
        id: `s${Date.now()}`
      };
      
      // Artificial delay for feedback if it's too fast
      await new Promise(resolve => setTimeout(resolve, 800));
      
      addStudent(newStudent);
      setLastStudent(newStudent);
      setIsSuccess(true);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Failed to register student. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
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
    
    // Calculate total fees for this course from FeeMaster
    const courseFees = feeStructures
      ? feeStructures
          .filter(f => (f.courseName === courseTitle || f.courseId === 'all') && f.status === 'ACTIVE')
          .reduce((acc, f) => acc + (f.amount - f.discount), 0)
      : 0;

    setFormData({
      ...formData,
      course: courseTitle,
      courseCategory: course?.category || '',
      courseDuration: course?.duration || '',
      totalFees: courseFees > 0 ? courseFees : (formData.totalFees || 0)
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

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-white/90 backdrop-blur-xl z-[40] py-4 -mx-4 px-4 rounded-b-2xl border-b border-gray-100 min-h-[80px]">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-600 tracking-tight">Student Registration Form</h1>
          <p className="text-[10px] md:text-sm text-gray-400 font-medium">Admission processing for new software curriculum candidates</p>
        </div>
        <div className="flex items-center min-h-[50px]">
          <AnimatePresence mode="wait">
            {isSuccess && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between gap-4 px-6 py-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl shadow-xl shadow-emerald-600/10"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle2 size={18} className="animate-bounce" />
                  <span className="text-sm font-black uppercase tracking-widest text-[10px]">Registered Successfully!</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowPrintModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all active:scale-95"
                >
                  <Printer size={14} />
                  <span>Print</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pt-4">
        {/* Center & Course Details */}
        <Section title="Center & Course Details" icon={Building2} variant="blue">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 ml-0.5 block">
              Study Center {<span className="text-red-500">*</span>}
            </label>
            <select 
              required
              disabled={isFranchise}
              value={formData.franchiseId}
              onChange={(e) => handleFranchiseChange(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-sm transition-all appearance-none disabled:bg-gray-50 disabled:cursor-not-allowed"
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
            placeholder="Select Course Category"
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
            placeholder="Course Duration"
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
          <InputField 
            label="Total Course Fee (₹)" 
            type="number"
            required 
            value={formData.totalFees}
            onChange={(val: string) => setFormData({...formData, totalFees: Number(val)})}
            placeholder="e.g., 3000"
          />
        </Section>

        {/* Student Details */}
        <Section title="Student Details" icon={User} variant="orange">
          <InputField 
            label="Full Name" 
            required 
            value={formData.name}
            onChange={(val: string) => setFormData({...formData, name: val})}
            placeholder="Full Name"
          />
          <InputField 
            label="Father's Name" 
            required 
            value={formData.fatherName}
            onChange={(val: string) => setFormData({...formData, fatherName: val})}
            placeholder="Father's Name"
          />
          <InputField 
            label="Mother's Name" 
            required 
            value={formData.motherName}
            onChange={(val: string) => setFormData({...formData, motherName: val})}
            placeholder="Mother's Name"
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
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 ml-0.5 block">Contact No *</label>
            <div className="relative">
              <input 
                required
                type="tel" 
                value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-sm transition-all"
                placeholder="Contact No"
              />
            </div>
          </div>
          <InputField 
            label="Guardian No" 
            type="tel"
            value={formData.guardianContact}
            onChange={(val: string) => setFormData({...formData, guardianContact: val})}
            placeholder="Guardian No"
          />
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 ml-0.5 block">Email</label>
            <div className="relative">
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-sm transition-all"
                placeholder="Email"
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
        <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center space-x-3 pb-6 border-b border-gray-50 mb-6">
            <div className="w-1.5 h-6 rounded-full bg-blue-600 shrink-0" />
            <div className="flex items-center space-x-2 text-blue-600">
              <Camera size={20} className="stroke-[2.5px]" />
              <h2 className="text-base font-bold tracking-tight">Profile Photo</h2>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            <div 
              className="w-40 h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 group cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all relative overflow-hidden"
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
              <p className="text-sm font-bold text-gray-900 mb-1">
                {formData.photoUrl ? 'Photo uploaded successfully' : 'Click on image to upload photo'}
              </p>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">Accepted formats: JPG, PNG, WEBP.<br/>Max size: 2MB. Recommendation: 400x400px.</p>
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
        <Section title="Qualification Details" icon={Award} variant="blue">
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
        <Section title="Address Details" icon={MapPin} variant="blue">
          <div className="md:col-span-2 lg:col-span-3 space-y-1.5">
            <label className="text-xs font-bold text-gray-700 ml-0.5 block">Full Address</label>
            <textarea 
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-sm transition-all min-h-[100px]"
              placeholder="Full Address"
            />
          </div>
          <InputField 
            label="State" 
            value={formData.state}
            onChange={(val: string) => {
              setFormData({
                ...formData, 
                state: val,
                district: '' // Reset district when state changes
              });
            }}
            options={INDIAN_STATES}
            placeholder="Select State"
          />
          <InputField 
            label="District" 
            value={formData.district}
            onChange={(val: string) => setFormData({...formData, district: val})}
            options={formData.state ? DISTRICTS_BY_STATE[formData.state as string] || [] : []}
            placeholder="Select District"
          />
          <InputField 
            label="Pincode" 
            value={formData.pincode}
            onChange={(val: string) => setFormData({...formData, pincode: val})}
            placeholder="6-digit code"
          />
        </Section>

        {/* Extra Details */}
        <Section title="Extra Details" icon={FileText} variant="blue">
          <div className="md:col-span-2 lg:col-span-1 space-y-1.5">
            <label className="text-xs font-bold text-gray-700 ml-0.5 block">Remarks</label>
            <input 
              type="text" 
              value={formData.remark}
              onChange={(e) => setFormData({...formData, remark: e.target.value})}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-sm transition-all"
              placeholder="Remarks"
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
            className="w-full md:w-auto px-12 py-4 bg-gray-100 text-gray-900 rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-gray-200 transition-all flex items-center justify-center space-x-2"
          >
            <X size={16} />
            <span>Cancel</span>
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full md:flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? (
              <RefreshCcw size={18} className="animate-spin" />
            ) : (
              <Save size={18} className="group-hover:scale-110 transition-transform" />
            )}
            <span>{isSubmitting ? 'Processing...' : 'Register Student Profile'}</span>
          </button>
        </div>
      </form>

      <AnimatePresence>
        {showConfirmDialog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl text-center space-y-6"
            >
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <User size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#141414] uppercase tracking-tight">Confirm Registration</h3>
                <p className="text-sm text-gray-500 font-medium mt-2 uppercase tracking-widest text-[10px]">Are you sure you want to register <span className="text-blue-600">"{formData.name}"</span> into the course <span className="text-blue-600">"{formData.course}"</span>?</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowConfirmDialog(false)}
                  className="py-4 bg-gray-100 text-[#141414] text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-all"
                >
                  Go Back
                </button>
                <button 
                  onClick={actualSubmit}
                  className="py-4 bg-[#141414] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-black/20"
                >
                  Yes, Register
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPrintModal && lastStudent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:p-0 print:bg-white">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto p-12 shadow-2xl relative print:shadow-none print:p-0 print:max-h-none print:overflow-visible print:rounded-none"
            >
              {/* Close and Print buttons - Hidden during print */}
              <div className="absolute right-8 top-8 flex items-center space-x-3 print:hidden">
                <button 
                  onClick={handlePrint}
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

              {/* Printable Content */}
              <div id="printable-form" className="font-sans text-[#141414] relative overflow-hidden">
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] select-none z-0">
                  <div className="flex flex-col items-center rotate-[-35deg] scale-150">
                     {businessProfile.logoUrl ? (
                       <img src={businessProfile.logoUrl} alt="" className="w-80 h-80 object-contain grayscale brightness-90 contrast-125" />
                     ) : (
                       <GraduationCap size={400} className="text-gray-400" />
                     )}
                     <h1 className="text-[6rem] font-black whitespace-nowrap uppercase text-gray-400 -mt-16 tracking-tighter">
                       {businessProfile.name || 'SOFTDEV TALLY GURU'}
                     </h1>
                  </div>
                </div>

                <div className="relative z-10">
                   {/* Professional Header Section */}
                   <div className="text-center space-y-1 mb-8 border-b-[1.5px] border-black pb-6">
                      {businessProfile.receiptHeaderUrl ? (
                        <img src={businessProfile.receiptHeaderUrl} alt="Header" className="w-full h-auto mx-auto" />
                      ) : (
                        <div className="flex flex-col items-center">
                          <p className="text-[10px] font-bold text-gray-800 tracking-widest uppercase">An ISO 9001 : 2015 Certified Institute</p>
                          <p className="text-[11px] font-black text-emerald-700 uppercase tracking-tight">बस्ती मंडल का नं. 1 कंप्यूटर ट्रेनिंग इंस्टिट्यूट</p>
                          <h1 className="text-4xl font-black text-red-600 tracking-tighter uppercase leading-none mt-1">{businessProfile.name || 'SOFTDEV TALLY GURU'}</h1>
                          <div className="bg-indigo-900/5 px-4 py-1 rounded text-[8px] font-bold text-indigo-900 border border-indigo-900/10 mt-1 uppercase tracking-widest">
                              [ RUN UNDER : SOFTDEV TALLY GURU PRASHIKSHAN SANSTHAN SOCIETY ] [ REG No. : G-58913 / 1442 ]
                          </div>
                          <p className="text-[9px] font-black text-blue-800 mt-1 uppercase leading-none">(A Complete Computer Education Institute) (An Authorised Tally Education Partner)</p>
                          <p className="text-[9px] font-bold text-red-600 uppercase tracking-widest mt-1">Head Office : Near Gandhi Nagar, Basti, UP - 272001</p>
                          <p className="text-[9px] font-black text-[#141414] mt-1">Website : www.softdevtallyguru.in | Phone : +91 7376767676</p>
                        </div>
                      )}
                   </div>

                  <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-blue-600 text-white flex items-center justify-center rounded-2xl shadow-xl shadow-blue-600/20 overflow-hidden shrink-0">
                        <GraduationCap size={44} />
                      </div>
                      <div>
                        <h2 className="text-xl font-black tracking-tight uppercase leading-none mb-2 text-[#141414]">Admission Record</h2>
                        <div className="flex items-center space-x-3">
                          <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-100 flex items-center">
                             <div className="w-1 h-1 bg-blue-600 rounded-full mr-2" />
                             Center: {lastStudent.studyCenter}
                          </div>
                          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100 flex items-center">
                             <div className="w-1 h-1 bg-emerald-600 rounded-full mr-2" />
                             Date: {lastStudent.admissionDate}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-28 h-36 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-[9px] font-black text-gray-300 text-center uppercase p-3 overflow-hidden bg-gray-50/50">
                      {lastStudent.photoUrl ? (
                        <img src={lastStudent.photoUrl} alt="Student" className="w-full h-full object-cover" />
                      ) : (
                        "Affix Recent Photo"
                      )}
                    </div>
                  </div>

                <div className="text-center mb-10">
                  <h2 className="text-2xl font-black uppercase tracking-[0.2em] bg-black text-white py-3 px-8 inline-block rounded-xl">Admission Registration Form</h2>
                </div>

                {/* Form Data Grid */}
                <div className="grid grid-cols-2 gap-x-12 gap-y-6 mb-12">
                   {[
                     { label: 'Full Name', value: lastStudent.name },
                     { label: 'Father\'s Name', value: lastStudent.fatherName },
                     { label: 'Mother\'s Name', value: lastStudent.motherName },
                     { label: 'Date of Birth', value: lastStudent.dob },
                     { label: 'Gender', value: lastStudent.gender },
                     { label: 'Contact Number', value: lastStudent.contact },
                     { label: 'Enrollment No.', value: lastStudent.enrollmentNo },
                     { label: 'Admission No.', value: lastStudent.admissionNo },
                     { label: 'Total Fees', value: `₹ ${lastStudent.totalFees}` },
                     { label: 'Course Applied', value: `${lastStudent.course} (${lastStudent.courseDuration || 'N/A'})` },
                     { label: 'Aadhar/ID Type', value: lastStudent.identityType },
                     { label: 'ID Number', value: lastStudent.idNumber },
                     { label: 'Qualification', value: lastStudent.highestQualification },
                     { label: 'Board/University', value: lastStudent.qualificationDetail },
                     { label: 'Passing Year', value: lastStudent.passingYear },
                     { label: 'State', value: lastStudent.state },
                     { label: 'District', value: lastStudent.district },
                     { label: 'Pincode', value: lastStudent.pincode },
                   ].map((item, i) => (
                     <div key={i} className="flex justify-between items-baseline border-b border-gray-100 pb-2">
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{item.label}</span>
                        <span className="text-sm font-bold uppercase">{item.value || 'N/A'}</span>
                     </div>
                   ))}
                </div>

                <div className="mb-12">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">Detailed Address</span>
                  <p className="text-sm font-bold uppercase p-4 bg-gray-50 rounded-2xl min-h-[60px]">{lastStudent.address || 'N/A'}</p>
                </div>

                {/* Declaration Policy */}
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

                {/* Signatures */}
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

                {/* Footer */}
                <div className="mt-20 pt-8 border-t border-gray-100 text-center">
                   <p className="text-[9px] font-black uppercase tracking-widest text-gray-300">Computer Generated Document | Registration ID: {lastStudent.id}</p>
                </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
