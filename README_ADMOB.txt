This fixes the "invalid source release: 21" error by downgrading the AdMob plugin's Java requirement to 17.

1. Extract this zip to your project root.
2. Move/Copy the 'admob_build.gradle' file to:
   node_modules/@capacitor-community/admob/android/build.gradle
   (Overwrite the existing file)

3. Rebuild:
   cd android
   ./gradlew assembleDebug

Note: If you run 'npm install' again, this file will be reset, and you'll need to apply this fix again.
