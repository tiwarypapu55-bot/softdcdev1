/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Smartphone, Mail, MapPin, Facebook, Twitter, Youtube, Linkedin, ExternalLink, User, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { clsx } from 'clsx';

const LOGO_URL = "https://firebasestorage.googleapis.com/v0/b/ais-dev-pzzj54zbvfrllp25htfrww.appspot.com/o/softdev_logo.png?alt=media&token=48c0b58e-7e9b-46a2-97b7-54324f331777";

export const WebsiteLayout = ({ children }: { children: React.ReactNode }) => {
  const { businessProfile } = useApp();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT US', path: '/about' },
    { name: 'COURSES', path: '/courses', hasSub: true },
    { name: 'GALLERY', path: '/gallery', hasSub: true },
    { name: 'FRANCHISE & COLLABORATION', path: '/franchise-info', hasSub: true },
    { name: 'CONTACT US', path: '/contact' },
    { 
      name: 'STUDENT ZONE', 
      path: '/student-zone',
      hasSub: true,
      subLinks: [
        { name: 'Online Registration', path: '/student-zone?tab=registration' },
        { name: 'Student Verification', path: '/student-zone?tab=student-verify' },
        { name: 'Certificate Verification', path: '/student-zone?tab=cert-verify' },
        { name: 'Old Student Verification', path: '/student-zone?tab=old-cert-verify' },
      ]
    },
    { name: 'LOGIN', path: '/login' },
  ];

  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Bar */}
      <div className="bg-[#003366] text-white py-3 px-6 hidden md:block border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Facebook size={14} className="hover:text-blue-400 cursor-pointer transition-colors" />
            <span className="text-white/30 text-xs">|</span>
            <Twitter size={14} className="hover:text-blue-300 cursor-pointer transition-colors" />
            <span className="text-white/30 text-xs">|</span>
            <Youtube size={14} className="hover:text-red-500 cursor-pointer transition-colors" />
            <span className="text-white/30 text-xs">|</span>
            <Linkedin size={14} className="hover:text-blue-400 cursor-pointer transition-colors" />
          </div>

          <div className="flex items-center space-x-8 text-[11px] font-bold">
            <Link to="/franchise-info" className="hover:underline underline-offset-4 decoration-2">Franchise Enquiry</Link>
            <Link to="/contact" className="hover:underline underline-offset-4 decoration-2">Contact Us</Link>
          </div>

          <div className="flex items-center space-x-6 text-[12px] font-bold">
            <div className="flex items-center space-x-2">
              <Smartphone size={16} />
              <span>{businessProfile.phone}</span>
            </div>
            <Link to="/login" className="flex items-center space-x-2 hover:text-blue-200">
              <User size={16} />
              <span>Administrator</span>
            </Link>
            <button 
              onClick={() => {
                if (businessProfile.prospectus?.url) {
                  const link = document.createElement('a');
                  link.href = businessProfile.prospectus.url;
                  link.download = businessProfile.prospectus.name || 'Prospectus.pdf';
                  link.click();
                } else {
                  alert('Prospectus is not available yet.');
                }
              }}
              className="bg-[#0080FF] text-white px-5 py-2.5 rounded-lg text-xs font-black flex items-center space-x-2 hover:bg-white hover:text-[#003366] transition-all"
            >
              <Download size={14} />
              <span>Download Prospectus</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-[#FF8282] text-white shadow-lg overflow-x-auto">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-center">
          {/* Desktop Nav Only Center */}
          <nav className="hidden lg:flex items-center space-x-8 xl:space-x-12">
            {navLinks.map((link) => (
              <div 
                key={link.name} 
                className="relative group"
                onMouseEnter={() => link.subLinks && setActiveDropdown(link.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link 
                  to={link.path}
                  className={clsx(
                    "text-[14px] xl:text-[15px] font-black uppercase tracking-wider transition-all flex items-center space-x-2 py-2 whitespace-nowrap",
                    location.pathname === link.path ? "text-white border-b-4 border-red-600" : "text-white hover:text-white/80"
                  )}
                >
                  <span>{link.name}</span>
                  {(link.subLinks || link.hasSub) && (
                    <motion.span 
                      animate={{ rotate: activeDropdown === link.name ? 180 : 0 }}
                      className="inline-block"
                    >
                      <svg width="12" height="12" viewBox="0 0 8 8" fill="none"><path d="M1 2.5L4 5.5L7 2.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </motion.span>
                  )}
                </Link>

                {link.subLinks && (
                  <AnimatePresence>
                    {activeDropdown === link.name && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white border border-gray-100 shadow-2xl rounded-2xl p-4 space-y-1 mt-2 text-[#141414]"
                      >
                        {link.subLinks.map((sub) => (
                          <Link 
                            key={sub.path}
                            to={sub.path}
                            className="block px-4 py-3 text-[13px] font-bold text-[#888888] hover:text-[#FF8282] hover:bg-red-50 rounded-xl transition-all uppercase tracking-widest"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center justify-between w-full">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full p-1 overflow-hidden">
                <img src={businessProfile.logoUrl || "https://api.dicebear.com/7.x/initials/svg?seed=STG"} alt={businessProfile.name} className="w-full h-full object-contain" />
              </div>
              <span className="font-black text-xs uppercase tracking-tight">{businessProfile.name.split(' ')[0]}</span>
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-white hover:bg-white/10 rounded-xl">
               {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[#802A1E] border-t border-white/10 overflow-hidden"
            >
              <div className="px-6 py-8 flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <div key={link.path} className="space-y-4">
                    <Link 
                      to={link.path}
                      onClick={() => !link.subLinks && setIsMenuOpen(false)}
                      className={clsx(
                        "text-sm font-black uppercase tracking-widest flex items-center justify-between",
                        location.pathname === link.path ? "text-white" : "text-white/60"
                      )}
                    >
                      <span>{link.name}</span>
                    </Link>
                    {link.subLinks && (
                      <div className="grid grid-cols-1 gap-2 pl-4">
                        {link.subLinks.map(sub => (
                          <Link 
                            key={sub.path}
                            to={sub.path}
                            onClick={() => setIsMenuOpen(false)}
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 py-2"
                          >
                            • {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <Link 
                  to="/login" 
                  className="w-full py-4 bg-white text-[#9A3324] text-center text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg"
                >
                  Student/Staff Login
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Page Content */}
      <main className="animate-in fade-in duration-700">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-linear-to-br from-red-700 via-red-600 to-[#FF9933] text-white pt-20 pb-10 shadow-[0_-10px_40px_rgba(220,38,38,0.2)]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-white/20 pb-20">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-full p-1 overflow-hidden shadow-lg">
                <img src={businessProfile.logoUrl || "https://api.dicebear.com/7.x/initials/svg?seed=STG"} alt={businessProfile.name} className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-lg font-black leading-none tracking-tight text-white">{businessProfile.name.split(' ')[0]}</h1>
                <p className="text-[10px] font-bold text-yellow-100 uppercase tracking-widest">{businessProfile.name.split(' ').slice(1).join(' ')}</p>
              </div>
            </div>
            <p className="text-sm text-white/80 leading-relaxed font-medium">{businessProfile.mission}</p>
            <div className="flex items-center space-x-4">
               {/* Social Icons Repeat */}
            </div>
          </div>

          <div>
             <h4 className="text-[11px] font-black uppercase tracking-widest mb-8 text-yellow-200">Quick Links</h4>
             <ul className="space-y-4 text-sm font-bold text-white/70">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/student-zone?tab=registration" className="hover:text-white transition-colors">Online Registration</Link></li>
                <li><Link to="/courses" className="hover:text-white transition-colors">Elite Courses</Link></li>
                <li><Link to="/gallery" className="hover:text-white transition-colors">Campus Gallery</Link></li>
                <li><Link to="/franchise-info" className="hover:text-white transition-colors">Franchise & Collaboration</Link></li>
             </ul>
          </div>

          <div>
             <h4 className="text-[11px] font-black uppercase tracking-widest mb-8 text-yellow-200">Elite Courses</h4>
             <ul className="space-y-4 text-sm font-bold text-white/70">
                <li>Tally Prime with GST</li>
                <li>Advanced Excel</li>
                <li>Office Automation</li>
                <li>Data Analytics</li>
             </ul>
          </div>

          <div>
             <h4 className="text-[11px] font-black uppercase tracking-widest mb-8 text-yellow-200">Contact Us</h4>
             <div className="space-y-6 text-sm text-white/70 font-medium">
                <div className="flex items-start space-x-4">
                   <MapPin size={20} className="text-yellow-100 mt-1 flex-shrink-0" />
                   <div>
                      <p className="text-[9px] font-black uppercase text-yellow-100/50 mb-1">Head Office</p>
                      <p>{businessProfile.address}</p>
                   </div>
                </div>
                {businessProfile.regionalAddress && (
                  <div className="flex items-start space-x-4">
                     <MapPin size={20} className="text-yellow-100 mt-1 flex-shrink-0" />
                     <div>
                        <p className="text-[9px] font-black uppercase text-yellow-100/50 mb-1">Regional Office</p>
                        <p>{businessProfile.regionalAddress}</p>
                     </div>
                  </div>
                )}
                <div className="flex items-center space-x-4">
                   <Smartphone size={20} className="text-yellow-100 flex-shrink-0" />
                   <p>{businessProfile.phone}</p>
                </div>
                <div className="flex items-center space-x-4">
                   <Mail size={20} className="text-yellow-100 flex-shrink-0" />
                   <p>{businessProfile.email}</p>
                </div>
             </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] font-bold uppercase tracking-widest text-white/60">
           <p>© {new Date().getFullYear()} {businessProfile.name}. All Rights Reserved.</p>
           <div className="flex items-center space-x-6">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
           </div>
        </div>
      </footer>
    </div>
  );
};
