# Kinn P0/P1 Foundation Implementation Plan

> **For agentic workers:** Use `executing-plans` / `subagent-driven-development`. Skills: `expo-design-system`, `animate-expo`, `vercel-react-native-skills`, `verification-before-completion`.

**Goal:** Rebrand SnapFit mobile → Kinn Phase 0/1 shell: tokens, fonts, splash/loaders, tab IA (Home/Friends/Move/Progress), starter Home + Friends screens.

**Tech:** Expo 57, React Native, existing `mobile/` app.

## Tasks

1. Replace `theme.ts` with Kinn Brand Guide tokens + Sora/DM Sans type scale
2. Add `@expo-google-fonts/sora` + `dm-sans`; wire `_layout.tsx`
3. Build `KinnSplash`, `ProgressBar`, `IndeterminateBar`, `KinnSpinner` from `kinn-splash-and-loader.html`
4. Update `app.json` name/scheme/splash/icon colors to Kinn
5. Retarget tabs: index=Home, friends=new, move=routines rename, progress=keep; drop coach/recovery from tabs
6. New Home sections (dashboard + friend nudge) + Friends screen skeleton
7. Lint + `tsc --noEmit`
