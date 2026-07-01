// Brand → Imagery. A marketing image library: a list of collections, each
// opening into a grid/list gallery with a lightbox carousel and downloads
// (per-image + zip). Data comes from `imageryData.ts`; files live in
// `public/brand/imagery/`.

import { useState, useEffect, useCallback } from 'react'
import {
  BackArrowIcon,
  DownloadIcon,
  Grid2x2Icon,
  LayoutListIcon,
  XIcon,
  ArrowRightIcon,
} from '@ds/icons/Icons'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
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

async function downloadCollectionZip(collection: ImageCollection) {
  const { default: JSZip } = await import('jszip')
  const zip = new JSZip()
  let added = 0
  for (const img of collection.images) {
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
  triggerDownload(url, `${collection.slug}.zip`)
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
function ImageTile({
  img,
  onClick,
  aspect = 'aspect-[4/3]',
}: {
  img: GalleryImage
  onClick?: () => void
  aspect?: string
}) {
  const [failed, setFailed] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={img.alt}
      className={`group relative block w-full ${aspect} overflow-hidden rounded-vintiga-lg bg-vintiga-surface-element border border-vintiga-border`}
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
  const prev = useCallback(() => onIndex((index - 1 + images.length) % images.length), [index, images.length, onIndex])
  const next = useCallback(() => onIndex((index + 1) % images.length), [index, images.length, onIndex])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next, onClose])

  if (!current) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-vintiga-lg">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/85 cursor-default" />
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-vintiga-lg right-vintiga-lg z-10 inline-flex items-center justify-center w-10 h-10 rounded-vintiga-md bg-white text-vintiga-slate-700 hover:bg-vintiga-slate-100 transition-colors shadow-vintiga-sm"
      >
        <XIcon className="w-5 h-5" />
      </button>

      <img
        src={current.src}
        alt={current.alt}
        className="relative z-0 max-h-[72vh] max-w-full object-contain rounded-vintiga-md shadow-vintiga-lg"
      />

      <div className="relative z-10 mt-vintiga-xl flex items-center gap-vintiga-md">
        {images.length > 1 && (
          <button
            type="button"
            onClick={prev}
            aria-label="Previous image"
            className="inline-flex items-center justify-center w-11 h-11 rounded-vintiga-md bg-white text-vintiga-slate-700 hover:bg-vintiga-slate-100 transition-colors shadow-vintiga-sm"
          >
            <BackArrowIcon className="w-5 h-5" />
          </button>
        )}
        <button
          type="button"
          onClick={() => triggerDownload(current.src, fileNameOf(current.src))}
          aria-label="Download image"
          className="inline-flex items-center justify-center w-11 h-11 rounded-vintiga-md bg-white text-vintiga-slate-700 hover:bg-vintiga-slate-100 transition-colors shadow-vintiga-sm"
        >
          <DownloadIcon className="w-5 h-5" />
        </button>
        {images.length > 1 && (
          <button
            type="button"
            onClick={next}
            aria-label="Next image"
            className="inline-flex items-center justify-center w-11 h-11 rounded-vintiga-md bg-white text-vintiga-slate-700 hover:bg-vintiga-slate-100 transition-colors shadow-vintiga-sm"
          >
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {images.length > 1 && (
        <p className="relative z-10 mt-vintiga-md typo-body-sm text-white/70">
          {index + 1} / {images.length}
        </p>
      )}
    </div>
  )
}

// ─── Gallery (one collection) ─────────────────────────────────────────────────

function GalleryView({ collection }: { collection: ImageCollection }) {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [lightbox, setLightbox] = useState<number | null>(null)
  const hasImages = collection.images.length > 0

  return (
    <>
      <div className="flex items-center justify-between gap-vintiga-md mb-vintiga-lg">
        <h1 className="typo-title-subsection font-semibold text-vintiga-foreground">{collection.title}</h1>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="lg"
            leftIcon={<DownloadIcon />}
            onClick={() => downloadCollectionZip(collection)}
            disabled={!hasImages}
          >
            Download zip
          </Button>
          <IconButton
            variant="outline"
            size="lg"
            icon={view === 'grid' ? <LayoutListIcon /> : <Grid2x2Icon />}
            onClick={() => setView((v) => (v === 'grid' ? 'list' : 'grid'))}
            aria-label={view === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
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
          {collection.images.map((img, i) => (
            <ImageTile key={img.src} img={img} onClick={() => setLightbox(i)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-vintiga-sm">
          {collection.images.map((img, i) => (
            <div
              key={img.src}
              className="flex items-center gap-vintiga-md p-vintiga-sm border border-vintiga-border rounded-vintiga-card hover:border-vintiga-slate-400 transition-colors"
            >
              <div className="w-24 shrink-0">
                <ImageTile img={img} onClick={() => setLightbox(i)} aspect="aspect-[4/3]" />
              </div>
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
              />
            </div>
          ))}
        </div>
      )}

      {lightbox !== null && hasImages && (
        <Lightbox images={collection.images} index={lightbox} onIndex={setLightbox} onClose={() => setLightbox(null)} />
      )}
    </>
  )
}

// ─── Collections index ────────────────────────────────────────────────────────

function IndexView({ onOpen }: { onOpen: (slug: string) => void }) {
  return (
    <>
      <h1 className="typo-title-subsection font-semibold text-vintiga-foreground mb-vintiga-lg">Imagery</h1>
      <div className="flex flex-col gap-vintiga-lg">
        {IMAGE_COLLECTIONS.map((c, i) => {
          const featured = i === 0
          const thumbs = c.images.slice(0, 4)
          return (
            <div
              key={c.slug}
              className={[
                'border rounded-vintiga-card p-vintiga-lg flex gap-vintiga-2xl transition-colors',
                featured
                  ? 'bg-vintiga-indigo-50 border-vintiga-indigo-100 hover:border-vintiga-indigo-300'
                  : 'bg-vintiga-surface border-vintiga-border hover:border-vintiga-slate-400',
              ].join(' ')}
            >
              <div className="w-[280px] shrink-0 flex flex-col gap-vintiga-sm">
                <div className="flex items-center gap-vintiga-sm">
                  {c.surfaces.map((s) => (
                    <SurfaceBadge key={s} surface={s} />
                  ))}
                </div>
                <h2 className="typo-title-subsection font-semibold text-vintiga-foreground">{c.title}</h2>
                <p className="typo-body-sm text-vintiga-foreground-muted line-clamp-3">{c.description}</p>
                <div className="flex flex-wrap gap-1 mt-vintiga-xs">
                  {c.tags.map((t) => (
                    <span key={t} className="typo-caption px-2 py-0.5 rounded-full bg-vintiga-surface-element text-vintiga-foreground-muted">
                      #{t}
                    </span>
                  ))}
                </div>
                <div className="mt-auto pt-vintiga-md flex items-center justify-between gap-vintiga-sm">
                  <div className="flex items-center gap-vintiga-md">
                    <button
                      type="button"
                      onClick={() => onOpen(c.slug)}
                      className="typo-body-sm font-semibold text-vintiga-primary hover:underline"
                    >
                      View gallery
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadCollectionZip(c)}
                      disabled={c.images.length === 0}
                      className="typo-body-sm font-semibold text-vintiga-primary hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
                    >
                      Download zip
                    </button>
                  </div>
                  <IconButton
                    variant={featured ? 'solid' : 'outline'}
                    size="lg"
                    icon={<ArrowRightIcon />}
                    onClick={() => onOpen(c.slug)}
                    aria-label={`Open ${c.title}`}
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0 overflow-x-auto flex items-center gap-vintiga-md">
                {thumbs.length > 0 ? (
                  thumbs.map((img) => (
                    <div key={img.src} className="w-[220px] shrink-0">
                      <ImageTile img={img} onClick={() => onOpen(c.slug)} aspect="aspect-[16/10]" />
                    </div>
                  ))
                ) : (
                  <div className="w-full h-[140px] rounded-vintiga-lg bg-vintiga-surface-element border border-vintiga-border" />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function ImageryScreen() {
  const [openSlug, setOpenSlug] = useState<string | null>(null)
  const collection = openSlug ? collectionBySlug(openSlug) : null

  return (
    <div className="min-h-screen h-screen overflow-y-auto bg-vintiga-surface font-vintiga-body">
      <header className="sticky top-0 z-30 flex items-center h-16 px-vintiga-lg sm:px-vintiga-2xl bg-vintiga-surface/75 backdrop-blur-md">
        {collection ? (
          <button
            type="button"
            onClick={() => setOpenSlug(null)}
            className="inline-flex items-center gap-1.5 typo-body-sm font-semibold text-vintiga-foreground-muted hover:text-vintiga-foreground transition-colors"
          >
            <BackArrowIcon className="w-4 h-4" />
            Imagery
          </button>
        ) : (
          <a
            href="#/"
            className="inline-flex items-center gap-1.5 typo-body-sm font-semibold text-vintiga-foreground-muted hover:text-vintiga-foreground transition-colors no-underline"
          >
            <BackArrowIcon className="w-4 h-4" />
            Back to hub
          </a>
        )}
      </header>

      <div className="px-vintiga-lg sm:px-vintiga-2xl py-vintiga-xl">
        {collection ? <GalleryView collection={collection} /> : <IndexView onOpen={setOpenSlug} />}
      </div>
    </div>
  )
}
