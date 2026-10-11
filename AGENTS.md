# Kinn — agent notes

## Skills (one folder only)

**Canonical path:** `.agents/skills/` (23 skills)

Do not create per-tool skill folders (`.claude/`, `.windsurf/`, `.trae/`, etc.). They were removed; `.gitignore` blocks them from coming back.

Restore / update:

```bash
npx skills experimental_install
npx skills update -p -y
```

When adding skills, prefer project scope **without** flooding every agent:

```bash
npx skills add <owner/repo> --agent amp -y --copy
# then ensure files live under .agents/skills/
```

Avoid `npx skills add ... --all` in this repo (it copies into 70+ directories).

Lockfile: `skills-lock.json`.  
Skill map by phase: [`docs/KINN-FULL-DEVELOPMENT-PHASES.md`](docs/KINN-FULL-DEVELOPMENT-PHASES.md).

## Illustration sources (`vendor/`, gitignored)

| Source | Use |
| --- | --- |
| `vendor/free-exercise-db/` | **Primary** per-exercise art (public domain). Recolor/restyle to Kinn Ink/Lime OK. |
| `vendor/workout-cool/public/images/equipment/` + muscle SVG UI | Equipment + muscle maps (MIT). |
| `vendor/openGym/catalogue/` | Exercise **text/JSON only**. Do **not** ship `catalogue/media` (Gym visual). |

Brand: `Kinn Product Plan and Brand Guide.md` + `kinn-logo-pack (1)/`.

Splash & loaders (source of truth): [`kinn-splash-and-loader.html`](kinn-splash-and-loader.html) — rings + Lime lens splash (~2.7s), progress/indeterminate bars, mini spinner. Rebuild in React Native; honor Reduce Motion.

## Full build plan

Phased FE/BE + App Store / Play acceptance plan: [`docs/KINN-FULL-DEVELOPMENT-PHASES.md`](docs/KINN-FULL-DEVELOPMENT-PHASES.md).
