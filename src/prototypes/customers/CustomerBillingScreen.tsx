import { useState } from 'react'
import { CustomerViewLayout } from './CustomerViewLayout'
import { AddCardModal } from './AddCardModal'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { PopoverMenu } from '@ds/shared/PopoverMenu'
import { Tag } from '@ds/shared/Tag'
import { RecordsCard, RecordsCardEmpty } from '@ds/shared/RecordsCard'
import { CardBrandLogo } from '@ds/shared/CardBrandLogo'
import { KpiCard } from '@ds/shared/KpiCard'
import {
  CreditCardIcon,
  GemIcon,
  PlusIcon,
  EllipsisVerticalIcon,
} from '@ds/icons/Icons'
import {
  useAccountBalance,
  useLoyaltyPoints,
  usePaymentMethods,
  useAddresses,
  customerActions,
  type PaymentMethod,
  type Address,
  type CardBrand,
} from './customerStore'

// ─── CustomerBillingScreen ───────────────────────────────────────────────────
// Figma-accurate Billing tab — `Customer - Payments` (1948:14816). Three
// blocks stacked in the main column:
//
//   1. Two compact stat cards — Balance + Loyalty Points. Both clickable
//      and route into the dedicated transactions sub-pages
//      (`/billing/balance` and `/billing/points`).
//   2. Payment Methods card — header (title + subtitle + "+ Add"), then
//      stacked card rows with brand logo · expiry · masked number · default
//      tag · kebab menu.
//   3. Address card — same shape: header + stacked address rows with
//      label / multi-line address / contact block / kebab.
//
// Notes + Tags rail comes from the layout — unchanged.

// ─── Stats row (Account Balance + Loyalty Points) ────────────────────────────

function StatsRow() {
  const balance = useAccountBalance()
  const points  = useLoyaltyPoints()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
      <KpiCard
        size="sm"
        label="Account Balance"
        value={`$${balance.toFixed(2)}`}
        icon={<CreditCardIcon />}
        href="#/web/customers/view/billing/balance"
      />
      <KpiCard
        size="sm"
        label="Loyalty Points"
        value={points.toLocaleString()}
        icon={<GemIcon />}
        href="#/web/customers/view/billing/points"
      />
    </div>
  )
}

// ─── Payment Methods ─────────────────────────────────────────────────────────

const BRAND_LABEL: Record<CardBrand, string> = {
  visa:       'Visa',
  mastercard: 'Mastercard',
  amex:       'Amex',
  discover:   'Discover',
}

function PaymentMethodRow({ method }: { method: PaymentMethod }) {
  // Commerce 7 vaulted cards surface here for visibility but can't be used in
  // any Vintiga flow (POS, club fees, our online store). We render them muted,
  // skip the "Default Card" tag (it's Commerce 7's default, not ours), and
  // only expose Delete in the row menu.
  const c7Only = method.source === 'commerce7'
  return (
    <div className={['flex items-center gap-vintiga-md', c7Only ? 'opacity-60' : ''].join(' ')}>
      <CardBrandLogo brand={method.brand} />
      <div className="flex flex-col">
        <span className="typo-caption text-vintiga-slate-500">
          Expires {method.expiresMonth}/{method.expiresYear}
        </span>
        <span className="typo-body-sm font-semibold text-vintiga-slate-900">
          {BRAND_LABEL[method.brand]} **** {method.last4}
        </span>
      </div>
      <div className="flex-1" />
      {c7Only ? (
        <Tag variant="neutral-light" size="md">Saved in Commerce 7</Tag>
      ) : (
        method.isDefault && <Tag variant="neutral-dark" size="md">Default Card</Tag>
      )}
      <PopoverMenu
        align="right"
        width="w-44"
        trigger={(_open, toggle) => (
          <IconButton
            variant="outline"
            size="sm"
            icon={<EllipsisVerticalIcon />}
            onClick={toggle}
            aria-label={`More options for card ending ${method.last4}`}
          />
        )}
        items={
          c7Only
            ? [{ label: 'Delete', onClick: () => customerActions.deletePaymentMethod(method.id), danger: true }]
            : [
                ...(method.isDefault
                  ? []
                  : [{ label: 'Set as default', onClick: () => customerActions.setDefaultPaymentMethod(method.id) }]),
                { label: 'Delete', onClick: () => customerActions.deletePaymentMethod(method.id), danger: true },
              ]
        }
      />
    </div>
  )
}

function PaymentMethodsCard() {
  const methods = usePaymentMethods()
  const [addOpen, setAddOpen] = useState(false)
  return (
    <>
      <RecordsCard
        title="Payment Methods"
        subtitle="Manage your payment information"
        action={
          <Button variant="outline" size="md" leftIcon={<PlusIcon />} onClick={() => setAddOpen(true)}>
            Add
          </Button>
        }
        empty={
          <RecordsCardEmpty
            title="No payment methods"
            hint="Add a card to enable one-click checkout."
          />
        }
      >
        {methods.map((m) => <PaymentMethodRow key={m.id} method={m} />)}
      </RecordsCard>
      <AddCardModal open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  )
}

// ─── Addresses ───────────────────────────────────────────────────────────────

function AddressRow({ address }: { address: Address }) {
  return (
    <div className="flex items-start gap-vintiga-md">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-vintiga-md min-w-0">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="typo-body-sm font-semibold text-vintiga-slate-900">{address.label}</span>
          <p className="typo-body-sm text-vintiga-slate-700">
            {address.street}<br />
            {address.city}, {address.state} {address.zip}<br />
            {address.country}
          </p>
        </div>
        {(address.phone || address.email) && (
          <div className="flex flex-col gap-1 min-w-0">
            <span className="typo-body-sm font-semibold text-vintiga-slate-900">Contact</span>
            {address.phone && <p className="typo-body-sm text-vintiga-slate-700">Phone: {address.phone}</p>}
            {address.email && <p className="typo-body-sm text-vintiga-slate-700 truncate">Email: {address.email}</p>}
          </div>
        )}
      </div>
      <PopoverMenu
        align="right"
        width="w-44"
        trigger={(_open, toggle) => (
          <IconButton
            variant="outline"
            size="sm"
            icon={<EllipsisVerticalIcon />}
            onClick={toggle}
            aria-label={`More options for ${address.label}`}
          />
        )}
        items={[
          { label: 'Edit',   onClick: () => {} },
          { label: 'Delete', onClick: () => customerActions.deleteAddress(address.id), danger: true },
        ]}
      />
    </div>
  )
}

function AddressesCard() {
  const addresses = useAddresses()
  return (
    <RecordsCard
      title="Address"
      subtitle="Manage customer address information"
      action={
        <Button variant="outline" size="md" leftIcon={<PlusIcon />} onClick={() => {}}>
          Add
        </Button>
      }
      empty={
        <RecordsCardEmpty
          title="No addresses"
          hint="Add a shipping or billing address."
        />
      }
    >
      {addresses.map((a) => <AddressRow key={a.id} address={a} />)}
    </RecordsCard>
  )
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function CustomerBillingScreen() {
  return (
    <CustomerViewLayout activeTab="billing" hideTitle actions={<></>}>
      <div className="flex flex-col gap-vintiga-lg">
        <StatsRow />
        <PaymentMethodsCard />
        <AddressesCard />
      </div>
    </CustomerViewLayout>
  )
}
