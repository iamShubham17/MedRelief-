import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-primary/10">
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/">
          <Logo />
        </Link>
        
        <div className="hidden md:flex items-center gap-10">
          <a href="#how-it-works" className="text-sm font-semibold hover:text-primary transition-colors">How it Works</a>
          <a href="#impact" className="text-sm font-semibold hover:text-primary transition-colors">Impact</a>
          <a href="#partners" className="text-sm font-semibold hover:text-primary transition-colors">Partners</a>
          <a href="#safety" className="text-sm font-semibold hover:text-primary transition-colors">Safety</a>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className="hidden sm:block text-sm font-bold px-6 py-2.5 rounded-lg border-2 border-primary/10 hover:bg-primary/5 transition-all text-primary"
          >
            Login
          </Link>
          <Link 
            to="/donate" 
            className="bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
