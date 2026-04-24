import { SearchIcon } from '../icons/Icons'

export function GlobalSearch() {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-vintiga-foreground-muted" />
      <input
        type="text"
        placeholder="Search customers, accounts, transactions..."
        className="w-full bg-vintiga-surface-element border border-transparent rounded-vintiga-input pl-9 pr-3 py-2 typo-body-sm text-vintiga-foreground placeholder:text-vintiga-foreground-muted focus:outline-none focus:border-vintiga-primary transition-colors"
      />
    </div>
  )
}
