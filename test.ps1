# Test script for Partner_New_Deal Web Frontend & Askeladden
Write-Host "Kjører testsuite for webapplikasjoner..." -ForegroundColor Cyan

$testResults = @()

$files = @(
    "README.md",
    "index.html",
    "styles.css",
    "app.js",
    "askeladden.html"
)

foreach ($f in $files) {
    $exists = Test-Path $f
    $testResults += [PSCustomObject]@{
        Test = "$f eksisterer"
        Status = if ($exists) { "PASS" } else { "FAIL" }
    }
}

# Sjekk innhold i askeladden.html
if (Test-Path "askeladden.html") {
    $askContent = Get-Content "askeladden.html" -Raw
    $hasModels = $askContent -match "C83 Cruiser" -and $askContent -match "P92 SUV"
    $testResults += [PSCustomObject]@{
        Test = "askeladden.html inneholder båtmodeller"
        Status = if ($hasModels) { "PASS" } else { "FAIL" }
    }
}

# Skriv ut resultater
$testResults | Format-Table -AutoSize

if ($testResults.Status -contains "FAIL") {
    Write-Host "Noen tester feilet!" -ForegroundColor Red
    exit 1
} else {
    Write-Host "Alle tester bestått!" -ForegroundColor Green
    exit 0
}
