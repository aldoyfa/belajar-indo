# Minimal automated E2E checks for BelajarIndo (PowerShell)
# Usage: open PowerShell, cd to this folder and run:
#   .\check-end-to-end.ps1

$BACKEND = if ($env:BI_BACKEND -and $env:BI_BACKEND.Trim() -ne '') { $env:BI_BACKEND } else { 'C:\Users\laras\BAHASA C\SEMESTER 5\IF2010_OOP\BelajarIndo\belajarindo-backend' }
$FRONTEND_URL = if ($env:BI_FRONTEND_URL -and $env:BI_FRONTEND_URL.Trim() -ne '') { $env:BI_FRONTEND_URL } else { 'http://localhost:5500' }
$API = if ($env:BI_API -and $env:BI_API.Trim() -ne '') { $env:BI_API } else { 'http://localhost:3000' }
$cookieFile = Join-Path $env:TEMP "belajar_cookies.txt"
$tmpImage = Join-Path $env:TEMP "belajar_test_avatar.png"

function WriteOk($m){ Write-Host "[OK] $m" -ForegroundColor Green }
function WriteErr($m){ Write-Host "[ERR] $m" -ForegroundColor Red }
function WriteWarn($m){ Write-Host "[WARN] $m" -ForegroundColor Yellow }
function WriteInfo($m){ Write-Host "[INFO] $m" -ForegroundColor Cyan }

# Initialize error counter
$ErrorCount = 0

# Check if backend directory exists
if (-not (Test-Path $BACKEND)) {
    WriteErr "Backend directory not found: $BACKEND"
    Write-Host "Please update the `$BACKEND path in the script to point to your backend directory"
    exit 1
}

Push-Location $BACKEND

# Auto-create demo user jika belum ada
Write-Host "== Auto-create Demo User =="
$registerBody = @{
    name = "Demo User"
    email = "demo@local" 
    password = "123456"
} | ConvertTo-Json

try {
    $registerResp = Invoke-RestMethod -Uri "$API/api/auth/register" -Method Post -Body $registerBody -ContentType 'application/json' -TimeoutSec 10
    WriteOk "User demo berhasil dibuat"
} catch {
    $errResp = $_.Exception.Response
    if ($errResp) {
        try {
            $reader = New-Object System.IO.StreamReader($errResp.GetResponseStream())
            $body = $reader.ReadToEnd()
            $reader.Close()
        } catch { $body = $errResp.StatusDescription }
        $status = $errResp.StatusCode.Value__
        if ($status -eq 400) {
            WriteOk "User demo sudah ada di database"
        } else {
            WriteWarn "Gagal membuat user demo: HTTP $status"
            WriteInfo "Response body:`n$body"
            WriteInfo "Lanjutkan testing dengan asumsi user sudah ada..."
        }
    } else {
        WriteWarn "Gagal membuat user demo: $($_.Exception.Message)"
        WriteInfo "Lanjutkan testing dengan asumsi user sudah ada..."
    }
}
Write-Host ""

# Health
Write-Host "== Health check =="
try {
    $h = Invoke-RestMethod -Uri "$API/api/health" -Method Get -TimeoutSec 5
    WriteOk ("Health: " + $($h.status) + " - " + $($h.message))
} catch {
    WriteErr ("Health check failed: " + $_.Exception.Message)
    $ErrorCount++
    WriteInfo "Make sure backend server is running on $API"
}

# Frontend
Write-Host "`n== Frontend static check =="
try {
    $r = Invoke-WebRequest -Uri "$FRONTEND_URL/login.html" -UseBasicParsing -TimeoutSec 5
    if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 400) { 
        WriteOk ("Frontend served at " + $FRONTEND_URL + " (status " + $r.StatusCode + ")") 
    }
    else { 
        WriteErr ("Frontend returned status " + $r.StatusCode) 
        $ErrorCount++
    }
} catch {
    WriteErr ("Frontend not reachable at " + $FRONTEND_URL + ": " + $_.Exception.Message)
    $ErrorCount++
    WriteInfo "Make sure frontend server is running on $FRONTEND_URL"
}

# create WebSession for cookies
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
# Prepare API Uri early so cookie copying won't fail even when login fails
$apiUri = New-Object System.Uri($API)

# Login (use Invoke-RestMethod to keep session cookies and improved error reporting)
Write-Host "`n== Login (attempt) =="
$testEmail = "demo@local"
$testPass = "123456"
$loginBody = @{ email = $testEmail; password = $testPass } | ConvertTo-Json

try {
    # use Invoke-RestMethod which works well for JSON APIs and supports -WebSession
    $loginResp = Invoke-RestMethod -Uri "$API/api/auth/login" -Method Post -Body $loginBody -ContentType 'application/json' -WebSession $session -TimeoutSec 10

    # verify cookies set in session for the API host
    $apiUri = New-Object System.Uri($API)
    $cookies = $session.Cookies.GetCookies($apiUri)
    if ($cookies.Count -gt 0) {
        WriteOk ("Login succeeded. Cookies stored in session.")
        # list cookies for debugging
        foreach ($c in $cookies) { Write-Host (" - Cookie: " + $c.Name + "=" + $c.Value) }
        # optionally export cookies to file for curl
        $session.Cookies.GetCookies($apiUri) | Out-File -FilePath $cookieFile -Encoding utf8 -Force
    } else {
        WriteWarn ("Login did not set cookies but may have succeeded. Response: " + (ConvertTo-Json $loginResp -Compress))
    }
} catch {
    $errResp = $_.Exception.Response
    $status = $null
    $body = $null
    if ($errResp) {
        try {
            $reader = New-Object System.IO.StreamReader($errResp.GetResponseStream())
            $body = $reader.ReadToEnd()
            $reader.Close()
            $status = $errResp.StatusCode.Value__ 2>$null
        } catch { 
            $body = $errResp.StatusDescription 
        }
    }

    # If server error, try a form-encoded fallback once (some servers expect non-JSON form posts)
    if ($status -and $status -ge 500 -and $status -lt 600) {
        WriteWarn ("Login returned server error HTTP $status. Attempting form-encoded fallback login...")
        try {
            $form = @{ email = $testEmail; password = $testPass }
            $fallback = Invoke-WebRequest -Uri "$API/api/auth/login" -Method Post -Body $form -WebSession $session -UseBasicParsing -TimeoutSec 10
            $apiUri = New-Object System.Uri($API)
            $cookies = $session.Cookies.GetCookies($apiUri)
            if ($cookies.Count -gt 0) {
                WriteOk ("Fallback login succeeded. Cookies stored in session.")
                $session.Cookies.GetCookies($apiUri) | Out-File -FilePath $cookieFile -Encoding utf8 -Force
            } else {
                WriteErr ("Fallback login did not set cookies. Response status: " + $((($fallback.StatusCode) -as [int]) -or "unknown"))
                $ErrorCount++
            }
        } catch {
            WriteErr ("Fallback login failed: " + $_.Exception.Message)
            $ErrorCount++
            WriteInfo "Check if user '$testEmail' exists with password '$testPass'"
        }
    } else {
        if ($status) { 
            WriteErr ("Login failed: HTTP $status`n$body") 
            $ErrorCount++
            WriteInfo "Check if user '$testEmail' exists with password '$testPass'"
        } else { 
            WriteErr ("Login failed: " + $_.Exception.Message) 
            $ErrorCount++
        }
    }
}

# /api/auth/me using same session
Write-Host "`n== /api/auth/me =="
try {
    $me = Invoke-RestMethod -Uri "$API/api/auth/me" -Method Get -WebSession $session -TimeoutSec 10
    WriteOk ("/api/auth/me response: " + (ConvertTo-Json $me -Compress))
} catch {
    # treat 401 as a warning (unauthenticated) but continue; show details for debugging
    $errResp = $_.Exception.Response
    if ($errResp) {
        try {
            $reader = New-Object System.IO.StreamReader($errResp.GetResponseStream())
            $body = $reader.ReadToEnd()
            $reader.Close()
            $status = $errResp.StatusCode.Value__ 2>$null
            if ($status -eq 401) {
                WriteWarn ("/api/auth/me returned 401 Unauthorized. Response:`n$body")
                WriteInfo "This might be expected if login failed or session is invalid"
            } else {
                WriteErr ("/api/auth/me failed: HTTP $status`n$body")
                $ErrorCount++
            }
        } catch {
            WriteErr ("/api/auth/me failed: " + $_.Exception.Message)
            $ErrorCount++
        }
    } else {
        WriteErr ("/api/auth/me failed: " + $_.Exception.Message)
        $ErrorCount++
    }
}

# Upload test avatar (simplified approach)
Write-Host "`n== Upload test avatar =="
$base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII="
try {
    [System.IO.File]::WriteAllBytes($tmpImage, [Convert]::FromBase64String($base64))
    if (Test-Path $tmpImage) { 
        WriteOk ("Created temp image " + $tmpImage) 
    } else { 
        WriteErr "Failed to create temp image"
        $ErrorCount++
    }
} catch {
    WriteErr "Failed to create temp image: $($_.Exception.Message)"
    $ErrorCount++
}

if (Test-Path $tmpImage) {
    try {
        # Use System.Net.Http.HttpClient for multipart upload while preserving cookies
        $cookieContainer = New-Object System.Net.CookieContainer
        # copy cookies from the session into a CookieContainer for HttpClient
        $session.Cookies.GetCookies($apiUri) | ForEach-Object { $cookieContainer.Add($apiUri, $_) }

        $handler = New-Object System.Net.Http.HttpClientHandler
        $handler.CookieContainer = $cookieContainer
        $handler.UseCookies = $true

        $client = New-Object System.Net.Http.HttpClient($handler)
        $multipart = New-Object System.Net.Http.MultipartFormDataContent

        $stream = [System.IO.File]::OpenRead($tmpImage)
        $fileContent = New-Object System.Net.Http.StreamContent($stream)
        $fileContent.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse('image/png')
        $multipart.Add($fileContent, 'avatar', 'test.png')

        $resp = $client.PostAsync((Join-Path $API 'api/auth/avatar'), $multipart).Result
        $status = [int]$resp.StatusCode
        $body = $resp.Content.ReadAsStringAsync().Result

        if ($status -ge 200 -and $status -lt 300) {
            WriteOk ("Upload succeeded (HTTP $status)")
        } else {
            WriteWarn ("Upload failed: HTTP $status`n$body")
            $ErrorCount++
        }

        $stream.Close()
        $multipart.Dispose()
        $client.Dispose()
    } catch {
        WriteWarn ("Upload failed: " + $_.Exception.Message)
        $ErrorCount++
        WriteInfo "Upload endpoint might not be implemented or may require different parameters or auth"
    }
}

# Check uploads folder
Write-Host "`n== Check uploads folder =="
$uploadsDir = Join-Path $BACKEND "uploads"
if (Test-Path $uploadsDir) {
    $recent = Get-ChildItem -Path $uploadsDir -File -ErrorAction SilentlyContinue | Sort-Object CreationTime -Descending | Select-Object -First 5
    if ($recent -and $recent.Count -gt 0) {
        WriteOk "Recent files in uploads:"
        foreach ($f in $recent) {
            $sizeKB = [math]::Round($f.Length / 1024, 2)
            Write-Host (" - " + $f.Name + " (" + $sizeKB + " KB) created " + $f.CreationTime)
        }
    } else {
        WriteWarn "Uploads folder is empty."
        WriteInfo "This might be normal if no files have been uploaded yet"
    }
} else {
    WriteWarn ("Uploads folder not found at " + $uploadsDir)
    WriteInfo "This might be normal if uploads functionality is not implemented"
}

# cleanup
try {
    Remove-Item -ErrorAction SilentlyContinue $tmpImage
    WriteOk ("Removed temp image " + $tmpImage)
} catch {
    WriteWarn ("Failed to remove temp image: " + $_.Exception.Message)
}

Pop-Location

Write-Host "`n== Summary =="
if ($ErrorCount -eq 0) {
    WriteOk "All checks completed successfully! No critical errors found."
    Write-Host "Jika ada [WARN], itu hanya peringatan dan mungkin normal tergantung implementasi."
} else {
    WriteErr "Ditemukan $ErrorCount error(s) yang perlu diperbaiki."
    Write-Host "Copy output dan kirimkan ke saya untuk analisis lebih lanjut."
}

Write-Host "`nTips:"
Write-Host "- Pastikan backend server berjalan di $API"
Write-Host "- Pastikan frontend server berjalan di $FRONTEND_URL" 
Write-Host "- Pastikan user '$testEmail' dengan password '$testPass' ada di database"
Write-Host "- Beberapa endpoint mungkin belum diimplementasi (itu normal)"