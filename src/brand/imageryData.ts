// Brand imagery manifest — collections shown at Brand → Imagery.
// Files live in `public/brand/imagery/<collection>/` and are served from
// `/brand/imagery/...`. See `public/brand/imagery/README.md` to add images.

export type GalleryImage = {
  /** Public path, e.g. /brand/imagery/compositions/lifestyle-terrace.jpg */
  src: string
  alt: string
}

export type ImageCollection = {
  slug: string
  title: string
  description: string
  /** Where the imagery is used — shows as badges. */
  surfaces: ('CRM' | 'POS')[]
  tags: string[]
  images: GalleryImage[]
}

const dir = '/brand/imagery'

export const IMAGE_COLLECTIONS: ImageCollection[] = [
  {
    slug: 'compositions',
    title: 'Compositions',
    description: 'Lifestyle & on-location brand photography — guests, staff and the room, golden-hour warm.',
    surfaces: ['CRM', 'POS'],
    tags: ['lifestyle', 'guests', 'on-location'],
    images: [
      { src: `${dir}/compositions/lifestyle-terrace.jpg`, alt: 'Two guests laughing over drinks on a sunlit terrace' },
      { src: `${dir}/compositions/vineyard-portrait.jpg`, alt: 'Woman with a glass of white wine at a vineyard table at golden hour' },
    ],
  },
  {
    slug: 'character-sheets',
    title: 'Character Sheets',
    description: 'Consistent model reference sheets — angles and expressions for composition and AI work.',
    surfaces: ['CRM', 'POS'],
    tags: ['models', 'reference', 'consistency'],
    images: [
      { src: `${dir}/character-sheets/model-contact-sheet.jpg`, alt: 'Contact sheet of a model in a white tank top across multiple angles' },
    ],
  },
  {
    slug: 'locations',
    title: 'Locations',
    description: 'Venue, vineyard and estate scenery — terraces, rows, barrels and tasting spaces.',
    surfaces: ['CRM', 'POS'],
    tags: ['venue', 'vineyard', 'scenery'],
    images: [
      { src: `${dir}/locations/vineyard-moodboard.jpg`, alt: 'Vineyard and estate mood board — terrace, rows, glasses and barrels' },
    ],
  },
  {
    slug: 'mockups',
    title: 'iPhone & iPad Mockups',
    description: 'Product screens dropped into device frames for decks and store listings.',
    surfaces: ['POS'],
    tags: ['product', 'devices', 'mockups'],
    images: [],
  },
]

export function collectionBySlug(slug: string): ImageCollection | undefined {
  return IMAGE_COLLECTIONS.find((c) => c.slug === slug)
}

export function fileNameOf(src: string): string {
  return src.split('/').pop() || 'image'
}
