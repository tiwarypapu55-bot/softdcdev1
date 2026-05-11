/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Wallet, 
  Award, 
  UserPlus, 
  Clock,
  ArrowRight,
  Plus,
  Bell,
  Search,
  CheckCircle2,
  Users2,
  TrendingUp,
  Calendar,
  DollarSign,
  Briefcase,
  FileText,
  ChevronRight,
  RefreshCw,
  MoreVertical,
  Target,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const enrollmentData = [
  { name: 'Jan', value: 40 },
  { name: 'Feb', value: 30 },
  { name: 'Mar', value: 65 },
  { name: 'Apr', value: 45 },
  { name: 'May', value: 80 },
  { name: 'Jun', value: 55 },
];

const certificateData = [
  { name: 'Tally Prime', value: 45, color: '#3B82F6' },
  { name: 'GST', value: 25, color: '#10B981' },
  { name: 'Data Entry', value: 20, color: '#F59E0B' },
  { name: 'Others', value: 10, color: '#6366F1' },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#EC4899'];

const CenterStatCard = ({ label, value, icon: Icon, colorClass, gradient, subValue }: { label: string, value: string | number, icon: any, colorClass: string, gradient: string, subValue?: string }) => (
  <motion.div 
    whileHover={{ y: -5, scale: 1.02 }}
    className={clsx("relative overflow-hidden p-8 rounded-[2rem] shadow-xl border border-white/20 text-white", gradient)}
  >
    <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
    <div className="relative z-10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
          <Icon size={24} />
        </div>
        <div className="flex items-center space-x-1 px-2 py-1 bg-black/10 rounded-full text-[10px] font-bold uppercase tracking-widest">
           <TrendingUp size={10} />
           <span>+12.5%</span>
        </div>
      </div>
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-80">{label}</p>
        <p className="text-4xl font-black tracking-tight">{value}</p>
        {subValue && <p className="text-[10px] font-bold mt-1 opacity-60 uppercase">{subValue}</p>}
      </div>
    </div>
  </motion.div>
);

export const FranchiseDashboard = () => {
  const { students, currentUser, certificates, walletTransactions, franchises, logout } = useApp();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'exam', title: 'Upcoming Exam:', message: 'Maths test scheduled on 20th May', time: '2 hours ago', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 2, type: 'fee', title: 'Fee Due:', message: 'Fees of student John Doe are pending', time: '5 hours ago', icon: DollarSign, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 3, type: 'cert', title: 'Cert Ready:', message: '5 new certificates approved', time: 'Yesterday', icon: Award, color: 'text-green-600', bg: 'bg-green-50' },
  ]);

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };
  
  const balance = walletTransactions
    .filter(tx => tx.franchiseId === currentUser?.franchiseId)
    .reduce((acc, tx) => tx.type === 'CREDIT' ? acc + tx.amount : acc - tx.amount, 0);
  
  const myStudents = students.filter(s => s.franchiseId === currentUser?.franchiseId);
  const myCerts = certificates.filter(c => c.franchiseId === currentUser?.franchiseId);
  
  const currentFranchise = franchises.find(f => f.id === currentUser?.franchiseId);
  const isBlocked = currentFranchise?.status === 'BLOCKED';
  const enabledMenus = currentFranchise?.enabledMenus || ['DASHBOARD'];

  if (isBlocked) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[3.5rem] border-2 border-red-100 shadow-2xl max-w-2xl w-full text-center space-y-8"
        >
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-600 shadow-inner">
            <X size={48} strokeWidth={3} />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-[#141414] uppercase tracking-tight italic leading-none">Account Access Restricted</h1>
            <p className="text-[#888888] font-bold uppercase tracking-widest text-sm">Your franchise panel has been locked by the administrator</p>
          </div>
          <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
            <p className="text-[11px] font-black text-[#141414] uppercase tracking-[0.2em] opacity-60">Possible Reasons</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
               <div className="flex items-center space-x-2 text-[10px] font-black text-red-600 uppercase">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                  <span>Pending Dues / Payments</span>
               </div>
               <div className="flex items-center space-x-2 text-[10px] font-black text-red-600 uppercase">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                  <span>License Term Expiry</span>
               </div>
               <div className="flex items-center space-x-2 text-[10px] font-black text-red-600 uppercase">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                  <span>Document Non-Compliance</span>
               </div>
               <div className="flex items-center space-x-2 text-[10px] font-black text-red-600 uppercase">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                  <span>Audit Violation</span>
               </div>
            </div>
          </div>
          <div className="pt-4 space-y-4">
            <p className="text-xs font-medium text-gray-500 leading-relaxed uppercase tracking-tighter">
              Please contact the Softdev Tally Guru main office immediately to resolve this status and restore full access to your center management workspace.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <a href="tel:+919450455378" className="w-full sm:w-auto px-10 py-4 bg-[#141414] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-black transition-all shadow-xl shadow-black/10">
                  Call Support
               </a>
               <button 
                 onClick={() => logout()}
                 className="w-full sm:w-auto px-10 py-4 bg-white border border-gray-200 text-[#141414] text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-50 transition-all"
               >
                  Sign Out
               </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const quickLinks = [
    { id: 'STUDENTS', name: 'Register Student', icon: UserPlus, color: 'bg-blue-600', path: '/franchise/registration' },
    { id: 'EXAMS', name: 'Manage Exams', icon: FileText, color: 'bg-indigo-600', path: '/franchise/exams' },
    { id: 'COLLECTION', name: 'Fee Collection', icon: Wallet, color: 'bg-emerald-600', path: '/franchise/collection' },
    { id: 'E_LEARNING', name: 'E-Learning', icon: Briefcase, color: 'bg-amber-600', path: '/franchise/e-content' },
    { id: 'EMPLOYEES', name: 'Staff Support', icon: Users2, color: 'bg-purple-600', path: '/franchise/employees' },
    { id: 'WALLET', name: 'Wallet Panel', icon: DollarSign, color: 'bg-rose-600', path: '/franchise/wallet' },
  ].filter(link => enabledMenus.includes(link.id));

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-gray-100">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
             <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">S</span>
             <h1 className="text-3xl font-black text-[#141414] tracking-tight uppercase">Center Overview</h1>
          </div>
          <p className="text-sm font-medium text-[#888888]">SOFTDEV TALLY GURU OFFICIAL • ID: {currentUser?.franchiseId || 'STG2024'}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
           <div className="px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center space-x-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                 <Wallet size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Available Balance</p>
                 <p className="text-lg font-black text-[#141414]">₹{balance.toLocaleString('en-IN')}</p>
              </div>
              <button 
                onClick={() => navigate('/franchise/wallet')}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                 <RefreshCw size={14} className="text-[#888888]" />
              </button>
           </div>
           <button 
             onClick={() => navigate('/franchise/registration')}
             className="px-6 py-3 bg-[#141414] text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all flex items-center space-x-2"
           >
              <Plus size={16} />
              <span>New Entry</span>
           </button>
        </div>
      </div>

      {/* Colourful Boxes (Stats) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CenterStatCard 
          label="Total Students" 
          value={myStudents.length} 
          icon={Users} 
          colorClass="text-blue-600" 
          gradient="bg-gradient-to-br from-blue-600 to-blue-800"
          subValue="Active Leaners"
        />
        <CenterStatCard 
          label="Wallet Balance" 
          value={`₹${balance.toLocaleString('en-IN')}`} 
          icon={DollarSign} 
          colorClass="text-emerald-600" 
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-700"
          subValue="Ready for Transactions"
        />
        <CenterStatCard 
          label="Certificates" 
          value={myCerts.length} 
          icon={Award} 
          colorClass="text-amber-600" 
          gradient="bg-gradient-to-br from-amber-500 to-amber-700"
          subValue="Approved & Issued"
        />
        <CenterStatCard 
          label="Pending Tasks" 
          value="08" 
          icon={Clock} 
          colorClass="text-indigo-600" 
          gradient="bg-gradient-to-br from-indigo-500 to-indigo-700"
          subValue="Awaiting Action"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl overflow-hidden relative group">
           <div className="flex items-center justify-between mb-10">
              <div>
                 <h3 className="text-xl font-black text-[#141414] uppercase tracking-tight">Student Enrollment Trend</h3>
                 <p className="text-xs text-[#888888] font-bold mt-1">Monthly performance analysis</p>
              </div>
              <div className="flex items-center space-x-2">
                 <div className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                    <span>Target: 100</span>
                 </div>
                 <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <MoreVertical size={16} className="text-[#888888]" />
                 </button>
              </div>
           </div>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={enrollmentData}>
                    <defs>
                       <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                    <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fontSize: 10, fill: '#888888', fontWeight: 600 }}
                    />
                    <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fontSize: 10, fill: '#888888', fontWeight: 600 }}
                    />
                    <Tooltip 
                       contentStyle={{ 
                          backgroundColor: '#141414', 
                          border: 'none', 
                          borderRadius: '12px',
                          color: '#FFF',
                          fontSize: '12px'
                       }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
           <h3 className="text-xl font-black text-[#141414] uppercase tracking-tight mb-8">Course Distribution</h3>
           <div className="h-[250px] w-full mb-8">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                       data={certificateData}
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={80}
                       paddingAngle={5}
                       dataKey="value"
                    >
                       {certificateData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                    </Pie>
                    <Tooltip />
                 </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="space-y-4">
              {certificateData.map((entry, i) => (
                 <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                       <span className="text-xs font-bold text-[#141414] uppercase tracking-widest">{entry.name}</span>
                    </div>
                    <span className="text-xs font-black text-[#888888]">{entry.value}%</span>
                 </div>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Notifications & Reminders */}
        <div className="lg:col-span-2 bg-[#141414] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full"></div>
           <div className="relative z-10">
              <div className="flex items-center justify-between mb-10 border-b border-white/10 pb-6">
                 <div className="flex items-center space-x-3">
                    <Bell className="text-blue-400" />
                    <h3 className="text-xl font-black uppercase tracking-tight">Active Alerts & Notifications</h3>
                 </div>
                 <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-400">
                    {notifications.length} Unread
                 </div>
              </div>
              <div className="space-y-4">
                 {notifications.length > 0 ? notifications.map((notif) => (
                    <motion.div 
                      key={notif.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all hover:border-white/20"
                    >
                       <div className="flex items-start space-x-5">
                          <div className={clsx("p-3 rounded-2xl", notif.bg, notif.color)}>
                             <notif.icon size={20} />
                          </div>
                          <div>
                             <p className="text-sm font-black uppercase tracking-widest flex items-center space-x-2">
                                <span>{notif.title}</span>
                                {notif.id === 1 && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse">Critical</span>}
                             </p>
                             <p className="text-sm font-medium text-white/60 mt-1">{notif.message}</p>
                             <p className="text-[10px] font-black text-white/30 uppercase mt-2 tracking-widest">{notif.time}</p>
                          </div>
                       </div>
                       <div className="flex items-center space-x-4 mt-6 sm:mt-0">
                          <button 
                            onClick={() => navigate(notif.type === 'exam' ? '/franchise/exams' : notif.type === 'fee' ? '/franchise/collection' : '/franchise/students')}
                            className="px-4 py-2 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white hover:text-black transition-all"
                          >
                             Action
                          </button>
                          <button 
                            onClick={() => removeNotification(notif.id)}
                            className="p-2 text-white/30 hover:text-white transition-colors"
                          >
                             <CheckCircle2 size={20} />
                          </button>
                       </div>
                    </motion.div>
                 )) : (
                    <div className="py-20 text-center space-y-4">
                       <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                          <Bell size={24} className="text-white/20" />
                       </div>
                       <p className="text-white/40 font-black uppercase tracking-widest text-sm">Perfectly Clear! No alerts.</p>
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* Active Quick Links */}
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl flex flex-col">
           <h3 className="text-xl font-black text-[#141414] uppercase tracking-tight border-b border-gray-100 pb-6 mb-8">System Access</h3>
           <div className="grid grid-cols-2 gap-4 flex-1">
              {quickLinks.map((link, i) => (
                 <motion.button 
                   key={i}
                   whileHover={{ y: -5, scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => navigate(link.path)}
                   className="flex flex-col items-center justify-center p-6 bg-gray-50 border border-gray-100 rounded-3xl space-y-3 group hover:bg-blue-600 transition-all hover:shadow-2xl hover:shadow-blue-200"
                 >
                    <div className={clsx("p-3 rounded-2xl text-white group-hover:bg-white group-hover:text-blue-600 transition-all", link.color)}>
                       <link.icon size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.1em] text-[#141414] group-hover:text-white transition-all text-center">
                       {link.name.split(' ').map((word, idx) => (
                          <React.Fragment key={idx}>{word}<br/></React.Fragment>
                       ))}
                    </span>
                 </motion.button>
              ))}
           </div>
           
           <div className="mt-8 p-6 bg-blue-50 rounded-[2rem] border border-blue-100 relative overflow-hidden group hover:bg-blue-600 transition-all cursor-pointer">
              <div className="relative z-10 flex items-center justify-between">
                 <div>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest group-hover:text-white/60">Center Support</p>
                    <p className="text-xs font-black text-[#141414] uppercase tracking-tight mt-1 group-hover:text-white">Raise Inquiry</p>
                 </div>
                 <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 transition-all">
                    <ArrowRight size={18} />
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="fixed bottom-10 right-10 z-50">
         <motion.button 
           whileHover={{ scale: 1.1, rotate: 90 }}
           whileTap={{ scale: 0.9 }}
           onClick={() => navigate('/franchise/registration')}
           className="w-16 h-16 bg-pink-600 text-white rounded-full shadow-[0_20px_50px_rgba(236,72,153,0.3)] flex items-center justify-center hover:bg-pink-700 transition-colors"
         >
           <Plus size={32} />
         </motion.button>
      </div>

      {/* Center Menu Grid (Developer Enabled) */}
      {enabledMenus.length > 0 && (
        <div className="py-10 border-t border-gray-100">
           <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-200">
                 <Target className="text-white" size={20} />
              </div>
              <div>
                 <h2 className="text-2xl font-black text-[#141414] uppercase tracking-tight italic">Center Menu</h2>
                 <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest mt-1 italic">Developer Authorized Operations</p>
              </div>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[
                { id: 'STUDENTS', label: 'Students', icon: Users, color: 'bg-blue-600', path: '/franchise/students' },
                { id: 'WALLET', label: 'Wallet', icon: Wallet, color: 'bg-emerald-600', path: '/franchise/wallet' },
                { id: 'EXAMS', label: 'Exams', icon: FileText, color: 'bg-indigo-600', path: '/franchise/exams' },
                { id: 'COLLECTION', label: 'Collection', icon: DollarSign, color: 'bg-rose-600', path: '/franchise/collection' },
                { id: 'E_LEARNING', label: 'E-Learning', icon: Briefcase, color: 'bg-amber-600', path: '/franchise/e-content' },
                { id: 'EMPLOYEES', label: 'Employees', icon: Users2, color: 'bg-purple-600', path: '/franchise/employees' },
                { id: 'NOTIFICATIONS', label: 'Notices', icon: Bell, color: 'bg-slate-600', path: '/franchise/notifications' },
                { id: 'ACCOUNTS', label: 'Accounts', icon: TrendingUp, color: 'bg-cyan-600', path: '/franchise/accounts' },
                { id: 'ATTENDANCE', label: 'Attendance', icon: Calendar, color: 'bg-teal-600', path: '/franchise/attendance' },
                { id: 'TIMETABLE', label: 'TimeTable', icon: Clock, color: 'bg-orange-600', path: '/franchise/timetable' },
              ].filter(m => enabledMenus.includes(m.id)).map((menu, i) => (
                <motion.button 
                  key={i}
                  whileHover={{ y: -5, scale: 1.05 }}
                  onClick={() => navigate(menu.path)}
                  className="flex flex-col items-center justify-center p-8 bg-white border border-gray-100 rounded-[2.5rem] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:border-pink-200 transition-all space-y-4 group"
                >
                  <div className={`${menu.color} p-4 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    <menu.icon size={24} />
                  </div>
                  <span className="text-[11px] font-black text-[#141414] uppercase tracking-widest text-center group-hover:text-pink-600 transition-colors">{menu.label}</span>
                </motion.button>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

