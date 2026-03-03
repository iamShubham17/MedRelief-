import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { dbService } from '@/services/dbService';
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
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await dbService.getAdminHistory();
      setLogs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="admin" userName={profile?.name || 'System Admin'}>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-900">System Audit Logs</h2>
            <p className="text-sm text-slate-500 font-medium">Track all administrative actions and system events</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={loadLogs}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all"
            >
              Refresh
            </button>
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
                {logs.map((log, i) => (
                  <motion.tr 
                    key={log._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="text-sm hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-8 py-6 font-mono text-xs text-slate-400">...{log._id.slice(-6)}</td>
                    <td className="px-8 py-6">
                      <span className="font-bold text-slate-900">{log.action}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{log.target}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{log.targetRole}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-slate-500 font-medium">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="px-8 py-6">
                      <div className={`flex items-center gap-2 ${log.status === 'Success' ? 'text-success' : 'text-red-500'}`}>
                        {log.status === 'Success' ? <CheckCircleIcon className="w-4 h-4" /> : <XIcon className="w-4 h-4" />}
                        <span className="text-xs font-bold uppercase tracking-widest">{log.status}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {logs.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-slate-400 font-bold">No audit logs found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
