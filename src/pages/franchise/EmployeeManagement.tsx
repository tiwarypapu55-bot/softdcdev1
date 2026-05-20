/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical,
  Mail,
  Phone,
  Shield,
  Trash2,
  Edit2,
  X,
  CreditCard,
  Briefcase,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';

interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
  joinDate: string;
  department: string;
}

interface SalaryRecord {
  id: string;
  employeeId: string;
  month: string;
  baseSalary: number;
  allowance: number;
  deduction: number;
  netPaid: number;
  paymentDate: string;
  status: 'PAID' | 'PENDING';
  transactionNo: string;
}

export const EmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('employees');
    return saved ? JSON.parse(saved) : [
      {
        id: 'emp1',
        name: 'Aditya Sharma',
        role: 'Center Manager',
        email: 'aditya.s@skyline.com',
        phone: '+91 98765 43210',
        status: 'ACTIVE',
        joinDate: '2023-01-15',
        department: 'Management'
      },
      {
        id: 'emp2',
        name: 'Priya Verma',
        role: 'Tally Instructor',
        email: 'priya.v@skyline.com',
        phone: '+91 87654 32109',
        status: 'ACTIVE',
        joinDate: '2023-03-20',
        department: 'Teaching'
      }
    ];
  });

  const [salaries, setSalaries] = useState<SalaryRecord[]>(() => {
    const saved = localStorage.getItem('salaries');
    return saved ? JSON.parse(saved) : [
      {
        id: "sal1",
        employeeId: "emp1",
        month: "April 2026",
        baseSalary: 35000,
        allowance: 2500,
        deduction: 1200,
        netPaid: 36300,
        paymentDate: "2026-04-30",
        status: "PAID",
        transactionNo: "TXN-AMP88910"
      },
      {
        id: "sal2",
        employeeId: "emp1",
        month: "March 2026",
        baseSalary: 35000,
        allowance: 2000,
        deduction: 1200,
        netPaid: 35800,
        paymentDate: "2026-03-31",
        status: "PAID",
        transactionNo: "TXN-AMP77210"
      },
      {
        id: "sal3",
        employeeId: "emp2",
        month: "April 2026",
        baseSalary: 25000,
        allowance: 1500,
        deduction: 800,
        netPaid: 25700,
        paymentDate: "2026-04-30",
        status: "PAID",
        transactionNo: "TXN-AMP88912"
      },
      {
        id: "sal4",
        employeeId: "emp2",
        month: "March 2026",
        baseSalary: 25000,
        allowance: 1200,
        deduction: 800,
        netPaid: 25400,
        paymentDate: "2026-03-31",
        status: "PAID",
        transactionNo: "TXN-AMP77211"
      }
    ];
  });

  React.useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  React.useEffect(() => {
    localStorage.setItem('salaries', JSON.stringify(salaries));
  }, [salaries]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedSalaryEmployee, setSelectedSalaryEmployee] = useState<Employee | null>(null);
  const [isDisbursing, setIsDisbursing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Center Manager',
    department: 'Management'
  });

  const [disburseData, setDisburseData] = useState({
    month: 'May 2026',
    baseSalary: 30000,
    allowance: 0,
    deduction: 0,
    remarks: ''
  });

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setEmployees(employees.map(emp => 
        emp.id === editingId ? { ...emp, ...formData } : emp
      ));
      setEditingId(null);
    } else {
      const newEmployee: Employee = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        status: 'ACTIVE',
        joinDate: new Date().toISOString().split('T')[0]
      };
      setEmployees([...employees, newEmployee]);
    }
    setShowModal(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'Center Manager',
      department: 'Management'
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this employee?')) {
      setEmployees(employees.filter(e => e.id !== id));
      setSalaries(salaries.filter(s => s.employeeId !== id));
    }
  };

  const handleDisburseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSalaryEmployee) return;

    const netPaid = disburseData.baseSalary + disburseData.allowance - disburseData.deduction;
    const newRecord: SalaryRecord = {
      id: Math.random().toString(36).substr(2, 9),
      employeeId: selectedSalaryEmployee.id,
      month: disburseData.month,
      baseSalary: disburseData.baseSalary,
      allowance: disburseData.allowance,
      deduction: disburseData.deduction,
      netPaid,
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'PAID',
      transactionNo: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    };

    setSalaries([newRecord, ...salaries]);
    setIsDisbursing(false);
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-20 bg-background min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-[#141414] tracking-tighter uppercase leading-none">Staff Management</h1>
          <p className="text-[10px] text-[#888888] font-black uppercase tracking-[0.2em] mt-3 bg-gray-50 inline-block px-3 py-1 rounded-full border border-gray-200">Personnel Directory • Command Center</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({
              name: '',
              email: '',
              phone: '',
              role: 'Center Manager',
              department: 'Management'
            });
            setShowModal(true);
          }}
          className="flex items-center space-x-2 px-8 py-4 bg-[#141414] text-white text-[10px] font-black rounded-2xl uppercase tracking-widest shadow-2xl shadow-black/20 hover:bg-blue-600 transition-all"
        >
          <UserPlus size={16} />
          <span>Onboard New Staff</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-[2.5rem] border border-[#F0F0F0] shadow-sm gap-4">
        <div className="flex items-center bg-gray-50 px-6 py-4 rounded-2xl flex-1 max-w-xl border border-gray-100">
           <Search size={18} className="text-[#888888]" />
           <input 
             type="text" 
             placeholder="Search by name, email or role..." 
             className="ml-4 bg-transparent border-none text-[10px] w-full outline-none font-black uppercase tracking-widest placeholder:text-gray-400"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <div className="flex items-center space-x-3">
           <button className="px-6 py-4 bg-white border border-gray-100 text-[10px] font-black rounded-2xl flex items-center space-x-2 text-[#888888] uppercase tracking-widest hover:border-gray-300 transition-all">
             <Filter size={14} />
             <span>Filter By Role</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEmployees.map((emp) => (
          <motion.div 
            key={emp.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all group"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="w-20 h-20 bg-blue-50/50 rounded-[2rem] flex items-center justify-center text-blue-600 font-black text-3xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                {emp.name.charAt(0)}
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 p-1 rounded-xl">
                <button 
                  onClick={() => {
                    setEditingId(emp.id);
                    setFormData({
                      name: emp.name,
                      email: emp.email,
                      phone: emp.phone,
                      role: emp.role,
                      department: emp.department
                    });
                    setShowModal(true);
                  }}
                  className="p-3 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(emp.id)}
                  className="p-3 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="text-2xl font-black text-[#141414] tracking-tighter leading-none">{emp.name}</h3>
                  <CheckCircle2 size={18} className="text-emerald-500" />
                </div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-2 bg-blue-50 inline-block px-3 py-1 rounded-full">
                  {emp.role} • {emp.department}
                </p>
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-50">
                <div className="flex items-center space-x-3 text-[#888888]">
                  <Mail size={14} className="opacity-40" />
                  <span className="text-[11px] font-black uppercase tracking-tighter text-[#141414]">{emp.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-[#888888]">
                  <Phone size={14} className="opacity-40" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#141414]">{emp.phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-[#888888]">
                  <Briefcase size={14} className="opacity-40" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Joined {new Date(emp.joinDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="pt-8 flex items-center justify-between">
                <div className={clsx(
                  "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                  emp.status === 'ACTIVE' ? "bg-emerald-100 text-emerald-700" : "bg-red-50 text-red-600"
                )}>
                  {emp.status}
                </div>
                <button 
                  onClick={() => setSelectedSalaryEmployee(emp)}
                  className="text-[10px] font-black text-[#141414] uppercase tracking-widest hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600 pb-0.5"
                >
                  Salary History
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Onboard / Edit Staff Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[4rem] w-full max-w-xl p-12 shadow-2xl relative"
            >
              <button 
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    role: 'Center Manager',
                    department: 'Management'
                  });
                }}
                className="absolute right-10 top-10 p-4 text-gray-400 hover:text-[#141414] hover:bg-gray-100 rounded-2xl transition-all"
              >
                <X size={24} />
              </button>
              
              <div className="mb-12">
                <h3 className="text-3xl font-black text-[#141414] uppercase tracking-tighter">
                  {editingId ? 'Edit Staff Profile' : 'Onboard Staff'}
                </h3>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mt-2">
                  {editingId ? 'Update Personnel Details' : 'New Personnel Registration'}
                </p>
              </div>

              <form onSubmit={handleAddEmployee} className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      required 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      required 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Phone Number</label>
                    <input 
                      required 
                      type="text" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#888888] uppercase tracking-widest ml-1">Job Role</label>
                    <select 
                      value={formData.role}
                      onChange={(e) => {
                        const val = e.target.value;
                        const dept = val === 'Tally Instructor' ? 'Teaching' : 'Management';
                        setFormData({ ...formData, role: val, department: dept });
                      }}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                    >
                       <option>Center Manager</option>
                       <option>Tally Instructor</option>
                       <option>Accounts Executive</option>
                       <option>Office Assistant</option>
                    </select>
                  </div>
                </div>

                <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 space-y-6">
                  <div className="flex items-center space-x-3 text-blue-600">
                    <Shield size={20} />
                    <h4 className="text-[11px] font-black uppercase tracking-widest">Security Clearance</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     {['Manage Fees', 'View Students', 'Edit Courses', 'Process Salaries'].map(perm => (
                       <label key={perm} className="flex items-center space-x-3 cursor-pointer group">
                          <input type="checkbox" defaultChecked={formData.role === 'Center Manager' || perm !== 'Process Salaries'} className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                          <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest group-hover:text-blue-600 transition-colors">{perm}</span>
                       </label>
                     ))}
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-5 bg-[#141414] text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl hover:bg-blue-600 transition-all font-sans"
                >
                  {editingId ? 'Save Changes' : 'Finalize Registration'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Salary History Modal */}
      <AnimatePresence>
        {selectedSalaryEmployee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[3rem] w-full max-w-3xl p-10 shadow-2xl relative my-8"
            >
              <button 
                onClick={() => {
                  setSelectedSalaryEmployee(null);
                  setIsDisbursing(false);
                }}
                className="absolute right-8 top-8 p-3 text-gray-400 hover:text-[#141414] hover:bg-gray-100 rounded-xl transition-all"
              >
                <X size={20} />
              </button>

              <div className="mb-8 border-b border-gray-100 pb-6">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Employee Compensation</span>
                <h3 className="text-3xl font-black text-[#141414] uppercase tracking-tighter mt-1">{selectedSalaryEmployee.name}</h3>
                <p className="text-xs text-gray-400 mt-1 uppercase font-bold">{selectedSalaryEmployee.role} • {selectedSalaryEmployee.department}</p>
              </div>

              {!isDisbursing ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-[#141414] uppercase tracking-widest">Disbursed Salary Ledger</h4>
                    <button 
                      onClick={() => {
                        const defaultBase = selectedSalaryEmployee.role === 'Center Manager' ? 35000 :
                                           selectedSalaryEmployee.role === 'Tally Instructor' ? 25000 :
                                           selectedSalaryEmployee.role === 'Accounts Executive' ? 22000 : 15000;
                        setDisburseData({
                          month: 'May 2026',
                          baseSalary: defaultBase,
                          allowance: 0,
                          deduction: 0,
                          remarks: ''
                        });
                        setIsDisbursing(true);
                      }}
                      className="px-6 py-3 bg-[#141414] text-white text-[9px] font-black rounded-xl uppercase tracking-widest hover:bg-blue-600 transition-colors"
                    >
                      Disburse New Salary
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="p-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Month</th>
                          <th className="p-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Base Rate</th>
                          <th className="p-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Allowance/Deductions</th>
                          <th className="p-4 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Net Received</th>
                          <th className="p-4 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salaries.filter(s => s.employeeId === selectedSalaryEmployee.id).length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              No salary history found
                            </td>
                          </tr>
                        ) : (
                          salaries.filter(s => s.employeeId === selectedSalaryEmployee.id).map(s => (
                            <tr key={s.id} className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                              <td className="p-4">
                                <p className="text-xs font-black text-[#141414]">{s.month}</p>
                                <p className="text-[8px] font-mono text-[#888888]">{s.transactionNo}</p>
                              </td>
                              <td className="p-4 text-xs font-bold text-gray-600">₹{s.baseSalary.toLocaleString('en-IN')}</td>
                              <td className="p-4 text-[10px] font-bold text-gray-400">
                                <span className="text-emerald-600">+{s.allowance}</span> / <span className="text-red-500">-{s.deduction}</span>
                              </td>
                              <td className="p-4 text-xs font-black text-[#141414] text-right">
                                ₹{s.netPaid.toLocaleString('en-IN')}
                              </td>
                              <td className="p-4 text-center">
                                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
                                  {s.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleDisburseSubmit} className="space-y-6">
                  <div className="flex items-center space-x-2 text-blue-600 mb-2">
                    <CreditCard size={18} />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Calculate Compensation</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Salary Month</label>
                      <input 
                        required
                        type="text" 
                        value={disburseData.month}
                        onChange={(e) => setDisburseData({ ...disburseData, month: e.target.value })}
                        placeholder="e.g. May 2026"
                        className="w-full bg-transparent border-none text-xs font-bold outline-none pt-1 text-[#141414]"
                      />
                    </div>
                    <div className="space-y-1 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Base Salary (₹)</label>
                      <input 
                        required
                        type="number" 
                        value={disburseData.baseSalary || ''}
                        onChange={(e) => setDisburseData({ ...disburseData, baseSalary: parseInt(e.target.value) || 0 })}
                        className="w-full bg-transparent border-none text-xs font-bold outline-none pt-1 text-[#141414]"
                      />
                    </div>
                    <div className="space-y-1 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Allowances (₹)</label>
                      <input 
                        type="number" 
                        value={disburseData.allowance || ''}
                        onChange={(e) => setDisburseData({ ...disburseData, allowance: parseInt(e.target.value) || 0 })}
                        className="w-full bg-transparent border-none text-xs font-bold outline-none pt-1 text-[#141414]"
                      />
                    </div>
                    <div className="space-y-1 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Deductions (₹)</label>
                      <input 
                        type="number" 
                        value={disburseData.deduction || ''}
                        onChange={(e) => setDisburseData({ ...disburseData, deduction: parseInt(e.target.value) || 0 })}
                        className="w-full bg-transparent border-none text-xs font-bold outline-none pt-1 text-[#141414]"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-150 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black text-[#888888] uppercase tracking-widest">Total Net Paid</p>
                      <p className="text-3xl font-black text-[#141414] mt-1">
                        ₹{(disburseData.baseSalary + disburseData.allowance - disburseData.deduction).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="flex space-x-3 mt-4 md:mt-0">
                      <button 
                        type="button"
                        onClick={() => setIsDisbursing(false)}
                        className="px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="px-8 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/10"
                      >
                        Release Payment
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
