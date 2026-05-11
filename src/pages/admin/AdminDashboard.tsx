/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Wallet, 
  Award, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  ClipboardList,
  Target,
  ShieldCheck,
  Zap,
  TrendingUp,
  MoreVertical,
  ChevronRight,
  Plus,
  RefreshCw,
  Search,
  Bell,
  UserPlus,
  BookOpen,
  CreditCard,
  Megaphone,
  FileText,
  Settings
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

interface CenterCardProps {
  name: string;
  id: string;
  status: string;
  logo: string;
}

const CenterCard: React.FC<CenterCardProps> = ({ name, id, status, logo }) => {
  const navigate = useNavigate();
  return (
    <motion.div 
      whileHover={{ y: -10, scale: 1.02 }}
      className="group relative bg-white rounded-[2.5rem] p-8 flex flex-col items-center text-center border border-gray-100 shadow-xl hover:shadow-blue-200 transition-all cursor-pointer"
      onClick={() => navigate('/admin/franchises')}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-100 transition-all"></div>
      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl p-3 mb-6 shadow-inner flex items-center justify-center group-hover:scale-110 transition-transform">
          <img src={logo} alt="Branch Symbol" className="w-full h-full object-contain" />
        </div>
        <h3 className="text-sm font-black tracking-tight mb-2 uppercase leading-tight text-[#141414]">{name}</h3>
        <p className="text-[10px] font-black text-[#888888] mb-6 uppercase tracking-widest">ID: {id}</p>
        <div className="flex items-center space-x-2 w-full">
           <span className={clsx(
              "flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-white shadow-lg",
              status === 'Active' ? "bg-emerald-500 shadow-emerald-200" : "bg-red-500 shadow-red-200"
            )}>
              {status}
            </span>
            <button className="p-2 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
               <ChevronRight size={14} />
            </button>
        </div>
      </div>
    </motion.div>
  );
};

const AdminStatCard = ({ title, value, icon: Icon, trend, color, gradient }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={clsx("relative overflow-hidden p-8 rounded-[2.5rem] shadow-2xl border border-white/20 text-white", gradient)}
  >
    <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
    <div className="relative z-10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
          <Icon size={24} />
        </div>
        {trend && (
           <div className="flex items-center space-x-1 px-2 py-1 bg-black/10 rounded-full text-[10px] font-bold uppercase tracking-widest">
              {trend > 0 ? <TrendingUp size={10} /> : <ArrowDownRight size={10} />}
              <span>{trend > 0 ? '+' : ''}{trend}%</span>
           </div>
        )}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">{title}</p>
        <p className="text-4xl font-black tracking-tighter">{value}</p>
      </div>
    </div>
  </motion.div>
);

export const AdminDashboard = () => {
  const { franchises, students, feePayments, enquiries, businessTransactions, businessProfile, certificates, courses } = useApp();
  const navigate = useNavigate();

  // Metrics
  const totalStudents = students.length;
  const totalBranches = franchises.length;
  const activeBranches = franchises.filter(f => f.status === 'APPROVED').length;
  const totalIncome = feePayments.reduce((sum, p) => sum + p.paidAmount, 0);

  const last6Months = [
    { month: 'Jan', revenue: 45000, students: 12 },
    { month: 'Feb', revenue: 52000, students: 45 },
    { month: 'Mar', revenue: 48000, students: 28 },
    { month: 'Apr', revenue: 61000, students: 54 },
    { month: 'May', revenue: 55000, students: 42 },
    { month: 'Jun', revenue: 72000, students: 80 },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-gray-100">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center p-2 shadow-xl shadow-blue-200">
                <ShieldCheck className="text-white" />
             </div>
             <h1 className="text-3xl font-black text-[#141414] tracking-tight uppercase leading-none">Administration</h1>
          </div>
          <p className="text-sm font-bold text-[#888888] uppercase tracking-widest">{businessProfile.name} • GLOBAL MASTER PANEL</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
           <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Real-time Sync Active</span>
           </div>
           <button 
             onClick={() => navigate('/admin/business')}
             className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-400 hover:text-blue-600 transition-colors"
           >
              <RefreshCw size={20} />
           </button>
           <button 
             onClick={() => navigate('/admin/registration')}
             className="px-8 py-3 bg-[#141414] text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all flex items-center space-x-2 shadow-xl"
           >
              <Plus size={18} />
              <span>Register Branch</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard 
          title="Total Students" 
          value={totalStudents} 
          icon={Users} 
          trend={12} 
          gradient="bg-gradient-to-br from-blue-600 to-blue-800" 
        />
        <AdminStatCard 
          title="Active Branches" 
          value={`${activeBranches}/${totalBranches}`} 
          icon={Activity} 
          trend={5} 
          gradient="bg-gradient-to-br from-indigo-500 to-indigo-700" 
        />
        <AdminStatCard 
          title="Total Revenue" 
          value={`₹${totalIncome.toLocaleString()}`} 
          icon={Wallet} 
          trend={18} 
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-700" 
        />
        <AdminStatCard 
          title="Curriculums" 
          value={courses.length} 
          icon={Award} 
          trend={0} 
          gradient="bg-gradient-to-br from-amber-500 to-amber-700" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-[3rem] p-10 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50 rounded-full blur-[100px] -mr-40 -mt-40"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-12">
              <div>
                 <h3 className="text-xl font-black text-[#141414] uppercase tracking-tight">Revenue Analytics</h3>
                 <p className="text-[10px] text-[#888888] font-black uppercase tracking-[0.2em] mt-1">Cross-Branch Financial Forecast</p>
              </div>
              <div className="flex items-center space-x-2">
                 <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors"><Bell size={18} className="text-gray-400" /></button>
                 <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors"><MoreVertical size={18} className="text-gray-400" /></button>
              </div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={last6Months}>
                  <defs>
                    <linearGradient id="colorAdminRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 900, fill: '#888888' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 900, fill: '#888888' }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontWeight: 'bold' }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorAdminRev)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-[#141414] rounded-[3rem] p-10 flex flex-col shadow-2xl relative overflow-hidden text-white">
           <div className="absolute bottom-0 left-0 w-full h-1/2 bg-blue-600/10 blur-[80px]"></div>
           <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center space-x-3 mb-10">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center p-3 border border-white/10">
                    <Zap className="text-blue-400" />
                 </div>
                 <div>
                    <h3 className="text-lg font-black uppercase tracking-tight">System Utilization</h3>
                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Across all nodes</p>
                 </div>
              </div>
              
              <div className="space-y-8 flex-1">
                 <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                       <span className="text-white/60">Storage used</span>
                       <span className="text-blue-400">42%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: '42%' }} className="h-full bg-blue-500 rounded-full" />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                       <span className="text-white/60">Server Load</span>
                       <span className="text-emerald-400">18%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: '18%' }} className="h-full bg-emerald-500 rounded-full" />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                       <span className="text-white/60">Bandwidth</span>
                       <span className="text-amber-400">65%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-amber-500 rounded-full" />
                    </div>
                 </div>
              </div>

              <button className="w-full mt-10 py-4 bg-white text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-400 hover:text-white transition-all shadow-xl">
                 Performance Report
              </button>
           </div>
        </div>
      </div>

      <div className="py-12">
        <h2 className="text-xl font-black text-[#141414] uppercase tracking-tight mb-8 ml-2">Quick Access Portal</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[
            { label: 'Enroll Member', icon: UserPlus, color: 'bg-blue-600', path: '/admin/registration' },
            { label: 'Manage Courses', icon: BookOpen, color: 'bg-indigo-600', path: '/admin/courses' },
            { label: 'Announcements', icon: Megaphone, color: 'bg-amber-600', path: '/admin/announcements' },
            { label: 'Exams Portal', icon: FileText, color: 'bg-purple-600', path: '/admin/exams' },
            { label: 'Business Profile', icon: Settings, color: 'bg-slate-600', path: '/admin/business' },
          ].map((item, i) => (
            <button 
              key={i}
              onClick={() => navigate(item.path)}
              className="group flex flex-col items-center justify-center p-8 bg-white border border-gray-100 rounded-[2.5rem] hover:shadow-2xl hover:border-blue-100 transition-all space-y-4"
            >
              <div className={`${item.color} p-4 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <item.icon size={20} />
              </div>
              <span className="text-[10px] font-black text-[#141414] uppercase tracking-widest text-center">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-10 px-2">
           <div>
              <h2 className="text-xl font-black text-[#141414] uppercase tracking-tight">Authorized Branches</h2>
              <p className="text-xs font-black text-[#888888] uppercase tracking-widest mt-1">Status of all registered centers</p>
           </div>
           <button 
             onClick={() => navigate('/admin/franchises')}
             className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] hover:bg-blue-50 px-6 py-3 rounded-xl transition-all border border-blue-100"
           >
             View Directory
           </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {franchises.length > 0 ? (
            franchises.slice(0, 4).map(franchise => (
              <CenterCard 
                key={franchise.id} 
                name={franchise.name} 
                id={franchise.id} 
                status={franchise.status === 'APPROVED' ? 'Active' : 'Blocked'} 
                logo={franchise.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${franchise.id}&backgroundColor=3b82f6`} 
              />
            ))
          ) : (
            <div className="col-span-4 p-20 border-2 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-4">
               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                  <Activity size={40} />
               </div>
               <p className="text-sm font-black text-[#888888] uppercase tracking-widest">No Authorized Centers Registered Yet</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <div className="bg-white border border-gray-100 rounded-[3rem] p-10 space-y-8 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-50 pb-6">
               <h3 className="text-lg font-black text-[#141414] uppercase tracking-tight flex items-center">
                 <ClipboardList className="mr-3 text-blue-600" />
                 Recent Student Registrations
               </h3>
               <button onClick={() => navigate('/admin/students')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Full Audit</button>
            </div>
            <div className="space-y-4">
               {students.slice(0, 4).map(student => (
                  <div key={student.id} className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-lg transition-all group">
                     <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-blue-600 border border-gray-100 shadow-sm transition-transform group-hover:scale-110">
                           {student.name.charAt(0)}
                        </div>
                        <div>
                           <p className="text-sm font-black text-[#141414] uppercase">{student.name}</p>
                           <p className="text-[10px] text-[#888888] font-black uppercase tracking-widest mt-1">{student.course}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(student.admissionDate).toLocaleDateString()}</p>
                        <p className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black uppercase rounded-md inline-block mt-1">Confirmed</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="bg-white border border-gray-100 rounded-[3rem] p-10 space-y-8 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-50 pb-6">
               <h3 className="text-lg font-black text-[#141414] uppercase tracking-tight flex items-center">
                 <TrendingUp className="mr-3 text-emerald-600" />
                 Recent Admission Inquiries
               </h3>
               <button onClick={() => navigate('/admin/enquiries')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Conversion Tool</button>
            </div>
            <div className="space-y-4">
               {enquiries.slice(0, 4).map(enquiry => (
                  <div key={enquiry.id} className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-lg transition-all group">
                     <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-amber-600 border border-gray-100 shadow-sm transition-transform group-hover:scale-110">
                           {enquiry.name.charAt(0)}
                        </div>
                        <div>
                           <p className="text-sm font-black text-[#141414] uppercase">{enquiry.name}</p>
                           <p className="text-[10px] text-[#888888] font-black uppercase tracking-widest mt-1">{enquiry.course}</p>
                        </div>
                     </div>
                     <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm transition-all ${
                        enquiry.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                        enquiry.status === 'FOLLOWED_UP' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        'bg-emerald-50 text-emerald-600 border-emerald-100'
                     }`}>
                        {enquiry.status.replace('_', ' ')}
                     </span>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

