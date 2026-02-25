import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { 
  SettingsIcon, 
  BellIcon, 
  ShieldCheckIcon, 
  ActivityIcon,
  MedicalServicesIcon
} from '@/components/icons';

export function PharmacistSettings() {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [autoQueue, setAutoQueue] = useState(false);

  return (
    <DashboardLayout role="pharmacist" userName={profile?.name || 'Pharmacist'}>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Pharmacist Settings</h2>
            <p className="text-sm text-slate-500 font-medium">Configure your verification preferences and account</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Workflow Preferences */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MedicalServicesIcon className="w-5 h-5 text-amber-500" />
              Workflow Preferences
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="text-sm font-bold text-slate-900">Auto-Refresh Queue</p>
                  <p className="text-xs text-slate-500">Automatically update the verification queue every 5 minutes</p>
                </div>
                <button 
                  onClick={() => setAutoQueue(!autoQueue)}
                  className={`w-14 h-8 rounded-full transition-all relative ${autoQueue ? 'bg-amber-500' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${autoQueue ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BellIcon className="w-5 h-5 text-amber-500" />
              Notifications
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="text-sm font-bold text-slate-900">New Donation Alerts</p>
                  <p className="text-xs text-slate-500">Get notified when new medicines are added to the queue</p>
                </div>
                <button 
                  onClick={() => setNotifications(!notifications)}
                  className={`w-14 h-8 rounded-full transition-all relative ${notifications ? 'bg-amber-500' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${notifications ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5 text-amber-500" />
              Security & Privacy
            </h3>
            
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all text-left">
                <div>
                  <p className="text-sm font-bold text-slate-900">Update License Info</p>
                  <p className="text-xs text-slate-500">Submit new documentation for verification</p>
                </div>
                <span className="text-slate-400 font-bold">Update</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
