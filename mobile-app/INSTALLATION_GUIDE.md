# 📱 How to Get the Tile Showroom Mobile App on Your Phone

There are **3 main ways** to get the mobile app on your phone, from quickest to most permanent:

## 🚀 **Method 1: Expo Go (Fastest - 5 minutes)**

This is the **quickest way** to test the app immediately:

### **Step 1: Install Expo Go**
- **Android**: Download from [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: Download from [App Store](https://apps.apple.com/app/expo-go/id982107779)

### **Step 2: Configure Supabase**
```bash
# Navigate to mobile app folder
cd mobile-app

# Edit the Supabase configuration
# Open src/services/supabase.ts and replace:
const SUPABASE_URL = 'your_actual_supabase_url';
const SUPABASE_ANON_KEY = 'your_actual_supabase_anon_key';
```

### **Step 3: Start Development Server**
```bash
# Install dependencies
npm install

# Start the development server
npm start
```

### **Step 4: Scan QR Code**
1. A QR code will appear in your terminal/browser
2. Open **Expo Go** app on your phone
3. **Scan the QR code** with Expo Go
4. The app will load directly on your phone!

**✅ Pros**: Instant, no build process, hot reload
**❌ Cons**: Requires Expo Go app, development mode only

---

## 🔧 **Method 2: EAS Build APK (Recommended for Testing)**

This creates a **standalone APK** you can install and share:

### **Step 1: Install Build Tools**
```bash
# Install Expo CLI and EAS CLI
npm install -g @expo/cli eas-cli
```

### **Step 2: Setup Project**
```bash
cd mobile-app
npm install

# Configure Supabase credentials in src/services/supabase.ts
```

### **Step 3: Login to Expo**
```bash
eas login
# Create account if you don't have one
```

### **Step 4: Configure Build**
```bash
eas build:configure
# This creates eas.json configuration
```

### **Step 5: Build APK**
```bash
# Build APK for testing
eas build --platform android --profile preview
```

### **Step 6: Download & Install**
1. Build takes **10-15 minutes**
2. You'll get a **download link** when ready
3. Download APK to your phone
4. **Install APK** (enable "Install from unknown sources" if needed)

**✅ Pros**: Standalone app, shareable, production-like
**❌ Cons**: Takes time to build, requires Expo account

---

## 📦 **Method 3: Local Android Build (Advanced)**

For developers who want full control:

### **Prerequisites**
- Android Studio installed
- Android SDK configured
- Java Development Kit (JDK)

### **Steps**
```bash
cd mobile-app

# Eject from Expo (creates native Android project)
npx expo eject

# Build debug APK
cd android
./gradlew assembleDebug

# Find APK at: android/app/build/outputs/apk/debug/app-debug.apk
```

**✅ Pros**: Full control, no external dependencies
**❌ Cons**: Complex setup, requires Android development environment

---

## 🎯 **Quick Start Recommendation**

### **For Immediate Testing**: Use **Method 1 (Expo Go)**
```bash
cd mobile-app
npm install
npm start
# Scan QR with Expo Go app
```

### **For Sharing with Others**: Use **Method 2 (EAS Build)**
```bash
cd mobile-app
npm install -g @expo/cli eas-cli
eas login
eas build --platform android --profile preview
```

---

## 📋 **Before You Start Checklist**

- [ ] **Supabase Setup**: Make sure your web app is working with Supabase
- [ ] **QR Codes Generated**: Create QR codes from web app (Seller Dashboard)
- [ ] **Phone Ready**: Android phone with camera permissions
- [ ] **Network**: Stable internet connection

---

## 🔧 **Configuration Required**

### **Update Supabase Credentials**
Edit `mobile-app/src/services/supabase.ts`:
```typescript
// Replace these with your actual Supabase credentials
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### **Get Supabase Credentials**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings → API**
4. Copy **Project URL** and **anon public key**

---

## 🧪 **Testing the App**

Once installed, test these features:

### **1. QR Code Scanning**
- Generate QR codes from web app
- Print or display QR code on screen
- Scan with mobile app camera

### **2. 3D Visualization**
- Select room type (Hall, Washroom, Kitchen)
- Apply tiles to floor/wall surfaces
- View in interactive 3D

### **3. User Features**
- Sign up/Sign in
- Add tiles to favorites
- Sync favorites with web app

---

## 🚨 **Troubleshooting**

### **Expo Go Issues**
- Make sure phone and computer are on same WiFi
- Try restarting Expo development server
- Clear Expo Go cache in app settings

### **APK Installation Issues**
- Enable "Install from unknown sources" in Android settings
- Check if APK download completed successfully
- Try downloading APK again if corrupted

### **Camera/QR Scanner Issues**
- Grant camera permissions when prompted
- Ensure QR codes are well-lit and clear
- Try different QR code sizes (minimum 2x2 inches recommended)

### **3D Rendering Issues**
- Ensure device supports OpenGL ES 2.0+
- Close other apps to free memory
- Try restarting the app

---

## 📞 **Need Help?**

If you encounter issues:
1. Check the troubleshooting section above
2. Verify Supabase credentials are correct
3. Ensure QR codes are generated from web app
4. Test with a simple QR code first

---

**🎉 Ready to experience your tiles in 3D on mobile!**