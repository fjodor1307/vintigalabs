---
name: new-prototype
description: |
  Use this skill whenever a designer wants to start a brand-new prototype in the Vintiga NextGen repo. Trigger on phrases like "create a prototype", "start a new prototype", "new feature", "make a new flow", "I want to build a prototype for X", "let's prototype X", or "scaffold a prototype". This skill handles the entire morning setup — pulling latest main, installing deps, scaffolding the folder with templates, claiming ownership, creating a branch, and starting the dev server — so the designer can jump straight to designing.
---

# New Prototype — Scaffold from zero to designing

A designer said they want to start a new prototype. Walk them through it without making them think about git or the CLI. Designers are not developers — translate every step into plain language and only surface what they need to decide.

## What you're doing

End state: the designer has a fresh prototype folder, a branch, ownership claimed, the dev server running, and the browser open on their starter screen. Zero mental overhead on their end.

## Questions to ask (in this order, one at a time)

1. **What's the feature called?** → this becomes the slug. Suggest lowercase-with-hyphens (e.g. "card-activation", "lending-origination"). Show 2–3 options if their idea is ambiguous.
2. **What's your name / GitHub handle?** → needed for the branch suffix and CODEOWNERS. If you already know (from prior turns or `gh auth status`), skip the question.
3. **Paste the context** → after scaffolding, before opening the dev server, ask the designer:
   > *"Paste your epic summary or user stories here. A few paragraphs is fine — whatever you've already read from Vintiga GitHub, or your own summary. I'll turn it into CONTEXT.md and we'll build from that."*

   They paste raw text. You turn it into a properly structured CONTEXT.md (see step 4 below). If they say "I don't have it yet" or "skip", flag that it'll be the first thing they need to fill in, and proceed with an empty template — but don't let them forget.

## Steps you run (silently — no commentary per step)

Only narrate major phases ("Setting you up…", "Scaffolding…", "Opening your prototype…"). Run each step, check for errors, continue.

1. **Pull latest main**
   ```bash
   git checkout main && git pull
   ```
   If there are local uncommitted changes, stop and ask the designer whether to stash or commit them first.

2. **Install any new deps**
   ```bash
   npm install
   ```

3. **Scaffold the prototype**
   ```bash
   npm run new-prototype <slug>
   ```
   If the slug already exists, suggest appending the designer's name (e.g. `card-activation-fedja`).

4. **Claim ownership in CODEOWNERS**
   Edit `.github/CODEOWNERS` — append a line:
   ```
   /src/prototypes/<slug>/    @<github-handle>
   ```

5. **Create and switch to the branch**
   ```bash
   git checkout -b feat/<slug>-<name>
   git add .github/CODEOWNERS
   git commit -m "Scaffold <slug> prototype"
   ```

6. **Gather context from the designer (paste flow)**
   This is the most important step. Before opening the dev server, ask the designer to paste their epic summary / user stories (see question 3 above). Then:

   a. Read the raw text they pasted.
   b. Structure it into `src/prototypes/<slug>/CONTEXT.md`, replacing the template. Map their paste into the template's sections:
      - **Why this exists** — the problem / goal in 2–3 sentences (from their summary)
      - **Who it's for** — persona notes if they mention one; otherwise leave the template placeholder
      - **Key user stories** — bulletise what they pasted; preserve any story IDs verbatim
      - **Requirements & constraints** — anything they flagged as a hard rule, compliance, target time, etc.
      - **Sources** — paste the raw text itself at the bottom under a `## Raw paste` heading so nothing is lost. Designers often include nuance that doesn't map cleanly; keep it.
   c. Fill in the metadata block at the top — `Owner`, `Last synced` (today's date), and a reasonable `Source of truth` link if they gave an epic ID.
   d. Show the designer a short summary — 3–5 bullets of what you extracted — and ask: *"Look right, or want to tweak anything?"* If they're happy, commit it: `git add src/prototypes/<slug>/CONTEXT.md && git commit -m "Add context for <slug>"`.

   If they said "skip" in step 3, leave the template in place but add a `> ⚠️ CONTEXT.md is empty — fill this in before building screens.` banner at the top of the file.

7. **Start the dev server**
   Use the `preview_start` MCP tool if available (see `.claude/launch.json`). Otherwise `npm run dev` in the background.

8. **Open the browser on the starter screen**
   The starter WelcomeScreen lives at `#/web/<slug>/welcome`.

## When you're done

Tell the designer, in one short message:

- "You're on `feat/<slug>-<name>`. Your starter screen is open."
- Confirm context status: *"CONTEXT.md is filled in — we'll build from it."* OR *"CONTEXT.md is still empty — fill it before we build more than the first screen."* depending on step 6.
- Point them to their folder: `src/prototypes/<slug>/`
- Tell them to say **"I'm done, publish this"** or **"ship this prototype"** when they want to merge.

## Tone

- Plain English, no git jargon.
- If something goes wrong (merge conflict, uncommitted changes, branch already exists), explain in one sentence what happened and give one clear next step.
- Never tell them to "run a git command" — run it yourself.
- Short responses. The designer wants to design, not read paragraphs about git.

## Edge cases

- **Slug already exists:** suggest appending their name. If that exists too, suggest a number suffix.
- **Uncommitted changes on main:** ask if you should stash them or commit them first. Never silently overwrite.
- **No GitHub handle configured:** ask once, remember for the session.
- **CODEOWNERS has a merge conflict:** they're probably picking up mid-conversation or the team pushed. Pull, resolve, retry.
- **Dev server already running:** reuse it; don't start a second one.
