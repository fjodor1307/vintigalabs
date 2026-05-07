import type { PrototypeConfig } from '../_registry'
import { CustomersScreen } from './CustomersScreen'
import { CustomerOverviewScreen } from './CustomerOverviewScreen'
import { CustomerBillingScreen } from './CustomerBillingScreen'
import { BalanceTransactionsScreen } from './BalanceTransactionsScreen'
import { PointsTransactionsScreen } from './PointsTransactionsScreen'

export const config: PrototypeConfig = {
  slug: 'customers',
  frame: 'web',
  tags: ['dashboard', 'customers', 'crm'],
  entries: [
    {
      name: 'Customers',
      description: 'Customer 360° profile — header card + Customer Insights + Recent Orders + Purchased Products + Notes / Tags rail, plus a Billing tab (Payment Methods + Addresses + Balance/Loyalty Points summary) that drills into dedicated transactions screens for the account balance and loyalty points ledgers.',
      path: '#/web/customers',
      screens: 5,
    },
  ],
  routes: {
    '#/web/customers':                          CustomersScreen,
    '#/web/customers/view/overview':            CustomerOverviewScreen,
    '#/web/customers/view/billing':             CustomerBillingScreen,
    '#/web/customers/view/billing/balance':     BalanceTransactionsScreen,
    '#/web/customers/view/billing/points':      PointsTransactionsScreen,
  },
}
