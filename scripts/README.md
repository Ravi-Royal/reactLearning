# 🔧 Build Scripts

PowerShell scripts for Android development and deployment.

## 📜 Available Scripts

### Production Release

**`build-android-release.ps1`**

- Builds production-ready, signed APK
- Includes ProGuard obfuscation
- Enables resource shrinking
- Outputs optimized APK

**Usage:**

```bash
npm run android:release
# or
.\scripts\build-android-release.ps1
```

**Output:**

- `android/app/build/outputs/apk/release/app-release.apk`
- `investment-app-release.apk` (copied to root)

---

### Keystore Generator

**`generate-keystore.ps1`**

- Creates release signing keystore
- Generates `keystore.properties`
- One-time setup for production builds

**Usage:**

```bash
npm run android:keystore
# or
.\scripts\generate-keystore.ps1
```

**Output:**

- `android/investment-app-release.keystore`
- `android/keystore.properties`

**⚠️ Important:** Backup the keystore and save passwords securely!

---

### Android SDK Setup

**`setup-android-sdk.ps1`**

- Finds or installs Android SDK
- Configures `local.properties`
- Builds React app
- Syncs to Android
- Generates APK

**Usage:**

```bash
.\scripts\setup-android-sdk.ps1
```

**Use Cases:**

- First-time setup
- SDK not found errors
- Quick complete build

---

### General Build Script

**`android-build.ps1`**

- Quick Android builds
- Development workflow
- Opens Android Studio

**Usage:**

```bash
.\scripts\android-build.ps1 [-Debug] [-Release] [-Open]
```

**Options:**

- `-Debug` - Build debug APK
- `-Release` - Build release APK
- `-Open` - Open Android Studio

---

## 🚀 Quick Reference

```bash
# First time setup
npm run android:keystore          # Generate keystore
npm run android:release           # Build production APK

# Development
npm run android:build             # Build debug APK
npm run android:open             # Open Android Studio

# Full setup from scratch
.\scripts\setup-android-sdk.ps1
```

## 📁 Script Locations

```
scripts/
├── build-android-release.ps1     # Production builds
├── generate-keystore.ps1         # Keystore creation
├── setup-android-sdk.ps1         # SDK setup & build
└── android-build.ps1             # General builds
```

## 🔒 Security Notes

Scripts that handle sensitive data:

- `generate-keystore.ps1` - Creates passwords
- `build-android-release.ps1` - Uses keystore

Never commit:

- `android/keystore.properties`
- `android/*.keystore`

## 🛠️ Requirements

All scripts require:

- Windows PowerShell 5.1+
- Node.js & npm
- JDK 21+ installed

Production scripts also require:

- Android Studio (or Android SDK)
- Release keystore (generated via `generate-keystore.ps1`)

## 📖 Documentation

For detailed documentation, see:

- [Production APK Guide](../docs/android/PRODUCTION_APK_GUIDE.md)
- [Android README](../docs/android/ANDROID_README.md)
- [Deployment Guide](../docs/android/ANDROID_DEPLOYMENT.md)

## 🐛 Troubleshooting

### "Execution policy" error

```bash
powershell -ExecutionPolicy Bypass -File .\scripts\script-name.ps1
```

### "Script not found"

Run from project root directory.

### "Android SDK not found"

Run `.\scripts\setup-android-sdk.ps1` or install Android Studio.

---

**Back to:** [Main README](../README.md) | [Android Docs](../docs/android/)
