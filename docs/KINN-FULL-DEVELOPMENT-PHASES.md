# Kinn — Full Development Phases (iOS + Android)

**Status:** Working plan · Progress updated 2026-10-11  
**Platforms:** Apple App Store + Google Play  
**Client:** Expo / React Native (`mobile/`)  
**Goal:** Ship a store-accepted social fitness app (track → friends → compete → rewards), without failing review.

This document expands the product roadmap into **frontend**, **backend**, **legal/compliance**, and **store submission** work. Store rules below are distilled from current Apple App Review Guidelines and Google Play policies (researched Oct 2026). Re-check official docs before each submission — policies change.

## Implementation status (2026-10-11)

- **Phase 0:** Kinn mobile tokens, logo assets, splash/loaders, router tabs, in-app policy screens, contextual permission-copy catalog, Node/TypeScript API foundation, production config validation, Postgres/Redis/S3 adapters, schema, and email OTP/session API code are implemented. Only Health currently consumes permission copy. Phase 0 is **not complete**: live service provisioning and migration execution, production email delivery, Apple sign-in preparation, remaining permission entry points, legal review/hosting, trademark checks, developer accounts, and store gates remain open.
- **Phase 1:** Home metrics and Kinn-branded workout UI are present; local email OTP API logic and session persistence are implemented against the P0 service contract. Friend requests and workout data remain local/mock. Phase 1 is **not complete**: live account service verification, HealthKit/Health Connect integrations, exercise-art pipeline, account deletion/export execution, persisted privacy controls, friends/workout/health APIs, moderation/admin services, and internal store builds remain open.
- **Phase 2:** Friends now has a local social prototype with circle filters, sample 24-hour moments, reactions, per-friend visibility controls, and device-local report/block behavior. It is **not production social**: no user-generated media composer, real story expiry/viewers, server-side report/block enforcement, moderation queue, SLA, content filtering, or social push service exists.
- **Milestone rule:** Checklist boxes below indicate implemented client scope only. No phase exit is met until its complete Exit and Store gate requirements are verified; policy text and local prototypes do not satisfy backend, legal, or store obligations.

**Primary sources**

- [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Developer Policy Center](https://support.google.com/googleplay/android-developer/topic/9858052) (UGC, Health, Data safety)
- [Health Connect / Play health declarations](https://developer.android.com/health-and-fitness/guides/health-connect)
- Kenya Data Protection Act 2019 / ODPC guidance (legal counsel required)

**Illustration policy (locked)**

| Source | Use in product |
| --- | --- |
| `vendor/free-exercise-db/` | Primary per-exercise art (public domain). Recolor/restyle to Kinn OK. |
| `vendor/workout-cool/` equipment + muscle UI | MIT — equipment icons / muscle maps |
| `vendor/openGym/catalogue/media` | **Do not ship** (Gym visual license) |

**Splash & loaders (locked)** — source: [`kinn-splash-and-loader.html`](../kinn-splash-and-loader.html)

| Piece | Spec |
| --- | --- |
| **Splash** | Ink `#0D1014` full screen; rings Paper `#F7F8F6` slide together; Lime lens pops; “kinn” letter draw; tagline “Move together.” rises. ~2.7s total. Fade out early if app ready after lens. Reduce Motion → static finished logo. |
| **Progress bar (known %)** | 8px tall, rounded; dark = Lime fill on Graphite track; light = Ink fill on Line track; Sora Bold %; DM Sans message; soft shine on fill. |
| **Indeterminate** | Sliding Lime segment on dark track (“Finding your friends”). |
| **Mini spinner** | Rotating dual-ring mark + beating Lime lens — pull-to-refresh / buttons. |
| **Copy rotation** | Connecting your watch → Syncing workouts → Finding your friends → Almost ready |
| **Skills** | `expo-animation` / `animate-expo` · `expo-design-system` · `vercel-react-native-skills` |

---

## How to read this plan

| Column | Meaning |
| --- | --- |
| **FE** | Mobile app (Expo), design system, store metadata assets |
| **BE** | API, auth, DB, realtime, jobs, admin |
| **Store gate** | Must be done before that phase’s binary can pass App Store / Play review |
| **Exit** | Definition of done for the phase |

Phases are sequential for *product risk*, but some infrastructure (accounts, privacy, UGC tools) must ship early and stay present forever.

---

# Agent skills (project-local — use these)

All skills for this repo live in **one folder only: `.agents/skills/`** (see `AGENTS.md` and `skills-lock.json`). Do not use scattered `.claude/`, `.windsurf/`, `.trae/`, etc. — those duplicates were removed. Any AI working on Kinn should load the matching skill **before** coding. Restore with `npx skills experimental_install`. Never run `npx skills add --all` here.

## Full catalog (23)

| Skill | When to use on Kinn |
| --- | --- |
| `using-superpowers` | Start of every session — how to find/use skills |
| `brainstorming` | Before any new feature, screen, or behavior change |
| `writing-plans` | After a design is approved — detailed implementation plan |
| `executing-plans` | Implementing a written plan in the current session |
| `subagent-driven-development` | Parallelizable plan execution with task subagents |
| `dispatching-parallel-agents` | 2+ independent tasks with no shared state |
| `using-git-worktrees` | Isolated feature branches / worktrees before big builds |
| `test-driven-development` | Any new feature or bugfix — tests before code |
| `systematic-debugging` | Any bug, test failure, or unexpected behavior |
| `verification-before-completion` | Before claiming done / commit / PR |
| `requesting-code-review` | After major features or before merge |
| `receiving-code-review` | When processing review feedback |
| `finishing-a-development-branch` | When implementation is complete — integrate / PR / cleanup |
| `expo-design-system` | Tokens, theme, reusable UI components (Kinn brand) |
| `expo-ui` | Native sheets, pickers, platform UI via `@expo/ui` |
| `expo-data-fetching` | API calls, caching, offline, error handling |
| `expo-animation` | Motion (lime pulse, wins, transitions) |
| `animate-expo` | Same animation decision stack for Expo/RN |
| `vercel-react-native-skills` | RN/Expo performance, lists, native modules |
| `mobile-native` | Make web surfaces feel installed (if any web companion) |
| `web-design-guidelines` | A11y / UX audit of UI (web marketing site or webviews) |
| `writing-skills` | Creating or editing project skills |
| `diagnosing-superpowers` | When a skill-driven session went wrong |

## Default workflow (every feature)

1. `using-superpowers` → `brainstorming`  
2. `writing-plans`  
3. `using-git-worktrees` (if isolation needed)  
4. `test-driven-development` + `executing-plans` / `subagent-driven-development`  
5. `systematic-debugging` if anything fails  
6. `verification-before-completion` → `requesting-code-review` → `finishing-a-development-branch`

## Skills by phase

| Phase | Primary skills | Also use |
| --- | --- | --- |
| **P0 Foundation** | `brainstorming`, `writing-plans`, `expo-design-system` | `using-superpowers`, `writing-skills` (if new project skills), `web-design-guidelines` (policy/marketing pages) |
| **P1 MVP** | `expo-design-system`, `expo-ui`, `expo-data-fetching`, `vercel-react-native-skills`, `test-driven-development`, `executing-plans` | `animate-expo` / `expo-animation` (dashboard numbers), `verification-before-completion`, `requesting-code-review` |
| **P2 Social** | `brainstorming`, `writing-plans`, `expo-ui`, `expo-data-fetching`, `subagent-driven-development` | `systematic-debugging`, `dispatching-parallel-agents` (FE UGC + BE moderation in parallel) |
| **P3 Compete** | `test-driven-development`, `executing-plans`, `expo-data-fetching`, `vercel-react-native-skills` | `animate-expo` (win pulse), `verification-before-completion`, `finishing-a-development-branch` |
| **P4 Music & watches** | `vercel-react-native-skills`, `expo-data-fetching`, `systematic-debugging` | `brainstorming` (SDK constraints), `requesting-code-review` |
| **P5 Rewards** | `brainstorming`, `writing-plans` (legal gates first), `test-driven-development` | `verification-before-completion`, `diagnosing-superpowers` if process stalls |
| **P6 Scale** | `vercel-react-native-skills`, `systematic-debugging`, `verification-before-completion` | `web-design-guidelines` (a11y), `dispatching-parallel-agents` |
| **Store submission** | `verification-before-completion`, `finishing-a-development-branch`, `requesting-code-review` | `systematic-debugging` (rejection fixes) |

## Skills checklist (agents must tick)

- [ ] Loaded skills from `.agents/skills/` (not only global copies)  
- [ ] Ran `brainstorming` before new UI/features  
- [ ] Ran `writing-plans` before multi-step implementation  
- [ ] Used `expo-design-system` for any visual/token work  
- [ ] Used `vercel-react-native-skills` for lists, native modules, perf  
- [ ] Used `test-driven-development` for behavior changes  
- [ ] Used `verification-before-completion` before “done”  
- [ ] Used `requesting-code-review` before merge of phase milestones  

---

# Cross-cutting store acceptance checklist

Build these into the app from Phase 0–1. Missing any of these is a common rejection cause for social + health apps.

## Apple App Store (must-haves for Kinn)

| Area | Requirement | Kinn implication |
| --- | --- | --- |
| **UGC / social (1.2)** | Filter objectionable content; report content; block users; contact for moderation; timely removal | Stories, reactions, photos, voice notes, friend chat-like features all count as UGC |
| **Account deletion (5.1.1(v))** | In-app account deletion (easy to find). Not “email support” for normal apps | Settings → Delete account; BE hard-deletes / anonymizes within stated window |
| **Privacy policy** | Public URL in App Store Connect + accurate Privacy Nutrition Labels | Host policy site; list HealthKit, contacts, photos, location if used |
| **HealthKit (5.1.3)** | Health/fitness data **not** for ads/marketing/data mining; don’t write false data; don’t store PHI in iCloud; disclose types collected; request access in context | Use HealthKit only for fitness features; no ad SDK fed by health data |
| **Health purpose (2.5.1)** | HealthKit only for health/fitness; integrate with Health app intent | App description must say it works with Apple Health |
| **IAP (3.1.1)** | Digital unlocks / subscriptions / premium features → **Apple IAP** | Premium tier, digital boosts → StoreKit / RevenueCat; not M-Pesa alone for digital unlock |
| **Physical goods (3.1.3(e))** | Physical rewards / gift cards mailed → non-IAP payments OK | Partner airtime/gift cards: careful classification + legal review |
| **Gambling (5.3)** | Real-money gaming needs licenses + geo-restrict + free app; no IAP for real-money gaming credits; contests need rules + “Apple not a sponsor” | **Ship points-only stakes first.** Money stakes = separate legal phase + org account |
| **Regulated fields (5.1.1(ix))** | Gambling / sensitive services → submit as **legal entity**, not individual | Register company before money/rewards stakes |
| **Metadata (2.3)** | Real screenshots (not only splash/login); no Android branding in iOS metadata; own rights to art | Use Kinn logo pack + free-exercise-db |
| **Login** | If social login exists, also offer non-social option / limited use where required | Phone/email sign-in for Kenya; Sign in with Apple if you offer other 3P logins |
| **Push (4.5.4)** | Opt-in for marketing pushes; not required for core function | Separate transactional vs marketing |

## Google Play (must-haves for Kinn)

| Area | Requirement | Kinn implication |
| --- | --- | --- |
| **UGC policy** | Accept ToS before UGC; report + block users/content; moderate ongoing | Same FE/BE as Apple |
| **Data safety form** | Accurate declaration of collected/shared data, encryption, deletion | Match actual BE behavior |
| **Account deletion** | Data deletion / account deletion path declared and working | Same as Apple; Play Console “Data deletion” URL |
| **Health Connect** | Declare data types; Health apps form; privacy policy must match Health Connect link; explain each type | Steps, HR, sleep, workouts, etc. |
| **Permissions** | Only request needed permissions; runtime rationale | Contacts, camera, notifications with clear copy |
| **Payments** | Play Billing for digital goods/subscriptions in most cases | Premium = Play Billing; physical rewards via other rails with policy care |
| **Gambling / real-money** | Strict policies + local licensing; often restricted | Points-only first; geo + licenses later |
| **Target API / target SDK** | Meet current Play target API level | Keep Expo SDK current |
| **Content rating** | IARC questionnaire honest (social + UGC) | Expect teen/mature if UGC open |

## Kenya / launch markets (legal + product)

| Area | Action |
| --- | --- |
| **Kenya DPA 2019** | Lawful basis, consent for health data, privacy notice, security, data subject rights, possible ODPC registration — **use counsel** |
| **Age** | 18+ for stakes/rewards; parental rules if under-18 ever allowed |
| **Payments** | M-Pesa via licensed PSP; don’t invent wallet rails |
| **Trademark** | “Kinn” + logo search before spend on brand |

---

# Phase map (overview)

| Phase | Name | Product outcome | Store posture |
| --- | --- | --- | --- |
| **P0** | Foundation | Brand, legal, accounts, compliance skeleton | Cannot submit without P0 artifacts |
| **P1** | MVP — Track & connect | Accounts, dashboard, HealthKit/Health Connect, friends (basic) | First TestFlight / internal testing track |
| **P2** | Social | Circles, reactions, stories, UGC moderation live | Soft launch candidacy |
| **P3** | Compete | Duels, leaderboards, handicaps, **point** stakes | Production launch candidate |
| **P4** | Music & watches | Spotify/Apple Music, more device bridges | Feature update |
| **P5** | Rewards | Partner rewards → money stakes **if** legal + store-approved | High-risk; separate legal gate |
| **P6** | Scale & polish | Perf, anti-cheat maturity, ops, growth | Continuous |

---

# Phase 0 — Foundation (brand, legal, platform)

**Skills:** `using-superpowers` · `brainstorming` · `writing-plans` · `expo-design-system` · `web-design-guidelines` · `writing-skills` (optional)

**Exit:** Developer accounts ready; privacy/ToS live; brand cleared; architecture decided; compliance checklist owned.

### FE

- [x] Apply Kinn design tokens (Ink `#0D1014`, Lime `#C6F24E`, Sora + DM Sans)
- [x] Install logo pack (`kinn-logo-pack`) into app icon / splash / wordmark
- [x] Port splash from `kinn-splash-and-loader.html` (native Reanimated/SVG; reduce-motion path)
- [x] Port loaders: determinate bar, indeterminate bar, mini ring spinner + message strings
- [x] Wire Expo Router IA: Home · Friends · Move · Progress (+ settings)
- [x] Placeholder screens for Privacy Policy / Terms / Community Guidelines (WebView or in-app)
- [x] Permission copy library (Health, notifications, contacts, camera) — contextual, not on cold launch dump (Catalog covers all four; Health sheet consumes it. Other permission flows are still unwired.)

### BE

- [x] Choose stack (Node/TS + Postgres + Redis + S3-compatible private object storage; implementation and deployment notes added)
- [x] Auth foundation (email OTP, consent gate, refresh rotation, logout, and Apple sign-in extension point; requires provisioned DB/Redis/email delivery, Apple flow remains open)
- [x] User + session model; audit log for admin actions (schema/migration model added; migration not yet run against a provisioned database)
- [x] Config for environment secrets (validated production requirements; no secrets in app binary)
- [x] Encryption at rest plan for health-related fields; TLS everywhere (KMS envelope-encryption plan and encrypted health payload schema; runtime KMS integration remains open)
- [x] Account deletion job design (soft delete → purge) (idempotent job model/design; worker and endpoint remain open)

### Legal / business / store ops

- [ ] Trademark / domain / handle search for “Kinn”
- [ ] Form **legal entity** (needed later for gambling/regulated; good now for stores)
- [ ] Apple Developer Program (Organization preferred)
- [ ] Google Play Console (Organization preferred)
- [ ] Draft Privacy Policy + Terms + Community Guidelines (counsel review)
- [ ] Host policies on a stable HTTPS URL
- [ ] Legal memo: points stakes vs gift cards vs real money in Kenya (+ launch markets)
- [ ] Age policy: 18+ for competition stakes

### Store gate (P0)

- Privacy Policy URL exists  
- Developer accounts verified  
- No HealthKit/Health Connect in binary until purpose strings + policy ready  

---

# Phase 1 — MVP: Track & connect

**Skills:** `brainstorming` · `writing-plans` · `executing-plans` · `test-driven-development` · `expo-design-system` · `expo-ui` · `expo-data-fetching` · `vercel-react-native-skills` · `animate-expo` / `expo-animation` · `verification-before-completion` · `requesting-code-review`

**Exit:** User can create account, see daily metrics, start/log a workout with illustrations, add a friend, connect health data on iOS + Android. Internal testing builds on both stores.

### FE

- [ ] Onboarding: brand → Health connect (skippable) → add friend (skippable)
- [x] Home dashboard: steps, active minutes, distance, calories (plain language; sample values, not health-provider data)
- [ ] Move: exercise list with **required** illustration (`free-exercise-db` + category fallback)
- [ ] Workout-cool equipment icons on exercise cards
- [x] Rebrand existing live tracker to Kinn tokens
- [ ] Friends: add by username / QR; activity list (mock → API) (Username entry is local-only; QR and API-backed friend graph remain open.)
- [ ] Settings: privacy toggles; **Delete account**; export/request data entry point
- [ ] Accept ToS / Privacy before account creation completes
- [ ] iOS: HealthKit permission flow (purpose strings in `Info.plist` / Expo config)
- [ ] Android: Health Connect permission flow + rationale UI
- [ ] Crash/analytics SDKs that do **not** ingest HealthKit/Health Connect payloads for ads

### BE

- [x] Accounts API (signup/login by email OTP, refresh rotation, logout; code exists but requires live Postgres, Redis, and email-delivery services before operational acceptance)
- [ ] Profile + privacy settings
- [ ] Friends graph (request, accept, remove, block)
- [ ] Workout sessions CRUD; activity summaries
- [ ] Health sync ingestion endpoint (client-normalized metrics — minimize raw PHI)
- [ ] Consent records (what was granted, when)
- [ ] Account deletion endpoint + purge worker
- [ ] Admin stub: ban user, delete content
- [ ] Rate limiting, abuse detection basics

### Illustrations pipeline

- [ ] Bundle or CDN subset of free-exercise-db images (Kinn-tinted optional)
- [ ] Resolver: exercise id/name → image; fallback category art
- [ ] License attribution file in repo / about screen if required by Unlicense etiquette

### Store gate (P1)

| Item | Apple | Google |
| --- | --- | --- |
| Privacy Nutrition Labels / Data safety draft | ✓ | ✓ |
| HealthKit usage description + “works with Apple Health” | ✓ | — |
| Health Connect data-type declarations + Health apps form | — | ✓ |
| Account deletion in Settings | ✓ | ✓ |
| TestFlight / Internal testing track | ✓ | ✓ |
| Demo account for reviewers | ✓ | ✓ |

**Do not ship yet:** stories, money, premium paywall (unless IAP ready), public discovery feed.

---

# Phase 2 — Social (sticky UGC)

**Skills:** `brainstorming` · `writing-plans` · `subagent-driven-development` · `dispatching-parallel-agents` · `expo-ui` · `expo-data-fetching` · `test-driven-development` · `systematic-debugging` · `verification-before-completion`

**Exit:** Circles, reactions, disappearing stories; full UGC moderation tooling live; soft launch possible.

### FE

- [ ] Friend circles (gym / family / office) (Fixed demo filters exist; users cannot create or manage circles.)
- [ ] Reactions, short photo/video moments, voice notes (Reaction prototype only; no user content composer or media.)
- [ ] 24h stories UI + viewers (Static sample moments only; no persisted creation, viewer list, or expiry job.)
- [ ] Per-friend / per-circle visibility controls (Device-local preview; not enforced on social services.)
- [ ] **Report** content + user (clear labels) (Local report records only; no moderator receives them.)
- [ ] **Block** user (1:1 and feed) (Device-local filtering only; no server enforcement.)
- [ ] Community Guidelines acceptance before first UGC post
- [x] Empty states that encourage inviting friends (cold-start)

### BE

- [ ] Media upload (signed URLs), virus/type checks, size limits
- [ ] Story TTL job (24h delete)
- [ ] Moderation queue + admin actions (remove, warn, ban)
- [ ] Report workflow SLA (e.g. act within 24h)
- [ ] Block list enforcement on all social endpoints
- [ ] Push notifications for social events (opt-in categories)
- [ ] Content filters (blocklist / classifier — start simple)

### Store gate (P2)

| Item | Why |
| --- | --- |
| Apple 1.2 UGC controls complete | Rejection if missing report/block/filter/contact |
| Play UGC: ToS gate + report + block | Same |
| Reviewer notes: how to find report/block | Speeds review |
| Age rating questionnaire updated for UGC | Honesty required |
| No anonymous random chat | Avoids “Chatroulette” risk under 1.2 |

---

# Phase 3 — Compete (points only)

**Skills:** `writing-plans` · `executing-plans` · `test-driven-development` · `expo-data-fetching` · `vercel-react-native-skills` · `animate-expo` / `expo-animation` · `verification-before-completion` · `finishing-a-development-branch`

**Exit:** Duels, team challenges, handicaps, point pots; anti-cheat v1; public launch candidate **without** real money.

### FE

- [ ] Challenge templates (&lt;30s create)
- [ ] Head-to-head + group goals + leaderboards (friends only at first)
- [ ] Handicap scoring UX (plain language)
- [ ] Point stake UI (no cash language)
- [ ] Challenge live updates
- [ ] Fair-play / “flagged result” UI

### BE

- [ ] Challenges service + ledger for **points** (not cash)
- [ ] Scoring engine + handicap baselines
- [ ] Realtime updates (WebSocket/SSE)
- [ ] Anti-cheat: impossible speeds, duplicate syncs, manual edit flags
- [ ] Leaderboard integrity jobs
- [ ] Spending caps / cool-offs for points (habit for later money rules)

### Monetization (optional in P3)

- [ ] Premium subscription via **Apple IAP + Google Play Billing** (advanced stats, bigger groups)
- [ ] Restore purchases; subscription status webhook on BE
- [ ] No sideloaded unlock via M-Pesa for digital features

### Store gate (P3)

| Item | Why |
| --- | --- |
| Marketing copy: “points,” not gambling | Avoids 5.3 / Play gambling flags |
| Contest rules if you run sweepstakes | Apple 5.3.1–5.3.2 |
| IAP products configured if Premium ships | 3.1.1 |
| Screenshots show real competitive UI | 2.3.3 |

**Launch recommendation:** Soft launch Kenya campuses/gyms → fix retention → then open storefronts.

---

# Phase 4 — Music & watches

**Skills:** `brainstorming` · `writing-plans` · `vercel-react-native-skills` · `expo-data-fetching` · `systematic-debugging` · `requesting-code-review` · `verification-before-completion`

**Exit:** Spotify + Apple Music in workout; broader watch coverage via Health bridges first, direct APIs where available.

### FE

- [ ] Connect Apple Music / Spotify (SDK rules + subscription caveats in UI)
- [ ] Playlist start with workout; optional friend “listening” share
- [ ] Devices screen (reuse/rebrand pair-device flows)
- [ ] Graceful fallback when music app/subscription missing

### BE

- [ ] OAuth token storage for music providers (encrypted)
- [ ] Webhooks / refresh token rotation
- [ ] Activity ↔ music session metadata (no illegal caching of DRM audio)

### Watch / health

- [ ] Confirm Oraimo and budget brands via Health Connect only
- [ ] Direct APIs only where ToS + effort justified (Garmin, etc.)
- [ ] Never claim medical accuracy (Apple 1.4.1 risk)

### Store gate (P4)

- Declare new data types / partners in privacy policy + Data safety  
- Music SDK compliance (no violating developer agreements)  
- Update App Privacy / Data safety if new data leaves device  

---

# Phase 5 — Rewards (high risk)

**Skills:** `brainstorming` · `writing-plans` (legal gates first) · `test-driven-development` · `executing-plans` · `verification-before-completion` · `diagnosing-superpowers` (if process stalls)

**Exit criteria are legal + store, not just engineering.**

### Stage 5A — Partner rewards (non-cash)

- Gift cards / airtime / partner vouchers as challenge prizes  
- Classify carefully: physical/out-of-app goods may use non-IAP payments (Apple 3.1.3(e)); digital unlocks still IAP  
- Partner contracts; fraud controls; geo rules  

### Stage 5B — Real money stakes (only if approved)

**Do not build until:**

1. Written legal opinion for Kenya + each storefront country  
2. Gambling / gaming licenses if required  
3. App submitted by **organization** account (Apple 5.1.1(ix))  
4. Geo-fencing to licensed regions (Apple 5.3.4)  
5. App free if real-money gaming (Apple 5.3.4)  
6. **No IAP** to buy credits for real-money gaming (Apple 5.3.3)  
7. Play gambling policy + local law satisfied  
8. Age verification 18+, limits, cool-off, self-exclusion  
9. Licensed payment provider (e.g. M-Pesa PSP)  

### FE / BE (when unlocked)

- [ ] KYC / age verification  
- [ ] Wallet ledger with double-entry; reconciliation  
- [ ] Geo + license checks server-side  
- [ ] Responsible gaming UX  
- [ ] Enhanced anti-cheat (money on the line)  

### Store gate (P5)

Expect prolonged review. Prepare licenses, geo proof, reviewer demo, and support contacts in Review Notes.

---

# Phase 6 — Scale, trust, ops

**Skills:** `vercel-react-native-skills` · `systematic-debugging` · `web-design-guidelines` · `dispatching-parallel-agents` · `verification-before-completion` · `finishing-a-development-branch`

### FE

- [ ] Offline mode / low-data mode (Kenya-friendly)
- [ ] Accessibility (contrast, Dynamic Type, screen reader labels)
- [ ] Performance budgets (startup, list scroll, image cache)
- [ ] Localization (swahili later)

### BE

- [ ] Observability (metrics, tracing, error budgets)
- [ ] Backup / DR; incident runbooks  
- [ ] Anti-cheat v2; device attestation where useful  
- [ ] Abuse / spam ML or rules  
- [ ] Cost controls (media, push)  

### Store / growth

- [ ] ASO screenshots + preview videos (real UI only)  
- [ ] Phased rollout / staged releases  
- [ ] Crash-free rate targets before major promotion  
- [ ] Respond to review rejections with evidence, not workarounds that violate policy  

---

# Backend architecture (reference)

```
Mobile (Expo iOS/Android)
    │  HTTPS + auth tokens
    ▼
API gateway (REST/GraphQL)
    ├── Auth / users / privacy / deletion
    ├── Friends / circles / blocks / reports
    ├── Workouts / summaries / health sync
    ├── Challenges / points ledger / leaderboards
    ├── Media (S3-compatible) + story TTL
    ├── Notifications
    ├── Billing webhooks (Apple/Google)
    └── Admin moderation
         │
         ▼
Postgres │ Redis │ Object storage │ Queue workers
```

**Hard rules**

- Health data: minimize retention; purpose limitation; no ad pipelines  
- Blocks & reports enforced server-side  
- Ledger for points/rewards is append-only + auditable  
- Feature flags for gambling/rewards by country  

---

# Frontend architecture (reference)

- Expo SDK current; EAS Build + Submit for both stores  
- Design system: tokens from Brand Guide; UI primitives in `mobile/src/components/ui`  
- Feature modules: home, friends, move, progress, settings, challenges  
- Illustration resolver module (free-exercise-db + fallbacks)  
- Native modules via Expo config plugins: HealthKit, Health Connect, IAP, notifications, image picker  

---

# Store submission runbooks

**Skills:** `verification-before-completion` · `finishing-a-development-branch` · `requesting-code-review` · `systematic-debugging` (rejection fixes) · `receiving-code-review` (if reviewers/humans leave notes)

## First production submission (after P2 or P3)

1. **Apple**
   - App Store Connect record: name, subtitle, keywords, privacy URL, age rating  
   - Privacy Nutrition Labels accurate  
   - HealthKit entitlements + usage strings  
   - Screenshots on required device sizes (app in use)  
   - Review Notes: demo account, Health data instructions, where to find Delete / Report / Block  
   - Sign in with Apple if other social logins exist  

2. **Google**
   - Play Console: Data safety, Health apps form, Health Connect declarations  
   - Data deletion URL  
   - Content rating (IARC)  
   - Target API compliance  
   - Internal → closed → open testing before production  
   - Demo credentials in App access  

3. **Both**
   - No placeholder / “lorem” screens  
   - Crash-free on smoke devices  
   - Policies match actual behavior  

## Common rejection causes (Kinn-specific)

| Cause | Prevention |
| --- | --- |
| UGC without report/block | Ship in P2 before public social |
| Health data used for ads | Never connect health events to ad SDKs |
| Missing account deletion | Settings + BE purge from P1 |
| Premium via M-Pesa only | Use IAP/Play Billing for digital unlock |
| “Betting” copy with cash | Points-only until P5 legal gate |
| Inaccurate Data safety / Nutrition Labels | Audit before every release |
| Login wall with only Facebook/Google | Add Apple + phone/email |
| Medical claims | Fitness language only; no diagnose/treat |

---

# Suggested team sequencing (single squad)

| Week band | Focus |
| --- | --- |
| 1–2 | P0 brand + legal drafts + BE skeleton + design system |
| 3–6 | P1 MVP FE/BE + health connectors + illustrations |
| 7–9 | P2 social + moderation + TestFlight/Play internal |
| 10–13 | P3 compete points + IAP premium + soft launch |
| 14–16 | P4 music/watches polish |
| TBD | P5 only after counsel + licenses |

Adjust for headcount; do not skip UGC/privacy for speed.

---

# Definition of “fully finished”

Kinn is **fully developed** for v1.0 store release when:

1. P0–P3 complete (rewards money **not** required for v1)  
2. Both stores approve production builds  
3. Soft-launch metrics meet retention goals (friends in week 1, D7/D30)  
4. Privacy, deletion, UGC moderation proven in production  
5. P4–P5 tracked as post-v1 roadmap with legal gates  

---

# Document control

| Field | Value |
| --- | --- |
| Owner | Product + Eng |
| Related | `Kinn Product Plan and Brand Guide.md`, `AGENTS.md`, `.agents/skills/`, `skills-lock.json` |
| Research | Apple Guidelines + Google Play policies via agent-reach (Oct 2026) |
| Skills | All 23 project skills catalogued above; mapped per phase |
| Next update | Before first store submission — re-fetch official guidelines; sync skill list if `skills-lock.json` changes |

**Not legal advice.** Gambling, payments, and health-data compliance require qualified counsel in each launch market.
