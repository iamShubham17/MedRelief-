import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { dbService } from '@/services/dbService';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import splashAnimation from '@/assets/animations/preventive-health-care.json';
import { 
  SearchIcon,
  PackageIcon, 
  HeartIcon, 
  ClockIcon,
  TruckIcon,
  ShieldCheckIcon,
  ActivityIcon,
  BellIcon,
  LogOutIcon,
  DashboardIcon,
  HistoryIcon,
  UserIcon,
  SettingsIcon,
  PlusCircleIcon,
  Calendar as CalendarIcon,
  AlertCircleIcon,
  ArrowLeftIcon
} from '@/components/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { auth } from '@/config/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export function PatientDashboard() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [availableMedicines, setAvailableMedicines] = useState<any[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<'available' | 'requests' | 'profile' | 'settings'>('available');
  const [requesting, setRequesting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showAllMedicines, setShowAllMedicines] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    city: ''
  });

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [customRequest, setCustomRequest] = useState({
    medicineName: '',
    quantity: '',
    reason: ''
  });

  useEffect(() => {
    if (profile) {
      setEditForm({
        name: profile.name || '',
        phone: profile.phone || '',
        city: profile.city || ''
      });
    }
  }, [profile]);

  useEffect(() => {
    loadData();
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const loadData = async () => {
    try {
      const [available, requests] = await Promise.all([
        dbService.getAvailableMedicines(),
        user ? dbService.getUserRequests(user.uid) : Promise.resolve([])
      ]);
      setAvailableMedicines(available || []);
      setMyRequests(requests || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (medicineId: string) => {
    if (!user) {
      alert('Please log in to request medicine');
      return;
    }
    setRequesting(medicineId);
    try {
      await dbService.requestMedicine(user.uid, medicineId);
      alert('Medicine request submitted successfully! We will notify you once approved.');
      await loadData();
    } catch (err) {
      console.error('Request error:', err);
      alert('Failed to submit request. Please try again.');
    } finally {
      setRequesting(null);
    }
  };

  const handleCustomRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to request medicine');
      return;
    }
    
    try {
      await dbService.createCustomRequest(user.uid, {
        customMedicineName: customRequest.medicineName,
        quantity: customRequest.quantity,
        reason: customRequest.reason
      });
      alert('Custom medicine request submitted! Our team will look for this medicine for you.');
      setIsRequestModalOpen(false);
      setCustomRequest({ medicineName: '', quantity: '', reason: '' });
      await loadData();
    } catch (err) {
      console.error('Custom request error:', err);
      alert('Failed to submit request. Please try again.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await dbService.updateUserProfile(user.uid, editForm);
      alert('Profile updated successfully!');
      setIsEditingProfile(false);
      await refreshProfile();
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    }
  };

  const filteredMedicines = availableMedicines.filter(med => 
    med.medicineName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const chartData = [
    { name: 'Mon', value: 40 },
    { name: 'Tue', value: 30 },
    { name: 'Wed', value: 65 },
    { name: 'Thu', value: 45 },
    { name: 'Fri', value: 90 },
    { name: 'Sat', value: 35 },
    { name: 'Sun', value: 50 },
  ];

  const visitData = [
    { name: 'Completed', value: 85 },
    { name: 'Remaining', value: 15 },
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
          <h2 className="text-3xl font-black text-slate-900 mb-2">Patient Portal</h2>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">Finding the care you need...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex font-sans text-[#1a1d1f]">
      {/* Sidebar - Icons + Labels */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col py-8 sticky top-0 h-screen z-50">
        <div className="px-8 mb-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
            <PlusCircleIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">MedRelief+</span>
        </div>

        <nav className="flex-grow px-4 space-y-1">
          {[
            { id: 'available', label: 'Dashboard', icon: DashboardIcon },
            { id: 'requests', label: 'History', icon: HistoryIcon },
            { id: 'profile', label: 'Account', icon: UserIcon },
            { id: 'settings', label: 'Settings', icon: SettingsIcon },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all group ${
                activeTab === item.id
                  ? 'bg-[#4f46e5] text-white shadow-lg shadow-indigo-100'
                  : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-colors ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'}`} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-4 mt-auto space-y-1">
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all group">
            <AlertCircleIcon className="w-5 h-5 group-hover:text-slate-900" />
            Help
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all group"
          >
            <LogOutIcon className="w-5 h-5 group-hover:text-red-500" />
            Log out
          </button>
          
          <div className="pt-6 px-4 flex items-center gap-4">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-full">
              <button className="p-2 rounded-full bg-white shadow-sm text-slate-900">
                <ActivityIcon className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-full text-slate-400">
                <ClockIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col p-8 max-w-[1600px] mx-auto w-full overflow-y-auto custom-scrollbar">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Welcome back, {profile?.name?.split(' ')[0] || 'User'}!</h1>
            <p className="text-slate-400 font-bold text-xs mt-1">It is the best time to manage your medical needs</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#4f46e5] transition-colors" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (activeTab !== 'available') setActiveTab('available');
                  }}
                  placeholder="Search medicines..."
                  className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-100 transition-all w-64"
                />
              </div>
              <button className="p-2.5 text-slate-400 hover:text-slate-900 transition-all relative">
                <BellIcon className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
            
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-black text-slate-900">{profile?.name || 'User'}</p>
                <p className="text-[10px] text-slate-400 font-bold">{profile?.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden">
                <img src={`https://picsum.photos/seed/${profile?.name}/100/100`} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100">
              <CalendarIcon className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-900">This month</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 hover:bg-slate-50 transition-all">
              Manage widgets
            </button>
            <button 
              onClick={() => {
                setActiveTab('available');
                setIsRequestModalOpen(true);
              }}
              className="px-6 py-2.5 bg-[#4f46e5] text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              <PlusCircleIcon className="w-4 h-4" />
              Request New Medicine
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-8">
          {activeTab === 'available' && (
            <div className="space-y-8">
              {/* Top Stats Grid */}
              <div className="grid grid-cols-4 gap-6">
                {[
                  { label: 'Total requests', value: myRequests.length, trend: '↑ 12.1%', color: 'text-emerald-500' },
                  { label: 'Available relief', value: availableMedicines.length, trend: '↑ 6.3%', color: 'text-emerald-500' },
                  { label: 'Pending items', value: myRequests.filter(r => r.status === 'pending').length, trend: '↓ 2.4%', color: 'text-rose-500' },
                  { label: 'Approved items', value: myRequests.filter(r => r.status === 'approved').length, trend: '↑ 12.1%', color: 'text-emerald-500' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-50 flex flex-col justify-between min-h-[160px] group hover:shadow-xl hover:shadow-indigo-50 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-bold text-slate-900">{stat.label}</p>
                      <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-indigo-600 transition-colors">
                        <ArrowLeftIcon className="w-3 h-3 rotate-[225deg]" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 mb-2">{stat.value}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black ${stat.color} px-2 py-0.5 bg-slate-50 rounded-full`}>{stat.trend}</span>
                        <span className="text-[10px] font-bold text-slate-300">vs last month</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Middle Section: Chart and Side Widget */}
              <div className="grid grid-cols-12 gap-8">
                {/* Chart Section */}
                <div className="col-span-8 bg-white p-8 rounded-[32px] shadow-sm border border-slate-50">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Medical flow</h3>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#4f46e5]" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Requests</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#c7d2fe]" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Approved</span>
                        </div>
                      </div>
                      <select className="bg-slate-50 border-none rounded-xl text-[10px] font-black uppercase tracking-widest px-4 py-2 focus:ring-0 cursor-pointer">
                        <option>All accounts</option>
                      </select>
                      <select className="bg-slate-50 border-none rounded-xl text-[10px] font-black uppercase tracking-widest px-4 py-2 focus:ring-0 cursor-pointer">
                        <option>This year</option>
                      </select>
                    </div>
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
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
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }} 
                        />
                        <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={32}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#c7d2fe'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Side Widget: Health Goals */}
                <div className="col-span-4 bg-white p-8 rounded-[32px] shadow-sm border border-slate-50 flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black text-slate-900">Health Status</h3>
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                      <ArrowLeftIcon className="w-3 h-3 rotate-[225deg]" />
                    </div>
                  </div>
                  <div className="flex-grow flex flex-col items-center justify-center py-4">
                    <div className="relative w-44 h-44 mb-8">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={visitData}
                            innerRadius={65}
                            outerRadius={85}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                          >
                            <Cell fill="#4f46e5" />
                            <Cell fill="#f1f5f9" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Total</p>
                        <p className="text-3xl font-black text-slate-900">85%</p>
                      </div>
                    </div>
                    <div className="w-full space-y-4">
                      {[
                        { label: 'Medication', value: '80%', color: 'bg-indigo-500' },
                        { label: 'Checkups', value: '95%', color: 'bg-blue-500' },
                        { label: 'Vitamins', value: '70%', color: 'bg-rose-500' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${item.color}`} />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                          </div>
                          <span className="text-xs font-black text-slate-900">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Table and Side Progress */}
              <div className="grid grid-cols-12 gap-8">
                {/* Available Medicines Table */}
                <div className="col-span-8 bg-white p-8 rounded-[32px] shadow-sm border border-slate-50">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black text-slate-900">Recent medicine requests</h3>
                    <div className="flex items-center gap-4">
                      <select className="bg-slate-50 border-none rounded-xl text-[10px] font-black uppercase tracking-widest px-4 py-2 focus:ring-0 cursor-pointer">
                        <option>All accounts</option>
                      </select>
                      <button 
                        onClick={() => setShowAllMedicines(!showAllMedicines)}
                        className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900"
                      >
                        See all <ArrowLeftIcon className="w-3 h-3 rotate-180 inline ml-1" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-6 relative">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search medicines to request..." 
                      className="w-full pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  </div>

                  <div className="overflow-x-auto">
                    {filteredMedicines.length > 0 ? (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-slate-300 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">
                            <th className="pb-4">Medicine Name</th>
                            <th className="pb-4">Quantity</th>
                            <th className="pb-4">Donor</th>
                            <th className="pb-4">Expiry</th>
                            <th className="pb-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {filteredMedicines.map((med) => (
                            <tr key={med.id} className="group hover:bg-slate-50/50 transition-all">
                              <td className="py-5">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-50">
                                    <img src={med.imageUrl || 'https://picsum.photos/seed/med/100/100'} alt="" className="w-full h-full object-cover" />
                                  </div>
                                  <span className="text-xs font-black text-slate-900">{med.medicineName}</span>
                                </div>
                              </td>
                              <td className="py-5 text-xs font-bold text-slate-400">{med.quantity} Units</td>
                              <td className="py-5 text-xs font-bold text-slate-400">{med.donorName || 'Verified Donor'}</td>
                              <td className="py-5 text-xs font-bold text-slate-400">{med.expiryDate}</td>
                              <td className="py-5 text-right">
                                <button 
                                  onClick={() => handleRequest(med.id)}
                                  disabled={requesting === med.id}
                                  className="px-5 py-2 bg-[#4f46e5] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-50 disabled:opacity-50"
                                >
                                  {requesting === med.id ? 'Processing...' : 'Request'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="py-20 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <SearchIcon className="w-6 h-6 text-slate-300" />
                        </div>
                        <p className="text-sm font-bold text-slate-900">No medicines found</p>
                        <p className="text-xs text-slate-400 mt-1">Try searching for something else or request a new medicine</p>
                        <button 
                          onClick={() => setIsRequestModalOpen(true)}
                          className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
                        >
                          Request Custom Medicine
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Side Widget: Saving Goals */}
                <div className="col-span-4 bg-white p-8 rounded-[32px] shadow-sm border border-slate-50 flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black text-slate-900">Health Goals</h3>
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                      <ArrowLeftIcon className="w-3 h-3 rotate-[225deg]" />
                    </div>
                  </div>
                  <div className="space-y-8">
                    {[
                      { label: 'Daily Vitamins', current: '25%', target: '100%', progress: 25, color: 'bg-indigo-500' },
                      { label: 'Water Intake', current: '42%', target: '100%', progress: 42, color: 'bg-blue-500' },
                      { label: 'Exercise', current: '3%', target: '100%', progress: 3, color: 'bg-rose-500' },
                    ].map((goal, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex justify-between items-end">
                          <span className="text-xs font-black text-slate-900">{goal.label}</span>
                          <span className="text-xs font-black text-slate-400">{goal.current}</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${goal.progress}%` }}
                            transition={{ duration: 1, delay: i * 0.2 }}
                            className={`h-full ${goal.color} rounded-full shadow-sm`} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-50 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Medical History</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Track your medical supply history</p>
                </div>
                <button className="px-8 py-3 bg-[#4f46e5] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">Export Report</button>
              </div>
              <div className="overflow-hidden rounded-[24px] border border-slate-50">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-400">
                      <th className="p-8 text-[10px] font-black uppercase tracking-widest">Medicine</th>
                      <th className="p-8 text-[10px] font-black uppercase tracking-widest">Status</th>
                      <th className="p-8 text-[10px] font-black uppercase tracking-widest">Date</th>
                      <th className="p-8 text-[10px] font-black uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {myRequests.map((req) => (
                      <tr key={req.id} className="group hover:bg-slate-50/50 transition-all">
                        <td className="p-8">
                          <p className="font-black text-slate-900">{req.medicineId?.medicineName || req.customMedicineName}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Qty: {req.medicineId?.quantity || req.quantity}</p>
                        </td>
                        <td className="p-8">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            req.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 
                            req.status === 'pending' ? 'bg-amber-50 text-amber-600' : 
                            'bg-rose-50 text-rose-600'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="p-8 text-xs font-bold text-slate-400">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-8 text-right">
                          <button className="p-3 bg-slate-50 text-slate-300 hover:text-[#4f46e5] rounded-xl transition-all">
                            <SettingsIcon className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-4xl mx-auto space-y-10">
              <div className="bg-white p-12 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-12">
                <div className="w-40 h-40 rounded-[32px] bg-slate-100 overflow-hidden border-4 border-white shadow-xl">
                  <img src={`https://picsum.photos/seed/${profile?.name}/300/300`} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <h2 className="text-4xl font-black text-slate-900 mb-2">{profile?.name}</h2>
                  <p className="text-slate-400 font-bold text-sm mb-6">{profile?.email}</p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setIsEditingProfile(true)}
                      className="px-8 py-3 bg-[#4f46e5] text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                    >
                      Edit Profile
                    </button>
                    <button className="px-8 py-3 bg-slate-50 text-slate-900 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all">Change Password</button>
                  </div>
                </div>
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleUpdateProfile} className="bg-white p-12 rounded-[32px] shadow-sm border border-slate-50 space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                      <input 
                        type="text" 
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-200"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Phone Number</label>
                      <input 
                        type="tel" 
                        value={editForm.phone}
                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                        className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-200"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">City</label>
                      <input 
                        type="text" 
                        value={editForm.city}
                        onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                        className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-200"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-grow py-5 bg-slate-50 text-slate-400 rounded-2xl font-bold hover:bg-slate-100 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-grow py-5 bg-[#4f46e5] text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-white p-12 rounded-[32px] shadow-sm border border-slate-50 grid grid-cols-2 gap-12">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Phone Number</p>
                    <p className="text-xl font-bold text-slate-900">{profile?.phone || 'Not provided'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">City</p>
                    <p className="text-xl font-bold text-slate-900">{profile?.city || 'Not provided'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Account Type</p>
                    <p className="text-xl font-bold text-slate-900 capitalize">{profile?.role}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Member Since</p>
                    <p className="text-xl font-bold text-slate-900">{new Date(profile?.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-3xl mx-auto space-y-10">
              <div className="grid grid-cols-2 gap-8">
                {[
                  { label: 'Notifications', desc: 'Manage your alerts', icon: BellIcon, color: 'bg-indigo-50 text-indigo-500' },
                  { label: 'Privacy', desc: 'Control your data', icon: ShieldCheckIcon, color: 'bg-emerald-50 text-emerald-500' },
                  { label: 'Security', desc: 'Password and 2FA', icon: AlertCircleIcon, color: 'bg-rose-50 text-rose-500' },
                  { label: 'Integrations', desc: 'Connect other apps', icon: PlusCircleIcon, color: 'bg-amber-50 text-amber-500' },
                ].map((item) => (
                  <button key={item.label} className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-50 flex flex-col items-start gap-8 hover:shadow-xl hover:shadow-slate-200/50 transition-all text-left group">
                    <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-xl font-black mb-1">{item.label}</p>
                      <p className="text-xs text-slate-400 font-bold leading-relaxed">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      {/* Custom Request Modal */}
      <AnimatePresence>
        {isRequestModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRequestModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Request New Medicine</h2>
                    <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">Tell us what you need</p>
                  </div>
                  <button 
                    onClick={() => setIsRequestModalOpen(false)}
                    className="p-2 hover:bg-slate-50 rounded-xl transition-all"
                  >
                    <PlusCircleIcon className="w-6 h-6 text-slate-400 rotate-45" />
                  </button>
                </div>

                <form onSubmit={handleCustomRequest} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Medicine Name</label>
                    <input 
                      type="text" 
                      required
                      value={customRequest.medicineName}
                      onChange={(e) => setCustomRequest({...customRequest, medicineName: e.target.value})}
                      placeholder="e.g. Paracetamol 500mg"
                      className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Quantity Needed</label>
                    <input 
                      type="text" 
                      required
                      value={customRequest.quantity}
                      onChange={(e) => setCustomRequest({...customRequest, quantity: e.target.value})}
                      placeholder="e.g. 2 strips"
                      className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Reason for Request</label>
                    <textarea 
                      required
                      value={customRequest.reason}
                      onChange={(e) => setCustomRequest({...customRequest, reason: e.target.value})}
                      placeholder="Briefly explain why you need this medicine..."
                      className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-100 h-32 resize-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-5 bg-[#4f46e5] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                  >
                    Submit Request
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
    </div>
  );
}
