import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { dbService } from '@/services/dbService';
import { DashboardLayout } from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import splashAnimation from '@/assets/animations/AR Tablet.json';
import { 
  ClipboardCheckIcon, 
  ShieldCheckIcon, 
  ClockIcon,
  SearchIcon,
  AlertCircle
} from '@/components/icons';

export function PharmacistDashboard() {
  const { user, profile } = useAuth();
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    loadQueue();
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const loadQueue = async () => {
    try {
      const data = await dbService.getVerificationQueue();
      setQueue(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (decision: 'approved' | 'rejected') => {
    if (!selectedDonation) return;
    setVerifying(true);
    try {
      await dbService.verifyDonation(selectedDonation.id, user!.uid, decision, notes);
      setSelectedDonation(null);
      setNotes('');
      loadQueue();
    } catch (err) {
      console.error(err);
    } finally {
      setVerifying(false);
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
          <h2 className="text-3xl font-black text-slate-900 mb-2">Pharmacist Portal</h2>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">Initializing verification engine...</p>
        </motion.div>
      </div>
    );
  }

  if (profile?.status === 'pending') {
    return (
      <DashboardLayout role="pharmacist" userName={profile?.name || 'Pharmacist'}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-6">
            <ClockIcon className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Pending Approval</h2>
          <p className="text-slate-500 max-w-md">
            Your pharmacist credentials are being verified by our admin team. You will get access to the verification queue once approved.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="pharmacist" userName={profile?.name || 'Pharmacist'}>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <ClockIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500">Pending Queue</p>
                <p className="text-2xl font-black text-slate-900">{queue.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Verification Queue</h3>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {queue.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedDonation(item)}
                  className={`p-6 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer border-b border-slate-50 ${selectedDonation?.id === item.id ? 'bg-primary/5 border-primary/20' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100">
                      <img src={item.imageUrl} alt={item.medicineName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{item.medicineName}</p>
                      <p className="text-xs text-slate-500">Donor: {item.donorName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Expires</p>
                    <p className="text-sm font-bold text-slate-900">{item.expiryDate}</p>
                  </div>
                </div>
              ))}
              {queue.length === 0 && !loading && (
                <div className="p-12 text-center text-slate-400">Queue is empty. Great job!</div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Action Panel</h3>
            {selectedDonation ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6"
              >
                <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 mb-4">
                  <img src={selectedDonation.imageUrl} alt="Medicine" className="w-full h-full object-contain" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pharmacist Notes</label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter observations..." 
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-primary"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    disabled={verifying}
                    onClick={() => handleVerify('rejected')}
                    className="py-3 border border-red-200 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-all"
                  >
                    Reject
                  </button>
                  <button 
                    disabled={verifying}
                    onClick={() => handleVerify('approved')}
                    className="py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all"
                  >
                    Approve
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-slate-50 p-8 rounded-2xl border border-dashed border-slate-200 text-center">
                <ClipboardCheckIcon className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                <p className="text-sm text-slate-500">Select a donation from the queue to start verification</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
