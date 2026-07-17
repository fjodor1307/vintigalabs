// Shared dashboard chrome for the POS Profiles screens — AppSidebar + Navbar +
// scrollable content, matching the other Vintiga web dashboards.

import { type ReactNode } from 'react'
import { AppSidebar } from '@ds/shared/AppSidebar'
import { Navbar } from '@ds/shared/Navbar'
import { useResponsiveSidebar } from '@ds/shared/useResponsiveSidebar'

export function PosProfilesShell({ children }: { children: ReactNode }) {
  const { collapsed, mobileOpen, onMenuToggle, closeMobile } = useResponsiveSidebar()

  return (
    <div className="flex h-full bg-vintiga-white">
      <AppSidebar collapsed={collapsed} mobileOpen={mobileOpen} onMobileClose={closeMobile} activeNav="POS Profiles" />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <Navbar
          device="responsive"
          fixed
          user={{ name: 'Tom Cook', initials: 'TC' }}
          onMenuToggle={onMenuToggle}
          onUserClick={() => {}}
          onNotificationClick={() => {}}
        />
        <main className="flex-1 overflow-y-auto pt-16 bg-vintiga-slate-50">{children}</main>
      </div>
    </div>
  )
}
