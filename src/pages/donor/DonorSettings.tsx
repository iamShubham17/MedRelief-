import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { 
  SettingsIcon, 
  BellIcon, 
  ShieldCheckIcon, 
  HeartIcon,
  LogOutIcon
} from '@/components/icons';

export function DonorSettings() {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [anonymous, setAnonymous] = useState(false);

  return (
    <DashboardLayout role="donor" userName={profile?.name || 'Donor'}>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Donor Settings</h2>
            <p className="text-sm text-slate-500 font-medium">Manage your donation preferences and privacy</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Privacy Settings */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5 text-primary" />
              Privacy & Visibility
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="text-sm font-bold text-slate-900">Anonymous Donations</p>
                  <p className="text-xs text-slate-500">Hide your name from public donation lists</p>
                </div>
                <button 
                  onClick={() => setAnonymous(!anonymous)}
                  className={`w-14 h-8 rounded-full transition-all relative ${anonymous ? 'bg-primary' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${anonymous ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BellIcon className="w-5 h-5 text-primary" />
              Notifications
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="text-sm font-bold text-slate-900">Verification Updates</p>
                  <p className="text-xs text-slate-500">Get notified when your medicine is verified by a pharmacist</p>
                </div>
                <button 
                  onClick={() => setNotifications(!notifications)}
                  className={`w-14 h-8 rounded-full transition-all relative ${notifications ? 'bg-primary' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${notifications ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <LogOutIcon className="w-5 h-5 text-primary" />
              Account Security
            </h3>
            
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all text-left">
                <div>
                  <p className="text-sm font-bold text-slate-900">Change Password</p>
                  <p className="text-xs text-slate-500">Update your account security credentials</p>
                </div>
                <span className="text-slate-400 font-bold">Update</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-red-100 bg-red-50/30 hover:bg-red-50 transition-all text-left">
                <div>
                  <p className="text-sm font-bold text-red-600">Delete Account</p>
                  <p className="text-xs text-red-400">Permanently remove your data from the platform</p>
                </div>
                <span className="text-red-400 font-bold">Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
