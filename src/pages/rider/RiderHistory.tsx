import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'motion/react';
import { 
  TruckIcon, 
  MapPinIcon, 
  ClockIcon,
  CheckCircleIcon
} from '@/components/icons';

export function RiderHistory() {
  const { profile } = useAuth();

  const history = [
    { id: 'DEL-101', date: '2024-02-20', from: 'City Hospital', to: 'Red Cross Center', status: 'Completed', type: 'Medicine' },
    { id: 'DEL-102', date: '2024-02-18', from: 'Apollo Pharmacy', to: 'NGO Shelter Home', status: 'Completed', type: 'First Aid' },
    { id: 'DEL-103', date: '2024-02-15', from: 'Wellness Clinic', to: 'Patient Home (Andheri)', status: 'Completed', type: 'Insulin' },
    { id: 'DEL-104', date: '2024-02-10', from: 'Govt Medical Store', to: 'Relief Camp', status: 'Completed', type: 'Antibiotics' },
  ];

  return (
    <DashboardLayout role="rider" userName={profile?.name || 'Rider'}>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-slate-900">Delivery History</h2>
          <div className="flex gap-2">
            <span className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500">Last 30 Days</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                <tr>
                  <th className="px-8 py-5">Delivery ID</th>
                  <th className="px-8 py-5">Route</th>
                  <th className="px-8 py-5">Type</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {history.map((item, i) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="text-sm hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-8 py-6 font-bold text-slate-900">{item.id}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                          <div className="w-0.5 h-4 bg-slate-200"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700">{item.from}</span>
                          <span className="text-xs font-bold text-slate-400">{item.to}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-slate-500 font-medium">{item.date}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-success">
                        <CheckCircleIcon className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">{item.status}</span>
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
