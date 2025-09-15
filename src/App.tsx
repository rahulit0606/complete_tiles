import React, { useEffect } from 'react';
import { DomainHeader } from './components/DomainHeader';
import { DomainGuard } from './components/DomainGuard';
import { SellerDashboard } from './components/SellerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { PublicShowroom } from './components/PublicShowroom';
import { AuthModal } from './components/Auth/AuthModal';
import { useAppStore } from './stores/appStore';
import { mockShowroom } from './data/mockData';
import { getCurrentUser, getFavorites } from './lib/supabase';
import { getCurrentDomainConfig, applyDomainTheme, redirectToUserDomain } from './utils/domainUtils';
import { parseQRCodeData } from './utils/qrCodeUtils';

function App() {
  const { 
    setCurrentShowroom, 
    currentUser, 
    isAuthenticated,
    setCurrentUser,
    setIsAuthenticated,
    setFavorites,
    setSelectedTile
  } = useAppStore();
  
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  useEffect(() => {
    setCurrentShowroom(mockShowroom);
    handleQRCodeFromURL();
    checkAuthFromURL();
    
    // Apply domain-specific theme
    const domainConfig = getCurrentDomainConfig();
    applyDomainTheme(domainConfig);
  }, [setCurrentShowroom]);

  const checkAuthFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const authParam = urlParams.get('auth');
    
    if (authParam === 'signin') {
      setShowAuthModal(true);
      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  };

  const handleQRCodeFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tileId = urlParams.get('tile');
    const showroomId = urlParams.get('showroom');
    
    if (tileId && showroomId && mockShowroom) {
      // Find the tile in the current showroom
      const tile = mockShowroom.tiles.find(t => t.id === tileId);
      if (tile) {
        setSelectedTile(tile);
        // Clear URL parameters after processing
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }
  };

  const renderMainContent = () => {
    const domainConfig = getCurrentDomainConfig();
    
    // Render based on domain type
    switch (domainConfig.userType) {
      case 'admin':
        return <AdminDashboard />;
      case 'seller':
        return <SellerDashboard />;
      case 'customer':
      default:
        return <PublicShowroom />;
    }
  };

  const renderAuthPrompt = () => {
    const domainConfig = getCurrentDomainConfig();
    
    // Only show auth prompt on public showroom for unauthenticated users
    if (isAuthenticated || domainConfig.userType !== 'customer') {
      return null;
    }
    
    return (
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-800">Tile Showroom 3D - Virtual Experience</h3>
            <p className="text-blue-700 text-sm">Explore our 3D tile visualization. Sellers and admins can sign in for management features.</p>
          </div>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  };

  return (
    <DomainGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <DomainHeader />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderAuthPrompt()}
          {renderMainContent()}
        </main>
        
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    </DomainGuard>
  );
}

export default App;