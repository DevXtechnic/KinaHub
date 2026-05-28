import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: Role[];
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="px-4 py-16 text-center text-secondary">Loading account</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (roles && !roles.includes(user.effective_role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
