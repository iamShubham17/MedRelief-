import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { dbService } from '@/services/dbService';
import { DashboardLayout } from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import splashAnimation from '@/assets/animations/SNAIL LOADER.json';
import { 
  PlusCircleIcon, 
  PackageIcon, 
  HeartIcon, 
  ActivityIcon,
  ClockIcon,
  XIcon
} from '@/components/icons';

export function DonorDashboard() {
  const { user, profile } = useAuth();
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      loadDonations();
    }
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, [user]);

  const loadDonations = async () => {
    try {
      const data = await dbService.getDonationsByDonor(user!.uid);
      setDonations(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDonations = donations.filter(d => 
    d.medicineName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDonate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const medicineName = formData.get('medicineName') as string;
    const expiryDate = formData.get('expiryDate') as string;
    const quantity = formData.get('quantity') as string;
    const imageUrl = formData.get('imageUrl') as string;

    setFormLoading(true);
    try {
      await dbService.createDonation(user!.uid, {
        medicineName,
        expiryDate,
        quantity,
        imageUrl: imageUrl || 'https://picsum.photos/seed/med/300/300',
        donorName: profile?.name || 'Anonymous Donor',
      });

      setIsModalOpen(false);
      loadDonations();
      alert('Donation submitted successfully! Thank you for your contribution.');
    } catch (err) {
      console.error(err);
      alert('Failed to create donation');
    } finally {
      setFormLoading(false);
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
          <h2 className="text-3xl font-black text-slate-900 mb-2">Donor Portal</h2>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">Preparing your impact dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <DashboardLayout 
      role="donor" 
      userName={profile?.name || 'Donor'}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      actions={
        <>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100">
            <ClockIcon className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-900">Impact tracking</span>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 bg-[#4f46e5] text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <PlusCircleIcon className="w-4 h-4" />
            Donate Medicine
          </button>
        </>
      }
    >
      <div className="space-y-8">
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'Total Donations', value: donations.length, trend: '↑ 2.4%', color: 'text-emerald-500' },
            { label: 'MediPoints', value: profile?.mediPoints || 0, trend: '↑ 15.0%', color: 'text-emerald-500' },
            { label: 'Lives Impacted', value: Math.floor(donations.length * 1.5), trend: '↑ 8.2%', color: 'text-emerald-500' },
            { label: 'Pending Verification', value: donations.filter(d => d.status === 'pending_verification').length, trend: '↓ 1.1%', color: 'text-rose-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-50 flex flex-col justify-between min-h-[160px] group hover:shadow-xl hover:shadow-indigo-50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-slate-900">{stat.label}</p>
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-indigo-600 transition-colors">
                  <ActivityIcon className="w-3 h-3" />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 mb-2">{stat.value}</h3>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black ${stat.color} px-2 py-0.5 bg-slate-50 rounded-full`}>{stat.trend}</span>
                  <span className="text-[10px] font-bold text-slate-300">vs last month</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-50">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-900">Your Donation History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-300 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">
                  <th className="pb-4">Medicine</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Expiry</th>
                  <th className="pb-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredDonations.map((d) => (
                  <tr key={d.id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-50">
                          <img src={d.imageUrl || 'https://picsum.photos/seed/med/100/100'} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs font-black text-slate-900">{d.medicineName}</span>
                      </div>
                    </td>
                    <td className="py-5">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        d.status === 'verified' ? 'bg-emerald-50 text-emerald-600' : 
                        d.status === 'rejected' ? 'bg-rose-50 text-rose-600' : 
                        'bg-amber-50 text-amber-600'
                      }`}>
                        {d.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-5 text-xs font-bold text-slate-400">{d.expiryDate}</td>
                    <td className="py-5 text-right text-xs font-bold text-slate-400">
                      {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
                {filteredDonations.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="py-20 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <PackageIcon className="w-6 h-6 text-slate-300" />
                      </div>
                      <p className="text-sm font-bold text-slate-900">No donations found</p>
                      <p className="text-xs text-slate-400 mt-1">Start by clicking "Donate Medicine"</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden"
          >
            <div className="p-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Donate Medicine</h3>
                  <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">Share your surplus medicine</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
                  <XIcon className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleDonate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Medicine Name</label>
                  <input name="medicineName" required className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-100" placeholder="e.g. Paracetamol 500mg" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Expiry Date</label>
                    <input name="expiryDate" type="month" required className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-100" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Quantity</label>
                    <input name="quantity" required className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-100" placeholder="e.g. 2 Strips" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Medicine Image URL</label>
                  <input name="imageUrl" className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-100" placeholder="https://example.com/image.jpg" />
                </div>
                <button disabled={formLoading} type="submit" className="w-full py-5 bg-[#4f46e5] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                  {formLoading ? 'Uploading...' : 'Submit Donation'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}
