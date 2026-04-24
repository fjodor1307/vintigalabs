# Project context

Everything in this folder is shared context for any prototype in the repo. Read this first if you're new to the project.

> **Template state.** This folder is currently empty. Populate it with Vintiga programme docs, personas, brand essentials, research, and competitive teardowns as they're written.

## What goes here

Create these as you have content to put in them:

| File / folder | Purpose |
|---|---|
| `programme.md` | Strategic picture: north star, pillars, key numbers, customer segments |
| `personas/` | One markdown file per target user |
| `brand/essentials.md` | Quick brand cheatsheet — colours, typography, voice principles. Deeper tone-of-voice rules live in `.claude/skills/vintiga-tov/` |
| `research/` | Dated research findings (n-counts, what users said) |
| `competitive/` | Competitor teardowns |

## Where does X go? — root vs prototype folder

When you have a new piece of context (research finding, persona note, competitor screenshot, requirements doc…) and you're unsure where it lives, use this rule:

- **2+ prototypes will use it** → goes in this root `_context/` folder
- **Only one prototype will use it** → goes in that prototype's own `src/prototypes/{feature}/_context/` subfolder
- **In doubt** → start in the prototype folder. If it spreads to a second prototype, promote it up to root in a PR.

## Per-prototype context

This folder is for stuff that applies across prototypes. Each individual prototype also has its own context, structured in two layers:

- **`src/prototypes/{feature}/CONTEXT.md`** — the entry point: summary, key user stories, requirements, source links. Always read this first when you pick up a prototype.
- **`src/prototypes/{feature}/_context/`** — optional subfolder for deeper materials (requirements exports, designer's own user interviews, sketches, screenshots, competitor refs).

The convention is "context lives where the work lives."
