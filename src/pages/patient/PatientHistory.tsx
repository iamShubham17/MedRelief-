import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { dbService } from '@/services/dbService';
import { motion } from 'framer-motion';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XIcon,
  PackageIcon,
  TruckIcon
} from '@/components/icons';

export function PatientHistory() {
  const { user, profile } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user]);

  const loadRequests = async () => {
    try {
      const data = await dbService.getUserRequests(user!.uid);
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="patient" userName={profile?.name || 'Patient'}>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900">My Requests</h2>
          <p className="text-sm text-slate-500 font-medium">Track the status of your medicine requests</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                <tr>
                  <th className="px-8 py-5">Medicine</th>
                  <th className="px-8 py-5">Request Date</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {requests.map((r, i) => (
                  <motion.tr 
                    key={r.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="text-sm hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100">
                          <img src={r.medicineId?.imageUrl} alt={r.medicineId?.medicineName} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold text-slate-900">{r.medicineId?.medicineName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-slate-500">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {r.status === 'approved' ? (
                          <div className="flex items-center gap-2 text-success">
                            <CheckCircleIcon className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Approved</span>
                          </div>
                        ) : r.status === 'rejected' ? (
                          <div className="flex items-center gap-2 text-red-500">
                            <XIcon className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Rejected</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-amber-500">
                            <ClockIcon className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Pending</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {r.status === 'approved' ? (
                        <button className="text-primary font-bold text-xs uppercase tracking-widest hover:underline">
                          Track Delivery
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">No Action</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
                {requests.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="px-8 py-12 text-center text-slate-400">You haven't requested any medicines yet.</td>
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
