// ─── Customers prototype — sample data ───────────────────────────────────────
// One canonical customer (Jane Davis) used by every screen in this prototype.
// Mirrors the Figma reference (`Customer - Overview` 5678:24811). Real wiring
// would load by id; here it's a singleton.

export type OrderStatus = 'processing' | 'pending' | 'completed'

export interface CustomerOrder {
  id: string
  date: string
  status: OrderStatus
  total: string
}

export interface CustomerProduct {
  id: string
  name: string
  quantity: number
  price: string
  imageUrl: string
}

export type NoteKind = 'flag' | 'reminder' | 'note'

export interface CustomerNote {
  id: string
  kind: NoteKind
  title: string
  body: string
  author: string
  createdAt: string
  /** Reminder notes carry an avatar/assignee. */
  assignee?: { name: string; createdAt: string; avatarUrl?: string }
}

export interface Customer {
  id: string
  name: string
  initials: string
  avatarUrl?: string
  verified: boolean
  club: string
  tags: string[]
  email: string
  emailPreferred: boolean
  location: string
  lastVisit: string
  clubStatus: 'Active' | 'On Hold' | 'Cancelled'
  insights: {
    purchasedProducts: number
    ltv: string
    aov: string
    loyaltyPoints: number
    accountBalance: string
    totalVisits: number
  }
  recentOrders: CustomerOrder[]
  purchasedProducts: CustomerProduct[]
  notes: CustomerNote[]
}

export const CUSTOMER: Customer = {
  id: 'jane-davis',
  name: 'Jane Davis',
  initials: 'JD',
  avatarUrl:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  verified: true,
  club: 'Curators Club',
  tags: ['Dog Owner', 'Investor'],
  email: 'janedavis@gmail.com',
  emailPreferred: true,
  location: 'Seattle, WA, 98107',
  lastVisit: 'Mar 15, 2025',
  clubStatus: 'Active',
  insights: {
    purchasedProducts: 28,
    ltv: '$0',
    aov: '$0',
    loyaltyPoints: 0,
    accountBalance: '$0',
    totalVisits: 32,
  },
  recentOrders: [
    { id: '#ORD-5289', date: 'Mar 15, 2025', status: 'processing', total: '$1,245.00' },
    { id: '#ORD-5288', date: 'Mar 15, 2025', status: 'pending',    total: '$205.00'   },
    { id: '#ORD-4823', date: 'Mar 15, 2025', status: 'completed',  total: '$99.00'    },
    { id: '#ORD-4120', date: 'Mar 13, 2025', status: 'completed',  total: '$79.00'    },
    { id: '#ORD-3866', date: 'Mar 11, 2025', status: 'completed',  total: '$2,200.00' },
    { id: '#ORD-3743', date: 'Mar 11, 2025', status: 'completed',  total: '$3,200.00' },
  ],
  purchasedProducts: [
    { id: 'rose-2020',         name: '2020 Rose',                 quantity: 1, price: '$29.00', imageUrl: 'https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=400&h=400&fit=crop' },
    { id: 'reserve',           name: 'Reserve',                   quantity: 3, price: '$49.00', imageUrl: 'https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?w=400&h=400&fit=crop' },
    { id: 'res-cab-2020',      name: '2020 Reserve Cabernet…',    quantity: 2, price: '$49.00', imageUrl: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=400&h=400&fit=crop' },
    { id: 'pinot-gris-2020',   name: '2020 Pinot Gris',           quantity: 1, price: '$22.00', imageUrl: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=400&h=400&fit=crop' },
    { id: 'res-chard-2020',    name: '2020 Reserve Chardonn…',    quantity: 2, price: '$39.00', imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=400&fit=crop' },
    { id: 'chard-2019',        name: '2019 Chardonnay',           quantity: 2, price: '$29.00', imageUrl: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&h=400&fit=crop' },
    { id: 'pinot-gris-2019',   name: '2019 Pinot Gris',           quantity: 1, price: '$29.00', imageUrl: 'https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?w=400&h=400&fit=crop' },
    { id: 'res-pinot-noir-20', name: '2020 Reserve Pinot Noir',   quantity: 2, price: '$29.00', imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=400&fit=crop' },
  ],
  notes: [
    {
      id: 'n1',
      kind: 'flag',
      title: 'Customer flagged a shipping delay',
      body: 'Customer flagged a shipping delay. Following up next week.',
      author: 'Jim Secord',
      createdAt: 'Apr 08, 2025 at 4:36 PM',
    },
    {
      id: 'n2',
      kind: 'reminder',
      title: 'Customer flagged a shipping delay',
      body: 'Customer flagged a shipping delay. Following up next week.',
      author: 'Jim Secord',
      createdAt: 'Apr 08, 2025 at 4:36 PM',
      assignee: {
        name: 'John Doe',
        createdAt: 'Apr 12, 2025',
        avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=120&h=120&fit=crop',
      },
    },
    {
      id: 'n3',
      kind: 'note',
      title: 'Customer flagged a shipping delay',
      body: 'Customer flagged a shipping delay. Following up next week.',
      author: 'Jim Secord',
      createdAt: 'Apr 08, 2025 at 4:36 PM',
    },
  ],
}

// ─── Customers index — list data ─────────────────────────────────────────────
// Mirrors the Figma `Customers` index frame (2040:15777). 10 rows match the
// number of customers visible per page in the design; the totals (320 / 212)
// are the "of N" counts shown in the KPI strip.

/** Optional row-level alert flag — drives the small icon next to the avatar. */
export type CustomerAlert = 'info' | 'warning' | 'danger'

export interface CustomerListEntry {
  id: string
  name: string
  initials: string
  avatarUrl?: string
  city: string
  state: string
  email: string
  phone: string
  /** Lifetime spend, displayed verbatim (already formatted as currency). */
  lifetimeSpend: string
  /** Last purchase date — short format `DD MMM YYYY`. */
  lastPurchase: string
  /** Customer-since date — short format `DD MMM YYYY`. */
  customerSince: string
  /** When true, an id-card chip sits under the avatar to signal club membership. */
  isMember: boolean
  /** Optional row alert — info (orange), warning (red triangle), danger (red x). */
  alert?: CustomerAlert
  /** Optional href — only the canonical customer is wired. */
  href?: string
}

export const CUSTOMER_LIST_TOTAL = 320
export const CUSTOMER_LIST_MEMBER_TOTAL = 212

export const CUSTOMER_LIST: CustomerListEntry[] = [
  {
    id: CUSTOMER.id,
    name: CUSTOMER.name,
    initials: CUSTOMER.initials,
    avatarUrl: CUSTOMER.avatarUrl,
    city: 'Los Angeles',
    state: 'CA',
    email: 'jane.davis@gmail.com',
    phone: '(212) 555-7890',
    lifetimeSpend: '$1,350.00',
    lastPurchase: '14 Oct, 2025',
    customerSince: '22 Jan, 2019',
    isMember: true,
    href: '#/web/customers/view/overview',
  },
  {
    id: 'leslie-alexander',
    name: 'Leslie Alexander',
    initials: 'LA',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop',
    city: 'Chicago',
    state: 'IL',
    email: 'Leslie.Alexander@gmail.com',
    phone: '(310) 555-2345',
    lifetimeSpend: '$275.00',
    lastPurchase: '03 Jan, 2026',
    customerSince: '15 Mar, 2021',
    isMember: true,
  },
  {
    id: 'phoenix-baker',
    name: 'Phoenix Baker',
    initials: 'PB',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop',
    city: 'Miami',
    state: 'FL',
    email: 'phoenix.baker@gmail.com',
    phone: '(415) 555-6789',
    lifetimeSpend: '$1,150.00',
    lastPurchase: '29 Feb, 2026',
    customerSince: '02 Dec, 2018',
    isMember: true,
    alert: 'info',
  },
  {
    id: 'cameron-williamson',
    name: 'Cameron Williamson',
    initials: 'CW',
    avatarUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=120&h=120&fit=crop',
    city: 'Seattle',
    state: 'WA',
    email: 'cameron.williamson@gmail.com',
    phone: '(202) 555-3456',
    lifetimeSpend: '$1,400.00',
    lastPurchase: '11 Dec, 2025',
    customerSince: '28 Apr, 2022',
    isMember: false,
  },
  {
    id: 'robert-fox',
    name: 'Robert Fox',
    initials: 'RF',
    city: 'Austin',
    state: 'TX',
    email: 'robert.fox@gmail.com',
    phone: '(617) 555-4567',
    lifetimeSpend: '$1,500.00',
    lastPurchase: '01 May, 2026',
    customerSince: '19 Sept, 2020',
    isMember: false,
    alert: 'warning',
  },
  {
    id: 'jacob-jones',
    name: 'Jacob Jones',
    initials: 'JJ',
    city: 'Denver',
    state: 'CO',
    email: 'jj@gmail.com',
    phone: '(503) 555-8901',
    lifetimeSpend: '$1,600.00',
    lastPurchase: '18 Nov, 2025',
    customerSince: '01 Aug, 2019',
    isMember: false,
    alert: 'danger',
  },
  {
    id: 'albert-flores',
    name: 'Albert Flores',
    initials: 'AF',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop',
    city: 'Phoenix',
    state: 'AZ',
    email: 'albert.flores@gmail.com',
    phone: '(404) 555-1234',
    lifetimeSpend: '$1,700.00',
    lastPurchase: '22 June, 2026',
    customerSince: '14 June, 2021',
    isMember: true,
  },
  {
    id: 'guy-hawkins',
    name: 'Guy Hawkins',
    initials: 'GH',
    city: 'Orlando',
    state: 'FL',
    email: 'ghawk@gmail.com',
    phone: '(305) 555-5678',
    lifetimeSpend: '$1,800.00',
    lastPurchase: '07 Aug, 2025',
    customerSince: '30 Nov, 2022',
    isMember: false,
  },
  {
    id: 'bessie-cooper',
    name: 'Bessie Cooper',
    initials: 'BC',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop',
    city: 'San Francisco',
    state: 'CA',
    email: 'bessie.cooper@gmail.com',
    phone: '(702) 555-2341',
    lifetimeSpend: '$1,900.00',
    lastPurchase: '19 Sept, 2026',
    customerSince: '11 Oct, 2018',
    isMember: true,
  },
  {
    id: 'jerome-bell',
    name: 'Jerome Bell',
    initials: 'JB',
    avatarUrl: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=120&h=120&fit=crop',
    city: 'Portland',
    state: 'OR',
    email: 'jerome.b@gmail.com',
    phone: '(919) 555-6780',
    lifetimeSpend: '$2,000.00',
    lastPurchase: '19 Sept, 2026',
    customerSince: '03 Jul, 2020',
    isMember: false,
  },
]
