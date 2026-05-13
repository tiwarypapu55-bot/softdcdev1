/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { QrCode, ShieldCheck, GraduationCap, Search, CheckCircle2, AlertCircle, Wallet, UserPlus, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';

const LOGO_URL = "https://firebasestorage.googleapis.com/v0/b/ais-dev-pzzj54zbvfrllp25htfrww.appspot.com/o/softdev_logo.png?alt=media&token=48c0b58e-7e9b-46a2-97b7-54324f331777";

export const LandingPage = () => {
  const { login, certificates, businessProfile } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'VERIFY'>('LOGIN');
  const [certId, setCertId] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const [loginData, setLoginData] = useState({ id: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const handleQuickLogin = (id: string, pass: string) => {
    setLoginData({ id, password: pass });
    setLoginError('');
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const id = loginData.id.trim();
    const pass = loginData.password;

    if (id === 'Admin123' && pass === 'admin@123') {
      login('admin@stginstitute.in', 'ADMINISTRATOR');
      navigate('/admin');
    } else if (id === 'developer' && pass === 'dev@2026') {
      login('admin@stginstitute.in', 'ADMIN');
      navigate('/admin');
    } else if (id === 'centerabc' && pass === 'abc') {
      login('franchise@stginstitute.in', 'FRANCHISE');
      navigate('/franchise');
    } else if (id === 'teacher' && pass === 'teacher') {
      login('teacher@stginstitute.in', 'TEACHER');
      navigate('/teacher');
    } else if (id === 'student' && pass === 'student') {
      login('student@stginstitute.in', 'STUDENT');
      navigate('/student');
    } else {
      setLoginError('Invalid credentials. Please check the ID and Password.');
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cert = certificates.find(c => c.certificateNo === certId);
    if (cert) {
      setVerificationResult({ status: 'VALID', data: cert });
    } else {
      // Mock result if not found in state (for demo)
      if (certId === 'CERT-12345') {
        setVerificationResult({
          status: 'VALID',
          data: {
            certificateNo: 'CERT-12345',
            studentName: 'Rahul Kumar',
            course: 'Full Stack Web Development',
            issueDate: '2024-05-01',
            status: 'ISSUED'
          }
        });
      } else {
        setVerificationResult({ status: 'INVALID' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 bg-[radial-gradient(#A0AEB9_1px,transparent_1px)] [background-size:20px_20px]">
      <div className="w-full max-w-4xl mb-8 flex justify-start">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#888888] hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          <span>Back to Main Website</span>
        </Link>
      </div>
      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E5E5E5]">
        
        {/* Left Side: Branding/Intro */}
        <div className="bg-[#141414] text-white p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-8">
              {businessProfile.logoUrl ? (
                <img 
                  src={businessProfile.logoUrl} 
                  alt="Logo" 
                  className="w-14 h-14 object-contain p-2 bg-white/10 rounded-xl shadow-lg border border-white/5" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center p-1 shadow-lg shadow-blue-500/20">
                  <ShieldCheck className="text-white" size={28} />
                </div>
              )}
              <div>
                 <span className="text-xl font-black tracking-tight block leading-none uppercase truncate max-w-[200px]">
                   {businessProfile.name.split(' ')[0]}
                 </span>
                 <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest truncate max-w-[200px]">
                   {businessProfile.name.split(' ').slice(1).join(' ') || 'WORKSPACE'}
                 </span>
              </div>
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-tight mb-4 uppercase">
              {businessProfile.name.split(' ').slice(0, 2).join(' ')} <br/> 
              {businessProfile.name.split(' ').slice(2, 4).join(' ')} <br/>
              <span className="text-blue-500 underline decoration-blue-500/30">Workspace.</span>
            </h1>
            <p className="text-[#888888] leading-relaxed">
              {businessProfile.mission}
            </p>
          </div>

          <div className="mt-12 space-y-6 relative z-10">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-[#2A2A2A] rounded-lg"><ShieldCheck size={20} /></div>
              <p className="text-sm">Secure QR-based Certificate Verification</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-[#2A2A2A] rounded-lg"><Wallet size={20} /></div>
              <p className="text-sm">Real-time Franchise Profit Sharing</p>
            </div>
          </div>
          
          {/* Abstract blobs */}
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#E4E3E0] rounded-full opacity-5 blur-3xl"></div>
          <div className="absolute top-1/2 -right-32 w-64 h-64 bg-[#666666] rounded-full opacity-5 blur-3xl"></div>
        </div>

        {/* Right Side: Interactive Forms */}
        <div className="p-12 flex flex-col">
          <div className="flex space-x-8 mb-12 border-b border-[#F0F0F0]">
            <button 
              onClick={() => setActiveTab('LOGIN')}
              className={clsx(
                "pb-4 text-sm font-bold tracking-widest uppercase transition-all relative",
                activeTab === 'LOGIN' ? "text-[#141414]" : "text-[#888888]"
              )}
            >
              Portal Login
              {activeTab === 'LOGIN' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#141414]" />}
            </button>
            <button 
              onClick={() => setActiveTab('VERIFY')}
              className={clsx(
                "pb-4 text-sm font-bold tracking-widest uppercase transition-all relative",
                activeTab === 'VERIFY' ? "text-[#141414]" : "text-[#888888]"
              )}
            >
              Verify Certificate
              {activeTab === 'VERIFY' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#141414]" />}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'LOGIN' ? (
              <motion.div 
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-[#141414]">Portal Login</h2>
                    <p className="text-sm text-[#888888]">Choose your portal or enter credentials.</p>
                  </div>

                  {/* Portal Selection Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button 
                      onClick={() => handleQuickLogin('Admin123', 'admin@123')}
                      className="p-3 bg-gray-50 border border-gray-100 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all text-left flex items-start space-x-3 group"
                    >
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <ShieldCheck size={18} />
                      </div>
                      <div>
                        <span className="block text-[10px] font-black uppercase tracking-widest text-[#141414]">Master Panel</span>
                        <span className="text-[9px] font-medium text-[#888888]">Administrator</span>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleQuickLogin('centerabc', 'abc')}
                      className="p-3 bg-gray-50 border border-gray-100 rounded-xl hover:border-purple-600 hover:bg-purple-50 transition-all text-left flex items-start space-x-3 group"
                    >
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <UserPlus size={18} />
                      </div>
                      <div>
                        <span className="block text-[10px] font-black uppercase tracking-widest text-[#141414]">Franchise Panel</span>
                        <span className="text-[9px] font-medium text-[#888888]">Regional Head</span>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleQuickLogin('teacher', 'teacher')}
                      className="p-3 bg-gray-50 border border-gray-100 rounded-xl hover:border-green-600 hover:bg-green-50 transition-all text-left flex items-start space-x-3 group"
                    >
                      <div className="p-2 bg-green-100 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
                        <GraduationCap size={18} />
                      </div>
                      <div>
                        <span className="block text-[10px] font-black uppercase tracking-widest text-[#141414]">Faculty Panel</span>
                        <span className="text-[9px] font-medium text-[#888888]">Instructors</span>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleQuickLogin('student', 'student')}
                      className="p-3 bg-gray-50 border border-gray-100 rounded-xl hover:border-amber-600 hover:bg-amber-50 transition-all text-left flex items-start space-x-3 group"
                    >
                      <div className="p-2 bg-amber-100 text-amber-600 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        <QrCode size={18} />
                      </div>
                      <div>
                        <span className="block text-[10px] font-black uppercase tracking-widest text-[#141414]">Student Panel</span>
                        <span className="text-[9px] font-medium text-[#888888]">Learners</span>
                      </div>
                    </button>
                  </div>

                  <div className="relative py-2 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <span className="relative z-10 px-4 bg-white text-[9px] font-black text-[#888888] uppercase tracking-widest">Or Manual Login</span>
                  </div>

                   <form onSubmit={handleManualLogin} className="space-y-4 pt-0" autoComplete="off">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">User ID</label>
                    <input 
                      type="text" 
                      value={loginData.id}
                      autoComplete="off"
                      onChange={(e) => setLoginData({...loginData, id: e.target.value})}
                      className="w-full p-4 bg-[#F5F5F5] border-none rounded-2xl focus:ring-2 focus:ring-[#141414] outline-hidden text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Password</label>
                    <input 
                      type="password" 
                      value={loginData.password}
                      autoComplete="new-password"
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      className="w-full p-4 bg-[#F5F5F5] border-none rounded-2xl focus:ring-2 focus:ring-[#141414] outline-hidden text-sm"
                    />
                  </div>
                  {loginError && <p className="text-xs text-red-500 font-medium">{loginError}</p>}
                  <button type="submit" className="w-full py-4 bg-[#141414] text-white text-sm font-bold rounded-2xl hover:bg-[#2A2A2A] transition-all shadow-lg">
            Sign In to Workspace
          </button>
        </form>
      </motion.div>
    ) : (
      <motion.div 
        key="verify"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#141414] uppercase">Identity Verification</h2>
          <p className="text-sm text-[#888888]">Verify student credentials against our national database.</p>
        </div>

                <form onSubmit={handleVerify} className="space-y-4">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={certId}
                      onChange={(e) => setCertId(e.target.value)}
                      placeholder="Enter Certificate Number (e.g. CERT-12345)"
                      className="w-full p-4 bg-[#F5F5F5] border-none rounded-2xl focus:ring-2 focus:ring-[#141414] outline-hidden text-sm"
                    />
                    <button type="submit" className="absolute right-2 top-2 p-2 bg-[#141414] text-white rounded-xl hover:bg-[#2A2A2A] transition-colors">
                      <Search size={20} />
                    </button>
                  </div>
                </form>

                <AnimatePresence>
                  {verificationResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={clsx(
                        "p-6 rounded-2xl border flex items-start space-x-4",
                        verificationResult.status === 'VALID' ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                      )}
                    >
                      {verificationResult.status === 'VALID' ? (
                        <>
                          <CheckCircle2 className="text-green-600 mt-1" size={24} />
                          <div>
                            <p className="text-green-800 font-bold">Valid Certificate</p>
                            <div className="mt-2 space-y-1 text-xs text-green-700">
                              <p><span className="font-semibold">Student:</span> {verificationResult.data.studentName}</p>
                              <p><span className="font-semibold">Course:</span> {verificationResult.data.course}</p>
                              <p><span className="font-semibold">Issued:</span> {verificationResult.data.issueDate}</p>
                              <p><span className="font-semibold">ID:</span> {verificationResult.data.certificateNo}</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="text-red-600 mt-1" size={24} />
                          <div>
                            <p className="text-red-800 font-bold">Invalid Reference</p>
                            <p className="text-xs text-red-600 mt-1">We couldn't find any certificates matching this ID in our records.</p>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="flex items-center justify-center space-x-4 text-[#888888]">
                   <div className="h-px bg-[#F0F0F0] flex-1"></div>
                   <QrCode size={16} />
                   <div className="h-px bg-[#F0F0F0] flex-1"></div>
                </div>
                <button className="w-full p-4 border-2 border-dashed border-[#E5E5E5] text-[#888888] rounded-2xl hover:bg-[#F9F9F9] transition-colors flex items-center justify-center space-x-2">
                  <QrCode size={20} />
                  <span className="text-sm font-medium">Scan QR Code</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <p className="mt-auto pt-8 text-[10px] text-[#888888] text-center font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} {businessProfile.name} • Empowering Education
          </p>
        </div>
      </div>
    </div>
  );
};
