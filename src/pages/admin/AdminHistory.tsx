import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon, 
  UserIcon, 
  ClockIcon,
  CheckCircleIcon,
  XIcon
} from '@/components/icons';

export function AdminHistory() {
  const { profile } = useAuth();

  const auditLog = [
    { id: 'LOG-001', action: 'User Approved', target: 'Dr. Sarah Smith', role: 'Pharmacist', date: '2024-02-24 10:30 AM', status: 'Success' },
    { id: 'LOG-002', action: 'NGO Verified', target: 'Helping Hands', role: 'NGO', date: '2024-02-24 09:15 AM', status: 'Success' },
    { id: 'LOG-003', action: 'System Update', target: 'Security Patch', role: 'System', date: '2024-02-23 11:45 PM', status: 'Success' },
    { id: 'LOG-004', action: 'User Rejected', target: 'Unknown Entity', role: 'Pharmacist', date: '2024-02-23 02:20 PM', status: 'Rejected' },
  ];

  return (
    <DashboardLayout role="admin" userName={profile?.name || 'System Admin'}>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-900">System Audit Logs</h2>
            <p className="text-sm text-slate-500 font-medium">Track all administrative actions and system events</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all">Export CSV</button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                <tr>
                  <th className="px-8 py-5">Log ID</th>
                  <th className="px-8 py-5">Action</th>
                  <th className="px-8 py-5">Target</th>
                  <th className="px-8 py-5">Date & Time</th>
                  <th className="px-8 py-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {auditLog.map((log, i) => (
                  <motion.tr 
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="text-sm hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-8 py-6 font-mono text-xs text-slate-400">{log.id}</td>
                    <td className="px-8 py-6">
                      <span className="font-bold text-slate-900">{log.action}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{log.target}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{log.role}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-slate-500 font-medium">{log.date}</td>
                    <td className="px-8 py-6">
                      <div className={`flex items-center gap-2 ${log.status === 'Success' ? 'text-success' : 'text-red-500'}`}>
                        {log.status === 'Success' ? <CheckCircleIcon className="w-4 h-4" /> : <XIcon className="w-4 h-4" />}
                        <span className="text-xs font-bold uppercase tracking-widest">{log.status}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
