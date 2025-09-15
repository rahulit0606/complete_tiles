# 🔍 Troubleshoot Login Issues

## 🚨 **Common Login Problems After Signup**

### **Problem 1: Email Confirmation Required**
**Symptoms:** User created but can't login
**Solution:** Disable email confirmation in Supabase

1. Go to **Supabase Dashboard** → **Authentication** → **Settings**
2. Under **Email** section:
   - **Enable email confirmations**: Turn **OFF**
   - **Enable email change confirmations**: Turn **OFF**
3. **Save settings**

### **Problem 2: Check User Status**
1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Find your user account
3. Check the **Email Confirmed** column
4. If not confirmed, click the user and manually confirm

### **Problem 3: Profile Mismatch**
1. Go to **Table Editor** → **user_profiles**
2. Check if profile exists for the user
3. Verify `user_id` matches the auth user ID

## 🧪 **Quick Test Steps**

### **Step 1: Disable Email Confirmation**
```sql
-- Run this in SQL Editor to check auth users
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
ORDER BY created_at DESC;
```

### **Step 2: Check Profile Connection**
```sql
-- Check if profiles are properly linked
SELECT 
  au.email,
  au.email_confirmed_at,
  up.role,
  up.full_name
FROM auth.users au
LEFT JOIN user_profiles up ON up.user_id = au.id
ORDER BY au.created_at DESC;
```

### **Step 3: Manual Profile Fix**
If profile is missing:
```sql
-- Create missing profile (replace USER_ID with actual ID)
INSERT INTO user_profiles (user_id, email, role, full_name)
VALUES ('USER_ID_HERE', 'user@example.com', 'customer', 'User Name')
ON CONFLICT (user_id) DO NOTHING;
```

## ⚡ **Quick Fix Commands**

### **Disable Email Confirmation (Recommended)**
1. **Supabase Dashboard** → **Authentication** → **Settings**
2. **Turn OFF** email confirmations
3. **Try logging in again**

### **Manual User Confirmation**
1. **Authentication** → **Users**
2. **Click on user**
3. **Click "Confirm user"**

This should resolve most login issues after signup!