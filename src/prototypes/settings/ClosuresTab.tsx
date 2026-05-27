import { useMemo, useState } from 'react'
import { Button } from '@ds/shared/Button'
import { RecordsCard } from '@ds/shared/RecordsCard'
import { SegmentedControl } from '@ds/shared/SegmentedControl'
import { Tag } from '@ds/shared/Tag'
import { Switch } from '@ds/shared/Switch'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from '@ds/shared/Table'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@ds/shared/Modal'
import { Radio } from '@ds/shared/Radio'
import { PlusIcon, TrashIcon } from '@ds/icons/Icons'
import {
  globalBlackoutsActions,
  useGlobalBlackouts,
  type BlackoutType,
  type GlobalBlackout,
} from '../_shared/globalBlackoutsStore'

// ─── ClosuresTab ─────────────────────────────────────────────────────────────
// Tenant-wide blackouts authored here, inherited by every experience's
// Schedule tab. Same modal + table shape as the per-experience editor so the
// two surfaces feel like one feature.

type ClosuresWindow = 'upcoming' | 'past'

const TYPE_LABEL: Record<BlackoutType, string> = {
  holiday: 'Holiday',
  event:   'Event',
  ops:     'Ops',
  other:   'Other',
}

function toneFor(t: BlackoutType): 'violet' | 'orange' | 'teal' | 'default' {
  switch (t) {
    case 'holiday': return 'violet'
    case 'event':   return 'orange'
    case 'ops':     return 'teal'
    case 'other':   return 'default'
  }
}

function humanRange(startIso: string, endIso: string): number {
  const start = new Date(startIso + 'T00:00:00').getTime()
  const end = new Date(endIso + 'T00:00:00').getTime()
  return Math.round((end - start) / 86_400_000) + 1
}

function formatDateShort(startIso: string, endIso: string): string {
  const fmt = (iso: string) =>
    new Date(iso + 'T00:00:00').toLocaleString('en-US', { month: 'short', day: 'numeric' })
  if (!endIso || endIso === startIso) return fmt(startIso)
  return `${fmt(startIso)} – ${fmt(endIso)}`
}

export function ClosuresTab() {
  const blackouts = useGlobalBlackouts()
  const [modalOpen, setModalOpen] = useState(false)
  const [windowTab, setWindowTab] = useState<ClosuresWindow>('upcoming')

  const todayISO = new Date().toISOString().slice(0, 10)

  const { upcoming, past } = useMemo(() => {
    const upcoming: GlobalBlackout[] = []
    const past: GlobalBlackout[] = []
    for (const b of blackouts) {
      const lastDay = b.end || b.start
      if (lastDay < todayISO) past.push(b)
      else upcoming.push(b)
    }
    upcoming.sort((a, b) => a.start.localeCompare(b.start))
    past.sort((a, b) => b.start.localeCompare(a.start))
    return { upcoming, past }
  }, [blackouts, todayISO])

  const visible = windowTab === 'upcoming' ? upcoming : past

  return (
    <div className="flex flex-col gap-vintiga-lg">
      <RecordsCard
        title="Closures"
        subtitle="Dates the entire winery is closed. Every experience inherits these — operators can opt a specific experience out on its Schedule tab."
        action={
          <Button variant="outline" size="md" leftIcon={<PlusIcon className="w-3.5 h-3.5" />} onClick={() => setModalOpen(true)}>
            Add dates
          </Button>
        }
        divider={false}
      >
        <SegmentedControl<ClosuresWindow>
          className="self-start"
          size="md"
          aria-label="Closures window"
          value={windowTab}
          onChange={setWindowTab}
          options={[
            { value: 'upcoming', label: <WindowLabel label="Upcoming" count={upcoming.length} active={windowTab === 'upcoming'} /> },
            { value: 'past',     label: <WindowLabel label="Past"     count={past.length}     active={windowTab === 'past'} /> },
          ]}
        />

        {visible.length === 0 ? (
          <p className="typo-body-sm text-vintiga-slate-400 py-vintiga-md">
            {windowTab === 'upcoming'
              ? 'No upcoming closures. Click "Add dates" to block out a holiday or event.'
              : 'No past closures on record.'}
          </p>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Reason</TableHeader>
                <TableHeader>Type</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>Window</TableHeader>
                <TableHeader className="w-12" />
              </TableRow>
            </TableHead>
            <TableBody>
              {visible.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-vintiga-slate-900">{b.reason}</span>
                      <span className="typo-caption text-vintiga-slate-500">
                        {b.end && b.end !== b.start ? `${humanRange(b.start, b.end)} days` : '1 day'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Tag variant="filled" tone={toneFor(b.type)}>{TYPE_LABEL[b.type]}</Tag>
                  </TableCell>
                  <TableCell className="text-vintiga-slate-700">{formatDateShort(b.start, b.end)}</TableCell>
                  <TableCell className="text-vintiga-slate-700">
                    {b.timeWindow ? `${b.timeWindow.start}–${b.timeWindow.end}` : 'Full day'}
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      type="button"
                      onClick={() => globalBlackoutsActions.remove(b.id)}
                      aria-label="Remove closure"
                      className="w-7 h-7 inline-flex items-center justify-center rounded-vintiga-md text-vintiga-slate-400 hover:text-vintiga-red-600 hover:bg-vintiga-slate-100 transition-colors cursor-pointer bg-transparent border border-transparent"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </RecordsCard>

      <AddClosureModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(payload) => {
          globalBlackoutsActions.add(payload)
          setModalOpen(false)
        }}
      />
    </div>
  )
}

function WindowLabel({ label, count, active }: { label: string; count: number; active: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {label}
      <span className={['typo-caption tabular-nums', active ? 'text-vintiga-slate-500' : 'text-vintiga-slate-400'].join(' ')}>{count}</span>
    </span>
  )
}

// ─── Add Closure modal ───────────────────────────────────────────────────────

function AddClosureModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean
  onClose: () => void
  onSave: (b: Omit<GlobalBlackout, 'id'>) => void
}) {
  const [reason, setReason]   = useState('')
  const [type, setType]       = useState<BlackoutType>('other')
  const [start, setStart]     = useState(new Date().toISOString().slice(0, 10))
  const [end, setEnd]         = useState('')
  const [partial, setPartial] = useState(false)
  const [winStart, setWinStart] = useState('13:00')
  const [winEnd, setWinEnd]     = useState('17:00')

  const reset = () => {
    setReason('')
    setType('other')
    setStart(new Date().toISOString().slice(0, 10))
    setEnd('')
    setPartial(false)
    setWinStart('13:00')
    setWinEnd('17:00')
  }

  const handleClose = () => { reset(); onClose() }
  const handleSave = () => {
    onSave({
      reason: reason || TYPE_LABEL[type],
      type,
      start,
      end: end && end !== start ? end : '',
      timeWindow: partial ? { start: winStart, end: winEnd } : undefined,
    })
    reset()
  }

  const canSave = start.length > 0 && (!partial || (winStart < winEnd))

  return (
    <Modal open={open} onClose={handleClose} size="md">
      <ModalHeader
        title="Add closure"
        description="Block out a date (or range) for every experience. Operators can opt individual experiences out on the Schedule tab."
        onClose={handleClose}
      />
      <ModalBody>
        <div className="flex flex-col gap-vintiga-md">
          <label className="flex flex-col gap-1.5">
            <span className="typo-body-sm font-medium text-vintiga-slate-700">Reason</span>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Memorial Day, Wedding setup"
              className="h-10 px-3 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors"
            />
          </label>

          <div className="flex flex-col gap-1.5">
            <span className="typo-body-sm font-medium text-vintiga-slate-700">Type</span>
            <div className="grid grid-cols-2 gap-2">
              {(['holiday', 'event', 'ops', 'other'] as BlackoutType[]).map((t) => (
                <Radio key={t} checked={type === t} onChange={() => setType(t)} label={TYPE_LABEL[t]} />
              ))}
            </div>
          </div>

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
              <span className="typo-body-sm font-medium text-vintiga-slate-700">End date <span className="typo-caption text-vintiga-slate-400 font-normal">(optional)</span></span>
              <input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                min={start}
                className="h-10 px-3 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors"
              />
            </label>
          </div>

          <div className="flex items-start justify-between gap-vintiga-md pt-1 border-t border-vintiga-slate-100">
            <div className="flex flex-col">
              <span className="typo-body-sm font-medium text-vintiga-slate-900">Partial day</span>
              <span className="typo-caption text-vintiga-slate-500">Only close a part of the day — e.g. afternoon for a wedding setup.</span>
            </div>
            <Switch checked={partial} onChange={setPartial} />
          </div>
          {partial && (
            <div className="grid grid-cols-2 gap-vintiga-md">
              <label className="flex flex-col gap-1.5">
                <span className="typo-body-sm font-medium text-vintiga-slate-700">From</span>
                <input
                  type="time"
                  value={winStart}
                  onChange={(e) => setWinStart(e.target.value)}
                  className="h-10 px-3 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="typo-body-sm font-medium text-vintiga-slate-700">Until</span>
                <input
                  type="time"
                  value={winEnd}
                  onChange={(e) => setWinEnd(e.target.value)}
                  className="h-10 px-3 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors"
                />
              </label>
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={!canSave}>Add closure</Button>
      </ModalFooter>
    </Modal>
  )
}
