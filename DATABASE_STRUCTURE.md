# 🏗️ Complete Database Structure Overview

## 📊 **Database Architecture**

Your Tile Showroom 3D platform uses a **PostgreSQL database** hosted on Supabase with the following structure:

```
🗄️ Tile Showroom Database
├── 🔐 Authentication (Supabase Auth)
│   └── auth.users (built-in user management)
│
├── 👥 User Management
│   ├── user_profiles (user info & roles)
│   └── tile_sellers (business information)
│
├── 🏺 Product Catalog
│   ├── tiles (main product table)
│   └── customer_favorites (user favorites)
│
└── 📈 Analytics & Tracking
    ├── tile_analytics (raw events)
    ├── tile_analytics_summary (aggregated data)
    ├── most_viewed_tiles (view)
    └── most_tried_tiles (view)
```

## 🔍 **Detailed Table Breakdown**

### **1. Core Tables**

#### **`tiles` - Main Product Catalog**
| Column | Type | Description |
|--------|------|-------------|
| `id` | text | Unique tile identifier |
| `name` | text | Tile display name |
| `image_url` | text | Product image URL |
| `texture_url` | text | 3D texture image URL |
| `category` | enum | 'floor', 'wall', or 'both' |
| `size` | text | Dimensions (e.g., "60x60 cm") |
| `price` | numeric | Price in currency |
| `in_stock` | boolean | Availability status |
| `showroom_id` | text | Associated showroom |
| `seller_id` | uuid | Owner (references auth.users) |
| `qr_code` | text | Base64 QR code image |
| `qr_code_url` | text | QR code access URL |
| `created_at` | timestamp | Creation date |
| `updated_at` | timestamp | Last modification |

#### **`user_profiles` - User Information**
| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Profile ID |
| `user_id` | uuid | References auth.users |
| `email` | text | User email |
| `full_name` | text | Display name |
| `role` | enum | 'customer', 'seller', 'admin' |
| `created_at` | timestamp | Registration date |
| `updated_at` | timestamp | Last profile update |

#### **`tile_sellers` - Business Information**
| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Seller ID |
| `user_id` | uuid | References auth.users |
| `business_name` | text | Company name |
| `business_address` | text | Physical address |
| `phone` | text | Contact number |
| `website` | text | Business website |
| `logo_url` | text | Company logo |
| `subscription_status` | enum | 'active', 'inactive', 'suspended' |
| `created_at` | timestamp | Registration date |
| `updated_at` | timestamp | Last update |

### **2. Analytics Tables**

#### **`tile_analytics` - Raw Event Tracking**
| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Event ID |
| `tile_id` | text | References tiles.id |
| `showroom_id` | text | Showroom context |
| `action_type` | enum | 'view' or 'apply' |
| `surface_type` | enum | 'floor' or 'wall' |
| `room_type` | enum | 'hall', 'washroom', 'kitchen' |
| `customer_id` | uuid | User (if authenticated) |
| `timestamp` | timestamp | Event time |
| `session_id` | text | Session tracking |
| `user_agent` | text | Browser/device info |

#### **`tile_analytics_summary` - Aggregated Data**
| Column | Type | Description |
|--------|------|-------------|
| `tile_id` | text | References tiles.id |
| `tile_name` | text | Cached tile name |
| `showroom_id` | text | Showroom context |
| `category` | text | Cached category |
| `view_count` | integer | Total views |
| `apply_count` | integer | Total applications |
| `last_viewed` | timestamp | Most recent view |
| `last_applied` | timestamp | Most recent application |
| `updated_at` | timestamp | Last calculation |

#### **`customer_favorites` - User Preferences**
| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Favorite ID |
| `customer_id` | uuid | References auth.users |
| `tile_id` | text | References tiles.id |
| `showroom_id` | text | Showroom context |
| `created_at` | timestamp | When favorited |

### **3. Database Views**

#### **`most_viewed_tiles` - Popular Tiles**
```sql
SELECT 
  tile_id,
  tile_name,
  showroom_id,
  category,
  view_count,
  last_viewed,
  ROW_NUMBER() OVER (PARTITION BY showroom_id ORDER BY view_count DESC) as rank
FROM tile_analytics_summary
WHERE view_count > 0;
```

#### **`most_tried_tiles` - Most Applied Tiles**
```sql
SELECT 
  tile_id,
  tile_name,
  showroom_id,
  category,
  apply_count,
  last_applied,
  ROW_NUMBER() OVER (PARTITION BY showroom_id ORDER BY apply_count DESC) as rank
FROM tile_analytics_summary
WHERE apply_count > 0;
```

## 🔐 **Security Model (Row Level Security)**

### **Access Control by Role:**

#### **Customers:**
- ✅ View all tiles (public)
- ✅ Manage own favorites
- ✅ Track own analytics
- ❌ Cannot modify tiles
- ❌ Cannot see other users' data

#### **Sellers:**
- ✅ View all tiles (public)
- ✅ Manage own tiles only
- ✅ View own analytics only
- ✅ Manage business profile
- ❌ Cannot see other sellers' data

#### **Admins:**
- ✅ Full access to all data
- ✅ Manage all tiles
- ✅ View all analytics
- ✅ Manage all users
- ✅ Platform oversight

### **RLS Policies Examples:**
```sql
-- Sellers can only manage their own tiles
CREATE POLICY "Sellers can manage own tiles"
  ON tiles FOR ALL TO authenticated
  USING (auth.uid() = seller_id);

-- Customers can only see their own favorites
CREATE POLICY "Customers can manage own favorites"
  ON customer_favorites FOR ALL TO authenticated
  USING (auth.uid() = customer_id);
```

## 📊 **Data Relationships**

```
auth.users (Supabase)
├── user_profiles (1:1)
├── tile_sellers (1:1, if seller)
├── tiles (1:many, if seller)
├── customer_favorites (1:many, if customer)
└── tile_analytics (1:many)

tiles
├── tile_analytics (1:many)
├── tile_analytics_summary (1:1)
└── customer_favorites (1:many)
```

## 🔄 **Automated Processes**

### **Triggers:**
1. **User Profile Creation**: Auto-creates profile when user signs up
2. **Analytics Summary Update**: Updates aggregated data on new analytics events

### **Functions:**
```sql
-- Auto-create user profile
CREATE FUNCTION create_user_profile()
-- Update analytics summary
CREATE FUNCTION update_tile_analytics_summary()
```

## 📈 **Performance Optimizations**

### **Indexes:**
- `idx_tiles_showroom_id` - Fast showroom queries
- `idx_tile_analytics_tile_id` - Analytics lookups
- `idx_user_profiles_role` - Role-based queries
- `idx_customer_favorites_customer_id` - User favorites

### **Views for Performance:**
- Pre-calculated most viewed/tried tiles
- Aggregated analytics summaries
- Optimized for dashboard queries

## 💾 **Data Storage Estimates**

| Table | Estimated Size per 1000 Records |
|-------|--------------------------------|
| tiles | ~500KB |
| tile_analytics | ~200KB |
| user_profiles | ~100KB |
| customer_favorites | ~50KB |

## 🔧 **Maintenance Tasks**

### **Regular Cleanup:**
- Archive old analytics data (>90 days)
- Clean up orphaned records
- Refresh materialized views

### **Monitoring:**
- Track database size growth
- Monitor query performance
- Check RLS policy effectiveness

This database structure supports a scalable, multi-tenant SaaS platform with proper security, analytics, and user management!