import { useCallback, useState } from 'react'

// ─── useResponsiveSidebar ────────────────────────────────────────────────────
// Single hook every dashboard layout shares. Centralises the two pieces of
// state the sidebar / navbar combo needs to be responsive:
//
//   • `collapsed`   — desktop-only (md+). Toggles the inline sidebar between
//                     full-width (288 px) and icon-only (72 px).
//   • `mobileOpen`  — sub-md. Drives the slide-in overlay drawer that
//                     replaces the inline sidebar on small screens.
//
// `onMenuToggle` does the right thing automatically based on the current
// viewport — it fires the desktop-collapse on md+ and opens the mobile drawer
// below md. So layouts can wire one callback and forget about the breakpoint.
//
// Pair with `<Navbar device="responsive" onMenuToggle={onMenuToggle} />` and
// `<AppSidebar collapsed={collapsed} mobileOpen={mobileOpen} onMobileClose={closeMobile} />`.

const MD_QUERY = '(min-width: 768px)'

function isMdUp(): boolean {
  if (typeof window === 'undefined') return true
  return window.matchMedia(MD_QUERY).matches
}

export interface ResponsiveSidebarState {
  collapsed: boolean
  mobileOpen: boolean
  onMenuToggle: () => void
  closeMobile: () => void
}

export function useResponsiveSidebar(): ResponsiveSidebarState {
  const [collapsed, setCollapsed]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const onMenuToggle = useCallback(() => {
    if (isMdUp()) {
      setCollapsed((c) => !c)
    } else {
      setMobileOpen((o) => !o)
    }
  }, [])

  const closeMobile = useCallback(() => setMobileOpen(false), [])

  return { collapsed, mobileOpen, onMenuToggle, closeMobile }
}
