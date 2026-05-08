import type { ReactNode } from 'react'

// ─── CustomerCard ─────────────────────────────────────────────────────────────
// Bordered card used as the lead card on a customer-centric drill-down (e.g.
// a membership detail, a customer profile, an order's customer summary).
//
// Layout:
//   ┌──────────────────────────────────────────────────────────────┐
//   │ [Avatar]  Name                                  [Actions →]  │
//   │           Subtitle (optional — e.g. club link)               │
//   │           Tags (optional)                                    │
//   │           Details (optional — multi-line contact / meta)     │
//   └──────────────────────────────────────────────────────────────┘
//
// Slots are intentionally generic so the consumer can compose anything they
// need (badge overlays on the avatar, custom links, age-verified flags, etc.).
//
// Usage:
//   <CustomerCard
//     avatar={<Avatar name={m.name} src={m.avatarUrl} size="lg" />}
//     name={m.name}
//     subtitle={<a href={…}><IdCardIcon /> {clubName}</a>}
//     tags={<><Tag>VIP</Tag><Tag>Wine Club</Tag></>}
//     details={
//       <>
//         <span>{m.email} <span className="text-vintiga-slate-500">| Preferred</span></span>
//         <span>{m.city} {m.zip}</span>
//       </>
//     }
//     actions={
//       <>
//         <Button variant="outline">Customer Details</Button>
//         <IconButton variant="outline" icon={<EllipsisVerticalIcon />} />
//       </>
//     }
//   />

export interface CustomerCardProps {
  /** Avatar element. Caller is responsible for size + any overlay badges. */
  avatar: ReactNode
  /** Customer name (renders as an h2). */
  name: ReactNode
  /** Optional row below the name — e.g. a club link, organisation, or role. */
  subtitle?: ReactNode
  /** Optional tag row (audience tags, segments, etc.). */
  tags?: ReactNode
  /** Optional multi-line details block — each child renders on its own line. */
  details?: ReactNode
  /**
   * Optional actions slot, anchored to the top-right of the card.
   * Children render side-by-side with `gap-vintiga-sm` — drop in 1+ Buttons /
   * IconButtons / a PopoverMenu trigger to form a button group.
   */
  actions?: ReactNode
  className?: string
}

export function CustomerCard({
  avatar,
  name,
  subtitle,
  tags,
  details,
  actions,
  className = '',
}: CustomerCardProps) {
  return (
    <section
      className={[
        'border border-vintiga-slate-200 rounded-vintiga-xl bg-vintiga-white p-vintiga-lg',
        className,
      ].join(' ')}
    >
      <div className="flex items-start gap-vintiga-md">
        <div className="shrink-0">{avatar}</div>

        <div className="flex-1 min-w-0 flex flex-col gap-vintiga-sm">
          <h2 className="typo-title-section font-semibold text-vintiga-slate-900">{name}</h2>
          {subtitle}
          {tags}
          {details && (
            <div className="flex flex-col typo-body-sm text-vintiga-slate-700 leading-relaxed pt-vintiga-xs">
              {details}
            </div>
          )}
        </div>

        {actions && (
          <div className="shrink-0 flex items-center gap-vintiga-sm">
            {actions}
          </div>
        )}
      </div>
    </section>
  )
}
