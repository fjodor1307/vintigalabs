import { Separator } from '@base-ui/react/separator'
import {
  HomeIcon,
  BotIcon,
  BookOpenIcon,
  SettingsIcon,
  ArrowLeftRightIcon,
  TrendUpIcon,
  EllipsisIcon,
  ChartIcon,
  BoxIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpDownIcon,
  SidebarIcon,
  XIcon,
} from '../icons/Icons'
import { useState, useEffect, useCallback, type ReactNode } from 'react'
import {
  UsersGroupIcon,
  TelescopeIcon,
} from '../icons/Icons'

const iconMap: Record<string, ReactNode> = {
  home: <HomeIcon className="w-4 h-4" />,
  bot: <BotIcon className="w-4 h-4" />,
  bookOpen: <BookOpenIcon className="w-4 h-4" />,
  settings: <SettingsIcon className="w-4 h-4" />,
  arrowLeftRight: <ArrowLeftRightIcon className="w-4 h-4" />,
  trendUp: <TrendUpIcon className="w-4 h-4" />,
  ellipsis: <EllipsisIcon className="w-4 h-4" />,
  chart: <ChartIcon className="w-4 h-4" />,
  box: <BoxIcon className="w-4 h-4" />,
  usersGroup: <UsersGroupIcon className="w-4 h-4" />,
  telescope: <TelescopeIcon className="w-4 h-4" />,
}

interface NavItem {
  icon: string
  label: string
  active?: boolean
  expandable?: boolean
  subItems?: readonly string[]
  badge?: string
}

interface NavGroup {
  label: string
  items: readonly NavItem[]
}

interface SidebarProps {
  navGroups?: readonly NavGroup[]
  mobileOpen?: boolean
  onMobileClose?: () => void
}

const DEFAULT_NAV_GROUPS: readonly NavGroup[] = [
  {
    label: 'Main',
    items: [
      { icon: 'home', label: 'Home', active: true },
      { icon: 'chart', label: 'Dashboard' },
      { icon: 'settings', label: 'Settings' },
    ],
  },
]

/** Returns true when the viewport is below the given breakpoint (in px). */
function useBreakpoint(breakpoint: number) {
  const [below, setBelow] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  )
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const handler = (e: MediaQueryListEvent) => setBelow(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [breakpoint])
  return below
}

function SidebarContent({ collapsed, onToggle, navGroups }: { collapsed: boolean; onToggle: () => void; navGroups: readonly NavGroup[] }) {
  return (
    <div className="bg-vintiga-slate-50 rounded-vintiga-card flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-vintiga-sm">
        <div className={`flex items-center gap-vintiga-sm p-vintiga-sm rounded-vintiga-input ${collapsed ? 'justify-center' : ''}`}>
          {collapsed ? (
            <button
              onClick={onToggle}
              className="cursor-pointer bg-transparent border-none p-0 flex items-center justify-center"
            >
              <ChevronRightIcon className="w-5 h-5 text-vintiga-foreground-muted hover:text-vintiga-foreground transition-colors" />
            </button>
          ) : (
            <>
              <div className="w-9 h-9 shrink-0 rounded-full bg-vintiga-primary flex items-center justify-center typo-body-sm font-semibold text-vintiga-primary-foreground">V</div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-vintiga-lg font-vintiga-display font-bold text-vintiga-foreground leading-tight">Vintiga</span>
                <span className="text-vintiga-xs font-vintiga-display font-light text-vintiga-foreground-muted leading-tight">Enterprise</span>
              </div>
              <button
                onClick={onToggle}
                className="w-7 h-7 rounded-full bg-vintiga-surface-element text-vintiga-foreground-muted flex items-center justify-center cursor-pointer border-none hover:bg-vintiga-border hover:text-vintiga-foreground transition-colors shrink-0"
              >
                <SidebarIcon className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Nav groups */}
      <div className="flex-1 px-vintiga-sm overflow-y-auto">
        {navGroups.map((group, gi) => (
          <div key={group.label} className={`p-vintiga-sm ${gi > 0 ? '' : ''}`}>
            {!collapsed && (
              <div className="px-vintiga-sm h-8 flex items-center">
                <span className="text-vintiga-xs text-vintiga-foreground-muted">{group.label}</span>
              </div>
            )}
            {collapsed && gi > 0 && (
              <Separator className="h-px bg-vintiga-border mb-vintiga-sm" />
            )}
            <nav className="flex flex-col gap-1">
              {group.items.map((item) => (
                <div key={item.label}>
                  <button
                    className={`flex items-center gap-vintiga-sm p-vintiga-sm rounded-vintiga-input transition-colors cursor-pointer border-none w-full text-left ${
                      item.active
                        ? 'bg-vintiga-surface-element text-vintiga-foreground'
                        : 'text-vintiga-foreground hover:bg-vintiga-surface-element'
                    } ${collapsed ? 'justify-center' : ''}`}
                  >
                    <span className="shrink-0">{iconMap[item.icon]}</span>
                    {!collapsed && (
                      <>
                        <span className="text-vintiga-sm flex-1 whitespace-nowrap">{item.label}</span>
                        {'badge' in item && item.badge && (
                          <span className="bg-vintiga-primary text-white text-vintiga-xs rounded-full px-1.5 py-0.5 leading-none font-medium min-w-[20px] text-center">
                            {item.badge}
                          </span>
                        )}
                        {'expandable' in item && item.expandable && (
                          item.active
                            ? <ChevronDownIcon className="w-4 h-4 text-vintiga-foreground-muted shrink-0" />
                            : <ChevronRightIcon className="w-4 h-4 text-vintiga-foreground-muted shrink-0" />
                        )}
                      </>
                    )}
                  </button>
                  {!collapsed && item.active && 'subItems' in item && item.subItems && (
                    <div className="ml-[22px] pl-vintiga-sm border-l border-vintiga-border">
                      {item.subItems.map((sub) => (
                        <button
                          key={sub}
                          className="flex items-center w-full text-left px-vintiga-sm h-7 rounded-vintiga-input text-vintiga-sm text-vintiga-foreground hover:bg-vintiga-surface-element transition-colors cursor-pointer border-none"
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-vintiga-sm mt-auto">
        <div className={`flex items-center gap-vintiga-sm p-vintiga-sm rounded-vintiga-input ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-xl bg-[#c7b9da] shrink-0 overflow-hidden flex items-center justify-center">
            <span className="text-vintiga-xs font-medium text-white">SJ</span>
          </div>
          {!collapsed && (
            <>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-vintiga-sm text-vintiga-foreground truncate">Sara Jones</span>
                <span className="text-vintiga-xs font-light text-vintiga-foreground-muted truncate">mb@example.com</span>
              </div>
              <ChevronUpDownIcon className="w-4 h-4 text-vintiga-foreground-muted shrink-0" />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function Sidebar({ navGroups, mobileOpen, onMobileClose }: SidebarProps) {
  const groups = navGroups ?? DEFAULT_NAV_GROUPS
  const isMedium = useBreakpoint(1024) // true when < lg (768–1023)

  // Manual toggle only works on large screens; on medium it's forced collapsed
  const [manualCollapsed, setManualCollapsed] = useState(false)
  const collapsed = isMedium || manualCollapsed

  const handleToggle = useCallback(() => {
    if (isMedium) return // can't expand on medium — not enough room
    setManualCollapsed((prev) => !prev)
  }, [isMedium])

  return (
    <>
      {/* Desktop / tablet sidebar — hidden below md (768px) */}
      <aside className={`hidden md:flex flex-col h-full p-vintiga-sm shrink-0 transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-[237px]'}`}>
        <SidebarContent collapsed={collapsed} onToggle={handleToggle} navGroups={groups} />
      </aside>

      {/* Mobile overlay — visible below md when open */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onMobileClose}
          />
          <div className="relative w-[280px] h-full p-vintiga-sm flex flex-col animate-slide-in-left">
            <div className="absolute top-vintiga-sm right-vintiga-sm z-10">
              <button
                onClick={onMobileClose}
                className="w-8 h-8 rounded-full bg-vintiga-surface-element text-vintiga-foreground flex items-center justify-center cursor-pointer border-none hover:bg-vintiga-border transition-colors"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
            <SidebarContent collapsed={false} onToggle={() => {}} navGroups={groups} />
          </div>
        </div>
      )}
    </>
  )
}
