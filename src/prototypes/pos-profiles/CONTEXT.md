# POS Profiles — Context

> The why and the what behind this prototype. Read this before opening a screen.

**Source of truth:** Vintiga ticket "Manage POS Profiles in Stand-Alone Store"
**Figma:** [05. Dashboard](https://www.figma.com/design/3DnxyYDZqDGQqvknlD4aTu/05.-Dashboard?node-id=1626-5128) — list `1626-5128`, detail `1637-7618`, Details modal `5438-27366`, Collections modal `5438-27260`
**Last synced:** 2026-07-02 by Fedja
**Owner:** Fedja Djukic (djukicfedja@gmail.com)
**Status:** in-progress  <!-- in-progress | approved -->

---

## Why this exists

Every stand-alone Vintiga store is created with a single POS profile that has no collections. Today there's no way to add more profiles or fully edit them in a stand-alone store. This feature lets stand-alone stores **add and fully edit POS profiles**, while Commerce7-connected stores keep most fields read-only (they're owned by C7).

## Who it's for

- **Primary persona:** the store operator / manager configuring how the POS behaves per till/location.

## Key user stories

- **List** — As an operator I want to see all POS profiles configured in the store so I can pick one to manage.
- **Add** (stand-alone only) — As an operator of a stand-alone store I want to add a new POS profile.
- **Edit** — As an operator I want to edit a profile's details, collections, tips, PIN/order rules, printers, devices and inventory locations.
- **C7 read-only** — As an operator of a C7-connected store I can only toggle collection **images on/off** and change **collection colors**; everything else is read-only.

## Requirements & constraints

**List**
- Show all POS profiles: name (+ color dot), operational location, default-profile flag.
- **Add Profile** button on stand-alone stores; **Get Profiles** button on C7-connected stores.

**Sync (Connected vs Stand-Alone)** — behavioural, not a screen:
- Disconnecting C7 keeps the ingested profiles configured locally.
- Re-connecting C7 to a store with profiles: same reference ID → C7 value wins (overwrite Vintiga); Vintiga profile with no C7 reference ID → create it in C7 and store the returned C7 Profile ID.

**Editing permissions**
- **C7-connected:** only collection *images on/off* and *collection colors* are editable; all else read-only.
- **Stand-alone:** every field editable.

**Editable POS Profile fields**
- **General:** name/title · color (hex) · is-default (yes/no) · default sales attribute (default "POS").
- **Tips:** on/off · type (percentage | amounts) · 4 options · display on EMV (yes/no).
- **Finalizing orders & Employee PINs:** employee PIN on/off · require PIN before payment · require PIN after order · prompt "Additional Order Info" before payment · kitchen tickets on/off · prompt "Send Items to Kitchen" before payment · **printers** (title, ID, type, deletable).
- **Chip & PIN devices:** list — title, terminal ID, type (supported types), deletable.
- **Collections:** list — color (hex), show images on/off, sort order, deletable.
- **Inventory** (structure borrowed from C7; Vintiga maps physical location → inventory location): carry-out location · shipping location · pickup location.

## Notes / open questions

Tracked in [`NOTES.md`](./NOTES.md). Key ones: inventory UI isn't designed yet (mapping physical → inventory locations is a proposal); the sync rules are backend behaviour with no dedicated screen — surfaced here only via the store-mode toggle used to demo read-only vs editable.

## Sources

- **Requirements:** Vintiga ticket (pasted into this file's history / NOTES).
- **Figma:** file `3DnxyYDZqDGQqvknlD4aTu`, page "05. Dashboard".
