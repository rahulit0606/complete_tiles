import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, ArrowRight, User } from 'lucide-react';
import { getCurrentDomainConfig, canAccessDomain, redirectToUserDomain, DomainConfig } from '../utils/domainUtils';
import { useAppStore } from '../stores/appStore';
import { getCurrentUser } from '../lib/supabase';

interface DomainGuardProps {
  children: React.ReactNode;
}

export const DomainGuard: React.FC<DomainGuardProps> = ({ children }) => {
  const { currentUser, isAuthenticated } = useAppStore();
  const [domainConfig, setDomainConfig] = useState<DomainConfig | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAuthAndDomain();
  }, []);

  useEffect(() => {
    if (authChecked) {
      updateAccess();
    }
  }, [currentUser, authChecked]);

  const checkAuthAndDomain = async () => {
    const config = getCurrentDomainConfig();
    setDomainConfig(config);
    
    // Always check authentication status from Supabase
    try {
      const user = await getCurrentUser();
      const { setCurrentUser, setIsAuthenticated } = useAppStore.getState();
      
      if (user) {
        console.log('User found:', user);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } else {
        console.log('No authenticated user found');
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      const { setCurrentUser, setIsAuthenticated } = useAppStore.getState();
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
    
    setAuthChecked(true);
  };

  const updateAccess = () => {
    if (!domainConfig) return;
    
    console.log('Checking access:', { 
      userRole: currentUser?.role, 
      domainType: domainConfig.userType,
      isAuthenticated 
    });
    
    const userRole = currentUser?.role || null;
    const canAccess = canAccessDomain(userRole, domainConfig);
    
    console.log('Access result:', canAccess);
    setHasAccess(canAccess);
    setLoading(false);
  };

  const handleRedirect = () => {
    if (currentUser?.role) {
      redirectToUserDomain(currentUser.role);
    } else {
      // If no user, allow access to customer portal
      setHasAccess(true);
    }
  };

  if (loading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess && domainConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Restricted</h2>
            <p className="text-gray-600 mb-6">
              You need to sign in to access the <strong>{domainConfig.userType}</strong> portal.
            </p>
            
            <div className="space-y-4">
              {isAuthenticated && currentUser ? (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    You are signed in as: <strong>{currentUser.role}</strong>
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Required role: <strong>{domainConfig.userType}</strong>
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <p className="text-sm text-gray-700 font-medium">Authentication Required</p>
                  </div>
                  <p className="text-xs text-gray-600">
                    Please sign in with {domainConfig.userType} credentials to access this portal.
                  </p>
                </div>
              )}
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                Sign In
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Go to Public Showroom
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};