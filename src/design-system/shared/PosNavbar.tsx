import { SearchIcon, ListIcon } from '@ds/icons/Icons'

// ─── PosNavbar ───────────────────────────────────────────────────────────────
// Product search navbar for the POS app (Figma 2955:6082 "navbar"). A rounded
// search field + a list-view toggle. Adapted from the iOS Sidebar Search Field.

export function PosNavbar({
  value = '',
  onChange,
  onToggleList,
}: {
  value?: string
  onChange?: (value: string) => void
  onToggleList?: () => void
}) {
  return (
    <div className="flex items-center gap-3 w-full px-3 py-2 bg-vintiga-white">
      <div className="flex-1 flex items-center gap-2 h-10 rounded-full bg-vintiga-slate-100 px-4">
        <SearchIcon className="w-4 h-4 text-vintiga-slate-400 shrink-0" />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Search for products"
          className="flex-1 min-w-0 bg-transparent typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400 focus:outline-none"
        />
      </div>
      <button
        type="button"
        onClick={onToggleList}
        aria-label="List view"
        className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full text-vintiga-slate-700 hover:bg-vintiga-slate-100 transition-colors"
      >
        <ListIcon className="w-5 h-5" />
      </button>
    </div>
  )
}
