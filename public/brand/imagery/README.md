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

| Collection | Folder | Files |
|---|---|---|
| Compositions | `compositions/` | `lifestyle-terrace.jpg`, `vineyard-portrait.jpg`, `model-smiley-terrace.jpg`, `model-sweater-terrace.jpg`, `model-cafe.jpg` |
| Character Sheets | `character-sheets/` | `model-contact-sheet.jpg`, `model-contact-sheet-dark.jpg` |
| Locations | `locations/` | `vineyard-moodboard.jpg` |
| iPhone & iPad Mockups | `mockups/` | _(none yet)_ |

Any manifest entry whose file isn't present yet renders as a neutral
placeholder tile in the gallery — so it's safe to list images before the file
lands. Keep individual files well under 25 MB (Cloudflare's per-asset limit);
optimise to < 1 MB where you can.
