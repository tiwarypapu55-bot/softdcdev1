import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { motion } from 'motion/react';
import { Clock, BookOpen, Star, ArrowRight, CheckCircle2, ChevronRight, GraduationCap } from 'lucide-react';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { courses } = useApp();
  
  const course = courses.find(c => c.id === id);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Course Not Found</h1>
          <Link to="/courses" className="text-blue-600 font-bold hover:underline">Back to All Courses</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Header */}
      <section className="bg-[#141414] text-white py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-12 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} className="text-gray-600" />
            <Link to="/courses" className="text-gray-400 hover:text-white transition-colors">Courses</Link>
            <ChevronRight size={14} className="text-gray-600" />
            <span className="text-blue-400 font-bold">{course.title}</span>
          </div>
          
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-6"
            >
              {course.category}
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-7xl font-black tracking-tighter uppercase leading-none mb-8"
            >
              {course.title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-400 leading-relaxed mb-10"
            >
              {course.description}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-8 items-center"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Clock className="text-blue-400" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-black tracking-widest">Duration</p>
                  <p className="font-bold">{course.duration}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <GraduationCap className="text-blue-400" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-black tracking-widest">Level</p>
                  <p className="font-bold">{course.level}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Star className="text-yellow-400 fill-yellow-400" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-black tracking-widest">Rating</p>
                  <p className="font-bold">{course.rating} / 5.0</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              <div className="bg-white rounded-[3rem] p-10 lg:p-16 shadow-2xl shadow-gray-200/50">
                <h2 className="text-3xl font-black text-[#141414] uppercase tracking-tight mb-8 flex items-center space-x-4">
                  <BookOpen className="text-blue-600" />
                  <span>Course Overview</span>
                </h2>
                <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed font-medium">
                  {course.longDescription || course.description}
                </div>
              </div>

              {course.features && course.features.length > 0 && (
                <div className="bg-white rounded-[3rem] p-10 lg:p-16 shadow-2xl shadow-gray-200/50">
                  <h2 className="text-3xl font-black text-[#141414] uppercase tracking-tight mb-8">What You'll Learn</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {course.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-2xl group hover:bg-blue-600 hover:text-white transition-all duration-300">
                        <div className="mt-1">
                          <CheckCircle2 className="text-blue-600 group-hover:text-white transition-colors" size={20} />
                        </div>
                        <p className="font-bold uppercase tracking-tight text-sm">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar / CTA */}
            <div className="space-y-8">
              <div className="sticky top-32">
                <div className="bg-blue-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-blue-500/30">
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Enroll Today</h3>
                  <p className="text-blue-100 mb-8 font-medium">Transform your career with specialized training and industry recognition.</p>
                  
                  <Link 
                    to="/student-zone?tab=registration" 
                    className="flex items-center justify-center space-x-3 w-full py-5 bg-white text-blue-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#141414] hover:text-white transition-all"
                  >
                    <span>Register Now</span>
                    <ArrowRight size={16} />
                  </Link>

                  <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-blue-200">
                      <span>Placement Support</span>
                      <CheckCircle2 size={16} />
                    </div>
                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-blue-200">
                      <span>Live Labs</span>
                      <CheckCircle2 size={16} />
                    </div>
                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-blue-200">
                      <span>Certification</span>
                      <CheckCircle2 size={16} />
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-white rounded-3xl p-8 shadow-xl border border-gray-100 italic font-medium text-gray-500 text-sm leading-relaxed">
                  "The quality of training at Softdev Guru exceeded my expectations. The practical approach to Tally and GST helped me land a job within weeks of completion."
                  <div className="mt-4 font-black uppercase tracking-widest text-[10px] text-[#141414]">— Rohit Kumar, Alumnus</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetail;
