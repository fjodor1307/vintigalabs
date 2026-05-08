// ─── CardBrandLogo ────────────────────────────────────────────────────────────
// Small inline payment-card brand logos for use next to masked card numbers in
// payment-method lists. Rendered as a 56×36 card-shaped tile with a faint
// border so the logo reads cleanly against any surface (white card, soft grey
// surface, etc.).
//
// Mastercard ships as a properly drawn pair of overlapping circles (red +
// yellow with the orange overlap clipped from the right circle). The other
// brands fall back to a neutral chip with the brand name until artwork is
// supplied.
//
// Usage:
//   <CardBrandLogo brand="mastercard" />

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover'

const BRAND_LABEL: Record<CardBrand, string> = {
  visa:       'Visa',
  mastercard: 'Mastercard',
  amex:       'Amex',
  discover:   'Discover',
}

export interface CardBrandLogoProps {
  brand: CardBrand
  className?: string
}

export function CardBrandLogo({ brand, className }: CardBrandLogoProps) {
  if (brand === 'mastercard') {
    return (
      <svg
        width="56"
        height="36"
        viewBox="0 0 56 36"
        aria-label="Mastercard"
        role="img"
        className={className}
      >
        <rect x="0.5" y="0.5" width="55" height="35" rx="5" fill="white" stroke="#E5E7EB" />
        <defs>
          <clipPath id="card-brand-mc-left">
            <circle cx="24" cy="18" r="9" />
          </clipPath>
        </defs>
        <circle cx="24" cy="18" r="9" fill="#EB001B" />
        <circle cx="32" cy="18" r="9" fill="#F79E1B" />
        <circle cx="32" cy="18" r="9" fill="#FF5F00" clipPath="url(#card-brand-mc-left)" />
      </svg>
    )
  }

  return (
    <div
      role="img"
      aria-label={BRAND_LABEL[brand]}
      className={[
        'w-14 h-9 rounded-[5px] border border-vintiga-slate-200 bg-vintiga-white inline-flex items-center justify-center typo-caption font-semibold text-vintiga-slate-700',
        className ?? '',
      ].join(' ')}
    >
      {BRAND_LABEL[brand]}
    </div>
  )
}
