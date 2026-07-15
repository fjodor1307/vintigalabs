import type { ComponentType } from 'react'
import type { PrototypeConfig } from '../_registry'
import { CustomersScreen } from './CustomersScreen'
import { CustomerOverviewScreen } from './CustomerOverviewScreen'
import { CustomerBillingScreen } from './CustomerBillingScreen'
import { CustomerMembershipsScreen } from './CustomerMembershipsScreen'
import { BalanceTransactionsScreen } from './BalanceTransactionsScreen'
import { PointsTransactionsScreen } from './PointsTransactionsScreen'
import { OrderDetailScreen } from './OrderDetailScreen'
import { CUSTOMER } from './customerSample'

const baseRoutes: Record<string, ComponentType> = {
  '#/web/customers':                          CustomersScreen,
  '#/web/customers/view/overview':            CustomerOverviewScreen,
  '#/web/customers/view/billing':             CustomerBillingScreen,
  '#/web/customers/view/memberships':         CustomerMembershipsScreen,
  '#/web/customers/view/billing/balance':     BalanceTransactionsScreen,
  '#/web/customers/view/billing/points':      PointsTransactionsScreen,
}

// Per-order detail routes — every order id resolves to the same screen, which
// reads the id from the hash and looks up the matching record. Order ids ship
// with a leading `#` (e.g. `#ORD-5289`); strip it for the route segment so the
// URL stays valid.
for (const o of CUSTOMER.recentOrders) {
  baseRoutes[`#/web/customers/view/orders/${o.id.replace(/^#/, '')}`] = OrderDetailScreen
}

export const config: PrototypeConfig = {
  slug: 'customers',
  frame: 'web',
  tags: ['dashboard', 'customers', 'crm'],
  entries: [
    {
      name: 'Customers',
      description: 'Customer 360° profile — header card + Customer Insights + Recent Orders + Purchased Products + Notes / Tags rail, plus a Billing tab (Payment Methods + Addresses + Balance/Loyalty Points summary) that drills into dedicated transactions screens for the account balance and loyalty points ledgers.',
      path: '#/web/customers',
      screens: 6,
    },
  ],
  routes: baseRoutes,
}
