import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth, UserRole } from '@/context/AuthContext';
import { ConstructionIcon } from '@/components/icons';
import { useParams } from 'react-router-dom';

interface PlaceholderPageProps {
  role?: UserRole;
  title: string;
}

export function PlaceholderPage({ role: propsRole, title }: PlaceholderPageProps) {
  const { profile } = useAuth();
  const { role: urlRole } = useParams<{ role: string }>();
  
  // Priority: props > URL param > profile role > fallback
  const role = (propsRole || urlRole || profile?.role || 'donor') as UserRole;
  const userName = profile?.name || 'User';

  return (
    <DashboardLayout role={role} userName={userName}>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
          <ConstructionIcon className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
        <p className="text-slate-500 max-w-md">
          We're working hard to bring you the {title.toLowerCase()} features. Stay tuned for updates!
        </p>
      </div>
    </DashboardLayout>
  );
}
