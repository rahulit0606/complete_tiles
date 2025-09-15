# 🚀 Complete Supabase Setup Guide

## 📋 **Step 1: Create Supabase Account & Project**

### **1.1 Sign Up for Supabase**
1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub, Google, or email
4. Verify your email if required

### **1.2 Create New Project**
1. Click **"New Project"**
2. Choose your organization (or create one)
3. Fill in project details:
   - **Project Name**: `tile-showroom-3d`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your location
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup to complete

## 🔑 **Step 2: Get Your Credentials**

### **2.1 Find Your Credentials**
1. Go to your project dashboard
2. Click **"Settings"** in the left sidebar
3. Click **"API"** under Settings
4. You'll see two important credentials:

```
Project URL: https://your-project-id.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **2.2 Copy Your Credentials**
- **SUPABASE_URL**: The Project URL
- **SUPABASE_ANON_KEY**: The anon public key (long string starting with "eyJ")

## 🗄️ **Step 3: Set Up Database**

### **3.1 Run Database Migrations**
1. In your Supabase dashboard, go to **"SQL Editor"**
2. Click **"New Query"**
3. Copy and paste each migration file content (in order):
   - First: `supabase/migrations/20250914103042_still_darkness.sql`
   - Second: `supabase/migrations/20250914105643_curly_dust.sql`
   - Third: `supabase/migrations/20250914161236_dry_reef.sql`
4. Click **"Run"** for each migration

### **3.2 Verify Tables Created**
Go to **"Table Editor"** and you should see these tables:
- `tiles`
- `tile_analytics`
- `tile_analytics_summary`
- `user_profiles`
- `tile_sellers`
- `customer_favorites`

## ⚙️ **Step 4: Configure Your Applications**

### **4.1 Web Application**
Create `.env` file in your project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **4.2 Mobile Application**
Update `mobile-app/src/services/supabase.ts`:
```typescript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

## 🔒 **Step 5: Configure Authentication**

### **5.1 Email Settings**
1. Go to **"Authentication"** → **"Settings"**
2. Under **"Email"** section:
   - **Enable email confirmations**: OFF (for easier testing)
   - **Enable email change confirmations**: OFF
   - **Enable secure email change**: OFF

### **5.2 URL Configuration**
1. In **"Authentication"** → **"URL Configuration"**:
   - **Site URL**: `https://3d-tile-showroom-vis-4j8b.bolt.host`
   - **Redirect URLs**: Add your domain

## 🧪 **Step 6: Test Your Setup**

### **6.1 Test Web App**
1. Start your web app: `npm run dev`
2. Try signing up with a test email
3. Check if user appears in **"Authentication"** → **"Users"**

### **6.2 Test Mobile App**
1. Update credentials in mobile app
2. Run `npm start` in mobile-app folder
3. Test with Expo Go app

## 📊 **Step 7: Add Sample Data (Optional)**

### **7.1 Add Sample Tiles**
Go to **"SQL Editor"** and run:
```sql
INSERT INTO tiles (id, name, image_url, texture_url, category, size, price, in_stock, showroom_id) VALUES
('tile_1', 'Marble Elite White', 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg', 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg', 'both', '60x60 cm', 2500, true, 'showroom1'),
('tile_2', 'Dark Wood Pattern', 'https://images.pexels.com/photos/172277/pexels-photo-172277.jpeg', 'https://images.pexels.com/photos/172277/pexels-photo-172277.jpeg', 'floor', '20x120 cm', 1800, true, 'showroom1'),
('tile_3', 'Modern Gray Stone', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg', 'both', '30x60 cm', 2200, true, 'showroom1');
```

## 🔍 **Troubleshooting**

### **Common Issues:**
1. **"Invalid API key"**: Double-check your credentials
2. **"Table doesn't exist"**: Run all migrations in order
3. **"Authentication failed"**: Check email confirmation settings
4. **"CORS error"**: Add your domain to allowed origins

### **Check Your Setup:**
1. **Database**: Tables visible in Table Editor
2. **Auth**: Can create users in Authentication panel
3. **API**: Credentials copied correctly
4. **RLS**: Row Level Security policies active

## 📞 **Need Help?**

If you encounter issues:
1. Check Supabase project logs in dashboard
2. Verify all migrations ran successfully
3. Ensure credentials are copied exactly
4. Test with simple queries in SQL Editor

---

**🎉 Your Supabase backend is now ready for the Tile Showroom 3D platform!**