# Experience Timeslots Matrix — Context

> The why and the what behind this prototype. Read this before opening a screen.

**Source of truth:** {link to the requirements doc / ticket / epic}
**Last synced:** YYYY-MM-DD by {your-name}
**Owner:** {your-name} ({your-email})
**Status:** in-progress  <!-- in-progress | approved -->


---

## Why this exists

2–3 sentences on the feature's purpose and what it's trying to solve. What does success look like?

## Who it's for

- **Primary persona:** see [`_context/personas/{persona-slug}.md`](../../../_context/personas/)
- Feature-specific persona notes (if any)

## Pillars this advances

Which of the Vintiga programme pillars does this feature serve? See [`_context/programme.md`](../../../_context/programme.md).

- [ ] Pillar 1 — {fill in}
- [ ] Pillar 2 — {fill in}
- [ ] Pillar 3 — {fill in}
- [ ] Pillar 4 — {fill in}

## Key user stories

Pull the actual stories from the requirements source. Story IDs link back to source.

- **{ID}** — As a {role} I want {what} so that {why}
- **{ID}** — …

## Requirements & constraints

- {Hard requirement}
- {Compliance / regulatory / brand constraint}
- {Other hard requirement}

## Open dependencies

Things blocking this work or in flight elsewhere — link to other prototypes, decisions, or PM threads.

- {Blocker / dependency} — owner: {who}, status: {open / unblocked / in flight}

## Sources

Where to look for more depth.

- **Requirements:** {link}
- **Cross-feature research:** [`_context/research/{file}.md`](../../../_context/research/), …
- **Competitive teardowns:** [`_context/competitive/{file}.md`](../../../_context/competitive/)
- **Decisions log:** {link if applicable}
- **Internal docs / Slack threads:** {description — link lives outside the repo}

---

## Deeper materials → `_context/` subfolder (optional)

This file is the entry point — a tight summary that someone can read in 2 minutes. If you have richer materials specific to this prototype (requirements exports, your own user interviews, sketches, screenshots, competitor refs, anything else), drop them in a `_context/` subfolder next to this file:

```
src/prototypes/{your-feature}/
├── CONTEXT.md       ← you are here (the entry point)
├── _context/        ← optional: your raw materials
│   ├── requirements.md        ← what you pulled from source
│   ├── stories/               ← story details
│   ├── research/              ← user interviews, surveys
│   ├── refs/                  ← screenshots, competitor refs
│   └── sketches/              ← early explorations
├── JOURNEY.md
├── NOTES.md
├── CHANGELOG.md
└── *.tsx
```

Organise it however makes sense for your feature — the convention is "context lives where the work lives." The shared root [`_context/`](../../../_context/) stays for genuinely cross-feature stuff (personas, programme pillars, brand essentials, research that applies to multiple prototypes).

If something in your `_context/` ends up being useful across prototypes, promote it to the root `_context/` in a PR.
