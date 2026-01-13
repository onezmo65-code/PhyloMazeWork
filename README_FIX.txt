To fix the "SDK location not found" error:

1. Extract this zip file into your project root folder (C:\Projects\PhyloMazeWork\).
2. It should overwrite/place the following files:
   - android/local.properties
   - android/build.gradle
   - android/settings.gradle
   - android/variables.gradle
   - android/app/build.gradle
   - package.json

3. The critical file is 'android/local.properties' which now points to your Android SDK at:
   C:\Users\Diska\AppData\Local\Android\Sdk

4. After extracting, run:
   npm install
   npx cap sync android
   cd android
   ./gradlew assembleDebug
