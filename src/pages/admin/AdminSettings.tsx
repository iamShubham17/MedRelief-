import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { 
  SettingsIcon, 
  ShieldCheckIcon, 
  BellIcon, 
  ActivityIcon,
  Globe,
  LogOutIcon
} from '@/components/icons';

export function AdminSettings() {
  const { profile } = useAuth();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoApprove, setAutoApprove] = useState(false);

  return (
    <DashboardLayout role="admin" userName={profile?.name || 'System Admin'}>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">System Settings</h2>
            <p className="text-sm text-slate-500 font-medium">Global platform configuration and security</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Platform Controls */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Platform Controls
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="text-sm font-bold text-slate-900">Maintenance Mode</p>
                  <p className="text-xs text-slate-500">Disable platform access for all users</p>
                </div>
                <button 
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`w-14 h-8 rounded-full transition-all relative ${maintenanceMode ? 'bg-red-500' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${maintenanceMode ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="text-sm font-bold text-slate-900">Auto-Approve Donors</p>
                  <p className="text-xs text-slate-500">Automatically verify new donor accounts</p>
                </div>
                <button 
                  onClick={() => setAutoApprove(!autoApprove)}
                  className={`w-14 h-8 rounded-full transition-all relative ${autoApprove ? 'bg-success' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${autoApprove ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Security Policy */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5 text-primary" />
              Security Policy
            </h3>
            
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all text-left">
                <div>
                  <p className="text-sm font-bold text-slate-900">Audit Log Retention</p>
                  <p className="text-xs text-slate-500">Currently set to 90 days</p>
                </div>
                <span className="text-slate-400 font-bold">Edit</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all text-left">
                <div>
                  <p className="text-sm font-bold text-slate-900">API Access Keys</p>
                  <p className="text-xs text-slate-500">Manage external integration secrets</p>
                </div>
                <span className="text-slate-400 font-bold">Manage</span>
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 p-8 rounded-3xl border border-red-100 space-y-6">
            <h3 className="text-lg font-bold text-red-600 flex items-center gap-2">
              <ActivityIcon className="w-5 h-5" />
              Danger Zone
            </h3>
            <div className="flex flex-col gap-4">
              <button className="w-full py-4 bg-white border border-red-200 text-red-600 rounded-2xl font-bold text-sm hover:bg-red-100 transition-all">
                Clear System Cache
              </button>
              <button className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-200">
                Reset Platform Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
