import type { ReactNode } from 'react'
import { VintigaLogo, VintigaIconNeutral } from '@ds/shared/VintigaLogo'
import { IconButton } from '@ds/shared/IconButton'
import { HistoryIcon, DownloadIcon, SunIcon, MoonIcon } from '@ds/icons/Icons'
import { SEGMENTS, type Segment } from './segments'

// Shared dark-mode overrides for DS outline buttons used in the hub chrome —
// the DS components are light-only (white/slate), so retint them under `.dark`.
export const HUB_OUTLINE_DARK =
  'dark:bg-transparent dark:border-vintiga-border dark:text-vintiga-foreground-muted ' +
  'dark:hover:bg-vintiga-surface-element dark:hover:text-vintiga-foreground'

// The hub's sticky, frosted top navbar — logo · category tabs · search · dark
// toggle · Latest updates · download. Reused on the hub and its sub-pages.
export function HubNavbar({
  dark,
  onToggleDark,
  segment,
  onSelectSegment,
  search,
  onOpenUpdates,
}: {
  dark: boolean
  onToggleDark: () => void
  segment: Segment
  onSelectSegment: (s: Segment) => void
  /** The search element (a live field on the hub, a link to the hub elsewhere). */
  search: ReactNode
  onOpenUpdates: () => void
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 h-16 px-vintiga-lg sm:px-vintiga-2xl bg-vintiga-surface/75 backdrop-blur-md">
      <a href="#/" aria-label="Vintiga Prototypes" className="shrink-0 no-underline">
        {dark ? <VintigaIconNeutral size={36} /> : <VintigaLogo size={36} />}
      </a>

      <nav aria-label="Categories" className="flex items-center gap-0.5 shrink-0">
        {SEGMENTS.map((s) => {
          const active = segment === s.value
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => onSelectSegment(s.value)}
              aria-current={active ? 'page' : undefined}
              className={[
                'px-3 py-1.5 rounded-vintiga-md typo-body-sm transition-colors',
                active
                  ? 'font-semibold text-vintiga-foreground'
                  : 'font-medium text-vintiga-foreground-muted hover:text-vintiga-foreground',
              ].join(' ')}
            >
              {s.label}
            </button>
          )
        })}
      </nav>

      <div className="flex-1 min-w-0 max-w-md ml-auto">{search}</div>

      {/* Dark-mode switch — 40px tall to match the search field and icon buttons. */}
      <button
        type="button"
        role="switch"
        aria-checked={dark}
        aria-label="Toggle dark mode"
        onClick={onToggleDark}
        className={[
          'shrink-0 relative w-[64px] h-10 rounded-full p-1 flex items-center transition-colors',
          dark ? 'bg-[#262626]' : 'bg-vintiga-slate-900',
        ].join(' ')}
      >
        <span
          className={[
            'w-8 h-8 rounded-full bg-white shadow-vintiga-sm flex items-center justify-center text-vintiga-slate-700 transition-transform',
            dark ? 'translate-x-0' : 'translate-x-[24px]',
          ].join(' ')}
        >
          {dark ? <MoonIcon className="w-4 h-4" /> : <SunIcon className="w-4 h-4" />}
        </span>
      </button>

      <IconButton
        variant="outline"
        size="xl"
        icon={<HistoryIcon />}
        onClick={onOpenUpdates}
        aria-label="Latest updates"
        className={`h-10 w-10 ${HUB_OUTLINE_DARK}`}
      />

      <IconButton
        variant="outline"
        size="xl"
        icon={<DownloadIcon />}
        onClick={() => window.open('https://github.com/fjodor1307/vintigalabs/archive/refs/heads/main.zip', '_blank')}
        aria-label="Download repository as ZIP"
        className={`h-10 w-10 ${HUB_OUTLINE_DARK}`}
      />
    </header>
  )
}
