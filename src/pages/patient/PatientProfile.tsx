import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { 
  UserIcon, 
  MailIcon, 
  PhoneIcon, 
  MapPinIcon,
  ShieldCheckIcon,
  HeartIcon
} from '@/components/icons';

export function PatientProfile() {
  const { profile } = useAuth();

  return (
    <DashboardLayout role="patient" userName={profile?.name || 'Patient'}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="h-40 bg-indigo-500/10 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                <div className="w-full h-full rounded-xl bg-indigo-50 flex items-center justify-center">
                  <UserIcon className="w-12 h-12 text-indigo-500" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-16 pb-8 px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">{profile?.name || 'Patient Name'}</h2>
              <div className="flex items-center gap-2 text-indigo-600 mt-1">
                <ShieldCheckIcon className="w-4 h-4" />
                <span className="text-sm font-bold uppercase tracking-widest">Verified Recipient</span>
              </div>
            </div>
            <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
              Edit Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-indigo-500" />
              Personal Information
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</p>
                <p className="text-sm font-bold text-slate-900">{profile?.name || 'Not provided'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                <p className="text-sm font-bold text-slate-900">{profile?.email || 'Not provided'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
                <p className="text-sm font-bold text-slate-900">{profile?.phone || 'Not linked'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current City</p>
                <p className="text-sm font-bold text-slate-900">{profile?.city || 'Not specified'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <HeartIcon className="w-5 h-5 text-indigo-500" />
              Health Profile
            </h3>
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Note to Donors</p>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  "Thank you for your generosity. Your donations help me manage my health effectively."
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Requests</p>
                  <p className="text-xl font-black text-slate-900">0</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Received</p>
                  <p className="text-xl font-black text-slate-900">0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
