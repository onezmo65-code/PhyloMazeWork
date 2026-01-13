@echo off
REM Copy CrazyGames files
REM Run from: C:\Projects\PhyloMazeWork

echo ========================================
echo Copying files to CrazyGames folder...
echo ========================================

set DEST=C:\Projects\Game Maze\ClaudeCrazy

REM Create destination folder
if not exist "%DEST%" mkdir "%DEST%"

REM Clean destination
echo Cleaning destination folder...
del /Q "%DEST%\*.*" 2>nul
rmdir /S /Q "%DEST%\assets" 2>nul
rmdir /S /Q "%DEST%\images" 2>nul

REM Copy root files
echo Copying root files...
copy /Y "dist\index.html" "%DEST%\" >nul
copy /Y "dist\vite.svg" "%DEST%\" >nul
copy /Y "dist\yw_manifest.json" "%DEST%\" >nul
copy /Y "dist\questions.json" "%DEST%\" >nul

REM Copy assets folder
echo Copying assets folder...
xcopy /E /I /Y "dist\assets" "%DEST%\assets" >nul

REM Copy images folder
echo Copying images folder...
xcopy /E /I /Y "dist\images" "%DEST%\images" >nul

echo.
echo ========================================
echo Copy complete!
echo ========================================
echo Files copied to: %DEST%
echo.
dir /S /B "%DEST%"
echo.
echo ========================================
echo Ready for CrazyGames upload!
echo ========================================
echo.
echo Next steps:
echo 1. Compress folder: %DEST%
echo 2. Upload to CrazyGames Developer Portal
echo 3. Set entry point: index.html
echo.
pause
