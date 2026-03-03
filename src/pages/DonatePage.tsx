import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MedicalServices, 
  ShieldCheckIcon, 
  PackageIcon, 
  ClipboardCheckIcon, 
  TruckIcon,
  HeartIcon
} from '@/components/icons';
import { Link } from 'react-router-dom';
import { Camera, Upload, Info, CheckCircle2, AlertCircle, Minus, Plus } from 'lucide-react';
import { Logo } from '@/components/Logo';

export function DonatePage() {
  const [step, setStep] = useState(2);
  const [isProcessing, setIsProcessing] = useState(true);
  const [quantity, setQuantity] = useState(2);

  useEffect(() => {
    const timer = setTimeout(() => setIsProcessing(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-bg-light">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/">
            <Logo size="sm" />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
            <Link to="/donate" className="text-sm font-medium text-primary underline underline-offset-8 decoration-2">Donate</Link>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#">Impact</a>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#">History</a>
          </nav>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-semibold">Sarah Jenkins</p>
              <p className="text-[10px] text-slate-500">Verified Donor</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 overflow-hidden">
              <img 
                src="https://picsum.photos/seed/sarah/100/100" 
                alt="Profile" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Progress Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative max-w-3xl mx-auto">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 -z-10"></div>
            {[
              { id: 1, label: 'Mode' },
              { id: 2, label: 'Scan' },
              { id: 3, label: 'Review' },
              { id: 4, label: 'Complete' }
            ].map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-2 bg-bg-light px-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  s.id < step ? 'bg-primary text-white' : 
                  s.id === step ? 'bg-primary text-white ring-4 ring-primary/20' : 
                  'bg-slate-200 text-slate-500'
                }`}>
                  {s.id}
                </div>
                <span className={`text-xs font-semibold ${s.id <= step ? 'text-primary' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side: Camera Interface */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Scan Medicine Label</h2>
              <p className="text-slate-500 text-sm">Align the front of the medicine packaging within the guide frame for AI recognition.</p>
            </div>
            
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group">
              <img 
                src="https://picsum.photos/seed/medicine-box/800/450" 
                alt="Medicine Box" 
                className="w-full h-full object-cover opacity-70"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-12 border-2 border-dashed border-white/50 rounded-lg flex items-center justify-center">
                <div className="animate-scan absolute w-full h-0.5 bg-primary shadow-[0_0_15px_#571adb]"></div>
                <div className="text-white text-xs font-medium bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                  Focusing...
                </div>
              </div>
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="bg-primary/90 text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-widest">Live OCR</div>
                <div className="bg-emerald-500/90 text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-widest">Optimized</div>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 bg-primary text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/25">
                <Camera className="w-5 h-5" />
                Capture Photo
              </button>
              <button className="px-5 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
                <Upload className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg flex gap-3 border border-blue-100">
              <Info className="w-5 h-5 text-blue-600 shrink-0" />
              <p className="text-xs text-blue-800 leading-relaxed">
                Tip: Make sure the batch number and expiry date are clearly visible. Avoid glare from overhead lighting.
              </p>
            </div>
          </div>

          {/* Right Side: AI Processing */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-lg">OCR Result Review</h3>
              <AnimatePresence mode="wait">
                {isProcessing ? (
                  <motion.div 
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-100"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    <span className="text-[11px] font-bold text-amber-700 uppercase">Processing...</span>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="ready"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span className="text-[11px] font-bold text-emerald-700 uppercase">Ready</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Medicine Name</label>
                  {!isProcessing && (
                    <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> 98% Confidence
                    </span>
                  )}
                </div>
                {isProcessing ? (
                  <div className="h-10 w-full skeleton rounded-lg"></div>
                ) : (
                  <input className="w-full bg-slate-50 border-slate-200 rounded-lg text-sm focus:ring-primary focus:border-primary" type="text" defaultValue="Amoxicillin 500mg" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Expiry Date</label>
                    {!isProcessing && (
                      <span className="text-[10px] font-medium text-amber-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> 74%
                      </span>
                    )}
                  </div>
                  {isProcessing ? (
                    <div className="h-10 w-full skeleton rounded-lg"></div>
                  ) : (
                    <input className="w-full bg-slate-50 border-slate-200 rounded-lg text-sm focus:ring-primary focus:border-primary" type="text" defaultValue="12/2025" />
                  )}
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Batch No.</label>
                    {!isProcessing && (
                      <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> 92%
                      </span>
                    )}
                  </div>
                  {isProcessing ? (
                    <div className="h-10 w-full skeleton rounded-lg"></div>
                  ) : (
                    <input className="w-full bg-slate-50 border-slate-200 rounded-lg text-sm focus:ring-primary focus:border-primary" type="text" defaultValue="AX-99410-L" />
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quantity to Donate</label>
                <div className="flex items-center gap-4">
                  <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-1 hover:text-primary"><Minus className="w-4 h-4" /></button>
                    <input className="w-full border-none bg-transparent text-center text-sm focus:ring-0" type="number" value={quantity} readOnly />
                    <button onClick={() => setQuantity(q => q + 1)} className="p-1 hover:text-primary"><Plus className="w-4 h-4" /></button>
                  </div>
                  <select className="bg-slate-50 border-slate-200 rounded-lg text-sm focus:ring-primary focus:border-primary">
                    <option>Boxes</option>
                    <option>Strips</option>
                    <option>Vials</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-4">Scanning other details...</p>
                <div className="space-y-3">
                  <div className="h-4 w-3/4 skeleton rounded"></div>
                  <div className="h-4 w-1/2 skeleton rounded"></div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-8">
                <button className="text-slate-500 text-sm font-semibold hover:text-slate-800 transition-colors">Discard</button>
                <button className="bg-primary/10 text-primary px-8 py-2.5 rounded-lg font-bold hover:bg-primary/20 transition-all">
                  Confirm & Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t border-slate-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Medicines Recycled', value: '1.2M+' },
            { label: 'Active Donors', value: '84k' },
            { label: 'Nations Reached', value: '45' },
            { label: 'AI Accuracy', value: '99%' }
          ].map((stat, i) => (
            <div key={i} className="text-center md:text-left">
              <p className="text-primary font-bold text-2xl">{stat.value}</p>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
