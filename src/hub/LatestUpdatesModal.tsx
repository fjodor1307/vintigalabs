// Latest updates modal — a lightweight "what got done" feed for end-of-day
// reports. Data is generated from git history at build time
// (scripts/generate-updates.mjs → updates.json). Extracted from App.tsx so the
// hub sub-pages (e.g. Brand → Imagery) can open it in place instead of routing
// back to the home page.

import { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../design-system/shared/Modal'
import { Button } from '../design-system/shared/Button'
import { SegmentedControl } from '../design-system/shared/SegmentedControl'
import { ChevronDownIcon, ExternalLinkIcon } from '../design-system/icons/Icons'
import updatesData from '../generated/updates.json'
import { allEntries } from '../prototypes/_registry'
import { categoryForFrame } from './segments'

type UpdateItem = { date: string; label: string; pr: number | null; area: string; type: string }
const UPDATES = updatesData as { generatedAt: string; repoUrl: string; items: UpdateItem[] }

// Only surface user-facing change types in the feed — keeps it readable for
// non-engineers (no chore/refactor/docs/test/build noise).
const USER_FACING_TYPES = new Set(['feat', 'fix', 'perf'])
const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)
const MAX_PER_AREA = 6

const AREA_FALLBACK: Record<string, { name: string; category: string }> = {
  builder: { name: 'Builder', category: 'Hub' },
  'design-system': { name: 'Design System', category: 'DS' },
}

function areaMeta(area: string): { name: string; category: string } {
  const entry = allEntries.find((e) => e.slug === area)
  if (entry) return { name: entry.name, category: categoryForFrame(entry.frame) }
  return AREA_FALLBACK[area] ?? { name: area, category: '' }
}

type UpdateRange = 'week' | 'lastweek'

function ymd(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export function LatestUpdatesModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [range, setRange] = useState<UpdateRange>('week')
  const [area, setArea] = useState<string>('all')
  const [areaOpen, setAreaOpen] = useState(false)

  // Date boundaries (calendar weeks, Monday-start), computed from "now".
  const now = new Date()
  const todayStr = ymd(now)
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7))
  const weekStart = ymd(monday)
  const lastMon = new Date(monday)
  lastMon.setDate(monday.getDate() - 7)
  const lastSun = new Date(monday)
  lastSun.setDate(monday.getDate() - 1)
  const lastStart = ymd(lastMon)
  const lastEnd = ymd(lastSun)

  const inRange = (d: string) =>
    range === 'week' ? d >= weekStart && d <= todayStr : d >= lastStart && d <= lastEnd

  const rangeOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'lastweek', label: 'Last Week' },
  ]

  const rangeItems = UPDATES.items.filter((i) => inRange(i.date) && USER_FACING_TYPES.has(i.type))
  const areasInRange = Array.from(new Set(rangeItems.map((i) => i.area))).sort((a, b) =>
    areaMeta(a).name.localeCompare(areaMeta(b).name),
  )
  // Keep the selected area only while it has items in the current range.
  const activeArea = area !== 'all' && !areasInRange.includes(area) ? 'all' : area
  const groupAreas = activeArea === 'all' ? areasInRange : [activeArea]

  // De-duplicated, capitalised, capped bullet list for one area.
  const bulletsFor = (a: string) => {
    const seen = new Set<string>()
    const unique: UpdateItem[] = []
    for (const i of rangeItems) {
      if (i.area !== a) continue
      const key = i.label.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      unique.push(i)
    }
    return { visible: unique.slice(0, MAX_PER_AREA), extra: Math.max(0, unique.length - MAX_PER_AREA) }
  }

  const visibleAreas = groupAreas.filter((a) => bulletsFor(a).visible.length > 0)

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <ModalHeader title="Latest updates" onClose={onClose} />
      <ModalBody className="max-h-[60vh] overflow-y-auto">
        {/* Range tabs + area dropdown */}
        <div className="flex items-center justify-between gap-3">
          <SegmentedControl
            size="sm"
            value={range}
            onChange={(v) => setRange(v as UpdateRange)}
            options={rangeOptions}
            aria-label="Time range"
          />
          <div className="relative shrink-0">
            <Button
              variant="outline"
              size="md"
              rightIcon={<ChevronDownIcon />}
              onClick={() => setAreaOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={areaOpen}
            >
              {activeArea === 'all' ? 'All' : areaMeta(activeArea).name}
            </Button>
            {areaOpen && (
              <>
                <button type="button" aria-hidden="true" tabIndex={-1} onClick={() => setAreaOpen(false)} className="fixed inset-0 z-10 cursor-default" />
                <div className="absolute right-0 mt-1 z-20 min-w-[180px] max-h-[50vh] overflow-y-auto rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white shadow-vintiga-md p-1">
                  {['all', ...areasInRange].map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => {
                        setArea(a)
                        setAreaOpen(false)
                      }}
                      className={[
                        'w-full text-left px-3 py-2 rounded-vintiga-input typo-body-sm transition-colors',
                        a === activeArea
                          ? 'font-semibold text-vintiga-slate-900 bg-vintiga-slate-100'
                          : 'text-vintiga-slate-500 hover:bg-vintiga-slate-50',
                      ].join(' ')}
                    >
                      {a === 'all' ? 'All' : areaMeta(a).name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Grouped accomplishments */}
        {visibleAreas.length === 0 ? (
          <p className="typo-body-sm text-vintiga-slate-500 py-vintiga-xl text-center">
            Nothing shipped in this window.
          </p>
        ) : (
          <div className="flex flex-col gap-vintiga-lg">
            {visibleAreas.map((a) => {
              const { visible, extra } = bulletsFor(a)
              const meta = areaMeta(a)
              const latestPr = rangeItems
                .filter((i) => i.area === a)
                .reduce<number | null>((max, i) => (i.pr && (!max || i.pr > max) ? i.pr : max), null)
              return (
                <section key={a}>
                  <h3 className="typo-body font-semibold text-vintiga-slate-900">
                    {meta.name} {meta.category && <span className="text-vintiga-slate-400">{`{${meta.category}}`}</span>}
                  </h3>
                  <ul className="mt-vintiga-sm flex flex-col gap-1.5 list-disc pl-5">
                    {visible.map((i, idx) => (
                      <li key={`${a}-${idx}`} className="typo-body-sm text-vintiga-slate-600">
                        {capitalize(i.label)}
                      </li>
                    ))}
                    {extra > 0 && (
                      <li className="typo-body-sm text-vintiga-slate-400 list-none -ml-5">+{extra} more</li>
                    )}
                  </ul>
                  {latestPr && (
                    <a
                      href={`${UPDATES.repoUrl}/pull/${latestPr}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-vintiga-sm inline-block typo-body-sm font-semibold text-vintiga-indigo-600 no-underline hover:underline"
                    >
                      Latest PR
                    </a>
                  )}
                </section>
              )
            })}
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" size="lg" onClick={onClose}>
          Close
        </Button>
        <Button
          as="a"
          href={`${UPDATES.repoUrl}/pulls?q=is%3Apr`}
          target="_blank"
          rel="noreferrer"
          variant="solid"
          size="lg"
          leftIcon={<ExternalLinkIcon />}
        >
          Open Github
        </Button>
      </ModalFooter>
    </Modal>
  )
}
