import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import { Ionicons } from '@expo/vector-icons';
import * as THREE from 'three';
import { useTiles } from '../context/TileContext';

const { width, height } = Dimensions.get('window');

const Room3DScreen = ({ navigation }: any) => {
  const { selectedRoom, appliedTiles, tiles } = useTiles();
  const rendererRef = useRef<Renderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const getAppliedTileTexture = (surface: string) => {
    const tileId = appliedTiles[surface];
    if (!tileId) return null;
    
    const tile = tiles.find(t => t.id === tileId);
    return tile?.texture_url || null;
  };

  const onContextCreate = async (gl: any) => {
    try {
      // Initialize renderer
      const renderer = new Renderer({ gl });
      renderer.setSize(width, height);
      renderer.setClearColor(0xf0f0f0);
      rendererRef.current = renderer;

      // Create scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Create camera
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(0, 2, 5);
      cameraRef.current = camera;

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      // Create room based on selected room type
      await createRoom(scene);

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        gl.endFrameEXP();
      };
      animate();

    } catch (error) {
      console.error('Error initializing 3D scene:', error);
      Alert.alert('3D Error', 'Failed to initialize 3D view');
    }
  };

  const createRoom = async (scene: THREE.Scene) => {
    if (!selectedRoom) return;

    const textureLoader = new THREE.TextureLoader();
    
    // Get textures for applied tiles
    const floorTextureUrl = getAppliedTileTexture('floor');
    const wallTextureUrl = getAppliedTileTexture('wall');

    let floorTexture = null;
    let wallTexture = null;

    // Load textures if available
    if (floorTextureUrl) {
      try {
        floorTexture = await new Promise<THREE.Texture>((resolve, reject) => {
          textureLoader.load(
            floorTextureUrl,
            (texture) => {
              texture.wrapS = THREE.RepeatWrapping;
              texture.wrapT = THREE.RepeatWrapping;
              texture.repeat.set(4, 4);
              resolve(texture);
            },
            undefined,
            reject
          );
        });
      } catch (error) {
        console.warn('Failed to load floor texture:', error);
      }
    }

    if (wallTextureUrl) {
      try {
        wallTexture = await new Promise<THREE.Texture>((resolve, reject) => {
          textureLoader.load(
            wallTextureUrl,
            (texture) => {
              texture.wrapS = THREE.RepeatWrapping;
              texture.wrapT = THREE.RepeatWrapping;
              texture.repeat.set(3, 2);
              resolve(texture);
            },
            undefined,
            reject
          );
        });
      } catch (error) {
        console.warn('Failed to load wall texture:', error);
      }
    }

    // Create room geometry based on type
    switch (selectedRoom.type) {
      case 'hall':
        createHallRoom(scene, floorTexture);
        break;
      case 'washroom':
        createWashroomRoom(scene, floorTexture, wallTexture);
        break;
      case 'kitchen':
        createKitchenRoom(scene, floorTexture, wallTexture);
        break;
    }
  };

  const createHallRoom = (scene: THREE.Scene, floorTexture: THREE.Texture | null) => {
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.MeshLambertMaterial({
      map: floorTexture,
      color: floorTexture ? 0xffffff : 0xe5e5e5
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2;
    scene.add(floor);

    // Walls
    const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xf5f5f5 });
    
    // Back wall
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 4), wallMaterial);
    backWall.position.set(0, 0, -5);
    scene.add(backWall);

    // Side walls
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 4), wallMaterial);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-5, 0, 0);
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 4), wallMaterial);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(5, 0, 0);
    scene.add(rightWall);

    // Add furniture
    addHallFurniture(scene);
  };

  const createWashroomRoom = (scene: THREE.Scene, floorTexture: THREE.Texture | null, wallTexture: THREE.Texture | null) => {
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(6, 6);
    const floorMaterial = new THREE.MeshLambertMaterial({
      map: floorTexture,
      color: floorTexture ? 0xffffff : 0xe5e5e5
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2;
    scene.add(floor);

    // Walls
    const wallMaterial = new THREE.MeshLambertMaterial({
      map: wallTexture,
      color: wallTexture ? 0xffffff : 0xf5f5f5
    });

    const walls = [
      { pos: [0, 0, -3], rot: [0, 0, 0] },
      { pos: [-3, 0, 0], rot: [0, Math.PI / 2, 0] },
      { pos: [3, 0, 0], rot: [0, -Math.PI / 2, 0] },
      { pos: [0, 0, 3], rot: [0, Math.PI, 0] }
    ];

    walls.forEach(({ pos, rot }) => {
      const wall = new THREE.Mesh(new THREE.PlaneGeometry(6, 4), wallMaterial);
      wall.position.set(pos[0], pos[1], pos[2]);
      wall.rotation.set(rot[0], rot[1], rot[2]);
      scene.add(wall);
    });

    // Add bathroom fixtures
    addWashroomFixtures(scene);
  };

  const createKitchenRoom = (scene: THREE.Scene, floorTexture: THREE.Texture | null, wallTexture: THREE.Texture | null) => {
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(8, 8);
    const floorMaterial = new THREE.MeshLambertMaterial({
      map: floorTexture,
      color: floorTexture ? 0xffffff : 0xe5e5e5
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2;
    scene.add(floor);

    // Walls
    const wallMaterial = new THREE.MeshLambertMaterial({
      map: wallTexture,
      color: wallTexture ? 0xffffff : 0xf5f5f5
    });

    const walls = [
      { pos: [0, 0, -4], rot: [0, 0, 0] },
      { pos: [-4, 0, 0], rot: [0, Math.PI / 2, 0] },
      { pos: [4, 0, 0], rot: [0, -Math.PI / 2, 0] },
      { pos: [0, 0, 4], rot: [0, Math.PI, 0] }
    ];

    walls.forEach(({ pos, rot }) => {
      const wall = new THREE.Mesh(new THREE.PlaneGeometry(8, 4), wallMaterial);
      wall.position.set(pos[0], pos[1], pos[2]);
      wall.rotation.set(rot[0], rot[1], rot[2]);
      scene.add(wall);
    });

    // Add kitchen fixtures
    addKitchenFixtures(scene);
  };

  const addHallFurniture = (scene: THREE.Scene) => {
    // Sofa
    const sofaMaterial = new THREE.MeshLambertMaterial({ color: 0x4a5568 });
    const sofa = new THREE.Mesh(new THREE.BoxGeometry(3, 0.6, 1), sofaMaterial);
    sofa.position.set(0, -1.7, -2);
    scene.add(sofa);

    // Coffee table
    const tableMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
    const table = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 0.8), tableMaterial);
    table.position.set(0, -1.5, 0);
    scene.add(table);
  };

  const addWashroomFixtures = (scene: THREE.Scene) => {
    // Toilet
    const toiletMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const toilet = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.8), toiletMaterial);
    toilet.position.set(-1.5, -1.6, -1.5);
    scene.add(toilet);

    // Sink
    const sink = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.6), toiletMaterial);
    sink.position.set(1.5, -1.3, -1.5);
    scene.add(sink);
  };

  const addKitchenFixtures = (scene: THREE.Scene) => {
    // Counter
    const counterMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
    const counter = new THREE.Mesh(new THREE.BoxGeometry(6, 1, 1), counterMaterial);
    counter.position.set(0, -1.5, -3);
    scene.add(counter);

    // Refrigerator
    const fridgeMaterial = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });
    const fridge = new THREE.Mesh(new THREE.BoxGeometry(1, 3, 1), fridgeMaterial);
    fridge.position.set(2.5, -0.5, -3);
    scene.add(fridge);
  };

  if (!selectedRoom) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="cube-outline" size={64} color="#9ca3af" />
          <Text style={styles.emptyTitle}>No Room Selected</Text>
          <Text style={styles.emptyText}>
            Please select a room and apply tiles to view in 3D
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GLView
        style={styles.glView}
        onContextCreate={onContextCreate}
      />
      
      {/* Info Overlay */}
      <View style={styles.infoOverlay}>
        <Text style={styles.roomName}>{selectedRoom.name}</Text>
        <Text style={styles.roomInfo}>3D View • Pinch to zoom • Drag to rotate</Text>
      </View>

      {/* Applied Tiles Info */}
      <View style={styles.tilesOverlay}>
        <Text style={styles.tilesTitle}>Applied Tiles:</Text>
        <Text style={styles.tilesInfo}>
          Floor: {appliedTiles.floor ? 'Applied' : 'None'}
        </Text>
        {selectedRoom.type !== 'hall' && (
          <Text style={styles.tilesInfo}>
            Wall: {appliedTiles.wall ? 'Applied' : 'None'}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  glView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoOverlay: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  roomName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  roomInfo: {
    color: '#d1d5db',
    fontSize: 12,
  },
  tilesOverlay: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  tilesTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  tilesInfo: {
    color: '#d1d5db',
    fontSize: 12,
  },
});

export default Room3DScreen;