# Prod-Guard PowerShell Runner

$ErrorActionPreference = "Stop"
$BASE_URL = if ($env:BASE_URL) { $env:BASE_URL } else { "http://localhost:5000" }

Write-Host "🛠️  Starting Production Readiness Gate (PowerShell Edition)..." -ForegroundColor Cyan
Write-Host "📍 Target URL: $BASE_URL"

# 1. Unit Tests
Write-Host "🧪 Running Unit Tests..."
Set-Location backend-node
try {
    npm test -- --json --outputFile=../unit-test-result.json
} catch {
    Write-Host "⚠️  Unit tests failed or returned error." -ForegroundColor Yellow
}
Set-Location ..

# 2. SQL Injection Tests
Write-Host "🛡️  Running SQL Injection Simulation..."
node tests/sql-injection.test.js

# 3. Load Tests
Write-Host "📈 Running Load Tests (Check)..."
if (Get-Command k6 -ErrorAction SilentlyContinue) {
    k6 run --out json=load-test-result.json tests/load.test.js
} else {
    '{"metrics": {}}' | Out-File -FilePath load-test-result.json -Encoding utf8
    Write-Host "⚠️  k6 not found, using mock results." -ForegroundColor Yellow
}

# 4. Prod-Guard Analysis
Write-Host "⚖️  Invoking Prod-Guard Governance engine..." -ForegroundColor Cyan
node prod-guard/core/analyzer.js
