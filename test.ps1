# Test script for Partner_New_Deal Web Frontend
Write-Host "Kjører testsuite for Partner_New_Deal Frontend..." -ForegroundColor Cyan

$testResults = @()

# Test 1: README.md
$readmeExists = Test-Path "README.md"
$testResults += [PSCustomObject]@{
    Test = "README.md eksisterer"
    Status = if ($readmeExists) { "PASS" } else { "FAIL" }
}

# Test 2: index.html
$indexExists = Test-Path "index.html"
$testResults += [PSCustomObject]@{
    Test = "index.html eksisterer"
    Status = if ($indexExists) { "PASS" } else { "FAIL" }
}

# Test 3: styles.css
$cssExists = Test-Path "styles.css"
$testResults += [PSCustomObject]@{
    Test = "styles.css eksisterer"
    Status = if ($cssExists) { "PASS" } else { "FAIL" }
}

# Test 4: app.js
$jsExists = Test-Path "app.js"
$testResults += [PSCustomObject]@{
    Test = "app.js eksisterer"
    Status = if ($jsExists) { "PASS" } else { "FAIL" }
}

# Test 5: Sjekk at index.html refererer til css og js
if ($indexExists) {
    $indexContent = Get-Content "index.html" -Raw
    $hasCss = $indexContent -match "styles\.css"
    $hasJs = $indexContent -match "app\.js"
    $testResults += [PSCustomObject]@{
        Test = "index.html linker til styles.css og app.js"
        Status = if ($hasCss -and $hasJs) { "PASS" } else { "FAIL" }
    }
}

# Skriv ut resultater
$testResults | Format-Table -AutoSize

if ($testResults.Status -contains "FAIL") {
    Write-Host "Noen tester feilet!" -ForegroundColor Red
    exit 1
} else {
    Write-Host "Alle frontend-tester bestått!" -ForegroundColor Green
    exit 0
}
