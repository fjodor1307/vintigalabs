import type { ReactNode } from 'react'
import { AppSidebar } from '@ds/shared/AppSidebar'
import { Navbar } from '@ds/shared/Navbar'
import { useResponsiveSidebar } from '@ds/shared/useResponsiveSidebar'
import { PageTemplate } from '@ds/shared/PageTemplate'
import { BreadcrumbHomeIcon } from '@ds/shared/Breadcrumb'

// ─── SettingsLayout ──────────────────────────────────────────────────────────
// Shared shell for every screen in the Settings prototype. Keeps the
// sidebar (Settings nav highlighted) + Navbar + PageTemplate boilerplate in
// one place so each screen only owns its content + actions. Breadcrumbs are
// only rendered for sub-pages — the Settings index itself omits them.

export function SettingsLayout({
  breadcrumbs,
  breadcrumbHomeHref = '#/web/settings',
  title,
  actions,
  rail,
  children,
}: {
  /** Omit to hide the breadcrumb row entirely (used on the Settings index). */
  breadcrumbs?: { icon?: ReactNode; label?: ReactNode; href?: string }[]
  /** Target for the leading home-icon crumb. Defaults to the Settings index,
   *  but can point elsewhere when Settings is opened from a launcher (e.g.
   *  the Experience Schedule tab routes Home back to the product editor). */
  breadcrumbHomeHref?: string
  title: ReactNode
  actions?: ReactNode
  /** Optional right rail — when set, main column shrinks to 2/3 width. */
  rail?: ReactNode
  children: ReactNode
}) {
  const { collapsed, mobileOpen, onMenuToggle, closeMobile } = useResponsiveSidebar()
  const fullCrumbs = breadcrumbs && breadcrumbs.length > 0
    ? [{ icon: <BreadcrumbHomeIcon />, href: breadcrumbHomeHref }, ...breadcrumbs]
    : undefined

  return (
    <div className="flex h-full bg-vintiga-white">
      <AppSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={closeMobile}
        activeNav="Settings"
      />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Navbar
          device="responsive"
          fixed
          user={{ name: 'Tom Cook', initials: 'TC' }}
          onMenuToggle={onMenuToggle}
          onUserClick={() => {}}
          onNotificationClick={() => {}}
        />
        <div className="flex-1 overflow-y-auto pt-16 bg-vintiga-white">
          <PageTemplate
            breadcrumbs={fullCrumbs}
            title={title}
            actions={actions}
            rail={rail}
          >
            {children}
          </PageTemplate>
        </div>
      </div>
    </div>
  )
}
