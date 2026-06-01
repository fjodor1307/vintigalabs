import { useMemo, useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@ds/shared/Modal'
import { Button } from '@ds/shared/Button'
import { storeSeasonsActions, type StoreSeason } from './storeSeasonsStore'

// ─── StoreSeasonModal ────────────────────────────────────────────────────────
// Add / Edit modal for a tenant-wide store season. Mounted from two places:
//   • Settings → Seasons — full CRUD on the list.
//   • Experience Schedule tab — gear icon on Shared season pills opens it
//     inline so the operator can nudge a season's dates without leaving the
//     editor. Writes go straight to `storeSeasonsStore`; every consumer
//     re-renders automatically.

export type StoreSeasonModalState =
  | { mode: 'add' }
  | { mode: 'edit'; season: StoreSeason }
  | null

export interface StoreSeasonModalProps {
  state: StoreSeasonModalState
  onClose: () => void
  /** Optional override — when omitted, the modal commits to
   *  `storeSeasonsStore` itself. Settings keeps its own handler so it can
   *  reuse the modal for both add + edit; the experience editor lets the
   *  default handler do the write. */
  onSubmit?: (payload: { name: string; start: string; end: string }) => void
}

export function StoreSeasonModal({ state, onClose, onSubmit }: StoreSeasonModalProps) {
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
    const payload = { name: name.trim(), start, end }
    if (onSubmit) {
      onSubmit(payload)
    } else if (editing) {
      storeSeasonsActions.update(editing.id, payload)
    } else {
      storeSeasonsActions.add(payload)
    }
    if (!editing) {
      setName('')
      setStart('')
      setEnd('')
    }
    onClose()
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
          {editing && (
            <p className="typo-caption text-vintiga-slate-500">
              Changes apply to every experience using this season.
            </p>
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
