// POS Profiles — edit modals.
// Each modal edits one card of a profile. Modals take the profile, seed a local
// draft when opened, and commit via saveProfile on Save. In a Commerce7-
// connected store (`readOnly`) most fields are locked; only collection colors
// and images-on/off stay editable (ticket rule).

import { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@ds/shared/Modal'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { Switch } from '@ds/shared/Switch'
import { TextField } from '@ds/shared/TextField'
import { Select } from '@ds/shared/Select'
import { Field } from '@ds/shared/Field'
import { SegmentedControl } from '@ds/shared/SegmentedControl'
import { TrashIcon, PlusIcon, SearchIcon, GripVerticalIcon, LockIcon } from '@ds/icons/Icons'
import {
  COLOR_SWATCHES,
  OPERATIONAL_LOCATIONS,
  INVENTORY_LOCATIONS,
  DEVICE_TYPES,
  PRINTER_TYPES,
  nextId,
  type Profile,
  type Collection,
  type Printer,
  type Device,
} from './data'
import { saveProfile } from './store'

// ─── Shared primitives ────────────────────────────────────────────────────────
// Modals are mounted fresh each time they open (EditModals renders only the
// active one), so a plain useState seeded from the profile is the whole "draft
// resets on open" story — no effect needed.

function ReadOnlyBanner() {
  return (
    <div className="flex items-center gap-vintiga-sm rounded-vintiga-md bg-vintiga-slate-50 border border-vintiga-slate-100 px-vintiga-md py-vintiga-sm">
      <LockIcon className="w-4 h-4 text-vintiga-slate-400 shrink-0" />
      <p className="typo-caption text-vintiga-slate-500">Managed by Commerce7 — these fields are read-only in a connected store.</p>
    </div>
  )
}

const HEX_INPUT_CLS =
  'w-24 h-9 rounded-vintiga-md border border-vintiga-slate-200 px-2.5 typo-body-sm text-vintiga-slate-900 uppercase focus:outline-none focus:border-vintiga-indigo-600 disabled:bg-vintiga-slate-50 disabled:text-vintiga-slate-400'

function ColorSwatch({ hex }: { hex: string }) {
  return <span className="w-6 h-6 rounded-vintiga-md border border-vintiga-border shrink-0" style={{ backgroundColor: hex }} />
}

/** Swatch + hex input + optional quick-pick palette. */
function ColorField({ value, onChange, disabled, palette }: { value: string; onChange: (hex: string) => void; disabled?: boolean; palette?: boolean }) {
  return (
    <div className="flex items-center gap-vintiga-sm flex-wrap">
      <ColorSwatch hex={value} />
      <input value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} className={HEX_INPUT_CLS} aria-label="Color hex value" />
      {palette && !disabled && (
        <div className="flex items-center gap-1">
          {COLOR_SWATCHES.map((s) => (
            <button
              key={s.hex}
              type="button"
              onClick={() => onChange(s.hex)}
              aria-label={s.label}
              title={s.label}
              className={[
                'w-6 h-6 rounded-full border transition-transform hover:scale-110',
                value.toLowerCase() === s.hex.toLowerCase() ? 'border-vintiga-slate-900 ring-2 ring-vintiga-slate-200' : 'border-transparent',
              ].join(' ')}
              style={{ backgroundColor: s.hex }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/** Footer: Cancel + Save, or a single Close when read-only. */
function EditFooter({ readOnly, onClose, onSave, saveDisabled }: { readOnly?: boolean; onClose: () => void; onSave?: () => void; saveDisabled?: boolean }) {
  if (readOnly && !onSave) {
    return (
      <ModalFooter>
        <Button variant="outline" size="lg" onClick={onClose}>Close</Button>
      </ModalFooter>
    )
  }
  return (
    <ModalFooter>
      <Button variant="outline" size="lg" onClick={onClose}>Cancel</Button>
      <Button variant="solid" size="lg" onClick={onSave} disabled={saveDisabled}>Save</Button>
    </ModalFooter>
  )
}

type ModalProps = { profile: Profile; open: boolean; onClose: () => void; readOnly?: boolean }

// ─── Details (General) ────────────────────────────────────────────────────────

export function DetailsModal({ profile, open, onClose, readOnly }: ModalProps) {
  const [draft, setDraft] = useState<Profile>(profile)
  const commit = () => { saveProfile(draft); onClose() }
  return (
    <Modal open={open} onClose={onClose} size="lg">
      <ModalHeader title="Details" onClose={onClose} />
      <ModalBody>
        {readOnly && <ReadOnlyBanner />}
        <Field label="Name">
          <TextField value={draft.name} disabled={readOnly} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Profile name" />
        </Field>
        <Field label="Operational Location">
          <Select value={draft.operationalLocation} disabled={readOnly} onChange={(e) => setDraft({ ...draft, operationalLocation: e.target.value })} options={OPERATIONAL_LOCATIONS} />
        </Field>
        <Field label="Color Code">
          <ColorField value={draft.colorHex} disabled={readOnly} palette onChange={(hex) => setDraft({ ...draft, colorHex: hex })} />
        </Field>
        <Field label="Default Sales Attribute">
          <TextField value={draft.salesAttribute} disabled={readOnly} onChange={(e) => setDraft({ ...draft, salesAttribute: e.target.value })} placeholder="POS" />
        </Field>
        <Switch checked={draft.isDefault} disabled={readOnly} onChange={(v) => setDraft({ ...draft, isDefault: v })} label="Default POS Profile" description="Use this profile by default at checkout." labelPosition="between" />
      </ModalBody>
      <EditFooter readOnly={readOnly} onClose={onClose} onSave={readOnly ? undefined : commit} saveDisabled={!draft.name.trim()} />
    </Modal>
  )
}

// ─── Product Collections ──────────────────────────────────────────────────────
// Color + images-on/off stay editable even in a C7 store; add / delete / reorder
// are locked there.

const AVAILABLE_COLLECTIONS = ['Wine Selection', 'Appetizers', 'Tasting Experiences', 'Small Plates', 'Merchandise', 'Gift Cards', 'Club Exclusives', 'Desserts']

export function CollectionsModal({ profile, open, onClose, readOnly }: ModalProps) {
  const [draft, setDraft] = useState<Profile>(profile)
  const [search, setSearch] = useState('')
  const [dragId, setDragId] = useState<string | null>(null)

  const setCollections = (collections: Collection[]) => setDraft({ ...draft, collections })
  const patch = (id: string, p: Partial<Collection>) => setCollections(draft.collections.map((c) => (c.id === id ? { ...c, ...p } : c)))
  const remove = (id: string) => setCollections(draft.collections.filter((c) => c.id !== id).map((c, i) => ({ ...c, sortOrder: i + 1 })))
  // Hold-and-drag reorder — drop the dragged collection onto a target row.
  const reorder = (targetId: string) => {
    if (!dragId || dragId === targetId) return
    const arr = [...draft.collections]
    const from = arr.findIndex((c) => c.id === dragId)
    const to = arr.findIndex((c) => c.id === targetId)
    if (from < 0 || to < 0) return
    const [moved] = arr.splice(from, 1)
    arr.splice(to, 0, moved)
    setCollections(arr.map((c, k) => ({ ...c, sortOrder: k + 1 })))
  }
  const add = (name: string) => {
    setCollections([...draft.collections, { id: nextId('col'), name, productCount: 0, colorHex: '#6366F1', showImages: true, sortOrder: draft.collections.length + 1 }])
    setSearch('')
  }

  const commit = () => { saveProfile(draft); onClose() }
  const suggestions = AVAILABLE_COLLECTIONS.filter((n) => n.toLowerCase().includes(search.toLowerCase()) && !draft.collections.some((c) => c.name === n))

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <ModalHeader title="Product Collections" onClose={onClose} />
      <ModalBody className="max-h-[64vh] overflow-y-auto">
        {readOnly && (
          <div className="flex items-center gap-vintiga-sm rounded-vintiga-md bg-vintiga-slate-50 border border-vintiga-slate-100 px-vintiga-md py-vintiga-sm">
            <LockIcon className="w-4 h-4 text-vintiga-slate-400 shrink-0" />
            <p className="typo-caption text-vintiga-slate-500">Connected to Commerce7 — you can still change collection colors and images.</p>
          </div>
        )}
        <Field label="Add Collections">
          <div className="relative">
            <TextField value={search} disabled={readOnly} leftIcon={<SearchIcon />} placeholder="Add Collections" onChange={(e) => setSearch(e.target.value)} />
            {!readOnly && search && suggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-vintiga-md border border-vintiga-border bg-vintiga-white shadow-vintiga-md p-1">
                {suggestions.map((n) => (
                  <button key={n} type="button" onClick={() => add(n)} className="w-full text-left px-3 py-2 rounded-vintiga-input typo-body-sm text-vintiga-slate-700 hover:bg-vintiga-slate-50">
                    {n}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Field>

        {draft.collections.length === 0 ? (
          <p className="typo-body-sm text-vintiga-slate-500 text-center py-vintiga-lg">No collections yet. Search above to add one.</p>
        ) : (
          <div className="flex flex-col gap-vintiga-sm">
            {!readOnly && <p className="typo-caption text-vintiga-slate-400">Drag the handle to reorder.</p>}
            {draft.collections.map((c) => (
              <div
                key={c.id}
                onDragOver={(e) => { if (!readOnly && dragId) e.preventDefault() }}
                onDrop={() => reorder(c.id)}
                className={[
                  'rounded-vintiga-card border border-vintiga-border overflow-hidden transition-opacity',
                  dragId === c.id ? 'opacity-50' : '',
                  dragId && dragId !== c.id ? 'border-dashed' : '',
                ].join(' ')}
              >
                <div className="bg-vintiga-slate-50 px-vintiga-md py-vintiga-sm flex items-center gap-vintiga-sm">
                  {!readOnly && (
                    <span
                      draggable
                      onDragStart={() => setDragId(c.id)}
                      onDragEnd={() => setDragId(null)}
                      aria-label={`Reorder ${c.name}`}
                      className="text-vintiga-slate-400 hover:text-vintiga-slate-700 cursor-grab active:cursor-grabbing [&>svg]:w-4 [&>svg]:h-4"
                    >
                      <GripVerticalIcon />
                    </span>
                  )}
                  <span className="typo-body-sm font-semibold text-vintiga-slate-900">{c.name}</span>
                </div>
                <div className="px-vintiga-md py-vintiga-md flex items-center gap-vintiga-md flex-wrap">
                  <ColorField value={c.colorHex} onChange={(hex) => patch(c.id, { colorHex: hex })} />
                  <span className="typo-body-sm text-vintiga-slate-500">color</span>
                  <div className="ml-auto flex items-center gap-vintiga-md">
                    <Switch checked={c.showImages} onChange={(v) => patch(c.id, { showImages: v })} label="Images" size="md" />
                    <IconButton size="sm" variant="outline" intent="destructive" icon={<TrashIcon />} aria-label={`Remove ${c.name}`} onClick={() => remove(c.id)} disabled={readOnly} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ModalBody>
      <EditFooter onClose={onClose} onSave={commit} />
    </Modal>
  )
}

// ─── Tips ─────────────────────────────────────────────────────────────────────

export function TipsModal({ profile, open, onClose, readOnly }: ModalProps) {
  const [draft, setDraft] = useState<Profile>(profile)
  const commit = () => { saveProfile(draft); onClose() }
  const setOption = (i: number, val: string) => {
    const tipOptions = [...draft.tipOptions]
    tipOptions[i] = val
    setDraft({ ...draft, tipOptions })
  }
  const suffix = draft.tipType === 'percentage' ? '%' : '$'
  return (
    <Modal open={open} onClose={onClose} size="lg">
      <ModalHeader title="Tips" onClose={onClose} />
      <ModalBody>
        {readOnly && <ReadOnlyBanner />}
        <Switch checked={draft.tipsEnabled} disabled={readOnly} onChange={(v) => setDraft({ ...draft, tipsEnabled: v })} label="Tips" description="Prompt guests to add a tip." labelPosition="between" />
        <Field label="Tip Type">
          <SegmentedControl
            value={draft.tipType}
            onChange={(v) => !readOnly && setDraft({ ...draft, tipType: v })}
            options={[
              { value: 'percentage', label: 'Percentage' },
              { value: 'amounts', label: 'Amounts' },
            ]}
            aria-label="Tip type"
          />
        </Field>
        <Field label="Tip Options">
          <div className="grid grid-cols-4 gap-vintiga-sm">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="relative">
                <input
                  value={draft.tipOptions[i] ?? ''}
                  disabled={readOnly}
                  onChange={(e) => setOption(i, e.target.value)}
                  aria-label={`Tip option ${i + 1}`}
                  className="w-full h-10 rounded-vintiga-md border border-vintiga-slate-200 pl-3 pr-7 typo-body-sm text-vintiga-slate-900 focus:outline-none focus:border-vintiga-indigo-600 disabled:bg-vintiga-slate-50 disabled:text-vintiga-slate-400"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 typo-body-sm text-vintiga-slate-400">{suffix}</span>
              </div>
            ))}
          </div>
        </Field>
        <Switch checked={draft.displayOnEmv} disabled={readOnly} onChange={(v) => setDraft({ ...draft, displayOnEmv: v })} label="Display on EMV" description="Show the tip prompt on the card terminal." labelPosition="between" />
      </ModalBody>
      <EditFooter readOnly={readOnly} onClose={onClose} onSave={readOnly ? undefined : commit} />
    </Modal>
  )
}

// ─── Advanced Settings (finalizing orders & employee PINs) ────────────────────

const ROW = 'flex items-center justify-between gap-vintiga-md py-vintiga-xs'

function BoolRow({ label, checked, onChange, disabled, indented }: { label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean; indented?: boolean }) {
  return (
    <div className={`${ROW} ${indented ? 'pl-vintiga-lg' : ''}`}>
      <span className={`typo-body-sm ${disabled ? 'text-vintiga-slate-400' : 'text-vintiga-slate-900'}`}>{label}</span>
      <Switch checked={checked} disabled={disabled} onChange={onChange} aria-label={label} />
    </div>
  )
}

export function AdvancedModal({ profile, open, onClose, readOnly }: ModalProps) {
  const [draft, setDraft] = useState<Profile>(profile)
  const commit = () => { saveProfile(draft); onClose() }
  const set = (patch: Partial<Profile>) => setDraft({ ...draft, ...patch })
  return (
    <Modal open={open} onClose={onClose} size="lg">
      <ModalHeader title="Advanced Settings" description="Finalizing orders & employee PINs" onClose={onClose} />
      <ModalBody>
        {readOnly && <ReadOnlyBanner />}
        <div className="flex flex-col divide-y divide-vintiga-slate-100">
          <BoolRow label="Employee PIN Login" checked={draft.employeePin} disabled={readOnly} onChange={(v) => set({ employeePin: v })} />
          <BoolRow label="Require PIN before payment" checked={draft.requirePinBeforePayment} disabled={readOnly} onChange={(v) => set({ requirePinBeforePayment: v })} />
          <BoolRow label="Require PIN after order" checked={draft.requirePinAfterOrder} disabled={readOnly} onChange={(v) => set({ requirePinAfterOrder: v })} />
          <BoolRow label="Prompt “Additional Order Info” before payment" checked={draft.additionalOrderInfo} disabled={readOnly} onChange={(v) => set({ additionalOrderInfo: v })} />
          {/* Kitchen tickets gate the "send to kitchen" prompt — turning tickets
              off disables and clears the dependent prompt. */}
          <BoolRow label="Kitchen Tickets" checked={draft.kitchenTickets} disabled={readOnly} onChange={(v) => set({ kitchenTickets: v, sendToKitchen: v ? draft.sendToKitchen : false })} />
          <BoolRow label="Prompt “Send Items to Kitchen” before payment" checked={draft.sendToKitchen} disabled={readOnly || !draft.kitchenTickets} onChange={(v) => set({ sendToKitchen: v })} indented />
          <BoolRow label="Table Management" checked={draft.tableManagement} disabled={readOnly} onChange={(v) => set({ tableManagement: v })} />
        </div>
      </ModalBody>
      <EditFooter readOnly={readOnly} onClose={onClose} onSave={readOnly ? undefined : commit} />
    </Modal>
  )
}

// ─── Printers ─────────────────────────────────────────────────────────────────

export function PrintersModal({ profile, open, onClose, readOnly }: ModalProps) {
  const [draft, setDraft] = useState<Profile>(profile)
  const commit = () => { saveProfile(draft); onClose() }
  const setPrinters = (printers: Printer[]) => setDraft({ ...draft, printers })
  const patch = (id: string, p: Partial<Printer>) => setPrinters(draft.printers.map((x) => (x.id === id ? { ...x, ...p } : x)))
  const add = () => setPrinters([...draft.printers, { id: nextId('prt'), title: '', printerId: '', type: PRINTER_TYPES[0] }])
  return (
    <Modal open={open} onClose={onClose} size="lg">
      <ModalHeader title="Printers" onClose={onClose} />
      <ModalBody className="max-h-[64vh] overflow-y-auto">
        {readOnly && <ReadOnlyBanner />}
        {draft.printers.length === 0 && <p className="typo-body-sm text-vintiga-slate-500 text-center py-vintiga-md">No printers configured.</p>}
        {draft.printers.map((pr) => (
          <div key={pr.id} className="rounded-vintiga-card border border-vintiga-border p-vintiga-md flex flex-col gap-vintiga-sm">
            <div className="flex items-center gap-vintiga-sm">
              <TextField className="flex-1" value={pr.title} disabled={readOnly} placeholder="Printer title" onChange={(e) => patch(pr.id, { title: e.target.value })} />
              <IconButton size="md" variant="outline" intent="destructive" icon={<TrashIcon />} aria-label="Remove printer" disabled={readOnly} onClick={() => setPrinters(draft.printers.filter((x) => x.id !== pr.id))} />
            </div>
            <div className="grid grid-cols-2 gap-vintiga-sm">
              <TextField value={pr.printerId} disabled={readOnly} placeholder="Printer ID" onChange={(e) => patch(pr.id, { printerId: e.target.value })} />
              <Select value={pr.type} disabled={readOnly} onChange={(e) => patch(pr.id, { type: e.target.value })} options={PRINTER_TYPES} />
            </div>
          </div>
        ))}
        {!readOnly && (
          <Button variant="outline" size="md" leftIcon={<PlusIcon />} onClick={add}>Add printer</Button>
        )}
      </ModalBody>
      <EditFooter readOnly={readOnly} onClose={onClose} onSave={readOnly ? undefined : commit} />
    </Modal>
  )
}

// ─── Chip & PIN devices ───────────────────────────────────────────────────────

export function DevicesModal({ profile, open, onClose, readOnly }: ModalProps) {
  const [draft, setDraft] = useState<Profile>(profile)
  const commit = () => { saveProfile(draft); onClose() }
  const setDevices = (devices: Device[]) => setDraft({ ...draft, devices })
  const patch = (id: string, p: Partial<Device>) => setDevices(draft.devices.map((x) => (x.id === id ? { ...x, ...p } : x)))
  const add = () => setDevices([...draft.devices, { id: nextId('dev'), title: '', terminalId: '', type: DEVICE_TYPES[0] }])
  return (
    <Modal open={open} onClose={onClose} size="lg">
      <ModalHeader title="Chip & PIN Devices" onClose={onClose} />
      <ModalBody className="max-h-[64vh] overflow-y-auto">
        {readOnly && <ReadOnlyBanner />}
        {draft.devices.length === 0 && <p className="typo-body-sm text-vintiga-slate-500 text-center py-vintiga-md">No devices configured.</p>}
        {draft.devices.map((d) => (
          <div key={d.id} className="rounded-vintiga-card border border-vintiga-border p-vintiga-md flex flex-col gap-vintiga-sm">
            <div className="flex items-center gap-vintiga-sm">
              <TextField className="flex-1" value={d.title} disabled={readOnly} placeholder="Device title" onChange={(e) => patch(d.id, { title: e.target.value })} />
              <IconButton size="md" variant="outline" intent="destructive" icon={<TrashIcon />} aria-label="Remove device" disabled={readOnly} onClick={() => setDevices(draft.devices.filter((x) => x.id !== d.id))} />
            </div>
            <div className="grid grid-cols-2 gap-vintiga-sm">
              <TextField value={d.terminalId} disabled={readOnly} placeholder="Terminal ID" onChange={(e) => patch(d.id, { terminalId: e.target.value })} />
              <Select value={d.type} disabled={readOnly} onChange={(e) => patch(d.id, { type: e.target.value })} options={DEVICE_TYPES} />
            </div>
          </div>
        ))}
        {!readOnly && (
          <Button variant="outline" size="md" leftIcon={<PlusIcon />} onClick={add}>Add device</Button>
        )}
      </ModalBody>
      <EditFooter readOnly={readOnly} onClose={onClose} onSave={readOnly ? undefined : commit} />
    </Modal>
  )
}

// ─── Inventory ────────────────────────────────────────────────────────────────

export function InventoryModal({ profile, open, onClose, readOnly }: ModalProps) {
  const [draft, setDraft] = useState<Profile>(profile)
  const commit = () => { saveProfile(draft); onClose() }
  return (
    <Modal open={open} onClose={onClose} size="lg">
      <ModalHeader title="Inventory" description="Physical locations mapped to inventory locations." onClose={onClose} />
      <ModalBody>
        {readOnly && <ReadOnlyBanner />}
        <Field label="Carry-out Location">
          <Select value={draft.carryOutLocation} disabled={readOnly} onChange={(e) => setDraft({ ...draft, carryOutLocation: e.target.value })} options={INVENTORY_LOCATIONS} />
        </Field>
        <Field label="Shipping Location">
          <Select value={draft.shipLocation} disabled={readOnly} onChange={(e) => setDraft({ ...draft, shipLocation: e.target.value })} options={INVENTORY_LOCATIONS} />
        </Field>
        <Field label="Pickup Location">
          <Select value={draft.pickupLocation} disabled={readOnly} onChange={(e) => setDraft({ ...draft, pickupLocation: e.target.value })} options={INVENTORY_LOCATIONS} />
        </Field>
      </ModalBody>
      <EditFooter readOnly={readOnly} onClose={onClose} onSave={readOnly ? undefined : commit} />
    </Modal>
  )
}

// ─── Add profile (stand-alone only) ───────────────────────────────────────────

export function AddProfileModal({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (draft: { name: string; operationalLocation: string; colorHex: string; isDefault: boolean }) => void }) {
  // Rendered only while open (the list conditionally mounts it), so a plain
  // useState seed is a clean reset each time it opens.
  const [name, setName] = useState('')
  const [operationalLocation, setLocation] = useState(OPERATIONAL_LOCATIONS[0])
  const [colorHex, setColor] = useState('#6366F1')
  const [isDefault, setDefault] = useState(false)
  const create = () => { onCreate({ name: name.trim(), operationalLocation, colorHex, isDefault }); onClose() }
  return (
    <Modal open={open} onClose={onClose} size="lg">
      <ModalHeader title="Add POS Profile" description="Create a new profile for this store." onClose={onClose} />
      <ModalBody>
        <Field label="Name">
          <TextField value={name} autoFocus placeholder="e.g. Patio Bar" onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Operational Location">
          <Select value={operationalLocation} onChange={(e) => setLocation(e.target.value)} options={OPERATIONAL_LOCATIONS} />
        </Field>
        <Field label="Color Code">
          <ColorField value={colorHex} palette onChange={setColor} />
        </Field>
        <Switch checked={isDefault} onChange={setDefault} label="Default POS Profile" description="Use this profile by default at checkout." labelPosition="between" />
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" size="lg" onClick={onClose}>Cancel</Button>
        <Button variant="solid" size="lg" onClick={create} disabled={!name.trim()}>Create profile</Button>
      </ModalFooter>
    </Modal>
  )
}

// ─── Modal id union — which card's editor is open ─────────────────────────────

export type EditModalId = 'details' | 'collections' | 'tips' | 'advanced' | 'printers' | 'devices' | 'inventory'

export function EditModals({ profile, active, onClose, readOnly }: { profile: Profile; active: EditModalId | null; onClose: () => void; readOnly?: boolean }) {
  if (!active) return null
  // Render only the active modal so it mounts fresh (draft seeds from the
  // current profile) and unmounts on close.
  const props = { profile, open: true, onClose, readOnly }
  switch (active) {
    case 'details': return <DetailsModal {...props} />
    case 'collections': return <CollectionsModal {...props} />
    case 'tips': return <TipsModal {...props} />
    case 'advanced': return <AdvancedModal {...props} />
    case 'printers': return <PrintersModal {...props} />
    case 'devices': return <DevicesModal {...props} />
    case 'inventory': return <InventoryModal {...props} />
    default: return null
  }
}
