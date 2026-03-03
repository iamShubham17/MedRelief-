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

  const [searchQuery, setSearchQuery] = useState('');

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
      setAvailableMedicines(available || []);
      setMyRequests(requests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMedicines = availableMedicines.filter(med => 
    med.medicineName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRequest = async (medicineId: string) => {
    if (!user) return;
    setRequesting(medicineId);
    try {
      await dbService.requestMedicine(user.uid, medicineId);
      alert('Relief request submitted successfully! Our team will verify and process it shortly.');
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
    <DashboardLayout 
      role="ngo" 
      userName={profile?.orgName || 'NGO Partner'}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      actions={
        <div className="flex items-center gap-4">
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
            <button 
              onClick={() => setActiveTab('available')}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'available' ? 'bg-[#4f46e5] text-white' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Available Relief
            </button>
            <button 
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'requests' ? 'bg-[#4f46e5] text-white' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Request History
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-8">
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: 'Available Stock', value: availableMedicines.length, icon: PackageIcon, color: 'text-indigo-600' },
            { label: 'My Requests', value: myRequests.length, icon: TruckIcon, color: 'text-emerald-600' },
            { label: 'Lives Impacted', value: myRequests.filter(r => r.status === 'approved').length * 10, icon: HeartIcon, color: 'text-rose-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-50 flex flex-col justify-between min-h-[140px] group hover:shadow-xl hover:shadow-indigo-50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-slate-900">{stat.label}</p>
                <div className={`p-2 bg-slate-50 rounded-lg ${stat.color} group-hover:bg-indigo-50 transition-colors`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
            </div>
          ))}
        </div>

        {activeTab === 'available' ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900">Verified Medicines Available</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedicines.map((med) => (
                <motion.div 
                  key={med.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-[32px] border border-slate-50 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-indigo-50 transition-all"
                >
                  <div className="aspect-video bg-slate-50 relative overflow-hidden">
                    <img src={med.imageUrl || 'https://picsum.photos/seed/med/400/300'} alt={med.medicineName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 px-4 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-100">
                      Verified
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h4 className="font-black text-slate-900 text-lg mb-1">{med.medicineName}</h4>
                    <p className="text-xs text-slate-400 font-bold mb-6">Quantity: {med.quantity}</p>
                    
                    <div className="space-y-3 mb-8 flex-1">
                      <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                        <ClockIcon className="w-4 h-4 text-slate-300" />
                        <span>Expires: <span className="text-slate-900">{med.expiryDate}</span></span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                        <HeartIcon className="w-4 h-4 text-slate-300" />
                        <span>Donor: <span className="text-slate-900">{med.donorName}</span></span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleRequest(med.id)}
                      disabled={requesting === med.id}
                      className="w-full py-4 bg-[#4f46e5] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
                    >
                      {requesting === med.id ? 'Requesting...' : 'Request Relief'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredMedicines.length === 0 && !loading && (
              <div className="py-24 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
                <PackageIcon className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-900 font-black">No medicines found</p>
                <p className="text-xs text-slate-400 font-bold mt-1">Try a different search term or check back later</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900">Organization Request History</h3>
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-50 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-300 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">
                    <th className="pb-4">Medicine</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {myRequests.map((req) => (
                    <tr key={req.id} className="group hover:bg-slate-50/50 transition-all">
                      <td className="py-6">
                        <p className="font-black text-slate-900 text-sm">{req.medicineId?.medicineName}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Qty: {req.medicineId?.quantity}</p>
                      </td>
                      <td className="py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          req.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 
                          req.status === 'pending' ? 'bg-amber-50 text-amber-600' : 
                          'bg-rose-50 text-rose-600'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-6 text-right text-xs font-bold text-slate-400">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {myRequests.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-20 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <ClipboardCheckIcon className="w-6 h-6 text-slate-300" />
                        </div>
                        <p className="text-sm font-bold text-slate-900">No requests found</p>
                        <p className="text-xs text-slate-400 mt-1">Your organization's requests will appear here</p>
                      </td>
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
