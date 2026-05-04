import type { ReactNode } from 'react'

// ─── ClubCard ─────────────────────────────────────────────────────────────────
// Bordered media-rich list row with a 96 px square image, title, tag cluster,
// single-line meta, and a trailing kebab. Built from Figma 5636:24752 with
// State=Default and State=Hover variants. Originally for the Clubs surface,
// but generic enough to use for any "catalogue list with imagery" pattern
// (Campaigns, Curated Collections, Gift Boxes, etc.).
//
// Layout (Figma-accurate — 1112 × 128 px @ default):
//   ┌──────┬────────────────────────────────────────────────┬────┐
//   │ img  │ title                                  ⋯       │
//   │ 96px │ [tag] [tag]                                    │
//   │      │ meta line                                       │
//   └──────┴────────────────────────────────────────────────┴────┘
//
// Stack rows in a `flex-col gap-vintiga-md` container — each row owns its
// border + radius and lights up on hover (slate-50 bg, slate-400 border).
//
// Usage:
//   <ClubCard
//     image={<img src={c.imageUrl} alt="" className="w-full h-full object-cover" />}
//     title="C7"
//     tags={[
//       <Tag tone="info">Commerce7</Tag>,
//       <Tag tone="violet">Traditional</Tag>,
//     ]}
//     meta="10 Active | 2 On-hold | 2 New | 1 Canceled"
//     onClick={() => navigate(`#/web/clubs/${c.slug}`)}
//     action={<PopoverMenu …/>}
//   />

export interface ClubCardProps {
  /** Rendered into the 96×96 leading slot. Pass an `<img>`, an icon, or any node — the slot clips with `overflow-hidden` and uses rounded-lg. */
  image?: ReactNode
  /** Required title — 18 px / `font-semibold` / slate-900. */
  title: ReactNode
  /** Optional cluster of `<Tag>`s rendered under the title. */
  tags?: ReactNode[]
  /** Single-line meta string under the tags (e.g. "10 Active | 2 On-hold"). */
  meta?: ReactNode
  /** Trailing action — typically a `<PopoverMenu>` with a kebab trigger. */
  action?: ReactNode
  /** Whole-row click target. Renders the row as a `role="link"` with hover styling. */
  onClick?: () => void
  className?: string
}

export function ClubCard({
  image,
  title,
  tags,
  meta,
  action,
  onClick,
  className = '',
}: ClubCardProps) {
  const interactive = !!onClick

  return (
    <div
      role={interactive ? 'link' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick?.()
              }
            }
          : undefined
      }
      className={[
        'flex items-stretch gap-vintiga-md p-vintiga-md',
        'bg-vintiga-white border border-vintiga-slate-200 rounded-vintiga-xl',
        'transition-colors',
        interactive
          ? 'hover:bg-vintiga-slate-50 hover:border-vintiga-slate-400 cursor-pointer'
          : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* 96 × 96 thumb */}
      {image && (
        <div className="w-24 h-24 rounded-vintiga-lg bg-vintiga-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
          {image}
        </div>
      )}

      {/* Body */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-vintiga-xs">
        <div className="flex items-start justify-between gap-vintiga-md w-full">
          <div className="flex flex-col gap-vintiga-xs min-w-0 flex-1">
            <h3 className="text-lg leading-7 font-semibold text-vintiga-slate-900 truncate">
              {title}
            </h3>
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1">
                {tags.map((t, i) => (
                  <span key={i} className="inline-flex">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
          {action && (
            <div
              className="shrink-0"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              {action}
            </div>
          )}
        </div>
        {meta && (
          <p className="typo-body-sm font-medium text-vintiga-slate-500 mt-vintiga-sm">
            {meta}
          </p>
        )}
      </div>
    </div>
  )
}
