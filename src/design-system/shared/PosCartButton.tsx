import { ShoppingCartIcon } from '@ds/icons/Icons'

// ─── PosCartButton ───────────────────────────────────────────────────────────
// Floating cart button for the POS app (Figma 2955:6123 "cart"). A circular
// elevated button with the cart glyph and a red count badge.

export function PosCartButton({
  count = 0,
  onClick,
}: {
  count?: number
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}
      className="relative w-16 h-16 rounded-full bg-vintiga-white border border-vintiga-slate-100 shadow-vintiga-xl flex items-center justify-center transition-transform active:scale-95"
    >
      <ShoppingCartIcon className="w-6 h-6 text-vintiga-slate-700" />
      {count > 0 && (
        <span className="absolute -bottom-1 -right-1 min-w-[22px] h-[22px] px-1 inline-flex items-center justify-center rounded-full bg-vintiga-red-500 text-vintiga-white typo-caption font-semibold ring-2 ring-vintiga-white">
          {count}
        </span>
      )}
    </button>
  )
}
