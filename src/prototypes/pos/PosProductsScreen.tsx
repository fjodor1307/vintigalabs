import { useMemo, useState } from 'react'
import { StatusBar } from '@ds/shared/StatusBar'
import { PosNavbar } from '@ds/shared/PosNavbar'
import { PosTabBar } from '@ds/shared/PosTabBar'
import { PosCartButton } from '@ds/shared/PosCartButton'
import { PosProductCard } from '@ds/shared/PosProductCard'
import { POS_PRODUCTS } from './posSamples'

// ─── PosProductsScreen ───────────────────────────────────────────────────────
// First POS screen (Figma 2768:1906). The "Current Release" catalog built from
// the POS design-system components: status bar → search navbar → tap-to-add
// product grid → floating cart + tab bar. Tapping any product adds it to the
// cart and bumps the live counter (1, 2, 3 …).

export function PosProductsScreen() {
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState(0)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return POS_PRODUCTS
    return POS_PRODUCTS.filter((p) => p.name.toLowerCase().includes(q))
  }, [query])

  return (
    <div className="relative h-full flex flex-col bg-vintiga-surface overflow-hidden">
      <StatusBar />
      <PosNavbar value={query} onChange={setQuery} />

      {/* Catalog — padded at the bottom to clear the floating cart + tab bar. */}
      <div className="flex-1 overflow-y-auto px-vintiga-md pb-[132px]">
        <h2 className="typo-title-section font-semibold text-vintiga-slate-900 py-vintiga-md">
          Current Release
        </h2>
        {results.length > 0 ? (
          <div className="grid grid-cols-2 gap-vintiga-md">
            {results.map((p) => (
              <PosProductCard
                key={p.id}
                name={p.name}
                price={p.price}
                volume={p.volume}
                image={p.image}
                onClick={() => setCart((c) => c + 1)}
              />
            ))}
          </div>
        ) : (
          <p className="typo-body-sm text-vintiga-slate-500 text-center py-vintiga-2xl">
            No products match “{query}”.
          </p>
        )}
      </div>

      {/* Floating cart — count starts at 0 and climbs as products are tapped. */}
      <div className="absolute right-4 bottom-[84px] z-20">
        <PosCartButton count={cart} onClick={() => {}} />
      </div>

      {/* Floating tab bar */}
      <div className="absolute bottom-3 left-4 right-4 z-20">
        <PosTabBar active={0} />
      </div>
    </div>
  )
}
