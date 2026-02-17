# 💰 Investment App

A comprehensive React-based investment analysis and calculation application with Android mobile support.

## 🌟 Features

### 📊 Investment Analysis

- Stock analysis and profit calculators
- Mutual fund calculators and checklists
- Bond investment tools
- Commodity analysis (Gold vs Silver ratio)

### 📱 Mobile App

- **Android APK** - Build and deploy as native Android app
- Production-ready builds with signing
- Play Store ready
- Optimized and secured

### 🎨 Modern Tech Stack

- React 19 with TypeScript
- Vite for blazing fast builds
- TailwindCSS for styling
- React Router for navigation
- React Hook Form for forms
- Capacitor for mobile builds

## 🚀 Quick Start

### Web Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### 📱 Android Development

```bash
# Install dependencies (first time)
npm install

# Generate release keystore (one-time)
npm run android:keystore

# Build production APK
npm run android:release
```

**Output:** `investment-app-release.apk` - Ready to install on Android!

## 📂 Project Structure

```
reactLearning/
├── src/                          # Source code
│   ├── pages/                    # Page components
│   ├── components/               # Reusable components
│   ├── hooks/                    # Custom React hooks
│   ├── stores/                   # Zustand state management
│   ├── utils/                    # Utility functions
│   └── config/                   # Configuration files
│
├── scripts/                      # Build & deployment scripts
│   ├── build-android-release.ps1 # Production APK builder
│   ├── generate-keystore.ps1     # Keystore generator
│   ├── setup-android-sdk.ps1     # SDK setup helper
│   └── README.md                 # Scripts documentation
│
├── docs/                         # Documentation
│   ├── android/                  # Android-specific docs
│   │   ├── README.md             # Android docs index
│   │   ├── PRODUCTION_APK_GUIDE.md
│   │   ├── ANDROID_DEPLOYMENT.md
│   │   └── ...
│   ├── ARCHITECTURE.md           # App architecture
│   ├── DEVELOPER_GUIDE.md        # Development guide
│   └── ...
│
├── android/                      # Android project files
│   ├── app/                      # Android app module
│   └── build.gradle              # Gradle configuration
│
├── public/                       # Static assets
├── dist/                         # Build output
└── package.json                  # Dependencies & scripts
```

## 🛠️ Available Commands

### Development

| Command           | Description                |
| ----------------- | -------------------------- |
| `npm run dev`     | Start development server   |
| `npm run build`   | Build for production (web) |
| `npm run preview` | Preview production build   |
| `npm run lint`    | Run ESLint                 |
| `npm run format`  | Format code with Prettier  |

### Android

| Command                    | Description                          |
| -------------------------- | ------------------------------------ |
| `npm run android:keystore` | Generate release keystore (one-time) |
| `npm run android:release`  | Build production APK                 |
| `npm run android:build`    | Build debug APK                      |
| `npm run android:open`     | Open in Android Studio               |
| `npm run android:sync`     | Sync changes to Android              |

### Deployment

| Command             | Description            |
| ------------------- | ---------------------- |
| `npm run deploy`    | Deploy to GitHub Pages |
| `npm run predeploy` | Pre-deployment build   |

## 📱 Building Android APK

### First Time Setup (5 minutes)

1. **Install Android Studio** (includes Android SDK)
   - Download: https://developer.android.com/studio
   - Complete setup wizard
   - Accept SDK licenses

2. **Generate Release Keystore**

   ```bash
   npm run android:keystore
   ```

   - Follow prompts to create your signing key
   - **Save passwords securely!**

3. **Build Production APK**
   ```bash
   npm run android:release
   ```

   - Output: `investment-app-release.apk`
   - Ready to install on any Android device
   - Ready for Google Play Store

### Features of Production APK

- ✅ **Signed** - With your release keystore
- ✅ **Optimized** - ProGuard obfuscation enabled
- ✅ **Minified** - Reduced APK size
- ✅ **Secured** - Code protection
- ✅ **Play Store Ready** - All requirements met

## 📖 Documentation

### For Android Development

- **[Android Documentation Index](docs/android/README.md)** - Start here
- **[Production APK Guide](docs/android/PRODUCTION_APK_GUIDE.md)** - Complete build guide
- **[Android Deployment](docs/android/ANDROID_DEPLOYMENT.md)** - Play Store publishing

### For Web Development

- **[Developer Guide](docs/DEVELOPER_GUIDE.md)** - Development guidelines
- **[Architecture](docs/ARCHITECTURE.md)** - App architecture
- **[Setup Guide](docs/SETUP_GUIDE.md)** - Initial setup

### Build Scripts

- **[Scripts Documentation](scripts/README.md)** - All build scripts explained

## 🔒 Security & Best Practices

### Development

- Environment variables in `.env` (not committed)
- Code sanitization enabled
- Input validation with Zod
- Security-first architecture

### Android Production

- Release keystore secured (not in git)
- ProGuard code obfuscation
- Resource shrinking enabled
- Minimal permissions

### Files Never to Commit

```
android/keystore.properties      # Contains passwords
android/*.keystore              # Your signing key
android/local.properties        # SDK paths
.env                           # Environment variables
```

## 🎯 Key Features

### Investment Tools

- **Stock Calculator** - Profit/loss calculations
- **Mutual Fund Calculator** - SIP & lumpsum planning
- **Bond Calculator** - Fixed income analysis
- **Commodity Analysis** - Gold/Silver ratio tracking

### Checklists

- Stock investment checklist
- Mutual fund selection checklist
- Bond investment checklist
- Before-investing checklists

### Technical Features

- Responsive design (mobile-first)
- Dark mode support
- Offline capability (Android)
- Fast performance (Vite)
- Type-safe (TypeScript)
- State management (Zustand)
- Form handling (React Hook Form)
- Data validation (Zod)

## 🔧 Tech Stack

### Frontend

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Navigation

### Mobile

- **Capacitor** - Native bridge
- **Android SDK** - Native platform
- **Gradle** - Build system

### Development Tools

- **ESLint** - Linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit checks

### State & Data

- **Zustand** - State management
- **React Query** - Server state
- **React Hook Form** - Forms
- **Zod** - Schema validation

## 📊 Project Stats

- **Type:** Single Page Application (SPA) + Android App
- **Deployment:** GitHub Pages (web) + APK (mobile)
- **License:** Private
- **Node Version:** 18+
- **Package Manager:** npm

## 🤝 Contributing

This is a private project. Development guidelines:

1. Follow the [Developer Guide](docs/DEVELOPER_GUIDE.md)
2. Write type-safe code
3. Follow code formatting (Prettier)
4. Pass linting checks (ESLint)
5. Test on both web and Android

## 📱 Testing Android APK

### On Physical Device

```bash
# Enable USB debugging on your device
adb install investment-app-release.apk
```

### Manual Installation

1. Copy APK to your Android device
2. Enable "Install from Unknown Sources" in Settings
3. Tap the APK file to install

### Testing Checklist

- [ ] App launches successfully
- [ ] All pages navigate correctly
- [ ] Calculators work properly
- [ ] Data persists correctly
- [ ] No crashes or errors

## 🚢 Deployment

### Web (GitHub Pages)

```bash
npm run deploy
```

- Automatically builds and deploys
- Live at: https://ravi-royal.github.io/reactLearning

### Android (Play Store)

1. Build production APK: `npm run android:release`
2. Test APK thoroughly
3. Create Play Console account ($25 one-time fee)
4. Upload APK to Play Console
5. Complete store listing
6. Submit for review

See [Android Deployment Guide](docs/android/ANDROID_DEPLOYMENT.md) for details.

## 🆘 Getting Help

### Quick Fixes

- **"SDK not found"** → Run `.\scripts\setup-android-sdk.ps1`
- **"Keystore not found"** → Run `npm run android:keystore`
- **Build fails** → Check [Troubleshooting Guide](docs/android/PRODUCTION_APK_GUIDE.md#-troubleshooting)

### Documentation

- Check relevant documentation in `docs/` folder
- Review script documentation in `scripts/README.md`
- See inline code comments

## 📝 Version History

- **v0.0.0** - Initial development version
- Android support added
- Production build system implemented

## 📄 License

Private project. All rights reserved.

---

## 🎉 Quick Links

- **[🎓 Developer Guide](docs/DEVELOPER_GUIDE.md)** - Start developing
- **[📱 Android Docs](docs/android/README.md)** - Build Android app
- **[🔧 Build Scripts](scripts/README.md)** - Available scripts
- **[🏗️ Architecture](docs/ARCHITECTURE.md)** - App structure

---

**Made with ❤️ using React + TypeScript**

**Web:** https://ravi-royal.github.io/reactLearning  
**Mobile:** Build with `npm run android:release`
