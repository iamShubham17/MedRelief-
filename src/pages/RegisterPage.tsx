import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { dbService } from '@/services/dbService';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import splashAnimation from '@/assets/animations/splash-animation.json';
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
    { id: 'donor', label: 'Donor', icon: VolunteerActivism, desc: 'Contribute surplus medical supplies to our verified network.' },
    { id: 'pharmacist', label: 'Pharmacist', icon: MedicalServices, desc: 'Verify and validate medical standards for distributed supplies.' },
    { id: 'ngo', label: 'NGO', icon: HeartIcon, desc: 'Organizations managing large-scale medical relief distribution.' },
    { id: 'patient', label: 'Patient', icon: PackageIcon, desc: 'Access essential medicines through our secure prescription portal.' },
    { id: 'rider', label: 'Rider', icon: TruckIcon, desc: 'Facilitate secure, temperature-controlled medical transit.' },
    { id: 'admin', label: 'Admin', icon: ShieldCheckIcon, desc: 'Manage system operations and institutional approvals.' },
  ];

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

      {/* Left Panel: Realistic Brand Imagery */}
      <div className="hidden lg:block w-[45%] relative overflow-hidden bg-slate-900">
        <img 
          src="/src/assets/images/register-hero.png" 
          alt="Medical Professional" 
          className="absolute inset-0 w-full h-full object-cover opacity-70 grayscale-[30%]"
          onError={(e) => {
            // Fallback to professional placeholder if local image is missing
            (e.target as HTMLImageElement).src = "https://picsum.photos/seed/medical-mnc-pro/1200/1600";
          }}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900/80"></div>
        
        <div className="absolute top-12 left-12 z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-2xl">
            <ActivityIcon className="w-6 h-6 text-slate-900" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">MedRelief<span className="text-white/60">+</span></span>
        </div>

        <div className="absolute bottom-20 left-12 right-12 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-white mb-6 border border-white/20">
            Institutional Grade Infrastructure
          </div>
          <h1 className="text-6xl font-black text-white leading-[1.1] mb-6 tracking-tighter">
            Global Medical<br />
            <span className="text-white/60">Supply Chain</span><br />
            Excellence.
          </h1>
          <p className="text-lg text-white/70 max-w-md font-medium leading-relaxed">
            A professional ecosystem designed for the secure distribution of life-saving medical resources worldwide.
          </p>
          
          <div className="mt-12 flex items-center gap-8 pt-8 border-t border-white/10">
            <div className="flex items-center gap-2 text-white/60">
              <Globe className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">24/7 Global Support</span>
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <ShieldCheckIcon className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">ISO 27001 Certified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Clean Professional Interface */}
      <div className="flex-1 flex flex-col bg-[#FDFCFB] overflow-y-auto">
        <header className="p-8 flex justify-end items-center gap-8 sticky top-0 bg-[#FDFCFB]/80 backdrop-blur-md z-50">
          <button className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">Documentation</button>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 hover:shadow-sm transition-all"
          >
            Sign In
          </button>
        </header>

        <main className="flex-1 flex flex-col px-8 lg:px-20 py-12 max-w-4xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-8 h-[2px] bg-slate-900"></span>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-900">Step 01 // Identity</span>
                  </div>
                  <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Select Your Role.</h2>
                  <p className="text-lg text-slate-500 font-medium">
                    Choose the professional capacity in which you will interact with the MedRelief network.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roles.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleRoleSelect(item.id as UserRole)}
                      className={`relative p-8 rounded-2xl border-2 text-left transition-all flex flex-col h-full ${
                        role === item.id 
                          ? 'border-slate-900 bg-white shadow-2xl shadow-slate-200' 
                          : 'border-slate-100 bg-white hover:border-slate-200'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors ${
                        role === item.id ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'
                      }`}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{item.label}</h3>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed flex-1">{item.desc}</p>
                      
                      {role === item.id && (
                        <motion.div 
                          layoutId="active-indicator"
                          className="absolute top-6 right-6 text-slate-900"
                        >
                          <CheckCircleIcon className="w-6 h-6" />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-12 flex items-center justify-between border-t border-slate-100">
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
                  <button 
                    onClick={handleContinue}
                    disabled={!role}
                    className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all disabled:opacity-30 flex items-center gap-3"
                  >
                    Continue
                    <ArrowLeftIcon className="w-4 h-4 rotate-180" />
                  </button>
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
