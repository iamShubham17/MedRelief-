import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { dbService } from '@/services/dbService';
import { DashboardLayout } from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'motion/react';
import Lottie from 'lottie-react';
import splashAnimation from '@/assets/animations/atom-loader.json';
import { 
  ShieldCheckIcon, 
  UserIcon, 
  ActivityIcon,
  ClockIcon,
  HeartIcon
} from '@/components/icons';

export function AdminDashboard() {
  const { profile } = useAuth();
  const [pendingPharmacists, setPendingPharmacists] = useState<any[]>([]);
  const [pendingNGOs, setPendingNGOs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    loadPending();
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const loadPending = async () => {
    try {
      const pharmacists = await dbService.getPendingApprovals('pharmacist');
      const ngos = await dbService.getPendingApprovals('ngo');
      setPendingPharmacists(pharmacists);
      setPendingNGOs(ngos);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (uid: string) => {
    try {
      await dbService.approveUser(uid);
      loadPending();
    } catch (err) {
      console.error(err);
      alert('Failed to approve user');
    }
  };

  if (showSplash) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-80 h-80">
          <Lottie animationData={splashAnimation} loop={true} />
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <h2 className="text-3xl font-black text-slate-900 mb-2">Admin Console</h2>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">Securing system access...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <DashboardLayout role="admin" userName={profile?.name || 'System Admin'}>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-sm font-bold text-slate-500">Pending Pharmacists</p>
            <p className="text-2xl font-black text-slate-900">{pendingPharmacists.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-sm font-bold text-slate-500">Pending NGOs</p>
            <p className="text-2xl font-black text-slate-900">{pendingNGOs.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Pharmacist Approvals</h3>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {pendingPharmacists.map((p) => (
                <div key={p.id} className="p-6 border-b border-slate-50 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{p.name}</p>
                    <p className="text-xs text-slate-500">License: {p.licenseNumber}</p>
                    <a href={p.licenseUrl} target="_blank" rel="noreferrer" className="text-[10px] text-primary font-bold hover:underline">View License</a>
                  </div>
                  <button 
                    onClick={() => handleApprove(p.id)}
                    className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold"
                  >
                    Approve
                  </button>
                </div>
              ))}
              {pendingPharmacists.length === 0 && <div className="p-8 text-center text-slate-400">No pending pharmacists</div>}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900">NGO Approvals</h3>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {pendingNGOs.map((n) => (
                <div key={n.id} className="p-6 border-b border-slate-50 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{n.orgName}</p>
                    <p className="text-xs text-slate-500">Reg: {n.regNumber}</p>
                    <a href={n.certUrl} target="_blank" rel="noreferrer" className="text-[10px] text-primary font-bold hover:underline">View Certificate</a>
                  </div>
                  <button 
                    onClick={() => handleApprove(n.id)}
                    className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold"
                  >
                    Approve
                  </button>
                </div>
              ))}
              {pendingNGOs.length === 0 && <div className="p-8 text-center text-slate-400">No pending NGOs</div>}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
