# PrepPulse AI

Responsive Next.js career coaching MVP with a Capacitor Android wrapper. It includes an ATS optimizer, ATS-friendly resume builder, multi-turn mock interview coach, speech dictation, three interactive learning modules, persistent local XP/streaks, native/web reminders, and an aggregate sample university dashboard.

## Directory map

```text
preppulse-ai/
├── app/
│   ├── api/{resume,interview,notifications}/route.ts
│   ├── globals.css, layout.tsx, page.tsx
├── components/
│   ├── dashboard/{OverviewTab,StatCard,ReadinessWidget,FocusList}.tsx
│   ├── resume/{ResumeStudioTab,AtsOptimizer,ResumeBuilder,ResumePreview}.tsx
│   ├── interview/{InterviewCoachTab,FeedbackPanel,SpeechInput}.tsx
│   ├── learning/{LearningPathTab,ModuleCard,QuizModal}.tsx
│   ├── campus/{CampusPortalTab,CohortChart}.tsx
│   ├── ui/{Toast,Modal,ProgressBar,PageHeading}.tsx
├── hooks/{useUserProgress,useSpeechRecognition}.ts
├── lib/{ai,client,engines,types}.ts
├── scripts/build-android.sh
└── capacitor.config.ts, next.config.js, package.json, Tailwind/PostCSS/TS config
```

## Local development and checks

Requires Node.js 18.17+.

```bash
npm install
npm run dev
# in another terminal
npm run typecheck
npm run build
```

Open http://localhost:3000. No AI key is required. With no key, `/api/resume` and `/api/interview` use deterministic local heuristic engines. The same engines run in the browser when the API is unavailable (including in the offline Android package). Tokenization is cached with a bounded LRU cache; answer scoring tokenizes each answer once.

## Optional AI providers

Copy `.env.example` to `.env.local`, then set `GEMINI_API_KEY` or `OPENAI_API_KEY`. Gemini is preferred if both are present; `GEMINI_MODEL` defaults to `gemini-2.5-flash`. `OPENAI_MODEL` can override the default `gpt-4o-mini`. Keys are server-only; never use `NEXT_PUBLIC_` credentials. Resume notes and interview answers are sent to the configured provider for analysis. Provider errors, timeouts, malformed output, or missing keys transparently fall back to local engines. Review generated content for accuracy before relying on it.

## Android debug APK

Prerequisites: Android Studio / Android SDK, Java 17, and `ANDROID_HOME` or `ANDROID_SDK_ROOT` configured.

```bash
npm install
npx cap add android       # one-time platform setup
npm run build:android     # offline static web export + cap sync
cd android
./gradlew assembleDebug
```

The APK is written to `android/app/build/outputs/apk/debug/app-debug.apk`. On Windows, run the script under Git Bash/WSL and use `gradlew.bat assembleDebug` from `android`. The Android export keeps the API route source files in place: `CAPACITOR_STATIC=1` uses conditional Next config to export `.tsx` pages and omit `.ts` route handlers. The script does not move or rename source directories.

## Privacy and behavior

- XP, streak, completed modules, and session counts are saved in browser/device `localStorage`. A missed day resets the streak on the next activity; same-day activity does not add another day.
- Speech recognition uses the browser's supported Web Speech implementation when available, explicitly stops or aborts sessions, and offers text entry as the fallback.
- Android reminders use Capacitor Local Notifications; web reminders use the Web Notification API when permission is granted, otherwise an in-app nudge is shown.
- The institution portal uses illustrative aggregate data only; it is not connected to student records.
- Resume export uses the browser's accessible print flow and print stylesheet (no `document.write`).
