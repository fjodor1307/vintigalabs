---
name: clone-prototype
description: |
  Use this skill when a designer wants to iterate on a prototype that someone else owns in the Vintiga NextGen repo. Trigger on phrases like "I want to try my own version of X", "make my version of Fedja's flow", "clone X so I can change it", "alternative take on X", "another iteration of X", or "let me try a different approach to X". This skill clones an existing prototype into a new slug owned by the current designer — they get their own copy to modify freely without touching the original owner's folder.
---

# Clone Prototype — Own your iteration

A designer wants to try a different take on someone else's prototype. Instead of editing the original (which the owner has claimed), clone it into a new folder the designer owns.

## What you're doing

End state: the designer has a duplicate of the source prototype under a new slug, ownership claimed, branch created, dev server running on their copy. Both the original and the clone appear on the home page side-by-side so they can be compared.

## Questions to ask (one at a time)

1. **Which prototype do you want to clone?** → list the existing ones from `src/prototypes/` so they can pick. If they already mentioned one ("Fedja's onboarding"), confirm it matches a real folder.
2. **What's your name / GitHub handle?** → needed for the new slug and CODEOWNERS. Skip if already known.

The new slug is auto-generated: `<source-slug>-<designer-name>` (e.g. `invited-director-fedja`). Show it and let them override if they want something different.

## Steps you run (silently, narrating phases only)

1. **Pull latest main**
   ```bash
   git checkout main && git pull
   ```

2. **Install any new deps**
   ```bash
   npm install
   ```

3. **Clone the prototype**
   ```bash
   npm run clone-prototype -- <source-slug> <new-slug>
   ```

4. **Claim ownership in CODEOWNERS**
   Append to `.github/CODEOWNERS`:
   ```
   /src/prototypes/<new-slug>/    @<github-handle>
   ```

5. **Create and switch to the branch**
   ```bash
   git checkout -b feat/<new-slug>
   git add .github/CODEOWNERS
   git commit -m "Clone <source-slug> → <new-slug>"
   ```

6. **Start the dev server + open on the clone's first screen**

## When you're done

Tell the designer:
- "You have your own copy at `src/prototypes/<new-slug>/`."
- "Both versions show on the home page — click 'Review →' on each to compare."
- "Update CONTEXT.md to explain what you're trying differently, then start changing screens."
- "Say 'publish this' when you're ready to merge."

## Tone

- Plain English.
- One-sentence explanation of what "cloning" means if they ask ("Makes a fresh copy you own, leaves the original alone").
- Short responses.

## Edge cases

- **Source prototype doesn't exist:** show the list of actual folders and ask which one.
- **Target slug already exists:** suggest `<source>-<name>-2` or ask for a custom slug.
- **Uncommitted changes on main:** ask whether to stash or commit before cloning.
- **They're already on a branch:** ask if they want to stash their in-progress work first.
