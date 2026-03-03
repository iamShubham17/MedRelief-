import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { dbService } from '@/services/dbService';
import { DashboardLayout } from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import splashAnimation from '@/assets/animations/AR Tablet.json';
import { 
  ClipboardCheckIcon, 
  ShieldCheckIcon, 
  ClockIcon,
  SearchIcon,
  AlertCircle,
  ClipboardListIcon
} from '@/components/icons';

export function PharmacistDashboard() {
  const { user, profile } = useAuth();
  const [queue, setQueue] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<'donations' | 'requests'>('donations');
  const [selectedDonation, setSelectedDonation] = useState<any>(null);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [verifying, setVerifying] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadQueue();
    loadRequests();
    const timer = setTimeout(() => setShowSplash(false), 2000);

    // Auto-refresh logic
    const isAutoRefreshEnabled = localStorage.getItem('ph_autoQueue') === 'true';
    let interval: any;
    if (isAutoRefreshEnabled) {
      interval = setInterval(() => {
        loadQueue();
        loadRequests();
      }, 30000); // 30 seconds
    }

    return () => {
      clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, []);

  const loadQueue = async () => {
    try {
      const data = await dbService.getVerificationQueue();
      setQueue(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadRequests = async () => {
    try {
      const data = await dbService.getAllRequests();
      setRequests(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredQueue = queue.filter(item => 
    item.medicineName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRequests = requests.filter(item => 
    item.medicineId?.medicineName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.userId?.orgName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVerify = async (decision: 'approved' | 'rejected') => {
    if (!selectedDonation) return;
    setVerifying(true);
    try {
      await dbService.verifyDonation(selectedDonation.id, user!.uid, decision, notes);
      setSelectedDonation(null);
      setNotes('');
      loadQueue();
    } catch (err) {
      console.error(err);
    } finally {
      setVerifying(false);
    }
  };

  const handleApproveRequest = async (decision: 'approved' | 'rejected') => {
    if (!selectedRequest) return;
    setVerifying(true);
    try {
      await dbService.approveRequest(selectedRequest.id, user!.uid, decision);
      setSelectedRequest(null);
      loadRequests();
    } catch (err) {
      console.error(err);
    } finally {
      setVerifying(false);
    }
  };

  if (showSplash) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-90 h-110">
          <Lottie animationData={splashAnimation} loop={true} />
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <h2 className="text-3xl font-black text-slate-900 mb-2">Pharmacist Portal</h2>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">Initializing verification engine...</p>
        </motion.div>
      </div>
    );
  }

  if (profile?.status === 'pending') {
    return (
      <DashboardLayout role="pharmacist" userName={profile?.name || 'Pharmacist'}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-6">
            <ClockIcon className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Pending Approval</h2>
          <p className="text-slate-500 max-w-md">
            Your pharmacist credentials are being verified by our admin team. You will get access to the verification queue once approved.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      role="pharmacist" 
      userName={profile?.name || 'Pharmacist'}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      actions={
        <div className="flex items-center gap-4">
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
            <button 
              onClick={() => setActiveTab('donations')}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'donations' ? 'bg-[#4f46e5] text-white' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Donations
            </button>
            <button 
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'requests' ? 'bg-[#4f46e5] text-white' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Requests
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-8">
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: 'Verification Queue', value: queue.length, icon: ClockIcon, color: 'text-amber-500' },
            { label: 'Pending Requests', value: requests.filter(r => r.status === 'pending').length, icon: ClipboardCheckIcon, color: 'text-indigo-600' },
            { label: 'Total Verified', value: 124, icon: ShieldCheckIcon, color: 'text-emerald-600' },
          ].map((stat, i) => (
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

        {activeTab === 'donations' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-black text-slate-900">Verification Queue</h3>
              <div className="bg-white rounded-[32px] shadow-sm border border-slate-50 overflow-hidden">
                {filteredQueue.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => setSelectedDonation(item)}
                    className={`p-6 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer border-b border-slate-50 ${selectedDonation?.id === item.id ? 'bg-indigo-50/50' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-50">
                        <img src={item.imageUrl || 'https://picsum.photos/seed/med/100/100'} alt={item.medicineName} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{item.medicineName}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Donor: {item.donorName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Expires</p>
                      <p className="text-xs font-black text-slate-900">{item.expiryDate}</p>
                    </div>
                  </div>
                ))}
                {filteredQueue.length === 0 && !loading && (
                  <div className="py-24 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShieldCheckIcon className="w-6 h-6 text-slate-200" />
                    </div>
                    <p className="text-sm font-bold text-slate-900">Queue is empty</p>
                    <p className="text-xs text-slate-400 mt-1">Great job! All donations are verified.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-900">Action Panel</h3>
              {selectedDonation ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-8 rounded-[32px] shadow-xl shadow-indigo-50 border border-slate-50 space-y-6"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-4 border border-slate-100">
                    <img src={selectedDonation.imageUrl || 'https://picsum.photos/seed/med/400/400'} alt="Medicine" className="w-full h-full object-contain" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Pharmacist Notes</label>
                    <textarea 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Enter observations about packaging, expiry, etc..." 
                      className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-indigo-100"
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      disabled={verifying}
                      onClick={() => handleVerify('rejected')}
                      className="py-4 border-2 border-rose-100 text-rose-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-50 transition-all"
                    >
                      Reject
                    </button>
                    <button 
                      disabled={verifying}
                      onClick={() => handleVerify('approved')}
                      className="py-4 bg-[#4f46e5] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                    >
                      Approve
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white p-12 rounded-[32px] border border-dashed border-slate-200 text-center">
                  <ClipboardCheckIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-sm font-bold text-slate-900">Select a donation</p>
                  <p className="text-xs text-slate-400 mt-1">Pick an item from the queue to start verification</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-black text-slate-900">Patient & NGO Requests</h3>
              <div className="bg-white rounded-[32px] shadow-sm border border-slate-50 overflow-hidden">
                {filteredRequests.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => setSelectedRequest(item)}
                    className={`p-6 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer border-b border-slate-50 ${selectedRequest?.id === item.id ? 'bg-indigo-50/50' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs border border-slate-50">
                        {item.userId?.name?.charAt(0) || item.userId?.orgName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{item.medicineId?.medicineName || item.customMedicineName}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Requested by: {item.userId?.name || item.userId?.orgName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        item.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 
                        item.status === 'pending' ? 'bg-amber-50 text-amber-600' : 
                        'bg-rose-50 text-rose-600'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
                {filteredRequests.length === 0 && !loading && (
                  <div className="py-24 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ClipboardListIcon className="w-6 h-6 text-slate-200" />
                    </div>
                    <p className="text-sm font-bold text-slate-900">No requests found</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-900">Request Details</h3>
              {selectedRequest ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-8 rounded-[32px] shadow-xl shadow-indigo-50 border border-slate-50 space-y-8"
                >
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Medicine</p>
                      <p className="text-sm font-black text-slate-900">{selectedRequest.medicineId?.medicineName || selectedRequest.customMedicineName}</p>
                    </div>
                    {selectedRequest.quantity && (
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Quantity</p>
                        <p className="text-sm font-black text-slate-900">{selectedRequest.quantity}</p>
                      </div>
                    )}
                    {selectedRequest.reason && (
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Reason</p>
                        <p className="text-xs font-bold text-slate-600 leading-relaxed">{selectedRequest.reason}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Requester Role</p>
                      <p className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full inline-block">{selectedRequest.userId?.role}</p>
                    </div>
                    {selectedRequest.userId?.role === 'patient' && (
                      <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                        <div className="flex items-center gap-2 text-amber-600 mb-3">
                          <AlertCircle className="w-5 h-5" />
                          <p className="text-[10px] font-black uppercase tracking-widest">Prescription Required</p>
                        </div>
                        <p className="text-xs text-amber-700 font-bold leading-relaxed">Please verify the patient's prescription uploaded in their profile before approving this request.</p>
                      </div>
                    )}
                  </div>
                  
                  {selectedRequest.status === 'pending' && (
                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                      <button 
                        disabled={verifying}
                        onClick={() => handleApproveRequest('rejected')}
                        className="py-4 border-2 border-rose-100 text-rose-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-50 transition-all"
                      >
                        Reject
                      </button>
                      <button 
                        disabled={verifying}
                        onClick={() => handleApproveRequest('approved')}
                        className="py-4 bg-[#4f46e5] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                      >
                        Approve
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="bg-white p-12 rounded-[32px] border border-dashed border-slate-200 text-center">
                  <ClipboardListIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-sm font-bold text-slate-900">Select a request</p>
                  <p className="text-xs text-slate-400 mt-1">View details and manage approvals</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
