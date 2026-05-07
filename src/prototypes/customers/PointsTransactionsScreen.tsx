import { useState } from 'react'
import { CustomerViewLayout } from './CustomerViewLayout'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { BackArrowIcon, PlusIcon, EllipsisVerticalIcon } from '@ds/icons/Icons'
import { useLoyaltyPoints, usePointsLedger } from './customerStore'
import { AdjustBalanceModal } from './AdjustBalanceModal'
import { TransactionsTable, TransactionsEmpty } from './TransactionsTable'
import { formatPoints } from './transactionsFormat'

// ─── PointsTransactionsScreen ────────────────────────────────────────────────
// Drill-down off the Billing page's Loyalty Points card. Mirrors
// `BalanceTransactionsScreen` — same layout, different units.

export function PointsTransactionsScreen() {
  const points = useLoyaltyPoints()
  const ledger = usePointsLedger()
  const [adjustOpen, setAdjustOpen] = useState(false)

  return (
    <CustomerViewLayout
      activeTab="billing"
      hideTitle
      actions={<></>}
    >
      <div className="flex flex-col gap-vintiga-xl">
        <a
          href="#/web/customers/view/billing"
          className="inline-flex items-center gap-1.5 typo-body-sm font-medium text-vintiga-indigo-600 hover:text-vintiga-indigo-700 no-underline w-fit"
        >
          <BackArrowIcon className="w-4 h-4" />
          Back to Billing
        </a>

        <section className="border border-vintiga-slate-200 rounded-vintiga-2xl bg-vintiga-white p-vintiga-lg flex items-start justify-between gap-vintiga-md">
          <div className="flex flex-col gap-1">
            <h2 className="typo-body-sm font-medium text-vintiga-slate-500">Loyalty Points</h2>
            <p className="font-semibold text-vintiga-slate-900" style={{ fontSize: 32, lineHeight: '40px' }}>
              {points.toLocaleString()}
            </p>
            <p className="typo-body-sm text-vintiga-slate-500">
              Lifetime points balance. Maps to Commerce7's free loyalty configuration when integrated.
            </p>
          </div>
          <div className="flex items-center gap-vintiga-sm shrink-0">
            <Button leftIcon={<PlusIcon />} onClick={() => setAdjustOpen(true)}>Adjust Points</Button>
            <IconButton
              variant="outline"
              size="md"
              icon={<EllipsisVerticalIcon />}
              onClick={() => {}}
              aria-label="More points actions"
            />
          </div>
        </section>

        <section className="flex flex-col gap-vintiga-md">
          <div className="flex items-center justify-between">
            <h3 className="typo-title-section font-semibold text-vintiga-slate-900">Transactions</h3>
            <span className="typo-body-sm text-vintiga-slate-500">{ledger.length} entries</span>
          </div>
          {ledger.length === 0 ? (
            <TransactionsEmpty message="Earned points and redemptions will appear here." />
          ) : (
            <TransactionsTable entries={ledger} amountLabel="Points" format={formatPoints} />
          )}
        </section>
      </div>

      <AdjustBalanceModal open={adjustOpen} mode="points" onClose={() => setAdjustOpen(false)} />
    </CustomerViewLayout>
  )
}
