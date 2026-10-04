#!/usr/bin/env bash
set -Eeuo pipefail
cd "$(dirname "$0")/.."

if [[ ! -d android ]]; then
  echo "Android platform is missing. Run 'npx cap add android' once before building." >&2
  exit 1
fi

# The conditional Next config filters route.ts files from this static export.
# The source tree is never renamed or modified by this build script.
CAPACITOR_STATIC=1 npx next build
npx cap sync android

printf '\nOffline web assets exported and synced into Android.\n'
printf 'Build the debug APK with: cd android && ./gradlew assembleDebug\n'
printf 'Expected file: android/app/build/outputs/apk/debug/app-debug.apk\n'
