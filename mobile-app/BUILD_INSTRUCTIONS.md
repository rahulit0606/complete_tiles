# Building APK for Tile Showroom 3D Mobile App

This guide explains how to generate an APK file for testing the Tile Showroom 3D mobile app.

## 🚀 Quick Start Options

### **Option 1: Expo Development Build (Recommended for Testing)**

1. **Install Expo CLI and EAS CLI**
   ```bash
   npm install -g @expo/cli eas-cli
   ```

2. **Navigate to mobile app directory**
   ```bash
   cd mobile-app
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Configure Supabase credentials**
   - Edit `src/services/supabase.ts`
   - Replace placeholder URLs with your actual Supabase credentials:
   ```typescript
   const SUPABASE_URL = 'your_actual_supabase_url';
   const SUPABASE_ANON_KEY = 'your_actual_supabase_anon_key';
   ```

5. **Login to Expo**
   ```bash
   eas login
   ```

6. **Configure EAS project**
   ```bash
   eas build:configure
   ```

7. **Build APK for testing**
   ```bash
   eas build --platform android --profile preview
   ```

8. **Download APK**
   - After build completes, you'll get a download link
   - Install the APK on your Android device for testing

### **Option 2: Local Development with Expo Go (Fastest)**

1. **Install Expo Go app** on your Android device from Google Play Store

2. **Start development server**
   ```bash
   cd mobile-app
   npm start
   ```

3. **Scan QR code** with Expo Go app to run the app instantly

### **Option 3: Android Studio Build (Advanced)**

1. **Eject from Expo** (if you need native Android features)
   ```bash
   npx expo eject
   ```

2. **Open in Android Studio**
   ```bash
   cd android
   ./gradlew assembleDebug
   ```

3. **Find APK** in `android/app/build/outputs/apk/debug/`

## 📱 **Testing Workflow**

### **For QR Code Testing:**
1. **Generate QR codes** from the web app (Seller Dashboard → QR Codes)
2. **Print QR codes** or display them on screen
3. **Install APK** on Android device
4. **Open app** and go to Scanner tab
5. **Scan QR codes** to test the full workflow

### **Test Scenarios:**
- ✅ QR code scanning and tile loading
- ✅ 3D room visualization with applied tiles
- ✅ User authentication and favorites sync
- ✅ Tile catalog browsing and search
- ✅ Cross-platform data synchronization

## 🔧 **Build Configurations**

### **Development Build** (`eas build --profile development`)
- **Purpose**: Testing with development tools
- **Features**: Hot reload, debugging, development warnings
- **Size**: Larger file size due to development tools

### **Preview Build** (`eas build --profile preview`)
- **Purpose**: Testing production-like experience
- **Features**: Optimized performance, smaller size
- **Recommended**: For stakeholder testing and demos

### **Production Build** (`eas build --profile production`)
- **Purpose**: App store submission
- **Features**: Fully optimized, signed for release
- **Format**: AAB (Android App Bundle) for Google Play

## 📋 **Prerequisites Checklist**

- [ ] Node.js installed (v16+)
- [ ] Expo CLI installed globally
- [ ] EAS CLI installed globally
- [ ] Expo account created
- [ ] Supabase credentials configured
- [ ] Android device for testing
- [ ] QR codes generated from web app

## 🚨 **Common Issues & Solutions**

### **Build Fails**
- Check Supabase credentials are correct
- Ensure all dependencies are installed
- Verify Expo account is properly logged in

### **QR Scanner Not Working**
- Grant camera permissions when prompted
- Ensure QR codes are generated from the web app
- Test with well-lit QR codes

### **3D View Not Loading**
- Check device OpenGL ES support
- Ensure texture URLs are accessible
- Test with different tile textures

## 📊 **Performance Tips**

- **Image Optimization**: Use compressed images for better performance
- **Texture Caching**: Textures are cached for faster loading
- **Memory Management**: 3D scenes are optimized for mobile devices

## 🔗 **Integration Testing**

1. **Web App Setup**: Ensure web app is running with QR codes generated
2. **Database Sync**: Verify Supabase connection works
3. **Cross-Platform**: Test favorites sync between web and mobile
4. **Analytics**: Confirm tracking works for scans and views

## 📱 **Distribution Options**

### **Internal Testing**
- Share APK file directly with testers
- Use Firebase App Distribution for organized testing
- TestFlight for iOS testing

### **Beta Testing**
- Google Play Console Internal Testing
- Expo's internal distribution system
- Direct APK sharing with stakeholders

---

**Ready to build your APK and start testing the mobile tile showroom experience! 🚀📱**