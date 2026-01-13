@echo off
REM Open the cover image generator in your default browser

echo Opening Nebula Maze Cover Image Generator...
echo.

REM Full path to the HTML file
set HTMLFILE=C:\Projects\PhyloMazeWork\create-cover-images.html

REM Try to open with default browser
start "" "%HTMLFILE%"

echo.
echo If the browser didn't open, you can:
echo 1. Copy this path: %HTMLFILE%
echo 2. Paste it into your browser's address bar
echo.
echo Or use these direct commands:
echo   Chrome: start chrome "%HTMLFILE%"
echo   Edge:   start msedge "%HTMLFILE%"
echo   Firefox: start firefox "%HTMLFILE%"
echo.
pause
