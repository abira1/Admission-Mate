import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isAdminEmail } from '../utils/adminEmails';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-black border-t-yellow-400 mb-4"></div>
          <p className="text-black font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdminEmail(user.email)) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
