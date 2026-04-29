import type { ReactNode } from 'react'
import { EllipsisVerticalIcon } from '@ds/icons/Icons'

// ─── ListCard ─────────────────────────────────────────────────────────────────
// Vintiga list-item card — Figma-accurate (4856:16493).
// A 44-px-tall bordered row used in vertical lists (Collections, Channels,
// Workspaces, etc.). Three states: default, hover, selected.
//
//   • Default  — slate-200 border, white bg
//   • Hover    — slate-400 border (managed via :hover)
//   • Selected — indigo-500 border, indigo-50 bg, indigo-700 label
//
// API:
//   <ListCard label="Mix Wines" selected onClick={…} action={<KebabMenu />} />
//   <ListCard label="…" icon={<FolderIcon />} />          // optional leading icon
//   <ListCard label="…" actionAriaLabel="Mix Wines actions" />  // default kebab

export interface ListCardProps {
  /** Primary text. */
  label: ReactNode
  /** Currently selected. */
  selected?: boolean
  /** Disabled — non-interactive, faded. */
  disabled?: boolean
  /** Click handler for the whole row. */
  onClick?: () => void
  /** Optional leading icon (16–20 px). */
  icon?: ReactNode
  /** Optional trailing action — defaults to a kebab (`EllipsisVerticalIcon`). */
  action?: ReactNode
  /** When true, hides the default kebab when no `action` is passed. */
  hideAction?: boolean
  /** Click handler for the default kebab (ignored if `action` is passed). */
  onActionClick?: () => void
  /** Accessible label for the default kebab. Default: "More". */
  actionAriaLabel?: string
  /** Accessible label override for the row (defaults to `label` if string). */
  'aria-label'?: string
  className?: string
}

export function ListCard({
  label,
  selected = false,
  disabled = false,
  onClick,
  icon,
  action,
  hideAction = false,
  onActionClick,
  actionAriaLabel = 'More',
  className = '',
  ...rest
}: ListCardProps) {
  const rowClasses = [
    'flex items-center gap-vintiga-sm h-11 px-vintiga-sm rounded-vintiga-lg border transition-colors text-left bg-vintiga-white',
    disabled
      ? 'cursor-not-allowed opacity-60'
      : 'cursor-pointer',
    selected
      ? 'bg-vintiga-indigo-50 border-vintiga-indigo-500'
      : disabled
        ? 'border-vintiga-slate-200'
        : 'border-vintiga-slate-200 hover:border-vintiga-slate-400',
    className,
  ].join(' ')

  const labelClasses = [
    'flex-1 min-w-0 typo-body-sm font-medium leading-5 truncate',
    disabled
      ? 'text-vintiga-slate-400'
      : selected
        ? 'text-vintiga-indigo-700'
        : 'text-vintiga-slate-900',
  ].join(' ')

  // Stop the row click from firing when the trailing action is interacted with
  const stop = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <button
      type="button"
      role={onClick ? 'option' : undefined}
      aria-selected={onClick ? selected : undefined}
      aria-label={rest['aria-label'] ?? (typeof label === 'string' ? label : undefined)}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={rowClasses}
    >
      {icon && (
        <span className={`shrink-0 flex items-center justify-center [&>svg]:w-4 [&>svg]:h-4 ${selected ? 'text-vintiga-indigo-700' : 'text-vintiga-slate-500'}`}>
          {icon}
        </span>
      )}

      <span className={labelClasses}>{label}</span>

      {!hideAction && (
        action ? (
          <span onClick={stop} className="shrink-0">
            {action}
          </span>
        ) : (
          <span
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label={actionAriaLabel}
            onClick={(e) => { stop(e); onActionClick?.() }}
            className={[
              'shrink-0 w-5 h-5 flex items-center justify-center transition-colors',
              disabled
                ? 'text-vintiga-slate-300'
                : selected
                  ? 'text-vintiga-indigo-700 hover:text-vintiga-indigo-800'
                  : 'text-vintiga-slate-400 hover:text-vintiga-slate-700',
            ].join(' ')}
          >
            <EllipsisVerticalIcon className="w-5 h-5" />
          </span>
        )
      )}
    </button>
  )
}
