import { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@ds/shared/Modal'
import { Field } from '@ds/shared/Field'
import { Select } from '@ds/shared/Select'
import { Textarea } from '@ds/shared/Textarea'
import { Checkbox } from '@ds/shared/Checkbox'
import { Button } from '@ds/shared/Button'
import { customerActions } from './customerStore'
import type { CustomerNote, NoteKind } from './customerSample'

// ─── NoteModal ────────────────────────────────────────────────────────────────
// Add Note (`519:18627`) and Update Note (`519:18607`) share the same shape —
// type select + description textarea + "Flag this Note" checkbox — so they're
// one component differentiated by `mode`.
//
// Add path:    pass mode="add"; submit creates a note in the store.
// Edit path:   pass mode="edit" + existing `note`; submit patches it.
// "Flag this Note" upgrades the note kind to `flag` regardless of the type
// select — matches the Figma which treats it as a quick escalation.

const TYPE_OPTIONS: { value: NoteKind; label: string }[] = [
  { value: 'note',     label: 'Note' },
  { value: 'reminder', label: 'Reminder' },
  { value: 'flag',     label: 'Flag' },
]

type AddProps = { mode: 'add'; open: boolean; onClose: () => void; note?: never }
type EditProps = { mode: 'edit'; open: boolean; onClose: () => void; note: CustomerNote }

export function NoteModal(props: AddProps | EditProps) {
  // Mount the form fresh each open so a cancelled draft doesn't leak into the
  // next session — `useState` initialisers snapshot the props at mount.
  return (
    <Modal open={props.open} onClose={props.onClose} size="md">
      {props.open && (
        props.mode === 'edit'
          ? <NoteForm mode="edit" note={props.note} onClose={props.onClose} />
          : <NoteForm mode="add" onClose={props.onClose} />
      )}
    </Modal>
  )
}

function NoteForm(props:
  | { mode: 'add'; onClose: () => void; note?: never }
  | { mode: 'edit'; onClose: () => void; note: CustomerNote }
) {
  const { mode, onClose } = props
  const initialKind: NoteKind = mode === 'edit' ? props.note.kind : 'note'
  const initialBody = mode === 'edit' ? props.note.body : ''

  const [kind, setKind] = useState<NoteKind>(initialKind)
  const [body, setBody] = useState(initialBody)
  const [flag, setFlag] = useState(initialKind === 'flag')

  const title       = mode === 'edit' ? 'Update Note' : 'Add Note'
  const submitLabel = mode === 'edit' ? 'Update'      : 'Add'
  const canSubmit   = body.trim().length > 0

  function handleSubmit() {
    if (!canSubmit) return
    const finalKind: NoteKind = flag ? 'flag' : kind
    if (mode === 'edit') {
      customerActions.updateNote(props.note.id, { kind: finalKind, body })
    } else {
      customerActions.addNote({ kind: finalKind, body })
    }
    onClose()
  }

  return (
    <>
      <ModalHeader title={title} onClose={onClose} />
      <ModalBody>
        <Field label="Type">
          <Select
            value={kind}
            onChange={(e) => setKind(e.target.value as NoteKind)}
            options={TYPE_OPTIONS}
            disabled={flag}
          />
        </Field>

        <Field label="Description">
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='e.g. "Customer called about delayed shipment"'
            rows={4}
            className="min-h-[120px]"
          />
        </Field>

        <Checkbox
          checked={flag}
          onChange={setFlag}
          label="Flag this Note"
        />
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={!canSubmit}>
          {submitLabel}
        </Button>
      </ModalFooter>
    </>
  )
}
