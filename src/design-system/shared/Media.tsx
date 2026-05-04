import { useRef, type ReactNode } from 'react'
import { SectionCard } from '@ds/shared/SectionCard'
import { Button } from '@ds/shared/Button'
import { UploadIcon, XIcon, ImageIcon } from '@ds/icons/Icons'

// ─── Media ────────────────────────────────────────────────────────────────────
// Image library section — header with title + Upload button, body with a 4-col
// grid of image tiles. The first tile carries a "Primary" badge; the trailing
// tile is always a dashed dropzone. When the library is empty, the body
// collapses to a single full-width dropzone with empty-state copy.
//
// Promoted from `products/MediaSection.tsx` so other prototypes (Clubs,
// Campaigns, …) can share the same upload UX.
//
// Two ways to use:
//
// 1. With the default SectionCard wrapper (most common):
//      <Media items={images} onUpload={addImages} onRemove={removeImage} />
//
// 2. Bare grid only — drop into a `<Field>` inside an existing `<SectionCard>`:
//      <Media variant="bare" items={images} onUpload={…} onRemove={…} />

export interface MediaItem {
  id: string
  url: string
  name: string
}

export interface MediaProps {
  items: MediaItem[]
  onUpload: (files: File[]) => void
  onRemove: (id: string) => void
  /** SectionCard title. Default "Media". Ignored when `variant="bare"`. */
  title?: ReactNode
  /** Override the default Upload button (e.g. to add an "Edit" toggle). */
  action?: ReactNode
  /** "card" wraps in `<SectionCard>`; "bare" renders just the grid. */
  variant?: 'card' | 'bare'
  /** Accepted file types for the underlying `<input>`. Default: image/*. */
  accept?: string
  /** Allow picking multiple files at once. Default: true. */
  multiple?: boolean
  className?: string
}

export function Media({
  items,
  onUpload,
  onRemove,
  title = 'Media',
  action,
  variant = 'card',
  accept = 'image/*',
  multiple = true,
  className = '',
}: MediaProps) {
  const fileInput = useRef<HTMLInputElement>(null)

  function openPicker() {
    fileInput.current?.click()
  }

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length > 0) onUpload(files)
    e.target.value = ''
  }

  const hasItems = items.length > 0

  const grid = (
    <>
      {hasItems ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-vintiga-sm">
          {items.map((img, i) => (
            <div
              key={img.id}
              className="relative aspect-square rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-slate-50 overflow-hidden group"
            >
              <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
              {i === 0 && (
                <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-vintiga-slate-900/80 text-vintiga-white typo-caption font-medium">
                  Primary
                </span>
              )}
              <button
                type="button"
                onClick={() => onRemove(img.id)}
                aria-label={`Remove ${img.name}`}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-vintiga-white shadow-vintiga-sm border border-vintiga-slate-200 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XIcon className="w-3.5 h-3.5 text-vintiga-slate-700" />
              </button>
            </div>
          ))}

          {/* Trailing dropzone tile */}
          <button
            type="button"
            onClick={openPicker}
            className="aspect-square rounded-vintiga-md border-2 border-dashed border-vintiga-indigo-300 bg-vintiga-indigo-50/40 flex flex-col items-center justify-center gap-1.5 hover:border-vintiga-indigo-500 hover:bg-vintiga-indigo-50 transition-colors cursor-pointer"
          >
            <UploadIcon className="w-5 h-5 text-vintiga-indigo-500" />
            <span className="typo-caption text-vintiga-indigo-700 font-medium">Drop or upload</span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          className="w-full min-h-[180px] rounded-vintiga-md border-2 border-dashed border-vintiga-slate-300 bg-vintiga-white flex flex-col items-center justify-center gap-vintiga-sm hover:border-vintiga-indigo-500 hover:bg-vintiga-indigo-50 transition-colors cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-vintiga-slate-100 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-vintiga-slate-500" />
          </div>
          <p className="typo-body-sm font-medium text-vintiga-slate-900">No media yet</p>
          <p className="typo-caption text-vintiga-slate-500 max-w-[280px] text-center">
            Drag a file here or click to upload from your device.
          </p>
        </button>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInput}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={onFiles}
      />
    </>
  )

  if (variant === 'bare') {
    return <div className={className}>{grid}</div>
  }

  return (
    <SectionCard
      title={title}
      className={className}
      action={
        action ?? (
          <Button variant="outline" size="lg" leftIcon={<UploadIcon />} onClick={openPicker}>
            Upload
          </Button>
        )
      }
    >
      {grid}
    </SectionCard>
  )
}
