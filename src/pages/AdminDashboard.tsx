import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { dbService } from '@/services/dbService';
import { DashboardLayout } from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import splashAnimation from '@/assets/animations/atom-loader.json';
import { 
  ShieldCheckIcon, 
  UserIcon, 
  ActivityIcon,
  ClockIcon,
  HeartIcon,
  BarChart3Icon,
  UsersIcon,
  PackageIcon as BoxIcon,
  ClipboardListIcon
} from '@/components/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function AdminDashboard() {
  const { profile } = useAuth();
  const [pendingPharmacists, setPendingPharmacists] = useState<any[]>([]);
  const [pendingNGOs, setPendingNGOs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<'approvals' | 'users' | 'analytics'>('approvals');

  useEffect(() => {
    loadData();
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const loadData = async () => {
    try {
      const [pharmacists, ngos, statsData, users] = await Promise.all([
        dbService.getPendingApprovals('pharmacist'),
        dbService.getPendingApprovals('ngo'),
        dbService.getAdminStats(),
        dbService.getAllUsers()
      ]);
      setPendingPharmacists(pharmacists);
      setPendingNGOs(ngos);
      setStats(statsData);
      setAllUsers(users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (uid: string) => {
    try {
      await dbService.approveUser(uid);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to approve user');
    }
  };

  const chartData = [
    { name: 'Users', value: stats?.userCount || 0, color: '#571adb' },
    { name: 'Donations', value: stats?.donationCount || 0, color: '#0E9F6E' },
    { name: 'Requests', value: stats?.requestCount || 0, color: '#F27D26' },
    { name: 'Pending', value: stats?.pendingApprovals || 0, color: '#E02424' },
  ];

  if (showSplash) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-80 h-80">
          <Lottie animationData={splashAnimation} loop={true} />
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <h2 className="text-3xl font-black text-slate-900 mb-2">Admin Console</h2>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">Securing system access...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <DashboardLayout role="admin" userName={profile?.name || 'System Admin'}>
      <div className="space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <UsersIcon className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Users</p>
            </div>
            <p className="text-3xl font-black text-slate-900">{stats?.userCount || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <BoxIcon className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Donations</p>
            </div>
            <p className="text-3xl font-black text-slate-900">{stats?.donationCount || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-50 rounded-lg">
                <ClipboardListIcon className="w-4 h-4 text-orange-600" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Requests</p>
            </div>
            <p className="text-3xl font-black text-slate-900">{stats?.requestCount || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-l-primary">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/5 rounded-lg">
                <ShieldCheckIcon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Pending Approvals</p>
            </div>
            <p className="text-3xl font-black text-slate-900">{stats?.pendingApprovals || 0}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-slate-100 pb-px">
          <button 
            onClick={() => setActiveTab('approvals')}
            className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'approvals' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Pending Approvals
            {activeTab === 'approvals' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'users' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
          >
            User Management
            {activeTab === 'users' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'analytics' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
          >
            System Analytics
            {activeTab === 'analytics' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
        </div>

        {activeTab === 'approvals' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Pharmacist Approvals</h3>
                <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500">{pendingPharmacists.length} Pending</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {pendingPharmacists.map((p) => (
                  <div key={p.id} className="p-6 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="font-bold text-slate-900">{p.name}</p>
                      <p className="text-xs text-slate-500 mb-2">License: {p.licenseNumber}</p>
                      <a href={p.licenseUrl || '#'} target="_blank" rel="noreferrer" className="text-[10px] text-primary font-bold hover:underline px-2 py-1 bg-primary/5 rounded">View Credentials</a>
                    </div>
                    <button 
                      onClick={() => handleApprove(p.id)}
                      className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
                    >
                      Approve
                    </button>
                  </div>
                ))}
                {pendingPharmacists.length === 0 && <div className="p-12 text-center text-slate-400 italic">No pending pharmacists</div>}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">NGO Approvals</h3>
                <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500">{pendingNGOs.length} Pending</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {pendingNGOs.map((n) => (
                  <div key={n.id} className="p-6 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="font-bold text-slate-900">{n.orgName}</p>
                      <p className="text-xs text-slate-500 mb-2">Reg: {n.regNumber}</p>
                      <a href={n.certUrl || '#'} target="_blank" rel="noreferrer" className="text-[10px] text-primary font-bold hover:underline px-2 py-1 bg-primary/5 rounded">View Certificate</a>
                    </div>
                    <button 
                      onClick={() => handleApprove(n.id)}
                      className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
                    >
                      Approve
                    </button>
                  </div>
                ))}
                {pendingNGOs.length === 0 && <div className="p-12 text-center text-slate-400 italic">No pending NGOs</div>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((u) => (
                    <tr key={u.firebaseUID} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs">
                            {u.name?.charAt(0) || u.orgName?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{u.name || u.orgName || 'Unnamed User'}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{u.firebaseUID.substring(0, 12)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          u.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 
                          u.status === 'pending' ? 'bg-amber-50 text-amber-600' : 
                          'bg-rose-50 text-rose-600'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="p-6 text-xs font-bold text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-slate-900">Network Distribution</h3>
                <BarChart3Icon className="w-5 h-5 text-slate-300" />
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-[32px] text-white flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <ActivityIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-2 tracking-tight">System Health</h3>
                <p className="text-white/50 text-sm font-medium leading-relaxed">
                  All systems operational. Institutional grade security active across all nodes.
                </p>
              </div>
              
              <div className="space-y-4 pt-8 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Database</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Connected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Auth Service</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Network Latency</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white">12ms</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
