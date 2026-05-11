/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Wallet, 
  Plus, 
  Edit3, 
  Save, 
  X,
  CreditCard,
  FileText,
  BadgeCheck,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { FranchiseFee } from '../../types';

export const FranchiseFeeMaster = () => {
  const { franchises, franchiseFees, addFranchiseFee, updateFranchiseFee, currentUser } = useApp();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<FranchiseFee>>({
    franchiseId: '',
    registrationFees: 0,
    marksheetFees: 0,
    description: ''
  });

  const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'ADMINISTRATOR';

  const handleEdit = (fee: FranchiseFee) => {
    setIsEditing(fee.id);
    setFormData(fee);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.franchiseId) return;

    if (isEditing) {
      updateFranchiseFee(isEditing, formData);
      setIsEditing(null);
    } else {
      const selectedFranchise = franchises.find(f => f.id === formData.franchiseId);
      addFranchiseFee({
        ...formData as FranchiseFee,
        id: `ff${Date.now()}`,
        franchiseName: selectedFranchise?.name || 'Unknown'
      });
    }
    setFormData({ franchiseId: '', registrationFees: 0, marksheetFees: 0, description: '' });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-3xl font-black text-[#141414] tracking-tight uppercase">Center Wise Fees List</h1>
          <p className="text-sm text-[#888888] font-mono">Manage registration and certificate fees for all study centers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Form - Only for Admin */}
        {isAdmin && (
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6 sticky top-8">
              <div className="flex items-center space-x-3 text-blue-600 mb-2">
                <Building2 size={20} />
                <h2 className="text-[10px] font-black uppercase tracking-widest leading-none">Center Wise Fees</h2>
              </div>
              
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#888888] uppercase tracking-widest ml-1">Select Center</label>
                  <select 
                    required
                    value={formData.franchiseId}
                    onChange={(e) => setFormData({...formData, franchiseId: e.target.value})}
                    disabled={!!isEditing}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                  >
                    <option value="">-- Select Center --</option>
                    {franchises.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                    {franchises.length === 0 && (
                      <option value="" disabled>No centers registered yet</option>
                    )}
                  </select>
                  {franchises.length === 0 && (
                    <p className="text-[9px] font-bold text-red-500 mt-1 uppercase italic">* Please register a franchise first in "Franchise List"</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#888888] uppercase tracking-widest ml-1">Registration Fees</label>
                  <input 
                    type="number"
                    required
                    value={formData.registrationFees}
                    onChange={(e) => setFormData({...formData, registrationFees: Number(e.target.value)})}
                    placeholder="Enter registration fee"
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#888888] uppercase tracking-widest ml-1">Marksheet & Certificate Fees</label>
                  <input 
                    type="number"
                    required
                    value={formData.marksheetFees}
                    onChange={(e) => setFormData({...formData, marksheetFees: Number(e.target.value)})}
                    placeholder="Enter marksheet fee"
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#888888] uppercase tracking-widest ml-1">Additional Remarks</label>
                  <input 
                    type="text"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="e.g. Special Discount Applied"
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                  />
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <button 
                    type="submit"
                    className="w-full py-4 bg-pink-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-pink-700 transition-all shadow-xl shadow-pink-500/20"
                  >
                    {isEditing ? 'Update Fees' : 'Save / Update'}
                  </button>
                  {isEditing && (
                    <button 
                      type="button"
                      onClick={() => {
                        setIsEditing(null);
                        setFormData({ franchiseId: '', registrationFees: 0, marksheetFees: 0 });
                      }}
                      className="w-full py-4 bg-gray-100 text-[#141414] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* List Table */}
        <div className={clsx("space-y-6", isAdmin ? "lg:col-span-3" : "lg:col-span-4")}>
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left border-b border-gray-100">
                    <th className="px-8 py-6 text-[10px] font-black text-[#141414] uppercase tracking-widest">Center Name</th>
                    <th className="px-8 py-6 text-[10px] font-black text-[#141414] uppercase tracking-widest">Registration Fees</th>
                    <th className="px-8 py-6 text-[10px] font-black text-[#141414] uppercase tracking-widest">Marksheet Fees</th>
                    {isAdmin && <th className="px-8 py-6 text-[10px] font-black text-[#141414] uppercase tracking-widest text-right">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {franchiseFees.filter(ff => !isAdmin ? ff.franchiseId === currentUser?.franchiseId : true).map((fee) => (
                    <tr key={fee.id} className="hover:bg-blue-50/20 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black">
                            <Building2 size={18} />
                          </div>
                          <span className="text-xs font-black text-[#141414] uppercase tracking-tighter">{fee.franchiseName}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-mono font-bold text-xs">
                        {fee.registrationFees.toFixed(2)}
                      </td>
                      <td className="px-8 py-6 font-mono font-bold text-xs">
                        {fee.marksheetFees.toFixed(2)}
                      </td>
                      {isAdmin && (
                        <td className="px-8 py-6 text-right">
                          <button 
                            onClick={() => handleEdit(fee)}
                            className="px-6 py-2 bg-pink-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-pink-700 transition-all shadow-sm"
                          >
                            Edit
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {franchiseFees.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <div className="text-gray-300 mb-4 flex justify-center"><Search size={48} /></div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No fee configurations found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
