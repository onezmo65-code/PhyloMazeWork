# PhyloMaze - Android Device Testing Checklist

## 📱 Device Info
- **Device ID**: R5CWC2BXS9X
- **App Installed**: ✅ Yes
- **APK Path**: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🧪 Testing Checklist

### ✅ = Pass | ❌ = Fail | ⏭️ = Skip | ⚠️ = Issue Found

---

### 1. Launch & Initial Screen
- [ ] App launches without crashing
- [ ] Light blue background displays correctly
- [ ] "NEBULA MAZE" title visible
- [ ] Difficulty selector shows all 3 options (Easy, Hard, Tough Genius)
- [ ] Player icon selector shows all 5 options (Boy, Girl, Cat, Dog, Car)
- [ ] Advertisement/currency images display (2 images)
- [ ] START ADVENTURE button visible and functional

---

### 2. Header Layout (Game Screen)
**Expected Layout**: Trophy/Settings vertical on left, Score/Health next, Inventory grid on right

- [ ] **Scrolling banner** at very top displays correctly
- [ ] **Trophy button** (50x50px, yellow icon) - top left
- [ ] **Settings button** (50x50px, cyan icon) - directly BELOW trophy ✓
- [ ] **Score display** (50x50px, green background, "SCR" label)
- [ ] **Health display** (50x50px, "HP" label, shows percentage)
- [ ] **Inventory grid** (4 columns × 3 rows = 12 cells, 32x32px each)
- [ ] **Ad banner** (90px height, white background, "Advertisement Space")
- [ ] All elements fit on screen without horizontal scroll
- [ ] No overlapping elements

---

### 3. Maze Display
- [ ] Maze square displays centered
- [ ] Maze is larger than before (freed up space from button reduction)
- [ ] Player avatar visible (chosen icon from launcher)
- [ ] Player can see immediate surroundings (fog of war works)
- [ ] Background scenery image displays
- [ ] Walls render correctly
- [ ] Items visible in nearby cells

---

### 4. Control Buttons
**Expected**: Smaller buttons (36px instead of 44px), tighter spacing

- [ ] Up arrow button works (moves player up)
- [ ] Down arrow button works (moves player down)
- [ ] Left arrow button works (moves player left)
- [ ] Right arrow button works (moves player right)
- [ ] Buttons have reduced size but still easily tappable
- [ ] Button spacing looks good (not too cramped)
- [ ] Buttons positioned close to bottom of screen

---

### 5. Academic Challenge Popup
**Expected**: Smaller popup (max-w-sm), scrollable, not obscured by ad banner

**Trigger**: Move around until academic question appears (5% chance on empty cells)

- [ ] Popup appears centered on screen
- [ ] Popup is NOT hidden behind ad banner ✓
- [ ] Popup width fits screen (doesn't overflow)
- [ ] If content is tall, popup scrolls ✓
- [ ] Question text displays clearly
- [ ] Category badge shows (top right corner)
- [ ] All answer options visible
- [ ] Answer buttons are tappable
- [ ] "Skip Question" button works (-5 points)
- [ ] Popup background overlay darkens rest of screen

**Test Specific Questions**:
- [ ] Stop sign question shows: "What does a red octagonal (8-sided) sign mean?"
- [ ] Options: Stop, Go, Yield, Speed Limit
- [ ] No broken image appears (image dependency removed) ✓

---

### 6. Hazard Encounter Popup
**Expected**: Smaller popup (max-w-sm), inventory grid visible, scrollable

**Trigger**: Step on hazard (snake 🐍, fire 🔥, etc.)

- [ ] Popup appears centered on screen
- [ ] Popup is NOT hidden behind ad banner ✓
- [ ] Hazard icon displays and animates (bounce)
- [ ] Hazard name displays below icon
- [ ] Instruction text visible
- [ ] Inventory items displayed in 3-column grid
- [ ] Item icons visible and correctly sized
- [ ] Item names display below icons
- [ ] Can select an item by tapping
- [ ] "Take Damage (No Item)" button works
- [ ] Popup scrolls if inventory has many items ✓

**Test Different Hazards**:
- [ ] Snake 🐍 - Try using Antivenom (should give 0 HP loss)
- [ ] Fire 🔥 - Try using Water (should give 0 HP loss)
- [ ] Quicksand 🏜️ - Try using Rope/Stick/Teamwork
- [ ] Bee 🐝 - Try using Honey/Herb

---

### 7. Settings Panel (Operator Panel)
**Expected**: Panel fits screen with scrolling if needed

- [ ] Settings button (gear icon) opens panel
- [ ] Panel appears centered
- [ ] Panel doesn't overflow screen (max-h-90vh) ✓
- [ ] Two tabs visible: "Settings" and "Questions"
- [ ] **Settings Tab**:
  - [ ] Music Volume slider works
  - [ ] Sound Effects Volume slider works
  - [ ] Volume percentages display correctly
- [ ] **Questions Tab** (if testing question editor):
  - [ ] Question list displays
  - [ ] Can scroll through questions
  - [ ] Can edit questions
- [ ] Close button (X) works

---

### 8. Level Progression & Exit
**Expected**: Exit works on first step (no double-step required)

- [ ] Explore ~80% of maze to unlock exit
- [ ] Exit door 🚪 becomes accessible
- [ ] **Step on exit ONCE** - Level Complete modal appears ✓
- [ ] Modal shows: "Level Complete!", random title, score
- [ ] Click "Continue" - Next level starts immediately ✓
- [ ] Player does NOT need to step on exit again ✓
- [ ] New level loads with new maze layout
- [ ] Player receives +3 starter items each level

---

### 9. Game Flow & Monetization
**Expected**: First 2 games free, 3rd game shows paywall

**Game 1**:
- [ ] Launch app fresh (clear data if needed)
- [ ] Click START ADVENTURE - Game starts immediately ✓
- [ ] No paywall or ad interstitial before starting ✓

**Game 2** (after Game Over):
- [ ] Return to launcher
- [ ] Click START ADVENTURE - Game starts immediately ✓
- [ ] No paywall or ad interstitial before starting ✓

**Game 3** (after 2nd Game Over):
- [ ] Return to launcher
- [ ] Click START ADVENTURE - **Paywall should appear** ⚠️
- [ ] Paywall offers: Watch Ad, or Subscribe (Weekly/Monthly/Yearly)
- [ ] Can close paywall and return to launcher

**After Watching Ad**:
- [ ] Click START ADVENTURE after watching ad
- [ ] Game starts (ad grants 1 play) ✓

**After Level Complete** (Game 3+):
- [ ] Complete a level
- [ ] Ad interstitial should appear between levels ⚠️
- [ ] Can watch ad to continue

---

### 10. Leaderboard & Signup
- [ ] Trophy button opens leaderboard
- [ ] High scores display correctly
- [ ] If new high score achieved, signup prompt appears
- [ ] Can enter nickname
- [ ] Score saves to leaderboard

---

### 11. Audio & Sound Effects
- [ ] Background music plays
- [ ] Step sound plays when moving
- [ ] Pickup sound plays when collecting items
- [ ] Hazard siren plays when encountering hazards
- [ ] Level up sound plays on level completion
- [ ] Question correct/wrong sounds play
- [ ] Volume controls in settings work

---

### 12. Visual Polish
- [ ] Scenery background changes every 30 seconds
- [ ] Cell background color cycles (yellow variations)
- [ ] Fog of war works (unexplored cells are black)
- [ ] Explored but not visible cells show as darker
- [ ] Player avatar bounces slightly
- [ ] Smooth transitions and animations

---

## 🐛 Issues Found During Testing

### Issue Template:
```
**Issue**: [Brief description]
**Location**: [Where it occurs]
**Steps to Reproduce**:
1.
2.
3.
**Expected**: [What should happen]
**Actual**: [What actually happens]
**Severity**: Critical / High / Medium / Low
**Screenshot**: [If applicable]
```

---

## 📸 Required Screenshots for Play Store

Take screenshots of the following:

1. **Launcher Screen** - Main menu with START button
2. **Game Screen - Early Level** - Show UI layout, small maze
3. **Game Screen - Later Level** - Show larger maze, inventory filled
4. **Academic Challenge** - Question popup displayed
5. **Hazard Encounter** - Inventory selection popup
6. **Level Complete** - Victory screen
7. **Leaderboard** - High scores display
8. **Settings Panel** - Volume controls

**Recommended**: Take screenshots in portrait mode at device's native resolution

---

## ✅ Final Approval Criteria

### Must Pass All:
- [ ] No crashes during 10+ minute gameplay session
- [ ] All popups fully visible (not obscured by ads)
- [ ] Settings button is BELOW trophy button ✓
- [ ] All UI elements properly sized and readable
- [ ] Control buttons functional and appropriately sized
- [ ] Exit works on first step (no double-step) ✓
- [ ] No broken images or missing assets ✓
- [ ] Encounter remedies work logically
- [ ] First 2 games are completely free
- [ ] Game playable from Level 1 through Level 5+

---

## 🚀 Ready for Store Submission When:
- [ ] All above tests pass
- [ ] No critical or high severity bugs
- [ ] Screenshots captured
- [ ] App description written
- [ ] Privacy policy prepared (if needed)
- [ ] Signed release APK generated
- [ ] Version code incremented
- [ ] Developer account ready

---

## 📝 Notes Section

Use this space to record observations during testing:

```
[Date/Time] - [Observation]


```

---

## 👤 Tester Information

- **Tester Name**: _______________
- **Test Date**: _______________
- **Device Model**: _______________
- **Android Version**: _______________
- **Test Duration**: _______________
- **Overall Status**: PASS / FAIL / NEEDS WORK

---

**Good luck with testing! 🎮**
