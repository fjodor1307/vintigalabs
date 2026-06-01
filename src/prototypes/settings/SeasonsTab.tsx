import { useEffect, useMemo, useState } from 'react'
import { Button } from '@ds/shared/Button'
import { RecordsCard, RecordsCardEmpty } from '@ds/shared/RecordsCard'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from '@ds/shared/Table'
import { PlusIcon, TrashIcon, PencilIcon } from '@ds/icons/Icons'
import {
  storeSeasonsActions,
  useStoreSeasons,
} from '../_shared/storeSeasonsStore'
import { StoreSeasonModal, type StoreSeasonModalState } from '../_shared/StoreSeasonModal'

// ─── SeasonsTab ──────────────────────────────────────────────────────────────
// Tenant-wide named date ranges. Acts as a reusable list of operational
// calendars — each experience picks zero or more seasons from this list (or
// authors a custom one) on its Schedule tab.
//
// Overlap is allowed here on purpose — Summer (May–Oct) and Harvest
// (Sep–Oct) sharing a window is a feature, not a conflict. The no-overlap
// rule only applies once an experience picks two seasons (see PR 2).

function humanRange(startIso: string, endIso: string): number {
  if (!startIso || !endIso) return 0
  const start = new Date(startIso + 'T00:00:00').getTime()
  const end = new Date(endIso + 'T00:00:00').getTime()
  return Math.round((end - start) / 86_400_000) + 1
}

function formatDateLong(iso: string): string {
  if (!iso) return '—'
  return new Date(iso + 'T00:00:00').toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function SeasonsTab() {
  const seasons = useStoreSeasons()
  const [modalState, setModalState] = useState<StoreSeasonModalState>(null)

  // Honour `?edit=<seasonId>` on the hash query so deep links from other
  // surfaces (e.g. the experience Schedule tab's gear icon on a Shared
  // season pill) land with the edit modal already open.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash
    const qIdx = hash.indexOf('?')
    if (qIdx === -1) return
    const editId = new URLSearchParams(hash.slice(qIdx + 1)).get('edit')
    if (!editId) return
    const target = seasons.find((s) => s.id === editId)
    if (target) setModalState({ mode: 'edit', season: target })
    // Run once on mount — we only want to react to the params captured on
    // arrival, not as the user navigates around inside Settings.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sort by start date so the table reads chronologically — operators scan
  // it the way they'd flip through a calendar.
  const sorted = useMemo(
    () => [...seasons].sort((a, b) => a.start.localeCompare(b.start)),
    [seasons],
  )

  return (
    <div className="flex flex-col gap-vintiga-lg">
      <RecordsCard
        title="Seasons"
        subtitle="Reusable date ranges that experiences pull schedules from. Overlap is OK here — each experience handles its own no-overlap rule."
        action={
          <Button
            variant="outline"
            size="md"
            leftIcon={<PlusIcon className="w-3.5 h-3.5" />}
            onClick={() => setModalState({ mode: 'add' })}
          >
            Add season
          </Button>
        }
        empty={
          <RecordsCardEmpty
            title="No seasons yet"
            hint="Add Summer, Harvest, or a custom date range to give experiences something to schedule against."
          />
        }
        divider={false}
      >
        {sorted.length === 0 ? null : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Start</TableHeader>
                <TableHeader>End</TableHeader>
                <TableHeader>Length</TableHeader>
                <TableHeader className="w-24" />
              </TableRow>
            </TableHead>
            <TableBody>
              {sorted.map((s) => (
                <TableRow
                  key={s.id}
                  onClick={() => setModalState({ mode: 'edit', season: s })}
                >
                  <TableCell className="font-medium text-vintiga-slate-900">{s.name}</TableCell>
                  <TableCell className="text-vintiga-slate-700">{formatDateLong(s.start)}</TableCell>
                  <TableCell className="text-vintiga-slate-700">{formatDateLong(s.end)}</TableCell>
                  <TableCell className="text-vintiga-slate-500 typo-caption">{humanRange(s.start, s.end)} days</TableCell>
                  <TableCell className="text-right">
                    {/* The row click handles edit — keep the icons here as
                        affordances + a way to delete without opening the row. */}
                    <span
                      className="inline-flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => setModalState({ mode: 'edit', season: s })}
                        aria-label={`Edit ${s.name}`}
                        className="w-7 h-7 inline-flex items-center justify-center rounded-vintiga-md text-vintiga-slate-400 hover:text-vintiga-slate-700 hover:bg-vintiga-slate-100 transition-colors cursor-pointer bg-transparent border border-transparent"
                      >
                        <PencilIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete "${s.name}"? Experiences using this season will lose the reference (their schedule rules stay intact and become orphaned).`)) {
                            storeSeasonsActions.remove(s.id)
                          }
                        }}
                        aria-label={`Delete ${s.name}`}
                        className="w-7 h-7 inline-flex items-center justify-center rounded-vintiga-md text-vintiga-slate-400 hover:text-vintiga-red-600 hover:bg-vintiga-slate-100 transition-colors cursor-pointer bg-transparent border border-transparent"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </RecordsCard>

      <StoreSeasonModal
        state={modalState}
        onClose={() => setModalState(null)}
      />
    </div>
  )
}
