import type { ReactNode } from 'react'
import { useState } from 'react'
import { AppSidebar } from '@ds/shared/AppSidebar'
import { Navbar } from '@ds/shared/Navbar'

// Experiences live under Products in the Vintiga IA — there's no top-level
// "Experiences" nav entry. The sidebar always highlights `Products` here so
// the chrome doesn't shift when a user opens an experience from the products
// catalogue.

export function Shell({
  children,
  bg = 'white',
  activeNav = 'Products',
}: {
  children: ReactNode
  bg?: 'white' | 'slate'
  activeNav?: string
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-full bg-vintiga-white">
      <AppSidebar collapsed={collapsed} activeNav={activeNav} />

      {/* `fixed` Navbar pattern (see DS Navbar.tsx header):
          parent is `relative`, navbar uses `fixed`, scroll sibling has `pt-16`. */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Navbar
          device="desktop"
          fixed
          user={{ name: 'Tom Cook', initials: 'TC' }}
          onMenuToggle={() => setCollapsed((c) => !c)}
          onUserClick={() => {}}
          onNotificationClick={() => {}}
        />
        <main className={`flex-1 overflow-y-auto flex flex-col pt-16 ${bg === 'slate' ? 'bg-vintiga-slate-50' : 'bg-vintiga-white'}`}>
          {children}
        </main>
      </div>
    </div>
  )
}
