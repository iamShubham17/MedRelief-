import React from 'react';
import { Public, Share2, Mail } from '@/components/icons';
import { Logo } from '@/components/Logo';

export function Footer() {
  return (
    <footer className="bg-white pt-24 pb-12 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
            <Logo className="mb-6" />
            <p className="text-slate-500 leading-relaxed mb-6">
              Building a zero-waste healthcare future by connecting surplus supplies to critical needs.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Public className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h5 className="text-lg font-bold mb-6">Platform</h5>
            <ul className="space-y-4 text-slate-500">
              <li><a className="hover:text-primary transition-colors" href="#">How it works</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Donate Medicine</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Request Medicine</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Trust & Safety</a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-lg font-bold mb-6">Impact</h5>
            <ul className="space-y-4 text-slate-500">
              <li><a className="hover:text-primary transition-colors" href="#">Success Stories</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">NGO Partners</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Waste Reduction</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Annual Report</a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-lg font-bold mb-6">Contact Us</h5>
            <p className="text-slate-500 mb-4 leading-relaxed">
              1200 Healthcare Way, Suite 400<br />San Francisco, CA 94103
            </p>
            <p className="text-primary font-bold">support@medreliefplus.com</p>
            <p className="text-slate-900 font-bold mt-2">1-800-RELIEF-P</p>
          </div>
        </div>
        
        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-400">© 2024 MedRelief+ Global. All rights reserved.</p>
          <div className="flex gap-8 text-sm text-slate-400">
            <a className="hover:text-slate-900 transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-slate-900 transition-colors" href="#">Terms of Service</a>
            <a className="hover:text-slate-900 transition-colors" href="#">Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
