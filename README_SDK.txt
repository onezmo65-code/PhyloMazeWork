This update fixes the "checkDebugAarMetadata" error by updating the Android SDK versions to match the new requirements from libraries.

1. Extract this zip to your project root.
2. It updates:
   - android/variables.gradle (Sets compileSdk and targetSdk to 35)
   - android/build.gradle (Updates Gradle Plugin to 8.7.3)

3. Rebuild:
   cd android
   ./gradlew assembleDebug
