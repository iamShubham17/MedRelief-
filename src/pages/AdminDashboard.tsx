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
  const { user, profile } = useAuth();
  const [pendingPharmacists, setPendingPharmacists] = useState<any[]>([]);
  const [pendingNGOs, setPendingNGOs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<'approvals' | 'users' | 'analytics'>('approvals');

  const [searchQuery, setSearchQuery] = useState('');

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
      setPendingPharmacists(pharmacists || []);
      setPendingNGOs(ngos || []);
      setStats(statsData);
      setAllUsers(users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = allUsers.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.orgName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = async (uid: string) => {
    if (!user) return;
    try {
      await dbService.approveUser(uid, user.uid);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to approve user');
    }
  };

  const chartData = [
    { name: 'Users', value: stats?.userCount || 0, color: '#79ee43' },
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
    <DashboardLayout 
      role="admin" 
      userName={profile?.name || 'System Admin'}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      actions={
        <div className="flex items-center gap-4">
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
            <button 
              onClick={() => setActiveTab('approvals')}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'approvals' ? 'bg-[#4f46e5] text-white' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Approvals
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-[#4f46e5] text-white' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Users
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'analytics' ? 'bg-[#4f46e5] text-white' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Analytics
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'Total Users', value: stats?.userCount || 0, icon: UsersIcon, color: 'text-indigo-600' },
            { label: 'Total Donations', value: stats?.donationCount || 0, icon: BoxIcon, color: 'text-emerald-600' },
            { label: 'Total Requests', value: stats?.requestCount || 0, icon: ClipboardListIcon, color: 'text-orange-600' },
            { label: 'Pending Approvals', value: stats?.pendingApprovals || 0, icon: ShieldCheckIcon, color: 'text-rose-600', highlight: true },
          ].map((stat, i) => (
            <div key={i} className={`bg-white p-6 rounded-[24px] shadow-sm border border-slate-50 flex flex-col justify-between min-h-[140px] group hover:shadow-xl hover:shadow-indigo-50 transition-all ${stat.highlight ? 'border-l-4 border-l-rose-500' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-slate-900">{stat.label}</p>
                <div className={`p-2 bg-slate-50 rounded-lg ${stat.color} group-hover:bg-indigo-50 transition-colors`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
            </div>
          ))}
        </div>

        {activeTab === 'approvals' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">Pharmacist Approvals</h3>
                <span className="px-3 py-1 bg-indigo-50 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600">{pendingPharmacists.length} Pending</span>
              </div>
              <div className="bg-white rounded-[32px] shadow-sm border border-slate-50 overflow-hidden">
                {pendingPharmacists.map((p) => (
                  <div key={p.id} className="p-8 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="text-sm font-black text-slate-900">{p.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">License: {p.licenseNumber}</p>
                      <div className="mt-4">
                        <a href={p.licenseUrl || '#'} target="_blank" rel="noreferrer" className="text-[10px] text-indigo-600 font-black uppercase tracking-widest hover:underline px-4 py-2 bg-indigo-50 rounded-xl inline-block">View Credentials</a>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleApprove(p.id)}
                      className="bg-[#1a1d1f] text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-100"
                    >
                      Approve
                    </button>
                  </div>
                ))}
                {pendingPharmacists.length === 0 && (
                  <div className="py-24 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShieldCheckIcon className="w-6 h-6 text-slate-200" />
                    </div>
                    <p className="text-sm font-bold text-slate-900">No pending pharmacists</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">NGO Approvals</h3>
                <span className="px-3 py-1 bg-indigo-50 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600">{pendingNGOs.length} Pending</span>
              </div>
              <div className="bg-white rounded-[32px] shadow-sm border border-slate-50 overflow-hidden">
                {pendingNGOs.map((n) => (
                  <div key={n.id} className="p-8 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="text-sm font-black text-slate-900">{n.orgName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Reg: {n.regNumber}</p>
                      <div className="mt-4">
                        <a href={n.certUrl || '#'} target="_blank" rel="noreferrer" className="text-[10px] text-indigo-600 font-black uppercase tracking-widest hover:underline px-4 py-2 bg-indigo-50 rounded-xl inline-block">View Certificate</a>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleApprove(n.id)}
                      className="bg-[#1a1d1f] text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-100"
                    >
                      Approve
                    </button>
                  </div>
                ))}
                {pendingNGOs.length === 0 && (
                  <div className="py-24 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShieldCheckIcon className="w-6 h-6 text-slate-200" />
                    </div>
                    <p className="text-sm font-bold text-slate-900">No pending NGOs</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.firebaseUID} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                      <td className="p-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs border border-slate-50 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                            {u.name?.charAt(0) || u.orgName?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900">{u.name || u.orgName || 'Unnamed User'}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-8">
                        <span className="px-4 py-1.5 bg-slate-50 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600 border border-slate-100">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-8">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          u.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 
                          u.status === 'pending' ? 'bg-amber-50 text-amber-600' : 
                          'bg-rose-50 text-rose-600'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="p-8 text-xs font-black text-slate-400 uppercase tracking-widest">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="py-24 text-center">
                  <p className="text-sm font-bold text-slate-900">No users found matching your search</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-10 rounded-[40px] shadow-sm border border-slate-50">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-black text-slate-900">Network Distribution</h3>
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <BarChart3Icon className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                      dy={15}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold', padding: '16px' }}
                    />
                    <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={50}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#1a1d1f] p-10 rounded-[40px] text-white flex flex-col justify-between shadow-2xl shadow-indigo-100">
              <div>
                <div className="w-16 h-16 bg-white/10 rounded-[24px] flex items-center justify-center mb-8 border border-white/5">
                  <ActivityIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-black mb-4 tracking-tight">System Health</h3>
                <p className="text-white/50 text-sm font-bold leading-relaxed">
                  All systems operational. Institutional grade security active across all nodes.
                </p>
              </div>
              
              <div className="space-y-6 pt-10 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Database</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">Connected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Auth Service</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Network Latency</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white font-black">12ms</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
