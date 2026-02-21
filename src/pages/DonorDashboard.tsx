import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { dbService } from '@/services/dbService';
import { DashboardLayout } from '@/components/DashboardLayout';
import { motion } from 'motion/react';
import { 
  PlusCircleIcon, 
  PackageIcon, 
  HeartIcon, 
  ActivityIcon,
  ClockIcon,
  XIcon
} from '@/components/icons';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/config/firebase';

export function DonorDashboard() {
  const { user, profile } = useAuth();
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadDonations();
    }
  }, [user]);

  const loadDonations = async () => {
    try {
      const data = await dbService.getDonationsByDonor(user!.uid);
      setDonations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const medicineName = formData.get('medicineName') as string;
    const expiryDate = formData.get('expiryDate') as string;
    const quantity = formData.get('quantity') as string;
    const photo = (formData.get('photo') as File);

    if (!photo) return;

    setFormLoading(true);
    try {
      const storageRef = ref(storage, `donations/${user!.uid}/${Date.now()}_${photo.name}`);
      await uploadBytes(storageRef, photo);
      const photoUrl = await getDownloadURL(storageRef);

      await dbService.createDonation(user!.uid, {
        medicineName,
        expiryDate,
        quantity,
        photoUrl,
        donorName: profile?.name || 'Anonymous Donor',
      });

      setIsModalOpen(false);
      loadDonations();
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <DashboardLayout role="donor" userName={profile?.name || 'Donor'}>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <PackageIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500">Total Donations</p>
                <p className="text-2xl font-black text-slate-900">{donations.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center">
                <HeartIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500">MediPoints</p>
                <p className="text-2xl font-black text-slate-900">{profile?.mediPoints || 0}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white p-6 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-4"
          >
            <PlusCircleIcon className="w-8 h-8" />
            <span className="text-lg font-bold">Donate Medicine</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Your Donations</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-widest">
                <tr>
                  <th className="px-6 py-4">Medicine</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Expiry</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {donations.map((d) => (
                  <tr key={d.id} className="text-sm">
                    <td className="px-6 py-4 font-bold text-slate-900">{d.medicineName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        d.status === 'verified' ? 'bg-success/10 text-success' : 
                        d.status === 'rejected' ? 'bg-red-50 text-red-500' : 
                        'bg-amber-50 text-amber-500'
                      }`}>
                        {d.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{d.expiryDate}</td>
                    <td className="px-6 py-4 text-slate-400">{d.createdAt?.toDate().toLocaleDateString()}</td>
                  </tr>
                ))}
                {donations.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">No donations yet. Start by clicking "Donate Medicine"</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold">Donate Medicine</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-primary">
                  <XIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleDonate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Medicine Name</label>
                  <input name="medicineName" required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-primary" placeholder="e.g. Paracetamol 500mg" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Expiry Date</label>
                    <input name="expiryDate" type="month" required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Quantity</label>
                    <input name="quantity" required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-primary" placeholder="e.g. 2 Strips" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Medicine Photo</label>
                  <input name="photo" type="file" required accept="image/*" className="w-full px-4 py-3 border border-dashed border-slate-200 rounded-xl" />
                </div>
                <button disabled={formLoading} type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20">
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
