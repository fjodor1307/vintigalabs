import { useEffect, useState } from 'react'
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
import { SectionCard } from '@ds/shared/SectionCard'
import { AlertSoft } from '@ds/shared/AlertSoft'
import { PopoverMenu } from '@ds/shared/PopoverMenu'
import { Modal, ModalAlertHeader, ModalFooter } from '@ds/shared/Modal'
import { Toast, type ToastVariant } from '@ds/shared/Toast'
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '@ds/shared/Table'
import { EllipsisVerticalIcon, UserCheckIcon, IdCardIcon, InfoIcon, CircleAlertIcon } from '@ds/icons/Icons'
import { Select, TextInput, type Option } from './ResControls'
import { experienceSelectOptions } from './experienceOptions'

// ─── ReservationViewScreen ────────────────────────────────────────────────────
// Reservation detail (Figma 4781-28789). Reservation Details + Order Items +
// Order Summary in the main column; a customer card in the rail. The header
// Check In button + actions menu (Edit / Resend / Cancel) drive a small status
// state machine: reserved → checked-in, and reserved → cancelled (with a
// confirm), each reversible so the flow is repeatable in a demo. Details are
// read-only until "Edit reservation" unlocks them.

const HOSTS: Option[] = [{ value: 'none', label: 'None' }, { value: 'jim', label: 'Jim Secord' }]
const TABLES: Option[] = [{ value: '10', label: '10 (1-30)' }, { value: '1', label: '1' }]
const AVAILABILITY = ['11:00 AM', '1:00 PM']

type Status = 'reserved' | 'checked-in' | 'cancelled'

function StatusTag({ status, size = 'sm' }: { status: Status; size?: 'sm' | 'md' }) {
  if (status === 'checked-in') return <Tag variant="filled" tone="success" size={size}>Checked In</Tag>
  if (status === 'cancelled') return <Tag variant="filled" tone="danger" size={size}>Cancelled</Tag>
  return <Tag variant="neutral-light" size={size}>Reserved</Tag>
}

export function ReservationViewScreen() {
  const { collapsed, mobileOpen, onMenuToggle, closeMobile } = useResponsiveSidebar()

  const [experience, setExperience] = useState('wine-tasting:tasting')
  const [host, setHost] = useState('none')
  const [table, setTable] = useState('10')
  const [slot, setSlot] = useState('11:00 AM')
  const [occasion, setOccasion] = useState('')
  const [internalNote, setInternalNote] = useState('')

  const [status, setStatus] = useState<Status>('reserved')
  const [editing, setEditing] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [toast, setToast] = useState<{ title: string; description?: string; variant: ToastVariant } | null>(null)

  // Auto-dismiss the toast.
  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(id)
  }, [toast])

  const notify = (title: string, description?: string, variant: ToastVariant = 'success') =>
    setToast({ title, description, variant })

  const checkIn = () => { setStatus('checked-in'); notify('Guest checked in', 'Ms Dorothy Ladner is now checked in.') }
  const undoCheckIn = () => { setStatus('reserved'); notify('Check-in undone', undefined, 'info') }
  const resend = () => notify('Confirmation resent', 'Sent to dorothyladner@gmail.com.', 'info')
  const startEdit = () => { setEditing(true); notify('Editing reservation', 'Update the details below, then save.', 'info') }
  const saveEdit = () => { setEditing(false); notify('Changes saved') }
  const confirmCancel = () => { setStatus('cancelled'); setEditing(false); setCancelOpen(false); notify('Reservation cancelled', 'Reservation #1004 has been cancelled.', 'error') }
  const reinstate = () => { setStatus('reserved'); notify('Reservation reinstated') }

  const menuItems = [
    ...(status === 'checked-in' ? [{ label: 'Undo check-in', onClick: undoCheckIn }] : []),
    ...(status !== 'cancelled' ? [{ label: 'Edit reservation', onClick: startEdit }] : []),
    { label: 'Resend confirmation', onClick: resend },
    ...(status === 'cancelled'
      ? [{ label: 'Reinstate reservation', onClick: reinstate }]
      : [{ label: 'Cancel reservation', onClick: () => setCancelOpen(true), danger: true }]),
  ]

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
                  <StatusTag status={status} size="md" />
                </span>
                <span className="typo-caption text-vintiga-slate-500 uppercase tracking-wide">Apr 13, 2025 at 5:20 PM</span>
              </div>
            }
            actions={
              <>
                {status === 'reserved' && (
                  <Button leftIcon={<UserCheckIcon className="w-4 h-4" />} onClick={checkIn}>Check In</Button>
                )}
                {status === 'checked-in' && (
                  <Button variant="outline" disabled leftIcon={<UserCheckIcon className="w-4 h-4" />} onClick={() => {}}>Checked In</Button>
                )}
                <PopoverMenu
                  align="right"
                  trigger={(_open, toggle) => (
                    <IconButton variant="outline" size="md" icon={<EllipsisVerticalIcon />} aria-label="More actions" onClick={toggle} />
                  )}
                  items={menuItems}
                />
              </>
            }
            rail={<CustomerRail />}
          >
            <div className="flex flex-col gap-vintiga-lg">
              {status === 'cancelled' && (
                <AlertSoft
                  variant="error"
                  title="This reservation is cancelled"
                  subtitle="Reinstate it from the actions menu to make changes again."
                />
              )}

              {/* Reservation Details */}
              <SectionCard title="Reservation Details" action={<StatusTag status={status} />}>
                <fieldset
                  disabled={!editing}
                  className="contents [&_input:disabled]:bg-vintiga-slate-50 [&_input:disabled]:text-vintiga-slate-500 [&_textarea:disabled]:bg-vintiga-slate-50 [&_textarea:disabled]:text-vintiga-slate-500 [&_button:disabled]:opacity-60 [&_button:disabled]:cursor-not-allowed"
                >
                  <Field label="Customer"><TextInput value="Ms Dorothy Ladner" readOnly /></Field>
                  <Field label="Experience"><Select value={experience} onChange={setExperience} options={experienceSelectOptions()} /></Field>
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
                </fieldset>

                {editing && (
                  <div className="flex items-center justify-end gap-vintiga-sm pt-vintiga-md border-t border-vintiga-slate-200">
                    <Button variant="outline" onClick={() => setEditing(false)}>Discard</Button>
                    <Button onClick={saveEdit}>Save changes</Button>
                  </div>
                )}
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

      {/* Cancel confirmation */}
      <Modal open={cancelOpen} onClose={() => setCancelOpen(false)} size="sm">
        <ModalAlertHeader
          icon={<CircleAlertIcon />}
          iconColor="red"
          title="Cancel this reservation?"
          description="Reservation #1004 for Ms Dorothy Ladner will be marked as cancelled. You can reinstate it afterwards."
        />
        <ModalFooter>
          <Button variant="outline" onClick={() => setCancelOpen(false)}>Keep reservation</Button>
          <Button intent="destructive" onClick={confirmCancel}>Cancel reservation</Button>
        </ModalFooter>
      </Modal>

      {/* Transient feedback */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] animate-[fadeUp_0.3s_ease-out]">
          <Toast title={toast.title} description={toast.description} variant={toast.variant} onClose={() => setToast(null)} />
        </div>
      )}
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

// Vertical stacked layout — fits the narrow rail far better than the wide
// horizontal CustomerCard (responsive ask).
function CustomerRail() {
  return (
    <section className="border border-vintiga-slate-200 rounded-vintiga-xl bg-vintiga-white p-vintiga-lg flex flex-col gap-vintiga-md">
      <div className="relative w-fit">
        <Avatar name="Ms Dorothy Ladner" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop&crop=faces" size="xl" />
        <span className="absolute -bottom-1 right-0 w-6 h-6 rounded-vintiga-sm bg-vintiga-white border border-vintiga-slate-200 inline-flex items-center justify-center text-vintiga-slate-500">
          <IdCardIcon className="w-3.5 h-3.5" />
        </span>
      </div>

      <div className="flex flex-col gap-vintiga-sm">
        <h3 className="typo-title-subsection font-semibold text-vintiga-slate-900">Ms Dorothy Ladner</h3>
        <a href="#/web/clubs" className="inline-flex items-center gap-1.5 typo-body-sm font-semibold text-vintiga-indigo-600 hover:text-vintiga-indigo-700 no-underline w-fit">
          <IdCardIcon className="w-4 h-4 shrink-0" />Curators Club
        </a>
        <div className="flex flex-wrap items-center gap-1.5">
          <Tag variant="outline" tone="default" size="sm">Dog Owner</Tag>
          <Tag variant="outline" tone="default" size="sm">Investor</Tag>
        </div>
        <div className="flex flex-col gap-1 typo-body-sm text-vintiga-slate-700">
          <span>dorothyladner@gmail.com <span className="text-vintiga-slate-500">| Preferred</span></span>
          <span>Seattle, WA, 98107</span>
          <span className="text-vintiga-slate-500">Anniversary: Mar 15, 2025</span>
          <span className="text-vintiga-slate-500">Birthday: Jul 13, 1955</span>
        </div>
      </div>

      <Button variant="outline" fullWidth onClick={() => {}}>Customer Details</Button>
    </section>
  )
}
