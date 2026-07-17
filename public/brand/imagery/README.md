# Brand imagery

Marketing image library shown in the hub at **Brand → Imagery** (`#/brand/imagery`).

Images are plain files served from `public/`, so anything you drop here is
available at `/brand/imagery/<collection>/<file>` and can be downloaded from the
gallery (individually or as a zip).

## How to add images

1. Drop the file into the matching collection folder, e.g.
   `public/brand/imagery/compositions/my-photo.jpg`.
2. Add an entry for it in [`src/brand/imageryData.ts`](../../../src/brand/imageryData.ts)
   under that collection's `images` array (`src` + `alt`).

Collections and the files they expect (matching the current manifest):

Each persona bundles a **Reference** set (clean studio portraits and contact
sheets, in `character-sheets/`) and an **In context** set (café, desk and
on-location scenes, in `compositions/`). The authoritative list of files lives
in [`src/brand/imageryData.ts`](../../../src/brand/imageryData.ts) — the table
below is just an orientation of where each collection stores its files.

| Collection | Folder | Holds |
|---|---|---|
| Personas — Reference | `character-sheets/` | Contact sheets + studio portraits, e.g. `sarah-portrait-tank.jpg`, `emma-portrait-01.jpg`, `mika-portrait-cream.jpg` |
| Personas — In context | `compositions/` | Café, terrace and desk scenes, e.g. `sarah-desk-01.jpg`, `emma-cafe-01.jpg`, `mika-desk-01.jpg` |
| Locations | `locations/` | Mood boards + venue scenes, e.g. `vineyard-moodboard.jpg` |
| Mockups | `mockups/` | Device frames + product-screen shots, e.g. `iphone-wine-table.jpg` |

Any manifest entry whose file isn't present yet renders as a neutral
placeholder tile in the gallery — so it's safe to list images before the file
lands. Keep individual files well under 25 MB (Cloudflare's per-asset limit);
optimise to < 1 MB where you can.
