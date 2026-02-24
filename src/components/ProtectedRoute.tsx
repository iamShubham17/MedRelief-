import React from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth, UserRole } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const { role: urlRole } = useParams<{ role: string }>();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-sm font-bold text-slate-500 animate-pulse uppercase tracking-widest">Securing Session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If we have a user but no profile yet, we are likely still fetching it
  // or the user needs to register.
  if (!profile) {
    // If they are on the register page, let them be (RegisterPage is not wrapped in ProtectedRoute usually)
    // But if they are trying to access a dashboard, they need a profile.
    if (location.pathname.startsWith('/dashboard')) {
      // Check if they really have no profile by trying one last time or redirecting to register
      return <Navigate to="/register" replace />;
    }
    return <>{children}</>;
  }

  // Security: Ensure the role in the URL matches the user's actual role
  if (urlRole && urlRole !== profile.role) {
    console.warn(`Role mismatch: URL has ${urlRole}, but user is ${profile.role}. Redirecting...`);
    return <Navigate to={`/dashboard/${profile.role}`} replace />;
  }

  // Security: Check against explicitly allowed roles if provided
  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    console.warn(`Access denied: Role ${profile.role} not in allowed list ${allowedRoles}`);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
