<#
Automated setup-and-run helper for BelajarIndo backend (PowerShell)

What this script does (interactive):
 - Optionally start a local PostgreSQL Docker container (postgres:15)
 - Create a .env file from sensible defaults (if not present)
 - Run `npm install` in backend
 - Ensure prisma CLI available, run migrations (or `db push` as fallback)
 - Run `npx prisma generate`
 - Start backend in a new PowerShell window (npm run dev)
 - Optionally start frontend (python http.server) in a new PowerShell window
 - Run the existing `check-end-to-end.ps1` and save output to `e2e-output.txt`

Run this file from PowerShell (in the scripts folder):
  .\setup-and-run.ps1

This script is interactive and will ask for confirmation before destructive steps.
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function WriteOk($m){ Write-Host "[OK] $m" -ForegroundColor Green }
function WriteErr($m){ Write-Host "[ERR] $m" -ForegroundColor Red }
function WriteWarn($m){ Write-Host "[WARN] $m" -ForegroundColor Yellow }
function WriteInfo($m){ Write-Host "[INFO] $m" -ForegroundColor Cyan }

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$BackendDir = (Get-Item $ScriptDir).Parent.FullName
$FrontendDir = Join-Path $BackendDir '..\belajarindo-frontend' | Resolve-Path -ErrorAction SilentlyContinue
$EnvFile = Join-Path $BackendDir '.env'
$EnvExample = Join-Path $BackendDir '.env.example'

Write-Host "Script directory: $ScriptDir"
Write-Host "Backend directory: $BackendDir"

# 1) Optionally start PostgreSQL via Docker
$useDocker = Read-Host "Start local Postgres Docker container? (Y/n) [Default: Y]"
if ([string]::IsNullOrWhiteSpace($useDocker)) { $useDocker = 'Y' }
if ($useDocker -match '^[Yy]') {
    try {
        docker --version > $null 2>&1
    } catch {
        WriteWarn "Docker not found in PATH. Skipping Docker step. If you want Docker, install Docker Desktop first."
        $useDocker = 'n'
    }
}
+
if ($useDocker -match '^[Yy]') {
    # check existing container
    $existing = docker ps -a --filter "name=belajarindo-postgres" --format "{{.Names}}:{{.Status}}" 2>$null
    if ($existing) {
        WriteInfo "Found existing container: $existing"
        $isRunning = docker ps --filter "name=belajarindo-postgres" --format "{{.Names}}" 2>$null
        if (-not $isRunning) {
            WriteInfo "Starting existing container 'belajarindo-postgres'..."
            docker start belajarindo-postgres | Write-Host
        } else {
            WriteInfo "Container is already running."
        }
    } else {
        WriteInfo "Pulling postgres:15 image and starting container 'belajarindo-postgres'..."
        # Postgres default ports: 5432
        docker run --name belajarindo-postgres -e POSTGRES_PASSWORD=root -e POSTGRES_DB=belajarindo -p 5432:5432 -d postgres:15 | Write-Host
        Start-Sleep -Seconds 8
    }
    # quick health check
    Write-Host "Waiting 6s for Postgres to initialize..."
    Start-Sleep -Seconds 6
    try {
        docker exec belajarindo-postgres psql -U postgres -d belajarindo -c "SELECT version();" | Out-Null
        WriteOk "Postgres container reachable"
    } catch {
        WriteWarn "Postgres container may not be ready yet. If migrate fails, wait a bit and retry."
    }
}

# 2) Create .env if missing
if (-Not (Test-Path $EnvFile)) {
    if (Test-Path $EnvExample) {
        WriteInfo ".env not found; creating from .env.example (you should review values)."
        Copy-Item -Path $EnvExample -Destination $EnvFile -Force
    (Get-Content $EnvFile) -replace 'DATABASE_URL=.*', 'DATABASE_URL="postgresql://postgres:root@127.0.0.1:5432/belajarindo"' | Set-Content $EnvFile
        (Get-Content $EnvFile) -replace 'JWT_SECRET=.*', 'JWT_SECRET="dev-secret-change-me"' | Set-Content $EnvFile
        WriteOk ".env created at $EnvFile"
    } else {
        WriteInfo ".env.example not found. Creating minimal .env with defaults."
    @"
DATABASE_URL="postgresql://postgres:root@127.0.0.1:5432/belajarindo"
JWT_SECRET="dev-secret-change-me"
NODE_ENV=development
PORT=3000
"@ | Out-File -FilePath $EnvFile -Encoding ascii -Force
        WriteOk ".env created at $EnvFile"
    }
} else {
    WriteInfo ".env already exists at $EnvFile. Please review values if needed."
}

Write-Host "Current .env content:" -ForegroundColor Cyan
Get-Content $EnvFile | ForEach-Object { Write-Host "  $_" }

$ok = Read-Host "Proceed to npm install and Prisma migration? (Y/n) [Default: Y]"
if ([string]::IsNullOrWhiteSpace($ok)) { $ok = 'Y' }
if ($ok -notmatch '^[Yy]') { WriteErr "Aborted by user."; exit 1 }

# 3) npm install
Write-Host "Running npm install..." -ForegroundColor Cyan
Push-Location $BackendDir
try {
    npm install --no-audit --no-fund
    WriteOk "npm install completed"
} catch {
    WriteErr "npm install failed: $($_.Exception.Message)"
    Pop-Location
    exit 1
}

# 4) Ensure prisma CLI
try {
    npx prisma -v | Write-Host
} catch {
    WriteWarn "Prisma CLI not available via npx. Installing prisma as devDependency..."
    npm install prisma --save-dev
}

# 5) Run migration
Write-Host "Running Prisma migrate dev --name init (this may prompt)." -ForegroundColor Cyan
try {
    npx prisma migrate dev --name init --preview-feature
    WriteOk "Prisma migrate finished"
} catch {
    WriteWarn "Prisma migrate dev failed. Will try prisma db push as fallback and then generate client."
    try {
        npx prisma db push
        WriteOk "prisma db push succeeded"
    } catch {
        WriteErr "prisma db push also failed: $($_.Exception.Message)"
        Pop-Location
        exit 1
    }
}

# 6) Generate client
try {
    npx prisma generate
    WriteOk "Prisma client generated"
} catch {
    WriteErr "Prisma generate failed: $($_.Exception.Message)"
    Pop-Location
    exit 1
}

# 7) Start backend in a new PowerShell window
$startBackend = Read-Host "Start backend (npm run dev) in a new window? (Y/n) [Default: Y]"
if ([string]::IsNullOrWhiteSpace($startBackend)) { $startBackend = 'Y' }
if ($startBackend -match '^[Yy]') {
    $cmd = "cd `"$BackendDir`"; npm run dev"
    Start-Process -FilePath "powershell" -ArgumentList "-NoExit","-Command",$cmd -WindowStyle Normal
    WriteOk "Started backend in a new PowerShell window"
} else {
    WriteInfo "Skipping backend start. You can run 'npm run dev' in backend directory manually."
}

# 8) Optionally start frontend server
$startFrontend = Read-Host "Start simple frontend server (python -m http.server 5500) in a new window? (Y/n) [Default: n]"
if ([string]::IsNullOrWhiteSpace($startFrontend)) { $startFrontend = 'n' }
if ($startFrontend -match '^[Yy]') {
    if (-not $FrontendDir) { WriteWarn "Frontend directory not found next to backend. Skipping frontend start." }
    else {
        $fCmd = "cd `"$FrontendDir`"; python -m http.server 5500"
        Start-Process -FilePath "powershell" -ArgumentList "-NoExit","-Command",$fCmd -WindowStyle Normal
        WriteOk "Started frontend server in a new PowerShell window"
    }
}

# 9) Run E2E check script and save output
Write-Host "Waiting 3s for services to settle..." -ForegroundColor Cyan
Start-Sleep -Seconds 3
$e2eScript = Join-Path $ScriptDir 'check-end-to-end.ps1'
if (Test-Path $e2eScript) {
    Write-Host "Running E2E check and saving to e2e-output.txt..." -ForegroundColor Cyan
    try {
        . $e2eScript *>&1 | Tee-Object -FilePath (Join-Path $ScriptDir 'e2e-output.txt')
        WriteOk "E2E script completed. Output at $ScriptDir\e2e-output.txt"
    } catch {
        WriteErr "Running E2E script failed: $($_.Exception.Message)"
    }
} else {
    WriteWarn "E2E script not found at $e2eScript"
}

Pop-Location
Write-Host "All done. Review output and logs. If anything failed, copy the relevant output and paste into chat for help." -ForegroundColor Cyan
