/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCircle, 
  UserCheck,
  Wallet, 
  FileCheck, 
  Award, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  Search,
  CheckCircle,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
  QrCode,
  CreditCard,
  GraduationCap,
  Calendar,
  ChevronRight,
  Layers,
  ShieldCheck,
  Megaphone,
  UserPlus,
  BookOpen,
  DollarSign,
  Clock,
  Globe
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Sidebar = () => {
  const { currentUser, franchises, logout, businessProfile } = useApp();
  const [isOpen, setIsOpen] = React.useState(true);
  const navigate = useNavigate();

  if (!currentUser) return null;

  const adminMenu = [
    { type: 'header', name: 'System Menu' },
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { 
      name: 'Franchise Nodes', 
      icon: Users, 
      path: '/admin/franchises',
      subItems: [
        { name: 'Franchise List', path: '/admin/franchises' },
        { name: 'Franchise Fees', path: '/admin/franchise-fees' },
        { name: 'Fee Accounts', path: '/admin/accounts' },
        { name: 'Exam Portal', path: '/admin/exams' },
        { name: 'Course Management', path: '/admin/courses' },
      ]
    },
    { name: 'Academic Master', icon: BookOpen, path: '/admin/academic' },
    { name: 'Fee Master', icon: Wallet, path: '/admin/fees' },
    { name: 'Fee Collection', icon: CreditCard, path: '/admin/collection' },
    { name: 'Student Registration', icon: UserPlus, path: '/admin/registration' },
    { name: 'Student Directory', icon: UserCircle, path: '/admin/students' },
    { name: 'Admission Inquiry', icon: Megaphone, path: '/admin/enquiries' },
    { name: 'Announcement', icon: Bell, path: '/admin/announcements' },
    { name: 'Documents', icon: FileText, path: '/admin/documents' },
    { 
      name: 'Certificates', 
      icon: Award, 
      path: '/admin/certificates',
      subItems: [
        { name: 'Saved templates', path: '/admin/certificates/templates' },
        { name: 'Create Template', path: '/admin/certificates/create' },
      ]
    },
    { name: 'Business Settings', icon: Settings, path: '/admin/business' },
  ];

  const franchiseMenu = [
    { type: 'header', name: 'Dash menu' },
    { name: 'Dashboard', icon: LayoutDashboard, path: '/franchise' },
    { name: 'Employee', icon: UserCheck, path: '/franchise/employees' },
    { name: 'Exam Master', icon: FileCheck, path: '/franchise/exams' },
    { name: 'Academic Setup', icon: BookOpen, path: '/franchise/academic' },
    { name: 'Franchise Fee', icon: DollarSign, path: '/franchise/franchise-fees' },
    { name: 'Student Registration', icon: UserPlus, path: '/franchise/registration' },
    { 
      name: 'Fee Collection', 
      icon: CreditCard, 
      path: '/franchise/collection',
      subItems: [
        { name: 'Collect Fee', path: '/franchise/collection' },
        { name: 'Collect History', path: '/franchise/account' },
        { name: 'Fee Master', path: '/franchise/fees' },
      ]
    },
    { name: 'Student List', icon: GraduationCap, path: '/franchise/students' },
    { name: 'Wallet Accounts', icon: Wallet, path: '/franchise/wallet' },
    { name: 'Announcement', icon: Megaphone, path: '/franchise/announcements' },
    
    { type: 'header', name: 'CENTER MENU' },
    { name: 'Attendance', icon: Calendar, path: '/franchise/attendance' },
    { name: 'E-Content', icon: BookOpen, path: '/franchise/e-content' },
    { name: 'TimeTable', icon: Clock, path: '/franchise/timetable' },
  ];

  const studentMenu = [
    { type: 'header', name: 'Main' },
    { name: 'Dashboard', icon: LayoutDashboard, path: '/student' },
    { name: 'My Profile', icon: UserCircle, path: '/student/profile' },
    { name: 'Certificates', icon: Award, path: '/student/certificates' },
    { name: 'My Documents', icon: FileText, path: '/student/documents' },
    { name: 'My Accounts', icon: DollarSign, path: '/student/accounts' },
    { name: 'Verification', icon: QrCode, path: '/verify' },
  ];

  const teacherMenu = [
    { type: 'header', name: 'TEACHER MENU' },
    { name: 'Dashboard', icon: LayoutDashboard, path: '/teacher' },
    { name: 'My Classes', icon: BookOpen, path: '/teacher/classes' },
    { name: 'Students', icon: Users, path: '/teacher/students' },
    { name: 'Attendance', icon: Calendar, path: '/teacher/attendance' },
    { name: 'Exams', icon: FileCheck, path: '/teacher/exams' },
  ];

  const currentFranchise = franchises.find(f => f.id === currentUser.franchiseId);
  const isBlocked = currentUser.role === 'FRANCHISE' && currentFranchise?.status === 'BLOCKED';

  const menu = (currentUser.role === 'ADMINISTRATOR' || currentUser.role === 'ADMIN')
    ? adminMenu 
    : currentUser.role === 'FRANCHISE' 
      ? (isBlocked ? [{ name: 'Dashboard', icon: LayoutDashboard, path: '/franchise' }] : franchiseMenu)
      : currentUser.role === 'TEACHER' 
        ? teacherMenu 
        : studentMenu;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={cn(
      "h-screen bg-[#071d41] text-[#E4E3E0] transition-all duration-300 flex flex-col border-r border-white/10 sticky top-0 shadow-2xl",
      isOpen ? "w-64" : "w-20"
    )}>
      <div className="p-6 flex items-center justify-between border-b border-white/10 bg-black/10">
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-3"
          >
            {businessProfile.logoUrl ? (
              <img 
                src={businessProfile.logoUrl} 
                alt="Logo" 
                className="w-10 h-10 object-contain p-1 bg-white/10 rounded-lg shadow-lg border border-white/5" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center p-1 shadow-lg shadow-blue-500/20">
                <ShieldCheck className="text-white" size={20} />
              </div>
            )}
            <div className="flex flex-col">
              <h1 className="text-lg font-black tracking-tighter text-white leading-none uppercase truncate max-w-[120px]">
                {businessProfile.name.split(' ')[0]}
              </h1>
              <span className="text-[8px] font-black tracking-[0.2em] text-blue-400 uppercase truncate max-w-[120px]">
                {businessProfile.name.split(' ').slice(1).join(' ') || 'WORKSPACE'}
              </span>
            </div>
          </motion.div>
        )}
        <button onClick={() => setIsOpen(!isOpen)} className="p-1 hover:bg-white/10 rounded">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menu.map((item, idx) => {
          if (item.type === 'header') {
            return isOpen ? (
              <p key={idx} className="px-3 py-4 text-[10px] font-black text-white/40 uppercase tracking-widest bg-black/20 mt-4 first:mt-0 mb-2">
                {item.name}
              </p>
            ) : <div key={idx} className="h-px bg-white/10 my-6" />;
          }

          const Icon = item.icon;
          return (
            <React.Fragment key={idx}>
              <NavLink
                to={item.path as string}
                className={({ isActive }) => cn(
                  "flex items-center p-3 rounded-xl transition-all duration-200 group relative mx-2",
                  isActive 
                    ? "bg-blue-600/20 text-white border-l-4 border-blue-400 pl-3 shadow-lg shadow-black/20" 
                    : "hover:bg-white/5 text-blue-100/50 hover:text-white"
                )}
              >
                <Icon size={18} className={cn("min-w-[18px] transition-transform duration-200 group-hover:scale-110", !isOpen && "mx-auto")} />
                {isOpen && <span className="ml-3 font-black text-[10px] uppercase tracking-widest leading-none">{item.name}</span>}
                {!isOpen && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-[#141414] text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 border border-[#2A2A2A]">
                    {item.name}
                  </div>
                )}
              </NavLink>

              {/* Sub Items */}
              {isOpen && (item as any).subItems && (
                <div className="ml-8 mt-1 space-y-1 mb-2">
                  {(item as any).subItems.map((sub: any) => (
                    <NavLink
                      key={sub.path}
                      to={sub.path}
                      className={({ isActive }) => cn(
                        "flex items-center p-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                        isActive ? "text-blue-400" : "text-white/40 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <ChevronRight size={10} className="mr-2" />
                      {sub.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      <div className="px-6 mb-4">
        <Link 
          to="/" 
          className={cn(
            "flex items-center p-3 rounded-xl transition-all duration-200 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white group border border-blue-500/20",
            !isOpen && "justify-center px-0"
          )}
        >
          <Globe size={18} className="min-w-[18px]" />
          {isOpen && <span className="ml-3 font-black text-[10px] uppercase tracking-widest leading-none">Visit Website</span>}
        </Link>
      </div>

      <div className="p-4 mt-auto border-t border-white/10 bg-black/20">
        <div className={cn("flex items-center", isOpen ? "px-2" : "justify-center")}>
           {isOpen && (
             <div className="flex-1 flex items-center min-w-0 mr-2">
               <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-xl border border-white/10 bg-[#2A2A2A] shadow-inner" />
               <div className="ml-3 overflow-hidden">
                 <p className="text-[11px] font-black truncate text-white uppercase tracking-tight">{currentUser.name}</p>
                 <p className="text-[8px] text-blue-400/80 truncate font-black uppercase tracking-[0.1em]">{currentUser.role} DASHBOARD</p>
               </div>
             </div>
           )}
           <button 
             onClick={handleLogout}
             className="p-2 text-[#A0AEC0] hover:text-red-400 transition-colors"
           >
             <LogOut size={20} />
           </button>
        </div>
      </div>
    </aside>
  );
};

export const Header = () => {
  const { currentUser } = useApp();
  if (!currentUser) return null;

  return (
    <header className="h-16 border-b border-black/5 bg-background/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex items-center bg-[#F5F5F5] px-4 py-2 rounded-full w-96">
        <Search size={16} className="text-[#888888]" />
        <input 
          type="text" 
          placeholder="Global Search..." 
          className="ml-3 bg-transparent border-none focus:ring-0 text-sm w-full outline-hidden"
        />
      </div>

      <div className="flex items-center space-x-6">
        <button className="relative p-2 text-[#666666] hover:text-[#141414] transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2 text-[#666666] hover:text-[#141414] transition-colors">
          <Settings size={20} />
        </button>
        <div className="h-8 w-px bg-[#E5E5E5]"></div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-[#141414]">{currentUser.name}</p>
            <p className="text-[10px] text-[#888888] font-mono tracking-tighter">{currentUser.email}</p>
          </div>
          <div className="w-10 h-10 rounded-full border border-[#E5E5E5] p-0.5">
            <img src={currentUser.avatar} alt="Profile" className="w-full h-full rounded-full" />
          </div>
        </div>
      </div>
    </header>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useApp();

  if (!currentUser) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export const StatCard = ({ title, value, icon: Icon, trend, color = "blue" }: any) => {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-2xl border border-[#E5E5E5] shadow-xs"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-3 rounded-xl", colors[color])}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-bold px-2 py-1 rounded-full",
            trend > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          )}>
            {trend > 0 ? "+" : ""}{trend}%
          </span>
        )}
      </div>
      <p className="text-[#888888] text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold text-[#141414] mt-1 tracking-tight">{value}</p>
    </motion.div>
  );
};
