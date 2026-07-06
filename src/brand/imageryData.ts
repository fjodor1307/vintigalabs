// Brand imagery manifest — collections shown at Brand → Imagery.
// One consistent shape, three tiers:
//   • Collection (the card) — Personas, Locations, Mockups…
//   • Group / Subject (one item inside) — Sarah, Outdoor, iPhone…
//   • Set (the two tabs every subject holds) — "Reference" (the clean,
//     canonical asset) + "In context" (that asset living in a real scene).
// A set holds the images; a subject page shows its sets as sections.
// Files live in `public/brand/imagery/<folder>/` and are served from
// `/brand/imagery/...`. See `public/brand/imagery/README.md` to add images.

export type GalleryImage = {
  /** Public path, e.g. /brand/imagery/compositions/lifestyle-terrace.jpg */
  src: string
  alt: string
}

export type ImageSet = {
  slug: string
  title: string
  /** Optional caption shown under the section heading. */
  description?: string
  images: GalleryImage[]
}

// A subject bundles its two sets under one name — e.g. a persona: their
// reference contact sheet plus their in-context lifestyle shots.
export type ImageGroup = {
  slug: string
  title: string
  description?: string
  /** Optional classifier badge shown on the card (e.g. a location's Outdoor /
   *  Indoor type). When set, it replaces the collection's surface badges. */
  kind?: 'Outdoor' | 'Indoor'
  sets: ImageSet[]
}

export type ImageCollection = {
  slug: string
  title: string
  description: string
  tags: string[]
  groups: ImageGroup[]
}

const dir = '/brand/imagery'

// The two sets every subject holds. `reference` / `inContext` builders keep the
// slugs, titles and captions consistent across every collection.
const reference = (images: GalleryImage[], description: string): ImageSet => ({
  slug: 'reference',
  title: 'Reference',
  description,
  images,
})
const inContext = (images: GalleryImage[], description: string): ImageSet => ({
  slug: 'in-context',
  title: 'In context',
  description,
  images,
})

export const IMAGE_COLLECTIONS: ImageCollection[] = [
  {
    slug: 'personas',
    title: 'Personas',
    description: 'The brand faces — each with a reference sheet and their own in-context shots, kept consistent for composition and AI work.',
    tags: ['models', 'reference', 'lifestyle'],
    groups: [
      {
        slug: 'sarah',
        title: 'Sarah',
        description: 'Golden-hour blonde — warm, relaxed, vineyard-terrace energy.',
        sets: [
          reference(
            [{ src: `${dir}/character-sheets/model-contact-sheet.jpg`, alt: 'Contact sheet of a blonde model in a white tank top across multiple angles' }],
            'Angles and expressions for consistent composition and AI work.',
          ),
          inContext(
            [
              { src: `${dir}/compositions/lifestyle-terrace.jpg`, alt: 'Two guests laughing over drinks on a sunlit terrace' },
              { src: `${dir}/compositions/vineyard-portrait.jpg`, alt: 'Woman with a glass of white wine at a vineyard table at golden hour' },
            ],
            'Lifestyle & on-location shots of this persona.',
          ),
        ],
      },
      {
        slug: 'mika',
        title: 'Mika',
        description: 'Dark-haired, cream knit — soft café and golden-hour moments.',
        sets: [
          reference(
            [{ src: `${dir}/character-sheets/model-contact-sheet-dark.jpg`, alt: 'Contact sheet of a dark-haired model in a cream sweater and jeans across multiple angles' }],
            'Angles and expressions for consistent composition and AI work.',
          ),
          inContext(
            [
              { src: `${dir}/compositions/model-cafe.jpg`, alt: 'Woman with coffee at a rustic café table' },
              { src: `${dir}/compositions/model-smiley-terrace.jpg`, alt: 'Woman in a smiley-face tee with white wine at a vineyard terrace, golden hour' },
              { src: `${dir}/compositions/model-sweater-terrace.jpg`, alt: 'Woman in a cream sweater with white wine at a vineyard terrace, golden hour' },
            ],
            'Lifestyle & on-location shots of this persona.',
          ),
        ],
      },
    ],
  },
  {
    slug: 'locations',
    title: 'Locations',
    description: 'Venue, vineyard and estate scenery — outdoor and indoor spaces, from clean establishing shots to lived-in scenes.',
    tags: ['venue', 'vineyard', 'scenery'],
    groups: [
      {
        slug: 'maison-soleil',
        title: 'Maison Soleil',
        description: 'Sun-drenched stone estate — terrace, vineyard rows, pergola and barrels at golden hour.',
        kind: 'Outdoor',
        sets: [
          reference(
            [{ src: `${dir}/locations/vineyard-moodboard.jpg`, alt: 'Vineyard and estate mood board — terrace, rows, glasses and barrels' }],
            'The estate at a glance — an establishing mood board.',
          ),
          inContext(
            [
              { src: `${dir}/locations/estate-terrace.jpg`, alt: 'Gravel terrace with wooden dining sets and a parasol under a tree, vineyard and hills beyond at golden hour' },
              { src: `${dir}/locations/vineyard-rows.jpg`, alt: 'Rows of vines running toward the hills and a cypress at golden hour' },
              { src: `${dir}/locations/pergola-bar.jpg`, alt: 'Rustic stone outdoor bar under a timber pergola with wine bottles and lavender' },
              { src: `${dir}/locations/garden-path.jpg`, alt: 'Gravel garden path lined with white blooms and terracotta urns at golden hour' },
              { src: `${dir}/locations/terrace-lounge.jpg`, alt: 'Reclaimed-wood table and cushioned bench on a vine-shaded veranda overlooking the vineyard' },
              { src: `${dir}/locations/wine-barrels.jpg`, alt: 'Oak wine barrels stacked outdoors in warm evening light' },
            ],
            'The estate spaces — terrace, rows, pergola, garden and barrels.',
          ),
        ],
      },
      {
        slug: 'la-cave',
        title: 'La Cave',
        description: 'Warm oak interiors — tasting tables, stone walls and vineyard-view windows at golden hour.',
        kind: 'Indoor',
        sets: [
          reference(
            [{ src: `${dir}/locations/indoor-moodboard.jpg`, alt: 'Interior tasting-room mood board — warm oak tables, stone walls, wine shelves and vineyard-view windows at golden hour' }],
            'The interior at a glance — an establishing mood board.',
          ),
          inContext([], 'The indoor spaces with light, atmosphere and guests.'),
        ],
      },
    ],
  },
  {
    slug: 'mockups',
    title: 'Mockups',
    description: 'Product screens dropped into device frames for decks and store listings.',
    tags: ['product', 'devices', 'mockups'],
    groups: [
      {
        slug: 'desktop',
        title: 'Desktop',
        description: 'Product screens on desktop monitors.',
        sets: [
          reference(
            [
              { src: `${dir}/mockups/desktop-frames-01.jpg`, alt: 'Collage of blank desktop monitors on a wooden desk across six angles' },
              { src: `${dir}/mockups/desktop-frames-02.jpg`, alt: 'Collage of blank desktop monitors by a bright window across four angles' },
              { src: `${dir}/mockups/desktop-frames-dark.jpg`, alt: 'Collage of switched-off desktop monitors beside a glass of red wine in warm evening light' },
            ],
            'Bare desktop monitor frames, ready for screens.',
          ),
          inContext(
            [
              { src: `${dir}/mockups/dashboard-desk-collage.jpg`, alt: 'Collage of the Vintiga dashboard on desktop monitors across six angles' },
              { src: `${dir}/mockups/dashboard-over-shoulder.jpg`, alt: 'Woman at her desk with the Vintiga dashboard on the monitor behind her' },
              { src: `${dir}/mockups/dashboard-screen-closeup.jpg`, alt: 'Close-up of an angled monitor showing the Vintiga dashboard' },
              { src: `${dir}/mockups/dashboard-office-portrait.jpg`, alt: 'Woman in a home office with the Vintiga dashboard on the screen behind her' },
              { src: `${dir}/mockups/dashboard-desk-front.jpg`, alt: 'Front-on desktop monitor with the Vintiga dashboard beside a plant and notebook' },
              { src: `${dir}/mockups/dashboard-desk-window.jpg`, alt: 'Angled desktop monitor with the Vintiga dashboard on a wooden desk by a window' },
            ],
            'The Vintiga dashboard on desktop, at work and in the office.',
          ),
        ],
      },
      {
        slug: 'iphone',
        title: 'iPhone',
        description: 'Product screens in iPhone frames.',
        sets: [
          reference(
            [
              { src: `${dir}/mockups/iphone-hands-grid-01.jpg`, alt: 'Collage of hands holding a blank iPhone against a grey studio backdrop' },
              { src: `${dir}/mockups/iphone-hands-grid-02.jpg`, alt: 'Second collage of hands holding a blank iPhone against a grey studio backdrop' },
              { src: `${dir}/mockups/iphone-warm-collage.jpg`, alt: 'Collage of blank iPhones in warm amber-lit interior scenes' },
            ],
            'Blank iPhones in hand, ready for screens.',
          ),
          inContext(
            [
              { src: `${dir}/mockups/iphone-guest-profile-wine.jpg`, alt: 'Hands holding an iPhone showing a Vintiga guest profile at a wine-bar table' },
              { src: `${dir}/mockups/iphone-wine-table.jpg`, alt: 'Hands holding an iPhone at a sunlit wine-bar table with a glass of red' },
            ],
            'The Vintiga app in hand at the tasting table.',
          ),
        ],
      },
      {
        slug: 'ipad',
        title: 'iPad',
        description: 'Product screens in iPad frames.',
        sets: [
          reference(
            [
              { src: `${dir}/mockups/ipad-wood-collage-01.jpg`, alt: 'Collage of blank iPads resting on warm wooden surfaces' },
              { src: `${dir}/mockups/ipad-wood-collage-02.jpg`, alt: 'Second collage of blank iPads on warm wooden surfaces' },
              { src: `${dir}/mockups/ipad-held-studio-grey.jpg`, alt: 'Collage of a woman holding a blank iPad against a grey studio backdrop' },
              { src: `${dir}/mockups/ipad-wine-bar-collage-01.jpg`, alt: 'Collage of a woman holding a blank iPad in a dim wine bar' },
              { src: `${dir}/mockups/ipad-wine-bar-collage-02.jpg`, alt: 'Second collage of a woman holding a blank iPad in a dim wine bar' },
              { src: `${dir}/mockups/ipad-held-studio-light.jpg`, alt: 'Collage of a woman holding a blank iPad against a light studio backdrop' },
            ],
            'Blank iPads in hand and on the counter, ready for screens.',
          ),
          inContext(
            [{ src: `${dir}/mockups/ipad-cellar.jpg`, alt: 'Woman holding an iPad beside the bottle shelves of a wine cellar' }],
            'The iPad at work in the cellar and tasting room.',
          ),
        ],
      },
    ],
  },
]

export function collectionBySlug(slug: string): ImageCollection | undefined {
  return IMAGE_COLLECTIONS.find((c) => c.slug === slug)
}

export function groupBySlug(collection: ImageCollection, groupSlug: string): ImageGroup | undefined {
  return collection.groups.find((g) => g.slug === groupSlug)
}

/** Every image inside one subject's sets, flattened — for covers, counts and zips. */
export function groupImages(group: ImageGroup): GalleryImage[] {
  return group.sets.flatMap((s) => s.images)
}

/** Every image across a collection's subjects, flattened. */
export function collectionImages(collection: ImageCollection): GalleryImage[] {
  return collection.groups.flatMap((g) => groupImages(g))
}

export function fileNameOf(src: string): string {
  return src.split('/').pop() || 'image'
}
