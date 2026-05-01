import type { ReactNode } from 'react'
import { BellIcon, MenuIcon, SidebarIcon, ChevronDownIcon } from '@ds/icons/Icons'
import { Avatar } from '@ds/shared/Avatar'

// ─── Navbar ───────────────────────────────────────────────────────────────────
// Vintiga app navbar — Figma-accurate (5568:17959).
//   Layouts:
//     desktop — sidebar-toggle (panel-left) on left · right cluster (bell · divider · avatar-pill)
//     mobile  — hamburger menu on left · right cluster
//   The component reads its own viewport via Tailwind: pass a single `Navbar` and it adapts.
//   Pass `device="desktop"` or `"mobile"` to lock a specific layout (showcase / responsive override).
//
// ─── Fixed-at-top pattern ───────────────────────────────────────────────────
// Pass `fixed` when the Navbar should pin to the top of its content column
// regardless of scroll boundary or overscroll bounce. The component absolute-
// positions itself with `inset-x-0 top-0 z-30`. The consumer's layout must:
//
//   1. Mark the immediate parent `position: relative` so the absolute Navbar
//      anchors there (otherwise it climbs up to the next positioned ancestor).
//   2. Add `pt-16` (= h-16, the navbar's own height) to the scrolling content
//      so the first row clears the bar at scroll-top. Content scrolls under
//      the bar at higher scroll values, producing the iOS-style blur.
//
//   <div className="flex-1 flex flex-col min-w-0 relative">  ← anchor
//     <Navbar fixed user={…} onMenuToggle={…} />
//     <main className="flex-1 overflow-y-auto pt-16">       ← clears bar
//       {children}
//     </main>
//   </div>
//
// Why `absolute` instead of `position: sticky`? Sticky elements get pushed
// around by overscroll bounce on macOS / iOS and behave inconsistently when
// the scroll container's overflow setup is brittle. Absolute positions the
// navbar once and never lets it move.

export interface NavbarUser {
  name: string
  initials?: string
  /** Optional image URL — falls back to initials. */
  avatarSrc?: string
}

export interface NavbarProps {
  /** User shown in the avatar pill on the right. */
  user?: NavbarUser
  /** Click handler for the avatar pill (open user menu). */
  onUserClick?: () => void
  /** Click handler for the sidebar toggle / hamburger. */
  onMenuToggle?: () => void
  /** Click handler for the bell icon. */
  onNotificationClick?: () => void
  /** When true, renders an unread dot on the bell. */
  hasNotifications?: boolean
  /** Optional centre slot — e.g. a global search field. */
  center?: ReactNode
  /**
   * Lock to a specific layout for previews. Default: responsive
   * (mobile below md, desktop md+).
   */
  device?: 'responsive' | 'desktop' | 'mobile'
  /**
   * When true, the navbar absolute-positions itself at the top of its
   * containing column (`inset-x-0 top-0 z-30`). The parent must be
   * `position: relative` and the scrolling sibling must reserve `pt-16` for
   * the first row to clear the bar. See file header for the full pattern.
   */
  fixed?: boolean
  className?: string
}

// ─── Avatar pill ──────────────────────────────────────────────────────────────

interface AvatarPillProps {
  user: NavbarUser
  onClick?: () => void
}

function AvatarPill({ user, onClick }: AvatarPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-transparent hover:bg-vintiga-slate-50 transition-colors cursor-pointer border-0"
    >
      <Avatar size="md" name={user.name} initials={user.initials} src={user.avatarSrc} />
      <span className="typo-body-sm font-semibold text-vintiga-slate-800 whitespace-nowrap">
        {user.name}
      </span>
      <ChevronDownIcon className="w-5 h-5 text-vintiga-slate-500 shrink-0" />
    </button>
  )
}

// ─── Right cluster (bell + divider + avatar) ──────────────────────────────────

interface RightClusterProps {
  user?: NavbarUser
  onUserClick?: () => void
  onNotificationClick?: () => void
  hasNotifications?: boolean
}

function RightCluster({ user, onUserClick, onNotificationClick, hasNotifications }: RightClusterProps) {
  return (
    <div className="flex items-center gap-vintiga-md">
      <button
        type="button"
        onClick={onNotificationClick}
        aria-label="Notifications"
        className="relative w-6 h-6 flex items-center justify-center text-vintiga-slate-500 hover:text-vintiga-slate-800 transition-colors cursor-pointer p-0 bg-transparent border-0"
      >
        <BellIcon className="w-6 h-6" />
        {hasNotifications && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-vintiga-red-500 rounded-full ring-2 ring-vintiga-white" />
        )}
      </button>
      <span className="w-px h-6 bg-vintiga-slate-200" aria-hidden="true" />
      {user && <AvatarPill user={user} onClick={onUserClick} />}
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Navbar({
  user,
  onUserClick,
  onMenuToggle,
  onNotificationClick,
  hasNotifications,
  center,
  device = 'responsive',
  fixed = false,
  className = '',
}: NavbarProps) {
  // Visibility helpers for responsive vs locked layouts
  const showDesktopToggle = device === 'desktop' ? '' : device === 'mobile' ? 'hidden' : 'hidden md:inline-flex'
  const showMobileToggle  = device === 'mobile'  ? '' : device === 'desktop' ? 'hidden' : 'inline-flex md:hidden'

  // Padding swaps to match Figma: desktop pl-3 pr-6, mobile px-6
  const padding = device === 'desktop'
    ? 'pl-vintiga-sm pr-vintiga-lg'
    : device === 'mobile'
      ? 'px-vintiga-lg'
      : 'pl-vintiga-lg pr-vintiga-lg md:pl-vintiga-sm'

  return (
    <header
      className={[
        // iOS-style translucent bar — pair with `fixed` (or pin via your own
        // positioning) so content blurs through as it scrolls under the bar.
        // Bg is mostly opaque (85%) with a strong saturation boost on the blur
        // so the bar reads as a solid fixed surface even when long table rows
        // scroll beneath it; a soft shadow reinforces the elevation.
        'flex items-center justify-between h-16 w-full',
        'bg-vintiga-white/85 backdrop-blur-md backdrop-saturate-150',
        'border-b border-vintiga-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.04)]',
        // `fixed` mode: pin to the top of the nearest positioned ancestor.
        // Document: parent must be `relative`; sibling scroll content needs
        // `pt-16` to clear this bar at scroll-top.
        fixed ? 'absolute inset-x-0 top-0 z-30' : '',
        padding,
        className,
      ].join(' ')}
    >
      {/* Left: sidebar toggle (responsive icon swap) */}
      <div className="flex items-center gap-vintiga-md min-w-0">
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
          className={`${showDesktopToggle} w-5 h-5 items-center justify-center text-vintiga-slate-700 hover:text-vintiga-slate-900 transition-colors cursor-pointer p-0 bg-transparent border-0`}
        >
          <SidebarIcon className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label="Open menu"
          className={`${showMobileToggle} w-6 h-6 items-center justify-center text-vintiga-slate-700 hover:text-vintiga-slate-900 transition-colors cursor-pointer p-0 bg-transparent border-0`}
        >
          <MenuIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Centre slot (optional — e.g. global search) */}
      {center && (
        <div className="flex-1 flex items-center justify-center px-vintiga-md min-w-0">
          {center}
        </div>
      )}

      {/* Right cluster */}
      <RightCluster
        user={user}
        onUserClick={onUserClick}
        onNotificationClick={onNotificationClick}
        hasNotifications={hasNotifications}
      />
    </header>
  )
}
