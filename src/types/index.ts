export interface Tile {
  id: string;
  name: string;
  imageUrl: string;
  textureUrl: string;
  category: 'floor' | 'wall' | 'both';
  size: string;
  price: number;
  inStock: boolean;
  showroomId: string;
  qrCode?: string; // Base64 encoded QR code image
  qrCodeUrl?: string; // URL for QR code access
}

export interface Room {
  id: string;
  name: string;
  type: 'hall' | 'washroom' | 'kitchen';
  description: string;
  thumbnail: string;
}

export interface Showroom {
  id: string;
  name: string;
  logo?: string;
  tiles: Tile[];
  customization: {
    primaryColor: string;
    secondaryColor: string;
    logoUrl?: string;
  };
}

export interface TileApplication {
  surface: 'floor' | 'wall';
  tileId: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name?: string;
  role: 'customer' | 'seller' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface TileSeller {
  id: string;
  user_id: string;
  business_name: string;
  business_address?: string;
  phone?: string;
  website?: string;
  logo_url?: string;
  subscription_status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface CustomerFavorite {
  id: string;
  customer_id: string;
  tile_id: string;
  showroom_id: string;
  created_at: string;
}