# 🔧 Fix Email Confirmation Redirect Issue

## 🚨 **The Problem**
Supabase is sending confirmation emails with localhost URLs instead of your actual domain URL (https://3d-tile-showroom-vis-4j8b.bolt.host).

## ⚡ **IMMEDIATE FIX**

### **Step 1: Update Supabase URL Configuration**
1. Go to your **Supabase Dashboard** (https://supabase.com/dashboard)
2. Select your project: `tile-showroom-3d`
3. Go to **Authentication** → **URL Configuration**
4. Update these settings:

**Site URL:**
```
https://3d-tile-showroom-vis-4j8b.bolt.host
```

**Redirect URLs (add these):**
```
https://3d-tile-showroom-vis-4j8b.bolt.host
https://3d-tile-showroom-vis-4j8b.bolt.host/auth/callback
https://3d-tile-showroom-vis-4j8b.bolt.host/**
```

### **Step 2: Disable Email Confirmation (Optional for Testing)**
If you want to skip email confirmation for now:
1. Go to **Authentication** → **Settings**
2. Under **Email** section:
   - **Enable email confirmations**: Turn OFF
   - **Enable email change confirmations**: Turn OFF
   - **Enable secure email change**: Turn OFF

### **Step 3: Test the Fix**
1. **Save the settings** in Supabase
2. **Try signing up with a new email**
3. **Check if confirmation email** has the correct domain
4. **Click the confirmation link** - should redirect to your site

## 🔍 **Alternative: Handle Confirmation in Your App**

If you want to keep email confirmation enabled, you can create a confirmation handler page.

### **Option A: Simple Redirect**
The confirmation link should automatically redirect to your site and log the user in.

### **Option B: Custom Confirmation Page**
Create a dedicated confirmation success page that shows after email verification.

## 🧪 **Testing Steps**

1. **Update Supabase URL settings** as shown above
2. **Sign up with a new email address**
3. **Check your email** - the confirmation link should now point to your domain
4. **Click the confirmation link** - should work properly

## 🚨 **Important Notes**

- **Site URL** must match your exact domain
- **Redirect URLs** should include your domain with wildcards
- **Email templates** will automatically use the Site URL
- **Changes take effect immediately**

This should fix the localhost redirect issue in confirmation emails!