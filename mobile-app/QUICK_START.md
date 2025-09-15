# 🚀 Quick Start - Get App on Phone in 5 Minutes

## **Fastest Method: Expo Go**

### **1. Install Expo Go App**
- **Android**: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)

### **2. Configure Supabase (Important!)**
```bash
cd mobile-app
```

Edit `src/services/supabase.ts` and replace:
```typescript
const SUPABASE_URL = 'your_actual_supabase_url';
const SUPABASE_ANON_KEY = 'your_actual_supabase_anon_key';
```

**Get these from**: Supabase Dashboard → Settings → API

### **3. Start Development Server**
```bash
npm install
npm start
```

### **4. Scan QR Code**
1. QR code appears in terminal
2. Open **Expo Go** on your phone
3. **Scan QR code** with Expo Go
4. App loads on your phone! 🎉

### **5. Test the App**
1. **Generate QR codes** from web app first (Seller Dashboard → QR Codes)
2. **Scan QR codes** with mobile app
3. **View tiles in 3D**
4. **Test favorites** (sign up/sign in)

---

## **For APK File (Standalone App)**

```bash
# Install tools
npm install -g @expo/cli eas-cli

# Login to Expo
eas login

# Build APK
cd mobile-app
eas build --platform android --profile preview
```

**Result**: Download link for APK file (takes 10-15 minutes)

---

## **⚡ Super Quick Test**

1. **Download Expo Go** on your phone
2. **Run `npm start`** in mobile-app folder  
3. **Scan QR code** with Expo Go
4. **Done!** App is running on your phone

**Note**: Make sure to configure Supabase credentials first!