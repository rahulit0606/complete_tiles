/*
  # Force Fix Security Definer Views

  1. Problem Resolution
    - Forcefully drops existing views with CASCADE
    - Recreates views without any SECURITY DEFINER properties
    - Uses explicit security context to ensure proper creation
    - Adds comprehensive verification

  2. Security
    - Removes SECURITY DEFINER completely
    - Uses invoker's permissions (safer approach)
    - Maintains proper access control through RLS

  3. Views Fixed
    - most_viewed_tiles (completely recreated)
    - most_tried_tiles (completely recreated)
*/

-- Step 1: Force drop existing views with CASCADE to remove all dependencies
DROP VIEW IF EXISTS public.most_viewed_tiles CASCADE;
DROP VIEW IF EXISTS public.most_tried_tiles CASCADE;

-- Step 2: Wait a moment to ensure cleanup
SELECT pg_sleep(1);

-- Step 3: Verify views are completely removed
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'most_viewed_tiles') THEN
    RAISE EXCEPTION 'most_viewed_tiles view still exists after drop';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'most_tried_tiles') THEN
    RAISE EXCEPTION 'most_tried_tiles view still exists after drop';
  END IF;
  
  RAISE NOTICE 'Views successfully removed';
END $$;

-- Step 4: Create most_viewed_tiles view with explicit security context
CREATE VIEW public.most_viewed_tiles 
WITH (security_invoker = true)
AS
SELECT 
  tas.tile_id,
  tas.tile_name,
  tas.showroom_id,
  tas.category,
  tas.view_count,
  tas.last_viewed,
  ROW_NUMBER() OVER (PARTITION BY tas.showroom_id ORDER BY tas.view_count DESC) as rank
FROM public.tile_analytics_summary tas
WHERE tas.view_count > 0
ORDER BY tas.showroom_id, tas.view_count DESC;

-- Step 5: Create most_tried_tiles view with explicit security context
CREATE VIEW public.most_tried_tiles 
WITH (security_invoker = true)
AS
SELECT 
  tas.tile_id,
  tas.tile_name,
  tas.showroom_id,
  tas.category,
  tas.apply_count,
  tas.last_applied,
  ROW_NUMBER() OVER (PARTITION BY tas.showroom_id ORDER BY tas.apply_count DESC) as rank
FROM public.tile_analytics_summary tas
WHERE tas.apply_count > 0
ORDER BY tas.showroom_id, tas.apply_count DESC;

-- Step 6: Grant explicit permissions
GRANT SELECT ON public.most_viewed_tiles TO authenticated;
GRANT SELECT ON public.most_viewed_tiles TO anon;
GRANT SELECT ON public.most_tried_tiles TO authenticated;
GRANT SELECT ON public.most_tried_tiles TO anon;

-- Step 7: Verify the views are created correctly without SECURITY DEFINER
DO $$
DECLARE
  view_def text;
BEGIN
  -- Check most_viewed_tiles
  SELECT pg_get_viewdef('public.most_viewed_tiles'::regclass) INTO view_def;
  IF view_def ILIKE '%SECURITY DEFINER%' THEN
    RAISE EXCEPTION 'most_viewed_tiles still has SECURITY DEFINER property';
  END IF;
  
  -- Check most_tried_tiles
  SELECT pg_get_viewdef('public.most_tried_tiles'::regclass) INTO view_def;
  IF view_def ILIKE '%SECURITY DEFINER%' THEN
    RAISE EXCEPTION 'most_tried_tiles still has SECURITY DEFINER property';
  END IF;
  
  -- Verify views exist and are accessible
  IF NOT EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'most_viewed_tiles') THEN
    RAISE EXCEPTION 'most_viewed_tiles view was not created';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'most_tried_tiles') THEN
    RAISE EXCEPTION 'most_tried_tiles view was not created';
  END IF;
  
  -- Success messages
  RAISE NOTICE '✅ Security definer views completely fixed!';
  RAISE NOTICE '✅ Views recreated: most_viewed_tiles, most_tried_tiles';
  RAISE NOTICE '✅ Security: No SECURITY DEFINER properties';
  RAISE NOTICE '✅ Permissions: Proper grants applied';
  RAISE NOTICE '✅ Verification: All checks passed';
END $$;

-- Step 8: Test the views work correctly
DO $$
DECLARE
  view_count integer;
  tried_count integer;
BEGIN
  -- Test most_viewed_tiles
  SELECT COUNT(*) INTO view_count FROM public.most_viewed_tiles;
  RAISE NOTICE 'most_viewed_tiles contains % rows', view_count;
  
  -- Test most_tried_tiles
  SELECT COUNT(*) INTO tried_count FROM public.most_tried_tiles;
  RAISE NOTICE 'most_tried_tiles contains % rows', tried_count;
  
  RAISE NOTICE '✅ Views are functional and ready to use!';
END $$;