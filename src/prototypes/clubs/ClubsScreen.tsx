import { useEffect, useRef, useState } from 'react'
import { Tooltip } from '@base-ui/react/tooltip'
import { ClubsLayout } from './ClubsLayout'
import { AddClubModal } from './AddClubModal'
import { ClubCard } from '@ds/shared/ClubCard'
import { Tag } from '@ds/shared/Tag'
import { Button } from '@ds/shared/Button'
import { PopoverMenu } from '@ds/shared/PopoverMenu'
import {
  DropdownMenu,
  DropdownItem,
} from '@ds/shared/Dropdown'
import {
  PlusIcon,
  EllipsisIcon,
  ChevronDownIcon,
  CheckIcon,
  InfoIcon,
} from '@ds/icons/Icons'

// ─── Demo data ────────────────────────────────────────────────────────────────

type ClubStatus = 'active' | 'inactive'
type ClubSource = 'vintiga' | 'commerce7'

interface Club {
  id: string
  name: string
  status: ClubStatus
  /** Where the club lives. `commerce7` clubs are read-only — they're managed
   *  in the Commerce7 admin and surfaced here purely for visibility. The card
   *  is non-clickable and every row action is disabled. */
  source: ClubSource
  tags: { label: string; tone: 'info' | 'violet' | 'teal' | 'blue' | 'orange' }[]
  active: number
  onHold: number
  newM: number
  canceled: number
  imageUrl: string
}

// Real Unsplash photos — wine-bar / bottle / vineyard imagery so the cards feel like a real winery DTC dashboard.
const CLUBS: Club[] = [
  {
    id: 'c7',
    name: 'C7',
    status: 'active',
    source: 'commerce7',
    tags: [
      { label: 'Commerce7',   tone: 'info' },
      { label: 'Traditional', tone: 'violet' },
    ],
    active: 10, onHold: 2, newM: 2, canceled: 1,
    imageUrl: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=200&h=200&fit=crop',
  },
  {
    id: 'vintiga-heritage',
    name: 'Vintiga Heritage',
    status: 'active',
    source: 'vintiga',
    tags: [{ label: 'Curated Club', tone: 'violet' }],
    active: 10, onHold: 2, newM: 2, canceled: 1,
    imageUrl: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=200&h=200&fit=crop',
  },
  {
    id: 'vintiga-signature',
    name: 'Vintiga Signature',
    status: 'active',
    source: 'vintiga',
    tags: [{ label: 'Membership', tone: 'violet' }],
    active: 10, onHold: 2, newM: 2, canceled: 1,
    imageUrl: 'https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?w=200&h=200&fit=crop',
  },
  {
    id: 'blind-enthusiasm',
    name: 'Blind Enthusiasm',
    status: 'active',
    source: 'vintiga',
    tags: [{ label: 'Tasting Credit', tone: 'violet' }],
    active: 10, onHold: 2, newM: 2, canceled: 1,
    imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=200&h=200&fit=crop',
  },
]

// ─── Status filter dropdown (single-select) ───────────────────────────────────
// Matches Figma — outline trigger "Active Clubs (4) ▾", popup with checkmark on
// the picked option. Counts are computed live from CLUBS.

const STATUS_LABEL: Record<ClubStatus, string> = {
  active:   'Active',
  inactive: 'Inactive',
}

function StatusDropdown({
  value,
  counts,
  onChange,
}: {
  value: ClubStatus
  counts: Record<ClubStatus, number>
  onChange: (next: ClubStatus) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="outline"
        size="md"
        rightIcon={<ChevronDownIcon />}
        onClick={() => setOpen((o) => !o)}
      >
        {STATUS_LABEL[value]} Clubs ({counts[value]})
      </Button>
      {open && (
        <DropdownMenu className="absolute top-full mt-1.5 left-0 z-50 w-56 p-1">
          {(Object.keys(STATUS_LABEL) as ClubStatus[]).map((k) => (
            <DropdownItem
              key={k}
              leftIcon={
                value === k ? (
                  <CheckIcon className="w-4 h-4 text-vintiga-slate-700" />
                ) : (
                  <span className="w-4 h-4" />
                )
              }
              onClick={() => {
                onChange(k)
                setOpen(false)
              }}
            >
              {STATUS_LABEL[k]} Clubs ({counts[k]})
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </div>
  )
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function ClubsScreen() {
  const [statusFilter, setStatusFilter] = useState<ClubStatus>('active')
  const [showAddModal, setShowAddModal]  = useState(false)

  const counts: Record<ClubStatus, number> = {
    active:   CLUBS.filter((c) => c.status === 'active').length,
    inactive: CLUBS.filter((c) => c.status === 'inactive').length,
  }
  const filtered = CLUBS.filter((c) => c.status === statusFilter)

  return (
    <ClubsLayout activeTab="clubs">
      {/* Filter row + Add Club */}
      <div className="flex items-center justify-between gap-vintiga-md">
        <StatusDropdown
          value={statusFilter}
          counts={counts}
          onChange={setStatusFilter}
        />
        <Button
          size="md"
          leftIcon={<PlusIcon />}
          onClick={() => setShowAddModal(true)}
        >
          Add Club
        </Button>
      </div>

      {/* Club list — each row owns its border + hover, stacked with gap */}
      <div className="flex flex-col gap-vintiga-md">
        {filtered.length === 0 && (
          <div className="py-vintiga-2xl text-center typo-body-sm text-vintiga-slate-500">
            No {STATUS_LABEL[statusFilter].toLowerCase()} clubs.
          </div>
        )}
        {filtered.map((club) =>
          club.source === 'commerce7' ? (
            <ReadOnlyClubRow key={club.id} club={club} />
          ) : (
            <ClubCard
              key={club.id}
              image={
                <img
                  src={club.imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              }
              title={club.name}
              tags={club.tags.map((t) => (
                <Tag tone={t.tone} size="sm">
                  {t.label}
                </Tag>
              ))}
              meta={`${club.active} Active | ${club.onHold} On-hold | ${club.newM} New | ${club.canceled} Canceled`}
              onClick={() => { window.location.hash = `#/web/clubs/view/${club.id}/overview` }}
              action={
                <PopoverMenu
                  align="right"
                  width="w-44"
                  trigger={(_open, toggle) => (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggle()
                      }}
                      className="w-8 h-8 rounded-vintiga-md flex items-center justify-center hover:bg-vintiga-slate-100 transition-colors bg-transparent border-none cursor-pointer"
                      aria-label={`${club.name} actions`}
                    >
                      <EllipsisIcon className="w-4 h-4 text-vintiga-slate-500" />
                    </button>
                  )}
                  items={[
                    { label: 'Edit',      onClick: () => { window.location.hash = `#/web/clubs/view/${club.id}/overview` } },
                    { label: 'Duplicate', onClick: () => {} },
                    { label: 'Archive',   onClick: () => {}, danger: true },
                  ]}
                />
              }
            />
          ),
        )}
      </div>

      <AddClubModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </ClubsLayout>
  )
}

// ─── ReadOnlyClubRow ─────────────────────────────────────────────────────────
// Commerce7-synced clubs are surfaced for visibility but managed in C7. Per
// VIN-496 the 3-dot action menu is hidden — operators can't Edit / Duplicate
// / Archive a synced club from this list. To keep the "why is this card
// inert?" question answerable, we replace the 3-dot slot with a small info
// icon that opens a base-ui tooltip explaining the read-only state on
// hover / focus. Same pattern as `FlaggedFlag`.

function ReadOnlyClubRow({ club }: { club: Club }) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <ClubCard
          image={
            <img
              src={club.imageUrl}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          }
          title={club.name}
          tags={club.tags.map((t) => (
            <Tag tone={t.tone} size="sm">
              {t.label}
            </Tag>
          ))}
          meta={`${club.active} Active | ${club.onHold} On-hold | ${club.newM} New | ${club.canceled} Canceled`}
          action={
            <Tooltip.Trigger
              render={
                <button
                  type="button"
                  aria-label={`${club.name} — read-only, managed in Commerce 7`}
                  onClick={(e) => { e.stopPropagation(); e.preventDefault() }}
                  className="w-8 h-8 rounded-vintiga-md flex items-center justify-center bg-transparent border-none cursor-help text-vintiga-slate-400 hover:text-vintiga-slate-600 hover:bg-vintiga-slate-50 transition-colors"
                >
                  <InfoIcon className="w-4 h-4" />
                </button>
              }
            />
          }
        />
        <Tooltip.Portal>
          <Tooltip.Positioner sideOffset={6}>
            <Tooltip.Popup className="max-w-[260px] bg-vintiga-foreground text-vintiga-surface typo-caption font-medium px-2 py-1.5 rounded shadow-lg">
              This club is synced from Commerce 7. To make changes, manage it in Commerce 7.
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
