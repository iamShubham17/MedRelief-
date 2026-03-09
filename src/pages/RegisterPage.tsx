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
  Globe,
  XIcon
} from '@/components/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// --- Assets Import ---
import DonorImg from '@/assets/images/donor-character.png'; 
import PharmaImg from '@/assets/images/pharma-character.png';
import NGOImg from '@/assets/images/ngo-character.png';
import PatientImg from '@/assets/images/patient-character.png';
import RiderImg from '@/assets/images/rider-character.png';
import AdminImg from '@/assets/images/admin-character.png';

// --- Form Schemas ---
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

// --- Shared input/label class helpers ---
const inputCls = "w-full px-8 py-5 bg-slate-50 rounded-[24px] focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all font-bold text-lg text-slate-800 placeholder:text-slate-300";
const labelCls = "text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 block mb-1";
const errorCls = "text-xs text-rose-500 font-semibold ml-2 mt-1";

export function RegisterPage() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRiderAnimation, setShowRiderAnimation] = useState(false);
  const [step, setStep] = useState(1);

  const donorForm     = useForm({ resolver: zodResolver(donorSchema) });
  const pharmacistForm = useForm({ resolver: zodResolver(pharmacistSchema) });
  const ngoForm       = useForm({ resolver: zodResolver(ngoSchema) });
  const patientForm   = useForm({ resolver: zodResolver(patientSchema) });
  const riderForm     = useForm({ resolver: zodResolver(riderSchema) });
  const adminForm     = useForm({ resolver: zodResolver(adminSchema) });

  useEffect(() => {
    if (user && profile) navigate(`/dashboard/${profile.role}`);
  }, [user, profile, navigate]);

  if (!user) { navigate('/login'); return null; }

  // --- Submit Handlers ---
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
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onPharmacistSubmit = async (data: any) => {
    setLoading(true);
    try {
      await dbService.createUserProfile(user.uid, {
        role: 'pharmacist',
        name: data.name,
        licenseNumber: data.licenseNumber,
        stateCouncil: data.stateCouncil,
        pharmacyAddress: data.pharmacyAddress,
        phone: user.phoneNumber || '',
        licenseUrl: 'https://placeholder.com/license.pdf',
        status: 'pending',
        verified: false,
      });
      await refreshProfile();
      navigate('/dashboard/pharmacist');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onNGOSubmit = async (data: any) => {
    setLoading(true);
    try {
      await dbService.createUserProfile(user.uid, {
        role: 'ngo',
        orgName: data.orgName,
        regNumber: data.regNumber,
        address: data.address,
        phone: user.phoneNumber || '',
        certUrl: 'https://placeholder.com/cert.pdf',
        status: 'pending',
        verified: false,
      });
      await refreshProfile();
      navigate('/dashboard/ngo');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onPatientSubmit = async (data: any) => {
    setLoading(true);
    try {
      await dbService.createUserProfile(user.uid, {
        role: 'patient',
        name: data.name,
        city: data.city,
        phone: user.phoneNumber || '',
        verified: true,
        status: 'approved',
      });
      await refreshProfile();
      navigate('/dashboard/patient');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onRiderSubmit = async (data: any) => {
    setLoading(true);
    try {
      await dbService.createUserProfile(user.uid, {
        role: 'rider',
        name: data.name,
        vehicleNumber: data.vehicleNumber,
        phone: user.phoneNumber || '',
        verified: true,
        status: 'approved',
      });
      await refreshProfile();
      setLoading(false);
      setShowRiderAnimation(true);
      setTimeout(() => navigate('/dashboard/rider'), 3500);
    } catch (err: any) {
      setLoading(false);
      alert(err.message);
    }
  };

  const onAdminSubmit = async (data: any) => {
    setLoading(true);
    try {
      await dbService.createUserProfile(user.uid, {
        role: 'admin',
        name: data.name,
        employeeId: data.employeeId,
        department: data.department,
        phone: user.phoneNumber || '',
        verified: true,
        status: 'approved',
      });
      await refreshProfile();
      navigate('/dashboard/admin');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: 'donor',      label: 'Donor',       icon: VolunteerActivism, image: DonorImg,  desc: 'Contribute surplus medical supplies to our verified network.',                color: 'from-blue-600 to-indigo-700'   },
    { id: 'pharmacist', label: 'Pharmacist',   icon: MedicalServices,   image: PharmaImg, desc: 'Verify and validate medical standards for distributed supplies.',             color: 'from-emerald-500 to-teal-600'  },
    { id: 'ngo',        label: 'NGO',          icon: HeartIcon,         image: NGOImg,    desc: 'Organizations managing large-scale medical relief distribution.',             color: 'from-rose-500 to-pink-600'     },
    { id: 'patient',    label: 'Patient',      icon: PackageIcon,       image: PatientImg,desc: 'Access essential medicines through our secure portal.',                      color: 'from-amber-500 to-orange-600'  },
    { id: 'rider',      label: 'Rider',        icon: TruckIcon,         image: RiderImg,  desc: 'Facilitate secure, temperature-controlled medical transit.',                 color: 'from-slate-600 to-slate-800'   },
    { id: 'admin',      label: 'Admin',        icon: ShieldCheckIcon,   image: AdminImg,  desc: 'Manage system operations and institutional approvals.',                      color: 'from-violet-600 to-purple-700' },
  ];

  const selectedRoleData = roles.find(r => r.id === role);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans overflow-hidden">

      {/* Rider Success Animation Overlay */}
      <AnimatePresence>
        {showRiderAnimation && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center p-6"
          >
            <div className="w-80 h-80">
              <Lottie animationData={splashAnimation} loop={true} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mt-8 tracking-tighter">Initializing Network...</h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:flex-col w-[30%] bg-white border-r border-slate-100 p-12 justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
            <ActivityIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">MedRelief<span className="text-blue-500">+</span></span>
        </div>
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-6 italic uppercase">
            Next Gen<br/><span className="text-slate-300">Relief.</span>
          </h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            Secure, institutional-grade infrastructure for global medical supply chain excellence.
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
            <Globe className="w-4 h-4"/> 24/7 Global Infrastructure
          </div>
          <div className="flex items-center gap-3 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
            <ShieldCheckIcon className="w-4 h-4"/> ISO Certified Network
          </div>
        </div>
      </div>

      {/* Right Interaction Panel */}
      <div className="flex-1 relative flex flex-col overflow-y-auto overflow-x-hidden bg-[#F1F5F9]">
        <header className="p-8 flex justify-end sticky top-0 z-30">
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-white shadow-sm border border-slate-200 rounded-full text-sm font-bold hover:bg-slate-50 transition-all"
          >
            Sign In
          </button>
        </header>

        <main className="flex-1 px-6 lg:px-16 pb-20">
          <AnimatePresence mode="wait">

            {/* ── STEP 1: Role Selection Carousel ── */}
            {step === 1 ? (
              <motion.div key="selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -50 }} className="h-full flex flex-col">
                <div className="mb-12">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-2 block">Step 01 // Identity</span>
                  <h2 className="text-6xl font-black text-slate-900 tracking-tighter">Select Your Role.</h2>
                </div>

                {/* Disney-style Horizontal Carousel */}
                <div className="flex gap-10 overflow-x-auto pb-20 pt-24 no-scrollbar snap-x snap-mandatory px-4">
                  {roles.map((item) => (
                    <motion.div
                      key={item.id}
                      layoutId={`card-${item.id}`}
                      onClick={() => setRole(item.id as UserRole)}
                      whileHover={{ y: -10 }}
                      className="relative flex-shrink-0 w-[320px] h-[450px] rounded-[50px] cursor-pointer snap-center shadow-2xl group overflow-visible"
                    >
                      {/* Gradient Base */}
                      <div className={`absolute inset-0 bg-gradient-to-b ${item.color} rounded-[50px] z-10 shadow-inner`} />

                      {/* Character Pop-out Image */}
                      <motion.img
                        src={item.image}
                        alt={item.label}
                        initial={{ y: 0 }}
                        whileHover={{ y: -60, scale: 1.15 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                        className="absolute -top-24 left-0 right-0 mx-auto w-64 h-64 object-contain z-30 drop-shadow-[0_35px_35px_rgba(0,0,0,0.4)] pointer-events-none"
                      />

                      {/* Card Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-10 z-20 text-white">
                        <h3 className="text-4xl font-black mb-2 tracking-tighter">{item.label}</h3>
                        <p className="text-xs font-medium opacity-70 leading-relaxed line-clamp-2">{item.desc}</p>
                        <div className="mt-8 flex items-center justify-between">
                          <span className="text-[9px] font-black uppercase tracking-widest opacity-50">Authorized</span>
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-white/40 transition-all">
                            <ArrowLeftIcon className="w-5 h-5 rotate-180" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Role Expanded Overlay */}
                <AnimatePresence>
                  {role && selectedRoleData && (
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-12 bg-slate-900/40 backdrop-blur-xl"
                    >
                      <motion.div
                        layoutId={`card-${role}`}
                        className="bg-white w-full max-w-6xl h-[600px] rounded-[60px] overflow-hidden shadow-2xl flex flex-col lg:flex-row relative"
                      >
                        <button
                          onClick={() => setRole(null)}
                          className="absolute top-8 right-8 z-30 p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-all"
                        >
                          <XIcon className="w-6 h-6"/>
                        </button>

                        {/* Left Visual */}
                        <div className={`lg:w-1/2 p-12 flex flex-col justify-center items-center text-white relative bg-gradient-to-br ${selectedRoleData.color} overflow-hidden`}>
                          <motion.img
                            src={selectedRoleData.image}
                            alt={selectedRoleData.label}
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="w-[120%] h-[120%] object-contain z-10 drop-shadow-2xl scale-125 translate-x-[-10%]"
                          />
                          <h1 className="absolute text-[15rem] font-black text-white/10 uppercase tracking-tighter select-none rotate-90 right-[-15%] whitespace-nowrap z-0">
                            {selectedRoleData.label}
                          </h1>
                        </div>

                        {/* Right Details */}
                        <div className="lg:w-1/2 p-16 flex flex-col justify-center">
                          <span className="text-blue-600 font-black text-xs uppercase tracking-[0.4em] mb-4">MedRelief System</span>
                          <h2 className="text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-none">{selectedRoleData.label}</h2>
                          <p className="text-slate-500 text-lg font-medium leading-relaxed mb-12">{selectedRoleData.desc}</p>
                          <div className="space-y-4">
                            <button
                              onClick={() => setStep(2)}
                              className="w-full py-6 bg-slate-900 text-white rounded-[30px] font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-slate-900/30"
                            >
                              Confirm Selection
                            </button>
                            <button
                              onClick={() => setRole(null)}
                              className="w-full py-6 bg-slate-100 text-slate-500 rounded-[30px] font-black text-lg hover:bg-slate-200 transition-all"
                            >
                              Go Back
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

            ) : (
              /* ── STEP 2: Registration Form ── */
              <motion.div key="form" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto py-10">
                <button
                  onClick={() => { setStep(1); setRole(null); }}
                  className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-12 hover:text-slate-900 transition-all"
                >
                  <ArrowLeftIcon className="w-4 h-4" /> Change Role
                </button>

                {selectedRoleData && (
                  <div className="mb-12 flex items-center gap-8">
                    <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center text-white shadow-xl bg-gradient-to-br ${selectedRoleData.color}`}>
                      <selectedRoleData.icon className="w-12 h-12" />
                    </div>
                    <div>
                      <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Complete Profile.</h2>
                      <p className="text-slate-500 font-medium">Verify your {selectedRoleData.label} credentials.</p>
                    </div>
                  </div>
                )}

                <div className="bg-white p-12 rounded-[50px] shadow-sm border border-slate-50">

                  {/* ── DONOR FORM ── */}
                  {role === 'donor' && (
                    <form onSubmit={donorForm.handleSubmit(onDonorSubmit)} className="space-y-6">
                      <div>
                        <label className={labelCls}>Full Name</label>
                        <input {...donorForm.register('name')} className={inputCls} placeholder="John Doe" />
                        {donorForm.formState.errors.name && <p className={errorCls}>{donorForm.formState.errors.name.message as string}</p>}
                      </div>
                      <div>
                        <label className={labelCls}>City</label>
                        <input {...donorForm.register('city')} className={inputCls} placeholder="Mumbai" />
                        {donorForm.formState.errors.city && <p className={errorCls}>{donorForm.formState.errors.city.message as string}</p>}
                      </div>
                      <button disabled={loading} type="submit" className="w-full bg-slate-900 text-white py-6 rounded-[24px] font-black text-lg shadow-xl shadow-slate-900/20 disabled:opacity-60 transition-all">
                        {loading ? 'Processing...' : 'Access Network'}
                      </button>
                    </form>
                  )}

                  {/* ── PHARMACIST FORM ── */}
                  {role === 'pharmacist' && (
                    <form onSubmit={pharmacistForm.handleSubmit(onPharmacistSubmit)} className="space-y-6">
                      <div>
                        <label className={labelCls}>Full Name</label>
                        <input {...pharmacistForm.register('name')} className={inputCls} placeholder="Dr. Jane Smith" />
                        {pharmacistForm.formState.errors.name && <p className={errorCls}>{pharmacistForm.formState.errors.name.message as string}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>License No.</label>
                          <input {...pharmacistForm.register('licenseNumber')} className={inputCls} placeholder="MH-12345" />
                          {pharmacistForm.formState.errors.licenseNumber && <p className={errorCls}>{pharmacistForm.formState.errors.licenseNumber.message as string}</p>}
                        </div>
                        <div>
                          <label className={labelCls}>State Council</label>
                          <input {...pharmacistForm.register('stateCouncil')} className={inputCls} placeholder="Maharashtra" />
                          {pharmacistForm.formState.errors.stateCouncil && <p className={errorCls}>{pharmacistForm.formState.errors.stateCouncil.message as string}</p>}
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>Pharmacy Address</label>
                        <textarea {...pharmacistForm.register('pharmacyAddress')} className={`${inputCls} resize-none`} placeholder="123 Medical Lane, Mumbai - 400001" rows={3} />
                        {pharmacistForm.formState.errors.pharmacyAddress && <p className={errorCls}>{pharmacistForm.formState.errors.pharmacyAddress.message as string}</p>}
                      </div>
                      <button disabled={loading} type="submit" className="w-full bg-slate-900 text-white py-6 rounded-[24px] font-black text-lg shadow-xl shadow-slate-900/20 disabled:opacity-60 transition-all">
                        {loading ? 'Submitting...' : 'Submit Verification'}
                      </button>
                    </form>
                  )}

                  {/* ── NGO FORM ── */}
                  {role === 'ngo' && (
                    <form onSubmit={ngoForm.handleSubmit(onNGOSubmit)} className="space-y-6">
                      <div>
                        <label className={labelCls}>Organization Name</label>
                        <input {...ngoForm.register('orgName')} className={inputCls} placeholder="HealthCare Foundation" />
                        {ngoForm.formState.errors.orgName && <p className={errorCls}>{ngoForm.formState.errors.orgName.message as string}</p>}
                      </div>
                      <div>
                        <label className={labelCls}>Registration Number</label>
                        <input {...ngoForm.register('regNumber')} className={inputCls} placeholder="NGO-MH-2024-00123" />
                        {ngoForm.formState.errors.regNumber && <p className={errorCls}>{ngoForm.formState.errors.regNumber.message as string}</p>}
                      </div>
                      <div>
                        <label className={labelCls}>Organization Address</label>
                        <textarea {...ngoForm.register('address')} className={`${inputCls} resize-none`} placeholder="456 Relief Street, Pune - 411001" rows={3} />
                        {ngoForm.formState.errors.address && <p className={errorCls}>{ngoForm.formState.errors.address.message as string}</p>}
                      </div>
                      <button disabled={loading} type="submit" className="w-full bg-slate-900 text-white py-6 rounded-[24px] font-black text-lg shadow-xl shadow-slate-900/20 disabled:opacity-60 transition-all">
                        {loading ? 'Registering...' : 'Register NGO'}
                      </button>
                    </form>
                  )}

                  {/* ── PATIENT FORM ── */}
                  {role === 'patient' && (
                    <form onSubmit={patientForm.handleSubmit(onPatientSubmit)} className="space-y-6">
                      <div>
                        <label className={labelCls}>Full Name</label>
                        <input {...patientForm.register('name')} className={inputCls} placeholder="Rahul Sharma" />
                        {patientForm.formState.errors.name && <p className={errorCls}>{patientForm.formState.errors.name.message as string}</p>}
                      </div>
                      <div>
                        <label className={labelCls}>City</label>
                        <input {...patientForm.register('city')} className={inputCls} placeholder="Delhi" />
                        {patientForm.formState.errors.city && <p className={errorCls}>{patientForm.formState.errors.city.message as string}</p>}
                      </div>
                      <button disabled={loading} type="submit" className="w-full bg-slate-900 text-white py-6 rounded-[24px] font-black text-lg shadow-xl shadow-slate-900/20 disabled:opacity-60 transition-all">
                        {loading ? 'Joining...' : 'Join Network'}
                      </button>
                    </form>
                  )}

                  {/* ── RIDER FORM ── */}
                  {role === 'rider' && (
                    <form onSubmit={riderForm.handleSubmit(onRiderSubmit)} className="space-y-6">
                      <div>
                        <label className={labelCls}>Full Name</label>
                        <input {...riderForm.register('name')} className={inputCls} placeholder="Arjun Patel" />
                        {riderForm.formState.errors.name && <p className={errorCls}>{riderForm.formState.errors.name.message as string}</p>}
                      </div>
                      <div>
                        <label className={labelCls}>Vehicle Number</label>
                        <input {...riderForm.register('vehicleNumber')} className={inputCls} placeholder="MH-01-AB-1234" />
                        {riderForm.formState.errors.vehicleNumber && <p className={errorCls}>{riderForm.formState.errors.vehicleNumber.message as string}</p>}
                      </div>
                      <button disabled={loading} type="submit" className="w-full bg-slate-900 text-white py-6 rounded-[24px] font-black text-lg shadow-xl shadow-slate-900/20 disabled:opacity-60 transition-all">
                        {loading ? 'Processing...' : 'Become a Rider'}
                      </button>
                    </form>
                  )}

                  {/* ── ADMIN FORM ── */}
                  {role === 'admin' && (
                    <form onSubmit={adminForm.handleSubmit(onAdminSubmit)} className="space-y-6">
                      <div>
                        <label className={labelCls}>Admin Name</label>
                        <input {...adminForm.register('name')} className={inputCls} placeholder="Vikram Singh" />
                        {adminForm.formState.errors.name && <p className={errorCls}>{adminForm.formState.errors.name.message as string}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>Employee ID</label>
                          <input {...adminForm.register('employeeId')} className={inputCls} placeholder="EMP-0042" />
                          {adminForm.formState.errors.employeeId && <p className={errorCls}>{adminForm.formState.errors.employeeId.message as string}</p>}
                        </div>
                        <div>
                          <label className={labelCls}>Department</label>
                          <input {...adminForm.register('department')} className={inputCls} placeholder="Operations" />
                          {adminForm.formState.errors.department && <p className={errorCls}>{adminForm.formState.errors.department.message as string}</p>}
                        </div>
                      </div>
                      <button disabled={loading} type="submit" className="w-full bg-slate-900 text-white py-6 rounded-[24px] font-black text-lg shadow-xl shadow-slate-900/20 disabled:opacity-60 transition-all">
                        {loading ? 'Authorizing...' : 'Access Admin Console'}
                      </button>
                    </form>
                  )}

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}