import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { dbService } from '@/services/dbService';
import { DashboardLayout } from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import splashAnimation from '@/assets/animations/business-team.json';
import { 
  Globe, 
  PackageIcon, 
  HeartIcon, 
  SearchIcon,
  ClockIcon,
  TruckIcon,
  ClipboardCheckIcon
} from '@/components/icons';

export function NGODashboard() {
  const { user, profile } = useAuth();
  const [availableMedicines, setAvailableMedicines] = useState<any[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<'available' | 'requests'>('available');
  const [requesting, setRequesting] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const loadData = async () => {
    try {
      const [available, requests] = await Promise.all([
        dbService.getAvailableMedicines(),
        user ? dbService.getUserRequests(user.uid) : Promise.resolve([])
      ]);
      setAvailableMedicines(available);
      setMyRequests(requests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (medicineId: string) => {
    if (!user) return;
    setRequesting(medicineId);
    try {
      await dbService.requestMedicine(user.uid, medicineId);
      alert('Request submitted successfully!');
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to submit request');
    } finally {
      setRequesting(null);
    }
  };

  if (showSplash) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-[600px] h-[500px]">
          <Lottie animationData={splashAnimation} loop={true} />
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <h2 className="text-3xl font-black text-slate-900 mb-2">NGO Portal</h2>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">Connecting relief to those in need...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <DashboardLayout role="ngo" userName={profile?.orgName || 'NGO Partner'}>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <PackageIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500">Available Stock</p>
                <p className="text-2xl font-black text-slate-900">{availableMedicines.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center">
                <TruckIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500">My Requests</p>
                <p className="text-2xl font-black text-slate-900">{myRequests.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-slate-100 pb-px">
          <button 
            onClick={() => setActiveTab('available')}
            className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'available' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Available Relief
            {activeTab === 'available' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
          <button 
            onClick={() => setActiveTab('requests')}
            className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'requests' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Request History
            {activeTab === 'requests' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
        </div>

        {activeTab === 'available' ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900">Verified Medicines Available</h3>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search medicines..." 
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-primary w-64"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableMedicines.map((med) => (
                <motion.div 
                  key={med.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col"
                >
                  <div className="aspect-video bg-slate-50 relative overflow-hidden">
                    <img src={med.imageUrl} alt={med.medicineName} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-widest text-success border border-success/20">
                      Verified
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h4 className="font-black text-slate-900 text-lg mb-1">{med.medicineName}</h4>
                    <p className="text-xs text-slate-500 font-medium mb-4">Quantity: {med.quantity}</p>
                    
                    <div className="space-y-3 mb-6 flex-1">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <ClockIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>Expires: <span className="font-bold text-slate-900">{med.expiryDate}</span></span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <HeartIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>Donor: <span className="font-bold text-slate-900">{med.donorName}</span></span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleRequest(med.id)}
                      disabled={requesting === med.id}
                      className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50"
                    >
                      {requesting === med.id ? 'Requesting...' : 'Request Relief'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {availableMedicines.length === 0 && !loading && (
              <div className="py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <PackageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No verified medicines available at the moment.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900">Organization Request History</h3>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Medicine</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {myRequests.map((req) => (
                    <tr key={req.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="p-6">
                        <p className="font-bold text-slate-900">{req.medicineId?.medicineName}</p>
                        <p className="text-xs text-slate-500">Qty: {req.medicineId?.quantity}</p>
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          req.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 
                          req.status === 'pending' ? 'bg-amber-50 text-amber-600' : 
                          'bg-rose-50 text-rose-600'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="p-6 text-xs font-bold text-slate-400">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {myRequests.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-12 text-center text-slate-400 italic">No requests found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
