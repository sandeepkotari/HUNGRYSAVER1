import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { currentUser, userData, isAdmin } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Admin-only route protection
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Admin bypass - admins can access any route
  if (isAdmin) {
    return <>{children}</>;
  }

  // Redirect volunteers based on their status
  if (userData?.userType === 'volunteer') {
    const currentPath = window.location.pathname;
    
    if (userData.status === 'pending' && !currentPath.includes('/pending-approval')) {
      return <Navigate to="/pending-approval" replace />;
    }
    
    if (userData.status === 'approved' && userData.location && 
        currentPath.includes('/pending-approval')) {
      return <Navigate to={`/dashboard/${userData.location}`} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;