import { useState } from 'react'
import { CustomerViewLayout } from './CustomerViewLayout'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { BackArrowIcon, PlusIcon, EllipsisVerticalIcon } from '@ds/icons/Icons'
import { useAccountBalance, useBalanceLedger } from './customerStore'
import { AdjustBalanceModal } from './AdjustBalanceModal'
import { TransactionsTable, TransactionsEmpty } from './TransactionsTable'
import { formatCurrency } from './transactionsFormat'

// ─── BalanceTransactionsScreen ───────────────────────────────────────────────
// Drill-down off the Billing page's Balance card. Renders the running total +
// "Adjust Balance" CTA + the full transactions ledger. Reachable from:
//
//   • Overview KPI card "Account Balance"  → href="#/web/customers/view/billing/balance"
//   • Billing page Balance summary card    → click to drill in
//
// Layout reuses `CustomerViewLayout` so the breadcrumb / segmented control /
// rail stay consistent. The Billing tab remains active across this drill-in.

export function BalanceTransactionsScreen() {
  const balance = useAccountBalance()
  const ledger  = useBalanceLedger()
  const [adjustOpen, setAdjustOpen] = useState(false)

  return (
    <CustomerViewLayout
      activeTab="billing"
      hideTitle
      actions={<></>}
    >
      <div className="flex flex-col gap-vintiga-xl">
        {/* Back to Billing */}
        <a
          href="#/web/customers/view/billing"
          className="inline-flex items-center gap-1.5 typo-body-sm font-medium text-vintiga-indigo-600 hover:text-vintiga-indigo-700 no-underline w-fit"
        >
          <BackArrowIcon className="w-4 h-4" />
          Back to Billing
        </a>

        {/* Hero */}
        <section className="border border-vintiga-slate-200 rounded-vintiga-2xl bg-vintiga-white p-vintiga-lg flex items-start justify-between gap-vintiga-md">
          <div className="flex flex-col gap-1">
            <h2 className="typo-body-sm font-medium text-vintiga-slate-500">Account Balance</h2>
            <p className="font-semibold text-vintiga-slate-900" style={{ fontSize: 32, lineHeight: '40px' }}>
              ${balance.toFixed(2)}
            </p>
            <p className="typo-body-sm text-vintiga-slate-500">
              Stored credit on this customer's account. Use to settle orders or compensate for issues.
            </p>
          </div>
          <div className="flex items-center gap-vintiga-sm shrink-0">
            <Button leftIcon={<PlusIcon />} onClick={() => setAdjustOpen(true)}>Adjust Balance</Button>
            <IconButton
              variant="outline"
              size="md"
              icon={<EllipsisVerticalIcon />}
              onClick={() => {}}
              aria-label="More balance actions"
            />
          </div>
        </section>

        {/* Transactions */}
        <section className="flex flex-col gap-vintiga-md">
          <div className="flex items-center justify-between">
            <h3 className="typo-title-section font-semibold text-vintiga-slate-900">Transactions</h3>
            <span className="typo-body-sm text-vintiga-slate-500">{ledger.length} entries</span>
          </div>
          {ledger.length === 0 ? (
            <TransactionsEmpty message="Adjustments and order debits will appear here." />
          ) : (
            <TransactionsTable entries={ledger} amountLabel="Amount" format={formatCurrency} />
          )}
        </section>
      </div>

      <AdjustBalanceModal open={adjustOpen} mode="balance" onClose={() => setAdjustOpen(false)} />
    </CustomerViewLayout>
  )
}
