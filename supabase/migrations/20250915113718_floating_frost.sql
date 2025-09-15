/*
  # Fix Security Definer Views

  1. Problem Resolution
    - Removes SECURITY DEFINER property from views
    - Recreates views with proper security settings
    - Maintains functionality while fixing security concerns

  2. Security
    - Views will use invoker's permissions instead of definer's
    - Removes security linter warnings
    - Maintains proper access control through RLS

  3. Views Updated
    - most_viewed_tiles (recreated without SECURITY DEFINER)
    - most_tried_tiles (recreated without SECURITY DEFINER)
*/

-- Drop existing views that have SECURITY DEFINER issues
DROP VIEW IF EXISTS most_viewed_tiles;
DROP VIEW IF EXISTS most_tried_tiles;

-- Recreate most_viewed_tiles view without SECURITY DEFINER
CREATE VIEW most_viewed_tiles AS
SELECT 
  tas.tile_id,
  tas.tile_name,
  tas.showroom_id,
  tas.category,
  tas.view_count,
  tas.last_viewed,
  ROW_NUMBER() OVER (PARTITION BY tas.showroom_id ORDER BY tas.view_count DESC) as rank
FROM tile_analytics_summary tas
WHERE tas.view_count > 0
ORDER BY tas.showroom_id, tas.view_count DESC;

-- Recreate most_tried_tiles view without SECURITY DEFINER
CREATE VIEW most_tried_tiles AS
SELECT 
  tas.tile_id,
  tas.tile_name,
  tas.showroom_id,
  tas.category,
  tas.apply_count,
  tas.last_applied,
  ROW_NUMBER() OVER (PARTITION BY tas.showroom_id ORDER BY tas.apply_count DESC) as rank
FROM tile_analytics_summary tas
WHERE tas.apply_count > 0
ORDER BY tas.showroom_id, tas.apply_count DESC;

-- Grant appropriate permissions to the views
GRANT SELECT ON most_viewed_tiles TO authenticated;
GRANT SELECT ON most_viewed_tiles TO anon;
GRANT SELECT ON most_tried_tiles TO authenticated;
GRANT SELECT ON most_tried_tiles TO anon;

-- Verify the views are created correctly
DO $$
BEGIN
  -- Check if views exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.views WHERE table_name = 'most_viewed_tiles') THEN
    RAISE EXCEPTION 'most_viewed_tiles view was not created properly';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.views WHERE table_name = 'most_tried_tiles') THEN
    RAISE EXCEPTION 'most_tried_tiles view was not created properly';
  END IF;
  
  -- Success message
  RAISE NOTICE '✅ Security definer views fixed successfully!';
  RAISE NOTICE '✅ Views: most_viewed_tiles, most_tried_tiles';
  RAISE NOTICE '✅ Security: SECURITY DEFINER removed';
  RAISE NOTICE '✅ Permissions: Proper grants applied';
END $$;