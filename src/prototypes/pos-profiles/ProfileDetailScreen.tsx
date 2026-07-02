// POS Profiles — detail. Figma `1637-7618`. A read view of one profile in two
// panels; each card has an Edit button opening its modal. The title ⋮ menu
// mirrors the list row (Edit Details / Edit Collections / Duplicate). The
// profile id (and an optional `edit` intent) come from the hash query.

import { useEffect, useState, type ReactNode } from 'react'
import { Breadcrumb } from '@ds/shared/Breadcrumb'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { PopoverMenu } from '@ds/shared/PopoverMenu'
import { EmptyState } from '@ds/shared/EmptyState'
import {
  HomeIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  IdCardIcon,
  PackageIcon,
  PackageOpenIcon,
  DollarIcon,
  SettingsIcon,
  CreditCardIcon,
  ReceiptIcon,
} from '@ds/icons/Icons'
import { PosProfilesShell } from './PosProfilesShell'
import { goToProfile, goToList, listHref } from './nav'
import { EditModals, type EditModalId } from './editModals'
import { useProfile, useReadOnly, duplicateProfile, deleteProfile } from './store'
import { colorName, type Profile } from './data'

// ─── Hash query (reactive) ────────────────────────────────────────────────────

function useHashQuery(): URLSearchParams {
  const [q, setQ] = useState(() => window.location.hash.split('?')[1] ?? '')
  useEffect(() => {
    const on = () => setQ(window.location.hash.split('?')[1] ?? '')
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return new URLSearchParams(q)
}

// ─── Read-view pieces ─────────────────────────────────────────────────────────

function Card({ icon, title, onEdit, editLabel = 'Edit', children }: { icon: ReactNode; title: string; onEdit?: () => void; editLabel?: string; children: ReactNode }) {
  return (
    <section className="border border-vintiga-slate-200 rounded-vintiga-2xl bg-vintiga-white p-vintiga-lg flex flex-col gap-vintiga-md">
      <div className="flex items-center justify-between gap-vintiga-md">
        <div className="flex items-center gap-vintiga-sm text-vintiga-slate-900">
          <span className="text-vintiga-slate-400 [&>svg]:w-[18px] [&>svg]:h-[18px]">{icon}</span>
          <h2 className="typo-title-subsection font-semibold">{title}</h2>
        </div>
        {onEdit && (
          <Button variant="outline" size="sm" leftIcon={<PencilIcon />} onClick={onEdit}>{editLabel}</Button>
        )}
      </div>
      {children}
    </section>
  )
}

function ReadField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="typo-caption font-semibold text-vintiga-slate-500">{label}</span>
      <span className="typo-body-sm text-vintiga-slate-900">{children}</span>
    </div>
  )
}

const onOff = (b: boolean) => (b ? 'On' : 'Off')
const yesNo = (b: boolean) => (b ? 'Yes' : 'No')

function ToggleRow({ label, value, indented }: { label: string; value: string; indented?: boolean }) {
  return (
    <div className={`flex flex-col gap-0.5 py-vintiga-xs ${indented ? 'pl-vintiga-md' : ''}`}>
      <span className="typo-body-sm font-semibold text-vintiga-slate-900">{label}</span>
      <span className="typo-body-sm text-vintiga-slate-500">{value}</span>
    </div>
  )
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function ProfileDetailScreen() {
  const params = useHashQuery()
  const id = params.get('id')
  const editParam = params.get('edit')
  const profile = useProfile(id)
  const readOnly = useReadOnly()
  // Seed from the deep-link `edit` intent at mount (list row ⋮ → Edit Details/…);
  // thereafter it's driven by the card Edit buttons.
  const [active, setActive] = useState<EditModalId | null>(() => {
    const valid = ['details', 'collections', 'tips', 'advanced', 'printers', 'devices', 'inventory']
    return editParam && valid.includes(editParam) ? (editParam as EditModalId) : null
  })

  if (!profile) {
    return (
      <PosProfilesShell>
        <div className="p-vintiga-xl">
          <EmptyState icon={<IdCardIcon />} title="Profile not found" description="It may have been removed." action={<Button as="a" href={listHref}>Back to POS Profiles</Button>} />
        </div>
      </PosProfilesShell>
    )
  }

  const p: Profile = profile
  const titleMenuItems = [
    { label: 'Edit Details', onClick: () => setActive('details') },
    { label: 'Edit Collections', onClick: () => setActive('collections') },
    { label: 'Duplicate', onClick: () => { const c = duplicateProfile(p.id); if (c) goToProfile(c.id) } },
    ...(readOnly ? [] : [{ label: 'Delete', danger: true, onClick: () => { deleteProfile(p.id); goToList() } }]),
  ]

  return (
    <PosProfilesShell>
      <div className="p-vintiga-xl flex flex-col gap-vintiga-lg">
        <Breadcrumb items={[{ icon: <HomeIcon />, href: '#/' }, { label: 'POS Profiles', href: listHref }, { label: p.name }]} />

        <div className="flex items-center justify-between gap-vintiga-md">
          <h1 className="typo-title-screen font-semibold text-vintiga-slate-900 flex items-center gap-vintiga-sm">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: p.colorHex }} />
            {p.name}
          </h1>
          <PopoverMenu
            trigger={(_open, toggle) => <IconButton variant="outline" size="md" icon={<EllipsisVerticalIcon />} onClick={toggle} aria-label="Profile actions" />}
            items={titleMenuItems}
            align="right"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-vintiga-lg items-start">
          {/* Left column */}
          <div className="flex-1 min-w-0 w-full flex flex-col gap-vintiga-lg">
            <Card icon={<IdCardIcon />} title="Details" onEdit={() => setActive('details')} editLabel={readOnly ? 'View' : 'Edit'}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-vintiga-md">
                <ReadField label="Name">{p.name}</ReadField>
                <ReadField label="Color Code">
                  <span className="inline-flex items-center gap-vintiga-sm">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.colorHex }} />
                    {colorName(p.colorHex)}
                  </span>
                </ReadField>
                <ReadField label="Default POS Profile">{yesNo(p.isDefault)}</ReadField>
                <ReadField label="Operational Location">{p.operationalLocation}</ReadField>
                <ReadField label="Default Sales Attribute">{p.salesAttribute}</ReadField>
              </div>
            </Card>

            <Card icon={<PackageIcon />} title="Product Collections" onEdit={() => setActive('collections')}>
              {p.collections.length === 0 ? (
                <p className="typo-body-sm text-vintiga-slate-500">No collections.</p>
              ) : (
                <div className="flex flex-col gap-vintiga-sm">
                  {p.collections.map((c) => (
                    <div key={c.id} className="flex items-center justify-between gap-vintiga-md py-vintiga-xs">
                      <span className="flex items-center gap-vintiga-sm min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.colorHex }} />
                        <span className="min-w-0">
                          <span className="typo-body-sm font-medium text-vintiga-slate-900 block truncate">{c.name}</span>
                          <span className="typo-caption text-vintiga-slate-500">{c.productCount} products</span>
                        </span>
                      </span>
                      <span className="typo-caption text-vintiga-slate-500 shrink-0">Images {onOff(c.showImages)}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card icon={<PackageOpenIcon />} title="Inventory" onEdit={() => setActive('inventory')} editLabel={readOnly ? 'View' : 'Edit'}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-vintiga-md">
                <ReadField label="Carry-out Location">{p.carryOutLocation}</ReadField>
                <ReadField label="Shipping Location">{p.shipLocation}</ReadField>
                <ReadField label="Pickup Location">{p.pickupLocation}</ReadField>
              </div>
            </Card>

            <Card icon={<DollarIcon />} title="Tips" onEdit={() => setActive('tips')} editLabel={readOnly ? 'View' : 'Edit'}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-vintiga-md">
                <ReadField label="Tips Enabled">{onOff(p.tipsEnabled)}</ReadField>
                <ReadField label="Tip Type">{p.tipType === 'percentage' ? 'Percentages' : 'Amounts'}</ReadField>
                <div className="sm:col-span-2">
                  <span className="typo-caption font-semibold text-vintiga-slate-500 block mb-1">Tip Options</span>
                  <div className="flex flex-wrap gap-vintiga-xs">
                    {p.tipOptions.map((o, i) => (
                      <span key={i} className="inline-flex items-center typo-caption text-vintiga-slate-700 bg-vintiga-slate-100 px-2.5 py-1 rounded-vintiga-2xl">
                        {o}{p.tipType === 'percentage' ? '%' : ''}
                      </span>
                    ))}
                  </div>
                </div>
                <ReadField label="Display on EMV">{yesNo(p.displayOnEmv)}</ReadField>
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div className="w-full lg:w-80 shrink-0 flex flex-col gap-vintiga-lg">
            <Card icon={<SettingsIcon />} title="Advanced Settings" onEdit={() => setActive('advanced')} editLabel={readOnly ? 'View' : 'Edit'}>
              <div className="flex flex-col divide-y divide-vintiga-slate-100">
                <ToggleRow label="Employee PIN Login" value={onOff(p.employeePin)} />
                <ToggleRow label="Require Pin Before Payment" value={yesNo(p.requirePinBeforePayment)} />
                <ToggleRow label="Require Pin After Order" value={yesNo(p.requirePinAfterOrder)} />
                <ToggleRow label="Additional Order Info" value={yesNo(p.additionalOrderInfo)} />
                <ToggleRow label="Kitchen Tickets" value={onOff(p.kitchenTickets)} />
                <ToggleRow label="Send to Kitchen Window" value={p.kitchenTickets ? yesNo(p.sendToKitchen) : '—'} indented />
                <ToggleRow label="Table Management" value={onOff(p.tableManagement)} />
              </div>
            </Card>

            <Card icon={<CreditCardIcon />} title="Chip & PIN Devices" onEdit={() => setActive('devices')} editLabel={readOnly ? 'View' : 'Edit'}>
              {p.devices.length === 0 ? (
                <p className="typo-body-sm text-vintiga-slate-500">No devices.</p>
              ) : (
                p.devices.map((d) => (
                  <div key={d.id} className="rounded-vintiga-card border border-vintiga-slate-100 p-vintiga-md">
                    <span className="typo-body-sm font-semibold text-vintiga-slate-900 block">{d.title}</span>
                    <span className="typo-caption text-vintiga-slate-500 block">ID: {d.terminalId}</span>
                    <span className="typo-caption text-vintiga-slate-500 block">Type: {d.type}</span>
                  </div>
                ))
              )}
            </Card>

            <Card icon={<ReceiptIcon />} title="Printers" onEdit={() => setActive('printers')} editLabel={readOnly ? 'View' : 'Edit'}>
              {p.printers.length === 0 ? (
                <p className="typo-body-sm text-vintiga-slate-500">No printers.</p>
              ) : (
                <div className="flex flex-col gap-vintiga-sm">
                  {p.printers.map((pr) => (
                    <div key={pr.id} className="rounded-vintiga-card border border-vintiga-slate-100 p-vintiga-md">
                      <span className="typo-body-sm font-semibold text-vintiga-slate-900 block">{pr.title}</span>
                      <span className="typo-caption text-vintiga-slate-500 block">ID: {pr.printerId}</span>
                      <span className="typo-caption text-vintiga-slate-500 block">Type: {pr.type}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <EditModals profile={p} active={active} onClose={() => setActive(null)} readOnly={readOnly} />
    </PosProfilesShell>
  )
}
