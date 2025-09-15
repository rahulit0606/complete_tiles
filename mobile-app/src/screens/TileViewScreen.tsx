import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTiles } from '../context/TileContext';
import { useAuth } from '../context/AuthContext';
import { trackTileApplication } from '../services/supabase';

const { width } = Dimensions.get('window');

const TileViewScreen = ({ route, navigation }: any) => {
  const { tile, fromQR } = route.params;
  const { user } = useAuth();
  const { 
    selectedRoom, 
    setSelectedRoom, 
    appliedTiles, 
    applyTileToSurface, 
    favorites, 
    toggleFavorite 
  } = useTiles();
  
  const [selectedRoomLocal, setSelectedRoomLocal] = useState(selectedRoom);

  const rooms = [
    {
      id: 'hall',
      name: 'Living Hall',
      type: 'hall',
      description: 'Spacious living room with modern design',
      surfaces: ['floor']
    },
    {
      id: 'washroom',
      name: 'Washroom',
      type: 'washroom',
      description: 'Modern bathroom with wall and floor tiling',
      surfaces: ['floor', 'wall']
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      type: 'kitchen',
      description: 'Contemporary kitchen with backsplash and flooring',
      surfaces: ['floor', 'wall']
    }
  ];

  const handleRoomSelect = (room: any) => {
    setSelectedRoomLocal(room);
    setSelectedRoom(room);
  };

  const handleApplyTile = async (surface: string) => {
    if (!selectedRoomLocal) {
      Alert.alert('Select Room', 'Please select a room first');
      return;
    }

    if (!canApplyToSurface(surface)) {
      Alert.alert(
        'Incompatible Surface',
        `This tile cannot be applied to ${surface}. It's designed for ${tile.category} use.`
      );
      return;
    }

    applyTileToSurface(surface, tile.id);
    await trackTileApplication(tile.id, tile.showroom_id, surface, selectedRoomLocal.type);
    
    Alert.alert(
      'Tile Applied!',
      `${tile.name} has been applied to the ${surface} in ${selectedRoomLocal.name}`,
      [
        { text: 'View in 3D', onPress: () => navigation.navigate('Room3D') },
        { text: 'OK' }
      ]
    );
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to add favorites');
      return;
    }

    try {
      await toggleFavorite(tile.id, tile.showroom_id);
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  const canApplyToSurface = (surface: string) => {
    if (surface === 'floor') {
      return tile.category === 'floor' || tile.category === 'both';
    }
    if (surface === 'wall') {
      return tile.category === 'wall' || tile.category === 'both';
    }
    return false;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'floor': return '#dbeafe';
      case 'wall': return '#f3e8ff';
      default: return '#f3f4f6';
    }
  };

  const getSurfaceIcon = (surface: string) => {
    return surface === 'floor' ? 'square-outline' : 'grid-outline';
  };

  return (
    <ScrollView style={styles.container}>
      {/* QR Scan Success Banner */}
      {fromQR && (
        <View style={styles.qrBanner}>
          <Ionicons name="checkmark-circle" size={20} color="#059669" />
          <Text style={styles.qrBannerText}>QR Code scanned successfully!</Text>
        </View>
      )}

      {/* Tile Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: tile.image_url }} style={styles.tileImage} />
        {user && (
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavoriteToggle}
          >
            <Ionicons
              name={favorites.includes(tile.id) ? 'heart' : 'heart-outline'}
              size={24}
              color={favorites.includes(tile.id) ? '#ef4444' : '#6b7280'}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Tile Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.tileName}>{tile.name}</Text>
        <Text style={styles.tileSize}>{tile.size}</Text>
        
        <View style={styles.detailsRow}>
          <Text style={styles.tilePrice}>₹{tile.price}</Text>
          <View style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryColor(tile.category) }
          ]}>
            <Text style={styles.categoryText}>
              {tile.category === 'both' ? 'Floor & Wall' : 
               tile.category === 'floor' ? 'Floor Only' : 'Wall Only'}
            </Text>
          </View>
        </View>

        <View style={styles.stockContainer}>
          <Ionicons 
            name={tile.in_stock ? 'checkmark-circle' : 'close-circle'} 
            size={16} 
            color={tile.in_stock ? '#059669' : '#dc2626'} 
          />
          <Text style={[
            styles.stockText,
            { color: tile.in_stock ? '#059669' : '#dc2626' }
          ]}>
            {tile.in_stock ? 'In Stock' : 'Out of Stock'}
          </Text>
        </View>
      </View>

      {/* Room Selection */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Select Room Type</Text>
        <View style={styles.roomsContainer}>
          {rooms.map((room) => (
            <TouchableOpacity
              key={room.id}
              style={[
                styles.roomCard,
                selectedRoomLocal?.id === room.id && styles.roomCardSelected
              ]}
              onPress={() => handleRoomSelect(room)}
            >
              <Text style={[
                styles.roomName,
                selectedRoomLocal?.id === room.id && styles.roomNameSelected
              ]}>
                {room.name}
              </Text>
              <Text style={[
                styles.roomDescription,
                selectedRoomLocal?.id === room.id && styles.roomDescriptionSelected
              ]}>
                {room.description}
              </Text>
              {selectedRoomLocal?.id === room.id && (
                <Ionicons name="checkmark-circle" size={20} color="#2563eb" style={styles.roomCheckmark} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Surface Application */}
      {selectedRoomLocal && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Apply to Surface</Text>
          <View style={styles.surfacesContainer}>
            {selectedRoomLocal.surfaces.map((surface: string) => {
              const canApply = canApplyToSurface(surface);
              const isApplied = appliedTiles[surface] === tile.id;
              
              return (
                <TouchableOpacity
                  key={surface}
                  style={[
                    styles.surfaceCard,
                    !canApply && styles.surfaceCardDisabled,
                    isApplied && styles.surfaceCardApplied
                  ]}
                  onPress={() => canApply && handleApplyTile(surface)}
                  disabled={!canApply}
                >
                  <Ionicons 
                    name={getSurfaceIcon(surface)} 
                    size={24} 
                    color={!canApply ? '#9ca3af' : isApplied ? '#059669' : '#2563eb'} 
                  />
                  <Text style={[
                    styles.surfaceName,
                    !canApply && styles.surfaceNameDisabled,
                    isApplied && styles.surfaceNameApplied
                  ]}>
                    {surface.charAt(0).toUpperCase() + surface.slice(1)}
                  </Text>
                  {isApplied && (
                    <Ionicons name="checkmark-circle" size={16} color="#059669" />
                  )}
                  {!canApply && (
                    <Text style={styles.incompatibleText}>Not compatible</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* 3D View Button */}
      {selectedRoomLocal && Object.keys(appliedTiles).length > 0 && (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.view3DButton}
            onPress={() => navigation.navigate('Room3D')}
          >
            <Ionicons name="cube-outline" size={20} color="#fff" />
            <Text style={styles.view3DButtonText}>View in 3D</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  qrBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#a7f3d0',
  },
  qrBannerText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  imageContainer: {
    position: 'relative',
  },
  tileImage: {
    width: '100%',
    height: 250,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
  },
  tileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  tileSize: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tilePrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2563eb',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  sectionContainer: {
    backgroundColor: '#fff',
    marginTop: 8,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  roomsContainer: {
    gap: 12,
  },
  roomCard: {
    padding: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    position: 'relative',
  },
  roomCardSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  roomName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  roomNameSelected: {
    color: '#2563eb',
  },
  roomDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  roomDescriptionSelected: {
    color: '#1e40af',
  },
  roomCheckmark: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  surfacesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  surfaceCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  surfaceCardDisabled: {
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
  },
  surfaceCardApplied: {
    borderColor: '#059669',
    backgroundColor: '#f0fdf4',
  },
  surfaceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 8,
  },
  surfaceNameDisabled: {
    color: '#9ca3af',
  },
  surfaceNameApplied: {
    color: '#059669',
  },
  incompatibleText: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 4,
  },
  actionContainer: {
    padding: 20,
  },
  view3DButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
  },
  view3DButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default TileViewScreen;