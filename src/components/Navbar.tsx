import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const auth = useAuth();
  const user = auth?.user;
  const profile = auth?.profile;

  const getDashboardPath = () => {
    if (!profile) return '/login';
    return `/dashboard/${profile.role}`;
  };

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
          {!user ? (
            <>
              <Link 
                to="/login" 
                className="hidden sm:block text-sm font-bold px-6 py-2.5 rounded-lg border-2 border-primary/10 hover:bg-primary/5 transition-all text-primary"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
              >
                Get Started
              </Link>
            </>
          ) : (
            <Link 
              to={getDashboardPath()}
              className="bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
            >
              Dashboard
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
