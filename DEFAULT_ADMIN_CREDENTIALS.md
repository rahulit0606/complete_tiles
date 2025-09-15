# 🔑 Default Admin Credentials

## 🚨 **IMPORTANT: Create Admin User First**

Before you can use these credentials, you need to create the admin user in Supabase:

### **Step 1: Create Admin User in Supabase**
1. Go to your **Supabase Dashboard**
2. Navigate to **Authentication** → **Users**
3. Click **"Add user"**
4. Fill in the details:
   - **Email**: `admin@tileshowroom.com`
   - **Password**: `Admin123!@#`
   - **Email Confirm**: ✅ (check this box)
   - **User Metadata**: Add this JSON:
     ```json
     {
       "role": "admin",
       "full_name": "System Administrator"
     }
     ```
5. Click **"Create user"**

### **Step 2: Access Admin Panel**
Once the user is created, you can access the admin panel:

**🌐 Admin Panel URL**: https://3d-tile-showroom-vis-4j8b.bolt.host/admin

**🔑 Login Credentials**:
- **Email**: `admin@tileshowroom.com`
- **Password**: `Admin123!@#`

## 🎯 **Admin Panel Features**

Once logged in as admin, you can:

### **✅ Seller Management**
- View all registered sellers
- Create new seller accounts
- Manage seller subscriptions
- View seller analytics

### **✅ Platform Analytics**
- View platform-wide statistics
- Monitor tile performance across all sellers
- Track user engagement
- Generate reports

### **✅ System Management**
- Manage all tiles across all sellers
- Override seller settings
- Platform configuration
- User role management

## 🔐 **Security Notes**

1. **Change the default password** immediately after first login
2. **Use a strong, unique password** for production
3. **Enable 2FA** if available in your Supabase project
4. **Limit admin access** to trusted personnel only

## 🚀 **Getting Started**

1. **Create the admin user** in Supabase (Step 1 above)
2. **Visit the admin panel**: https://3d-tile-showroom-vis-4j8b.bolt.host/admin
3. **Sign in** with the credentials above
4. **Create your first seller** using the "Create Seller" tab
5. **Start managing** your tile showroom platform!

---

**⚠️ Remember to change the default password after first login!**