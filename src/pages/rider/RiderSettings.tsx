import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'motion/react';
import { 
  SettingsIcon, 
  BellIcon, 
  ShieldCheckIcon, 
  ActivityIcon,
  TruckIcon
} from '@/components/icons';

export function RiderSettings() {
  const { profile } = useAuth();
  const [isOnline, setIsOnline] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <DashboardLayout role="rider" userName={profile?.name || 'Rider'}>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Settings</h2>
            <p className="text-sm text-slate-500 font-medium">Manage your rider preferences and account</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Availability Section */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                  <ActivityIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Duty Status</h3>
                  <p className="text-xs text-slate-500">Toggle your availability for new tasks</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOnline(!isOnline)}
                className={`w-14 h-8 rounded-full transition-all relative ${isOnline ? 'bg-success' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${isOnline ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <BellIcon className="w-5 h-5 text-primary" />
              Notifications
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="text-sm font-bold text-slate-900">Push Notifications</p>
                  <p className="text-xs text-slate-500">Get alerts for new delivery requests</p>
                </div>
                <button 
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-all relative ${notifications ? 'bg-primary' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <ShieldCheckIcon className="w-5 h-5 text-primary" />
              Security
            </h3>
            
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all text-left">
                <div>
                  <p className="text-sm font-bold text-slate-900">Change Password</p>
                  <p className="text-xs text-slate-500">Update your account security</p>
                </div>
                <span className="text-slate-400">→</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all text-left">
                <div>
                  <p className="text-sm font-bold text-slate-900">Two-Factor Authentication</p>
                  <p className="text-xs text-slate-500">Add an extra layer of security</p>
                </div>
                <span className="text-slate-400">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
