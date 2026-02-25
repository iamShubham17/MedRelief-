import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { 
  HeartIcon, 
  MailIcon, 
  PhoneIcon, 
  MapPinIcon,
  UserIcon,
  StarIcon,
  ActivityIcon
} from '@/components/icons';

export function DonorProfile() {
  const { profile } = useAuth();

  return (
    <DashboardLayout role="donor" userName={profile?.name || 'Donor'}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="h-40 bg-primary/10 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                <div className="w-full h-full rounded-xl bg-primary/5 flex items-center justify-center">
                  <UserIcon className="w-12 h-12 text-primary" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-16 pb-8 px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">{profile?.name || 'Donor Name'}</h2>
              <div className="flex items-center gap-2 text-primary mt-1">
                <HeartIcon className="w-4 h-4" />
                <span className="text-sm font-bold uppercase tracking-widest">Community Life Saver</span>
              </div>
            </div>
            <button className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
              Edit Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-primary" />
                Personal Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</p>
                  <p className="text-sm font-bold text-slate-900">{profile?.name || 'Not provided'}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                  <p className="text-sm font-bold text-slate-900">{profile?.email || 'Not provided'}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone</p>
                  <p className="text-sm font-bold text-slate-900">{profile?.phone || 'Not linked'}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">City</p>
                  <p className="text-sm font-bold text-slate-900">{profile?.city || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <StarIcon className="w-5 h-5 text-primary" />
                Impact Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10">
                  <div>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">MediPoints</p>
                    <p className="text-xl font-black text-slate-900">{profile?.mediPoints || 0}</p>
                  </div>
                  <ActivityIcon className="w-6 h-6 text-primary" />
                </div>
                
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Lives Impacted</p>
                  <p className="text-lg font-black text-slate-900">~{Math.floor((profile?.mediPoints || 0) / 10)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
