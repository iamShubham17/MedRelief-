import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import splashAnimation from '@/assets/animations/Businessman flies up with rocket.json';
import { useAuth } from '@/context/AuthContext';
import { 
  TruckIcon, 
  MapPinIcon, 
  StarIcon, 
  ClockIcon,
  ActivityIcon
} from '@/components/icons';

export function RiderDashboard() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: 'Deliveries Done', value: '156', icon: TruckIcon, color: 'text-indigo-600' },
    { label: 'Active Tasks', value: '2', icon: ActivityIcon, color: 'text-blue-500' },
    { label: 'Rider Rating', value: '4.9', icon: StarIcon, color: 'text-amber-500' },
  ];

  const activeDeliveries = [
    { id: '1', type: 'Pickup', location: 'City Hospital, Block B', time: 'Within 20 mins', status: 'In Progress' },
    { id: '2', type: 'Delivery', location: 'Red Cross Center', time: 'By 4:00 PM', status: 'Scheduled' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-150 h-80">
          <Lottie animationData={splashAnimation} loop={true} />
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <h2 className="text-3xl font-black text-slate-900 mb-2">Loading Dashboard</h2>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">Preparing your route...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <DashboardLayout 
      role="rider" 
      userName={profile?.name || 'Rider'}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      actions={
        <button className="bg-[#4f46e5] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2">
          <MapPinIcon className="w-4 h-4" />
          Go Online
        </button>
      }
    >
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-50 flex flex-col justify-between min-h-[140px] group hover:shadow-xl hover:shadow-indigo-50 transition-all">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Tasks */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-black text-slate-900">Active Tasks</h3>
            <div className="space-y-4">
              {activeDeliveries.map((task) => (
                <div key={task.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-50 flex items-center justify-between group hover:bg-slate-50 transition-all">
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${task.type === 'Pickup' ? 'bg-blue-50 text-blue-500' : 'bg-emerald-50 text-emerald-600'} border border-slate-50`}>
                      <MapPinIcon className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${task.type === 'Pickup' ? 'bg-blue-50 text-blue-500' : 'bg-emerald-50 text-emerald-600'}`}>
                          {task.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{task.time}</span>
                      </div>
                      <p className="text-lg font-black text-slate-900 mt-2">{task.location}</p>
                    </div>
                  </div>
                  <button className="bg-[#1a1d1f] text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-100">
                    Start Task
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Map Preview Placeholder */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900">Nearby Opportunities</h3>
            <div className="bg-white p-2 rounded-[40px] shadow-sm border border-slate-50">
              <div className="bg-slate-100 rounded-[32px] aspect-square relative overflow-hidden flex items-center justify-center border border-slate-100">
                <img 
                  src="https://picsum.photos/seed/map/400/400" 
                  alt="Map" 
                  className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale"
                  referrerPolicy="no-referrer"
                />
                <div className="relative z-10 text-center p-8 bg-white/80 backdrop-blur-md rounded-[32px] border border-white/20 shadow-xl m-6">
                  <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <MapPinIcon className="w-8 h-8 text-indigo-600" />
                  </div>
                  <p className="text-sm font-black text-slate-900">3 New Pickup Requests</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Within 2km of your location</p>
                  <button className="mt-6 bg-[#4f46e5] text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all w-full">
                    View Map
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
