# Vintiga Prototypes

Clickable prototype workspace for Vintiga. Branded, mobile-first, code-before-Figma.

This repo started as a template forked from the Metro Bank prototype workspace. The tooling, scaffolding scripts, and Claude workflows are reused as-is; everything brand-specific (colours, fonts, content) has been stripped back to placeholders for the Vintiga team to fill in.

---

## Setup (one time)

```bash
npm install
npm run dev
```

Open the URL it prints. Every prototype in `src/prototypes/` is listed on the landing page — search, filter by tag, or click through to a flow.

---

## Before you build — fill in the template

Open questions that need answering before the first prototype ships:

- **`_context/programme.md`** — north star, pillars, numbers. _Not written yet._
- **`_context/personas/`** — target users. _Empty — add one or more persona files._
- **`_context/brand/essentials.md`** — colours, typography, voice principles. _Not written yet._
- **`src/design-system/tokens.css`** — currently a neutral greyscale placeholder. Replace primary / accent / fonts with the Vintiga brand values when they land.
- **`.claude/skills/vintiga-tov/SKILL.md`** — tone-of-voice skill stub. Expand once brand voice is defined.

Until these are filled in, prototypes will work visually but won't carry brand identity.

---

## Working with Claude

Run `claude` in the repo root and talk to it in plain English. Three skills cover the workflow:

| Say something like… | What happens |
|---|---|
| *"Start a new prototype for X"* · *"Scaffold a Y flow"* | Scaffolds a prototype folder with `CONTEXT.md`, `JOURNEY.md`, `NOTES.md`, a starter screen, and a `prototype.config.ts` that the router auto-discovers |
| *"Clone X so I can try my own take"* | Duplicates another prototype into a new slug you own |
| *"I'm done, publish this"* · *"Ship it"* | Runs checks, commits, pushes, opens a PR, watches CI, merges when green |

You don't need to know `git`, `gh`, branch names, or PR etiquette. Just say what you want.

---

## Commands

```bash
npm run dev          # start dev server
npm run build        # tsc type-check + vite build
npm run lint         # eslint
npm run new-prototype <slug>   # scaffold a new prototype folder
npm run contributors           # regenerate contributors.json from git log
```

---

## Design rules

Tokens, spacing, typography, layout templates → **[`src/design-system/DESIGN-RULES.md`](src/design-system/DESIGN-RULES.md)**.

Always branded. No wireframes. Real copy, no lorem ipsum. Mobile-first, responsive to desktop.

Visit `#/web/design-system` in the running app for a living reference of tokens and components.

---

## Tech stack

React 19 · Vite · TypeScript · Tailwind 4 · Base UI · Lucide icons · system fonts (swap in brand typeface via `tokens.css`).
