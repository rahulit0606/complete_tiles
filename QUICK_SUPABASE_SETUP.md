# ⚡ Quick Supabase Setup (5 Minutes)

## 🚀 **Step 1: Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** → Sign up
3. Click **"New Project"**
4. Name: `tile-showroom-3d`
5. Create strong password
6. Wait 2-3 minutes for setup

## 🔑 **Step 2: Get Credentials**
1. Go to **Settings** → **API**
2. Copy these two values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIs...` (long string)

## 🗄️ **Step 3: Setup Database**
1. Go to **SQL Editor** → **New Query**
2. Copy content from `supabase/migrations/20250914103042_still_darkness.sql`
3. Click **Run**
4. Repeat for other migration files in order

## ⚙️ **Step 4: Update Your Apps**

### **Web App:**
Create `.env` file:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

### **Mobile App:**
Update `mobile-app/src/services/supabase.ts`:
```typescript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIs...';
```

## ✅ **Step 5: Test**
1. Start web app: `npm run dev`
2. Try signing up
3. Check **Authentication** → **Users** in Supabase

**Done! Your backend is ready! 🎉**