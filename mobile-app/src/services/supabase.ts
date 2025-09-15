import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your actual Supabase credentials
// Get these from: Supabase Dashboard → Settings → API
const SUPABASE_URL = 'https://rhykghnltadvjwxchcdx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoeWtnaG5sdGFkdmp3eGNoY2R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MjUyNjgsImV4cCI6MjA3MzUwMTI2OH0.v8RAwWjCtNOZ8RnHFLpoF-5xaoXElMot6CgsiJQ95JU';

// INSTRUCTIONS TO GET YOUR CREDENTIALS:
// 1. Go to supabase.com and create account
// 2. Create new project: "tile-showroom-3d"
// 3. Go to Settings → API
// 4. Copy "Project URL" and "anon public" key
// 5. Replace the values above
//
// Your Project URL will look like: https://abcdefghijklmnop.supabase.co
// Your anon key will be a long string starting with: eyJhbGciOiJIUzI1NiIs...

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const initializeSupabase = async () => {
  // Initialize any required setup
  console.log('Supabase initialized');
};

// Tile-related functions
export const getTileById = async (tileId: string, showroomId: string) => {
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
    console.error('Error fetching tile:', error);
    return null;
  }
};

export const getAllTiles = async (showroomId?: string) => {
  try {
    let query = supabase.from('tiles').select('*');
    
    if (showroomId) {
      query = query.eq('showroom_id', showroomId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching tiles:', error);
    return [];
  }
};

// Analytics functions
export const trackTileView = async (tileId: string, showroomId: string) => {
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

export const trackTileApplication = async (
  tileId: string, 
  showroomId: string, 
  surface: string, 
  roomType: string
) => {
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

// Favorites functions
export const addToFavorites = async (tileId: string, showroomId: string) => {
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

// Auth functions
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  
  // Update user profile
  if (data.user) {
    await supabase
      .from('user_profiles')
      .update({ full_name: fullName, role: 'customer' })
      .eq('user_id', data.user.id);
  }
  
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
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