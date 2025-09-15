# 📊 Sample Database Queries and Data Access

## 🔍 **Ready-to-Use SQL Queries**

Copy these queries into your Supabase SQL Editor to explore your data:

### **1. View All Tiles with Details**
```sql
SELECT 
  id,
  name,
  category,
  size,
  price,
  in_stock,
  showroom_id,
  created_at
FROM tiles 
ORDER BY created_at DESC;
```

### **2. Most Popular Tiles (by views)**
```sql
SELECT 
  t.name,
  t.category,
  t.price,
  tas.view_count,
  tas.apply_count,
  ROUND((tas.apply_count::float / NULLIF(tas.view_count, 0) * 100), 2) as conversion_rate
FROM tile_analytics_summary tas
JOIN tiles t ON t.id = tas.tile_id
WHERE tas.view_count > 0
ORDER BY tas.view_count DESC
LIMIT 10;
```

### **3. User Activity Summary**
```sql
SELECT 
  up.full_name,
  up.email,
  up.role,
  up.created_at as joined_date,
  COUNT(cf.id) as favorite_count
FROM user_profiles up
LEFT JOIN customer_favorites cf ON cf.customer_id = up.user_id
GROUP BY up.id, up.full_name, up.email, up.role, up.created_at
ORDER BY up.created_at DESC;
```

### **4. Seller Performance**
```sql
SELECT 
  ts.business_name,
  ts.subscription_status,
  COUNT(t.id) as total_tiles,
  SUM(tas.view_count) as total_views,
  SUM(tas.apply_count) as total_applications
FROM tile_sellers ts
LEFT JOIN tiles t ON t.seller_id = ts.user_id
LEFT JOIN tile_analytics_summary tas ON tas.tile_id = t.id
GROUP BY ts.id, ts.business_name, ts.subscription_status
ORDER BY total_views DESC NULLS LAST;
```

### **5. Recent Activity Log**
```sql
SELECT 
  ta.action_type,
  t.name as tile_name,
  ta.surface_type,
  ta.room_type,
  ta.timestamp,
  up.full_name as user_name
FROM tile_analytics ta
JOIN tiles t ON t.id = ta.tile_id
LEFT JOIN user_profiles up ON up.user_id = ta.customer_id
ORDER BY ta.timestamp DESC
LIMIT 20;
```

### **6. Category Performance**
```sql
SELECT 
  category,
  COUNT(*) as tile_count,
  AVG(price) as avg_price,
  SUM(COALESCE(tas.view_count, 0)) as total_views,
  SUM(COALESCE(tas.apply_count, 0)) as total_applications
FROM tiles t
LEFT JOIN tile_analytics_summary tas ON tas.tile_id = t.id
GROUP BY category
ORDER BY total_views DESC;
```

### **7. Customer Favorites Analysis**
```sql
SELECT 
  t.name,
  t.category,
  t.price,
  COUNT(cf.id) as favorite_count,
  COALESCE(tas.view_count, 0) as view_count
FROM tiles t
LEFT JOIN customer_favorites cf ON cf.tile_id = t.id
LEFT JOIN tile_analytics_summary tas ON tas.tile_id = t.id
GROUP BY t.id, t.name, t.category, t.price, tas.view_count
HAVING COUNT(cf.id) > 0
ORDER BY favorite_count DESC;
```

### **8. QR Code Status**
```sql
SELECT 
  COUNT(*) as total_tiles,
  COUNT(qr_code) as tiles_with_qr,
  COUNT(*) - COUNT(qr_code) as tiles_without_qr,
  ROUND((COUNT(qr_code)::float / COUNT(*) * 100), 2) as qr_coverage_percent
FROM tiles;
```

## 📊 **Data Export Queries**

### **Export All Tiles for CSV**
```sql
SELECT 
  id,
  name,
  category,
  size,
  price,
  in_stock,
  showroom_id,
  TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_date
FROM tiles
ORDER BY created_at DESC;
```

### **Export Analytics Report**
```sql
SELECT 
  t.name as tile_name,
  t.category,
  t.size,
  t.price,
  tas.view_count,
  tas.apply_count,
  CASE 
    WHEN tas.view_count > 0 
    THEN ROUND((tas.apply_count::float / tas.view_count * 100), 2)
    ELSE 0 
  END as conversion_rate,
  TO_CHAR(tas.last_viewed, 'YYYY-MM-DD') as last_viewed_date
FROM tiles t
LEFT JOIN tile_analytics_summary tas ON tas.tile_id = t.id
ORDER BY tas.view_count DESC NULLS LAST;
```

## 🔧 **Database Maintenance Queries**

### **Clean Up Old Analytics (older than 90 days)**
```sql
DELETE FROM tile_analytics 
WHERE timestamp < NOW() - INTERVAL '90 days';
```

### **Update Analytics Summary (manual refresh)**
```sql
-- This is automatically handled by triggers, but you can run manually
INSERT INTO tile_analytics_summary (tile_id, tile_name, showroom_id, category, view_count, apply_count)
SELECT 
  t.id,
  t.name,
  t.showroom_id,
  t.category,
  COALESCE(views.count, 0),
  COALESCE(applies.count, 0)
FROM tiles t
LEFT JOIN (
  SELECT tile_id, COUNT(*) as count
  FROM tile_analytics 
  WHERE action_type = 'view'
  GROUP BY tile_id
) views ON t.id = views.tile_id
LEFT JOIN (
  SELECT tile_id, COUNT(*) as count
  FROM tile_analytics 
  WHERE action_type = 'apply'
  GROUP BY tile_id
) applies ON t.id = applies.tile_id
ON CONFLICT (tile_id) DO UPDATE SET
  view_count = EXCLUDED.view_count,
  apply_count = EXCLUDED.apply_count,
  updated_at = now();
```

## 📱 **Sample Data for Testing**

### **Insert Sample Tiles**
```sql
INSERT INTO tiles (id, name, image_url, texture_url, category, size, price, in_stock, showroom_id) VALUES
('sample_1', 'Premium Marble White', 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg', 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg', 'both', '60x60 cm', 2500, true, 'showroom1'),
('sample_2', 'Oak Wood Pattern', 'https://images.pexels.com/photos/172277/pexels-photo-172277.jpeg', 'https://images.pexels.com/photos/172277/pexels-photo-172277.jpeg', 'floor', '20x120 cm', 1800, true, 'showroom1'),
('sample_3', 'Modern Gray Stone', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg', 'both', '30x60 cm', 2200, true, 'showroom1');
```

### **Insert Sample Analytics**
```sql
INSERT INTO tile_analytics (tile_id, showroom_id, action_type, timestamp) VALUES
('sample_1', 'showroom1', 'view', NOW() - INTERVAL '1 hour'),
('sample_1', 'showroom1', 'apply', NOW() - INTERVAL '30 minutes'),
('sample_2', 'showroom1', 'view', NOW() - INTERVAL '2 hours'),
('sample_3', 'showroom1', 'view', NOW() - INTERVAL '3 hours');
```

## 🎯 **Quick Database Health Check**
```sql
-- Check all tables and row counts
SELECT 
  schemaname,
  tablename,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

Use these queries in your Supabase SQL Editor to explore and manage your tile showroom database!