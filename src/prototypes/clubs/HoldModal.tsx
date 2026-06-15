import { useMemo, useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@ds/shared/Modal'
import { Button } from '@ds/shared/Button'
import { ClockIcon, InfoIcon } from '@ds/icons/Icons'
import {
  type MembershipHold,
  TODAY_ISO,
  formatHoldDate,
} from './holdStatus'

// ─── HoldModal ───────────────────────────────────────────────────────────────
// Place / edit / lift a membership hold. Captures a start date (required) and
// an optional end date. The modal previews how the change will read on the
// membership ("On Hold", "Hold Until …", or a future-dated hold that keeps the
// membership Active until the start arrives) so staff see the effect before
// saving. Saving / removing is captured in the membership history by the
// parent.

interface HoldModalProps {
  open: boolean
  /** Existing hold to edit, or undefined to place a new one. */
  hold?: MembershipHold
  onClose: () => void
  /** Commit the hold. */
  onSave: (hold: MembershipHold) => void
  /** Lift the hold entirely — membership resumes immediately. Only offered
   *  when editing an existing hold. */
  onRemove?: () => void
}

export function HoldModal({ open, hold, onClose, onSave, onRemove }: HoldModalProps) {
  const editing = !!hold
  const [start, setStart] = useState(hold?.start ?? TODAY_ISO)
  const [end, setEnd]     = useState(hold?.end ?? '')

  const endBeforeStart = !!end && end < start
  const valid = start.length > 0 && !endBeforeStart

  // Live preview of how the saved hold will read.
  const preview = useMemo(() => {
    if (!start) return null
    const startsInFuture = start > TODAY_ISO
    if (startsInFuture) {
      return {
        tone: 'future' as const,
        text: end
          ? `Membership stays Active, then holds ${formatHoldDate(start)} → ${formatHoldDate(end)}.`
          : `Membership stays Active, then holds from ${formatHoldDate(start)} until lifted.`,
      }
    }
    return {
      tone: 'now' as const,
      text: end
        ? `Shows as “Hold Until ${formatHoldDate(end)}” and auto-resumes that day.`
        : `Shows as “On Hold” until you lift it or set an end date.`,
    }
  }, [start, end])

  return (
    <Modal open={open} onClose={onClose} size="md">
      <ModalHeader
        title={editing ? 'Edit hold' : 'Place on hold'}
        description="Set when the hold starts and (optionally) when it ends. A future start keeps the membership active until that date."
        onClose={onClose}
      />
      <ModalBody>
        <div className="flex flex-col gap-vintiga-md">
          <div className="grid grid-cols-2 gap-vintiga-md">
            <label className="flex flex-col gap-1.5">
              <span className="typo-body-sm font-medium text-vintiga-slate-700">
                Start date <span className="text-vintiga-red-500">*</span>
              </span>
              <input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="h-10 px-3 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="typo-body-sm font-medium text-vintiga-slate-700">
                End date <span className="typo-caption text-vintiga-slate-400 font-normal">(optional)</span>
              </span>
              <input
                type="date"
                value={end}
                min={start || undefined}
                onChange={(e) => setEnd(e.target.value)}
                className="h-10 px-3 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors"
              />
            </label>
          </div>

          {endBeforeStart && (
            <p className="typo-caption text-vintiga-red-600">End date must be on or after the start date.</p>
          )}

          {/* Leave-end-empty hint */}
          <p className="typo-caption text-vintiga-slate-500">
            Leave the end date empty for an indefinite hold — you can lift it manually anytime.
          </p>

          {/* Live preview of the resulting status */}
          {preview && (
            <div
              className={[
                'flex items-start gap-vintiga-sm rounded-vintiga-md px-vintiga-md py-vintiga-sm',
                preview.tone === 'future'
                  ? 'bg-vintiga-indigo-50 text-vintiga-indigo-700'
                  : 'bg-vintiga-slate-50 text-vintiga-slate-700',
              ].join(' ')}
            >
              {preview.tone === 'future'
                ? <ClockIcon className="w-4 h-4 shrink-0 mt-0.5" />
                : <InfoIcon className="w-4 h-4 shrink-0 mt-0.5" />}
              <span className="typo-body-sm">{preview.text}</span>
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        {editing && onRemove && (
          <Button variant="outline" intent="destructive" onClick={onRemove}>
            Lift hold
          </Button>
        )}
        <div className="flex-1" />
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => onSave({ start, end: end || undefined })}
          disabled={!valid}
        >
          {editing ? 'Save hold' : 'Place hold'}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
