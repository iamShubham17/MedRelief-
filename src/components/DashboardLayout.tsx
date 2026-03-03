import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  DashboardIcon, 
  HistoryIcon, 
  UserIcon, 
  SettingsIcon, 
  LogOutIcon,
  BellIcon,
  PlusCircleIcon,
  AlertCircleIcon,
  ActivityIcon,
  ClockIcon,
  SearchIcon
} from '@/components/icons';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { auth } from '@/config/firebase';
import { signOut } from 'firebase/auth';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
  userName: string;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  actions?: React.ReactNode;
}

export function DashboardLayout({ children, role, userName, searchQuery, setSearchQuery, actions }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', icon: DashboardIcon, path: `/dashboard/${role}` },
    { label: 'History', icon: HistoryIcon, path: `/dashboard/${role}/history` },
    { label: 'Account', icon: UserIcon, path: `/dashboard/${role}/profile` },
    { label: 'Settings', icon: SettingsIcon, path: `/dashboard/${role}/settings` },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex font-sans text-[#1a1d1f]">
      {/* Sidebar - Icons + Labels */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col py-8 sticky top-0 h-screen z-50">
        <div className="px-8 mb-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
            <PlusCircleIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">MedRelief+</span>
        </div>

        <nav className="flex-grow px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all group",
                location.pathname === item.path
                  ? "bg-[#4f46e5] text-white shadow-lg shadow-indigo-100"
                  : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                location.pathname === item.path ? "text-white" : "text-slate-400 group-hover:text-slate-900"
              )} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-4 mt-auto space-y-1">
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all group">
            <AlertCircleIcon className="w-5 h-5 group-hover:text-slate-900" />
            Help
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all group"
          >
            <LogOutIcon className="w-5 h-5 group-hover:text-red-500" />
            Log out
          </button>
          
          <div className="pt-6 px-4 flex items-center gap-4">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-full">
              <button className="p-2 rounded-full bg-white shadow-sm text-slate-900">
                <ActivityIcon className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-full text-slate-400">
                <ClockIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col">
        <main className="flex-grow flex flex-col p-8 max-w-[1600px] mx-auto w-full overflow-y-auto custom-scrollbar">
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[10px] font-black text-[#4f46e5] uppercase tracking-[0.2em] mb-1">{role} dashboard</p>
              <h1 className="text-3xl font-black text-slate-900">Welcome back, {userName.split(' ')[0]}!</h1>
              <p className="text-slate-400 font-bold text-xs mt-1">It is the best time to manage your {role} tasks</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                {setSearchQuery && (
                  <div className="relative group">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#4f46e5] transition-colors" />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-100 transition-all w-64"
                    />
                  </div>
                )}
                <div className="relative">
                  <button 
                    onClick={() => {
                      const notifications = [
                        "New medicine donation pending verification",
                        "Urgent request for Paracetamol from NGO",
                        "System update scheduled for tonight"
                      ];
                      alert("Notifications:\n" + notifications.join("\n"));
                    }}
                    className="p-2.5 text-slate-400 hover:text-slate-900 transition-all relative group"
                  >
                    <BellIcon className="w-5 h-5" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    
                    {/* Tooltip */}
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white p-2 rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest p-2 border-b border-slate-50">Recent Alerts</p>
                      <div className="py-2 space-y-1">
                        <div className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                          <p className="text-[10px] font-bold text-slate-600">New donation pending</p>
                        </div>
                        <div className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                          <p className="text-[10px] font-bold text-slate-600">Urgent NGO request</p>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">{userName}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{role}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden">
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

          {/* Action Bar (Optional) */}
          {actions && (
            <div className="flex items-center justify-between mb-8">
              {actions}
            </div>
          )}

          {/* Page Content */}
          <div className="space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

