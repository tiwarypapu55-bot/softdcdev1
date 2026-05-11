import React, { useState } from 'react';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AdmissionEnquiry } from '../types';

interface EnquiryFormProps {
  onSuccess?: () => void;
  compact?: boolean;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({ onSuccess, compact }) => {
  const { addEnquiry, courses } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const enquiry: AdmissionEnquiry = {
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
      ...formData,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    
    addEnquiry(enquiry);
    setIsSubmitting(false);
    setIsSuccess(true);
    
    if (onSuccess) {
      setTimeout(onSuccess, 2000);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-xl shadow-green-200/50">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-2xl font-black text-[#141414] uppercase tracking-tight">Inquiry Received!</h3>
        <p className="text-[#888888] font-medium max-w-xs">Thank you for your interest. Our academic counselors will get back to you within 24 hours.</p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest px-1">Full Name</label>
        <input 
          required
          type="text" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm" 
          placeholder="e.g. Rahul Kumar" 
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest px-1">Email Address</label>
        <input 
          required
          type="email" 
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm" 
          placeholder="e.g. rahul@example.com" 
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest px-1">Mobile No</label>
        <input 
          required
          type="tel" 
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm" 
          placeholder="+91 XXXXX XXXXX" 
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest px-1">Interested Course</label>
        <select 
          required
          value={formData.course}
          onChange={(e) => setFormData({...formData, course: e.target.value})}
          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm"
        >
          <option value="">Select a Course</option>
          {courses.map(course => (
            <option key={course.id} value={course.title}>{course.title}</option>
          ))}
          <option value="Other">Other / Not Sure</option>
        </select>
      </div>
      <div className="space-y-2 md:col-span-2">
        <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest px-1">Your Message</label>
        <textarea 
          required
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm min-h-[120px]" 
          placeholder="Tell us about your learning goals..."
        ></textarea>
      </div>
      <button 
        disabled={isSubmitting}
        className="md:col-span-2 py-5 bg-[#141414] text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-black/10 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>Submit Admission Inquiry</span>
            <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
};
