import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/context/AuthContext';
import { dbService } from '@/services/dbService';
import { motion, AnimatePresence } from 'motion/react';
import Lottie from 'lottie-react';
import splashAnimation from '@/assets/animations/splash-animation.json';
import { 
  VolunteerActivism, 
  MedicalServices, 
  TruckIcon, 
  HeartIcon,
  ShieldCheckIcon,
  PackageIcon,
  ArrowLeftIcon
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

export function RegisterPage() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRiderAnimation, setShowRiderAnimation] = useState(false);

  const donorForm = useForm({ resolver: zodResolver(donorSchema) });
  const pharmacistForm = useForm({ resolver: zodResolver(pharmacistSchema) });
  const ngoForm = useForm({ resolver: zodResolver(ngoSchema) });
  const patientForm = useForm({ resolver: zodResolver(patientSchema) });
  const riderForm = useForm({ resolver: zodResolver(riderSchema) });
  const adminForm = useForm({ resolver: zodResolver(z.object({ name: z.string().min(2) })) });

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
  };

  const onDonorSubmit = async (data: any) => {
    console.log('Starting donor registration...', { uid: user.uid, data });
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
      alert('Registration timed out. Please check your internet connection or Firebase rules.');
    }, 15000);

    try {
      await dbService.createUserProfile(user.uid, {
        role: 'donor',
        name: data.name,
        phone: user.phoneNumber || '',
        city: data.city,
        verified: true,
        mediPoints: 0,
      });
      console.log('Donor profile created successfully');
      await refreshProfile();
      clearTimeout(timeout);
      navigate('/dashboard/donor');
    } catch (err: any) {
      console.error('Donor registration error:', err);
      clearTimeout(timeout);
      alert('Registration failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const onPharmacistSubmit = async (data: any) => {
    console.log('Starting pharmacist registration...', { uid: user.uid });
    setLoading(true);
    try {
      await dbService.createUserProfile(user.uid, {
        role: 'pharmacist',
        ...data,
        phone: user.phoneNumber || '',
        licenseUrl: 'https://placeholder.com/license.pdf', // Placeholder as storage is removed
        status: 'pending',
        verified: false,
      });
      console.log('Pharmacist profile created successfully');
      await refreshProfile();
      navigate('/dashboard/pharmacist');
    } catch (err: any) {
      console.error('Pharmacist registration error:', err);
      alert('Registration failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const onNGOSubmit = async (data: any) => {
    console.log('Starting NGO registration...', { uid: user.uid });
    setLoading(true);
    try {
      await dbService.createUserProfile(user.uid, {
        role: 'ngo',
        ...data,
        phone: user.phoneNumber || '',
        certUrl: 'https://placeholder.com/cert.pdf', // Placeholder as storage is removed
        status: 'pending',
        verified: false,
      });
      console.log('NGO profile created successfully');
      await refreshProfile();
      navigate('/dashboard/ngo');
    } catch (err: any) {
      console.error('NGO registration error:', err);
      alert('Registration failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const onPatientSubmit = async (data: any) => {
    console.log('Starting patient registration...', { uid: user.uid, data });
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
      alert('Registration timed out.');
    }, 15000);

    try {
      await dbService.createUserProfile(user.uid, {
        role: 'patient',
        ...data,
        phone: user.phoneNumber || '',
        verified: true,
      });
      console.log('Patient profile created successfully');
      await refreshProfile();
      clearTimeout(timeout);
      navigate('/dashboard/patient');
    } catch (err: any) {
      console.error('Patient registration error:', err);
      clearTimeout(timeout);
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
      });
      await refreshProfile();
      setLoading(false);
      setShowRiderAnimation(true);
      setTimeout(() => {
        navigate('/dashboard/rider');
      }, 3500); // Show animation for 3.5 seconds
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
        name: data.name,
        phone: user.phoneNumber || '',
        verified: true,
        status: 'approved',
      });
      await refreshProfile();
      navigate('/dashboard/admin');
    } catch (err: any) {
      alert('Registration failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-light py-20 px-6">
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
              <h2 className="text-3xl font-black text-slate-900 mb-2">Setting Up Your Route!</h2>
              <p className="text-slate-500 font-medium">Preparing your rider dashboard...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Complete Your Profile</h1>
          <p className="text-slate-500">Select your role to get started with MediShare</p>
        </div>

        {!role ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: 'donor', label: 'Donor', icon: VolunteerActivism, desc: 'Donate unused medicines' },
              { id: 'pharmacist', label: 'Pharmacist', icon: MedicalServices, desc: 'Verify donated medicines' },
              { id: 'ngo', label: 'NGO / Clinic', icon: HeartIcon, desc: 'Request medicines for patients' },
              { id: 'patient', label: 'Patient', icon: PackageIcon, desc: 'Request medicines with prescription' },
              { id: 'rider', label: 'Rider', icon: TruckIcon, desc: 'Help with medicine logistics' },
              { id: 'admin', label: 'Admin', icon: ShieldCheckIcon, desc: 'Manage users and approvals' },
            ].map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ y: -5 }}
                onClick={() => handleRoleSelect(item.id as UserRole)}
                className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center hover:border-primary hover:shadow-xl transition-all group"
              >
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.label}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </motion.button>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden max-w-2xl mx-auto"
          >
            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <button onClick={() => setRole(null)} className="text-slate-400 hover:text-primary flex items-center gap-2">
                  <ArrowLeftIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Back</span>
                </button>
                <h2 className="text-2xl font-bold capitalize">{role} Registration</h2>
              </div>

              {role === 'donor' && (
                <form onSubmit={donorForm.handleSubmit(onDonorSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Full Name</label>
                    <input {...donorForm.register('name')} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-primary" placeholder="Your Name" />
                    {donorForm.formState.errors.name && <p className="text-xs text-red-500">{donorForm.formState.errors.name.message as string}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">City</label>
                    <input {...donorForm.register('city')} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-primary" placeholder="Your City" />
                    {donorForm.formState.errors.city && <p className="text-xs text-red-500">{donorForm.formState.errors.city.message as string}</p>}
                  </div>
                  <button disabled={loading} type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20">
                    {loading ? 'Registering...' : 'Complete Registration'}
                  </button>
                </form>
              )}

              {role === 'pharmacist' && (
                <form onSubmit={pharmacistForm.handleSubmit(onPharmacistSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Full Name (as per license)</label>
                    <input {...pharmacistForm.register('name')} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-primary" />
                    {pharmacistForm.formState.errors.name && <p className="text-xs text-red-500">{pharmacistForm.formState.errors.name.message as string}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">License Number</label>
                      <input {...pharmacistForm.register('licenseNumber')} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">State Council</label>
                      <input {...pharmacistForm.register('stateCouncil')} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-primary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Pharmacy Address</label>
                    <textarea {...pharmacistForm.register('pharmacyAddress')} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-primary" rows={3} />
                  </div>
                  <button disabled={loading} type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20">
                    {loading ? 'Uploading...' : 'Submit for Approval'}
                  </button>
                </form>
              )}

              {role === 'ngo' && (
                <form onSubmit={ngoForm.handleSubmit(onNGOSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Organization Name</label>
                    <input {...ngoForm.register('orgName')} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Registration Number</label>
                    <input {...ngoForm.register('regNumber')} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Address</label>
                    <textarea {...ngoForm.register('address')} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-primary" rows={3} />
                  </div>
                  <button disabled={loading} type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20">
                    {loading ? 'Uploading...' : 'Submit for Approval'}
                  </button>
                </form>
              )}

              {role === 'patient' && (
                <form onSubmit={patientForm.handleSubmit(onPatientSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Full Name</label>
                    <input {...patientForm.register('name')} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-primary" placeholder="Your Name" />
                    {patientForm.formState.errors.name && <p className="text-xs text-red-500">{patientForm.formState.errors.name.message as string}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">City</label>
                    <input {...patientForm.register('city')} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-primary" placeholder="Your City" />
                    {patientForm.formState.errors.city && <p className="text-xs text-red-500">{patientForm.formState.errors.city.message as string}</p>}
                  </div>
                  <button disabled={loading} type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20">
                    {loading ? 'Registering...' : 'Complete Registration'}
                  </button>
                </form>
              )}

              {role === 'rider' && (
                <form onSubmit={riderForm.handleSubmit(onRiderSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Full Name</label>
                    <input {...riderForm.register('name')} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-primary" placeholder="Your Name" />
                    {riderForm.formState.errors.name && <p className="text-xs text-red-500">{riderForm.formState.errors.name.message as string}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Vehicle Number</label>
                    <input {...riderForm.register('vehicleNumber')} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-primary" placeholder="e.g. MH 31 AB 1234" />
                    {riderForm.formState.errors.vehicleNumber && <p className="text-xs text-red-500">{riderForm.formState.errors.vehicleNumber.message as string}</p>}
                  </div>
                  <button disabled={loading} type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20">
                    {loading ? 'Registering...' : 'Complete Registration'}
                  </button>
                </form>
              )}

              {role === 'admin' && (
                <form onSubmit={adminForm.handleSubmit(onAdminSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Admin Name</label>
                    <input {...adminForm.register('name')} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-primary" placeholder="System Admin" />
                  </div>
                  <button disabled={loading} type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20">
                    {loading ? 'Registering...' : 'Create Admin Account'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
