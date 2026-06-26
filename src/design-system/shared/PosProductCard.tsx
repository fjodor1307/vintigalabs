// ─── PosProductCard ──────────────────────────────────────────────────────────
// Product tile for the POS app (Figma 2955:6142 "Card"). A square photo tile
// with a frosted-glass info panel (name · price · volume) over the bottom edge.

export function PosProductCard({
  name,
  price,
  volume,
  image,
  onClick,
}: {
  name: string
  price: string
  /** Right-aligned secondary detail, e.g. "750ml". */
  volume?: string
  image?: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Add ${name}`}
      className="relative aspect-square w-full overflow-hidden rounded-vintiga-lg border border-vintiga-slate-200 bg-vintiga-white text-left transition-transform active:scale-[0.98]"
    >
      {image && (
        <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      )}
      <div className="absolute inset-x-0.5 bottom-0.5 rounded-vintiga-md bg-white/60 backdrop-blur-md px-2 py-2 flex flex-col gap-1.5">
        <span className="block typo-body-sm text-vintiga-slate-900 truncate">{name}</span>
        <div className="flex items-center justify-between typo-body-sm text-vintiga-slate-900">
          <span>{price}</span>
          {volume && <span className="text-vintiga-slate-500">{volume}</span>}
        </div>
      </div>
    </button>
  )
}
