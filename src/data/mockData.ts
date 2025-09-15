import { Tile, Room, Showroom } from '../types';

export const mockTiles: Tile[] = [
  {
    id: '1',
    name: 'Marble Elite White',
    imageUrl: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=300',
    textureUrl: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'both',
    size: '60x60 cm',
    price: 2500,
    inStock: true,
    showroomId: 'showroom1'
  },
  {
    id: '2',
    name: 'Dark Wood Pattern',
    imageUrl: 'https://images.pexels.com/photos/172277/pexels-photo-172277.jpeg?auto=compress&cs=tinysrgb&w=300',
    textureUrl: 'https://images.pexels.com/photos/172277/pexels-photo-172277.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'floor',
    size: '20x120 cm',
    price: 1800,
    inStock: true,
    showroomId: 'showroom1'
  },
  {
    id: '3',
    name: 'Modern Gray Stone',
    imageUrl: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=300',
    textureUrl: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'both',
    size: '30x60 cm',
    price: 2200,
    inStock: true,
    showroomId: 'showroom1'
  },
  {
    id: '4',
    name: 'Ceramic Subway',
    imageUrl: 'https://images.pexels.com/photos/1029615/pexels-photo-1029615.jpeg?auto=compress&cs=tinysrgb&w=300',
    textureUrl: 'https://images.pexels.com/photos/1029615/pexels-photo-1029615.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'wall',
    size: '10x30 cm',
    price: 1200,
    inStock: true,
    showroomId: 'showroom1'
  },
  {
    id: '5',
    name: 'Luxury Black Marble',
    imageUrl: 'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=300',
    textureUrl: 'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'both',
    size: '60x60 cm',
    price: 3200,
    inStock: true,
    showroomId: 'showroom1'
  },
  {
    id: '6',
    name: 'Terracotta Natural',
    imageUrl: 'https://images.pexels.com/photos/1029609/pexels-photo-1029609.jpeg?auto=compress&cs=tinysrgb&w=300',
    textureUrl: 'https://images.pexels.com/photos/1029609/pexels-photo-1029609.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'floor',
    size: '40x40 cm',
    price: 1600,
    inStock: true,
    showroomId: 'showroom1'
  },
  {
    id: '7',
    name: 'White Glossy Ceramic',
    imageUrl: 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=300',
    textureUrl: 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'wall',
    size: '25x40 cm',
    price: 1400,
    inStock: true,
    showroomId: 'showroom1'
  },
  {
    id: '8',
    name: 'Beige Stone Texture',
    imageUrl: 'https://images.pexels.com/photos/1571461/pexels-photo-1571461.jpeg?auto=compress&cs=tinysrgb&w=300',
    textureUrl: 'https://images.pexels.com/photos/1571461/pexels-photo-1571461.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'both',
    size: '30x30 cm',
    price: 1900,
    inStock: true,
    showroomId: 'showroom1'
  },
  {
    id: '9',
    name: 'Blue Mosaic Pattern',
    imageUrl: 'https://images.pexels.com/photos/1571462/pexels-photo-1571462.jpeg?auto=compress&cs=tinysrgb&w=300',
    textureUrl: 'https://images.pexels.com/photos/1571462/pexels-photo-1571462.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'wall',
    size: '30x30 cm',
    price: 2800,
    inStock: true,
    showroomId: 'showroom1'
  },
  {
    id: '10',
    name: 'Wooden Plank Vinyl',
    imageUrl: 'https://images.pexels.com/photos/1571464/pexels-photo-1571464.jpeg?auto=compress&cs=tinysrgb&w=300',
    textureUrl: 'https://images.pexels.com/photos/1571464/pexels-photo-1571464.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'floor',
    size: '15x90 cm',
    price: 2100,
    inStock: true,
    showroomId: 'showroom1'
  },
  {
    id: '11',
    name: 'Granite Black Speckled',
    imageUrl: 'https://images.pexels.com/photos/1571465/pexels-photo-1571465.jpeg?auto=compress&cs=tinysrgb&w=300',
    textureUrl: 'https://images.pexels.com/photos/1571465/pexels-photo-1571465.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'both',
    size: '60x60 cm',
    price: 3500,
    inStock: true,
    showroomId: 'showroom1'
  },
  {
    id: '12',
    name: 'Hexagon White Matte',
    imageUrl: 'https://images.pexels.com/photos/1571466/pexels-photo-1571466.jpeg?auto=compress&cs=tinysrgb&w=300',
    textureUrl: 'https://images.pexels.com/photos/1571466/pexels-photo-1571466.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'wall',
    size: '20x20 cm',
    price: 1700,
    inStock: true,
    showroomId: 'showroom1'
  },
  {
    id: '13',
    name: 'Rustic Brick Red',
    imageUrl: 'https://images.pexels.com/photos/1571467/pexels-photo-1571467.jpeg?auto=compress&cs=tinysrgb&w=300',
    textureUrl: 'https://images.pexels.com/photos/1571467/pexels-photo-1571467.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'wall',
    size: '6x25 cm',
    price: 1300,
    inStock: true,
    showroomId: 'showroom1'
  },
  {
    id: '14',
    name: 'Polished Concrete Gray',
    imageUrl: 'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=300',
    textureUrl: 'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'floor',
    size: '80x80 cm',
    price: 2600,
    inStock: true,
    showroomId: 'showroom1'
  },
  {
    id: '15',
    name: 'Travertine Cream',
    imageUrl: 'https://images.pexels.com/photos/1571469/pexels-photo-1571469.jpeg?auto=compress&cs=tinysrgb&w=300',
    textureUrl: 'https://images.pexels.com/photos/1571469/pexels-photo-1571469.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'both',
    size: '40x60 cm',
    price: 2900,
    inStock: true,
    showroomId: 'showroom1'
  },
  {
    id: '16',
    name: 'Metro Subway White',
    imageUrl: 'https://images.pexels.com/photos/1571470/pexels-photo-1571470.jpeg?auto=compress&cs=tinysrgb&w=300',
    textureUrl: 'https://images.pexels.com/photos/1571470/pexels-photo-1571470.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'wall',
    size: '7.5x15 cm',
    price: 1100,
    inStock: true,
    showroomId: 'showroom1'
  },
  {
    id: '17',
    name: 'Slate Dark Charcoal',
    imageUrl: 'https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg?auto=compress&cs=tinysrgb&w=300',
    textureUrl: 'https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'both',
    size: '30x60 cm',
    price: 3100,
    inStock: true,
    showroomId: 'showroom1'
  },
  {
    id: '18',
    name: 'Marble Carrara White',
    imageUrl: 'https://images.pexels.com/photos/1571472/pexels-photo-1571472.jpeg?auto=compress&cs=tinysrgb&w=300',
    textureUrl: 'https://images.pexels.com/photos/1571472/pexels-photo-1571472.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'both',
    size: '60x120 cm',
    price: 4200,
    inStock: true,
    showroomId: 'showroom1'
  }
];

export const mockRooms: Room[] = [
  {
    id: 'hall',
    name: 'Living Hall',
    type: 'hall',
    description: 'Spacious living room with modern design',
    thumbnail: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    id: 'washroom',
    name: 'Washroom',
    type: 'washroom',
    description: 'Modern bathroom with wall and floor tiling',
    thumbnail: 'https://images.pexels.com/photos/1029615/pexels-photo-1029615.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    type: 'kitchen',
    description: 'Contemporary kitchen with backsplash and flooring',
    thumbnail: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=200'
  }
];

export const mockShowroom: Showroom = {
  id: 'showroom1',
  name: 'Elite Tiles & Ceramics',
  logo: 'https://images.pexels.com/photos/1029615/pexels-photo-1029615.jpeg?auto=compress&cs=tinysrgb&w=100',
  tiles: mockTiles,
  customization: {
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    logoUrl: 'https://images.pexels.com/photos/1029615/pexels-photo-1029615.jpeg?auto=compress&cs=tinysrgb&w=100'
  }
};