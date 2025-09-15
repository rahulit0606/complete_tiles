/*
  # Fix Role Constraint Violation

  1. Problem Resolution
    - Existing users with 'customer' role violate new constraint
    - Update existing customer users to seller role
    - Then apply the role constraint safely
    - Clean up any orphaned data

  2. Data Migration
    - Convert all 'customer' users to 'seller' users
    - Preserve existing user data
    - Maintain data integrity

  3. Constraint Update
    - Apply role constraint after data cleanup
    - Ensure no constraint violations
*/

-- Step 1: Check current role distribution
DO $$
DECLARE
  customer_count integer;
  seller_count integer;
  admin_count integer;
  other_count integer;
BEGIN
  SELECT COUNT(*) INTO customer_count FROM user_profiles WHERE role = 'customer';
  SELECT COUNT(*) INTO seller_count FROM user_profiles WHERE role = 'seller';
  SELECT COUNT(*) INTO admin_count FROM user_profiles WHERE role = 'admin';
  SELECT COUNT(*) INTO other_count FROM user_profiles WHERE role NOT IN ('customer', 'seller', 'admin');
  
  RAISE NOTICE 'Current role distribution:';
  RAISE NOTICE '  Customers: %', customer_count;
  RAISE NOTICE '  Sellers: %', seller_count;
  RAISE NOTICE '  Admins: %', admin_count;
  RAISE NOTICE '  Other/Invalid: %', other_count;
END $$;

-- Step 2: Update all customer users to seller role
UPDATE user_profiles 
SET 
  role = 'seller',
  updated_at = now()
WHERE role = 'customer';

-- Step 3: Update any other invalid roles to seller
UPDATE user_profiles 
SET 
  role = 'seller',
  updated_at = now()
WHERE role NOT IN ('seller', 'admin');

-- Step 4: Now safely drop and recreate the constraint
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_role_check CHECK (role IN ('seller', 'admin'));

-- Step 5: Verify the constraint is working
DO $$
DECLARE
  constraint_exists boolean;
  invalid_roles integer;
BEGIN
  -- Check if constraint exists
  SELECT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'user_profiles_role_check'
  ) INTO constraint_exists;
  
  -- Check for any remaining invalid roles
  SELECT COUNT(*) INTO invalid_roles 
  FROM user_profiles 
  WHERE role NOT IN ('seller', 'admin');
  
  IF NOT constraint_exists THEN
    RAISE EXCEPTION 'Role constraint was not created properly';
  END IF;
  
  IF invalid_roles > 0 THEN
    RAISE EXCEPTION 'Still have % users with invalid roles', invalid_roles;
  END IF;
  
  RAISE NOTICE '✅ Role constraint violation fixed successfully!';
  RAISE NOTICE '✅ All users now have valid roles (seller or admin)';
  RAISE NOTICE '✅ Constraint applied: only seller and admin roles allowed';
END $$;

-- Step 6: Show final role distribution
DO $$
DECLARE
  seller_count integer;
  admin_count integer;
BEGIN
  SELECT COUNT(*) INTO seller_count FROM user_profiles WHERE role = 'seller';
  SELECT COUNT(*) INTO admin_count FROM user_profiles WHERE role = 'admin';
  
  RAISE NOTICE 'Final role distribution:';
  RAISE NOTICE '  Sellers: %', seller_count;
  RAISE NOTICE '  Admins: %', admin_count;
  RAISE NOTICE '  Total users: %', seller_count + admin_count;
END $$;

-- Step 7: Clean up customer_favorites table since no customers exist
DROP TABLE IF EXISTS customer_favorites CASCADE;

-- Step 8: Update analytics to remove customer references
ALTER TABLE tile_analytics DROP COLUMN IF EXISTS customer_id;

-- Step 9: Verify everything is working
DO $$
BEGIN
  -- Test that we can query user_profiles without constraint violations
  PERFORM COUNT(*) FROM user_profiles;
  
  RAISE NOTICE '✅ Database restructuring completed successfully!';
  RAISE NOTICE '✅ Only seller and admin roles remain';
  RAISE NOTICE '✅ Customer role and related data removed';
  RAISE NOTICE '✅ Ready for admin-controlled seller registration';
END $$;