import React from 'react';
import { Building2, User, Store, Shield, Heart, LogOut } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { signOut } from '../lib/supabase';

export const Header: React.FC = () => {
  const { currentShowroom, currentUser, isAuthenticated, setCurrentUser, setIsAuthenticated } = useAppStore();

  const handleSignOut = async () => {
    try {
      await signOut();
      setCurrentUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
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

  return (
    <header className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Building2 className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {currentShowroom?.name || 'Tile Showroom 3D'}
              </h1>
              <p className="text-sm text-gray-600">Virtual Tile Visualization</p>
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