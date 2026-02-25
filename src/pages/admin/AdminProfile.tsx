import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { 
  ShieldCheckIcon, 
  MailIcon, 
  PhoneIcon, 
  MapPinIcon,
  UserIcon,
  ActivityIcon
} from '@/components/icons';

export function AdminProfile() {
  const { profile } = useAuth();

  return (
    <DashboardLayout role="admin" userName={profile?.name || 'System Admin'}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="h-40 bg-slate-900 relative">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center">
                  <ShieldCheckIcon className="w-12 h-12 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-16 pb-8 px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">{profile?.name || 'Admin User'}</h2>
              <div className="flex items-center gap-2 text-primary mt-1">
                <ShieldCheckIcon className="w-4 h-4" />
                <span className="text-sm font-bold uppercase tracking-widest">Super Administrator</span>
              </div>
            </div>
            <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
              Update Credentials
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-primary" />
                Admin Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</p>
                  <p className="text-sm font-bold text-slate-900">{profile?.name || 'System Admin'}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Admin ID</p>
                  <p className="text-sm font-mono font-bold text-slate-900">ADM-{profile?.uid?.slice(0, 8).toUpperCase()}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone</p>
                  <p className="text-sm font-bold text-slate-900">{profile?.phone || 'Not linked'}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Access Level</p>
                  <p className="text-sm font-bold text-success">Full Access (Level 1)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ActivityIcon className="w-5 h-5 text-primary" />
                Session Info
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium">Last Login</span>
                  <span className="text-slate-900 font-bold">Today, 08:04 AM</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium">IP Address</span>
                  <span className="text-slate-900 font-mono font-bold text-xs">192.168.1.1</span>
                </div>
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-primary"></div>
                </div>
                <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest">Session Security: High</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
