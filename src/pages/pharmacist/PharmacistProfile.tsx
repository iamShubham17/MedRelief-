import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { 
  ShieldCheckIcon, 
  MailIcon, 
  PhoneIcon, 
  MapPinIcon,
  UserIcon,
  ClipboardCheckIcon,
  MedicalServicesIcon,
  CheckCircleIcon
} from '@/components/icons';

export function PharmacistProfile() {
  const { profile } = useAuth();

  return (
    <DashboardLayout role="pharmacist" userName={profile?.name || 'Pharmacist'}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="h-40 bg-amber-500/10 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                <div className="w-full h-full rounded-xl bg-amber-50 flex items-center justify-center">
                  <MedicalServicesIcon className="w-12 h-12 text-amber-500" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-16 pb-8 px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">{profile?.name || 'Pharmacist Name'}</h2>
              <div className="flex items-center gap-2 text-amber-600 mt-1">
                <ShieldCheckIcon className="w-4 h-4" />
                <span className="text-sm font-bold uppercase tracking-widest">Registered Pharmacist</span>
              </div>
            </div>
            <button className="px-6 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-amber-200 hover:bg-amber-600 transition-all">
              Edit Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-amber-500" />
              Professional Details
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">License Number</p>
                <p className="text-sm font-bold text-slate-900">{profile?.licenseNumber || 'Not provided'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">State Council</p>
                <p className="text-sm font-bold text-slate-900">{profile?.stateCouncil || 'Not provided'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pharmacy Address</p>
                <p className="text-sm font-bold text-slate-900">{profile?.pharmacyAddress || 'Not provided'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5 text-amber-500" />
              Account Status
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-success/5 border border-success/10">
                <div>
                  <p className="text-[10px] font-bold text-success uppercase tracking-widest">Verification</p>
                  <p className="text-sm font-bold text-slate-900">Verified Professional</p>
                </div>
                <CheckCircleIcon className="w-6 h-6 text-success" />
              </div>
              
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">MediPoints Earned</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-slate-900">{profile?.mediPoints || 0}</span>
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Points</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
