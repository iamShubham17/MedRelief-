import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { 
  Globe, 
  MailIcon, 
  PhoneIcon, 
  MapPinIcon,
  UserIcon,
  ShieldCheckIcon,
  ActivityIcon
} from '@/components/icons';

export function NGOProfile() {
  const { profile } = useAuth();

  return (
    <DashboardLayout role="ngo" userName={profile?.orgName || 'NGO Partner'}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="h-40 bg-primary/5 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                <div className="w-full h-full rounded-xl bg-primary/10 flex items-center justify-center">
                  <Globe className="w-12 h-12 text-primary" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-16 pb-8 px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">{profile?.orgName || 'Organization Name'}</h2>
              <div className="flex items-center gap-2 text-primary mt-1">
                <ShieldCheckIcon className="w-4 h-4" />
                <span className="text-sm font-bold uppercase tracking-widest">Verified NGO Partner</span>
              </div>
            </div>
            <button className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
              Update Organization Info
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-primary" />
              Registration Details
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Registration Number</p>
                <p className="text-sm font-bold text-slate-900">{profile?.regNumber || 'Not provided'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Official Address</p>
                <p className="text-sm font-bold text-slate-900">{profile?.address || 'Not provided'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Contact Person</p>
                <p className="text-sm font-bold text-slate-900">{profile?.name || 'Not provided'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ActivityIcon className="w-5 h-5 text-primary" />
              Impact Summary
            </h3>
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Total Relief Distributed</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-slate-900">0</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Medicines</span>
                </div>
              </div>
              
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Beneficiaries Reached</p>
                <p className="text-lg font-black text-slate-900">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
