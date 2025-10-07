# PowerShell script to optimize Next.js development on Windows
# Run this script if you continue to experience slow filesystem issues

Write-Host "🚀 Optimizing Next.js development environment..." -ForegroundColor Green

# Clean Next.js cache
Write-Host "🧹 Cleaning Next.js cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "✅ .next directory cleared" -ForegroundColor Green
} else {
    Write-Host "ℹ️  .next directory not found" -ForegroundColor Blue
}

# Clean node_modules cache
Write-Host "🧹 Cleaning npm cache..." -ForegroundColor Yellow
npm cache clean --force
Write-Host "✅ npm cache cleared" -ForegroundColor Green

# Clean package-lock and reinstall (optional - uncomment if needed)
# Write-Host "🔄 Reinstalling dependencies..." -ForegroundColor Yellow
# Remove-Item "package-lock.json" -ErrorAction SilentlyContinue
# Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
# npm install
# Write-Host "✅ Dependencies reinstalled" -ForegroundColor Green

# Check for Windows Defender exclusions
Write-Host "🛡️  Checking Windows Defender..." -ForegroundColor Yellow
$projectPath = Get-Location
Write-Host "ℹ️  Consider adding this path to Windows Defender exclusions:" -ForegroundColor Blue
Write-Host "   $projectPath" -ForegroundColor Cyan
Write-Host "   Open Windows Security > Virus & threat protection > Exclusions" -ForegroundColor Cyan

# Performance recommendations
Write-Host "`n🎯 Performance Recommendations:" -ForegroundColor Magenta
Write-Host "1. Add your project folder to antivirus exclusions" -ForegroundColor White
Write-Host "2. Use 'npm run dev:clean' for a fresh start" -ForegroundColor White
Write-Host "3. Consider using WSL2 for better filesystem performance" -ForegroundColor White
Write-Host "4. Ensure your project is on a local drive (not network)" -ForegroundColor White
Write-Host "5. Close unnecessary applications to free up system resources" -ForegroundColor White

Write-Host "`n✨ Optimization complete!" -ForegroundColor Green
