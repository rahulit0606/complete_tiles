import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, ArrowRight, User } from 'lucide-react';
import { getCurrentDomainConfig, canAccessDomain, redirectToUserDomain, DomainConfig } from '../utils/domainUtils';
import { useAppStore } from '../stores/appStore';
import { getCurrentUser, supabase } from '../lib/supabase';

interface DomainGuardProps {
  children: React.ReactNode;
}

export const DomainGuard: React.FC<DomainGuardProps> = ({ children }) => {
  const { currentUser, isAuthenticated, setCurrentUser, setIsAuthenticated } = useAppStore();
  const [domainConfig, setDomainConfig] = useState<DomainConfig | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const config = getCurrentDomainConfig();
    setDomainConfig(config);
    
    console.log('Initializing auth for domain:', config.userType);
    
    // Check if Supabase is configured
    if (!supabase) {
      console.log('Supabase not configured, allowing public access');
      setHasAccess(true);
      setLoading(false);
      return;
    }
    
    try {
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        setCurrentUser(null);
        setIsAuthenticated(false);
      } else if (session?.user) {
        console.log('Found session for user:', session.user.id);
        
        // Get user profile
        const userProfile = await getCurrentUser();
        console.log('User profile:', userProfile);
        
        if (userProfile) {
          setCurrentUser(userProfile);
          setIsAuthenticated(true);
          
          // Check access based on user role and domain
          const canAccess = canAccessDomain(userProfile.role, config);
          console.log('Access check result:', { userRole: userProfile.role, domainType: config.userType, canAccess });
          setHasAccess(canAccess);
        } else {
          console.log('No user profile found');
          setCurrentUser(null);
          setIsAuthenticated(false);
          setHasAccess(config.userType === 'customer'); // Allow public access to main site
        }
      } else {
        console.log('No session found');
        setCurrentUser(null);
        setIsAuthenticated(false);
        setHasAccess(config.userType === 'customer'); // Allow public access to main site
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setCurrentUser(null);
      setIsAuthenticated(false);
      setHasAccess(config.userType === 'customer'); // Allow public access to main site
    }
    
    setLoading(false);
  };

  const checkAuthAndDomain = async () => {
    const config = getCurrentDomainConfig();
    setDomainConfig(config);
    
    // Always check authentication status from Supabase
    try {
      const user = await getCurrentUser();
      const { setCurrentUser, setIsAuthenticated } = useAppStore.getState();
    } catch (error) {
      console.error('Error checking auth and domain:', error);
    }
  };

  if (loading) {
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
              You need to sign in with {domainConfig.userType} credentials to access this portal.
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
                onClick={() => {
                  // Show auth modal or redirect to sign in
                  window.location.href = '/?auth=signin';
                }}
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