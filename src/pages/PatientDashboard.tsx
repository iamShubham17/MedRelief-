import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { dbService } from '@/services/dbService';
import { DashboardLayout } from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'motion/react';
import Lottie from 'lottie-react';
import splashAnimation from '@/assets/animations/preventive-health-care.json';
import { 
  SearchIcon,
  PackageIcon, 
  HeartIcon, 
  ClockIcon,
  TruckIcon,
  ShieldCheckIcon,
  ActivityIcon
} from '@/components/icons';

export function PatientDashboard() {
  const { user, profile } = useAuth();
  const [availableMedicines, setAvailableMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [requesting, setRequesting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAvailable();
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const loadAvailable = async () => {
    try {
      const data = await dbService.getAvailableMedicines();
      setAvailableMedicines(data);
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
      alert('Medicine request submitted! We will notify you once approved.');
      loadAvailable();
    } catch (err) {
      console.error(err);
      alert('Failed to submit request');
    } finally {
      setRequesting(null);
    }
  };

  const filteredMedicines = availableMedicines.filter(med => 
    med.medicineName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (showSplash) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-120 h-100">
          <Lottie animationData={splashAnimation} loop={true} />
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <h2 className="text-3xl font-black text-slate-900 mb-2">Patient Portal</h2>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">Finding the care you need...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <DashboardLayout role="patient" userName={profile?.name || 'Patient'}>
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-primary to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-primary/20">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-black mb-2">Find Your Medicine</h2>
            <p className="text-white/80 font-medium mb-6">Browse verified medicines donated by our community. All medicines are checked by registered pharmacists.</p>
            <div className="relative max-w-md">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by medicine name..." 
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900">Available Medicines</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <ActivityIcon className="w-4 h-4" />
              <span>{filteredMedicines.length} Results Found</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedicines.map((med) => (
              <motion.div 
                key={med.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all"
              >
                <div className="aspect-video bg-slate-50 relative overflow-hidden">
                  <img src={med.imageUrl} alt={med.medicineName} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-widest text-success border border-success/20 flex items-center gap-1">
                    <ShieldCheckIcon className="w-3 h-3" />
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
                  </div>

                  <button 
                    onClick={() => handleRequest(med.id)}
                    disabled={requesting === med.id}
                    className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    {requesting === med.id ? 'Processing...' : 'Request Medicine'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredMedicines.length === 0 && !loading && (
            <div className="py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <PackageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No medicines found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
