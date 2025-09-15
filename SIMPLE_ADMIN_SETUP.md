# 🔑 Simple Admin User Setup (No Advanced Settings Needed)

## 🚀 **Step 1: Create Basic Admin User**

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add user"**
3. Fill in ONLY these fields:
   - **Email**: `admin@tileshowroom.com`
   - **Password**: `Admin123!@#`
   - **Email Confirm**: ✅ Check this box
4. Click **"Create user"**
5. **Copy the User ID** that appears (looks like: `12345678-1234-1234-1234-123456789012`)

## 🗄️ **Step 2: Create Admin Profile Manually**

1. Go to **SQL Editor** in Supabase
2. Copy and paste this query (replace `USER_ID_HERE` with the actual user ID):

```sql
-- Replace USER_ID_HERE with the actual user ID from step 1
INSERT INTO user_profiles (user_id, email, full_name, role)
VALUES ('USER_ID_HERE', 'admin@tileshowroom.com', 'System Administrator', 'admin')
ON CONFLICT (user_id) DO UPDATE SET
  role = 'admin',
  full_name = 'System Administrator',
  updated_at = now();
```

3. **Replace `USER_ID_HERE`** with the actual user ID
4. Click **"Run"**

## ✅ **Step 3: Verify Setup**

Check if the profile was created:
```sql
-- Check if admin profile exists
SELECT * FROM user_profiles WHERE email = 'admin@tileshowroom.com';
```

You should see the admin profile with role = 'admin'.

## 🌐 **Step 4: Access Admin Panel**

**URL**: https://3d-tile-showroom-vis-4j8b.bolt.host/admin

**Credentials**:
- **Email**: `admin@tileshowroom.com`
- **Password**: `Admin123!@#`

## 🎯 **Alternative: Quick SQL Method**

If you want to do everything in one SQL query:

```sql
-- This creates both auth user and profile in one go
-- Note: This is a workaround since we can't use auth.users directly
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Check if admin user already exists in auth.users
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'admin@tileshowroom.com';
  
  -- If user exists, just create/update the profile
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO user_profiles (user_id, email, full_name, role)
    VALUES (admin_user_id, 'admin@tileshowroom.com', 'System Administrator', 'admin')
    ON CONFLICT (user_id) DO UPDATE SET
      role = 'admin',
      full_name = 'System Administrator',
      updated_at = now();
    
    RAISE NOTICE 'Admin profile created/updated for existing user: %', admin_user_id;
  ELSE
    RAISE NOTICE 'Please create the auth user first in Authentication → Users';
    RAISE NOTICE 'Email: admin@tileshowroom.com';
    RAISE NOTICE 'Password: Admin123!@#';
  END IF;
END $$;
```

## 🚨 **Important Notes**

1. **Create the auth user first** in Authentication → Users
2. **Then create the profile** using SQL
3. **Both steps are required** for login to work
4. **No advanced settings needed** - just basic user creation

This should resolve the "Access Restricted" message and allow you to access the admin panel!