import React from 'react';
import { motion } from 'motion/react';
import { HeartIcon, MedicalServices, ShieldCheckIcon } from '@/components/icons';

export function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-bg-light flex flex-col items-center justify-center z-[100]">
      {/* Large Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-[0.03]">
        <MedicalServices className="w-[400px] h-[400px] text-primary rotate-12" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 flex flex-col items-center gap-12 w-full max-w-md px-6"
      >
        <div className="flex flex-col items-center gap-6">
          <div className="relative flex items-center justify-center w-24 h-24 bg-white rounded-3xl shadow-xl border border-slate-100">
            <div className="relative">
              <MedicalServices className="w-16 h-16 text-primary" />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                <HeartIcon className="w-6 h-6 text-success fill-current" />
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              MedRelief<span className="text-primary">+</span>
            </h1>
            <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              Digital Healthcare Excellence
            </p>
          </div>
        </div>

        <div className="w-full flex flex-col items-center gap-4">
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="h-full bg-primary rounded-full"
            />
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <MedicalServices className="w-4 h-4" />
            </motion.div>
            <span className="text-sm font-medium tracking-wide">Initializing secure modules...</span>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-12 flex flex-col items-center gap-4 text-center">
        <p className="text-sm font-medium text-slate-500 tracking-wide uppercase">
          Powered by AI for a Healthier India
        </p>
        <div className="flex flex-col items-center gap-1">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
            MNC-Grade Security Enabled
          </p>
          <div className="flex items-center gap-1.5">
            <ShieldCheckIcon className="w-3 h-3 text-success" />
            <span className="text-[10px] text-slate-400 font-mono">v2.4.0.0-PRO</span>
          </div>
        </div>
      </div>
    </div>
  );
}
