# Nebula Maze - Portrait Mode Version

## Overview
This is a portrait-optimized version of the Nebula Maze game, designed specifically for vertical/portrait displays.

## Key Differences from Standard Version

### Layout Changes
- **Side-by-Side Layout**: Controls and dashboard are positioned on the sides of the maze instead of below it
- **Maximized Maze Height**: The maze area uses maximum available vertical space
- **Left Side**: Arrow controls (⬆️⬅️⬇️➡️)
- **Right Side**: Dashboard with score, health, and inventory
- **No Bottom Controls**: The traditional portrait controls below the maze are disabled

### Positioning
```
┌────────────────────────────────────────┐
│         Top Stats Bar                  │
├─────────┬──────────────┬───────────────┤
│         │              │               │
│  Arrow  │     Maze     │   Dashboard   │
│ Controls│    (Max      │   - Trophy    │
│   ⬆️    │   Height)    │   - Settings  │
│ ⬅️⬇️➡️  │              │   - Score     │
│         │              │   - Health    │
│         │              │   - Inventory │
└─────────┴──────────────┴───────────────┘
```

### Technical Details
- Maze sizing: `min(50vw, calc(100vh - 200px))` to maximize height
- Controls: 14x14 (56px) buttons for easy touch interaction
- Dashboard: 120px width with compact 4x4 inventory grid
- Top stats panel remains unchanged

## Files Modified
- [src/components/MazeGame.tsx](src/components/MazeGame.tsx) - Layout changes (lines 1393-1860)
- [package.json](package.json) - Updated name to "portrait-phylo-maze"

## Building
```bash
npm install
npm run build
```

## Location
- Portrait Version: `C:\Projects\PortraitPhyloMazeWork`
- Standard Version: `C:\Projects\PhyloMazeWork` (unchanged)

## Notes
- All game logic, encounters, and questions remain identical
- Firebase, AdMob, RevenueCat integrations unchanged
- CrazyGames sitelock protection still active
- Privacy policy and all documentation files included
