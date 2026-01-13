# PowerShell Script to Copy CrazyGames Upload Files
# Run this script from: C:\Projects\PhyloMazeWork
#
# Usage: .\copy-to-crazygames.ps1

# Define source and destination
$source = "C:\Projects\PhyloMazeWork\dist"
$destination = "C:\Projects\Game Maze\ClaudeCrazy"

# Create destination directory if it doesn't exist
if (!(Test-Path -Path $destination)) {
    New-Item -ItemType Directory -Path $destination -Force
    Write-Host "Created destination folder: $destination" -ForegroundColor Green
}

# Clear destination folder (optional - comment out if you want to keep existing files)
Write-Host "Cleaning destination folder..." -ForegroundColor Yellow
Remove-Item -Path "$destination\*" -Recurse -Force -ErrorAction SilentlyContinue

# Copy essential files
Write-Host "`nCopying essential files..." -ForegroundColor Cyan

# Copy root files
Write-Host "Copying root files..." -ForegroundColor White
Copy-Item -Path "$source\index.html" -Destination $destination -Force
Copy-Item -Path "$source\vite.svg" -Destination $destination -Force
Copy-Item -Path "$source\yw_manifest.json" -Destination $destination -Force
Copy-Item -Path "$source\questions.json" -Destination $destination -Force

# Copy assets folder (excluding .zip files)
Write-Host "Copying assets folder..." -ForegroundColor White
if (Test-Path "$source\assets") {
    New-Item -ItemType Directory -Path "$destination\assets" -Force | Out-Null
    Get-ChildItem -Path "$source\assets" -File | Where-Object { $_.Extension -ne ".zip" } | ForEach-Object {
        Copy-Item -Path $_.FullName -Destination "$destination\assets\" -Force
    }
}

# Copy images folder
Write-Host "Copying images folder..." -ForegroundColor White
if (Test-Path "$source\images") {
    Copy-Item -Path "$source\images" -Destination $destination -Recurse -Force
}

# Display summary
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "COPY COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Count files
$fileCount = (Get-ChildItem -Path $destination -Recurse -File | Measure-Object).Count
$folderSize = (Get-ChildItem -Path $destination -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB

Write-Host "`nDestination: $destination" -ForegroundColor Cyan
Write-Host "Total Files: $fileCount" -ForegroundColor Cyan
Write-Host "Total Size: $([math]::Round($folderSize, 2)) MB" -ForegroundColor Cyan

Write-Host "`nFiles copied:" -ForegroundColor Yellow
Get-ChildItem -Path $destination -Recurse -File | Select-Object -ExpandProperty FullName | ForEach-Object {
    $relativePath = $_.Replace($destination, "").TrimStart('\')
    Write-Host "  ✓ $relativePath" -ForegroundColor Gray
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Ready for CrazyGames upload!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Compress the folder: $destination" -ForegroundColor White
Write-Host "2. Upload to CrazyGames Developer Portal" -ForegroundColor White
Write-Host "3. Set entry point: index.html" -ForegroundColor White
