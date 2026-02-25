import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'motion/react';
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

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: 'Deliveries Done', value: '156', icon: TruckIcon, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Active Tasks', value: '2', icon: ActivityIcon, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Rider Rating', value: '4.9', icon: StarIcon, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  const activeDeliveries = [
    { id: '1', type: 'Pickup', location: 'City Hospital, Block B', time: 'Within 20 mins', status: 'In Progress' },
    { id: '2', type: 'Delivery', location: 'Red Cross Center', time: 'By 4:00 PM', status: 'Scheduled' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-180 h-100">
          <Lottie animationData={splashAnimation} loop={true} />
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-4"
        >
          <h2 className="text-3xl font-black text-slate-900 mb-2">Loading Dashboard</h2>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">Preparing your route...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <DashboardLayout role="rider" userName={profile?.name || 'Rider'}>
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Tasks */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Active Tasks</h3>
            <div className="space-y-4">
              {activeDeliveries.map((task) => (
                <div key={task.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${task.type === 'Pickup' ? 'bg-blue-50 text-blue-500' : 'bg-success/10 text-success'}`}>
                      <MapPinIcon className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${task.type === 'Pickup' ? 'bg-blue-50 text-blue-500' : 'bg-success/10 text-success'}`}>
                          {task.type}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{task.time}</span>
                      </div>
                      <p className="text-lg font-bold text-slate-900 mt-1">{task.location}</p>
                    </div>
                  </div>
                  <button className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all">
                    Start Task
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Map Preview Placeholder */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Nearby Opportunities</h3>
            <div className="bg-slate-100 rounded-2xl aspect-square relative overflow-hidden flex items-center justify-center border border-slate-200">
              <img 
                src="https://picsum.photos/seed/map/400/400" 
                alt="Map" 
                className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale"
                referrerPolicy="no-referrer"
              />
              <div className="relative z-10 text-center p-6">
                <MapPinIcon className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className="text-sm font-bold text-slate-900">3 New Pickup Requests</p>
                <p className="text-xs text-slate-500 mt-1">Within 2km of your location</p>
                <button className="mt-4 bg-white text-primary px-6 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-slate-50 transition-all">
                  View Map
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}