import { Children, type ReactNode } from 'react'

// ─── RecordsCard ──────────────────────────────────────────────────────────────
// Bordered card with a titled header (title · subtitle · trailing action) and
// stacked record rows separated by top borders. Built for surfaces like a
// customer's Payment Methods or saved Addresses — anywhere you have a header
// + "Add" button + a list of like-shaped rows that come from the same
// collection.
//
// Each direct child of `children` becomes a row; the card injects the divider
// on top of every row automatically. Rows control their own padding so they
// can vary (a payment-method row is denser than a multi-line address row).
//
// If `empty` is provided and `children` is empty, the empty slot renders
// inside its own bordered cell.
//
// Usage:
//   <RecordsCard
//     title="Payment Methods"
//     subtitle="Manage your payment information"
//     action={<Button leftIcon={<PlusIcon />}>Add</Button>}
//     empty={<RecordsCardEmpty title="No payment methods" hint="Add a card to enable one-click checkout." />}
//   >
//     {methods.map((m) => <PaymentMethodRow key={m.id} method={m} />)}
//   </RecordsCard>

export interface RecordsCardProps {
  title: ReactNode
  subtitle?: ReactNode
  /** Optional leading icon next to the title (16–20 px). */
  icon?: ReactNode
  /** Trailing slot in the header — typical: an outline "Add" button. */
  action?: ReactNode
  /** Rendered inside its own bordered cell when no children are supplied. */
  empty?: ReactNode
  /**
   * Default `true` — every direct child of `children` gets an auto top-border
   * so the card reads as a list of stacked records (Payment Methods,
   * Addresses, etc.). Set to `false` for surfaces where children bring their
   * own structure (a Table, a toolbar + Table, etc.); the body then gets
   * normal `px-vintiga-lg pb-vintiga-lg` padding with a `gap-vintiga-md`
   * column flow.
   */
  divider?: boolean
  children?: ReactNode
  className?: string
}

export function RecordsCard({
  title,
  subtitle,
  icon,
  action,
  empty,
  divider = true,
  children,
  className = '',
}: RecordsCardProps) {
  const hasRows = Children.count(children) > 0

  return (
    <section
      className={[
        'border border-vintiga-slate-200 rounded-vintiga-xl bg-vintiga-white overflow-hidden',
        className,
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-vintiga-md p-vintiga-md">
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="typo-title-section font-semibold text-vintiga-slate-900 inline-flex items-center gap-vintiga-sm">
            {icon && <span className="text-vintiga-slate-500 [&>svg]:w-5 [&>svg]:h-5">{icon}</span>}
            {title}
          </h3>
          {subtitle && (
            <p className="typo-body-sm text-vintiga-slate-500">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      {hasRows ? (
        divider ? (
          <div className="[&>*]:border-t [&>*]:border-vintiga-slate-200">
            {children}
          </div>
        ) : (
          <div className="border-t border-vintiga-slate-200 px-vintiga-lg py-vintiga-lg flex flex-col gap-vintiga-md">
            {children}
          </div>
        )
      ) : empty ? (
        <div className="border-t border-vintiga-slate-200 px-vintiga-lg py-vintiga-xl">
          {empty}
        </div>
      ) : null}
    </section>
  )
}

// ─── RecordsCardEmpty ─────────────────────────────────────────────────────────
// Centered title + hint pair for the `empty` slot. Optional — consumers can
// pass any node; this just removes boilerplate for the common case.

export interface RecordsCardEmptyProps {
  title: ReactNode
  hint?: ReactNode
}

export function RecordsCardEmpty({ title, hint }: RecordsCardEmptyProps) {
  return (
    <div className="text-center">
      <p className="typo-body-sm font-semibold text-vintiga-slate-900">{title}</p>
      {hint && <p className="typo-caption text-vintiga-slate-500 mt-1">{hint}</p>}
    </div>
  )
}
