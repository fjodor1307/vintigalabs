# Clubs — User Journey

## Source

- **Requirements:** Figma —
  - [Clubs list (5079:44185)](https://www.figma.com/design/3DnxyYDZqDGQqvknlD4aTu/05.-Dashboard?node-id=5079-44185)
  - [Add New Club modal (5078:8564)](https://www.figma.com/design/3DnxyYDZqDGQqvknlD4aTu/05.-Dashboard?node-id=5078-8564)
  - [Editor — Overview (5079:33614)](https://www.figma.com/design/3DnxyYDZqDGQqvknlD4aTu/05.-Dashboard?node-id=5079-33614)
  - [Editor — Releases (5331:57496)](https://www.figma.com/design/3DnxyYDZqDGQqvknlD4aTu/05.-Dashboard?node-id=5331-57496)
  - [Editor — Add Release (5331:59258)](https://www.figma.com/design/3DnxyYDZqDGQqvknlD4aTu/05.-Dashboard?node-id=5331-59258)
  - [Editor — Levels (5079:46371)](https://www.figma.com/design/3DnxyYDZqDGQqvknlD4aTu/05.-Dashboard?node-id=5079-46371)
  - [Editor — Emails (5079:57000)](https://www.figma.com/design/3DnxyYDZqDGQqvknlD4aTu/05.-Dashboard?node-id=5079-57000)
- **Stories:** CL-01 … CL-09
- **CONTEXT.md:** [`./CONTEXT.md`](./CONTEXT.md)

---

## Journey Steps

| # | Step | Story | Route | Status |
|---|------|-------|-------|--------|
| 1 | Operator lands on Clubs and reads the membership KPIs | CL-02 | `#/web/clubs` | Done |
| 2 | Operator scans the active clubs list | CL-01 | `#/web/clubs` | Done |
| 3 | Operator filters the list by status (Active / Inactive) | CL-03 | `#/web/clubs` | Done |
| 4 | Operator clicks "+ Add Club" → picks club type in modal | CL-04 | `#/web/clubs` | Done |
| 5 | Operator lands on Overview tab to fill in the basics | CL-05 | `#/web/clubs/new/overview?type=…` | Done |
| 6a | (Curated) Operator schedules club releases | CL-06 | `#/web/clubs/new/releases` | Done |
| 6b | (Curated) Operator adds a new release | CL-06 | `#/web/clubs/new/releases/add` | Done |
| 7 | (Account Credit) Operator configures contribution levels | CL-07 | `#/web/clubs/new/levels` | Done |
| 8 | Operator edits the email templates members receive | CL-08 | `#/web/clubs/new/emails` | Done |
| 9 | Operator switches to Memberships to manage members | -- | `#/web/clubs/memberships` | Gap (placeholder) |
| 10 | Operator switches to Club Emails to review notifications | -- | `#/web/clubs/emails` | Gap (placeholder) |

**Status values:**
- **Done** — screen built and linked
- **In Progress** — screen partially built
- **Gap** — no screen exists yet
- **Blocked** — waiting on a decision or dependency

---

## Tabs by club type

The editor's tab list is driven by `clubStore.type`:

| Club type | Tabs |
| --- | --- |
| Curated | Overview / Releases / Emails |
| Account Credit | Overview / Levels / Emails |
| Membership | Overview / Emails |

---

## Gaps

- **Save behaviour.** The Save button is wired but no-op — needs to commit the draft to a real list, navigate back to `#/web/clubs`, and show a success toast.
- **Add Product (release sub-page).** The product search is a stub — needs the product picker (likely re-uses the products picker from `@products/`).
- **Image upload.** Drop zone is decorative — needs a real upload flow.
- **Memberships tab.** Searchable / filterable list across every club. Needs requirements before building.
- **Club Emails tab (page level).** Likely re-uses Campaigns infra — confirm with the campaigns prototype owner before building.
- **Editing an existing club.** Right now the editor only handles "new club" drafts. Once we have a saved list we need an `id`-driven loader (mirror of `productActions.loadFromCatalogue`).

## Notes

See [`NOTES.md`](./NOTES.md) for design observations and open questions.
