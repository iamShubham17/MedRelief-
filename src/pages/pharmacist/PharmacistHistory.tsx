import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { dbService } from '@/services/dbService';
import { motion } from 'framer-motion';
import { 
  ClipboardCheckIcon, 
  CheckCircleIcon, 
  XIcon,
  ClockIcon
} from '@/components/icons';

export function PharmacistHistory() {
  const { user, profile } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    try {
      const data = await dbService.getPharmacistHistory(user!.uid);
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="pharmacist" userName={profile?.name || 'Pharmacist'}>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Verification History</h2>
            <p className="text-sm text-slate-500 font-medium">Review your past medicine quality assessments</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                <tr>
                  <th className="px-8 py-5">ID</th>
                  <th className="px-8 py-5">Type</th>
                  <th className="px-8 py-5">Medicine</th>
                  <th className="px-8 py-5">User</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {history.map((item, i) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="text-sm hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-8 py-6 font-mono text-xs text-slate-400">...{item.id?.toString().slice(-6) || 'N/A'}</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.type === 'donation' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-8 py-6 font-bold text-slate-900">{item.medicine}</td>
                    <td className="px-8 py-6 text-slate-600">{item.user}</td>
                    <td className="px-8 py-6 text-slate-500">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="px-8 py-6">
                      <div className={`flex items-center gap-2 ${item.status === 'Approved' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {item.status === 'Approved' ? <CheckCircleIcon className="w-4 h-4" /> : <XIcon className="w-4 h-4" />}
                        <span className="text-xs font-bold uppercase tracking-widest">{item.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-xs text-slate-400 max-w-xs truncate">{item.notes}</td>
                  </motion.tr>
                ))}
                {history.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="px-8 py-12 text-center text-slate-400 font-bold">No history found</td>
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
