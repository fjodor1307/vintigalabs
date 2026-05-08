import { Tooltip } from '@base-ui/react/tooltip'
import { ShieldCheckIcon } from '@ds/icons/Icons'

// ─── AgeVerifiedBadge ─────────────────────────────────────────────────────────
// Avatar overlay shown when a customer has completed age verification.
// Positioned absolutely against the bottom-right of an avatar wrapped in a
// `relative` parent. Hover/focus opens a tooltip via base-ui.
//
// Usage:
//   <div className="relative">
//     <Avatar name={member.name} src={member.avatarUrl} size="lg" />
//     <AgeVerifiedBadge customerName={member.name} />
//   </div>

export interface AgeVerifiedBadgeProps {
  /** Used to label the badge for screen readers, e.g. "Jane Davis is age verified". */
  customerName: string
}

export function AgeVerifiedBadge({ customerName }: AgeVerifiedBadgeProps) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger
          render={
            <button
              type="button"
              aria-label={`${customerName} is age verified`}
              onClick={(e) => { e.stopPropagation(); e.preventDefault() }}
              className="absolute -bottom-1 -right-1 inline-flex items-center justify-center w-7 h-7 rounded-full bg-vintiga-white border border-vintiga-border text-vintiga-slate-600 cursor-help transition-colors hover:text-vintiga-slate-900 p-0"
            >
              <ShieldCheckIcon className="w-4 h-4" />
            </button>
          }
        />
        <Tooltip.Portal>
          <Tooltip.Positioner sideOffset={6}>
            <Tooltip.Popup className="max-w-[220px] bg-vintiga-foreground text-vintiga-surface typo-caption font-medium px-2 py-1.5 rounded shadow-lg">
              Age verified
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
