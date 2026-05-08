import { SettingsLayout } from './SettingsLayout'
import { Card } from '@ds/shared/Card'
import {
  BuildingIcon,
  GlobeIcon,
  DollarIcon,
  PackageIcon,
  MailIcon,
  UserIcon,
  ShieldCheckIcon,
  TagIcon,
  ChevronRightIcon,
} from '@ds/icons/Icons'

// ─── SettingsScreen ──────────────────────────────────────────────────────────
// Top-level Settings index — a list of every settings group with a short
// description and a click-through. v1 only wires Locations through to a real
// editor; the other groups land on this same page (placeholder) so the
// surface reads as complete without front-loading every editor.

interface Group {
  href: string | null
  icon: React.ReactNode
  title: string
  description: string
}

const GROUPS: Group[] = [
  {
    href: '#/web/settings/general',
    icon: <BuildingIcon />,
    title: 'General',
    description: 'Store identity, branding, contact details, and time zone.',
  },
  {
    href: '#/web/settings/locations',
    icon: <GlobeIcon />,
    title: 'Locations',
    description: 'Manage tasting rooms, warehouses, business hours, and pickup instructions.',
  },
  {
    href: null,
    icon: <DollarIcon />,
    title: 'Tax',
    description: 'Default tax codes, regional overrides, and exemption rules.',
  },
  {
    href: null,
    icon: <PackageIcon />,
    title: 'Shipping',
    description: 'Carrier accounts, packaging defaults, and zone-based rates.',
  },
  {
    href: null,
    icon: <MailIcon />,
    title: 'Email',
    description: 'Transactional templates, sender domain, and unsubscribe defaults.',
  },
  {
    href: null,
    icon: <UserIcon />,
    title: 'Staff',
    description: 'Team members, roles, and access permissions.',
  },
  {
    href: null,
    icon: <ShieldCheckIcon />,
    title: 'Compliance',
    description: 'Age-gate rules, dry-state lists, and compliance reporting.',
  },
  {
    href: null,
    icon: <TagIcon />,
    title: 'Tags & Segments',
    description: 'Customer tags, segment rules, and audience presets.',
  },
]

export function SettingsScreen() {
  return (
    <SettingsLayout
      breadcrumbs={[{ label: 'Settings' }]}
      title="Settings"
    >
      <p className="typo-body-sm text-vintiga-slate-500 -mt-vintiga-sm mb-vintiga-md max-w-2xl">
        Configure how Vintiga handles money, fulfilment, communications, and access for your store.
        Updates here apply across the website, POS, and back office.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-vintiga-md">
        {GROUPS.map((g) => (
          <SettingsTile key={g.title} group={g} />
        ))}
      </div>
    </SettingsLayout>
  )
}

function SettingsTile({ group }: { group: Group }) {
  const interactive = !!group.href
  const inner = (
    <div className="flex items-start gap-vintiga-md p-vintiga-lg">
      <div className="w-10 h-10 rounded-full bg-vintiga-indigo-50 flex items-center justify-center text-vintiga-indigo-500 shrink-0 [&>svg]:w-5 [&>svg]:h-5">
        {group.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="typo-body font-semibold text-vintiga-slate-900">{group.title}</p>
        <p className="typo-body-sm text-vintiga-slate-500 mt-1">{group.description}</p>
      </div>
      {interactive && (
        <ChevronRightIcon className="w-4 h-4 text-vintiga-slate-400 shrink-0 mt-1" />
      )}
    </div>
  )

  if (interactive) {
    return (
      <a
        href={group.href!}
        className="block border border-vintiga-border rounded-vintiga-card bg-vintiga-white hover:border-vintiga-slate-400 transition-colors no-underline text-inherit"
      >
        {inner}
      </a>
    )
  }
  return (
    <Card>
      <div className="flex items-start gap-vintiga-md">
        <div className="w-10 h-10 rounded-full bg-vintiga-slate-100 flex items-center justify-center text-vintiga-slate-400 shrink-0 [&>svg]:w-5 [&>svg]:h-5">
          {group.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="typo-body font-semibold text-vintiga-slate-500">{group.title}</p>
          <p className="typo-body-sm text-vintiga-slate-400 mt-1">{group.description}</p>
        </div>
      </div>
    </Card>
  )
}
