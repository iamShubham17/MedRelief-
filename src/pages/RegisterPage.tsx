import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { dbService } from '@/services/dbService';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import splashAnimation from '@/assets/animations/splash-animation.json';
import bgAnimation from '@/assets/animations/Isometric data analysis.json';
import { 
  VolunteerActivism, 
  MedicalServices, 
  TruckIcon, 
  HeartIcon,
  ShieldCheckIcon,
  PackageIcon,
  ArrowLeftIcon,
  ActivityIcon,
  CheckCircleIcon,
  Globe
} from '@/components/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const donorSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  city: z.string().min(2, 'City is required'),
});

const pharmacistSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  licenseNumber: z.string().min(5, 'License number is required'),
  stateCouncil: z.string().min(2, 'State council is required'),
  pharmacyAddress: z.string().min(10, 'Address is required'),
});

const ngoSchema = z.object({
  orgName: z.string().min(2, 'Organization name is required'),
  regNumber: z.string().min(5, 'Registration number is required'),
  address: z.string().min(10, 'Address is required'),
});

const patientSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  city: z.string().min(2, 'City is required'),
});

const riderSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  vehicleNumber: z.string().min(5, 'Vehicle number is required'),
});

const adminSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  employeeId: z.string().min(4, 'Employee ID is required'),
  department: z.string().min(2, 'Department is required'),
});

export function RegisterPage() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRiderAnimation, setShowRiderAnimation] = useState(false);
  const [step, setStep] = useState(1);

  const donorForm = useForm({ resolver: zodResolver(donorSchema) });
  const pharmacistForm = useForm({ resolver: zodResolver(pharmacistSchema) });
  const ngoForm = useForm({ resolver: zodResolver(ngoSchema) });
  const patientForm = useForm({ resolver: zodResolver(patientSchema) });
  const riderForm = useForm({ resolver: zodResolver(riderSchema) });
  const adminForm = useForm({ resolver: zodResolver(adminSchema) });

  useEffect(() => {
    if (user && profile) {
      navigate(`/dashboard/${profile.role}`);
    }
  }, [user, profile, navigate]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
  };

  const handleContinue = () => {
    if (role) setStep(2);
  };

  const onDonorSubmit = async (data: any) => {
    setLoading(true);
    try {
      await dbService.createUserProfile(user.uid, {
        role: 'donor',
        name: data.name,
        phone: user.phoneNumber || '',
        city: data.city,
        verified: true,
        mediPoints: 0,
        status: 'approved',
      });
      await refreshProfile();
      navigate('/dashboard/donor');
    } catch (err: any) {
      alert('Registration failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const onPharmacistSubmit = async (data: any) => {
    setLoading(true);
    try {
      await dbService.createUserProfile(user.uid, {
        role: 'pharmacist',
        ...data,
        phone: user.phoneNumber || '',
        licenseUrl: 'https://placeholder.com/license.pdf',
        status: 'pending',
        verified: false,
      });
      await refreshProfile();
      navigate('/dashboard/pharmacist');
    } catch (err: any) {
      alert('Registration failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const onNGOSubmit = async (data: any) => {
    setLoading(true);
    try {
      await dbService.createUserProfile(user.uid, {
        role: 'ngo',
        ...data,
        phone: user.phoneNumber || '',
        certUrl: 'https://placeholder.com/cert.pdf',
        status: 'pending',
        verified: false,
      });
      await refreshProfile();
      navigate('/dashboard/ngo');
    } catch (err: any) {
      alert('Registration failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const onPatientSubmit = async (data: any) => {
    setLoading(true);
    try {
      await dbService.createUserProfile(user.uid, {
        role: 'patient',
        ...data,
        phone: user.phoneNumber || '',
        verified: true,
        status: 'approved',
      });
      await refreshProfile();
      navigate('/dashboard/patient');
    } catch (err: any) {
      alert('Registration failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const onRiderSubmit = async (data: any) => {
    setLoading(true);
    try {
      await dbService.createUserProfile(user.uid, {
        role: 'rider',
        ...data,
        phone: user.phoneNumber || '',
        verified: true,
        status: 'approved',
      });
      await refreshProfile();
      setLoading(false);
      setShowRiderAnimation(true);
      setTimeout(() => {
        navigate('/dashboard/rider');
      }, 3500);
    } catch (err: any) {
      setLoading(false);
      alert('Registration failed: ' + err.message);
    }
  };

  const onAdminSubmit = async (data: any) => {
    setLoading(true);
    try {
      await dbService.createUserProfile(user.uid, {
        role: 'admin',
        ...data,
        phone: user.phoneNumber || '',
        verified: true,
        status: 'approved', // Admins are auto-approved for this demo
      });
      await refreshProfile();
      navigate('/dashboard/admin');
    } catch (err: any) {
      alert('Registration failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: 'donor', label: 'Donor', icon: VolunteerActivism, desc: 'Contribute surplus medical supplies to our verified network.', color: 'from-blue-500/20 to-indigo-500/20' },
    { id: 'pharmacist', label: 'Pharmacist', icon: MedicalServices, desc: 'Verify and validate medical standards for distributed supplies.', color: 'from-emerald-500/20 to-teal-500/20' },
    { id: 'ngo', label: 'NGO', icon: HeartIcon, desc: 'Organizations managing large-scale medical relief distribution.', color: 'from-rose-500/20 to-pink-500/20' },
    { id: 'patient', label: 'Patient', icon: PackageIcon, desc: 'Access essential medicines through our secure prescription portal.', color: 'from-amber-500/20 to-orange-500/20' },
    { id: 'rider', label: 'Rider', icon: TruckIcon, desc: 'Facilitate secure, temperature-controlled medical transit.', color: 'from-slate-500/20 to-slate-700/20' },
    { id: 'admin', label: 'Admin', icon: ShieldCheckIcon, desc: 'Manage system operations and institutional approvals.', color: 'from-violet-500/20 to-purple-500/20' },
  ];

  const selectedRoleData = roles.find(r => r.id === role);

  return (
    <div className="min-h-screen flex bg-white font-sans selection:bg-slate-200">
      <AnimatePresence>
        {showRiderAnimation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center p-6"
          >
            <div className="w-80 h-80">
              <Lottie animationData={splashAnimation} loop={true} />
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-8"
            >
              <h2 className="text-3xl font-black text-slate-900 mb-2">Initializing Network...</h2>
              <p className="text-slate-500 font-medium">Setting up your professional logistics dashboard.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Panel */}
      <div className="hidden lg:flex lg:flex-col w-[45%] overflow-hidden bg-white border-r border-slate-100">

        {/* Top: Logo */}
        <div className="flex-shrink-0 px-12 pt-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
            <ActivityIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">MedRelief<span className="text-slate-400">+</span></span>
        </div>

        {/* Middle: Lottie Animation */}
        <div className="flex-1 flex items-center justify-center px-8 py-4 min-h-0">
          <div className="w-full max-w-[700px]">
            <Lottie animationData={bgAnimation} loop={true} />
          </div>
        </div>

        {/* Bottom: Text Content */}
        <div className="flex-shrink-0 px-12 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-5 border border-slate-200">
            Institutional Grade Infrastructure
          </div>
          <h1 className="text-5xl font-black text-slate-900 leading-[1.1] mb-4 tracking-tighter">
            Global Medical<br />
            <span className="text-slate-400">Supply Chain</span><br />
            Excellence.
          </h1>
          <p className="text-base text-slate-500 font-medium leading-relaxed mb-8">
            A professional ecosystem designed for the secure distribution of life-saving medical resources worldwide.
          </p>
          <div className="flex items-center gap-8 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2 text-slate-400">
              <Globe className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">24/7 Global Support</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheckIcon className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">ISO 27001 Certified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Clean Professional Interface */}
      <div className="flex-1 flex flex-col bg-[#EFF6FF] overflow-y-auto">
        <header className="p-8 flex justify-end items-center gap-8 sticky top-0 bg-[#EFF6FF]/80 backdrop-blur-md z-50">
          <button className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">Documentation</button>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 hover:shadow-sm transition-all"
          >
            Sign In
          </button>
        </header>

        <main className="flex-1 flex flex-col px-8 lg:px-20 py-12 max-w-5xl mx-auto w-full relative">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col"
              >
                <div className="mb-12">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-8 h-[2px] bg-slate-900"></span>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-900">Step 01 // Identity</span>
                  </div>
                  <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Select Your Role.</h2>
                  <p className="text-lg text-slate-500 font-medium">
                    Choose the professional capacity in which you will interact with the MedRelief network.
                  </p>
                </div>

                {/* Carousel Container */}
                <div className="relative flex-1 min-h-[400px]">
                  <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-12 no-scrollbar -mx-4 px-4">
                    {roles.map((item) => (
                      <motion.div
                        key={item.id}
                        layoutId={`card-${item.id}`}
                        onClick={() => handleRoleSelect(item.id as UserRole)}
                        className={`flex-shrink-0 w-[280px] h-[380px] snap-center cursor-pointer relative group rounded-[32px] overflow-hidden border transition-all duration-500 ${
                          role === item.id 
                            ? 'border-slate-900 shadow-2xl scale-105 z-10' 
                            : 'border-slate-100 bg-white/50 backdrop-blur-sm hover:border-slate-200'
                        }`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
                        
                        <div className="relative h-full p-8 flex flex-col">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 ${
                            role === item.id ? 'bg-slate-900 text-white scale-110' : 'bg-white shadow-sm text-slate-400'
                          }`}>
                            <item.icon className="w-7 h-7" />
                          </div>
                          
                          <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">{item.label}</h3>
                          <p className="text-sm text-slate-500 font-bold leading-relaxed opacity-80">{item.desc}</p>
                          
                          <div className="mt-auto flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Institutional Role</span>
                            {role === item.id && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-slate-900">
                                <CheckCircleIcon className="w-6 h-6" />
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Expanded Overlay (Layout Morphing) */}
                  <AnimatePresence>
                    {role && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 pointer-events-none"
                      >
                        <div className="absolute inset-0 bg-[#EFF6FF]/60 backdrop-blur-xl pointer-events-auto" onClick={() => setRole(null)} />
                        
                        <motion.div 
                          layoutId={`card-${role}`}
                          className="absolute inset-0 m-auto w-full max-w-2xl h-[500px] bg-white rounded-[40px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden pointer-events-auto"
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${selectedRoleData?.color} opacity-30`} />
                          
                          <div className="relative h-full p-12 flex flex-col lg:flex-row gap-12 items-center">
                            <div className="w-32 h-32 rounded-[32px] bg-slate-900 text-white flex items-center justify-center flex-shrink-0 shadow-2xl shadow-slate-900/20">
                              {selectedRoleData && <selectedRoleData.icon className="w-12 h-12" />}
                            </div>
                            
                            <div className="flex-1 text-center lg:text-left">
                              <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">{selectedRoleData?.label}</h3>
                              <p className="text-lg text-slate-500 font-medium leading-relaxed mb-8">
                                {selectedRoleData?.desc}
                              </p>
                              
                              <div className="flex flex-col sm:flex-row gap-4">
                                <button 
                                  onClick={handleContinue}
                                  className="flex-1 px-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-2xl shadow-slate-900/30 hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
                                >
                                  Continue as {selectedRoleData?.label}
                                  <ArrowLeftIcon className="w-4 h-4 rotate-180" />
                                </button>
                                <button 
                                  onClick={() => setRole(null)}
                                  className="px-8 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all"
                                >
                                  Change Role
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-auto pt-12 flex items-center justify-between border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-100">
                          <img src={`https://picsum.photos/seed/user-${i}/32/32`} alt="User" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Joined by 12k+ professionals</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div>
                  <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-8 hover:text-slate-900 transition-all">
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to Selection
                  </button>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-8 h-[2px] bg-slate-900"></span>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-900">Step 02 // Credentials</span>
                  </div>
                  <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Account Setup.</h2>
                  <p className="text-lg text-slate-500 font-medium">
                    Provide your institutional details to finalize your profile on the network.
                  </p>
                </div>

                <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm">
                  {role === 'donor' && (
                    <form onSubmit={donorForm.handleSubmit(onDonorSubmit)} className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                        <input {...donorForm.register('name')} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900/10 transition-all font-bold text-slate-900" placeholder="Your Name" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">City</label>
                        <input {...donorForm.register('city')} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900/10 transition-all font-bold text-slate-900" placeholder="Your City" />
                      </div>
                      <button disabled={loading} type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all">
                        {loading ? 'Processing...' : 'Complete Registration'}
                      </button>
                    </form>
                  )}

                  {role === 'pharmacist' && (
                    <form onSubmit={pharmacistForm.handleSubmit(onPharmacistSubmit)} className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name (as per license)</label>
                        <input {...pharmacistForm.register('name')} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900/10 transition-all font-bold text-slate-900" />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">License Number</label>
                          <input {...pharmacistForm.register('licenseNumber')} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900/10 transition-all font-bold text-slate-900" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">State Council</label>
                          <input {...pharmacistForm.register('stateCouncil')} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900/10 transition-all font-bold text-slate-900" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pharmacy Address</label>
                        <textarea {...pharmacistForm.register('pharmacyAddress')} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900/10 transition-all font-bold text-slate-900" rows={3} />
                      </div>
                      <button disabled={loading} type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all">
                        {loading ? 'Uploading...' : 'Submit for Approval'}
                      </button>
                    </form>
                  )}

                  {role === 'ngo' && (
                    <form onSubmit={ngoForm.handleSubmit(onNGOSubmit)} className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Organization Name</label>
                        <input {...ngoForm.register('orgName')} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900/10 transition-all font-bold text-slate-900" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Registration Number</label>
                        <input {...ngoForm.register('regNumber')} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900/10 transition-all font-bold text-slate-900" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Address</label>
                        <textarea {...ngoForm.register('address')} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900/10 transition-all font-bold text-slate-900" rows={3} />
                      </div>
                      <button disabled={loading} type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all">
                        {loading ? 'Uploading...' : 'Submit for Approval'}
                      </button>
                    </form>
                  )}

                  {role === 'patient' && (
                    <form onSubmit={patientForm.handleSubmit(onPatientSubmit)} className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                        <input {...patientForm.register('name')} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900/10 transition-all font-bold text-slate-900" placeholder="Your Name" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">City</label>
                        <input {...patientForm.register('city')} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900/10 transition-all font-bold text-slate-900" placeholder="Your City" />
                      </div>
                      <button disabled={loading} type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all">
                        {loading ? 'Registering...' : 'Complete Registration'}
                      </button>
                    </form>
                  )}

                  {role === 'rider' && (
                    <form onSubmit={riderForm.handleSubmit(onRiderSubmit)} className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                        <input {...riderForm.register('name')} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900/10 transition-all font-bold text-slate-900" placeholder="Your Name" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vehicle Number</label>
                        <input {...riderForm.register('vehicleNumber')} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900/10 transition-all font-bold text-slate-900" placeholder="e.g. MH 31 AB 1234" />
                      </div>
                      <button disabled={loading} type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all">
                        {loading ? 'Registering...' : 'Complete Registration'}
                      </button>
                    </form>
                  )}

                  {role === 'admin' && (
                    <form onSubmit={adminForm.handleSubmit(onAdminSubmit)} className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                        <input {...adminForm.register('name')} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900/10 transition-all font-bold text-slate-900" placeholder="System Administrator Name" />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Employee ID</label>
                          <input {...adminForm.register('employeeId')} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900/10 transition-all font-bold text-slate-900" placeholder="ADM-000" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Department</label>
                          <input {...adminForm.register('department')} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900/10 transition-all font-bold text-slate-900" placeholder="Operations" />
                        </div>
                      </div>
                      <button disabled={loading} type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all">
                        {loading ? 'Initializing...' : 'Activate Admin Console'}
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <footer className="mt-auto pt-20 flex items-center justify-center gap-8 opacity-30">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">© 2026 MedRelief Global // Institutional Access Only</p>
          </footer>
        </main>
      </div>
    </div>
  );
}