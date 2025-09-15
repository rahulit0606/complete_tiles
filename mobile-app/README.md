# Tile Showroom 3D Mobile App

A React Native mobile application for the Tile Showroom 3D platform that allows customers to scan QR codes on physical tiles and view them in 3D visualization.

## 🚀 Features

### 📱 **Core Functionality**
- **QR Code Scanning**: Scan QR codes on physical tiles for instant access
- **3D Tile Visualization**: View tiles applied to different room types in 3D
- **Tile Catalog**: Browse and search through available tiles
- **Favorites System**: Save and manage favorite tiles (requires authentication)
- **User Authentication**: Sign up/sign in to sync favorites across devices

### 🏠 **Room Types**
- **Living Hall**: Floor tile application with furniture
- **Washroom**: Floor and wall tile application with fixtures
- **Kitchen**: Floor and wall tile application with appliances

### 🔍 **QR Code Integration**
- **Universal Compatibility**: Works with any QR code reader
- **Instant Tile Loading**: Automatically loads tile details from database
- **Analytics Tracking**: Tracks tile views and applications
- **Error Handling**: Graceful handling of invalid or expired QR codes

## 📋 Prerequisites

- Node.js (v16 or higher)
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)
- Supabase account and project

## 🛠️ Installation

1. **Navigate to mobile app directory**
   ```bash
   cd mobile-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase**
   - Update `src/services/supabase.ts` with your Supabase credentials:
   ```typescript
   const SUPABASE_URL = 'your_supabase_project_url';
   const SUPABASE_ANON_KEY = 'your_supabase_anon_key';
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

## 📱 App Structure

```
mobile-app/
├── src/
│   ├── screens/           # App screens
│   │   ├── HomeScreen.tsx         # Tile catalog and search
│   │   ├── QRScannerScreen.tsx    # QR code scanning
│   │   ├── TileViewScreen.tsx     # Tile details and application
│   │   ├── Room3DScreen.tsx       # 3D room visualization
│   │   ├── FavoritesScreen.tsx    # User favorites
│   │   └── ProfileScreen.tsx      # User profile and auth
│   ├── context/           # React Context providers
│   │   ├── AuthContext.tsx        # Authentication state
│   │   └── TileContext.tsx        # Tile and room state
│   └── services/          # API and external services
│       └── supabase.ts            # Supabase client and functions
├── App.tsx               # Main app component with navigation
├── app.json             # Expo configuration
└── package.json         # Dependencies and scripts
```

## 🎯 Key Screens

### **Home Screen**
- Browse tile catalog with search and filtering
- Quick access to QR scanner
- Favorite tiles management (authenticated users)

### **QR Scanner Screen**
- Camera-based QR code scanning
- Real-time QR code detection
- Flash toggle and scan controls
- Error handling for invalid codes

### **Tile View Screen**
- Detailed tile information
- Room type selection
- Surface application (floor/wall)
- 3D view navigation

### **Room 3D Screen**
- Interactive 3D room visualization
- Applied tile textures
- Room-specific furniture and fixtures
- Touch controls (zoom, rotate)

### **Favorites Screen**
- Personal tile collection
- Quick access to saved tiles
- Remove from favorites functionality

### **Profile Screen**
- User authentication (sign up/sign in)
- Account management
- App settings and information

## 🔧 Configuration

### **Camera Permissions**
The app requires camera permissions for QR code scanning. Permissions are automatically requested when accessing the scanner.

### **Supabase Integration**
- Real-time data synchronization
- User authentication and profiles
- Tile analytics tracking
- Favorites management

### **3D Rendering**
- Uses Expo GL and Three.js for 3D visualization
- Optimized for mobile performance
- Texture loading and caching

## 📊 Analytics & Tracking

The app automatically tracks:
- **Tile Views**: When tiles are viewed via QR scan or catalog
- **Tile Applications**: When tiles are applied to room surfaces
- **User Engagement**: Favorites, room selections, and interactions

## 🚀 Building for Production

### **Android**
```bash
npm run build:android
```

### **iOS**
```bash
npm run build:ios
```

## 🔗 Integration with Web App

The mobile app seamlessly integrates with the web platform:
- **Shared Database**: Same Supabase backend
- **QR Code Compatibility**: QR codes work on both platforms
- **User Sync**: Favorites and preferences sync across devices
- **Analytics**: Unified tracking across web and mobile

## 📱 QR Code Workflow

1. **Physical Setup**: Sellers print and attach QR codes to tiles
2. **Customer Scan**: Customers scan QR codes with the mobile app
3. **Instant Loading**: App fetches tile data from database
4. **3D Visualization**: Tile is loaded into 3D room view
5. **Analytics**: View and interaction data is tracked

## 🎨 Design System

- **Colors**: Consistent with web app (Blue primary: #2563eb)
- **Typography**: System fonts with proper hierarchy
- **Icons**: Ionicons for consistent iconography
- **Spacing**: 8px grid system for consistent layouts

## 🔒 Security

- **Secure Authentication**: Supabase Auth with JWT tokens
- **Data Privacy**: User data encrypted and secured
- **Permission Handling**: Proper camera permission management
- **Error Boundaries**: Graceful error handling throughout the app

## 🚀 Future Enhancements

- **Offline Mode**: Cache tiles for offline viewing
- **AR Integration**: Augmented reality tile placement
- **Social Features**: Share favorite tiles with others
- **Push Notifications**: New tile alerts and updates
- **Advanced Filters**: More sophisticated search and filtering

## 📞 Support

For technical support or questions about the mobile app:
- Check the main project README
- Review Supabase documentation
- Contact the development team

---

**Built with React Native, Expo, and Three.js for an immersive tile shopping experience! 📱✨**