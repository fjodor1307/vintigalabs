---
name: vintiga-tov
description: Vintiga tone-of-voice rules for UI copy. Trigger when writing button labels, error messages, empty states, screen titles, notifications, microcopy, or any user-facing text inside this repo — especially in `src/prototypes/**` and `src/design-system/**`. Skip for: code comments, commit messages, README/CONTRIBUTING/CHANGELOG docs, and internal notes.
---

# Vintiga tone of voice

**Placeholder.** Fill this in once the Vintiga brand voice has been defined. Until then, write UI copy that is:

- **Clear** — plain language, active voice, no jargon.
- **Concise** — shortest phrasing that is still polite.
- **Warm** — human, not corporate. Acknowledge the user, don't lecture them.
- **Consistent** — use the same words for the same things across flows.

## Word swaps to make it concrete later

Create a `references/word-swaps.md` table once the brand voice is approved. Example shape:

| Avoid | Use instead |
|-------|-------------|
| "Please ensure you…" | "Make sure…" |
| "An error occurred." | "Something went wrong — try again." |
| "Submit" | "Continue" or a verb matching what comes next |

## What this skill should eventually do

1. Scan the string the user is about to write.
2. Flag words/phrases on the avoid list and suggest the replacement.
3. Enforce capitalisation rules (sentence case for buttons, title case never, etc.).
4. Keep copy under the length budget for the component it's going into (button labels ≤ 3 words, alert titles ≤ 6 words, etc.).

Until the brand voice is set, this skill will only enforce the four principles above.
