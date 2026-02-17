# Android Build Script for Investment App
# This script builds your React app and updates the Android app

param(
    [switch]$Release,
    [switch]$Debug,
    [switch]$Open
)

Write-Host "🔨 Building Investment App for Android..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Build the React app
Write-Host "📦 Building React application..." -ForegroundColor Yellow
npm run build:android

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ React build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ React build completed!" -ForegroundColor Green
Write-Host ""

# Step 2: Sync with Capacitor
Write-Host "🔄 Syncing with Capacitor Android..." -ForegroundColor Yellow
npx cap sync android

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Capacitor sync failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Capacitor sync completed!" -ForegroundColor Green
Write-Host ""

# Step 3: Build Android APK/AAB
if ($Release) {
    Write-Host "🏗️  Building Release APK..." -ForegroundColor Yellow
    cd android
    .\gradlew assembleRelease
    cd ..
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Release APK built successfully!" -ForegroundColor Green
        $src = "android\app\build\outputs\apk\release\app-release.apk"
        $dest = "android\apk\Invest-release.apk"
        Copy-Item $src $dest -Force
        Write-Host "📍 Copied to: $dest" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Release build failed!" -ForegroundColor Red
        exit 1
    }
} elseif ($Debug) {
    Write-Host "🏗️  Building Debug APK..." -ForegroundColor Yellow
    cd android
    .\gradlew assembleDebug
    cd ..
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Debug APK built successfully!" -ForegroundColor Green
        $src = "android\app\build\outputs\apk\debug\app-debug.apk"
        $dest = "android\apk\Invest-debug.apk"
        Copy-Item $src $dest -Force
        Write-Host "📍 Copied to: $dest" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Debug build failed!" -ForegroundColor Red
        exit 1
    }
}

# Step 4: Open Android Studio if requested
if ($Open) {
    Write-Host "🚀 Opening Android Studio..." -ForegroundColor Yellow
    npx cap open android
}

Write-Host ""
Write-Host "✨ All done! Your Android app is ready!" -ForegroundColor Green
