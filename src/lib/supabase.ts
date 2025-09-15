import { createClient } from '@supabase/supabase-js';
import { UserProfile, TileSeller, CustomerFavorite } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client if environment variables are not configured
export const supabase = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_project_url' && 
  supabaseAnonKey !== 'your_supabase_anon_key'
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabase !== null;
};

// Analytics functions
export const trackTileView = async (tileId: string, showroomId: string) => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured. Tile view tracking skipped.');
    return;
  }
  
  try {
    const { error } = await supabase
      .from('tile_analytics')
      .insert({
        tile_id: tileId,
        showroom_id: showroomId,
        action_type: 'view',
        timestamp: new Date().toISOString()
      });
    
    if (error) console.error('Error tracking tile view:', error);
  } catch (error) {
    console.error('Error tracking tile view:', error);
  }
};

export const trackTileApplication = async (tileId: string, showroomId: string, surface: string, roomType: string) => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured. Tile application tracking skipped.');
    return;
  }
  
  try {
    const { error } = await supabase
      .from('tile_analytics')
      .insert({
        tile_id: tileId,
        showroom_id: showroomId,
        action_type: 'apply',
        surface_type: surface,
        room_type: roomType,
        timestamp: new Date().toISOString()
      });
    
    if (error) console.error('Error tracking tile application:', error);
  } catch (error) {
    console.error('Error tracking tile application:', error);
  }
};

export const getTileAnalytics = async (showroomId: string) => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured. Returning empty analytics.');
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('tile_analytics_summary')
      .select('*')
      .eq('showroom_id', showroomId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching tile analytics:', error);
    return [];
  }
};

export const getMostViewedTiles = async (showroomId: string, limit = 10) => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured. Returning empty most viewed tiles.');
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('most_viewed_tiles')
      .select('*')
      .eq('showroom_id', showroomId)
      .limit(limit);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching most viewed tiles:', error);
    return [];
  }
};

export const getMostTriedTiles = async (showroomId: string, limit = 10) => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured. Returning empty most tried tiles.');
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('most_tried_tiles')
      .select('*')
      .eq('showroom_id', showroomId)
      .limit(limit);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching most tried tiles:', error);
    return [];
  }
};

// Authentication functions
export const signUp = async (email: string, password: string, fullName: string, role: 'customer' | 'seller' = 'customer') => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Please set up your Supabase credentials.');
  }
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Update user profile with role and full name
    if (data.user) {
      await supabase
        .from('user_profiles')
        .update({ full_name: fullName, role })
        .eq('user_id', data.user.id);
    }
    
    return data;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Please set up your Supabase credentials.');
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOut = async () => {
  if (!isSupabaseConfigured()) {
    return;
  }
  
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<UserProfile | null> => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Seller functions
export const createSellerProfile = async (sellerData: Partial<TileSeller>) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Please set up your Supabase credentials.');
  }
  
  try {
    const { data, error } = await supabase
      .from('tile_sellers')
      .insert(sellerData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating seller profile:', error);
    throw error;
  }
};

export const getSellerProfile = async (userId: string): Promise<TileSeller | null> => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  
  try {
    const { data, error } = await supabase
      .from('tile_sellers')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Error getting seller profile:', error);
    return null;
  }
};

export const getAllSellers = async (): Promise<TileSeller[]> => {
  if (!isSupabaseConfigured()) {
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('tile_sellers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting all sellers:', error);
    return [];
  }
};

// Customer favorites functions
export const addToFavorites = async (tileId: string, showroomId: string) => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured. Favorites not saved.');
    return;
  }
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { error } = await supabase
      .from('customer_favorites')
      .insert({
        customer_id: user.id,
        tile_id: tileId,
        showroom_id: showroomId
      });
    
    if (error && error.code !== '23505') throw error; // Ignore duplicate key error
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

export const removeFromFavorites = async (tileId: string) => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured. Favorites not removed.');
    return;
  }
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { error } = await supabase
      .from('customer_favorites')
      .delete()
      .eq('customer_id', user.id)
      .eq('tile_id', tileId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

export const getFavorites = async (): Promise<string[]> => {
  if (!isSupabaseConfigured()) {
    return [];
  }
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('customer_favorites')
      .select('tile_id')
      .eq('customer_id', user.id);
    
    if (error) throw error;
    return data?.map(fav => fav.tile_id) || [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

// Tile management functions
export const uploadTile = async (tileData: any, sellerId?: string) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Please set up your Supabase credentials.');
  }
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const finalTileData = {
      ...tileData,
      seller_id: sellerId || user?.id,
      qr_code: tileData.qrCode || null,
      qr_code_url: tileData.qrCodeUrl || null
    };
    
    const { data, error } = await supabase
      .from('tiles')
      .insert(finalTileData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error uploading tile:', error);
    throw error;
  }
};

export const uploadBulkTiles = async (tilesData: any[], sellerId?: string) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Please set up your Supabase credentials.');
  }
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const finalTilesData = tilesData.map(tile => ({
      ...tile,
      seller_id: sellerId || user?.id,
      qr_code: tile.qrCode || null,
      qr_code_url: tile.qrCodeUrl || null
    }));
    
    const { data, error } = await supabase
      .from('tiles')
      .insert(finalTilesData)
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error uploading bulk tiles:', error);
    throw error;
  }
};

export const updateTile = async (tileId: string, updates: any) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Please set up your Supabase credentials.');
  }
  
  try {
    const finalUpdates = {
      ...updates,
      qr_code: updates.qrCode || updates.qr_code || null,
      qr_code_url: updates.qrCodeUrl || updates.qr_code_url || null
    };
    
    const { data, error } = await supabase
      .from('tiles')
      .update(finalUpdates)
      .eq('id', tileId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating tile:', error);
    throw error;
  }
};

export const deleteTile = async (tileId: string) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Please set up your Supabase credentials.');
  }
  
  try {
    const { error } = await supabase
      .from('tiles')
      .delete()
      .eq('id', tileId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting tile:', error);
    throw error;
  }
};

// QR Code management functions
export const updateTileQRCode = async (tileId: string, qrCode: string, qrCodeUrl?: string) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Please set up your Supabase credentials.');
  }
  
  try {
    const { data, error } = await supabase
      .from('tiles')
      .update({ 
        qr_code: qrCode,
        qr_code_url: qrCodeUrl || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', tileId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating tile QR code:', error);
    throw error;
  }
};

export const getTileByQRScan = async (tileId: string, showroomId: string) => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  
  try {
    const { data, error } = await supabase
      .from('tiles')
      .select('*')
      .eq('id', tileId)
      .eq('showroom_id', showroomId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching tile by QR scan:', error);
    return null;
  }
};

export const getSellerTilesWithQR = async (sellerId: string) => {
  if (!isSupabaseConfigured()) {
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('tiles')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching seller tiles with QR:', error);
    return [];
  }
};

// Admin functions
export const getSellerAnalytics = async (sellerId: string) => {
  if (!isSupabaseConfigured()) {
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('tile_analytics_summary')
      .select(`
        *,
        tiles!inner(seller_id)
      `)
      .eq('tiles.seller_id', sellerId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching seller analytics:', error);
    return [];
  }
};

export const getAllAnalytics = async () => {
  if (!isSupabaseConfigured()) {
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('tile_analytics_summary')
      .select(`
        *,
        tiles!inner(seller_id),
        tile_sellers!inner(business_name)
      `);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching all analytics:', error);
    return [];
  }
};