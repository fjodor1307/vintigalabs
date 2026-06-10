import { useMemo, useState } from 'react'
import { SegmentedControl } from '@ds/shared/SegmentedControl'
import { TextField } from '@ds/shared/TextField'
import { Tag } from '@ds/shared/Tag'
import { SearchIcon, SparklesIcon } from '@ds/icons/Icons'
import { QUICK_REPLIES, type QuickReply, type QuickReplyCategory } from './chatSamples'

// ─── QuickReplyPicker ───────────────────────────────────────────────────────
// Sendblue-style snippet library. Unlike the WhatsApp prototype's template
// system, there are no `{{1}}` placeholders — quick replies are plain text
// you can edit after inserting. Categories tab the surface; search filters
// across all categories.

type Filter = 'all' | QuickReplyCategory

const CATEGORY_LABEL: Record<QuickReplyCategory, string> = {
  greeting:   'Greeting',
  sales:      'Sales',
  service:    'Service',
  club:       'Club',
  compliance: 'Compliance',
}

const CATEGORY_TONE: Record<QuickReplyCategory, 'success' | 'info' | 'orange' | 'violet' | 'danger'> = {
  greeting:   'info',
  sales:      'success',
  service:    'orange',
  club:       'violet',
  compliance: 'danger',
}

interface Props {
  open: boolean
  onClose: () => void
  onPick: (qr: QuickReply) => void
}

export function QuickReplyPicker({ open, onClose, onPick }: Props) {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery]   = useState('')

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return QUICK_REPLIES.filter((r) =>
      filter === 'all' ? true : r.category === filter,
    ).filter((r) => (!q ? true : (r.name + ' ' + r.body).toLowerCase().includes(q)))
  }, [filter, query])

  if (!open) return null

  return (
    <div
      className="absolute bottom-full left-0 right-0 mb-2 z-20 rounded-vintiga-card border border-vintiga-slate-200 bg-vintiga-white shadow-vintiga-lg flex flex-col max-h-[60vh] overflow-hidden"
      role="dialog"
      aria-label="Quick replies"
    >
      <div className="px-vintiga-md pt-vintiga-md pb-vintiga-sm border-b border-vintiga-slate-200 flex flex-col gap-vintiga-sm">
        <div className="flex items-center justify-between gap-vintiga-sm">
          <div className="flex items-center gap-1.5">
            <SparklesIcon className="w-4 h-4 text-vintiga-indigo-500" />
            <span className="typo-body-sm font-semibold text-vintiga-slate-900">Quick replies</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="typo-caption text-vintiga-slate-500 hover:text-vintiga-slate-700 bg-transparent border-none cursor-pointer"
            aria-label="Close quick replies"
          >
            Close
          </button>
        </div>

        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search snippets"
          leftIcon={<SearchIcon className="w-4 h-4" />}
        />

        <SegmentedControl<Filter>
          value={filter}
          onChange={setFilter}
          size="sm"
          aria-label="Quick reply category"
          options={[
            { value: 'all',        label: 'All' },
            { value: 'greeting',   label: 'Greeting' },
            { value: 'sales',      label: 'Sales' },
            { value: 'service',    label: 'Service' },
            { value: 'club',       label: 'Club' },
            { value: 'compliance', label: 'Compliance' },
          ]}
        />
      </div>

      <ul className="flex-1 overflow-y-auto divide-y divide-vintiga-slate-100 m-0 p-0 list-none">
        {visible.length === 0 && (
          <li className="px-vintiga-md py-vintiga-lg text-center typo-body-sm text-vintiga-slate-500">
            No quick replies match — try a different search.
          </li>
        )}
        {visible.map((r) => (
          <li key={r.id}>
            <button
              type="button"
              onClick={() => { onPick(r); onClose() }}
              className="w-full text-left px-vintiga-md py-vintiga-sm bg-transparent border-none cursor-pointer hover:bg-vintiga-slate-50 transition-colors"
            >
              <div className="flex items-center gap-vintiga-sm">
                <span className="typo-body-sm font-semibold text-vintiga-slate-900 flex-1 truncate">
                  {r.name}
                </span>
                <Tag tone={CATEGORY_TONE[r.category]} size="sm">
                  {CATEGORY_LABEL[r.category]}
                </Tag>
              </div>
              <p className="mt-1 typo-caption text-vintiga-slate-600 line-clamp-2">{r.body}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
