The app crashed because the AdMob Application ID was missing from AndroidManifest.xml.
Without this ID, the AdMob plugin causes the app to crash immediately on launch.

1. Extract this zip to your project root.
2. It replaces 'android/app/src/main/AndroidManifest.xml' with the correct version containing the App ID.
3. Rebuild and install:
   cd android
   ./gradlew assembleDebug
   adb install -r app/build/outputs/apk/debug/app-debug.apk

Also, ensure you have 'google-services.json' in 'android/app/'. If missing, download it from Firebase Console.
