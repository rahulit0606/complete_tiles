# Tile Showroom 3D - Multi-Domain SaaS Platform

A comprehensive 3D tile visualization platform with multi-tenant architecture supporting customers, sellers, and platform administrators.

## 🌐 Multi-Domain Architecture

### Domain Structure
- **customers.yourdomain.com** - Customer portal for browsing and visualizing tiles
- **seller.yourdomain.com** - Seller dashboard for tile management and analytics  
- **admin.yourdomain.com** - Admin panel for platform management

### Development URLs
For local development, the system uses path-based routing:
- `http://localhost:5173/` - Customer portal
- `http://localhost:5173/seller` - Seller dashboard
- `http://localhost:5173/admin` - Admin panel

## 👥 User Roles

### 🛒 Customers
- Browse tile catalog with 3D visualization
- Apply tiles to different room types (hall, washroom, kitchen)
- Save favorite tiles (requires authentication)
- Guest browsing without registration

### 🏪 Tile Sellers
- Upload and manage tile inventory
- Bulk CSV import functionality
- View analytics for their tiles only
- Business profile management
- Track views, applications, and conversions

### 🛡️ Platform Admin
- Oversee all sellers and their data
- Platform-wide analytics and insights
- Seller management and onboarding
- System health monitoring
- Revenue and subscription tracking

## 🚀 Features

### Customer Portal
- **3D Room Visualization**: Interactive 3D rooms (hall, washroom, kitchen)
- **Tile Application**: Apply different tiles to floors and walls
- **Favorites System**: Save and manage favorite tiles
- **Advanced Search**: Filter by category, size, price
- **Responsive Design**: Works on all devices

### Seller Dashboard
- **Tile Management**: CRUD operations for tile inventory
- **Bulk Upload**: CSV-based bulk tile import
- **Analytics Dashboard**: Views, applications, conversion rates
- **Business Profile**: Company information and branding
- **Stock Management**: Track inventory status

### Admin Panel
- **Platform Overview**: Key metrics and system health
- **Seller Management**: View all registered sellers
- **Cross-Seller Analytics**: Platform-wide insights
- **User Management**: Monitor user activity
- **Revenue Tracking**: Subscription and payment status

## 🛠️ Technical Stack

- **Frontend**: React 18 + TypeScript + Vite
- **3D Graphics**: Three.js + React Three Fiber
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tile-showroom-3d
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run database migrations**
   - Go to your Supabase dashboard
   - Run the SQL migrations from `supabase/migrations/`

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🌍 Domain Configuration

### Production Setup
1. **DNS Configuration**:
   - Point `customers.yourdomain.com` to your server
   - Point `seller.yourdomain.com` to your server  
   - Point `admin.yourdomain.com` to your server

2. **Server Configuration**:
   - Configure your web server to serve the same app for all subdomains
   - The app will automatically detect the domain and show appropriate interface

### Development Setup
- Use `localhost:5173` for customer portal
- Use `localhost:5173/seller` for seller dashboard
- Use `localhost:5173/admin` for admin panel

## 🔐 Security Features

- **Row Level Security (RLS)**: Database-level access control
- **Role-based Access Control**: Domain and feature restrictions
- **Authentication Required**: Secure user management
- **Data Isolation**: Sellers can only see their own data
- **Admin Oversight**: Full platform visibility for administrators

## 📊 Analytics & Insights

### Customer Analytics
- Tile view tracking
- Application behavior
- Favorite patterns
- Room type preferences

### Seller Analytics  
- Tile performance metrics
- View-to-application conversion
- Popular tile categories
- Time-based trends

### Platform Analytics
- Cross-seller comparisons
- Platform growth metrics
- User engagement patterns
- Revenue insights

## 🎨 Customization

### Domain Theming
Each domain has its own color scheme:
- **Customer**: Blue theme (#2563eb)
- **Seller**: Green theme (#059669)  
- **Admin**: Purple theme (#7c3aed)

### Tile Categories
- **Floor Only**: Tiles suitable for flooring
- **Wall Only**: Tiles suitable for walls
- **Both**: Versatile tiles for floors and walls

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your hosting provider**
   - Upload `dist/` folder to your server
   - Configure domain routing
   - Set up SSL certificates for all subdomains

3. **Environment Variables**
   - Set production Supabase credentials
   - Configure domain-specific settings

## 📈 Business Model

- **SaaS Platform**: Sell to multiple tile sellers
- **Subscription Tiers**: Different feature levels
- **Revenue Sharing**: Commission-based model
- **White Label**: Customizable branding
- **Multi-Tenant**: Isolated seller data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for the tile industry**