# CrazyGames Upload File List

## Required Files for Upload (21 files, ~500 KB without .zip files)

### Core Files
1. `index.html` - Main HTML entry point
2. `vite.svg` - Vite favicon
3. `yw_manifest.json` - App manifest
4. `questions.json` - Game questions database

### Assets Folder (`assets/`)
**JavaScript Files:**
- `assets/index-BCIem6fb.js` (314 KB) - Main app bundle
- `assets/web-CrlQpssq.js` (105 KB) - Web utilities
- `assets/web-DaqKpuF4.js` (35 KB) - Additional web code
- `assets/web-IZJghlh1.js` (9 KB) - Web helpers
- `assets/web-D3qZ4Qii.js` (2 KB) - Web components

**Source Maps (for debugging):**
- `assets/index-BCIem6fb.js.map`
- `assets/web-CrlQpssq.js.map`
- `assets/web-DaqKpuF4.js.map`
- `assets/web-IZJghlh1.js.map`
- `assets/web-D3qZ4Qii.js.map`

**CSS:**
- `assets/index-hrA5FbuL.css` (34 KB) - Main stylesheet

**Images:**
- `assets/stop_sign.png` - Game asset

### Images Folder (`images/questions/`)
**Question Images:**
- `images/questions/elephant.jpg`
- `images/questions/octagon.png`
- `images/questions/wrench.png`
- `images/questions/README.md`
- `images/questions/.gitkeep`

---

## Files to EXCLUDE from Upload (Development Only)

❌ **Do NOT upload these .zip files:**
- `AndroidVariablesFix.zip`
- `BuildFixes.zip`
- `CapacitorSetup.zip`
- `CordovaPluginsFix.zip`
- `MobileUpdate.zip`
- `NearFinalMazeGame.zip`
- `NebulaMaze_FirebaseIntegrated.zip`

---

## Upload Instructions for CrazyGames

### Method 1: Upload Entire `dist` Folder (Recommended)
1. Compress the `dist` folder contents (NOT including the .zip files)
2. Upload to CrazyGames portal
3. Set `index.html` as the entry point

### Method 2: Manual File Upload
Upload all files maintaining the folder structure:
```
dist/
├── index.html
├── vite.svg
├── yw_manifest.json
├── questions.json
├── assets/
│   ├── *.js
│   ├── *.js.map
│   ├── *.css
│   └── stop_sign.png
└── images/
    └── questions/
        ├── elephant.jpg
        ├── octagon.png
        └── wrench.png
```

### CrazyGames Configuration
- **Entry Point:** `index.html`
- **Game Type:** HTML5 Web Game
- **Build Tool:** Vite 7.0
- **Framework:** React 18.3
- **Source Maps:** Included (for debugging)

---

## Pre-Upload Checklist

✅ CrazyGames SDK integrated (`src/utils/crazyGames.ts`)
✅ Ad integration ready (AdMob for native, CrazyGames ads for web)
✅ Responsive design for desktop/mobile
✅ All assets bundled and optimized
✅ Source maps included for debugging
✅ Total size: ~500 KB (gzipped: ~144 KB)

---

## Build Info
- **Build Date:** January 11, 2026
- **Vite Version:** 7.3.0
- **Build Command:** `npm run build`
- **Output Directory:** `dist/`
