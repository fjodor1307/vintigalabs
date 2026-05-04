import { useState } from 'react'
import { ClubEditorLayout } from './ClubEditorLayout'
import { useClubState, clubActions } from './clubStore'
import { SectionCard } from '@ds/shared/SectionCard'
import { Field } from '@ds/shared/Field'
import { TextField } from '@ds/shared/TextField'
import { Select } from '@ds/shared/Select'
import { Switch } from '@ds/shared/Switch'
import { Button } from '@ds/shared/Button'
import {
  SearchIcon,
  CalendarIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
  LinkIcon,
  ImageIcon,
  UndoIcon,
  RedoIcon,
} from '@ds/icons/Icons'

// ─── AddReleaseScreen ─────────────────────────────────────────────────────────
// Sub-page from the Releases tab. Two-column layout — Products + Shipment on
// the left, Settings panel on the right (replaces the Club Details rail). Save
// button in the page header writes the release into the store and navigates
// back to the Releases tab.

export function AddReleaseScreen() {
  const club = useClubState()
  const [title, setTitle]                       = useState('')
  const [minQty, setMinQty]                     = useState(1)
  const [maxQty, setMaxQty]                     = useState<string>('')
  const [minOrderSubtotal, setMinOrderSubtotal] = useState(0)
  const [autoProcessDate, setAutoProcessDate]   = useState('')
  const [startTime, setStartTime]               = useState('')
  const [startMeridiem, setStartMeridiem]       = useState<'AM' | 'PM'>('PM')
  const [shipmentInstructions, setShipmentInstructions] = useState('')
  const [letMembersProcessEarly, setLetMembersProcessEarly] = useState(false)
  const [allowSkipOnline, setAllowSkipOnline]   = useState(false)

  function save() {
    clubActions.addRelease({
      id: `r${club.releases.length + 1}`,
      title: title || 'Untitled Release',
      minQty,
      maxQty: maxQty ? Number(maxQty) : undefined,
      minOrderSubtotal,
      autoProcessDate,
      startTime: startTime ? `${startTime} ${startMeridiem}` : undefined,
      shipmentInstructions,
      letMembersProcessEarly,
      allowSkipOnline,
      productCount: 0,
    })
    window.location.hash = '#/web/clubs/new/releases'
  }

  return (
    <ClubEditorLayout
      activeTab={null}
      hideRail
      extraCrumbs={[
        { label: club.name || 'New club', href: '#/web/clubs/new/overview' },
        { label: 'Add Club Release' },
      ]}
      actions={<Button onClick={save}>Save</Button>}
    >
      <div className="flex gap-vintiga-lg">
        {/* Main column */}
        <div className="flex-1 min-w-0 flex flex-col gap-vintiga-lg">
          <SectionCard title="Products">
            <Field label="Add Product">
              <TextField placeholder="Search products" leftIcon={<SearchIcon className="w-4 h-4" />} />
            </Field>
          </SectionCard>

          <SectionCard title="Shipment">
            <Field
              label="Shipment Instructions"
              helper={<>Content will be embed into the shipment reminder emails through the <code className="px-1 py-0.5 rounded bg-vintiga-slate-100 typo-caption">{'{{emailinstructions}}'}</code> variable.</>}
            >
              <RichTextStub value={shipmentInstructions} onChange={setShipmentInstructions} />
            </Field>
          </SectionCard>
        </div>

        {/* Right settings column */}
        <aside className="hidden lg:flex w-[360px] shrink-0">
          <SectionCard title="Settings" className="w-full">
            <Field label="Title">
              <TextField placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </Field>
            <Field label="Min Quantity of Products">
              <TextField
                type="number"
                value={String(minQty)}
                onChange={(e) => setMinQty(Number(e.target.value))}
              />
            </Field>
            <Field label="Max Quantity of Products">
              <TextField
                type="number"
                placeholder=""
                value={maxQty}
                onChange={(e) => setMaxQty(e.target.value)}
              />
            </Field>
            <Field label="Minimum Order Subtotal">
              <div className="relative">
                <input
                  type="number"
                  value={minOrderSubtotal}
                  onChange={(e) => setMinOrderSubtotal(Number(e.target.value))}
                  className="h-10 w-full pl-3 pr-9 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors"
                />
                <span className="absolute top-1/2 -translate-y-1/2 right-3 typo-body-sm text-vintiga-slate-400 pointer-events-none">$</span>
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-vintiga-sm">
              <Field label="Auto Process Date">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="dd.mm.yyyy"
                    value={autoProcessDate}
                    onChange={(e) => setAutoProcessDate(e.target.value)}
                    className="h-10 w-full pl-3 pr-9 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors"
                  />
                  <CalendarIcon className="absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-vintiga-slate-400 pointer-events-none" />
                </div>
              </Field>
              <Field label="Start Time">
                <div className="flex gap-1">
                  <input
                    type="text"
                    placeholder="--:--"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="h-10 flex-1 min-w-0 px-3 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400 focus:outline-none focus:border-vintiga-indigo-500 focus:ring-2 focus:ring-vintiga-indigo-100 transition-colors"
                  />
                  <Select
                    value={startMeridiem}
                    onChange={(e) => setStartMeridiem(e.target.value as 'AM' | 'PM')}
                    options={['AM', 'PM']}
                    className="!w-[72px]"
                  />
                </div>
              </Field>
            </div>

            <div className="flex flex-col gap-vintiga-md pt-vintiga-sm">
              <SwitchRow
                label="Let members process and receive order before processing date"
                helper={'Displays a "Ship Now" option'}
                checked={letMembersProcessEarly}
                onChange={setLetMembersProcessEarly}
              />
              <SwitchRow
                label="Allow members to skip their shipment online"
                checked={allowSkipOnline}
                onChange={setAllowSkipOnline}
              />
            </div>
          </SectionCard>
        </aside>
      </div>
    </ClubEditorLayout>
  )
}

// ─── Rich-text editor stub ────────────────────────────────────────────────────
// Toolbar is decorative (matches Figma) — the actual editor is a plain
// textarea. Real RTE wiring is a future build.

function ToolBtn({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="w-8 h-8 inline-flex items-center justify-center rounded-vintiga-md text-vintiga-slate-500 hover:bg-vintiga-white hover:text-vintiga-slate-900 transition-colors bg-transparent border-none cursor-pointer [&>svg]:w-4 [&>svg]:h-4"
    >
      {children}
    </button>
  )
}

function RichTextStub({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="border border-vintiga-slate-200 rounded-vintiga-md overflow-hidden bg-vintiga-white">
      <div className="flex items-center gap-1 px-2 py-1 bg-vintiga-slate-50 border-b border-vintiga-slate-200 flex-wrap">
        <ToolBtn label="Undo"><UndoIcon /></ToolBtn>
        <ToolBtn label="Redo"><RedoIcon /></ToolBtn>
        <span className="w-px h-5 bg-vintiga-slate-200 mx-1" />
        <ToolBtn label="Bold"><BoldIcon /></ToolBtn>
        <ToolBtn label="Italic"><ItalicIcon /></ToolBtn>
        <ToolBtn label="Underline"><UnderlineIcon /></ToolBtn>
        <span className="w-px h-5 bg-vintiga-slate-200 mx-1" />
        <ToolBtn label="Align left"><AlignLeftIcon /></ToolBtn>
        <ToolBtn label="Align center"><AlignCenterIcon /></ToolBtn>
        <ToolBtn label="Align right"><AlignRightIcon /></ToolBtn>
        <ToolBtn label="Justify"><AlignJustifyIcon /></ToolBtn>
        <span className="w-px h-5 bg-vintiga-slate-200 mx-1" />
        <ToolBtn label="Link"><LinkIcon /></ToolBtn>
        <ToolBtn label="Image"><ImageIcon /></ToolBtn>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400 focus:outline-none min-h-[160px] resize-y bg-transparent"
      />
    </div>
  )
}

function SwitchRow({
  label,
  helper,
  checked,
  onChange,
}: {
  label: string
  helper?: string
  checked: boolean
  onChange: (next: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-vintiga-md">
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="typo-body-sm font-medium text-vintiga-slate-900">{label}</span>
        {helper && <span className="typo-caption text-vintiga-slate-500">{helper}</span>}
      </div>
      <Switch checked={checked} onChange={onChange} />
    </div>
  )
}
