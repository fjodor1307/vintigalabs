// Brand imagery manifest — collections shown at Brand → Imagery.
// Structure is three levels: Collection → Set → Image.
//   • A collection (e.g. "Compositions") groups related sets.
//   • A set (e.g. "Character Composition 01") is one shoot/character and holds
//     multiple images — opening it shows an image gallery.
//   • Collections with a single set skip the middle level and open straight
//     into that set's gallery.
// Files live in `public/brand/imagery/<collection>/` and are served from
// `/brand/imagery/...`. See `public/brand/imagery/README.md` to add images.

export type GalleryImage = {
  /** Public path, e.g. /brand/imagery/compositions/lifestyle-terrace.jpg */
  src: string
  alt: string
}

export type ImageSet = {
  slug: string
  title: string
  /** Optional card subtitle; falls back to the image count when absent. */
  description?: string
  images: GalleryImage[]
}

export type ImageCollection = {
  slug: string
  title: string
  description: string
  /** Where the imagery is used — shows as badges. */
  surfaces: ('CRM' | 'POS')[]
  tags: string[]
  sets: ImageSet[]
}

const dir = '/brand/imagery'

export const IMAGE_COLLECTIONS: ImageCollection[] = [
  {
    slug: 'compositions',
    title: 'Compositions',
    description: 'Lifestyle & on-location brand photography — guests, staff and the room, golden-hour warm.',
    surfaces: ['CRM', 'POS'],
    tags: ['lifestyle', 'guests', 'on-location'],
    sets: [
      {
        slug: 'character-composition-01',
        title: 'Character Composition 01',
        images: [
          { src: `${dir}/compositions/lifestyle-terrace.jpg`, alt: 'Two guests laughing over drinks on a sunlit terrace' },
          { src: `${dir}/compositions/vineyard-portrait.jpg`, alt: 'Woman with a glass of white wine at a vineyard table at golden hour' },
        ],
      },
      {
        slug: 'character-composition-02',
        title: 'Character Composition 02',
        images: [
          { src: `${dir}/compositions/model-cafe.jpg`, alt: 'Woman with coffee at a rustic café table' },
          { src: `${dir}/compositions/model-smiley-terrace.jpg`, alt: 'Woman in a smiley-face tee with white wine at a vineyard terrace, golden hour' },
          { src: `${dir}/compositions/model-sweater-terrace.jpg`, alt: 'Woman in a cream sweater with white wine at a vineyard terrace, golden hour' },
        ],
      },
    ],
  },
  {
    slug: 'character-sheets',
    title: 'Character Sheets',
    description: 'Consistent model reference sheets — angles and expressions for composition and AI work.',
    surfaces: ['CRM', 'POS'],
    tags: ['models', 'reference', 'consistency'],
    sets: [
      {
        slug: 'character-sheets',
        title: 'Character Sheets',
        images: [
          { src: `${dir}/character-sheets/model-contact-sheet.jpg`, alt: 'Contact sheet of a model in a white tank top across multiple angles' },
          { src: `${dir}/character-sheets/model-contact-sheet-dark.jpg`, alt: 'Contact sheet of a dark-haired model in a cream sweater and jeans across multiple angles' },
        ],
      },
    ],
  },
  {
    slug: 'locations',
    title: 'Locations',
    description: 'Venue, vineyard and estate scenery — terraces, rows, barrels and tasting spaces.',
    surfaces: ['CRM', 'POS'],
    tags: ['venue', 'vineyard', 'scenery'],
    sets: [
      {
        slug: 'locations',
        title: 'Locations',
        images: [
          { src: `${dir}/locations/vineyard-moodboard.jpg`, alt: 'Vineyard and estate mood board — terrace, rows, glasses and barrels' },
        ],
      },
    ],
  },
  {
    slug: 'mockups',
    title: 'iPhone & iPad Mockups',
    description: 'Product screens dropped into device frames for decks and store listings.',
    surfaces: ['POS'],
    tags: ['product', 'devices', 'mockups'],
    sets: [],
  },
]

export function collectionBySlug(slug: string): ImageCollection | undefined {
  return IMAGE_COLLECTIONS.find((c) => c.slug === slug)
}

export function setBySlug(collection: ImageCollection, setSlug: string): ImageSet | undefined {
  return collection.sets.find((s) => s.slug === setSlug)
}

/** Every image across a collection's sets, flattened — for covers, counts and zips. */
export function collectionImages(collection: ImageCollection): GalleryImage[] {
  return collection.sets.flatMap((s) => s.images)
}

export function fileNameOf(src: string): string {
  return src.split('/').pop() || 'image'
}
