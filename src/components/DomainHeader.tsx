import React from 'react';
import { Building2, User, Store, Shield, Heart, LogOut, Globe } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { signOut } from '../lib/supabase';
import { getCurrentDomainConfig } from '../utils/domainUtils';

export const DomainHeader: React.FC = () => {
  const { currentShowroom, currentUser, isAuthenticated, setCurrentUser, setIsAuthenticated } = useAppStore();
  const domainConfig = getCurrentDomainConfig();

  const handleSignOut = async () => {
    try {
      await signOut();
      setCurrentUser(null);
      setIsAuthenticated(false);
      // Redirect to customer domain after logout
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getDomainIcon = () => {
    switch (domainConfig.userType) {
      case 'admin': return <Shield className="w-8 h-8" style={{ color: domainConfig.theme.primary }} />;
      case 'seller': return <Store className="w-8 h-8" style={{ color: domainConfig.theme.primary }} />;
      default: return <Building2 className="w-8 h-8" style={{ color: domainConfig.theme.primary }} />;
    }
  };

  const getRoleIcon = () => {
    if (!currentUser) return <User className="w-4 h-4" />;
    switch (currentUser.role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'seller': return <Store className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = () => {
    if (!currentUser) return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    switch (currentUser.role) {
      case 'admin': return 'bg-purple-100 text-purple-700';
      case 'seller': return 'bg-green-100 text-green-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const getDomainTitle = () => {
    switch (domainConfig.userType) {
      case 'admin': return 'Admin Panel';
      case 'seller': return 'Seller Dashboard';
      default: return currentShowroom?.name || 'Tile Showroom 3D';
    }
  };

  const getDomainSubtitle = () => {
    switch (domainConfig.userType) {
      case 'admin': return 'Platform Management';
      case 'seller': return 'Manage Your Tiles';
      default: return 'Virtual Tile Visualization';
    }
  };

  return (
    <header className="bg-white shadow-lg border-b" style={{ borderColor: domainConfig.theme.primary + '20' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {getDomainIcon()}
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {getDomainTitle()}
              </h1>
              <p className="text-sm text-gray-600">{getDomainSubtitle()}</p>
            </div>
            
            {/* Domain indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium" 
                 style={{ backgroundColor: domainConfig.theme.primary + '20', color: domainConfig.theme.primary }}>
              <Globe className="w-3 h-3" />
              {domainConfig.userType.toUpperCase()} PORTAL
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getRoleColor()}`}>
                  {getRoleIcon()}
                  <span className="text-sm font-medium capitalize">
                    {currentUser.role}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  {currentUser.full_name || currentUser.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Guest</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};