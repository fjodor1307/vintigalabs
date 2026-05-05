---
name: publish-prototype
description: |
  Use this skill whenever a designer is done with their prototype work and wants to publish / merge / ship it in the Vintiga NextGen repo. Trigger on phrases like "I'm done", "ready to merge", "publish this", "push my changes", "ship it", "merge this", "it's ready", or "wrap this up". This skill handles the entire publish flow — lint + build, smart commit, push, open PR, watch CI, auto-merge when green. The designer never thinks about git or GitHub.
---

# Publish Prototype — From local changes to merged on main

A designer said their prototype is ready. Take it from their working directory all the way to merged on `main` without making them think about git, CI, or PRs.

## What you're doing

End state: the designer's changes are on `main`, the GitHub Pages site has been redeployed, and they have a shareable link to show stakeholders.

## Before you start — sanity-check what's going to be published

1. Run `git status` — are there uncommitted changes? (There almost always are.)
2. Run `git diff --stat` — summarise what changed in one sentence for the designer: "Looks like you changed 4 screens and added 2 new ones — is that right?"
3. If they've been editing outside their own prototype folder (shared components, root docs), flag it: "This PR will also change [file]. That's shared code — are you sure?"
4. **Context check (soft gate).** Look at the prototype's `CONTEXT.md` — the one(s) inside any prototype folder that appears in `git diff --stat`. If it still contains template markers like `{Feature}`, `{ID}`, `{your-name}`, or `YYYY-MM-DD`, it's been left unfilled. Nudge the designer:
   > *"Heads up — CONTEXT.md for `<slug>` is still the unfilled template. Want to paste a summary of the epic/stories now so the prototype has real context, or ship without it?"*
   Accept either answer — if they paste context, update CONTEXT.md before committing (same structure as step 6 of `new-prototype`). If they say ship anyway, proceed. Don't block.

## Quality gates (run silently, fix or stop on failure)

```bash
npm run lint    # fix obvious issues yourself if they're trivial
npm run build   # must pass — fail loudly if it doesn't
```

If lint/build fails, tell the designer in plain language what's broken and offer to fix it. Don't push broken code.

## Commit

```bash
git add .
git commit -m "<smart message>"
```

Write the commit message from what actually changed, not a template. Examples:
- "Add card activation happy path (5 screens)"
- "Polish onboarding — tighter headings, warmer empty states"
- "Fix plan-picker alignment on small screens"

First line under 70 chars. No "update" or "changes" — be specific.

## Push + open PR

```bash
git push -u origin <branch>
gh pr create --title "<same as commit>" --body "<see below>"
```

PR body template:
```markdown
## Summary

<one-paragraph plain-language description of what changed and why>

## Test plan

- [ ] Open the prototype, walk the flow
- [ ] Check any edge cases mentioned in NOTES.md
```

> **Don't add a "Review" / live-URL section unless you actually know the deploy URL for this repo.** Check `wrangler.*`, `.github/workflows/*.yml`, or the most recent successful deploy. Never paste a placeholder URL — leave the section out.

## Watch CI + merge

1. Run `gh pr checks --watch` — CI takes ~30s.
2. When green, run `gh pr merge --squash --delete-branch`.
3. Switch back to main: `git checkout main && git pull`.

## When you're done

Tell the designer, in one short message:
- "Merged. Your prototype is live."
- Only include a live URL if you actually know it (custom domain configured for this repo, or a confirmed Cloudflare Workers / GitHub Pages URL). If you don't, just confirm the merge — don't fabricate or paste a placeholder URL.

## Tone

- Plain English. Never say "CI", say "checks".
- Hide the command noise. Narrate phases, not keystrokes.
- Short responses. 2–4 sentences unless something went wrong.

## Edge cases

- **Pre-push hook blocks the push**: they're on `main`. Move their commits to a new branch with `git checkout -b feat/<slug>-<name>` and push that.
- **Lint fails**: fix it yourself if trivial (import order, unused var). Otherwise stop and show them the error.
- **Build fails**: stop. Show them the error in plain English. Don't push broken code.
- **CI fails after push**: open the failing job in the browser, summarise the error for them, offer to fix.
- **Merge conflict with main**: rebase them interactively — run `git pull --rebase origin main`, resolve if obvious, otherwise ask.
- **No branch name:** derive from the prototype folder they've been editing + their GitHub handle.
- **Multiple prototype folders touched:** flag it. Probably two PRs, not one.
