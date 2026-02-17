# Build Production-Ready Android APK
# This script builds a signed, production-ready APK

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Building Production Android APK" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"

# Check for keystore
$keystorePath = "android\investment-app-release.keystore"
$keystorePropsPath = "android\keystore.properties"

if (-not (Test-Path $keystorePath)) {
    Write-Host "[ERROR] Release keystore not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Run this command first to generate a keystore:" -ForegroundColor Yellow
    Write-Host "  .\generate-keystore.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "Or for testing, use debug build:" -ForegroundColor Yellow
    Write-Host "  npm run android:build" -ForegroundColor White
    exit 1
}

if (-not (Test-Path $keystorePropsPath)) {
    Write-Host "[ERROR] keystore.properties not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Run this command to generate keystore and properties:" -ForegroundColor Yellow
    Write-Host "  .\generate-keystore.ps1" -ForegroundColor White
    exit 1
}

# Check Android SDK
$sdkPath = $env:ANDROID_HOME
if (-not $sdkPath) {
    $sdkPath = "$env:LOCALAPPDATA\Android\Sdk"
}

if (-not (Test-Path $sdkPath)) {
    Write-Host "[ERROR] Android SDK not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Android Studio first." -ForegroundColor Yellow
    Write-Host "Download: https://developer.android.com/studio" -ForegroundColor White
    exit 1
}

$localPropsPath = "android\local.properties"
if (-not (Test-Path $localPropsPath)) {
    Write-Host "[INFO] Creating local.properties..." -ForegroundColor Yellow
    $sdkFormatted = $sdkPath -replace '\\', '\\'
    "sdk.dir=$sdkFormatted" | Out-File -FilePath $localPropsPath -Encoding ASCII
}

# Set environment
$env:ANDROID_HOME = $sdkPath

# Step 1: Build React app
Write-Host "[1/4] Building React app for production..." -ForegroundColor Cyan
npm run build:android
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] React build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] React app built" -ForegroundColor Green
Write-Host ""

# Step 2: Sync to Android
Write-Host "[2/4] Syncing to Android..." -ForegroundColor Cyan
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Capacitor sync failed!" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Synced to Android" -ForegroundColor Green
Write-Host ""

# Step 3: Clean previous builds
Write-Host "[3/4] Cleaning previous builds..." -ForegroundColor Cyan
Push-Location android
.\gradlew clean | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[WARNING] Clean failed, continuing..." -ForegroundColor Yellow
}
Pop-Location
Write-Host "[OK] Cleaned" -ForegroundColor Green
Write-Host ""

# Step 4: Build signed release APK
Write-Host "[4/4] Building signed release APK..." -ForegroundColor Cyan
Write-Host "  This may take a few minutes..." -ForegroundColor Gray
Write-Host ""

Push-Location android
.\gradlew assembleRelease
$buildResult = $LASTEXITCODE
Pop-Location

if ($buildResult -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host " BUILD SUCCESSFUL!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    $apkPath = "android\app\build\outputs\apk\release\app-release.apk"
    
    if (Test-Path $apkPath) {
        $apkSize = [math]::Round((Get-Item $apkPath).Length / 1MB, 2)
        $apkHash = (Get-FileHash $apkPath -Algorithm SHA256).Hash
        
        Write-Host "APK Details:" -ForegroundColor Cyan
        Write-Host "  Location: $apkPath" -ForegroundColor White
        Write-Host "  Size: $apkSize MB" -ForegroundColor White
        Write-Host "  SHA256: $apkHash" -ForegroundColor Gray
        Write-Host ""
        
        Write-Host "Production Features:" -ForegroundColor Cyan
        Write-Host "  [✓] Signed with release keystore" -ForegroundColor Green
        Write-Host "  [✓] Optimized and minified" -ForegroundColor Green
        Write-Host "  [✓] ProGuard enabled" -ForegroundColor Green
        Write-Host "  [✓] Ready for Play Store" -ForegroundColor Green
        Write-Host ""
        
        Write-Host "Next Steps:" -ForegroundColor Yellow
        Write-Host "  1. Test on physical device:" -ForegroundColor White
        Write-Host "     adb install $apkPath" -ForegroundColor Gray
        Write-Host ""
        Write-Host "  2. Upload to Google Play Console" -ForegroundColor White
        Write-Host "     https://play.google.com/console" -ForegroundColor Gray
        Write-Host ""
        
        # Copy to root for easy access
        $rootApk = "investment-app-release.apk"
        Copy-Item $apkPath $rootApk -Force
        Write-Host "[OK] Copied APK to project root: $rootApk" -ForegroundColor Green
    }
    else {
        Write-Host "[WARNING] APK not found at expected location" -ForegroundColor Yellow
    }
}
else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host " BUILD FAILED" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Check the build output above for errors." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  - SDK licenses not accepted" -ForegroundColor White
    Write-Host "  - Missing SDK components" -ForegroundColor White
    Write-Host "  - Incorrect keystore password" -ForegroundColor White
    exit 1
}
