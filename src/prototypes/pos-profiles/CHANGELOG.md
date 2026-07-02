# Pos Profiles — Changelog

> Living handoff document for this prototype. Read first if you're picking up someone else's work.
>
> **Convention:** Add new entries at the top. Each entry needs a date, who made the change, what changed, and why. Focus on changes to this prototype only — cross-cutting / design-system changes belong in the repo-level `CHANGELOG.md`.

---

## 2026-07-02 — Fedja + Claude: Build the prototype (list + detail + edit modals)

First build of **Manage POS Profiles in a Stand-Alone Store** — Figma `1626-5128` (list) / `1637-7618` (detail) / `5438-27366` (Details modal) / `5438-27260` (Collections modal).

Screens & files:
- `ProfilesListScreen.tsx` — table of every profile (color dot · name / operational location / default), search, a **store-mode toggle** (Stand-Alone ↔ Commerce7) that swaps **Add POS Profile** for **Get Profiles** and drives edit permissions, and a row **⋮** menu (Edit Details · Edit Collections · Duplicate).
- `ProfileDetailScreen.tsx` — two-panel read view (Details · Product Collections · Inventory · Tips / Advanced Settings · Chip & PIN Devices · Printers). Each card has an Edit button (reads "View" when C7-locked); the title **⋮** mirrors the row menu + Delete (stand-alone). Profile id travels in the hash query (`?id=`) so one route serves seeded, added and duplicated profiles.
- `editModals.tsx` — Details (General), Product Collections, Tips, Advanced Settings, Printers, Chip & PIN Devices, Inventory, and the Add-profile modal. Each mounts fresh and commits via the store.
- `data.ts` / `store.ts` — types, seed profiles, option lists, and an in-memory reactive store (`useSyncExternalStore`) with add / save / duplicate / delete.
- `nav.ts` / `PosProfilesShell.tsx` — routing helpers + the AppSidebar/Navbar chrome.

Permissions (ticket): in **Commerce7** mode every profile field is read-only **except** collection colors and images-on/off; in **Stand-Alone** everything is editable and profiles can be added.

Shared-DS change: `AppSidebar` "POS Profiles" nav item now links to `#/web/pos-profiles/list` and highlights via `activeNav`.

Why: gives stand-alone stores a way to add and fully edit POS profiles (they ship with one empty profile), while keeping C7-ingested profiles read-only.
