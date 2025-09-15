import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../stores/appStore';

// Furniture and fixtures components
const Sofa: React.FC = () => (
  <group position={[0, -1.5, -2]}>
    <mesh position={[0, 0.3, 0]}>
      <boxGeometry args={[3, 0.6, 1]} />
      <meshStandardMaterial color="#4a5568" />
    </mesh>
    <mesh position={[0, 0.8, -0.3]}>
      <boxGeometry args={[3, 0.8, 0.4]} />
      <meshStandardMaterial color="#4a5568" />
    </mesh>
  </group>
);

const CoffeeTable: React.FC = () => (
  <group position={[0, -1.8, 0]}>
    <mesh position={[0, 0.4, 0]}>
      <boxGeometry args={[1.5, 0.1, 0.8]} />
      <meshStandardMaterial color="#8b4513" />
    </mesh>
    <mesh position={[-0.6, 0.2, -0.3]}>
      <boxGeometry args={[0.1, 0.4, 0.1]} />
      <meshStandardMaterial color="#8b4513" />
    </mesh>
    <mesh position={[0.6, 0.2, -0.3]}>
      <boxGeometry args={[0.1, 0.4, 0.1]} />
      <meshStandardMaterial color="#8b4513" />
    </mesh>
    <mesh position={[-0.6, 0.2, 0.3]}>
      <boxGeometry args={[0.1, 0.4, 0.1]} />
      <meshStandardMaterial color="#8b4513" />
    </mesh>
    <mesh position={[0.6, 0.2, 0.3]}>
      <boxGeometry args={[0.1, 0.4, 0.1]} />
      <meshStandardMaterial color="#8b4513" />
    </mesh>
  </group>
);

const Toilet: React.FC = () => (
  <group position={[-2, -2, -2]}>
    <mesh position={[0, 0.4, 0]}>
      <boxGeometry args={[0.6, 0.8, 0.8]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
    <mesh position={[0, 0.9, -0.2]}>
      <boxGeometry args={[0.5, 0.2, 0.4]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
  </group>
);

const Sink: React.FC = () => (
  <group position={[2, -1.2, -2]}>
    <mesh position={[0, 0.5, 0]}>
      <boxGeometry args={[0.8, 0.2, 0.6]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
    <mesh position={[0, 0.3, 0]}>
      <boxGeometry args={[0.9, 0.6, 0.7]} />
      <meshStandardMaterial color="#8b4513" />
    </mesh>
  </group>
);

const KitchenCounter: React.FC = () => (
  <group position={[0, -1.5, -3.5]}>
    <mesh position={[0, 0.5, 0]}>
      <boxGeometry args={[6, 1, 1]} />
      <meshStandardMaterial color="#8b4513" />
    </mesh>
    <mesh position={[0, 1.05, 0]}>
      <boxGeometry args={[6, 0.1, 1]} />
      <meshStandardMaterial color="#2d3748" />
    </mesh>
  </group>
);

const Refrigerator: React.FC = () => (
  <group position={[3, -0.5, -3.5]}>
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 3, 1]} />
      <meshStandardMaterial color="#e2e8f0" />
    </mesh>
  </group>
);

const HallRoom: React.FC<{ floorTileTexture?: string }> = ({ floorTileTexture }) => {
  let floorTexture = null;
  if (floorTileTexture) {
    floorTexture = useLoader(THREE.TextureLoader, floorTileTexture);
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(8, 8);
  }

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial 
          map={floorTexture} 
          color={floorTexture ? 'white' : '#e5e5e5'}
        />
      </mesh>
      
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#f8f8f8" />
      </mesh>
      
      {/* Back Wall */}
      <mesh position={[0, 0, -6]} rotation={[0, 0, 0]}>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      
      {/* Left Wall */}
      <mesh position={[-6, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      
      {/* Right Wall */}
      <mesh position={[6, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      
      {/* Front Wall (with opening for entrance) */}
      <mesh position={[-3, 0, 6]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      <mesh position={[3, 0, 6]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      
      {/* Furniture */}
      <Sofa />
      <CoffeeTable />
    </group>
  );
};

const WashroomScene: React.FC<{ floorTileTexture?: string, wallTileTexture?: string }> = ({ 
  floorTileTexture, 
  wallTileTexture 
}) => {
  let floorTexture = null;
  let wallTexture = null;
  
  if (floorTileTexture) {
    floorTexture = useLoader(THREE.TextureLoader, floorTileTexture);
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(6, 6);
  }
  
  if (wallTileTexture) {
    wallTexture = useLoader(THREE.TextureLoader, wallTileTexture);
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(4, 3);
  }

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial 
          map={floorTexture} 
          color={floorTexture ? 'white' : '#e5e5e5'}
        />
      </mesh>
      
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2.5, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#f8f8f8" />
      </mesh>
      
      {/* Back Wall */}
      <mesh position={[0, 0, -4]} rotation={[0, 0, 0]}>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial 
          map={wallTexture} 
          color={wallTexture ? 'white' : '#f5f5f5'}
        />
      </mesh>
      
      {/* Left Wall */}
      <mesh position={[-4, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial 
          map={wallTexture} 
          color={wallTexture ? 'white' : '#f5f5f5'}
        />
      </mesh>
      
      {/* Right Wall */}
      <mesh position={[4, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial 
          map={wallTexture} 
          color={wallTexture ? 'white' : '#f5f5f5'}
        />
      </mesh>
      
      {/* Front Wall */}
      <mesh position={[0, 0, 4]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial 
          map={wallTexture} 
          color={wallTexture ? 'white' : '#f5f5f5'}
        />
      </mesh>
      
      {/* Bathroom fixtures */}
      <Toilet />
      <Sink />
    </group>
  );
};

const KitchenScene: React.FC<{ floorTileTexture?: string, wallTileTexture?: string }> = ({ 
  floorTileTexture, 
  wallTileTexture 
}) => {
  let floorTexture = null;
  let wallTexture = null;
  
  if (floorTileTexture) {
    floorTexture = useLoader(THREE.TextureLoader, floorTileTexture);
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(8, 8);
  }
  
  if (wallTileTexture) {
    wallTexture = useLoader(THREE.TextureLoader, wallTileTexture);
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(6, 3);
  }
  
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial 
          map={floorTexture} 
          color={floorTexture ? 'white' : '#e5e5e5'}
        />
      </mesh>
      
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2.5, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#f8f8f8" />
      </mesh>
      
      {/* Back Wall (with backsplash area) */}
      <mesh position={[0, 0, -5]} rotation={[0, 0, 0]}>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial 
          map={wallTexture} 
          color={wallTexture ? 'white' : '#f5f5f5'}
        />
      </mesh>
      
      {/* Left Wall */}
      <mesh position={[-5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial 
          map={wallTexture} 
          color={wallTexture ? 'white' : '#f5f5f5'}
        />
      </mesh>
      
      {/* Right Wall */}
      <mesh position={[5, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial 
          map={wallTexture} 
          color={wallTexture ? 'white' : '#f5f5f5'}
        />
      </mesh>
      
      {/* Front Wall */}
      <mesh position={[0, 0, 5]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial 
          map={wallTexture} 
          color={wallTexture ? 'white' : '#f5f5f5'}
        />
      </mesh>
      
      {/* Kitchen fixtures */}
      <KitchenCounter />
      <Refrigerator />
    </group>
  );
};

export const Room3D: React.FC = () => {
  const { selectedRoom, appliedTiles, currentShowroom } = useAppStore();
  const [roomKey, setRoomKey] = useState('');

  // Reset the room when selectedRoom changes
  React.useEffect(() => {
    if (selectedRoom) {
      setRoomKey(`${selectedRoom.id}-${Date.now()}`);
    }
  }, [selectedRoom]);

  if (!selectedRoom) {
    return (
      <div className="bg-gray-100 rounded-xl flex items-center justify-center h-96">
        <p className="text-gray-500 text-lg">Select a room to view 3D preview</p>
      </div>
    );
  }

  const getTexture = (surface: string) => {
    const tileId = appliedTiles[surface];
    if (!tileId || !currentShowroom) return undefined;
    
    const tile = currentShowroom.tiles.find(t => t.id === tileId);
    return tile?.textureUrl;
  };

  const renderRoom = () => {
    switch (selectedRoom.type) {
      case 'hall':
        return <HallRoom floorTileTexture={getTexture('floor')} />;
      case 'washroom':
        return (
          <WashroomScene 
            floorTileTexture={getTexture('floor')} 
            wallTileTexture={getTexture('wall')} 
          />
        );
      case 'kitchen':
        return (
          <KitchenScene 
            floorTileTexture={getTexture('floor')} 
            wallTileTexture={getTexture('wall')} 
          />
        );
      default:
        return <HallRoom floorTileTexture={getTexture('floor')} />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="h-[500px] relative">
        <Canvas key={roomKey} camera={{ position: [0, 0, 0], fov: 75 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.6} />
          <directionalLight position={[-5, 5, -5]} intensity={0.4} />
          <pointLight position={[0, 2, 0]} intensity={0.3} />
          
          {renderRoom()}
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI * 0.8}
            minPolarAngle={Math.PI * 0.2}
            minDistance={0.5}
            maxDistance={8}
            target={[0, 0, 0]}
          />
          <Environment preset="apartment" />
        </Canvas>
        
        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg">
          <p className="font-semibold">{selectedRoom.name}</p>
          <p className="text-sm opacity-90">360° View • Drag to look around • Scroll to zoom</p>
        </div>
        
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
          <p>Applied Tiles:</p>
          <p>Floor: {appliedTiles.floor ? 'Applied' : 'None'}</p>
          {selectedRoom.type !== 'hall' && (
            <p>Wall: {appliedTiles.wall ? 'Applied' : 'None'}</p>
          )}
        </div>
      </div>
    </div>
  );
};