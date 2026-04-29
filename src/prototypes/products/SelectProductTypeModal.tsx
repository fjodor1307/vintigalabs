import { Dialog } from '@base-ui/react/dialog'
import { Button } from '@ds/shared/Button'
import {
  XIcon,
  BottleWineIcon, BeerIcon, MartiniIcon, PartyPopperIcon, ShirtIcon,
  HandCoinsIcon, SandwichIcon, WineIcon, CalendarCheckIcon, PackageOpenIcon,
  GiftIcon, NotebookPenIcon, TicketIcon,
} from '@ds/icons/Icons'

// ─── Select Product Type modal ────────────────────────────────────────────────
// Figma 2220:37231 — opens when the user clicks "Add Product".
// Pick a product type, then route to the relevant editor.

export type ProductType =
  | 'wine' | 'beer' | 'spirit' | 'experience' | 'merchandise'
  | 'drink-token' | 'food' | 'tasting' | 'reservation'
  | 'bundle' | 'gift-card' | 'collateral' | 'event-ticket'

interface TypeOption {
  value: ProductType
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const TYPES: TypeOption[] = [
  { value: 'wine',          label: 'Wines',         icon: BottleWineIcon },
  { value: 'beer',          label: 'Beer',          icon: BeerIcon },
  { value: 'spirit',        label: 'Spirits',       icon: MartiniIcon },
  { value: 'experience',    label: 'Experience',    icon: PartyPopperIcon },
  { value: 'merchandise',   label: 'Merchandise',   icon: ShirtIcon },
  { value: 'drink-token',   label: 'Drink Tokens',  icon: HandCoinsIcon },
  { value: 'food',          label: 'Food',          icon: SandwichIcon },
  { value: 'tasting',       label: 'Tasting',       icon: WineIcon },
  { value: 'reservation',   label: 'Reservation',   icon: CalendarCheckIcon },
  { value: 'bundle',        label: 'Bundle',        icon: PackageOpenIcon },
  { value: 'gift-card',     label: 'Gift Card',     icon: GiftIcon },
  { value: 'collateral',    label: 'Collateral',    icon: NotebookPenIcon },
  { value: 'event-ticket',  label: 'Event Ticket',  icon: TicketIcon },
]

interface Props {
  open: boolean
  onClose: () => void
  onSelect: (type: ProductType) => void
}

export function SelectProductTypeModal({ open, onClose, onSelect }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/40 z-50" />
        <Dialog.Popup
          className={[
            'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
            'bg-vintiga-white rounded-vintiga-lg shadow-vintiga-xl overflow-hidden',
            'w-[calc(100vw-2rem)] max-w-[520px] flex flex-col',
          ].join(' ')}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-vintiga-md px-vintiga-lg pt-vintiga-lg pb-vintiga-sm">
            <Dialog.Title className="text-xl leading-7 font-semibold text-vintiga-slate-900">
              Select Product Type
            </Dialog.Title>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="w-6 h-6 flex items-center justify-center text-vintiga-slate-500 hover:text-vintiga-slate-900 transition-colors cursor-pointer p-0 bg-transparent border-0"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-3 gap-vintiga-sm p-vintiga-lg">
            {TYPES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => onSelect(value)}
                className="flex flex-col items-center justify-center gap-vintiga-sm p-vintiga-lg bg-vintiga-white border border-vintiga-slate-200 rounded-vintiga-lg hover:border-vintiga-slate-500 hover:bg-vintiga-slate-50 transition-colors cursor-pointer text-center"
              >
                <span className="px-2 py-2 rounded-full bg-vintiga-slate-50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-vintiga-slate-700" />
                </span>
                <span className="typo-body-sm font-medium text-vintiga-slate-900">{label}</span>
              </button>
            ))}
            {/* Empty cell for the orphan to keep the alignment */}
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </div>

          {/* Footer (cancel only — selection auto-routes) */}
          <div className="flex items-center justify-end gap-vintiga-sm px-vintiga-lg pb-vintiga-lg pt-vintiga-sm">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
