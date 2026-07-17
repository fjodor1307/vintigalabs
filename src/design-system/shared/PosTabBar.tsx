import type { ComponentType } from 'react'
import {
  TagIcon,
  FileTextIcon,
  UserIcon,
  CalendarIcon,
  WalletIcon,
  EllipsisIcon,
} from '@ds/icons/Icons'

// ─── PosTabBar ───────────────────────────────────────────────────────────────
// Floating glass tab bar for the POS app (Figma 2955:6081 "tab-bar"). Six
// icon tabs; the active one floats in a white pill with the indigo accent, the
// rest read as muted slate on a frosted light bar. Adapted from the iOS 26
// "liquid glass" tab bar to Vintiga tokens.

type PosTab = {
  key: string
  label: string
  Icon: ComponentType<{ className?: string }>
}

const POS_TABS: PosTab[] = [
  { key: 'catalog',   label: 'Catalog',      Icon: TagIcon },
  { key: 'orders',    label: 'Orders',       Icon: FileTextIcon },
  { key: 'customers', label: 'Customers',    Icon: UserIcon },
  { key: 'calendar',  label: 'Reservations', Icon: CalendarIcon },
  { key: 'wallet',    label: 'Payments',     Icon: WalletIcon },
  { key: 'more',      label: 'More',         Icon: EllipsisIcon },
]

export function PosTabBar({
  active = 0,
  onSelect,
}: {
  /** Index of the active tab. */
  active?: number
  onSelect?: (index: number) => void
}) {
  return (
    <nav
      aria-label="POS sections"
      className="flex items-center gap-1 rounded-full bg-vintiga-slate-100/90 backdrop-blur border border-white/70 px-1.5 py-1.5 shadow-vintiga-md"
    >
      {POS_TABS.map((tab, i) => {
        const isActive = i === active
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onSelect?.(i)}
            aria-label={tab.label}
            aria-current={isActive ? 'page' : undefined}
            className={[
              'flex-1 h-11 rounded-full flex items-center justify-center transition-colors',
              isActive
                ? 'bg-vintiga-white shadow-vintiga-sm text-vintiga-indigo-500'
                : 'text-vintiga-slate-600 hover:text-vintiga-slate-900',
            ].join(' ')}
          >
            <tab.Icon className="w-5 h-5" />
          </button>
        )
      })}
    </nav>
  )
}
