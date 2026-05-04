# Products — Changelog

> Living handoff document for this prototype. Read first if you're picking up someone else's work.
>
> **Convention:** Add new entries at the top. Each entry needs a date, who made the change, what changed, and why. Focus on changes to this prototype only — cross-cutting / design-system changes belong in the repo-level `CHANGELOG.md`.

---

## 2026-05-05 — fedja + Claude: Adopt DS Page Template

Refactored `ProductLayout` to follow the canonical `PageTemplate` pattern from the design system:

- Title is now a plain string (the product name) rendered with `typo-title-screen` by the template — dropped the custom thumbnail / meta / tags header that lived inside the title slot.
- Actions cluster is `Save` + kebab `IconButton` (Duplicate / Archive popover), matching the `ClubEditorLayout` pattern and the DS demo.
- Rail content is passed directly to `PageTemplate` (`Status` / `Collections` / `Availability` `RailSection`s) — removed the `<RightRail>` wrapper that was double-padding the aside.

Result: the Products and Clubs editors now share pixel-aligned rail spacing, and the rail stacks below the body on tablet/mobile via the updated `PageTemplate`.

## YYYY-MM-DD — {Name} + Claude: {short title}

What changed (files, screens, behaviour).

Why: {one or two lines on the motivation}.
