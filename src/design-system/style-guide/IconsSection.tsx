import { useMemo, useState } from 'react'
import * as Lucide from 'lucide-react'
import { SectionHeader } from './SectionHeader'
import { SearchIcon } from '@ds/icons/Icons'

// ─── Build the full library from lucide-react exports ─────────────────────────

// Non-icon exports that ship alongside the icon components.
const NON_ICONS = new Set([
  'default',
  'createLucideIcon',
  'Icon',
  'DynamicIcon',
  'dynamicIconImports',
  'icons',
  'createElement',
  'toPascalCase',
  'mergeClasses',
])

// Build a unique list. Lucide ships aliases (old PascalCase names pointing at
// the same component) — dedupe by component reference, keep the shortest name.
const LUCIDE_ICONS: { name: string; slug: string; component: React.ComponentType<{ className?: string }> }[] =
  (() => {
    const byComponent = new Map<unknown, string>()
    for (const [name, value] of Object.entries(Lucide as Record<string, unknown>)) {
      if (NON_ICONS.has(name)) continue
      if (name.endsWith('Icon') && name !== 'Icon') continue
      if (typeof value !== 'object' && typeof value !== 'function') continue
      if (!/^[A-Z]/.test(name)) continue
      const existing = byComponent.get(value)
      if (!existing || name.length < existing.length) {
        byComponent.set(value, name)
      }
    }
    return [...byComponent.entries()]
      .map(([component, name]) => ({
        name,
        slug: toKebab(name),
        component: component as React.ComponentType<{ className?: string }>,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  })()

function toKebab(pascal: string): string {
  return pascal
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function IconsSection() {
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return LUCIDE_ICONS
    const q = query.toLowerCase().trim()
    return LUCIDE_ICONS.filter((i) => i.name.toLowerCase().includes(q) || i.slug.includes(q))
  }, [query])

  function copyImport(name: string) {
    const snippet = `import { ${name} } from 'lucide-react'`
    navigator.clipboard?.writeText(snippet)
    setCopied(name)
    window.setTimeout(() => setCopied((c) => (c === name ? null : c)), 1500)
  }

  return (
    <section className="flex flex-col gap-vintiga-xl">
      <SectionHeader
        id="icons"
        title="Icons"
        description={`${LUCIDE_ICONS.length} Lucide icons — stroke-based SVGs, tree-shakeable. Click an icon to copy its import; hold Shift-click to open on lucide.dev.`}
      />

      {/* Search */}
      <label className="flex items-center gap-2 border border-vintiga-slate-200 rounded-vintiga-lg bg-vintiga-white px-vintiga-md h-11 focus-within:border-vintiga-indigo-500 focus-within:ring-2 focus-within:ring-vintiga-indigo-100 transition-colors cursor-text max-w-md">
        <SearchIcon className="w-4 h-4 text-vintiga-slate-400 shrink-0" />
        <input
          type="search"
          placeholder={`Search ${LUCIDE_ICONS.length} icons… (e.g. "arrow", "user", "chart")`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400 outline-none min-w-0 border-none"
        />
      </label>

      <p className="typo-caption text-vintiga-slate-500">
        Showing {filtered.length.toLocaleString()} of {LUCIDE_ICONS.length.toLocaleString()} icons. Full library: <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="text-vintiga-indigo-600 hover:underline">lucide.dev/icons</a>
      </p>

      {/* Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-vintiga-sm">
        {filtered.map(({ name, slug, component: Icon }) => (
          <button
            key={name}
            type="button"
            onClick={(e) => {
              if (e.shiftKey) {
                window.open(`https://lucide.dev/icons/${slug}`, '_blank', 'noopener')
              } else {
                copyImport(name)
              }
            }}
            title={`${name}\nClick to copy import\nShift+click to open on lucide.dev`}
            className="group flex flex-col items-center gap-1 p-vintiga-sm rounded-vintiga-md hover:bg-vintiga-slate-50 active:bg-vintiga-slate-100 transition-colors border-none bg-transparent cursor-pointer"
          >
            <div className="w-10 h-10 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white flex items-center justify-center text-vintiga-slate-700 group-hover:text-vintiga-slate-900 group-hover:border-vintiga-slate-300 transition-colors">
              <Icon className="w-5 h-5" />
            </div>
            <span className="typo-caption text-vintiga-slate-500 text-center leading-tight truncate w-full">
              {copied === name ? 'Copied!' : slug}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-vintiga-2xl">
          <p className="typo-body text-vintiga-slate-500">No icons match "{query}".</p>
        </div>
      )}
    </section>
  )
}
