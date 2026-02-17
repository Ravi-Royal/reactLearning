# Android SDK Setup and APK Build Script

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host " Android APK Build Setup" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Find Android SDK
$sdkPath = $null
$possiblePaths = @(
    "$env:LOCALAPPDATA\Android\Sdk",
    "$env:USERPROFILE\AppData\Local\Android\Sdk",
    "$env:ANDROID_HOME",
    "C:\Android\Sdk",
    "$env:USERPROFILE\Android\Sdk"
)

foreach ($path in $possiblePaths) {
    if ($path -and (Test-Path $path)) {
        Write-Host "[OK] Found Android SDK: $path" -ForegroundColor Green
        $sdkPath = $path
        break
    }
}

if (-not $sdkPath) {
    Write-Host "[INFO] Android SDK not found. Setting up..." -ForegroundColor Yellow
    $sdkPath = "$env:USERPROFILE\Android\Sdk"
    New-Item -ItemType Directory -Force -Path $sdkPath | Out-Null
    Write-Host "[OK] Created SDK directory" -ForegroundColor Green
}

# Create local.properties
$localProps = "android\local.properties"
$sdkFormatted = $sdkPath -replace '\\', '\\'
Write-Host "[INFO] Creating local.properties..." -ForegroundColor Yellow
"sdk.dir=$sdkFormatted" | Out-File -FilePath $localProps -Encoding ASCII -Force
Write-Host "[OK] local.properties created" -ForegroundColor Green

# Set ANDROID_HOME
$env:ANDROID_HOME = $sdkPath

# Build React app
Write-Host ""
Write-Host "Building React app..." -ForegroundColor Cyan
npm run build

# Sync to Android
Write-Host ""
Write-Host "Syncing to Android..." -ForegroundColor Cyan
npx cap sync android

# Build APK
Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host " Building Release APK" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

cd android
.\gradlew assembleRelease
$result = $LASTEXITCODE
cd ..

if ($result -eq 0) {
    Write-Host ""
    Write-Host "=======================================" -ForegroundColor Green
    Write-Host " SUCCESS!" -ForegroundColor Green
    Write-Host "=======================================" -ForegroundColor Green
    Write-Host ""
    $apk = "android\app\build\outputs\apk\release\app-release.apk"
    if (Test-Path $apk) {
        $size = [math]::Round((Get-Item $apk).Length / 1MB, 2)
        Write-Host "APK: $apk" -ForegroundColor White
        Write-Host "Size: $size MB" -ForegroundColor Gray
    }
} else {
    Write-Host ""
    Write-Host "[ERROR] Build failed" -ForegroundColor Red
    exit 1
}
