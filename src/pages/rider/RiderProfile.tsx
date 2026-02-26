import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  MapPinIcon, 
  TruckIcon, 
  PhoneIcon,
  MailIcon,
  ShieldCheckIcon
} from '@/components/icons';

export function RiderProfile() {
  const { profile } = useAuth();

  return (
    <DashboardLayout role="rider" userName={profile?.name || 'Rider'}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="h-32 bg-primary/10 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                <div className="w-full h-full rounded-xl bg-primary/5 border-2 border-primary/20 overflow-hidden">
                  <img 
                    src={`https://picsum.photos/seed/${profile?.name}/200/200`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-16 pb-8 px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">{profile?.name || 'Rider Name'}</h2>
              <div className="flex items-center gap-2 text-slate-500 mt-1">
                <TruckIcon className="w-4 h-4" />
                <span className="text-sm font-bold uppercase tracking-widest">Certified Delivery Partner</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-primary" />
              Personal Information
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <PhoneIcon className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</p>
                  <p className="text-sm font-bold text-slate-900">{profile?.phone || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <MapPinIcon className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</p>
                  <p className="text-sm font-bold text-slate-900">{profile?.city || 'City not set'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TruckIcon className="w-5 h-5 text-primary" />
              Vehicle Details
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 font-black text-xs">
                  ID
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vehicle Number</p>
                  <p className="text-sm font-bold text-slate-900">{profile?.vehicleNumber || 'Pending'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-success/5 border border-success/10">
                <ShieldCheckIcon className="w-5 h-5 text-success" />
                <div>
                  <p className="text-[10px] font-bold text-success uppercase tracking-widest">Verification Status</p>
                  <p className="text-sm font-bold text-slate-900">Verified Partner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
