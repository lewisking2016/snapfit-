# Phase 0-2 Completion Plan

## Goal
Complete every repository-implementable Phase 0, Phase 1, and Phase 2 requirement in `docs/KINN-FULL-DEVELOPMENT-PHASES.md`, validate it, and keep all external/legal/store gates open until evidence is supplied.

## Status
- [x] Baseline the current roadmap and repo
- [x] Separate repository work from external gates
- [ ] Phase 0: finish app foundation and backend/security skeleton
- [ ] Phase 1: finish track/connect client and APIs
- [ ] Phase 2: finish social client, moderation APIs, and jobs
- [ ] Run verification and reconcile every roadmap checkbox
- [ ] Close external gates with owner-provided evidence

## Ordered Work
1. **P0 application foundation:** contextual permission-copy library is complete; verify policy/consent flows; maintain Kinn design and routing.
2. **P0 backend/security:** in progress; Node/TypeScript tooling is present, but Docker/PostgreSQL/Redis are unavailable. Scaffold the recommended Node/TypeScript + PostgreSQL + Redis + object storage stack with environment validation, TLS deployment settings, audit model, health-data encryption plan, and account-deletion design; test behavior without claiming live persistence.
3. **P1 track/connect:** implement the bundled exercise illustration resolver and use it for all routine movements, preview rows, and live tracking; complete onboarding friend step, persisted privacy controls, export/delete UI, and service contracts.
4. **P1 services/native integrations:** account/session, profile/privacy, friends, workout, normalized health-sync, consent, deletion, moderation-admin, throttling; the owner chose Android API 26+ for Health Connect. Native health code requires dev-client builds; do not claim store readiness while legal declarations remain open.
5. **P2 social:** real circles, activity posts/reactions, media/story lifecycle, per-friend visibility, report/block, moderation queue/actions/SLA, content filtering, and opt-in notifications. Enforce all safety rules server-side.
6. **Verification and roadmap:** tests per service and screen, mobile lint/typecheck, root lint/build, Expo doctor, platform build checks where available; update every P0-P2 checkbox with evidence and list unresolved external gates.

## External Gates That Cannot Be Fabricated
- Trademark/domain/handle clearance, legal entity, Apple Developer and Google Play organization accounts.
- Counsel review and approval of privacy policy, terms, community guidelines, and Kenya/launch-market legal memo.
- Stable HTTPS policy hosting and store console submissions/forms.
- Provider credentials, production database/object storage, email/SMS delivery, push credentials, and signed store builds.
- Device/OS permission validation and reviewer demo accounts.

## Constraints
- Keep user changes and existing untracked app assets; no destructive cleanup or commits.
- Expo SDK 57 APIs must follow versioned SDK 57 docs.
- Free Exercise DB is the primary art source; do not ship OpenGym `catalogue/media`.
- Never put secrets in the app bundle or expose raw health data to analytics/ads.
- Phase 2 user-generated content is not production-ready until server moderation, report/block enforcement, filtering, and contact paths work.

## Next Step
Inspect existing server route conventions, then implement P0 backend configuration and a health endpoint with a dependency-free RED/GREEN test.