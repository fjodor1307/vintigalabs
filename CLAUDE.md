# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Vintiga Prototype Builder

This is the clickable prototype app for Vintiga. **This repo is self-contained** — it works whether it lives inside the parent `Vintiga/` workspace or as a standalone clone anywhere. The bundled skill at `.claude/skills/vintiga-tov/` provides the tone-of-voice rules so brand voice survives wherever the repo travels.

**For new contributors:** start with [`README.md`](README.md) — it covers what this is, quick start, and how to build your first prototype.

**Read `CHANGELOG.md` first** when starting a new session. It has project status, open questions, and what to work on next.

---

## Commands

```bash
npm run dev          # start dev server (also runs generate-contributors first)
npm run build        # tsc type-check + vite build (also runs generate-contributors first)
npm run lint         # eslint
npm run preview      # preview the production build locally
npm run contributors # regenerate src/generated/contributors.json from git log
```

CI runs `npm run lint` then `npm run build` — both must pass before merging to `main`.

---

## Template status — fill these in before building prototypes

This repo started as a template. Before the first real prototype ships, somebody needs to fill in:

- **`_context/programme.md`** — north star, pillars, key numbers, segments. _Not written yet._
- **`_context/personas/`** — empty. Add one or more persona markdown files.
- **`_context/brand/essentials.md`** — colour palette, typography, voice principles. _Not written yet._
- **`_context/research/`** — empty. Add dated research findings as they come in.
- **`_context/competitive/`** — empty. Add competitor teardowns as they come in.
- **`src/design-system/tokens.css`** — currently a neutral greyscale placeholder. Replace primary / accent / fonts with Vintiga brand values.
- **`.claude/skills/vintiga-tov/SKILL.md`** — tone-of-voice rules (seeded 2026-05-11, refreshed from vintigalabs.com on 2026-07-06). Refresh when brand voice evolves.

## Project context — two layers

Project context lives in two places:

**1. Shared cross-feature context** at the repo root in [`_context/`](_context/) — see the list above.

**2. Per-prototype context** inside each prototype folder:
- **`src/prototypes/{feature}/CONTEXT.md`** — the entry point: summary, key user stories, requirements, source links. Read this before opening a screen.
- **`src/prototypes/{feature}/_context/`** — optional subfolder for that prototype's deeper materials: epic exports, user interviews, sketches, screenshots, competitor refs. No required structure.

The principle is "context lives where the work lives." Cross-feature stuff is at root; feature-specific stuff is in the prototype folder.

## Journey-First Prototyping

Every prototype starts from requirements, not screens. Follow this workflow:

### 0. Get Context
If the prototype folder doesn't have a `CONTEXT.md` yet, copy `_templates/CONTEXT.md` into the folder and fill it in. Source the epic and user stories from the relevant Vintiga requirements doc or tracker. Without `CONTEXT.md` you're guessing.

If you have richer materials for this prototype (epic exports, your own user interviews, sketches, refs), drop them in a `_context/` subfolder next to `CONTEXT.md`. CONTEXT.md is the summary; the subfolder is the depth.

### 1. Analyse
Read the prototype's `CONTEXT.md` and the relevant `_context/` files (persona, programme pillars, any research that applies). Understand what the user needs to accomplish and why.

### 2. Map
Create a `JOURNEY.md` in the prototype folder (`src/prototypes/{feature}/JOURNEY.md`). Use the template in `_templates/JOURNEY.md`. Map every step the user takes, link each step to a GitHub story ID, and assign a route.

### 3. Identify Gaps
Review the journey for missing steps, edge cases, error states, and decisions needed. Log them in the Gaps section of JOURNEY.md. Anything strange, unclear, or worth improving goes in the prototype's `NOTES.md` (template: `_templates/NOTES.md`) — keep prototypes clean, keep observations in markdown.

### 4. Build
Create prototype screens against the journey map. Always build branded — full Vintiga tokens, colours, typography. Use real copy, no placeholder text. Update JOURNEY.md status as screens are built.

### Rules
- **Always branded** — no wireframe mode. Design with Vintiga tokens from the start.
- **Read `CONTEXT.md` before building** — it tells you what the feature is for and what's required. If it's missing or stale, fix that first.
- **Use `NOTES.md`** to flag open questions, improvements, and unclear items. Promote to `OPEN-QUESTIONS.md` only when ready for formal PM / stakeholder review.
- **JOURNEY.md is the source of truth** for what's built vs what's missing. Keep it updated.
- **Story IDs link to screens** — every step in JOURNEY.md should reference a GitHub story and a prototype route (or `--` if not yet built).

---

## Handoff & Collaboration

Every prototype is self-documenting. Each folder has:
- `CONTEXT.md` — why the feature exists, key user stories, requirements, source links
- `JOURNEY.md` — mapped steps, story IDs, status
- `NOTES.md` — designer scratchpad (open questions, improvements, unclear items)
- `CHANGELOG.md` — what changed, when, by whom

**When you make changes to a prototype**, add a new entry at the top of that prototype's `CHANGELOG.md`. For repo-wide changes (design system, tooling, conventions), use the top-level `CHANGELOG.md`.

**When starting a new prototype**, copy all four templates into the new folder (`_templates/CONTEXT.md`, `_templates/JOURNEY.md`, `_templates/NOTES.md`, `_templates/CHANGELOG.md`) and add a row to the per-prototype changelog index in the top-level `CHANGELOG.md`.

**Status field in `CONTEXT.md`** — the metadata block at the top of every `CONTEXT.md` includes `**Status:** in-progress | approved`. This shows up as a badge on the prototype index card and powers the status filter on the home page. Default is `in-progress`. Bump it to `approved` only once the prototype has been signed off by the relevant stakeholder. The value is picked up by `scripts/generate-contributors.mjs` at build/dev time — no other registration needed.

## Branching & PRs

This is a shared repo — never work directly on `main`. See `CONTRIBUTING.md` for the full rules, short version:

- Create a branch before touching anything: `feat/{feature}-{name}` · `fix/{what}` · `ds/{what}`
- Prototype-only changes can fast-merge. Shared changes (`@ds/`, root docs, `_templates/`) need a PR.
- CI runs lint + build on every PR — don't merge red.
- Every PR updates the relevant `CHANGELOG.md` (prototype-level for prototype work, root for shared).

---

## Design Rules — Follow These When Creating New Prototypes

This project uses a **mobile-first** approach with **Base UI (@base-ui/react)** + **Vintiga tokens**. Import shared code from `@ds/` (alias for `src/design-system/`). Prototypes live in `src/prototypes/`. See `src/design-system/DESIGN-RULES.md` for the full reference.

### Design System is the source of truth — use it everywhere

When you build a new component or update an existing one in `src/design-system/`, **also propagate the change across every prototype that should use it.**

Workflow:
1. Build / update the component in `src/design-system/shared/<Name>.tsx`
2. Add / refresh the showcase in `src/design-system/style-guide/ComponentsSection.tsx`
3. **Grep for inline implementations of the same pattern across `src/prototypes/`** and replace them with the new component. Common offenders: buttons, checkboxes, segmented controls, tags, search inputs.
4. Verify in the preview that prototypes still render correctly.

If a prototype needs a one-off variant the DS doesn't cover, **extend the DS component (new prop, new variant)** rather than re-implementing the pattern locally. The only acceptable inline UI is when the pattern is genuinely unique to a single prototype and unlikely to recur.

### Project Structure
- Design system: `src/design-system/` (tokens, components, icons, shared)
- Prototypes: `src/prototypes/{flow-name}/` — import from `@ds/`, never from other prototypes
- Icons: Lucide-based, in `@ds/icons/Icons.tsx`
- Path aliases: `@ds/` → `src/design-system/`, `@/` → `src/`

### Shared Components (`@ds/`)
- **Layout:** `Sidebar`, `Navbar`, `PhoneFrame`
- **Mobile:** `StatusBar`, `ScreenHeader`
- **Content:** `CustomerHeader`, `PersonCard`, `Contributors`, `AlertBanner`, `EmptyState`, `ErrorState`, `GlobalSearch`, `Skeleton`
- **Charts:** `recharts` is available for data visualisation

### Layout Templates
- **Web dashboard**: Sidebar + Navbar + scrollable content (`px-vintiga-lg pb-vintiga-lg`)
- **Web two-panel**: Left `w-[480px] shrink-0` + Right `flex-1 rounded-[32px]`, outer padding `px-vintiga-3xl`
- **Mobile**: StatusBar → ScreenHeader → scrollable content (`px-vintiga-lg pb-vintiga-lg`) → fixed bottom CTA

### Spacing
- Only use vintiga scale: xs (4px), sm (8px), md (16px), lg (24px), xl (32px), 2xl (48px), 3xl (64px)
- Page content: `px-vintiga-lg pb-vintiga-lg` | Section gaps: `gap-vintiga-xl` | Card gaps: `gap-vintiga-md`
- Card padding: `p-vintiga-lg` (standard) or `p-vintiga-md` (compact)

### Typography
- Titles: `typo-display font-light` or `typo-title-screen font-light`
- Sections: `typo-title-section font-semibold`
- Body: `typo-body` / `typo-body-sm` | Buttons: `typo-body-sm font-semibold`
- Labels: `typo-caption font-semibold` | Muted: `text-vintiga-foreground-muted`

### Components
- Buttons: `rounded-vintiga-button` (pill), `bg-vintiga-primary text-vintiga-primary-foreground`
- Inputs: `bg-vintiga-surface-element rounded-vintiga-input border border-transparent focus:border-vintiga-primary`
- Cards: `border border-vintiga-border rounded-vintiga-card`
- Icon circles: `w-10 h-10 rounded-full bg-vintiga-surface-element`

### Colors
- Never hardcode hex — use semantic tokens only
- Backgrounds: `bg-vintiga-surface` / `bg-vintiga-surface-element` / `bg-vintiga-surface-secondary`
- Borders: always `border-vintiga-border`
- Flat design: no shadows by default, only for elevation (modals, dropdowns)

### Animations
- Entrance: `animate-[fadeUp_0.5s_ease-out]`, stagger by 0.1s increments
- Hover/active: `transition-colors` only, no animation
- Mobile sidebar: `animate-slide-in-left`

### Responsive
- Sidebar hidden below `md` (768px), mobile overlay on toggle
- Mobile screens: always single-column
- Two-panel layouts: stay side-by-side at md+
