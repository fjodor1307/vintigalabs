import { useEffect, useState } from 'react'
import { Modal, ModalButtonSecondary, ModalButtonPrimary, ModalButtonDestructive, CheckboxField } from './Modal'
import { Field, TextInput, InputWithAdornment } from './ProductLayout'
import { productActions, emptyModifierGroup, _uid, type ModifierGroup, type ModifierOption } from './productStore'
import { PlusIcon, TrashIcon, GripVerticalIcon } from '@ds/icons/Icons'

interface ModifierGroupModalProps {
  open: boolean
  onClose: () => void
  initial?: ModifierGroup | null
}

export function ModifierGroupModal({ open, onClose, initial }: ModifierGroupModalProps) {
  const [g, setG] = useState<ModifierGroup>(() => initial ?? emptyModifierGroup())

  useEffect(() => {
    if (open) setG(initial ?? emptyModifierGroup())
  }, [open, initial])

  function patch<K extends keyof ModifierGroup>(key: K, value: ModifierGroup[K]) {
    setG((prev) => ({ ...prev, [key]: value }))
  }

  function updateOption(id: string, opt: Partial<ModifierOption>) {
    setG((prev) => ({
      ...prev,
      options: prev.options.map((o) => o.id === id ? { ...o, ...opt } : o),
    }))
  }

  function addOption() {
    setG((prev) => ({
      ...prev,
      options: [...prev.options, { id: _uid('o'), name: '', price: '' }],
    }))
  }

  function removeOption(id: string) {
    setG((prev) => ({
      ...prev,
      options: prev.options.filter((o) => o.id !== id),
    }))
  }

  function save() {
    productActions.upsertModifierGroup(g)
    onClose()
  }

  function remove() {
    if (initial) productActions.removeModifierGroup(initial.id)
    onClose()
  }

  const isEdit = !!initial
  const title = isEdit ? 'Edit Modifier Group' : 'Add Modifier Group'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <ModalButtonDestructive onClick={remove}>Delete</ModalButtonDestructive>
          <div className="flex items-center gap-3">
            <ModalButtonSecondary onClick={onClose}>Cancel</ModalButtonSecondary>
            <ModalButtonPrimary onClick={save}>Save</ModalButtonPrimary>
          </div>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <Field label="Title" required>
          <TextInput
            placeholder="Enter title"
            value={g.name}
            onChange={(e) => patch('name', e.target.value)}
            autoFocus
          />
        </Field>

        <div className="flex flex-col gap-3">
          <CheckboxField checked={g.required} onChange={(n) => patch('required', n)}>
            Required
          </CheckboxField>
          <CheckboxField checked={g.multipleOptions} onChange={(n) => patch('multipleOptions', n)}>
            Multiple options can be selected
          </CheckboxField>
          <CheckboxField checked={g.enableOptionPrefixes} onChange={(n) => patch('enableOptionPrefixes', n)}>
            Enable option prefixes
          </CheckboxField>
        </div>

        {/* Availability — options sub-table */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="typo-body-sm font-semibold text-vintiga-slate-900">Availability</h3>
            <button
              type="button"
              onClick={addOption}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm font-semibold text-vintiga-slate-700 hover:bg-vintiga-slate-50 transition-colors cursor-pointer"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              Add Option
            </button>
          </div>

          <div className="border border-vintiga-slate-200 rounded-vintiga-lg overflow-hidden">
            <div className="grid grid-cols-[32px_1fr_120px_40px] items-center gap-2 px-3 py-2.5 bg-vintiga-slate-50 border-b border-vintiga-slate-200">
              <span />
              <span className="typo-caption font-semibold text-vintiga-slate-600">Option</span>
              <span className="typo-caption font-semibold text-vintiga-slate-600">Price</span>
              <span />
            </div>
            {g.options.map((o) => (
              <div
                key={o.id}
                className="grid grid-cols-[32px_1fr_120px_40px] items-center gap-2 px-3 py-2 border-b border-vintiga-slate-200 last:border-b-0"
              >
                <button
                  type="button"
                  className="w-6 h-6 flex items-center justify-center text-vintiga-slate-400 hover:text-vintiga-slate-600 bg-transparent border-none cursor-grab"
                  aria-label="Reorder option"
                >
                  <GripVerticalIcon className="w-4 h-4" />
                </button>
                <TextInput
                  placeholder="Enter modifier"
                  value={o.name}
                  onChange={(e) => updateOption(o.id, { name: e.target.value })}
                  className="!h-9"
                />
                <InputWithAdornment
                  adornment="$"
                  placeholder="0.00"
                  value={o.price}
                  onChange={(e) => updateOption(o.id, { price: e.target.value })}
                  className="!h-9"
                />
                <button
                  type="button"
                  onClick={() => removeOption(o.id)}
                  className="w-8 h-8 rounded-vintiga-md flex items-center justify-center text-vintiga-slate-400 hover:text-vintiga-red-600 hover:bg-vintiga-slate-50 transition-colors bg-transparent border-none cursor-pointer"
                  aria-label="Remove option"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
