import { useState } from 'react'
import type { ReactNode } from 'react'
import { ChevronDownIcon } from '@ds/icons/Icons'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BottomSheetItem {
  /** Unique key for this accordion row */
  id: string
  /** Question / row label */
  question: string
  /** Expanded content — any ReactNode */
  content: ReactNode
}

export interface BottomSheetProps {
  /** Whether the sheet is visible */
  isOpen: boolean
  /** Called when the backdrop is tapped */
  onClose: () => void
  /** Large display heading (FT Polar). Default: 'Need help?' */
  title?: string
  /** Muted subtitle below the heading */
  subtitle?: string
  /** Accordion rows. Defaults to DEFAULT_HELP_ITEMS when omitted */
  items?: BottomSheetItem[]
  /** Label for the primary CTA button */
  ctaLabel?: string
  /** href for the CTA — renders an <a> when provided */
  ctaHref?: string
  /** onClick for the CTA — used when no href */
  onCta?: () => void
}

// ─── Default FAQ items (shared across all onboarding screens) ─────────────────

// eslint-disable-next-line react-refresh/only-export-components
export const DEFAULT_HELP_ITEMS: BottomSheetItem[] = [
  {
    id: 'eligible',
    question: 'Am I eligible to apply?',
    content: (
      <ul className="list-disc pl-5 flex flex-col gap-1 text-[16px] font-light text-vintiga-slate-700 leading-6 tracking-[0.08px]">
        <li>
          You can apply if your business:
          <ul className="list-disc pl-5 flex flex-col gap-1 mt-1">
            <li>Is a UK-registered limited company</li>
            <li>Has at least one UK-resident director</li>
            <li>Is trading or preparing to trade</li>
          </ul>
        </li>
        <li>Some business types aren't currently supported.</li>
        <li>
          <a href="#" className="text-vintiga-primary underline decoration-solid">
            See full eligibility criteria
          </a>
        </li>
      </ul>
    ),
  },
  {
    id: 'contact',
    question: 'How to contact us?',
    content: (
      <div className="flex flex-col gap-4 text-[16px] font-light text-vintiga-slate-700 leading-6 tracking-[0.08px]">
        <div>
          <p>Call us: 0345 08 08 500</p>
          <p>Mon–Fri 8am–8pm, Sat 9am–5pm</p>
        </div>
        <div>
          <p>
            Email us:{' '}
            <a href="mailto:business@vintigabankonline.co.uk" className="text-vintiga-primary underline decoration-solid">
              business@vintigabankonline.co.uk
            </a>
          </p>
          <p>We'll respond within 24 hours</p>
        </div>
      </div>
    ),
  },
  {
    id: 'documents',
    question: 'What documents do I need?',
    content: (
      <p className="text-[16px] font-light text-vintiga-slate-700 leading-6 tracking-[0.08px]">
        You'll need a valid passport or UK driving licence for ID verification.
        No paperwork needed if you use Open Banking.
      </p>
    ),
  },
  {
    id: 'save',
    question: 'Can I save and come back later?',
    content: (
      <p className="text-[16px] font-light text-vintiga-slate-700 leading-6 tracking-[0.08px]">
        Yes! Your progress is automatically saved. Use your email to resume from
        where you left off.
      </p>
    ),
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function BottomSheet({
  isOpen,
  onClose,
  title = 'Need help?',
  subtitle = "We're here to support the application process.",
  items = DEFAULT_HELP_ITEMS,
  ctaLabel = 'Call us',
  ctaHref = 'tel:03450808500',
  onCta,
}: BottomSheetProps) {
  const [openItem, setOpenItem] = useState<string | null>(null)

  if (!isOpen) return null

  const ctaClasses =
    'w-full flex items-center justify-center py-3 px-6 rounded-full text-[16px] font-semibold text-vintiga-primary-foreground bg-vintiga-primary no-underline transition-colors hover:opacity-90 tracking-[0.08px] cursor-pointer border-none'

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative bg-vintiga-surface rounded-tl-[32px] rounded-tr-[32px] shadow-[0px_-8px_25px_0px_rgba(0,0,0,0.12)] flex flex-col max-h-[90%] animate-[fadeUp_0.25s_ease-out]">
        {/* Drag handle */}
        <div className="flex justify-center pt-3.5 shrink-0">
          <div className="w-10 h-1 bg-[#d9d9d9] rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 pt-2 pb-0 shrink-0">
          {title && (
            <h2 className="font-vintiga-display font-normal text-[32px] leading-9 tracking-[-0.96px] text-vintiga-foreground">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-[16px] font-light text-vintiga-foreground-muted leading-6 tracking-[0.08px] mt-2">
              {subtitle}
            </p>
          )}
        </div>

        {/* Accordion */}
        {items.length > 0 && (
          <div className="flex-1 overflow-y-auto px-6 mt-4">
            {items.map((item) => {
              const isExpanded = openItem === item.id
              return (
                <div key={item.id} className="border-b border-vintiga-border last:border-b-0">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between py-5 text-left gap-3 bg-transparent border-none cursor-pointer"
                    onClick={() => setOpenItem(isExpanded ? null : item.id)}
                  >
                    <span className="flex-1 text-[16px] font-[500] text-vintiga-slate-950 leading-6 tracking-[0px] min-w-0">
                      {item.question}
                    </span>
                    <ChevronDownIcon
                      className={`w-6 h-6 text-vintiga-foreground shrink-0 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isExpanded && (
                    <div className="pb-5">{item.content}</div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* CTA footer */}
        <div className="px-4 pt-4 pb-8 bg-vintiga-surface shrink-0">
          {ctaHref ? (
            <a href={ctaHref} className={ctaClasses}>
              {ctaLabel}
            </a>
          ) : (
            <button type="button" onClick={onCta} className={ctaClasses}>
              {ctaLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
