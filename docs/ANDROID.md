# Untaggable Android build

Untaggable packages the existing browser game with Capacitor so the game assets are bundled for offline play.

## GitHub build
The **Android Debug APK** workflow runs on pushes to main and can also be started manually from GitHub Actions. Its artifact is named **Untaggable-debug-apk**.

## Package
Android application ID: `com.untaggable.game`.

## Development
Run `npm install`, `node scripts/prepare-android.mjs`, `npx cap add android`, and `npx cap sync android`. The generated Android project can then be built with Gradle or opened in Android Studio.
