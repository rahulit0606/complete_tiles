import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllTiles, getFavorites, addToFavorites as addFavorite, removeFromFavorites as removeFavorite } from '../services/supabase';
import { useAuth } from './AuthContext';

interface Tile {
  id: string;
  name: string;
  image_url: string;
  texture_url: string;
  category: 'floor' | 'wall' | 'both';
  size: string;
  price: number;
  in_stock: boolean;
  showroom_id: string;
}

interface Room {
  id: string;
  name: string;
  type: 'hall' | 'washroom' | 'kitchen';
  description: string;
}

interface TileContextType {
  tiles: Tile[];
  selectedTile: Tile | null;
  selectedRoom: Room | null;
  appliedTiles: Record<string, string>;
  favorites: string[];
  loading: boolean;
  setSelectedTile: (tile: Tile | null) => void;
  setSelectedRoom: (room: Room | null) => void;
  applyTileToSurface: (surface: string, tileId: string) => void;
  toggleFavorite: (tileId: string, showroomId: string) => Promise<void>;
  refreshTiles: () => Promise<void>;
}

const TileContext = createContext<TileContextType | undefined>(undefined);

export const useTiles = () => {
  const context = useContext(TileContext);
  if (context === undefined) {
    throw new Error('useTiles must be used within a TileProvider');
  }
  return context;
};

const mockRooms: Room[] = [
  {
    id: 'hall',
    name: 'Living Hall',
    type: 'hall',
    description: 'Spacious living room with modern design',
  },
  {
    id: 'washroom',
    name: 'Washroom',
    type: 'washroom',
    description: 'Modern bathroom with wall and floor tiling',
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    type: 'kitchen',
    description: 'Contemporary kitchen with backsplash and flooring',
  }
];

export const TileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [appliedTiles, setAppliedTiles] = useState<Record<string, string>>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();

  useEffect(() => {
    refreshTiles();
  }, []);

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const refreshTiles = async () => {
    setLoading(true);
    try {
      const tilesData = await getAllTiles();
      setTiles(tilesData);
    } catch (error) {
      console.error('Error loading tiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const favoritesData = await getFavorites();
      setFavorites(favoritesData);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const applyTileToSurface = (surface: string, tileId: string) => {
    setAppliedTiles(prev => ({
      ...prev,
      [surface]: tileId
    }));
  };

  const toggleFavorite = async (tileId: string, showroomId: string) => {
    if (!user) {
      throw new Error('Please sign in to add favorites');
    }

    try {
      if (favorites.includes(tileId)) {
        await removeFavorite(tileId);
        setFavorites(prev => prev.filter(id => id !== tileId));
      } else {
        await addFavorite(tileId, showroomId);
        setFavorites(prev => [...prev, tileId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  };

  const value = {
    tiles,
    selectedTile,
    selectedRoom,
    appliedTiles,
    favorites,
    loading,
    setSelectedTile,
    setSelectedRoom,
    applyTileToSurface,
    toggleFavorite,
    refreshTiles,
  };

  return <TileContext.Provider value={value}>{children}</TileContext.Provider>;
};