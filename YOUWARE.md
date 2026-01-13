# YOUWARE.md

# Nebula Maze: Fog of War (v1.7.2)

A React-based dungeon crawler game with fog of war mechanics, inventory system, and AI-generated content.

## Project Overview

- **Project Type**: React + TypeScript Game (Vite)
- **Mobile Wrapper**: Capacitor (iOS & Android)
- **Entry Point**: `src/main.tsx` -> `src/App.tsx` -> `src/components/MazeGame.tsx`
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth, Analytics, Storage) + RevenueCat (Subscriptions)

## Development Commands

### Web Development
- **Install Dependencies**: `npm install`
- **Start Dev Server**: `npm run dev`
- **Build Web Assets**: `npm run build`
- **Preview Build**: `npm run preview`
- **Lint Code**: `npm run lint`

### Mobile Development (Capacitor)
- **Sync Web to Native**: `npx cap sync` (Run after `npm run build`)
- **Open Android Studio**: `npx cap open android`
- **Open Xcode**: `npx cap open ios`

### Android Specifics
- **Wrapper Command**: Use `./gradlew` (Mac/Linux) or `.\gradlew.bat` (Windows) inside `android/` directory.
- **Generate SHA-1**: `cd android && ./gradlew signingReport`
- **Build Bundle**: `cd android && ./gradlew bundleRelease` (Requires signing config)
- **JDK Requirement**: **Java 17** is required for Gradle 8.2.1.
  - *Android Studio*: Settings > Build Tools > Gradle > Gradle JDK > jbr-17.
  - *Command Line*: Set `JAVA_HOME` to a JDK 17 installation.

## Architecture & Structure

### Core Components
- **MazeGame.tsx**: The central game loop and state manager.
  - **Layout**: Responsive design with `flex-row` for desktop (Ads on sides) and optimized portrait mode for mobile.
  - **Mobile UX**: Prompts (questions/inventory) are rendered as overlays (`z-50`) to maximize maze visibility.
  - **Audio**: Synthesized sound effects (e.g., Siren for hazards) via `MusicPlayer` service.
- **Services**:
  - `storageTest.ts`: Firebase Auth & Storage testing utilities.
  - `mazeUtils.ts`: Procedural generation logic (DFS with straightness bias).
  - `MusicPlayer.tsx`: Audio management.

### Data Management
- **Local Storage**: Persists user progress (`runCount`, `isPremium`, `highscores`).
- **Firebase**:
  - **Web**: Configured in `src/main.tsx`.
  - **Native**: Requires `google-services.json` in `android/app/` (Android) and `GoogleService-Info.plist` in `ios/App/App/` (iOS).
  - **Plugins**: `@capacitor-firebase/authentication`, `@capacitor-firebase/storage`.
    - **Note**: These plugins are manually included in `android/settings.gradle` to ensure stability.

### Monetization
- **RevenueCat**: Handles subscriptions (Weekly, Monthly, Yearly).
- **AdMob**:
  - **App ID**: `ca-app-pub-2187994309647585~6672282109` (Configured in `AndroidManifest.xml`).
  - **Implementation**: Interstitial ads (placeholder in `AdInterstitial.tsx`, requires `@capacitor-community/admob` for native).

## Critical Configuration
- **Android Package**: `com.onesmo.nebulamaze`
- **Firebase Config**:
  - `google-services.json` MUST be present in `android/app/` for native auth.
  - SHA-1 fingerprint must be added to Firebase Console for Google Sign-In.
- **Gradle Fixes (Applied)**:
  - **BouncyCastle**: Forced to `1.78.1` in `android/build.gradle` to avoid Java 21 compatibility issues.
  - **Missing Modules**: Manually included in `android/settings.gradle`.
  - **AndroidX Versions**: Downgraded in `android/variables.gradle` to support API 34 (Android 14) without requiring API 35/36.

## Troubleshooting
- **"Gradle not found"**: Use the wrapper script (`gradlew`) in the `android/` folder.
- **"Incompatible Gradle JVM"**: Ensure Android Studio is using Java 17, not Java 21.
- **"Project with path ... could not be found"**: Check `android/settings.gradle` for missing `include` statements.
