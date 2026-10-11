# Phase 0-2 Completion Implementation Plan

> **For agentic workers:** Use `executing-plans` inline; test each behavioral change first and update the root `task_plan.md`, `findings.md`, and `progress.md` as work completes.

**Goal:** Complete repository-owned product and service work for Phases 0-2, then close the external gates only with owner-provided legal, platform, provider, and store evidence.

**Architecture:** Preserve the Expo mobile client and the existing Node/TypeScript tooling. Add a separately configured service boundary backed by PostgreSQL, Redis, and object storage; use shared validation/contracts, authenticated requests, and server-side authorization for health and social data. Keep the client offline-tolerant and never treat local prototype state as production enforcement.

**Tech Stack:** Expo SDK 57 / React Native, existing Express + TypeScript root toolchain, PostgreSQL, Redis, object storage, Expo-compatible native health integrations.

**Spec:** `docs/KINN-FULL-DEVELOPMENT-PHASES.md`

## Global Constraints
- The root and mobile apps are distinct packages; validate each with its own scripts.
- Expo APIs must match SDK 57 documentation.
- Secrets are server-side only; health data is excluded from advertising/analytics.
- OpenGym `catalogue/media` is not allowed in the shipped app.
- No Phase 2 UGC release until report, block, filtering, moderator contact, and timely action work end to end.
- External credentials, legal approvals, organizations, and store submissions require the owner; do not simulate their completion.

## Review Focus
- A user without network access can still read bundled movement illustrations and workout instructions.
- Unknown or misspelled movement identifiers render a truthful fallback instead of a broken image or wrong movement photo.
- A blocked or reported user cannot reappear through another feed/story endpoint.
- An upload with an unsupported type, forged content type, or oversized body is rejected before storage.
- Persisted consent, privacy choices, and deletion state survive app restart and server retries without leaking health data.

---

### Workstream 1: P0 Foundation

- [ ] Implement and test a central permission-copy catalog for Health, notifications, contacts, and camera; each rationale must be contextual and dismissible.
- [ ] Record backend architecture/security decisions and a deployment configuration contract.
- [ ] Create service health endpoint, environment-schema validation, database migrations, audit-event model, and TLS deployment guidance.
- [ ] Add authenticated account/session foundation and user/profile/privacy models.
- [ ] Implement account deletion request and purge-job design with idempotency and audit behavior.
- [ ] Keep counsel, entity, trademark, hosted policy URLs, developer accounts, and store evidence explicitly open pending owner action.

### Workstream 2: P1 Track and Connect

- [ ] Test movement-art resolution for every routine exercise; bundle only verified Free Exercise DB assets and a category fallback.
- [ ] Render movement illustrations on routine cards, exercise previews, and the active tracker movement card.
- [ ] Complete onboarding: brand, skippable health connection, skippable add-friend step, and policy consent before account completion.
- [ ] Implement and test friends, workout CRUD, profile/privacy, consent, health-sync, export, and deletion APIs.
- [ ] Add real HealthKit and Health Connect adapters with user-facing rationale and denied/unavailable states.
- [ ] Connect app UI to services with loading/error/empty/offline/retry states; remove mock-only language from any production path.

### Workstream 3: P2 Social Safety

- [ ] Implement user-managed circles and friend-only activity feed with reactions.
- [ ] Add short media/voice-note composition, signed uploads, type/size validation, and moderation state.
- [ ] Add story creation, viewer records, and server expiry/deletion after 24 hours.
- [ ] Persist and enforce per-friend/per-circle visibility on every social read/write path.
- [ ] Implement report content/user flows, moderator queue, remove/warn/ban actions, and auditable 24-hour response SLA.
- [ ] Implement server-enforced blocking across friend, story, feed, and notification endpoints.
- [ ] Add opt-in notification categories and server-side content filters.
- [ ] Require accepted Community Guidelines before first UGC post; provide clear report/block/contact discovery.

### Workstream 4: Verification and Exit

- [ ] Run unit/integration tests for authorization, report/block enforcement, expiry, upload rejection, and deletion retries.
- [ ] Run root TypeScript/build, mobile lint/typecheck/tests, Expo doctor, and available iOS/Android builds.
- [ ] Verify on-device HealthKit/Health Connect and store metadata with owner-provided accounts.
- [ ] Reconcile every Phase 0/1/2 roadmap item with test, build, legal, or account evidence; leave blocked items unchecked.

## Required Owner Evidence

- Company/legal entity and Kinn trademark/domain/handle clearance.
- Counsel-reviewed policies and legal memo; stable HTTPS policy URL.
- Apple/Google developer organization accounts and health declarations.
- OTP/email, push, database, Redis, object-storage, virus-scanning, and production-host credentials/configuration.
- Device access and internal distribution credentials/build approval.

## Execution Note

The request authorizes implementation of repository-owned work. It does not grant authority to create legal entities, accept legal terms, submit store artifacts, invent credentials, or claim external reviews passed. Stop only at a concrete external gate, record its exact owner action, and continue with independent repository tasks.