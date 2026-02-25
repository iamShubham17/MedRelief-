import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { 
  SettingsIcon, 
  BellIcon, 
  ShieldCheckIcon, 
  Globe,
  LogOutIcon
} from '@/components/icons';

export function NGOSettings() {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [urgentAlerts, setUrgentAlerts] = useState(true);

  return (
    <DashboardLayout role="ngo" userName={profile?.orgName || 'NGO Partner'}>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">NGO Settings</h2>
            <p className="text-sm text-slate-500 font-medium">Manage your organization preferences and alerts</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Notification Preferences */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BellIcon className="w-5 h-5 text-primary" />
              Notification Preferences
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="text-sm font-bold text-slate-900">New Stock Alerts</p>
                  <p className="text-xs text-slate-500">Get notified when verified medicines matching your needs are available</p>
                </div>
                <button 
                  onClick={() => setNotifications(!notifications)}
                  className={`w-14 h-8 rounded-full transition-all relative ${notifications ? 'bg-primary' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${notifications ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="text-sm font-bold text-slate-900">Urgent Relief Requests</p>
                  <p className="text-xs text-slate-500">High-priority alerts for life-saving medicines</p>
                </div>
                <button 
                  onClick={() => setUrgentAlerts(!urgentAlerts)}
                  className={`w-14 h-8 rounded-full transition-all relative ${urgentAlerts ? 'bg-primary' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${urgentAlerts ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Security & Verification */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5 text-primary" />
              Security & Verification
            </h3>
            
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all text-left">
                <div>
                  <p className="text-sm font-bold text-slate-900">Update Registration Docs</p>
                  <p className="text-xs text-slate-500">Submit new NGO certificates or tax documents</p>
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
