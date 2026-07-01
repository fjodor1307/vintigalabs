// Brand → Imagery. A marketing image library rendered inside the hub chrome:
// a list/grid of collections, each opening into a grid/list gallery with a
// lightbox carousel and downloads (per-image + zip). Data from `imageryData.ts`;
// files live in `public/brand/imagery/`.

import { useState, useEffect, useRef } from 'react'
import {
  BackArrowIcon,
  DownloadIcon,
  UploadIcon,
  Grid2x2Icon,
  LayoutListIcon,
  XIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  SearchIcon,
} from '@ds/icons/Icons'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { HubNavbar, HUB_OUTLINE_DARK } from '../hub/HubNavbar'
import type { Segment } from '../hub/segments'
import {
  IMAGE_COLLECTIONS,
  collectionBySlug,
  fileNameOf,
  type ImageCollection,
  type GalleryImage,
} from './imageryData'

// ─── Download helpers ─────────────────────────────────────────────────────────

function triggerDownload(href: string, filename: string) {
  const a = document.createElement('a')
  a.href = href
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
}

async function downloadImagesZip(images: GalleryImage[], name: string) {
  const { default: JSZip } = await import('jszip')
  const zip = new JSZip()
  let added = 0
  for (const img of images) {
    try {
      const res = await fetch(img.src)
      if (!res.ok) continue
      zip.file(fileNameOf(img.src), await res.blob())
      added++
    } catch {
      /* file not present yet — skip */
    }
  }
  if (added === 0) return
  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  triggerDownload(url, `${name}.zip`)
  URL.revokeObjectURL(url)
}

// ─── Small pieces ─────────────────────────────────────────────────────────────

function SurfaceBadge({ surface }: { surface: 'CRM' | 'POS' }) {
  return surface === 'POS' ? (
    <span className="shrink-0 inline-flex items-center typo-caption font-medium bg-vintiga-indigo-100 text-vintiga-indigo-700 px-2.5 py-1 rounded-vintiga-2xl">
      POS
    </span>
  ) : (
    <span className="shrink-0 inline-flex items-center typo-caption font-medium bg-vintiga-lime-100 text-vintiga-green-700 px-2.5 py-1 rounded-vintiga-2xl">
      CRM
    </span>
  )
}

// One image tile — falls back to a neutral placeholder if the file isn't there.
// Sizing is controlled by the caller via `className`.
function ImageTile({ img, onClick, className = '' }: { img: GalleryImage; onClick?: () => void; className?: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={img.alt}
      className={`group relative block overflow-hidden rounded-vintiga-lg bg-vintiga-surface-element border border-vintiga-border ${className}`}
    >
      {!failed && (
        <img
          src={img.src}
          alt={img.alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
        />
      )}
    </button>
  )
}

// ─── Lightbox carousel ────────────────────────────────────────────────────────

function Lightbox({
  images,
  index,
  onIndex,
  onClose,
}: {
  images: GalleryImage[]
  index: number
  onIndex: (i: number) => void
  onClose: () => void
}) {
  const current = images[index]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') onIndex((index - 1 + images.length) % images.length)
      else if (e.key === 'ArrowRight') onIndex((index + 1) % images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, images.length, onIndex, onClose])

  if (!current) return null
  const prev = () => onIndex((index - 1 + images.length) % images.length)
  const next = () => onIndex((index + 1) % images.length)
  const ctrl =
    'inline-flex items-center justify-center w-11 h-11 rounded-vintiga-md bg-white text-vintiga-slate-700 hover:bg-vintiga-slate-100 transition-colors shadow-vintiga-sm'

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-vintiga-lg">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/85 cursor-default" />
      <button type="button" onClick={onClose} aria-label="Close" className={`absolute top-vintiga-lg right-vintiga-lg z-10 ${ctrl}`}>
        <XIcon className="w-5 h-5" />
      </button>

      <img src={current.src} alt={current.alt} className="relative z-0 max-h-[72vh] max-w-full object-contain rounded-vintiga-md shadow-vintiga-lg" />

      <div className="relative z-10 mt-vintiga-xl flex items-center gap-vintiga-md">
        {images.length > 1 && (
          <button type="button" onClick={prev} aria-label="Previous image" className={ctrl}>
            <BackArrowIcon className="w-5 h-5" />
          </button>
        )}
        <button
          type="button"
          onClick={() => triggerDownload(current.src, fileNameOf(current.src))}
          aria-label="Download image"
          className={ctrl}
        >
          <DownloadIcon className="w-5 h-5" />
        </button>
        {images.length > 1 && (
          <button type="button" onClick={next} aria-label="Next image" className={ctrl}>
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {images.length > 1 && <p className="relative z-10 mt-vintiga-md typo-body-sm text-white/70">{index + 1} / {images.length}</p>}
    </div>
  )
}

// ─── Gallery (one collection) ─────────────────────────────────────────────────

function GalleryView({ collection, onBack }: { collection: ImageCollection; onBack: () => void }) {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [lightbox, setLightbox] = useState<number | null>(null)
  // Session uploads — added via the Upload button (object URLs). Not persisted;
  // to keep them, drop the files into public/brand/imagery/<collection>/.
  const [uploaded, setUploaded] = useState<GalleryImage[]>([])
  const fileInput = useRef<HTMLInputElement>(null)

  const images = [...collection.images, ...uploaded]
  const hasImages = images.length > 0

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? [])
      .filter((f) => f.type.startsWith('image/'))
      .map((f) => ({ src: URL.createObjectURL(f), alt: f.name }))
    if (picked.length) setUploaded((u) => [...u, ...picked])
    e.target.value = ''
  }

  return (
    <>
      <input ref={fileInput} type="file" accept="image/*" multiple className="hidden" onChange={onFiles} />
      <div className="flex items-center justify-between gap-vintiga-md mb-vintiga-lg">
        <div className="flex items-center gap-1.5 min-w-0">
          <button type="button" onClick={onBack} className="typo-title-subsection font-semibold text-vintiga-foreground-muted hover:text-vintiga-foreground transition-colors">
            Imagery
          </button>
          <ChevronRightIcon className="w-4 h-4 text-vintiga-foreground-muted shrink-0" />
          <h1 className="typo-title-subsection font-semibold text-vintiga-foreground truncate">{collection.title}</h1>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            size="lg"
            leftIcon={<UploadIcon />}
            onClick={() => fileInput.current?.click()}
            title="Add images to this session"
            className={HUB_OUTLINE_DARK}
          >
            Upload
          </Button>
          <Button variant="outline" size="lg" leftIcon={<DownloadIcon />} onClick={() => downloadImagesZip(images, collection.slug)} disabled={!hasImages} className={HUB_OUTLINE_DARK}>
            Download zip
          </Button>
          <IconButton
            variant="outline"
            size="lg"
            icon={view === 'grid' ? <LayoutListIcon /> : <Grid2x2Icon />}
            onClick={() => setView((v) => (v === 'grid' ? 'list' : 'grid'))}
            aria-label={view === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
            className={HUB_OUTLINE_DARK}
          />
        </div>
      </div>

      {!hasImages ? (
        <div className="border-2 border-dashed border-vintiga-border rounded-vintiga-card p-vintiga-3xl flex flex-col items-center justify-center text-center gap-vintiga-sm">
          <p className="typo-title-subsection font-semibold text-vintiga-foreground">No images yet</p>
          <p className="typo-body-sm text-vintiga-foreground-muted max-w-md">
            Drop files into <code className="typo-body-sm bg-vintiga-surface-element px-1.5 py-0.5 rounded-vintiga-input">public/brand/imagery/{collection.slug}/</code> and list them in the manifest.
          </p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-vintiga-md">
          {images.map((img, i) => (
            <ImageTile key={img.src} img={img} onClick={() => setLightbox(i)} className="w-full aspect-[4/3]" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-vintiga-sm">
          {images.map((img, i) => (
            <div key={img.src} className="flex items-center gap-vintiga-md p-vintiga-sm border border-vintiga-border rounded-vintiga-card hover:border-vintiga-slate-400 dark:hover:border-vintiga-surface-muted transition-colors">
              <ImageTile img={img} onClick={() => setLightbox(i)} className="w-28 aspect-[4/3] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="typo-body-sm font-semibold text-vintiga-foreground truncate">{fileNameOf(img.src)}</p>
                <p className="typo-caption text-vintiga-foreground-muted truncate">{img.alt}</p>
              </div>
              <IconButton
                variant="outline"
                size="md"
                icon={<DownloadIcon />}
                onClick={() => triggerDownload(img.src, fileNameOf(img.src))}
                aria-label={`Download ${fileNameOf(img.src)}`}
                className={HUB_OUTLINE_DARK}
              />
            </div>
          ))}
        </div>
      )}

      {lightbox !== null && hasImages && (
        <Lightbox images={images} index={lightbox} onIndex={setLightbox} onClose={() => setLightbox(null)} />
      )}
    </>
  )
}

// ─── Collections index ────────────────────────────────────────────────────────

type IndexSort = 'latest' | 'name'

function IndexSortMenu({ value, onChange }: { value: IndexSort; onChange: (v: IndexSort) => void }) {
  const [open, setOpen] = useState(false)
  const options: { key: IndexSort; label: string }[] = [
    { key: 'latest', label: 'Latest' },
    { key: 'name', label: 'Name (A–Z)' },
  ]
  const current = options.find((o) => o.key === value) ?? options[0]
  return (
    <div className="relative">
      <Button variant="outline" size="lg" rightIcon={<ChevronDownIcon />} onClick={() => setOpen((o) => !o)} className={HUB_OUTLINE_DARK}>
        {current.label}
      </Button>
      {open && (
        <>
          <button type="button" aria-hidden="true" tabIndex={-1} onClick={() => setOpen(false)} className="fixed inset-0 z-10 cursor-default" />
          <div className="absolute right-0 mt-1 z-20 min-w-[180px] rounded-vintiga-md border border-vintiga-border bg-vintiga-surface shadow-vintiga-md p-1">
            {options.map((o) => (
              <button
                key={o.key}
                type="button"
                onClick={() => {
                  onChange(o.key)
                  setOpen(false)
                }}
                className={[
                  'w-full text-left px-3 py-2 rounded-vintiga-input typo-body-sm transition-colors',
                  o.key === value ? 'font-semibold text-vintiga-foreground bg-vintiga-surface-element' : 'text-vintiga-foreground-muted hover:bg-vintiga-surface-element',
                ].join(' ')}
              >
                {o.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function CollectionRow({ collection, featured, onOpen }: { collection: ImageCollection; featured: boolean; onOpen: () => void }) {
  const thumbs = collection.images.slice(0, 4)
  return (
    <div
      className={[
        'border rounded-vintiga-card p-vintiga-lg flex gap-vintiga-2xl transition-colors',
        featured
          ? 'bg-vintiga-indigo-50 dark:bg-vintiga-surface border-vintiga-indigo-100 dark:border-vintiga-border hover:border-vintiga-indigo-300 dark:hover:border-vintiga-surface-muted'
          : 'bg-vintiga-surface border-vintiga-border hover:border-vintiga-slate-400 dark:hover:border-vintiga-surface-muted',
      ].join(' ')}
    >
      <div className="w-[280px] shrink-0 flex flex-col gap-vintiga-sm">
        <div className="flex items-center gap-vintiga-sm">
          {collection.surfaces.map((s) => (
            <SurfaceBadge key={s} surface={s} />
          ))}
        </div>
        <h2 className="typo-title-subsection font-semibold text-vintiga-foreground">{collection.title}</h2>
        <p className="typo-body-sm text-vintiga-foreground-muted line-clamp-3">{collection.description}</p>
        <div className="flex flex-wrap gap-1 mt-vintiga-xs">
          {collection.tags.map((t) => (
            <span key={t} className="typo-caption px-2 py-0.5 rounded-full bg-vintiga-surface-element text-vintiga-foreground-muted">#{t}</span>
          ))}
        </div>
        <div className="mt-auto pt-vintiga-md flex items-center justify-between gap-vintiga-sm">
          <div className="flex items-center gap-vintiga-md">
            <button type="button" onClick={onOpen} className="typo-body-sm font-semibold text-vintiga-primary hover:underline">View gallery</button>
            <button
              type="button"
              onClick={() => downloadImagesZip(collection.images, collection.slug)}
              disabled={collection.images.length === 0}
              className="typo-body-sm font-semibold text-vintiga-primary hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
            >
              Download zip
            </button>
          </div>
          <IconButton variant={featured ? 'solid' : 'outline'} size="lg" icon={<ArrowRightIcon />} onClick={onOpen} aria-label={`Open ${collection.title}`} className={featured ? '' : HUB_OUTLINE_DARK} />
        </div>
      </div>

      <div className="flex-1 min-w-0 overflow-x-auto flex items-stretch gap-vintiga-md">
        {thumbs.length > 0 ? (
          thumbs.map((img) => <ImageTile key={img.src} img={img} onClick={onOpen} className="h-[244px] w-[330px] shrink-0" />)
        ) : (
          <div className="w-full min-h-[244px] rounded-vintiga-lg bg-vintiga-surface-element border border-vintiga-border" />
        )}
      </div>
    </div>
  )
}

function IndexView({ onOpen }: { onOpen: (slug: string) => void }) {
  const [sort, setSort] = useState<IndexSort>('latest')
  const [view, setView] = useState<'list' | 'grid'>('list')

  const collections = sort === 'name' ? [...IMAGE_COLLECTIONS].sort((a, b) => a.title.localeCompare(b.title)) : IMAGE_COLLECTIONS

  return (
    <>
      <div className="flex items-center justify-between gap-vintiga-md mb-vintiga-lg">
        <div className="flex items-center gap-1.5 min-w-0">
          <button
            type="button"
            onClick={() => {
              localStorage.setItem('vintiga-hub-segment', 'Brand')
              window.location.hash = '#/'
            }}
            className="typo-title-subsection font-semibold text-vintiga-foreground-muted hover:text-vintiga-foreground transition-colors"
          >
            Brand
          </button>
          <ChevronRightIcon className="w-4 h-4 text-vintiga-foreground-muted shrink-0" />
          <h1 className="typo-title-subsection font-semibold text-vintiga-foreground">Imagery</h1>
        </div>
        <div className="flex items-center gap-3">
          <IndexSortMenu value={sort} onChange={setSort} />
          <IconButton
            variant="outline"
            size="lg"
            icon={view === 'list' ? <Grid2x2Icon /> : <LayoutListIcon />}
            onClick={() => setView((v) => (v === 'list' ? 'grid' : 'list'))}
            aria-label={view === 'list' ? 'Switch to grid view' : 'Switch to list view'}
            className={HUB_OUTLINE_DARK}
          />
        </div>
      </div>

      {view === 'list' ? (
        <div className="flex flex-col gap-vintiga-lg">
          {collections.map((c, i) => (
            <CollectionRow key={c.slug} collection={c} featured={i === 0} onOpen={() => onOpen(c.slug)} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-vintiga-lg">
          {collections.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => onOpen(c.slug)}
              className="text-left bg-vintiga-surface border border-vintiga-border rounded-vintiga-card overflow-hidden hover:border-vintiga-slate-400 dark:hover:border-vintiga-surface-muted transition-colors"
            >
              <div className="aspect-[16/10] bg-vintiga-surface-element">
                {c.images[0] && <ImageTile img={c.images[0]} className="w-full h-full !rounded-none !border-0" />}
              </div>
              <div className="p-vintiga-lg flex flex-col gap-vintiga-xs">
                <div className="flex items-center gap-vintiga-sm">
                  {c.surfaces.map((s) => (
                    <SurfaceBadge key={s} surface={s} />
                  ))}
                </div>
                <h2 className="typo-title-subsection font-semibold text-vintiga-foreground">{c.title}</h2>
                <p className="typo-body-sm text-vintiga-foreground-muted line-clamp-2">{c.description}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  )
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function ImageryScreen() {
  const [dark, setDark] = useState(() => localStorage.getItem('vintiga-hub-dark') === '1')
  useEffect(() => {
    localStorage.setItem('vintiga-hub-dark', dark ? '1' : '0')
  }, [dark])

  const [openSlug, setOpenSlug] = useState<string | null>(null)
  const collection = openSlug ? collectionBySlug(openSlug) : null

  return (
    <div className={`${dark ? 'dark bg-[#0a0a0a] ' : 'bg-vintiga-surface '}h-screen overflow-y-auto font-vintiga-body [scrollbar-gutter:stable]`}>
      <HubNavbar
        dark={dark}
        onToggleDark={() => setDark((d) => !d)}
        segment={'Brand' as Segment}
        onSelectSegment={(s) => {
          localStorage.setItem('vintiga-hub-segment', s)
          window.location.hash = '#/'
        }}
        onOpenUpdates={() => {
          window.location.hash = '#/'
        }}
        search={
          <a
            href="#/"
            className="flex items-center gap-2 h-10 px-3 rounded-vintiga-md border border-vintiga-border bg-vintiga-surface-element text-vintiga-foreground-muted no-underline hover:border-vintiga-surface-muted transition-colors"
          >
            <SearchIcon className="w-4 h-4 shrink-0" />
            <span className="typo-body-sm">Search</span>
          </a>
        }
      />

      <div className="px-vintiga-lg sm:px-vintiga-2xl py-vintiga-xl">
        {collection ? <GalleryView collection={collection} onBack={() => setOpenSlug(null)} /> : <IndexView onOpen={setOpenSlug} />}
      </div>
    </div>
  )
}
