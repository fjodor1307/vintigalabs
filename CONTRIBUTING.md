# Contributing

This repo is a shared playground for Vintiga designers to build clickable prototypes. Everyone can see everyone's work. The rules below keep the shared parts stable while giving you free rein over your own prototype.

## Prerequisites

Before you can do useful prototype work in this repo:

- **Access to Vintiga requirements** — epics, user stories, and requirements live wherever the Vintiga team tracks them (Notion / Linear / GitHub / Jira — TBD). Ask the team lead.
- **Read [`_context/`](_context/)** before starting your first prototype. When populated, it carries personas, programme north star, brand essentials, and research findings — all the shared context you need to design with intent rather than from imagination.

## Who owns what

- **`src/design-system/` (`@ds/`)** — shared. Touch means PR + review.
- **`src/prototypes/{your-folder}/`** — yours. Work however you want.
- **`_templates/`, root docs (`CLAUDE.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `CONTEXT.md`)** — shared. PR required.

Rule of thumb: if your change only affects files inside your prototype folder, you can fast-merge. Everything else goes through a PR.

**Ownership is enforced by [`.github/CODEOWNERS`](.github/CODEOWNERS).** When your PR touches someone else's folder or a shared file, GitHub automatically requests a review from the owner. If you need to change something in another designer's prototype, first try: **clone it instead.**

## Iterating on someone else's prototype — clone, don't edit

If you want to try an alternative version of a prototype that someone else owns, duplicate it instead of editing in place:

```bash
npm run clone-prototype -- invited-director invited-director-ogi
```

That copies the whole folder, rewrites the routes (`/web/invited-director-ogi/...`), and registers the clone on the home page automatically. You now own the new slug. Add it to `CODEOWNERS` so the review-request plumbing works. The original prototype and the clone live side-by-side and can be compared via review links.

Exceptions where in-place edits are still OK: you're pairing with the owner, or the owner is out and a tiny shared fix is needed — in both cases, open a PR and they'll rubber-stamp.

## Branch naming

Use short, descriptive branches:

- `feat/{feature}-{name}` — new prototype work, e.g. `feat/onboarding-hera`
- `fix/{what}` — fixing something shared, e.g. `fix/button-radius`
- `ds/{what}` — design-system changes, e.g. `ds/add-loading-spinner`

One feature per branch. Keep branches short-lived — merge or delete within a week.

## First-time setup after cloning

Run once per machine, right after `git clone` + `npm install`:

```bash
npm run install-hooks
```

Points Git at the repo's shared `.githooks/` folder — installs a **pre-push hook that blocks direct pushes to `main`**. You'll get a clear error message if you try. Emergency override (hotfix, broken deploy): `VINTIGA_ALLOW_MAIN_PUSH=1 git push`.

## Daily sync routine (avoids conflict pain)

The #1 cause of merge conflicts is long-lived branches. Follow this and you'll almost never hit one:

1. **Morning:** `git checkout main && git pull && git checkout your-branch && git rebase origin/main`. You pick up any drift while the changes are still tiny.
2. **End of day:** push your branch and open a draft PR if you haven't. Other designers see what you're building.
3. **When ready:** run `gh pr merge <number> --auto --squash` — GitHub auto-merges the moment CI passes + approval lands. No babysitting.
4. **After merge:** delete your branch (`git branch -d ...`) and pull main. Always start fresh tomorrow.

The [`PR hygiene`](.github/workflows/pr-hygiene.yml) GitHub Action nudges any PR left open for 3+ days on weekdays at 17:00 UTC, and auto-closes stale ones after 14 days. Exempt labels: `wip`, `blocked`, `long-running`.

## Starting a new prototype

```bash
npm run new-prototype my-feature
```

That scaffolds the folder, copies all four templates, writes a starter screen, registers the prototype with the router, and appends to the root CHANGELOG. Then add yourself to [`CODEOWNERS`](.github/CODEOWNERS) for that folder so future PRs route to you.

## When to PR vs push direct

| Change | Branch | PR needed |
|--------|--------|-----------|
| New prototype folder | `feat/{feature}-{name}` | No — fast-merge when ready |
| Work inside your own prototype folder | `feat/{feature}-{name}` | No — fast-merge when ready |
| Anything in `@ds/` | `ds/{what}` | **Yes** — review required |
| Root docs or `_templates/` | `fix/{what}` | **Yes** — review required |
| A prototype someone else owns | `fix/{what}` | **Yes** — ping the owner |

Fast-merge = you can open a PR and self-approve, or push direct if branch protection allows. The point is visibility, not bureaucracy.

## PR expectations

Keep PRs small and focused. Use the template — What / Why / Screenshots. Attach screenshots for any UI change.

If you're mid-work and want eyes on it, open a **draft PR** early. Other designers will see what you're building without having to ask.

## Commit messages

Short, imperative. First line under ~70 chars.

Good:
- `Add onboarding intro screen`
- `Fix button radius on mobile`
- `Rename tier "Launch" → "Free"`

Avoid:
- `stuff`
- `Updated the screen I was working on yesterday lol`
- Commits that bundle unrelated changes

## Starting a new prototype (manual way)

If you need to do it by hand instead of `npm run new-prototype`:

1. Branch: `git checkout -b feat/{feature}-{your-name}`
2. Copy templates into the new folder:
   ```
   cp _templates/JOURNEY.md    src/prototypes/{feature}/JOURNEY.md
   cp _templates/NOTES.md      src/prototypes/{feature}/NOTES.md
   cp _templates/CHANGELOG.md  src/prototypes/{feature}/CHANGELOG.md
   ```
3. Create `prototype.config.ts` (see any existing prototype for shape).
4. Add yourself to [`CODEOWNERS`](.github/CODEOWNERS) for your folder.
5. Build. Keep `JOURNEY.md` up to date as you go.
6. PR when the first screen is reviewable — don't wait for the whole flow.

## Reviewing PRs

- DS / shared changes: no default reviewer is assigned — ping a teammate for a second pair of eyes before merging
- Prototype-only changes: self-approval is fine; ping another designer only if you want a second pair of eyes

## What breaks the rules

- Pushing direct to `main` when branch protection is on (GitHub blocks it)
- Editing a file outside your prototype folder without a PR
- Editing someone else's prototype folder without cloning it first (use `npm run clone-prototype`)
- Merging a PR that fails CI (build must pass)
- Force-pushing to shared branches (your own branch is fine)

## One-off GitHub settings (Ogi to do once)

These aren't code — they're Settings → … clicks on GitHub:

- **Branch protection on `main`:** Require a PR, require CI to pass, require review from a Code Owner, dismiss stale approvals on new commits.
- **Enable auto-merge:** Settings → General → "Allow auto-merge" — lets PRs merge themselves when checks go green.
- **Actions permissions:** Settings → Actions → "Allow all actions" (needed for `pr-hygiene.yml` + `deploy.yml`).
