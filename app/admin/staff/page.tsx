'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { Modal } from '@/src/components/ui/Modal';
import { ShieldCheck, UserPlus, Mail, Shield, Trash2, CheckCircle2 } from 'lucide-react';
import { StaffMember } from '@/src/lib/types';

import { inviteOrAddStaffInDB, removeStaffInDB } from '@/src/lib/firebase/staff';

export default function StaffPage() {
  const { staff, addToast } = useAdmin();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Store Manager' | 'Order Manager' | 'Inventory Manager' | 'Customer Support'>('Store Manager');

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    try {
      await inviteOrAddStaffInDB({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
      });

      setIsInviteModalOpen(false);
      setName('');
      setEmail('');
      addToast({
        type: 'success',
        title: 'Staff Access Granted ♡',
        description: `${name} has been assigned ${role} role in Firestore and can access the dashboard.`
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Invite Failed',
        description: err instanceof Error ? err.message : 'Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (id: string, memberName: string) => {
    if (!confirm(`Revoke dashboard access for ${memberName}?`)) return;
    try {
      await removeStaffInDB(id);
      addToast({
        type: 'info',
        title: 'Access Revoked',
        description: `${memberName} is no longer authorized to access the dashboard.`
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Revoke Failed',
        description: err instanceof Error ? err.message : 'Please try again.'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Staff & Team Access</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Invite managers, warehouse staff, and customer support representatives.
          </p>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="neria-btn-primary px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Staff</span>
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-[#F2F3F5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F8FA] border-b border-[#F2F3F5] text-[11px] font-bold text-[#667085] uppercase tracking-wider">
              <tr>
                <th className="py-4 px-4">Team Member</th>
                <th className="py-4 px-3">Email</th>
                <th className="py-4 px-3">Role</th>
                <th className="py-4 px-3">Last Active</th>
                <th className="py-4 px-3">Status</th>
                <th className="py-4 px-4 text-right">Joined</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F3F5] text-xs">
              {staff.map((st) => (
                <tr key={st.id} className="hover:bg-[#FFF4F8]/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img src={st.avatar} alt={st.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-[#FFD8EA]" />
                      <span className="font-bold text-[#263550]">{st.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-[#667085]">{st.email}</td>
                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFF4F8] text-[#FF4FA3] border border-[#FFD8EA]">
                      {st.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-[#667085]">{st.lastActive}</td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={st.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right text-[#98A0AE]">
                    {st.createdAt}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleRemove(st.id, st.name)}
                      title="Revoke Access"
                      className="p-1.5 rounded-lg text-[#98A0AE] hover:text-[#B42318] hover:bg-[#FEF3F2] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Team Member"
        subtitle="Grant operational access to Neria Admin Console"
      >
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#263550] mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Abena Serwaa"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-sm text-[#263550] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#263550] mb-1">Corporate Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="abena@neriacollective.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-sm text-[#263550] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#263550] mb-1">Assigned Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] bg-white outline-none"
            >
              <option value="Store Manager">Store Manager</option>
              <option value="Order Manager">Order & Fulfillment Manager</option>
              <option value="Inventory Manager">Inventory & Warehouse Manager</option>
              <option value="Customer Support">Customer Support Representative</option>
            </select>
          </div>

          <div className="pt-4 border-t border-[#F2F3F5] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsInviteModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#DDE1E7] text-xs font-semibold text-[#667085]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="neria-btn-primary px-5 py-2 text-xs font-semibold cursor-pointer"
            >
              Send Invitation ♡
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
