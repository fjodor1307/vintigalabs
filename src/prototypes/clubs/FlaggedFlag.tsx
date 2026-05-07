import { Tooltip } from '@base-ui/react/tooltip'
import { FlagIcon } from '@ds/icons/Icons'

// ─── FlaggedFlag ─────────────────────────────────────────────────────────────
// Inline indicator used in member tables. Renders an orange flag with a
// tooltip explaining why the member is flagged (their orders will be skipped
// in auto-processing and need admin review). Hover or focus opens the
// tooltip via base-ui's auto-open.

export function FlaggedFlag({ memberName }: { memberName: string }) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger
          render={
            <button
              type="button"
              aria-label={`${memberName} is flagged for manual review`}
              onClick={(e) => { e.stopPropagation(); e.preventDefault() }}
              className="inline-flex items-center justify-center w-5 h-5 rounded-vintiga-sm bg-transparent border-none cursor-help text-vintiga-orange-500 hover:text-vintiga-orange-600 transition-colors p-0"
            >
              <FlagIcon className="w-4 h-4" />
            </button>
          }
        />
        <Tooltip.Portal>
          <Tooltip.Positioner sideOffset={6}>
            <Tooltip.Popup className="max-w-[260px] bg-vintiga-foreground text-vintiga-surface typo-caption font-medium px-2 py-1.5 rounded shadow-lg">
              Orders will be skipped in auto processing and need admin review.
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
