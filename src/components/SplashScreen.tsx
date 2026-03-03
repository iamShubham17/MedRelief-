import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheckIcon } from '@/components/icons';
import { Logo } from '@/components/Logo';

export function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-10 w-full max-w-md px-6"
      >
        <Logo size="lg" variant="vertical" showSubtitle />

        <div className="w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]"
          />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-12 flex flex-col items-center gap-3"
      >
        <div className="flex items-center gap-2.5 px-5 py-2.5 bg-slate-50 rounded-full border border-slate-100 shadow-sm">
          <ShieldCheckIcon className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            MNC-Grade Security Enabled
          </span>
        </div>
      </motion.div>
    </div>
  );
}
