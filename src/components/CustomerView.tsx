import React from 'react';
import { Heart, HeartOff } from 'lucide-react';
import { RoomSelector } from './RoomSelector';
import { TileCatalog } from './TileCatalog';
import { Room3D } from './Room3D';
import { TileApplication } from './TileApplication';
import { MobileAppInfo } from './MobileAppInfo';
import { useAppStore } from '../stores/appStore';
import { mockRooms } from '../data/mockData';
import { addToFavorites, removeFromFavorites } from '../lib/supabase';

export const CustomerView: React.FC = () => {
  const { 
    currentShowroom, 
    selectedRoom, 
    favorites, 
    addToFavorites: addToFavoritesStore, 
    removeFromFavorites: removeFromFavoritesStore,
    isAuthenticated 
  } = useAppStore();

  const [showFavorites, setShowFavorites] = React.useState(false);

  const handleToggleFavorite = async (tileId: string) => {
    if (!isAuthenticated) {
      alert('Please sign in to add favorites');
      return;
    }

    try {
      if (favorites.includes(tileId)) {
        await removeFromFavorites(tileId);
        removeFromFavoritesStore(tileId);
      } else {
        await addToFavorites(tileId, currentShowroom?.id || '');
        addToFavoritesStore(tileId);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const filteredTiles = showFavorites 
    ? currentShowroom?.tiles.filter(tile => favorites.includes(tile.id)) || []
    : currentShowroom?.tiles || [];

  return (
    <div className="space-y-8">
      <MobileAppInfo />
      <RoomSelector rooms={mockRooms} />
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          {showFavorites ? 'My Favorite Tiles' : 'Tile Catalog'}
        </h2>
        {isAuthenticated && (
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showFavorites 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            {showFavorites ? <HeartOff className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
            {showFavorites ? 'Show All Tiles' : `My Favorites (${favorites.length})`}
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TileCatalog 
            tiles={filteredTiles} 
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites}
            showFavoriteButton={isAuthenticated}
          />
        </div>
        
        <div className="space-y-6">
          <TileApplication />
          {selectedRoom && <Room3D />}
        </div>
      </div>
    </div>
  );
};