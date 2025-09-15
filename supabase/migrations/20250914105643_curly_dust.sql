/*
  # Create multi-user role system

  1. New Tables
    - `user_profiles` - Store user information and roles
    - `tile_sellers` - Store tile seller business information
    - `customer_favorites` - Store customer favorite tiles
    - `seller_stores` - Store tile seller store information

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Separate access for customers, sellers, and admin

  3. User Roles
    - customer: Can view tiles, add favorites
    - seller: Can manage their tiles, view their analytics
    - admin: Can view all data, manage all sellers
*/

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role text NOT NULL CHECK (role IN ('customer', 'seller', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create tile sellers table
CREATE TABLE IF NOT EXISTS tile_sellers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  business_address text,
  phone text,
  website text,
  logo_url text,
  subscription_status text DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'suspended')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create customer favorites table
CREATE TABLE IF NOT EXISTS customer_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  tile_id text NOT NULL,
  showroom_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(customer_id, tile_id)
);

-- Update tiles table to include seller_id
ALTER TABLE tiles ADD COLUMN IF NOT EXISTS seller_id uuid REFERENCES auth.users(id);

-- Update tile_analytics to include customer_id
ALTER TABLE tile_analytics ADD COLUMN IF NOT EXISTS customer_id uuid REFERENCES auth.users(id);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tile_sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_favorites ENABLE ROW LEVEL SECURITY;

-- Update existing tables RLS
ALTER TABLE tiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tile_analytics ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Policies for tile_sellers
CREATE POLICY "Sellers can view own business info"
  ON tile_sellers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Sellers can update own business info"
  ON tile_sellers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all sellers"
  ON tile_sellers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Policies for customer_favorites
CREATE POLICY "Customers can manage own favorites"
  ON customer_favorites
  FOR ALL
  TO authenticated
  USING (auth.uid() = customer_id);

-- Updated policies for tiles
DROP POLICY IF EXISTS "Anyone can view tiles" ON tiles;
DROP POLICY IF EXISTS "Authenticated users can manage tiles" ON tiles;

CREATE POLICY "Anyone can view tiles"
  ON tiles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Sellers can manage own tiles"
  ON tiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = seller_id);

CREATE POLICY "Admin can manage all tiles"
  ON tiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Updated policies for tile_analytics
DROP POLICY IF EXISTS "Anyone can insert analytics" ON tile_analytics;
DROP POLICY IF EXISTS "Authenticated users can view analytics" ON tile_analytics;

CREATE POLICY "Anyone can insert analytics"
  ON tile_analytics
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Sellers can view own tile analytics"
  ON tile_analytics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tiles 
      WHERE tiles.id = tile_analytics.tile_id 
      AND tiles.seller_id = auth.uid()
    )
  );

CREATE POLICY "Admin can view all analytics"
  ON tile_analytics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Function to create user profile after signup
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (user_id, email, role)
  VALUES (NEW.id, NEW.email, 'customer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create profile after user signup
CREATE TRIGGER create_user_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_tile_sellers_user_id ON tile_sellers(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_favorites_customer_id ON customer_favorites(customer_id);
CREATE INDEX IF NOT EXISTS idx_tiles_seller_id ON tiles(seller_id);
CREATE INDEX IF NOT EXISTS idx_tile_analytics_customer_id ON tile_analytics(customer_id);