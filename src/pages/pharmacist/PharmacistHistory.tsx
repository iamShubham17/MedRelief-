import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'motion/react';
import { 
  ClipboardCheckIcon, 
  CheckCircleIcon, 
  XIcon,
  ClockIcon
} from '@/components/icons';

export function PharmacistHistory() {
  const { profile } = useAuth();

  const verificationHistory = [
    { id: 'VRF-901', medicine: 'Paracetamol 500mg', donor: 'John Doe', date: '2024-02-24', status: 'Approved', notes: 'Packaging intact, within expiry.' },
    { id: 'VRF-902', medicine: 'Amoxicillin', donor: 'Sarah Jane', date: '2024-02-23', status: 'Approved', notes: 'Verified batch number.' },
    { id: 'VRF-903', medicine: 'Cough Syrup', donor: 'Mike Ross', date: '2024-02-22', status: 'Rejected', notes: 'Seal broken.' },
    { id: 'VRF-904', medicine: 'Vitamin D3', donor: 'Harvey Specter', date: '2024-02-21', status: 'Approved', notes: 'Standard verification passed.' },
  ];

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
                  <th className="px-8 py-5">Medicine</th>
                  <th className="px-8 py-5">Donor</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {verificationHistory.map((item, i) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="text-sm hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-8 py-6 font-mono text-xs text-slate-400">{item.id}</td>
                    <td className="px-8 py-6 font-bold text-slate-900">{item.medicine}</td>
                    <td className="px-8 py-6 text-slate-600">{item.donor}</td>
                    <td className="px-8 py-6 text-slate-500">{item.date}</td>
                    <td className="px-8 py-6">
                      <div className={`flex items-center gap-2 ${item.status === 'Approved' ? 'text-success' : 'text-red-500'}`}>
                        {item.status === 'Approved' ? <CheckCircleIcon className="w-4 h-4" /> : <XIcon className="w-4 h-4" />}
                        <span className="text-xs font-bold uppercase tracking-widest">{item.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-xs text-slate-400 max-w-xs truncate">{item.notes}</td>
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
