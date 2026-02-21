import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  MedicalServices, 
  DashboardIcon, 
  HistoryIcon, 
  UserIcon, 
  SettingsIcon, 
  LogOutIcon,
  BellIcon
} from '@/components/icons';
import { cn } from '@/lib/utils';
import { useAuth, UserRole } from '@/context/AuthContext';
import { auth } from '@/config/firebase';
import { signOut } from 'firebase/auth';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
  userName: string;
}

export function DashboardLayout({ children, role, userName }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const navItems = [
    { label: 'Overview', icon: DashboardIcon, path: `/dashboard/${role}` },
    { label: 'History', icon: HistoryIcon, path: `/dashboard/${role}/history` },
    { label: 'Profile', icon: UserIcon, path: `/dashboard/${role}/profile` },
    { label: 'Settings', icon: SettingsIcon, path: `/dashboard/${role}/settings` },
  ];

  return (
    <div className="min-h-screen bg-bg-light flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg text-white">
              <MedicalServices className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-primary">MedRelief+</span>
          </Link>
        </div>

        <nav className="flex-grow p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                location.pathname === item.path 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-primary"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOutIcon className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900 capitalize">{role} Dashboard</h2>
            <p className="text-xs text-slate-500 font-medium">Welcome back, {userName}</p>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-primary transition-colors">
              <BellIcon className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">{userName}</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 overflow-hidden">
                <img 
                  src={`https://picsum.photos/seed/${userName}/100/100`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
