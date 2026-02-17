# Generate Android Release Keystore
# Run this once to create your signing key

param(
    [string]$KeystoreName = "investment-app-release.keystore",
    [string]$KeyAlias = "investment-app",
    [int]$Validity = 10000
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Android Release Keystore Generator" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$keystorePath = Join-Path $PSScriptRoot "android\$KeystoreName"

if (Test-Path $keystorePath) {
    Write-Host "[WARNING] Keystore already exists at:" -ForegroundColor Yellow
    Write-Host "  $keystorePath" -ForegroundColor White
    Write-Host ""
    $response = Read-Host "Do you want to overwrite it? (yes/no)"
    if ($response -ne "yes") {
        Write-Host "Aborted." -ForegroundColor Yellow
        exit 0
    }
}

Write-Host "This will create a keystore for signing your Android APK." -ForegroundColor Green
Write-Host "You'll need to provide:" -ForegroundColor Yellow
Write-Host "  - Keystore password (min 6 chars)" -ForegroundColor White
Write-Host "  - Key password (min 6 chars)" -ForegroundColor White
Write-Host "  - Your name" -ForegroundColor White
Write-Host "  - Organization (optional)" -ForegroundColor White
Write-Host "  - City, State, Country" -ForegroundColor White
Write-Host ""
Write-Host "IMPORTANT: Save these passwords securely!" -ForegroundColor Red
Write-Host ""

# Check if keytool is available
$keytoolPath = $null
$javaHome = $env:JAVA_HOME

if ($javaHome) {
    $keytoolPath = Join-Path $javaHome "bin\keytool.exe"
}

if (-not $keytoolPath -or -not (Test-Path $keytoolPath)) {
    # Try to find keytool in PATH
    $keytoolPath = (Get-Command keytool -ErrorAction SilentlyContinue).Source
}

if (-not $keytoolPath) {
    Write-Host "[ERROR] keytool not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Make sure Java JDK is installed and JAVA_HOME is set." -ForegroundColor Yellow
    Write-Host "Current JAVA_HOME: $env:JAVA_HOME" -ForegroundColor Gray
    exit 1
}

Write-Host "Using keytool: $keytoolPath" -ForegroundColor Gray
Write-Host ""

# Generate keystore
try {
    & $keytoolPath -genkeypair `
        -v `
        -storetype PKCS12 `
        -keystore $keystorePath `
        -alias $KeyAlias `
        -keyalg RSA `
        -keysize 2048 `
        -validity $Validity
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host " Keystore Created Successfully!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Location: $keystorePath" -ForegroundColor White
        Write-Host ""
        Write-Host "Next step: Create keystore.properties file" -ForegroundColor Yellow
        Write-Host ""
        
        # Create template keystore.properties
        $propsPath = Join-Path $PSScriptRoot "android\keystore.properties"
        if (-not (Test-Path $propsPath)) {
            $storePass = Read-Host "Enter keystore password (to save in keystore.properties)" -AsSecureString
            $keyPass = Read-Host "Enter key password (to save in keystore.properties)" -AsSecureString
            
            $storePlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
                [Runtime.InteropServices.Marshal]::SecureStringToBSTR($storePass))
            $keyPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
                [Runtime.InteropServices.Marshal]::SecureStringToBSTR($keyPass))
            
            $propsContent = @"
storePassword=$storePlain
keyPassword=$keyPlain
keyAlias=$KeyAlias
storeFile=$KeystoreName
"@
            $propsContent | Out-File -FilePath $propsPath -Encoding ASCII
            
            Write-Host "[OK] Created keystore.properties" -ForegroundColor Green
            Write-Host ""
            Write-Host "SECURITY WARNING:" -ForegroundColor Red
            Write-Host "  keystore.properties contains passwords!" -ForegroundColor Yellow
            Write-Host "  DO NOT commit this file to git!" -ForegroundColor Yellow
            Write-Host "  It's already in .gitignore" -ForegroundColor Gray
        }
        
        Write-Host ""
        Write-Host "You can now run: npm run android:release" -ForegroundColor Cyan
    }
}
catch {
    Write-Host ""
    Write-Host "[ERROR] Failed to create keystore: $_" -ForegroundColor Red
    exit 1
}
