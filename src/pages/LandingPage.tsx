import React from 'react';
import { motion } from 'motion/react';
import { 
  VolunteerActivism, 
  HeartIcon, 
  ShieldCheckIcon, 
  PackageIcon, 
  ClipboardCheckIcon, 
  TruckIcon 
} from '@/components/icons';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="z-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                Trusted by 450+ NGO Partners
              </div>
              <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-8">
                Turn Unused <br />
                <span className="text-primary">Medicines</span> <br />
                Into Hope
              </h1>
              <p className="text-lg lg:text-xl text-slate-600 leading-relaxed mb-10 max-w-xl">
                Join the world's most trusted redistribution network. We connect unexpired surplus medicine with verified patients in need. Secure, transparent, and life-saving.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/donate"
                  className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all"
                >
                  <VolunteerActivism className="w-6 h-6" />
                  Donate Medicine
                </Link>
                <button className="flex items-center justify-center gap-2 bg-white text-slate-900 border-2 border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
                  Request Medicine
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <video
              src="/videos/bs.mp4"
               autoPlay
                loop
                 muted
                   playsInline
                     className="aspect-[4/5] object-cover w-full h-full"
             />
               <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
              </div>


              {/* Floating Impact Card */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 lg:-left-12 glass-card p-6 rounded-2xl shadow-xl max-w-xs"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center text-success">
                    <HeartIcon className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-slate-900 leading-none">12,000+</p>
                    <p className="text-sm font-medium text-slate-600">Lives Impacted Daily</p>
                  </div>
                </div>
              </motion.div>

              {/* Verified Badge */}
              <div className="absolute -top-6 -right-6 glass-card px-5 py-3 rounded-full shadow-lg flex items-center gap-2 border-2 border-success/30">
                <ShieldCheckIcon className="w-5 h-5 text-success" />
                <span className="text-sm font-bold text-slate-800">100% Verified Quality</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Medical Waste Saved', value: '$4.2M' },
                { label: 'Units Redistributed', value: '85,000+' },
                { label: 'NGO Partners', value: '450+' },
                { label: 'Pharmacist Support', value: '24/7' },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <span className="text-4xl font-black text-primary mb-1">{stat.value}</span>
                  <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="py-24 lg:py-32 bg-bg-light">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-primary font-bold text-sm tracking-[0.2em] uppercase mb-4">The Process</h2>
              <h3 className="text-4xl lg:text-5xl font-black tracking-tight mb-6">Simple steps to make a huge difference</h3>
              <p className="text-slate-600 text-lg">Our proprietary verification engine ensures every donation is safe and handled by licensed medical professionals.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: '1. List Surplus',
                  desc: 'Simply scan the barcode or enter details of your unexpired medicines through our secure portal.',
                  icon: PackageIcon
                },
                {
                  title: '2. Quality Check',
                  desc: 'Our network of certified pharmacists inspects every donation to meet strict safety and expiration standards.',
                  icon: ClipboardCheckIcon
                },
                {
                  title: '3. Redistribution',
                  desc: 'Verified medicines are matched and shipped to partner NGOs and low-income patients who need them most.',
                  icon: TruckIcon
                }
              ].map((step, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -8 }}
                  className="bg-white p-10 rounded-3xl border border-slate-100 relative group transition-all shadow-sm hover:shadow-xl"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-colors">
                    <step.icon className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4">{step.title}</h4>
                  <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 lg:p-20 overflow-hidden relative text-white text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-transparent"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="text-4xl lg:text-6xl font-black tracking-tight mb-8">Ready to save a life today?</h3>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed">Your surplus medicine could be someone's cure. Join thousands of individual donors and hospitals already making an impact.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/donate" className="bg-white text-slate-900 px-10 py-4 rounded-xl font-black text-lg hover:bg-slate-100 transition-all shadow-2xl">
                  Donate Now
                </Link>
                <button className="bg-primary text-white px-10 py-4 rounded-xl font-black text-lg border-2 border-primary hover:bg-primary/80 transition-all">
                  Partner with Us
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
