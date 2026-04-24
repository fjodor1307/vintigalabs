import { useEffect, useRef, useState } from 'react'

type Contributor = {
  name: string
  email: string
  initials: string
  colour: string
}

export type Status = 'in-progress' | 'approved'

type Props = {
  query: string
  onQueryChange: (q: string) => void
  authors: Contributor[]
  selectedAuthors: Set<string>
  onToggleAuthor: (email: string) => void
  tags: string[]
  selectedTags: Set<string>
  onToggleTag: (tag: string) => void
  selectedStatuses: Set<Status>
  onToggleStatus: (s: Status) => void
  onClear: () => void
}

type PopoverKey = 'author' | 'tags' | 'status' | null

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="text-vintiga-foreground-muted"
    >
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function FilterButton({
  label,
  count,
  open,
  onClick,
}: {
  label: string
  count: number
  open: boolean
  onClick: () => void
}) {
  const active = count > 0
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-vintiga-input border typo-body-sm font-semibold transition-colors ${
        active
          ? 'border-vintiga-primary bg-vintiga-primary/10 text-vintiga-foreground'
          : 'border-vintiga-border bg-vintiga-surface text-vintiga-foreground-muted hover:border-vintiga-primary'
      }`}
    >
      <span>{label}</span>
      {active && (
        <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-vintiga-primary text-vintiga-primary-foreground text-[10px] leading-none">
          {count}
        </span>
      )}
      <ChevronIcon />
    </button>
  )
}

export function FilterBar({
  query,
  onQueryChange,
  authors,
  selectedAuthors,
  onToggleAuthor,
  tags,
  selectedTags,
  onToggleTag,
  selectedStatuses,
  onToggleStatus,
  onClear,
}: Props) {
  const [open, setOpen] = useState<PopoverKey>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(null)
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(null)
    }
    window.addEventListener('mousedown', handleClick)
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('mousedown', handleClick)
      window.removeEventListener('keydown', handleKey)
    }
  }, [open])

  const totalActive =
    (query ? 1 : 0) + selectedAuthors.size + selectedTags.size + selectedStatuses.size

  return (
    <div ref={rootRef} className="relative mb-vintiga-xl flex flex-wrap items-center gap-vintiga-sm">
      <div className="relative flex-1 min-w-[220px] max-w-md">
        <span className="absolute left-3 top-1/2 -translate-y-1/2">
          <SearchIcon />
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search prototypes, tags…"
          className="w-full bg-vintiga-surface-element rounded-vintiga-input border border-transparent focus:border-vintiga-primary focus:outline-none pl-9 pr-3 py-2 typo-body-sm"
        />
      </div>

      {authors.length > 0 && (
        <div className="relative">
          <FilterButton
            label="Author"
            count={selectedAuthors.size}
            open={open === 'author'}
            onClick={() => setOpen(open === 'author' ? null : 'author')}
          />
          {open === 'author' && (
            <div className="absolute left-0 top-full mt-1 z-30 min-w-[220px] bg-vintiga-surface border border-vintiga-border rounded-vintiga-card shadow-vintiga-lg p-vintiga-sm flex flex-col gap-1">
              {authors.map((a) => {
                const active = selectedAuthors.has(a.email)
                return (
                  <button
                    key={a.email}
                    type="button"
                    onClick={() => onToggleAuthor(a.email)}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-vintiga-input text-left transition-colors ${
                      active ? 'bg-vintiga-primary/10' : 'hover:bg-vintiga-surface-element'
                    }`}
                  >
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center font-semibold text-white"
                      style={{ backgroundColor: a.colour }}
                    >
                      <span className="text-[10px]">{a.initials}</span>
                    </span>
                    <span className="typo-body-sm font-semibold text-vintiga-foreground flex-1">
                      {a.name}
                    </span>
                    {active && (
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="text-vintiga-primary">
                        <path d="M3 8.5L6.5 12L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {tags.length > 0 && (
        <div className="relative">
          <FilterButton
            label="Tags"
            count={selectedTags.size}
            open={open === 'tags'}
            onClick={() => setOpen(open === 'tags' ? null : 'tags')}
          />
          {open === 'tags' && (
            <div className="absolute left-0 top-full mt-1 z-30 w-[320px] max-h-[320px] overflow-auto bg-vintiga-surface border border-vintiga-border rounded-vintiga-card shadow-vintiga-lg p-vintiga-sm flex flex-wrap gap-1.5">
              {tags.map((t) => {
                const active = selectedTags.has(t)
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => onToggleTag(t)}
                    className={`px-2.5 py-1 rounded-full border typo-body-sm transition-colors ${
                      active
                        ? 'border-vintiga-primary bg-vintiga-primary/10 text-vintiga-foreground font-semibold'
                        : 'border-vintiga-border bg-vintiga-surface text-vintiga-foreground-muted hover:border-vintiga-primary'
                    }`}
                  >
                    #{t}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      <div className="inline-flex items-center p-0.5 rounded-vintiga-input border border-vintiga-border bg-vintiga-surface">
        {(
          [
            { value: null, label: 'All' },
            { value: 'in-progress' as Status, label: 'In progress' },
            { value: 'approved' as Status, label: 'Approved' },
          ]
        ).map((opt) => {
          const active =
            opt.value === null
              ? selectedStatuses.size === 0
              : selectedStatuses.size === 1 && selectedStatuses.has(opt.value)
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => {
                // three-way single-select: clicking "All" clears; the others replace the selection
                if (opt.value === null) {
                  for (const s of Array.from(selectedStatuses)) onToggleStatus(s)
                } else if (!active) {
                  for (const s of Array.from(selectedStatuses)) onToggleStatus(s)
                  onToggleStatus(opt.value)
                }
              }}
              aria-pressed={active}
              className={`px-3 py-1.5 rounded-vintiga-input typo-body-sm font-semibold transition-colors ${
                active
                  ? 'bg-vintiga-primary text-vintiga-primary-foreground'
                  : 'text-vintiga-foreground-muted hover:text-vintiga-foreground'
              }`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>

      {totalActive > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="ml-auto typo-body-sm font-semibold text-vintiga-primary hover:underline"
        >
          Clear ({totalActive})
        </button>
      )}
    </div>
  )
}
