import { useMemo, useState } from 'react'
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
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@ds/shared/Modal'
import { PlusIcon, TrashIcon, PencilIcon } from '@ds/icons/Icons'
import {
  storeSeasonsActions,
  useStoreSeasons,
  type StoreSeason,
} from '../_shared/storeSeasonsStore'

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
  const [modalState, setModalState] = useState<{ mode: 'add' } | { mode: 'edit'; season: StoreSeason } | null>(null)

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

      <SeasonModal
        state={modalState}
        onClose={() => setModalState(null)}
        onSubmit={(payload) => {
          if (modalState?.mode === 'edit') {
            storeSeasonsActions.update(modalState.season.id, payload)
          } else {
            storeSeasonsActions.add(payload)
          }
          setModalState(null)
        }}
      />
    </div>
  )
}

// ─── Add / Edit modal ────────────────────────────────────────────────────────

function SeasonModal({
  state,
  onClose,
  onSubmit,
}: {
  state: { mode: 'add' } | { mode: 'edit'; season: StoreSeason } | null
  onClose: () => void
  onSubmit: (payload: { name: string; start: string; end: string }) => void
}) {
  const open = state !== null
  const editing = state?.mode === 'edit' ? state.season : null

  const [name, setName]   = useState(editing?.name ?? '')
  const [start, setStart] = useState(editing?.start ?? '')
  const [end, setEnd]     = useState(editing?.end ?? '')

  // Reset the form whenever the parent opens a new edit target.
  // Cheap "use editing.id as a refresh key" trick.
  const editingKey = editing?.id ?? null
  useResetForm(editingKey, () => {
    setName(editing?.name ?? '')
    setStart(editing?.start ?? '')
    setEnd(editing?.end ?? '')
  })

  function handleClose() {
    if (!editing) {
      setName('')
      setStart('')
      setEnd('')
    }
    onClose()
  }

  function handleSubmit() {
    onSubmit({ name: name.trim(), start, end })
    if (!editing) {
      setName('')
      setStart('')
      setEnd('')
    }
  }

  const valid = name.trim().length > 0 && start.length > 0 && end.length > 0 && start <= end

  return (
    <Modal open={open} onClose={handleClose} size="md">
      <ModalHeader
        title={editing ? `Edit ${editing.name}` : 'Add season'}
        description="Seasons are reusable date ranges. Each experience can pull from this list or define its own one-off season."
        onClose={handleClose}
      />
      <ModalBody>
        <div className="flex flex-col gap-vintiga-md">
          <label className="flex flex-col gap-1.5">
            <span className="typo-body-sm font-medium text-vintiga-slate-700">Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Summer, Harvest, Holiday"
              className="h-10 px-3 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors"
            />
          </label>
          <div className="grid grid-cols-2 gap-vintiga-md">
            <label className="flex flex-col gap-1.5">
              <span className="typo-body-sm font-medium text-vintiga-slate-700">Start date</span>
              <input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="h-10 px-3 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="typo-body-sm font-medium text-vintiga-slate-700">End date</span>
              <input
                type="date"
                value={end}
                min={start || undefined}
                onChange={(e) => setEnd(e.target.value)}
                className="h-10 px-3 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors"
              />
            </label>
          </div>
          {start && end && end < start && (
            <p className="typo-caption text-vintiga-red-600">End date must come on or after the start date.</p>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={!valid}>
          {editing ? 'Save changes' : 'Add season'}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

/** Re-seed form state whenever `key` changes — handles "user clicked Edit on
 *  a different season" without unmounting the modal each time. */
function useResetForm(key: string | null, reset: () => void) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => { reset() }, [key])
}
