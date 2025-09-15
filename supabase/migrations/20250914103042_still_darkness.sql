+/*
+  # Create analytics and tile management tables
+
+  1. New Tables
+    - `tiles` - Store tile information with showroom association
+    - `tile_analytics` - Track tile views and applications
+    - `tile_analytics_summary` - Aggregated analytics data
+    - `most_viewed_tiles` - View for most viewed tiles
+    - `most_tried_tiles` - View for most applied tiles
+
+  2. Security
+    - Enable RLS on all tables
+    - Add policies for authenticated users and admin access
+
+  3. Functions
+    - Trigger to update analytics summary
+    - Functions to calculate most viewed/tried tiles
+*/

+-- Create tiles table
+CREATE TABLE IF NOT EXISTS tiles (
+  id text PRIMARY KEY,
+  name text NOT NULL,
+  image_url text NOT NULL,
+  texture_url text NOT NULL,
+  category text NOT NULL CHECK (category IN ('floor', 'wall', 'both')),
+  size text NOT NULL,
+  price numeric NOT NULL,
+  in_stock boolean DEFAULT true,
+  showroom_id text NOT NULL,
+  created_at timestamptz DEFAULT now(),
+  updated_at timestamptz DEFAULT now()
+);

+-- Create tile analytics table
+CREATE TABLE IF NOT EXISTS tile_analytics (
+  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
+  tile_id text NOT NULL,
+  showroom_id text NOT NULL,
+  action_type text NOT NULL CHECK (action_type IN ('view', 'apply')),
+  surface_type text CHECK (surface_type IN ('floor', 'wall')),
+  room_type text CHECK (room_type IN ('hall', 'washroom', 'kitchen')),
+  timestamp timestamptz DEFAULT now(),
+  session_id text,
+  user_agent text
+);

+-- Create analytics summary table
+CREATE TABLE IF NOT EXISTS tile_analytics_summary (
+  tile_id text PRIMARY KEY,
+  tile_name text NOT NULL,
+  showroom_id text NOT NULL,
+  category text NOT NULL,
+  view_count integer DEFAULT 0,
+  apply_count integer DEFAULT 0,
+  last_viewed timestamptz,
+  last_applied timestamptz,
+  updated_at timestamptz DEFAULT now()
+);

+-- Enable RLS
+ALTER TABLE tiles ENABLE ROW LEVEL SECURITY;
+ALTER TABLE tile_analytics ENABLE ROW LEVEL SECURITY;
+ALTER TABLE tile_analytics_summary ENABLE ROW LEVEL SECURITY;

+-- Create policies for tiles
+CREATE POLICY "Anyone can view tiles"
+  ON tiles
+  FOR SELECT
+  TO public
+  USING (true);

+CREATE POLICY "Authenticated users can manage tiles"
+  ON tiles
+  FOR ALL
+  TO authenticated
+  USING (true);

+-- Create policies for analytics
+CREATE POLICY "Anyone can insert analytics"
+  ON tile_analytics
+  FOR INSERT
+  TO public
+  WITH CHECK (true);

+CREATE POLICY "Authenticated users can view analytics"
+  ON tile_analytics
+  FOR SELECT
+  TO authenticated
+  USING (true);

+-- Create policies for analytics summary
+CREATE POLICY "Anyone can view analytics summary"
+  ON tile_analytics_summary
+  FOR SELECT
+  TO public
+  USING (true);

+CREATE POLICY "System can manage analytics summary"
+  ON tile_analytics_summary
+  FOR ALL
+  TO authenticated
+  USING (true);

+-- Create function to update analytics summary
+CREATE OR REPLACE FUNCTION update_tile_analytics_summary()
+RETURNS TRIGGER AS $$
+BEGIN
+  -- Get tile information
+  INSERT INTO tile_analytics_summary (tile_id, tile_name, showroom_id, category, view_count, apply_count, last_viewed, last_applied)
+  SELECT 
+    t.id,
+    t.name,
+    t.showroom_id,
+    t.category,
+    COALESCE(views.count, 0),
+    COALESCE(applies.count, 0),
+    views.last_timestamp,
+    applies.last_timestamp
+  FROM tiles t
+  LEFT JOIN (
+    SELECT tile_id, COUNT(*) as count, MAX(timestamp) as last_timestamp
+    FROM tile_analytics 
+    WHERE action_type = 'view' AND tile_id = NEW.tile_id
+    GROUP BY tile_id
+  ) views ON t.id = views.tile_id
+  LEFT JOIN (
+    SELECT tile_id, COUNT(*) as count, MAX(timestamp) as last_timestamp
+    FROM tile_analytics 
+    WHERE action_type = 'apply' AND tile_id = NEW.tile_id
+    GROUP BY tile_id
+  ) applies ON t.id = applies.tile_id
+  WHERE t.id = NEW.tile_id
+  ON CONFLICT (tile_id) DO UPDATE SET
+    view_count = EXCLUDED.view_count,
+    apply_count = EXCLUDED.apply_count,
+    last_viewed = EXCLUDED.last_viewed,
+    last_applied = EXCLUDED.last_applied,
+    updated_at = now();
+
+  RETURN NEW;
+END;
+$$ LANGUAGE plpgsql;

+-- Create trigger for analytics summary
+CREATE TRIGGER update_analytics_summary_trigger
+  AFTER INSERT ON tile_analytics
+  FOR EACH ROW
+  EXECUTE FUNCTION update_tile_analytics_summary();

+-- Create view for most viewed tiles
+CREATE OR REPLACE VIEW most_viewed_tiles AS
+SELECT 
+  tas.tile_id,
+  tas.tile_name,
+  tas.showroom_id,
+  tas.category,
+  tas.view_count,
+  tas.last_viewed,
+  ROW_NUMBER() OVER (PARTITION BY tas.showroom_id ORDER BY tas.view_count DESC) as rank
+FROM tile_analytics_summary tas
+WHERE tas.view_count > 0
+ORDER BY tas.showroom_id, tas.view_count DESC;

+-- Create view for most tried tiles
+CREATE OR REPLACE VIEW most_tried_tiles AS
+SELECT 
+  tas.tile_id,
+  tas.tile_name,
+  tas.showroom_id,
+  tas.category,
+  tas.apply_count,
+  tas.last_applied,
+  ROW_NUMBER() OVER (PARTITION BY tas.showroom_id ORDER BY tas.apply_count DESC) as rank
+FROM tile_analytics_summary tas
+WHERE tas.apply_count > 0
+ORDER BY tas.showroom_id, tas.apply_count DESC;

+-- Create indexes for better performance
+CREATE INDEX IF NOT EXISTS idx_tile_analytics_tile_id ON tile_analytics(tile_id);
+CREATE INDEX IF NOT EXISTS idx_tile_analytics_showroom_id ON tile_analytics(showroom_id);
+CREATE INDEX IF NOT EXISTS idx_tile_analytics_timestamp ON tile_analytics(timestamp);
+CREATE INDEX IF NOT EXISTS idx_tile_analytics_action_type ON tile_analytics(action_type);
+CREATE INDEX IF NOT EXISTS idx_tiles_showroom_id ON tiles(showroom_id);
+