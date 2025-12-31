# Verification script for BelajarIndo backend
# Usage: From project root or backend folder run:
# powershell -ExecutionPolicy Bypass -File ./belajarindo-backend/scripts/verify.ps1

$backend = 'http://localhost:3000'
$frontendOrigin = 'http://localhost:5500'

function Header($text) {
    Write-Host "\n=== $text ===" -ForegroundColor Cyan
}

function Run-Invoke($scriptBlock) {
    try {
        & $scriptBlock
    } catch {
        Write-Output "ERROR: $_"
    }
}

# 1) Health
Header 'Health check'
try {
    $health = Invoke-RestMethod -Uri "$backend/api/health" -Method Get -ErrorAction Stop
    Write-Output "Health: OK - $($health.message)"
} catch {
    Write-Output "Health: FAILED - $_"
}

# 2) Create session and login
Header 'Login (demo@local)'
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$body = @{ email = 'demo@local'; password = '123456' } | ConvertTo-Json
try {
    $r = Invoke-WebRequest -Uri "$backend/api/auth/login" -Method Post -Body $body -Headers @{ 'Content-Type'='application/json'; 'Origin'=$frontendOrigin } -WebSession $session -UseBasicParsing -ErrorAction Stop
    Write-Output "LOGIN_STATUS: $($r.StatusCode)"
    Write-Output "SET_COOKIE: $($r.Headers['Set-Cookie'])"
} catch {
    Write-Output "LOGIN FAILED: $_"
}

# 3) /api/auth/me
Header '/api/auth/me'
try {
    $me = Invoke-WebRequest -Uri "$backend/api/auth/me" -Method Get -Headers @{ 'Origin'=$frontendOrigin } -WebSession $session -UseBasicParsing -ErrorAction Stop
    Write-Output "ME_STATUS: $($me.StatusCode)"
    Write-Output $me.Content
} catch {
    Write-Output "ME FAILED: $_"
}

# 4) Submit sample quiz (include explicit totals to satisfy schema)
Header 'Submit sample quiz'
# include totalQuestions, correctAnswers, timeSpent explicitly
$quizPayload = @{ quizType = 'vocab'; questions = @(@{ id = 1; selected = 2 }); score = 100; totalQuestions = 1; correctAnswers = 1; timeSpent = 30 } | ConvertTo-Json
try {
    $q = Invoke-WebRequest -Uri "$backend/api/quiz/submit" -Method Post -Body $quizPayload -Headers @{ 'Content-Type'='application/json'; 'Origin'=$frontendOrigin } -WebSession $session -UseBasicParsing -ErrorAction Stop
    Write-Output "QUIZ_SUBMIT_STATUS: $($q.StatusCode)"
    Write-Output $q.Content
} catch {
    Write-Output "QUIZ_SUBMIT_FAILED: $_"
}

# 5) Check vocab progress
Header 'GET /api/flashcard/progress'
try {
    $vp = Invoke-WebRequest -Uri "$backend/api/flashcard/progress" -Method Get -Headers @{ 'Origin'=$frontendOrigin } -WebSession $session -UseBasicParsing -ErrorAction Stop
    Write-Output "VOCAB_PROGRESS_STATUS: $($vp.StatusCode)"
    Write-Output $vp.Content
} catch {
    Write-Output "VOCAB_PROGRESS_FAILED: $_"
}

# 6) Logout
Header 'Logout'
try {
    $l = Invoke-WebRequest -Uri "$backend/api/auth/logout" -Method Post -Headers @{ 'Origin'=$frontendOrigin } -WebSession $session -UseBasicParsing -ErrorAction Stop
    Write-Output "LOGOUT_STATUS: $($l.StatusCode)"
    Write-Output $l.Content
} catch {
    Write-Output "LOGOUT_FAILED: $_"
}

# 7) /me after logout
Header '/api/auth/me (after logout)'
try {
    $me2 = Invoke-WebRequest -Uri "$backend/api/auth/me" -Method Get -Headers @{ 'Origin'=$frontendOrigin } -WebSession $session -UseBasicParsing -ErrorAction Stop
    Write-Output "ME2_STATUS: $($me2.StatusCode)"
    Write-Output $me2.Content
} catch {
    Write-Output "ME2_FAILED (expected if logout worked): $_"
}

# 8) Run DB check script
Header 'DB check - demo user via script'
try {
    Push-Location -Path (Join-Path $PSScriptRoot "..")
    # run node script if node is available
    $node = Get-Command node -ErrorAction SilentlyContinue
    if ($node) {
        Write-Output "Running node scripts/check-demo-user.js"
        $out = node scripts/check-demo-user.js 2>&1
        Write-Output $out
    } else {
        Write-Output "Node not found in PATH; skipping DB script check."
    }
    Pop-Location
} catch {
    Write-Output "DB check script failed: $_"
}

Header 'Done - Summary'
Write-Output 'If ME after login returned 200 and ME after logout returned 401, authentication+cookie flow works.'
Write-Output 'If quiz submit returned 200 and DB check printed the demo user, DB connection works.'

# End of script
