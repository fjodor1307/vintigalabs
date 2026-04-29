import { Fragment, type ReactNode } from 'react'
import { HomeIcon, ChevronRightIcon } from '@ds/icons/Icons'

// ─── Breadcrumb ───────────────────────────────────────────────────────────────
// Standard "Home > Section > Page" trail. Items become `<a>` when `href` is
// provided, otherwise plain text. The last item is the current page — render it
// without `href` so it appears bold and inert.
//
// Usage:
//   <Breadcrumb
//     items={[
//       { icon: <HomeIcon />, href: '#/web/products/list' },
//       { label: 'Products', href: '#/web/products/list' },
//       { label: product.name || 'New product' },
//     ]}
//   />

export interface BreadcrumbItem {
  /** Display label. Optional when `icon` is provided (e.g. home icon). */
  label?: ReactNode
  /** Optional leading icon — typically used on the first item only. */
  icon?: ReactNode
  /** When set, the item renders as an anchor; omit on the current page. */
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={['flex items-center gap-1.5 typo-body-sm', className].join(' ')}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        const content = (
          <>
            {item.icon && <span className="flex items-center [&>svg]:w-4 [&>svg]:h-4">{item.icon}</span>}
            {item.label}
          </>
        )
        return (
          <Fragment key={i}>
            {item.href && !isLast ? (
              <a
                href={item.href}
                className="text-vintiga-slate-500 hover:text-vintiga-slate-700 no-underline flex items-center gap-1.5"
              >
                {content}
              </a>
            ) : (
              <span
                className={[
                  'flex items-center gap-1.5',
                  isLast ? 'text-vintiga-slate-900 font-semibold' : 'text-vintiga-slate-500',
                ].join(' ')}
                aria-current={isLast ? 'page' : undefined}
              >
                {content}
              </span>
            )}
            {!isLast && <ChevronRightIcon className="w-3.5 h-3.5 text-vintiga-slate-400" />}
          </Fragment>
        )
      })}
    </nav>
  )
}

// Re-export the home icon as a small convenience so callers don't need to
// pull it from `@ds/icons/Icons` themselves for the most common first item.
export const BreadcrumbHomeIcon = HomeIcon
