import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTiles } from '../context/TileContext';
import { useAuth } from '../context/AuthContext';
import { trackTileView } from '../services/supabase';

const FavoritesScreen = ({ navigation }: any) => {
  const { tiles, favorites, toggleFavorite } = useTiles();
  const { user } = useAuth();

  const favoriteTiles = tiles.filter(tile => favorites.includes(tile.id));

  const handleTilePress = async (tile: any) => {
    await trackTileView(tile.id, tile.showroom_id);
    navigation.navigate('TileView', { tile });
  };

  const handleRemoveFavorite = async (tile: any) => {
    Alert.alert(
      'Remove Favorite',
      `Remove ${tile.name} from favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await toggleFavorite(tile.id, tile.showroom_id);
            } catch (error) {
              Alert.alert('Error', 'Failed to remove from favorites');
            }
          }
        }
      ]
    );
  };

  const renderTile = ({ item: tile }: { item: any }) => (
    <TouchableOpacity
      style={styles.tileCard}
      onPress={() => handleTilePress(tile)}
    >
      <Image source={{ uri: tile.image_url }} style={styles.tileImage} />
      <View style={styles.tileInfo}>
        <Text style={styles.tileName}>{tile.name}</Text>
        <Text style={styles.tileSize}>{tile.size}</Text>
        <View style={styles.tileFooter}>
          <Text style={styles.tilePrice}>₹{tile.price}</Text>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveFavorite(tile)}
          >
            <Ionicons name="heart" size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="#9ca3af" />
          <Text style={styles.emptyTitle}>Sign In Required</Text>
          <Text style={styles.emptyText}>
            Please sign in to view and manage your favorite tiles
          </Text>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.signInButtonText}>Go to Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (favoriteTiles.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="#9ca3af" />
          <Text style={styles.emptyTitle}>No Favorites Yet</Text>
          <Text style={styles.emptyText}>
            Start exploring tiles and add them to your favorites by tapping the heart icon
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.exploreButtonText}>Explore Tiles</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favorites</Text>
        <Text style={styles.headerSubtitle}>
          {favoriteTiles.length} tile{favoriteTiles.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={favoriteTiles}
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
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  signInButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  exploreButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  tileImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
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
  removeButton: {
    padding: 4,
  },
});

export default FavoritesScreen;