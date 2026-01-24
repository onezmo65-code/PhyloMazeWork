# Nebula Maze - Advertising Setup Guide

## Overview
This guide walks you through setting up Google AdSense (web) and Google AdMob (mobile) for Nebula Maze to generate advertising revenue.

---

## Part 1: Google AdSense (Web Version)

### Step 1: Apply for AdSense Account
1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Click "Get Started"
3. Enter your website: `https://nebula-maze.web.app`
4. Select your country and accept terms
5. Link your Google account

### Step 2: Site Verification
Google will need to verify your site ownership:
1. Add the verification code to `index.html` (in the `<head>` section):
```html
<meta name="google-adsense-account" content="ca-pub-XXXXXXXXXXXXXXXX">
```
2. Deploy and wait for verification (can take 1-14 days)

### Step 3: Requirements for Approval
Ensure your site has:
- ✅ **Privacy Policy** - Already at `/privacy-policy.html`
- ✅ **Original Content** - Nebula Maze is original
- ✅ **Navigation** - Clear, easy to use
- ✅ **Quality Content** - Educational game
- ✅ **No prohibited content** - Family-friendly
- ✅ **Sufficient content** - Fully functional game

### Step 4: Add AdSense Script (After Approval)
Once approved, add to `index.html` before `</head>`:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"></script>
```

### Step 5: Create Ad Units
1. In AdSense dashboard, go to **Ads** > **By ad unit**
2. Create these ad units:
   - **Display ad** (responsive) - for sidebar
   - **In-feed ad** - between content
   - **Multiplex ad** - for related content

### Step 6: Update Code with Your IDs
Edit `src/utils/adsense.ts` and `src/components/AdBanner.tsx`:
- Replace `ca-pub-XXXXXXXXXXXXXXXX` with your publisher ID
- Replace slot IDs with your ad unit slot IDs

---

## Part 2: Google AdMob (Mobile Apps)

### Step 1: Create AdMob Account
1. Go to [Google AdMob](https://admob.google.com/)
2. Sign in with your Google account
3. Accept terms and create account

### Step 2: Add Your App
1. Click **Apps** > **Add App**
2. Select **Android** first, then repeat for **iOS**
3. App name: `Nebula Maze`
4. If not published yet, select "No" for Play Store listing

### Step 3: Create Ad Units
For each platform (Android & iOS), create:

| Ad Type | When to Show | Recommended |
|---------|--------------|-------------|
| **Banner** | During gameplay | Bottom of screen |
| **Interstitial** | Between levels | Every 3-5 levels |
| **Rewarded Video** | Extra life/skip question | User-initiated |

### Step 4: Get Your Ad Unit IDs
After creating ad units, you'll get IDs like:
- Android Banner: `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`
- Android Interstitial: `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`
- Android Rewarded: `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`
- iOS Banner: `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`
- iOS Interstitial: `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`
- iOS Rewarded: `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`

### Step 5: Update Your Code
Edit `src/utils/admob.ts`:
```typescript
const IS_PRODUCTION = true; // Change to true

const PROD_AD_UNITS = {
  ANDROID_BANNER: 'ca-app-pub-YOUR_ID/YOUR_UNIT_ID',
  ANDROID_INTERSTITIAL: 'ca-app-pub-YOUR_ID/YOUR_UNIT_ID',
  ANDROID_REWARDED: 'ca-app-pub-YOUR_ID/YOUR_UNIT_ID',
  IOS_BANNER: 'ca-app-pub-YOUR_ID/YOUR_UNIT_ID',
  IOS_INTERSTITIAL: 'ca-app-pub-YOUR_ID/YOUR_UNIT_ID',
  IOS_REWARDED: 'ca-app-pub-YOUR_ID/YOUR_UNIT_ID',
};
```

### Step 6: Android Configuration
Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"/>
```

### Step 7: iOS Configuration
Add to `ios/App/App/Info.plist`:
```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX</string>
<key>SKAdNetworkItems</key>
<array>
  <dict>
    <key>SKAdNetworkIdentifier</key>
    <string>cstr6suwn9.skadnetwork</string>
  </dict>
</array>
```

---

## Part 3: Implementation in Nebula Maze

### Current Ad Placements (Ready to Use)
The code already supports:

1. **Launcher Page** - Ad placeholder below share buttons
2. **Between Levels** - Interstitial ad trigger point exists
3. **Game Over** - Rewarded video for continue option

### Files Modified
- `src/utils/admob.ts` - Mobile ad service (updated)
- `src/utils/adsense.ts` - Web ad service (new)
- `src/components/AdBanner.tsx` - React ad component (new)
- `public/privacy-policy.html` - Privacy policy (updated)

---

## Part 4: Testing

### Test Mode (Default)
The code uses Google's test ad IDs by default:
- Banner: `ca-app-pub-3940256099942544/6300978111`
- Interstitial: `ca-app-pub-3940256099942544/1033173712`
- Rewarded: `ca-app-pub-3940256099942544/5224354917`

### Enable Production Ads
In `src/utils/admob.ts`, change:
```typescript
const IS_PRODUCTION = true;
```

---

## Part 5: Revenue Expectations

### Typical Mobile Game RPM (Revenue per 1000 impressions)
| Ad Type | RPM Range |
|---------|-----------|
| Banner | $0.10 - $0.50 |
| Interstitial | $1.00 - $5.00 |
| Rewarded Video | $5.00 - $15.00 |

### Based on Your Current Analytics (136 users/month)
Estimated monthly revenue:
- Conservative: $5 - $15
- With growth to 1000 users: $50 - $150
- With growth to 10000 users: $500 - $1500

---

## Part 6: Best Practices for Approval

### Do's ✅
- Keep ads non-intrusive
- Show interstitials at natural breaks (between levels)
- Make rewarded ads optional (user-initiated)
- Maintain good user experience
- Update privacy policy

### Don'ts ❌
- Don't place ads that block gameplay
- Don't auto-click or incentivize ad clicks
- Don't show too many interstitials (max 1 per 3 levels)
- Don't place ads near interactive elements

---

## Quick Start Checklist

### For Web (AdSense)
- [ ] Apply at https://www.google.com/adsense/
- [ ] Add verification meta tag to index.html
- [ ] Deploy and wait for approval
- [ ] Create ad units after approval
- [ ] Update adsense.ts with your IDs
- [ ] Deploy updated code

### For Mobile (AdMob)
- [ ] Create account at https://admob.google.com/
- [ ] Add Android app
- [ ] Add iOS app
- [ ] Create ad units for both platforms
- [ ] Update admob.ts with your IDs
- [ ] Update AndroidManifest.xml
- [ ] Update Info.plist
- [ ] Set IS_PRODUCTION = true
- [ ] Build and deploy apps

---

## Support

If you encounter issues:
1. Check AdSense/AdMob dashboard for policy violations
2. Ensure test device IDs are configured for testing
3. Check console for error messages
4. Review Google's ad policies

Good luck with monetization! 🎮💰
