# Findings

## Baseline
- The phase roadmap has substantial open P0/P1/P2 work; its 2026-10-11 status note already says phase exits are not met.
- Mobile is Expo SDK 57 with existing Kinn theme, logo assets, splash/loaders, tabs, policy screens, mock dashboard, tracker, and local Phase 2 social prototype.
- There is no account, friends, workout, health-sync, consent, deletion, or moderation API. `mobile/src/app/api` only contains the coach route.
- Root package already has Express and TypeScript tooling, but there is no PostgreSQL/Redis/object-storage service setup or backend source.
- Root `npm run lint` passes. Mobile TypeScript passes; mobile lint currently has 9 warnings. Root and Expo preview servers are already running in existing terminals.
- P0 permission catalog now centralizes contextual Health, Notifications, Contacts, and Camera rationale with `requestOnColdLaunch: false`; the Health rationale sheet consumes it. The other three permission flows are not wired yet.
- User approved raising Android minimum to API 26 to support Health Connect; the API 26 floor and Expo config plugin must be reflected before Android builds.
- Samsung Health inspiration set calls for an overview plus Activity, Sleep, Vitals/Heart, Mindfulness, and Nutrition modules. User expects phone and connected-watch sources; show permission/unavailable states instead of mock values as if live.

## Requirements / Risks
- The P0/P1/P2 store exit gates require organization accounts, counsel-reviewed policies, hosted HTTPS URLs, platform declarations, and real test builds; source changes cannot prove these.
- Node.js 24 and npm 11 are available; Docker, PostgreSQL CLI/server, and Redis server are not installed. Backend code can be authored and unit-tested, but live persistence/infrastructure integration cannot be marked verified until services are provisioned.
- Root already includes Express, dotenv, TypeScript, and tsx, but those currently support the Vite prototype; root TypeScript scope intentionally excludes a future separate backend tree.
- Permission copy catalog is implemented in `mobile/src/data/permission-copy.ts`; only Health rationale is wired into onboarding. Notifications, Contacts, and Camera still need real, contextual entry points before permission prompts.
- HealthKit and Health Connect permission behavior requires platform builds/devices; Expo web preview is not sufficient verification.
- Reports, blocks, visibility, stories, and reactions currently persist only on-device and must not be described as moderated or enforced in production.
- Exercise art is available in `vendor/free-exercise-db` under the Unlicense. Several source records have inaccurate or equipment-mismatched artwork; verify every selected image and use explicit fallbacks instead of filename-only matching.
- Never copy visual media from `vendor/openGym/catalogue/media`.
- User-provided Samsung Health inspirations show six distinct product areas (overview, Activity, Sleep, Vitals/Heart Health, Mindfulness, Nutrition) in addition to a full-width colorful illustrated-card visual language. It is not clear whether the request is to add those modules or apply only the visual treatment to current workout cards; resolve scope before implementation.