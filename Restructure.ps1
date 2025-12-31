# PowerShell Script untuk Restrukturisasi BelajarIndo
# Jalankan: .\Restructure.ps1

Write-Host "🚀 Memulai Restrukturisasi BelajarIndo..." -ForegroundColor Cyan

# 1. Buat struktur folder baru jika belum ada
$folders = @(
    "app/(auth)",
    "app/(tabs)", 
    "components",
    "services"
)

foreach ($folder in $folders) {
    if (-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Force -Path $folder | Out-Null
        Write-Host "✅ Created: $folder" -ForegroundColor Green
    } else {
        Write-Host "⏭️  Exists: $folder" -ForegroundColor Yellow
    }
}

# 2. Pindahkan file components jika ada di app/components
if (Test-Path "app/components") {
    Write-Host "📦 Moving components..." -ForegroundColor Cyan
    Get-ChildItem "app/components" -File | ForEach-Object {
        $dest = "components/$($_.Name)"
        Move-Item $_.FullName $dest -Force
        Write-Host "  ✅ Moved: $($_.Name)" -ForegroundColor Green
    }
    Remove-Item "app/components" -Recurse -Force
}

# 3. Pindahkan file services jika ada di app/services
if (Test-Path "app/services") {
    Write-Host "📦 Moving services..." -ForegroundColor Cyan
    Get-ChildItem "app/services" -File | ForEach-Object {
        $dest = "services/$($_.Name)"
        Move-Item $_.FullName $dest -Force
        Write-Host "  ✅ Moved: $($_.Name)" -ForegroundColor Green
    }
    Remove-Item "app/services" -Recurse -Force
}

# 4. Fix imports - Buat backup dulu
Write-Host "🔧 Fixing imports..." -ForegroundColor Cyan
$filesToFix = @(
    "app/(auth)/login.tsx",
    "app/(auth)/register.tsx",
    "app/(tabs)/index.tsx",
    "app/(tabs)/vocabulary.tsx",
    "app/(tabs)/quiz.tsx",
    "app/(tabs)/profile.tsx"
)

foreach ($file in $filesToFix) {
    if (Test-Path $file) {
        # Backup
        Copy-Item $file "$file.backup" -Force
        
        # Fix imports
        $content = Get-Content $file -Raw
        
        # Replace old imports with new ones
        $content = $content -replace "from '../components/", "from '../../components/"
        $content = $content -replace "from '../services/", "from '../../services/"
        $content = $content -replace "from '\.\./\.\./components/Card\.';", "from '../../components/Card.';"
        
        # Save
        Set-Content $file $content -NoNewline
        Write-Host "  ✅ Fixed: $file" -ForegroundColor Green
    }
}

# 5. Bersihkan node_modules duplikat
Write-Host "🧹 Cleaning duplicate node_modules..." -ForegroundColor Cyan
if (Test-Path "app/node_modules") {
    Remove-Item "app/node_modules" -Recurse -Force
    Write-Host "  ✅ Removed app/node_modules" -ForegroundColor Green
}

# 6. Update tsconfig.json
Write-Host "⚙️  Updating tsconfig.json..." -ForegroundColor Cyan
$tsconfigContent = @"
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "jsx": "react-native",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ],
  "exclude": [
    "node_modules",
    "belajarindo-backend"
  ]
}
"@
Set-Content "tsconfig.json" $tsconfigContent
Write-Host "  ✅ Updated tsconfig.json" -ForegroundColor Green

# 7. Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install

Write-Host ""
Write-Host "✨ Restrukturisasi selesai!" -ForegroundColor Green
Write-Host ""
Write-Host "Langkah selanjutnya:" -ForegroundColor Yellow
Write-Host "1. Restart VS Code atau Reload Window (Ctrl+Shift+P > Reload Window)"
Write-Host "2. Jalankan: npm start"
Write-Host "3. Tekan 'w' untuk web atau scan QR untuk mobile"
Write-Host ""