/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WebsiteLayout } from '../../components/WebsiteLayout';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, BookOpen, Users, Award, Target, Globe, Zap, TrendingUp, Handshake, Laptop, Download, FileText, Send, UserPlus } from 'lucide-react';
import { EnquiryForm } from '../../components/EnquiryForm';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { clsx } from 'clsx';

export const WebsiteHome = () => {
  const { businessProfile, courses } = useApp();
  const BANNERS = businessProfile.banners && businessProfile.banners.length > 0 
    ? businessProfile.banners 
    : ['/softdev_banner_1.png', '/softdev_banner_2.png', '/softdev_banner_3.png'];
    
  const [currentBanner, setCurrentBanner] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [BANNERS.length]);

  return (
    <WebsiteLayout>
      {/* Hero Slider Section */}
      <section className="relative h-[600px] lg:h-[800px] overflow-hidden bg-[#141414]">
        <AnimatePresence>
          <motion.div
            key={currentBanner}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
            <img 
              src={BANNERS[currentBanner]} 
              alt={`Softdev Banner ${currentBanner + 1}`} 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-20 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center pointer-events-none">
           {/* Content removed from slider to allow full visibility */}
        </div>

        {/* Slider Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
           {BANNERS.map((_, idx) => (
             <button 
               key={idx}
               onClick={() => setCurrentBanner(idx)}
               className={clsx(
                 "h-1.5 transition-all rounded-full",
                 currentBanner === idx ? "w-12 bg-blue-600" : "w-4 bg-white/30 hover:bg-white/50"
               )}
             />
           ))}
        </div>
      </section>

      {/* Hero Content Section (Moved Outside Slider) */}
      <section className="py-20 bg-white relative z-20 shadow-xl mx-6 lg:mx-24 rounded-[3rem] border border-gray-100">
        <div className="max-w-6xl mx-auto px-8 lg:px-16 text-center">
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             className="space-y-8"
           >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full">
                <Zap size={14} className="fill-blue-600" />
                <span className="text-[10px] font-black uppercase tracking-widest">Enrollment Open for 2026</span>
              </div>
              
              <p className="text-xl lg:text-2xl text-[#141414] font-bold max-w-3xl mx-auto leading-relaxed">
                Join India's most trusted computer education network. Professional certifications that accelerate your career growth.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-8 pt-4">
                 <Link to="/student-zone?tab=registration" className="px-10 py-5 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-[#141414] transition-all shadow-2xl shadow-blue-500/20 flex items-center space-x-2">
                    <UserPlus size={14} />
                    <span>Online Registration</span>
                 </Link>
                 <Link to="/courses" className="px-10 py-5 bg-white text-[#141414] border-2 border-gray-100 text-xs font-black uppercase tracking-widest rounded-2xl hover:border-blue-600 transition-all">Explore Courses</Link>
                 
                 <div className="flex flex-wrap items-center justify-center gap-6 w-full lg:w-auto lg:border-l lg:border-gray-100 lg:pl-8">
                   <button 
                     onClick={() => {
                       if (businessProfile.prospectus?.url) {
                         const link = document.createElement('a');
                         link.href = businessProfile.prospectus.url;
                         link.download = businessProfile.prospectus.name;
                         link.click();
                       } else {
                         alert("No prospectus uploaded yet.");
                       }
                     }}
                     className="text-[#888888] hover:text-blue-600 text-[10px] font-black uppercase tracking-widest transition-all flex items-center space-x-2"
                   >
                     <Download size={14} />
                     <span>Download Prospectus</span>
                   </button>
                   <Link to="/franchise-info" className="text-[#888888] hover:text-blue-600 text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 group">
                      <span>Partner With Us</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-all" />
                   </Link>
                 </div>
              </div>
           </motion.div>
        </div>
      </section>

      {/* Featured Courses Banner */}
      <section className="py-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white/60 backdrop-blur-xl rounded-[4rem] p-8 lg:p-16 border border-white/20 shadow-2xl overflow-hidden relative group">
              <div className="space-y-8 relative z-10">
                 <div className="inline-block px-4 py-2 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">Explore Curriculums</div>
                 <h2 className="text-4xl lg:text-5xl font-black text-[#141414] tracking-tight uppercase leading-none">Our Specialized <br/> Professional Courses</h2>
                 <p className="text-[#888888] font-medium leading-relaxed max-w-md">From CCC to Advanced O-Level, we offer courses that are synchronized with the latest industry standards.</p>
                 <Link to="/courses" className="inline-flex items-center space-x-3 px-8 py-4 bg-[#141414] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all">
                    <span>View All Courses</span>
                    <ArrowRight size={14} />
                 </Link>
              </div>
              <div className="relative">
                 <div className="absolute inset-0 bg-blue-600/10 blur-3xl rounded-full scale-150" />
                 <img 
                    src="/softdev_banner_2.png" 
                    alt="Courses Banner" 
                    className="w-full relative z-10 rounded-3xl shadow-2xl transform group-hover:scale-105 transition-transform duration-700" 
                 />
              </div>
           </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-background py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
           <p className="text-center text-[10px] font-black text-[#888888] uppercase tracking-widest mb-10">Our Strategic Training Partners</p>
           <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex flex-col items-center">
                <p className="text-xl font-black tracking-tighter text-[#141414]">TALLY SOLUTIONS</p>
                <span className="text-[8px] font-bold uppercase">Authorized Center</span>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xl font-black tracking-tighter text-[#141414]">MICROSOFT EDU</p>
                <span className="text-[8px] font-bold uppercase">Certified Courses</span>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xl font-black tracking-tighter text-[#141414]">NSDC INDIA</p>
                <span className="text-[8px] font-bold uppercase">Skill Partner</span>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xl font-black tracking-tighter text-[#141414]">ADOBE ACADEMY</p>
                <span className="text-[8px] font-bold uppercase">Creative Suite</span>
              </div>
           </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
             <div className="space-y-4">
                <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Our Elite Coursework</p>
                <h2 className="text-4xl lg:text-5xl font-black text-[#141414] tracking-tight leading-none">
                  TRANSFORM INTO AN <br/> ACCOUNTING POWERHOUSE
                </h2>
             </div>
             <Link to="/courses" className="text-xs font-black uppercase tracking-widest text-[#141414] hover:text-blue-600 flex items-center space-x-2 transition-colors">
                <span>View Full Catalog</span>
                <ArrowRight size={14} />
             </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.slice(0, 3).map((course, i) => (
              <Link to={`/courses/${course.id}`} key={i}>
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="group relative p-8 h-full bg-white/60 backdrop-blur-md border border-white/40 rounded-[3rem] overflow-hidden shadow-xl shadow-blue-900/5 transition-all flex flex-col"
                >
                  <div className={`p-4 ${i === 0 ? 'bg-blue-600' : i === 1 ? 'bg-emerald-600' : 'bg-purple-600'} text-white rounded-2xl w-fit mb-8`}>
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-xl font-black text-[#141414] mb-4">{course.title}</h3>
                  <p className="text-sm text-[#888888] font-medium leading-relaxed mb-8 flex-1">{course.description}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <Zap size={14} className="text-[#141414]" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{course.duration}</span>
                    </div>
                    <ArrowRight size={18} className="text-[#888888] group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Director's Message Section */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative group lg:order-2"
            >
              <div className="absolute inset-0 bg-blue-600 rounded-[4rem] rotate-3 -z-10 opacity-10 group-hover:rotate-6 transition-transform duration-500"></div>
              <div className="absolute inset-0 bg-[#141414] rounded-[4rem] -rotate-3 -z-10 group-hover:-rotate-6 transition-transform duration-500"></div>
              <div className="aspect-[4/5] max-w-[400px] mx-auto rounded-[4rem] overflow-hidden shadow-2xl relative border-4 border-white">
                <img 
                  src={businessProfile.directorPhotoUrl || "/director.jpg"} 
                  alt={businessProfile.directorName || "Director and Founder"} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414]/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-12 left-12">
                   <h3 className="text-3xl font-black text-white tracking-widest uppercase mb-1">{businessProfile.directorName || 'Director & Founder'}</h3>
                   <p className="text-xs font-black text-blue-400 uppercase tracking-widest">{businessProfile.name}</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10 lg:order-1"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.25em]">
                  <span className="w-8 h-[2px] bg-blue-600"></span>
                  <span>Leadership Vision</span>
                </div>
                <h2 className="text-5xl lg:text-7xl font-black text-[#141414] tracking-tighter uppercase leading-[0.9]">
                  A Message <br/> <span className="text-blue-600">FROM OUR</span> <br/> DIRECTOR
                </h2>
              </div>

              <div className="space-y-6 text-[#888888] font-medium leading-relaxed">
                {businessProfile.directorMessage ? (
                  <div className="whitespace-pre-wrap">{businessProfile.directorMessage}</div>
                ) : (
                  <>
                    <p>
                      "At Softdev Guru, our mission has always been clear: to bridge the gap between traditional education and the rapidly evolving demands of the global digital economy. We don't just teach software; we cultivate a mindset of innovation and practical excellence."
                    </p>
                    <p>
                      Over the past decade, we have empowered thousands of students across India to master complex financial tools and accounting frameworks. Our commitment to project-based learning and industry-aligned certification continues to be a cornerstone of our success.
                    </p>
                  </>
                )}
                <p className="border-l-4 border-blue-600 pl-6 italic text-[#141414]">
                  "Your journey towards professional mastery starts with a single step of curiosity. We are here to ensure that every step you take is guided by expertise and supported by a community that cares about your growth."
                </p>
                <div className="pt-4 space-y-1">
                  <p className="text-[#141414] font-black text-sm uppercase tracking-tight">Your success is our inspiration. Your progress is our purpose.</p>
                  <div className="pt-2">
                    <p className="text-[10px] font-black text-[#888888] uppercase tracking-[0.2em]">Warm Regards,</p>
                    <p className="text-sm font-black text-[#141414] uppercase tracking-tighter">{businessProfile.directorName || 'Director'}</p>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{businessProfile.name} Computer Education Center</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-12 pt-6">
                <div>
                   <p className="text-xs font-black text-[#888888] uppercase tracking-widest mb-1">Affiliations</p>
                   <div className="flex gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                         <span className="text-[10px] font-black italic">MSME</span>
                      </div>
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                         <span className="text-[10px] font-black italic">ISO</span>
                      </div>
                   </div>
                </div>
                <div className="h-12 w-[1px] bg-gray-100"></div>
                <Link to="/about" className="inline-flex items-center space-x-3 text-xs font-black uppercase tracking-widest text-[#141414] group group-hover:text-blue-600">
                  <span>Read Full History</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Softdev */}
      <section className="py-32 bg-[#141414] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600 skew-x-12 translate-x-1/2 -z-0 opacity-20"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div className="space-y-4">
                 <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Why Softdev Guru?</p>
                 <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-none">
                    WE DON'T JUST TEACH.<br/> WE REVOLUTIONIZE.
                 </h2>
              </div>
              
              <div className="space-y-8">
                 {[
                   { title: 'Project-Based Learning', text: 'Work on actual accounting software with live business data sets.', icon: Target },
                   { title: 'Certification That Matters', text: 'Softdev certificates are recognized by leading audit firms in India.', icon: Award },
                   { title: 'Lifetime Support', text: 'Our alumni get lifetime access to updated course materials and job support.', icon: Handshake }
                 ].map((item, i) => (
                   <div key={i} className="flex items-start space-x-6">
                      <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-blue-400">
                         <item.icon size={24} />
                      </div>
                      <div>
                         <h4 className="text-lg font-black">{item.title}</h4>
                         <p className="text-sm text-gray-400 mt-1 font-medium leading-relaxed">{item.text}</p>
                      </div>
                   </div>
                 ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-6 pt-12">
                  <div className="p-8 bg-white/5 border border-white/10 rounded-[3rem]">
                     <p className="text-3xl font-black text-blue-400 mb-2">250+</p>
                     <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Branches Pan India</p>
                  </div>
                  <div className="p-8 bg-blue-600 rounded-[3rem]">
                     <p className="text-3xl font-black text-white mb-2">100%</p>
                     <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">Practical Oriented</p>
                  </div>
               </div>
               <div className="space-y-6">
                  <div className="p-8 bg-white rounded-[3rem] text-[#141414]">
                     <p className="text-3xl font-black text-blue-600 mb-2">A++</p>
                     <p className="text-[10px] font-black uppercase tracking-widest text-[#888888]">Institutional Rating</p>
                  </div>
                  <div className="p-8 bg-white/5 border border-white/10 rounded-[3rem]">
                     <p className="text-3xl font-black text-white mb-2">Elite</p>
                     <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Placement Partners</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Preview Section */}
      {businessProfile.gallery && businessProfile.gallery.length > 0 && (
        <section className="py-32 bg-transparent">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-6 md:space-y-0">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.25em]">
                  <span className="w-8 h-[2px] bg-emerald-600"></span>
                  <span>Institute Life</span>
                </div>
                <h2 className="text-5xl lg:text-7xl font-black text-[#141414] tracking-tighter uppercase leading-[0.9]">
                  Campus <br/> <span className="text-emerald-600">IN FOCUS</span>
                </h2>
              </div>
              <Link 
                to="/gallery" 
                className="px-8 py-4 bg-[#141414] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-600 transition-all shadow-xl"
              >
                View Full Gallery
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {businessProfile.gallery.slice(0, 3).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="aspect-square bg-gray-50 rounded-[3rem] overflow-hidden border border-gray-100 relative shadow-lg">
                    <img 
                      src={item.url} 
                      alt={item.caption || 'Gallery image'} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-10">
                      <p className="text-white font-black uppercase tracking-tight text-lg">
                        {item.caption || 'Institute Moment'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Prospectus Section */}
      <section className="py-32 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-[#141414] rounded-[4rem] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-full h-full bg-blue-600 skew-x-12 translate-x-3/4 opacity-20 capitalize"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 p-12 lg:p-24 items-center relative z-10">
              <div className="space-y-8">
                <div className="inline-flex items-center space-x-2 text-blue-400 font-black text-[10px] uppercase tracking-widest">
                  <FileText size={16} />
                  <span>Academic Resources</span>
                </div>
                <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-none">
                  Download Our <br/> <span className="text-blue-500">Official 2026</span> <br/> PROSPECTUS
                </h2>
                <p className="text-gray-400 font-medium leading-relaxed max-w-md">
                  Get complete information about our courses, fee structures, examination patterns, and career placement support in one comprehensive document.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => {
                      if (businessProfile.prospectus?.url) {
                        const link = document.createElement('a');
                        link.href = businessProfile.prospectus.url;
                        link.download = businessProfile.prospectus.name;
                        link.click();
                      } else {
                        alert("No prospectus uploaded yet.");
                      }
                    }}
                    className="px-10 py-5 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center space-x-3"
                  >
                    <Download size={18} />
                    <span>Download PDF ({businessProfile.prospectus?.size || '0.0 MB'})</span>
                  </button>
                  <Link to="/courses" className="px-10 py-5 bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center space-x-2">
                    <span>View Courses Online</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
              <div className="relative">
                <motion.div 
                  initial={{ rotate: 10, y: 50 }}
                  whileInView={{ rotate: -5, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white p-4 rounded-2xl shadow-2xl relative z-20 group"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=800" 
                    alt="Prospectus Preview" 
                    className="w-full h-auto rounded-xl grayscale group-hover:grayscale-0 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600/20 backdrop-blur-sm rounded-xl">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-xl">
                      <Download size={24} />
                    </div>
                  </div>
                </motion.div>
                <div className="absolute top-10 -right-10 w-full h-full bg-blue-600 rounded-[3rem] -z-10 rotate-12 opacity-20 blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
           <div className="bg-[#141414] rounded-[5rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl">
              <div className="lg:w-1/2 h-[400px] lg:h-auto">
                 <img 
                   src="/softdev_banner_3.png" 
                   alt="Success Stories" 
                   className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                 />
              </div>
              <div className="lg:w-1/2 p-12 lg:p-24 flex flex-col justify-center space-y-8">
                 <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">Step Into <br/> <span className="text-blue-500">Global Success</span></h2>
                 <p className="text-gray-400 font-medium leading-relaxed">Join thousands of students who have transformed their careers through our practical training programs. Your success story starts at Softdev.</p>
                 <div className="flex items-center space-x-6">
                    <div className="flex -space-x-4">
                       {[1,2,3,4].map(i => (
                         <div key={i} className="w-12 h-12 rounded-full border-2 border-[#141414] bg-gray-800 overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Student" />
                         </div>
                       ))}
                    </div>
                    <p className="text-xs font-black text-white uppercase tracking-widest">+15K Students Success</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Quick Admission Inquiry Section */}
      <section className="py-32 bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
               <div className="inline-flex items-center space-x-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.25em]">
                  <span className="w-8 h-[2px] bg-blue-600"></span>
                  <span>Direct Admission</span>
               </div>
               <h2 className="text-5xl lg:text-7xl font-black text-[#141414] tracking-tighter uppercase leading-[0.9]">
                  SECURE YOUR <br/> <span className="text-blue-600">FUTURE</span> <br/> TODAY
               </h2>
               <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-md">
                 Not sure which course is right for you? Fill out the quick admission inquiry form and let our experts guide your career path.
               </p>
               
               <div className="grid grid-cols-2 gap-8 pt-6">
                  <div>
                     <p className="text-3xl font-black text-[#141414]">24/7</p>
                     <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Counseling Support</p>
                  </div>
                  <div>
                     <p className="text-3xl font-black text-blue-600">100%</p>
                     <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Satisfaction rate</p>
                  </div>
               </div>
            </div>
            
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="p-10 bg-white/60 backdrop-blur-xl border border-white/20 rounded-[4rem] shadow-2xl shadow-blue-100/20"
            >
               <EnquiryForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40">
        <div className="max-w-5xl mx-auto px-6">
          <div className="p-16 lg:p-24 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[4rem] text-center relative overflow-hidden group shadow-2xl shadow-blue-900/10">
             <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-200/50 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
             <div className="relative z-10 space-y-10">
                <h2 className="text-4xl lg:text-6xl font-black text-[#141414] tracking-tight leading-none">READY TO START YOUR SUCCESS STORY?</h2>
                <p className="text-lg text-[#888888] font-medium max-w-xl mx-auto">Take the first step towards a rewarding career in digital accounting and software management.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                   <Link to="/student-zone?tab=registration" className="px-12 py-6 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-3xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200">Online Registration</Link>
                   <Link to="/login" className="px-12 py-6 bg-[#141414] text-white text-xs font-black uppercase tracking-widest rounded-3xl hover:bg-[#2A2A2A] transition-all">Student Portal</Link>
                </div>
             </div>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  );
};
