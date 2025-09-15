import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTiles } from '../context/TileContext';
import { useAuth } from '../context/AuthContext';
import { trackTileView } from '../services/supabase';

const HomeScreen = ({ navigation }: any) => {
  const { tiles, favorites, toggleFavorite, loading } = useTiles();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredTiles = tiles.filter(tile => {
    const matchesSearch = tile.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || tile.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleTilePress = async (tile: any) => {
    await trackTileView(tile.id, tile.showroom_id);
    navigation.navigate('TileView', { tile });
  };

  const handleFavoritePress = async (tile: any) => {
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

  const renderTile = ({ item: tile }: { item: any }) => (
    <TouchableOpacity
      style={styles.tileCard}
      onPress={() => handleTilePress(tile)}
    >
      <View style={styles.tileImageContainer}>
        <Image source={{ uri: tile.image_url }} style={styles.tileImage} />
        {user && (
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => handleFavoritePress(tile)}
          >
            <Ionicons
              name={favorites.includes(tile.id) ? 'heart' : 'heart-outline'}
              size={20}
              color={favorites.includes(tile.id) ? '#ef4444' : '#6b7280'}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.tileInfo}>
        <Text style={styles.tileName}>{tile.name}</Text>
        <Text style={styles.tileSize}>{tile.size}</Text>
        <View style={styles.tileFooter}>
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
      </View>
    </TouchableOpacity>
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'floor': return '#dbeafe';
      case 'wall': return '#f3e8ff';
      default: return '#f3f4f6';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading tiles...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tiles..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {['all', 'floor', 'wall', 'both'].map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.filterButton,
              categoryFilter === category && styles.filterButtonActive
            ]}
            onPress={() => setCategoryFilter(category)}
          >
            <Text style={[
              styles.filterButtonText,
              categoryFilter === category && styles.filterButtonTextActive
            ]}>
              {category === 'all' ? 'All Categories' :
               category === 'both' ? 'Floor & Wall' :
               category === 'floor' ? 'Floor Only' : 'Wall Only'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* QR Scanner Prompt */}
      <TouchableOpacity
        style={styles.qrPrompt}
        onPress={() => navigation.navigate('Scanner')}
      >
        <Ionicons name="qr-code" size={24} color="#2563eb" />
        <Text style={styles.qrPromptText}>
          Scan QR code on physical tiles for instant 3D view
        </Text>
        <Ionicons name="chevron-forward" size={20} color="#2563eb" />
      </TouchableOpacity>

      {/* Tiles Grid */}
      <FlatList
        data={filteredTiles}
        renderItem={renderTile}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.tilesContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#6b7280',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  qrPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  qrPromptText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#1e40af',
    fontWeight: '500',
  },
  tilesContainer: {
    padding: 16,
  },
  tileCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tileImageContainer: {
    position: 'relative',
  },
  tileImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 4,
  },
  tileInfo: {
    padding: 12,
  },
  tileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  tileSize: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  tileFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tilePrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563eb',
  },
  categoryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#374151',
  },
});

export default HomeScreen;