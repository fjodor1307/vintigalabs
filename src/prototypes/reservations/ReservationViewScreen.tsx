import { useState } from 'react'
import { AppSidebar } from '@ds/shared/AppSidebar'
import { Navbar } from '@ds/shared/Navbar'
import { useResponsiveSidebar } from '@ds/shared/useResponsiveSidebar'
import { PageTemplate } from '@ds/shared/PageTemplate'
import { BreadcrumbHomeIcon } from '@ds/shared/Breadcrumb'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { Avatar } from '@ds/shared/Avatar'
import { Tag } from '@ds/shared/Tag'
import { Field } from '@ds/shared/Field'
import { Textarea } from '@ds/shared/Textarea'
import { CustomerCard } from '@ds/shared/CustomerCard'
import { SectionCard } from '@ds/shared/SectionCard'
import { AlertSoft } from '@ds/shared/AlertSoft'
import { PopoverMenu } from '@ds/shared/PopoverMenu'
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '@ds/shared/Table'
import { EllipsisVerticalIcon, UserCheckIcon, IdCardIcon, InfoIcon } from '@ds/icons/Icons'
import { Select, TextInput, type Option } from './ResControls'

// ─── ReservationViewScreen ────────────────────────────────────────────────────
// Reservation detail (Figma 4781-28789). Reservation Details + Order Items +
// Order Summary in the main column; a customer card in the rail. Built with
// Vintiga components.

const EXPERIENCES: Option[] = [
  { value: 'any', label: 'Any Experience' },
  { value: 'private-tasting', label: 'Private Tasting Experience' },
  { value: 'lunch', label: 'Lunch' },
]
const OPTIONS: Option[] = [{ value: 'tasting-35', label: 'Tasting ($35.00 / guest)' }]
const HOSTS: Option[] = [{ value: 'none', label: 'None' }, { value: 'jim', label: 'Jim Secord' }]
const TABLES: Option[] = [{ value: '10', label: '10 (1-30)' }, { value: '1', label: '1' }]
const AVAILABILITY = ['11:00 AM', '1:00 PM']

export function ReservationViewScreen() {
  const { collapsed, mobileOpen, onMenuToggle, closeMobile } = useResponsiveSidebar()

  const [experience, setExperience] = useState('any')
  const [host, setHost] = useState('none')
  const [table, setTable] = useState('10')
  const [slot, setSlot] = useState('11:00 AM')
  const [occasion, setOccasion] = useState('')
  const [internalNote, setInternalNote] = useState('')

  return (
    <div className="flex h-full bg-vintiga-white">
      <AppSidebar collapsed={collapsed} mobileOpen={mobileOpen} onMobileClose={closeMobile} activeNav="Reservations" />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Navbar device="responsive" fixed user={{ name: 'Tom Cook', initials: 'TC' }} onMenuToggle={onMenuToggle} onUserClick={() => {}} onNotificationClick={() => {}} />
        <div className="flex-1 overflow-y-auto overflow-x-hidden pt-16 bg-vintiga-white">
          <PageTemplate
            breadcrumbs={[
              { icon: <BreadcrumbHomeIcon />, href: '#/web/reservations' },
              { label: 'Reservations', href: '#/web/reservations' },
              { label: 'Reservation #1004' },
            ]}
            title={
              <div className="flex flex-col gap-0.5">
                <span className="typo-title-screen font-semibold text-vintiga-slate-900 inline-flex items-center gap-vintiga-sm">
                  Reservation #1004
                  <Tag variant="neutral-light" size="md">Reserved</Tag>
                </span>
                <span className="typo-caption text-vintiga-slate-500 uppercase tracking-wide">Apr 13, 2025 at 5:20 PM</span>
              </div>
            }
            actions={
              <>
                <Button leftIcon={<UserCheckIcon className="w-4 h-4" />} onClick={() => {}}>Check In</Button>
                <PopoverMenu
                  align="right"
                  trigger={(_open, toggle) => (
                    <IconButton variant="outline" size="md" icon={<EllipsisVerticalIcon />} aria-label="More actions" onClick={toggle} />
                  )}
                  items={[
                    { label: 'Edit reservation', onClick: () => {} },
                    { label: 'Resend confirmation', onClick: () => {} },
                    { label: 'Cancel reservation', onClick: () => {}, danger: true },
                  ]}
                />
              </>
            }
            rail={<CustomerRail />}
          >
            <div className="flex flex-col gap-vintiga-lg">
              {/* Reservation Details */}
              <SectionCard title="Reservation Details" action={<Tag variant="neutral-light" size="sm">Reserved</Tag>}>
                <Field label="Customer"><TextInput value="Ms Dorothy Ladner" readOnly /></Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
                  <Field label="Experience"><Select value={experience} onChange={setExperience} options={EXPERIENCES} /></Field>
                  <Field label="Option"><Select value={OPTIONS[0].value} options={OPTIONS} disabled /></Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
                  <Field label="Date"><TextInput value="Jan 15, 2025" onChange={() => {}} /></Field>
                  <Field label="Set Host"><Select value={host} onChange={setHost} options={HOSTS} /></Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-vintiga-md">
                  <Field label="Availability">
                    <div className="flex gap-vintiga-sm">
                      {AVAILABILITY.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSlot(t)}
                          className={[
                            'h-10 px-3 rounded-vintiga-md border typo-body-sm transition-colors',
                            slot === t
                              ? 'border-vintiga-primary bg-vintiga-primary-soft text-vintiga-primary font-semibold'
                              : 'border-vintiga-slate-200 text-vintiga-slate-700 hover:bg-vintiga-slate-50',
                          ].join(' ')}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Guests"><TextInput value="2" onChange={() => {}} /></Field>
                  <Field label="Table"><Select value={table} onChange={setTable} options={TABLES} /></Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
                  <Field label="What's the occasion?"><Textarea rows={3} value={occasion} onChange={(e) => setOccasion(e.target.value)} /></Field>
                  <Field label="Internal Note"><Textarea rows={3} value={internalNote} onChange={(e) => setInternalNote(e.target.value)} /></Field>
                </div>
                <p className="typo-caption text-vintiga-slate-500">These notes are customer facing</p>
              </SectionCard>

              {/* Order Items */}
              <SectionCard title="Order Items">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader className="w-16">QTY</TableHeader>
                      <TableHeader>Product</TableHeader>
                      <TableHeader>Price per Guest</TableHeader>
                      <TableHeader>Guests</TableHeader>
                      <TableHeader>Total</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-vintiga-slate-700">1</TableCell>
                      <TableCell className="font-medium text-vintiga-slate-900">Private Tasting Experience Tasting</TableCell>
                      <TableCell className="text-vintiga-slate-700">$36.00</TableCell>
                      <TableCell className="text-vintiga-slate-700">2</TableCell>
                      <TableCell className="text-vintiga-slate-900">$72.00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </SectionCard>

              {/* Order Summary */}
              <SectionCard title="Order Summary">
                <div className="flex flex-col">
                  <SummaryLine label="Subtotal" value="$140.00" />
                  <SummaryLine label="Shipping (UPS Ground)" value="$0.00" />
                  <SummaryLine label="CRV" value="$0.00" />
                  <SummaryLine label="Tax" value="$10.00" />
                  <SummaryLine label="Tip" value="$10.00" />
                  <div className="flex items-center justify-between py-vintiga-sm border-t border-vintiga-slate-200">
                    <span className="typo-body-sm font-semibold text-vintiga-slate-900">Total (6 items)</span>
                    <span className="typo-body-sm font-semibold text-vintiga-slate-900">$160.00</span>
                  </div>
                  <SummaryLine label="Payment Method" value="Cash" />
                </div>
                <AlertSoft variant="info" icon={<InfoIcon />} subtitle="Taxes were calculated based on fallback rates as the default tax service was unreachable." />
              </SectionCard>
            </div>
          </PageTemplate>
        </div>
      </div>
    </div>
  )
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-vintiga-sm">
      <span className="typo-body-sm text-vintiga-slate-700">{label}</span>
      <span className="typo-body-sm text-vintiga-slate-900">{value}</span>
    </div>
  )
}

function CustomerRail() {
  return (
    <CustomerCard
      avatar={<Avatar name="Ms Dorothy Ladner" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop&crop=faces" size="lg" />}
      name="Ms Dorothy Ladner"
      subtitle={
        <a href="#/web/clubs" className="inline-flex items-center gap-1.5 typo-body font-semibold text-vintiga-indigo-600 hover:text-vintiga-indigo-700 no-underline w-fit">
          <IdCardIcon className="w-5 h-5 shrink-0" />Curators Club
        </a>
      }
      tags={
        <div className="flex flex-wrap items-center gap-1.5">
          <Tag variant="outline" tone="default" size="sm">Dog Owner</Tag>
          <Tag variant="outline" tone="default" size="sm">Investor</Tag>
        </div>
      }
      details={
        <>
          <span>dorothyladner@gmail.com <span className="text-vintiga-slate-500">| Preferred</span></span>
          <span>Seattle, WA, 98107</span>
          <span className="text-vintiga-slate-500">Anniversary: Mar 15, 2025</span>
          <span className="text-vintiga-slate-500">Birthday: Jul 13, 1955</span>
        </>
      }
      actions={<Button variant="outline" onClick={() => {}}>Customer Details</Button>}
    />
  )
}
