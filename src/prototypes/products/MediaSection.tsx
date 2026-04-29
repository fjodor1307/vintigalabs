import { useRef } from 'react'
import { useProductState, productActions } from './productStore'
import { SectionCard } from './ProductLayout'
import { Button } from '@ds/shared/Button'
import { UploadIcon, XIcon, ImageIcon } from '@ds/icons/Icons'

// ─── MediaSection ─────────────────────────────────────────────────────────────
// Lives in the main column of the product editor (not the right rail) —
// images deserve the room. Header has a single "Upload" action; body is a
// 4-col grid where the first image reads as the primary thumbnail and the
// rest are secondary.

export function MediaSection() {
  const product = useProductState()
  const fileInput = useRef<HTMLInputElement>(null)

  function openPicker() { fileInput.current?.click() }
  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    files.forEach((f) => productActions.addImage(f))
    e.target.value = ''
  }

  const hasImages = product.images.length > 0

  return (
    <SectionCard
      title="Media"
      action={
        <Button variant="outline" size="lg" leftIcon={<UploadIcon />} onClick={openPicker}>
          Upload
        </Button>
      }
    >
      {hasImages ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-vintiga-sm">
          {product.images.map((img, i) => (
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
                onClick={() => productActions.removeImage(img.id)}
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
            className="aspect-square rounded-vintiga-md border-2 border-dashed border-vintiga-slate-300 bg-vintiga-white flex flex-col items-center justify-center gap-1.5 hover:border-vintiga-indigo-500 hover:bg-vintiga-indigo-50 transition-colors cursor-pointer"
          >
            <UploadIcon className="w-5 h-5 text-vintiga-slate-500" />
            <span className="typo-caption text-vintiga-slate-500">Drop or upload</span>
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
        accept="image/*"
        multiple
        className="hidden"
        onChange={onFiles}
      />
    </SectionCard>
  )
}
