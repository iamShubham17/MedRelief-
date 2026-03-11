import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  GoogleAuthProvider, 
  signInWithPopup,
  ConfirmationResult
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { dbService } from '@/services/dbService';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import splashAnimation from '@/assets/animations/Appointment booking with smartphone.json';
import loginBg from '@/assets/images/enchanted-forest-fantasy-background.jpg'; // 👈 change filename to match yours
import { MedicalServices, ShieldCheckIcon } from '@/components/icons';
import { Logo } from '@/components/Logo';

export function LoginPage() {
  const { refreshProfile } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  }, []);

  const handleSendOtp = async () => {
    setError('');
    setLoading(true);
    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const appVerifier = (window as any).recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(result);
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    setLoading(true);
    try {
      if (!confirmationResult) throw new Error('No confirmation result');
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      
      // Check if user exists in MongoDB
      const userProfile = await dbService.getUserProfile(user.uid);
      if (userProfile) {
        await refreshProfile();
        navigate(`/dashboard/${userProfile.role}`);
      } else {
        navigate('/register');
      }
    } catch (err: any) {
      setError('Invalid OTP');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userProfile = await dbService.getUserProfile(user.uid);
      if (userProfile) {
        await refreshProfile();
        navigate(`/dashboard/${userProfile.role}`);
      } else {
        navigate('/register');
      }
    } catch (err: any) {
      setError('Google Sign-In failed');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ position: 'relative' }}>
      {/* ── Background Layer ── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          backgroundImage: `url(${loginBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Overlay: soft dark-blue tint so white UI stays readable */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          background:
            'linear-gradient(135deg, rgba(10,30,60,0.72) 0%, rgba(0,80,120,0.55) 60%, rgba(0,160,180,0.30) 100%)',
        }}
      />

      {/* ── All page content sits above the bg ── */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div id="recaptcha-container"></div>

        {/* Header */}
        <header className="w-full border-b border-white/10 px-6 py-4 fixed top-0 z-50"
          style={{ background: 'rgba(21, 134, 10, 0.08)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Logo size="sm" />
            <button 
              onClick={() => navigate('/register')}
              className="px-6 py-2 rounded-xl font-bold text-sm transition-all"
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.25)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
            >
              Register
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-4">
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Side: Animation */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:flex flex-col items-center justify-center text-center space-y-8"
            >
              <div className="w-full max-w-2xl">
                <Lottie animationData={splashAnimation} loop={true} />
              </div>
              <div>
                <h2 className="text-4xl font-black mb-4 tracking-tight" style={{ color: '#fff', textShadow: '0 2px 16px rgba(0,0,0,0.3)' }}>
                  Your Health, <span style={{ color: '#38bdf8' }}>Our Mission</span>
                </h2>
                <p className="font-medium max-w-sm mx-auto text-lg" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  Join our community of donors and healthcare professionals to make medicine accessible for everyone.
                </p>
              </div>
            </motion.div>

            {/* Right Side: Login Form */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md mx-auto"
            >
              <div
                className="rounded-3xl overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255,255,255,0.6)',
                  boxShadow: '0 25px 60px rgba(0,30,80,0.25), 0 8px 24px rgba(0,0,0,0.12)',
                }}
              >
                <div className="p-10">
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome back</h2>
                  <p className="text-slate-500 font-medium text-sm mb-10">Login to your secure healthcare dashboard</p>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl font-bold text-center">
                      {error}
                    </div>
                  )}

                  {step === 'phone' ? (
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Mobile Number</label>
                        <div className="flex items-center border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary transition-all">
                          <div className="flex items-center gap-2 px-4 py-4 bg-slate-50 border-r border-slate-200">
                            <span className="text-sm font-bold text-slate-700">+91</span>
                          </div>
                          <input 
                            className="flex-1 px-5 py-4 bg-transparent border-none focus:ring-0 text-slate-900 font-bold placeholder:text-slate-300" 
                            maxLength={10} 
                            placeholder="Enter 10-digit number" 
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                        </div>
                      </div>
                      <button 
                        disabled={loading || phoneNumber.length !== 10}
                        onClick={handleSendOtp}
                        className="w-full bg-primary text-white py-4.5 rounded-2xl font-black text-sm shadow-xl shadow-primary/25 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50"
                      >
                        {loading ? 'Sending...' : 'Get OTP'}
                      </button>
                      
                      <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="bg-white px-4 text-slate-400">Or continue with</span></div>
                      </div>

                      <button 
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center gap-3 border border-slate-200 py-4.5 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all"
                      >
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                        Google Account
                      </button>

                      <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mt-4">
                        New to MedRelief+? <button onClick={() => navigate('/register')} className="text-primary hover:underline">Create an account</button>
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Enter OTP</label>
                        <input 
                          className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-center tracking-[0.5em] text-2xl font-black text-slate-900 placeholder:text-slate-200" 
                          maxLength={6} 
                          placeholder="000000" 
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                        />
                      </div>
                      <button 
                        disabled={loading || otp.length !== 6}
                        onClick={handleVerifyOtp}
                        className="w-full bg-primary text-white py-4.5 rounded-2xl font-black text-sm shadow-xl shadow-primary/25 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50"
                      >
                        {loading ? 'Verifying...' : 'Verify & Login'}
                      </button>
                      <button 
                        onClick={() => setStep('phone')}
                        className="w-full text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
                      >
                        Change Phone Number
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-10 flex items-center justify-center gap-8" style={{ opacity: 0.7 }}>
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="w-4 h-4" style={{ color: '#fff' }} />
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#fff' }}>Secured by Firebase</span>
                </div>
              </div>
            </motion.div>

          </div>
        </main>
      </div>
    </div>
  );
}