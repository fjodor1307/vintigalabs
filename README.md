# Vintiga Prototypes

Clickable prototype workspace for Vintiga. Branded, mobile-first, code-before-Figma.

This repo started as a template. The tooling, scaffolding scripts, and Claude workflows are reused as-is; everything brand-specific (colours, fonts, content) has been stripped back to placeholders for the Vintiga team to fill in.

---

## What you need

| Tool | Why | Where to get it |
|---|---|---|
| **Node 20+** | Build + dev server | [nodejs.org](https://nodejs.org) (or `nvm`, `fnm`, `mise` — whatever you're used to) |
| **Claude Code** | The whole prototyping workflow is built around it. You talk to Claude in plain English; the skills below do the rest. | [claude.com/claude-code](https://claude.com/claude-code) |
| **Figma desktop app** | Needed if you want Claude to read frames from Figma (design-to-code). Enable **Dev Mode → MCP** inside Figma after installing. | [figma.com/downloads](https://www.figma.com/downloads/) |

## Setup (one time)

```bash
npm install
npm run dev
```

Open the URL it prints. Every prototype in `src/prototypes/` is listed on the landing page — search, filter by tag, or click through to a flow.

---

## Tools wired into the prototype

These ship with the repo — no extra install on your part, but worth knowing they exist.

### Agentation — in-page feedback overlay

[Agentation](https://www.agentation.com/) is mounted in dev mode at the bottom-right of every prototype. Click any element on the page, leave a comment, and it captures the component tree + source location so Claude can act on the feedback directly.

Already wired in [src/App.tsx](src/App.tsx) behind `import.meta.env.DEV` — it shows up automatically when you run `npm run dev`, never in the production build. No config needed; if you want it gone temporarily, comment out the `<Agentation />` lines in App.tsx.

---

## Claude Code skills + MCP servers

### Bundled skills (live in this repo)

The `.claude/skills/` folder contains skills that travel with the repo, so any teammate cloning it gets the same prototyping workflow:

- **`vintiga-tov`** — tone-of-voice rules for UI copy. Triggers automatically when Claude writes button labels, microcopy, error messages, etc.
- **`new-prototype`** — *"start a new prototype for X"* scaffolds a folder with templates, claims ownership, branches, starts the dev server.
- **`clone-prototype`** — *"I want my own version of Fedja's clubs flow"* duplicates someone else's prototype into a new slug owned by you.
- **`publish-prototype`** — *"ship it"* runs lint + build, commits, pushes, opens a PR, watches CI, auto-merges when green.

### Recommended user-level Claude skills

Install once on your machine and they apply everywhere — not just this repo:

- **Caveman** — minimal, transparent Claude wrapper. Strips system noise so you can see what Claude is actually doing. Useful when debugging skill behaviour or writing your own. _Ask Fedja for the link if you can't find it._
- **Figma MCP server** — lets Claude read Figma frames (design context, screenshots, variables). Configure inside Claude Code, then **open the Figma desktop app and enable Dev Mode → MCP** for the file you're working on. Without this, Claude can't see the design — you'll have to paste screenshots.

For Figma MCP setup specifics, see Figma's docs at [help.figma.com](https://help.figma.com/hc/en-us/articles/32132100833559).

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
