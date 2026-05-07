import { CustomerViewLayout } from './CustomerViewLayout'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { PopoverMenu } from '@ds/shared/PopoverMenu'
import { Tag } from '@ds/shared/Tag'
import {
  CreditCardIcon,
  GemIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  ChevronRightIcon,
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

// ─── Stat row (compact balance / points card) ────────────────────────────────

function StatRow({
  label,
  value,
  icon,
  href,
}: {
  label: string
  value: string
  icon: React.ReactNode
  href: string
}) {
  return (
    <a
      href={href}
      className="border border-vintiga-slate-200 rounded-vintiga-xl bg-vintiga-white p-vintiga-md flex items-center gap-vintiga-md transition-colors hover:border-vintiga-indigo-300 hover:bg-vintiga-indigo-50/30 no-underline group"
    >
      <div className="w-8 h-8 rounded-full bg-vintiga-indigo-50 flex items-center justify-center text-vintiga-indigo-500 shrink-0 [&>svg]:w-5 [&>svg]:h-5">
        {icon}
      </div>
      <span className="flex-1 typo-body-sm font-medium text-vintiga-slate-900">{label}</span>
      <span className="typo-body font-semibold text-vintiga-slate-900">{value}</span>
      <ChevronRightIcon className="w-4 h-4 text-vintiga-slate-400 group-hover:text-vintiga-indigo-500 transition-colors" />
    </a>
  )
}

function StatsRow() {
  const balance = useAccountBalance()
  const points  = useLoyaltyPoints()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
      <StatRow
        label="Balance"
        value={`$${balance.toFixed(2)}`}
        icon={<CreditCardIcon />}
        href="#/web/customers/view/billing/balance"
      />
      <StatRow
        label="Loyalty Points"
        value={points.toLocaleString()}
        icon={<GemIcon />}
        href="#/web/customers/view/billing/points"
      />
    </div>
  )
}

// ─── Section header (used by Payment Methods + Address) ──────────────────────

function SectionHeader({
  title,
  subtitle,
  onAdd,
}: {
  title: string
  subtitle: string
  onAdd: () => void
}) {
  return (
    <div className="flex items-start justify-between gap-vintiga-md p-vintiga-lg pb-vintiga-md">
      <div className="flex flex-col gap-1 min-w-0">
        <h3 className="typo-title-section font-semibold text-vintiga-slate-900">{title}</h3>
        <p className="typo-body-sm text-vintiga-slate-500">{subtitle}</p>
      </div>
      <Button variant="outline" size="md" leftIcon={<PlusIcon />} onClick={onAdd}>
        Add
      </Button>
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

/** Inline brand logo — small SVG keeps the prototype self-contained.
 *  Mastercard's two overlapping circles are recognisable; the others fall back
 *  to a neutral chip with the brand name. */
function CardBrandLogo({ brand }: { brand: CardBrand }) {
  if (brand === 'mastercard') {
    return (
      <svg width="48" height="32" viewBox="0 0 48 32" aria-label="Mastercard">
        <circle cx="20" cy="16" r="10" fill="#EB001B" />
        <circle cx="28" cy="16" r="10" fill="#F79E1B" />
        <path
          d="M24 9.5a9.95 9.95 0 0 0-4 6.5 9.95 9.95 0 0 0 4 6.5 9.95 9.95 0 0 0 4-6.5 9.95 9.95 0 0 0-4-6.5z"
          fill="#FF5F00"
        />
      </svg>
    )
  }
  return (
    <div className="w-12 h-8 rounded bg-vintiga-slate-100 flex items-center justify-center typo-caption font-semibold text-vintiga-slate-700">
      {BRAND_LABEL[brand].slice(0, 4)}
    </div>
  )
}

function PaymentMethodRow({ method }: { method: PaymentMethod }) {
  return (
    <div className="border-t border-vintiga-slate-200 px-vintiga-lg py-vintiga-md flex items-center gap-vintiga-md">
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
      {method.isDefault && (
        <Tag variant="neutral-dark" size="md">Default Card</Tag>
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
        items={[
          ...(method.isDefault
            ? []
            : [{ label: 'Set as default', onClick: () => customerActions.setDefaultPaymentMethod(method.id) }]),
          { label: 'Delete', onClick: () => customerActions.deletePaymentMethod(method.id), danger: true },
        ]}
      />
    </div>
  )
}

function PaymentMethodsCard() {
  const methods = usePaymentMethods()
  return (
    <section className="border border-vintiga-slate-200 rounded-vintiga-xl bg-vintiga-white overflow-hidden">
      <SectionHeader
        title="Payment Methods"
        subtitle="Manage your payment information"
        onAdd={() => {}}
      />
      {methods.length === 0 ? (
        <div className="border-t border-vintiga-slate-200 px-vintiga-lg py-vintiga-xl text-center">
          <p className="typo-body-sm font-semibold text-vintiga-slate-900">No payment methods</p>
          <p className="typo-caption text-vintiga-slate-500 mt-1">Add a card to enable one-click checkout.</p>
        </div>
      ) : (
        methods.map((m) => <PaymentMethodRow key={m.id} method={m} />)
      )}
    </section>
  )
}

// ─── Addresses ───────────────────────────────────────────────────────────────

function AddressRow({ address }: { address: Address }) {
  return (
    <div className="border-t border-vintiga-slate-200 px-vintiga-lg py-vintiga-md flex items-start gap-vintiga-md">
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
    <section className="border border-vintiga-slate-200 rounded-vintiga-xl bg-vintiga-white overflow-hidden">
      <SectionHeader
        title="Address"
        subtitle="Manage customer address information"
        onAdd={() => {}}
      />
      {addresses.length === 0 ? (
        <div className="border-t border-vintiga-slate-200 px-vintiga-lg py-vintiga-xl text-center">
          <p className="typo-body-sm font-semibold text-vintiga-slate-900">No addresses</p>
          <p className="typo-caption text-vintiga-slate-500 mt-1">Add a shipping or billing address.</p>
        </div>
      ) : (
        addresses.map((a) => <AddressRow key={a.id} address={a} />)
      )}
    </section>
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
