import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, ArrowRight } from 'lucide-react';
import { getCurrentDomainConfig, canAccessDomain, redirectToUserDomain, DomainConfig } from '../utils/domainUtils';
import { useAppStore } from '../stores/appStore';

interface DomainGuardProps {
  children: React.ReactNode;
}

export const DomainGuard: React.FC<DomainGuardProps> = ({ children }) => {
  const { currentUser, isAuthenticated } = useAppStore();
  const [domainConfig, setDomainConfig] = useState<DomainConfig | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const config = getCurrentDomainConfig();
    setDomainConfig(config);
    
    const userRole = currentUser?.role || null;
    const canAccess = canAccessDomain(userRole, config);
    setHasAccess(canAccess);
    setLoading(false);
  }, [currentUser]);

  const handleRedirect = () => {
    if (currentUser?.role) {
      redirectToUserDomain(currentUser.role);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
              You don't have permission to access the <strong>{domainConfig.userType}</strong> portal.
            </p>
            
            {isAuthenticated && currentUser ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    You are signed in as: <strong>{currentUser.role}</strong>
                  </p>
                </div>
                
                <button
                  onClick={handleRedirect}
                  className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to {currentUser.role} portal
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Please sign in with appropriate credentials to access this portal.
                </p>
                
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Go to Customer Portal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};