import { useState, type ReactNode } from 'react'
import { AppSidebar } from '@ds/shared/AppSidebar'
import { Navbar } from '@ds/shared/Navbar'
import { useResponsiveSidebar } from '@ds/shared/useResponsiveSidebar'
import { BreadcrumbHomeIcon } from '@ds/shared/Breadcrumb'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { SegmentedControl } from '@ds/shared/SegmentedControl'
import { RailSection } from '@ds/shared/RightRail'
import { PageTemplate } from '@ds/shared/PageTemplate'
import { PopoverMenu } from '@ds/shared/PopoverMenu'
import { Tag } from '@ds/shared/Tag'
import { TextField } from '@ds/shared/TextField'
import { Avatar } from '@ds/shared/Avatar'
import {
  EllipsisVerticalIcon,
  EllipsisIcon,
  PencilIcon,
  PlusIcon,
  FlagIcon,
  CheckIcon,
  FileTextIcon,
  SearchIcon,
} from '@ds/icons/Icons'
import { CUSTOMER, type CustomerNote, type NoteKind } from './customerSample'
import { customerActions, useCustomerDisplayName, useCustomerNotes } from './customerStore'
import { NoteModal } from './NoteModal'

// ─── CustomerViewLayout ───────────────────────────────────────────────────────
// Shared shell for the customer detail flow — AppSidebar (Customers active) +
// Navbar + PageTemplate with breadcrumb (Home › Customers › {name}), the
// eight-tab segmented control, and the right rail (Notes + Tags). Mirrors the
// pattern set by `ClubViewLayout` for the clubs prototype.
//
// Only Overview is wired in v1; the other tabs are visible-but-inert so the
// journey reads correctly from the prototype index.

export type CustomerViewTab =
  | 'overview'
  | 'orders'
  | 'billing'
  | 'memberships'
  | 'important-dates'
  | 'relationships'
  | 'reservations'
  | 'chats'

const ROUTES: Record<CustomerViewTab, string> = {
  overview:          '#/web/customers/view/overview',
  orders:            '#/web/customers/view/overview',
  billing:           '#/web/customers/view/billing',
  memberships:       '#/web/customers/view/overview',
  'important-dates': '#/web/customers/view/overview',
  relationships:     '#/web/customers/view/overview',
  reservations:      '#/web/customers/view/overview',
  chats:             '#/web/customers/view/overview',
}

const TABS: { value: CustomerViewTab; label: string; href: string }[] = [
  { value: 'overview',        label: 'Overview',        href: ROUTES.overview },
  { value: 'orders',          label: 'Orders',          href: ROUTES.orders },
  { value: 'billing',         label: 'Billing',         href: ROUTES.billing },
  { value: 'memberships',     label: 'Memberships',     href: ROUTES.memberships },
  { value: 'important-dates', label: 'Important Dates', href: ROUTES['important-dates'] },
  { value: 'relationships',   label: 'Relationships',   href: ROUTES.relationships },
  { value: 'reservations',    label: 'Reservations',    href: ROUTES.reservations },
  { value: 'chats',           label: 'Chats',           href: ROUTES.chats },
]

// ─── Right rail — Notes + Tags ───────────────────────────────────────────────

const NOTE_KIND_META: Record<NoteKind, { label: string; bg: string; text: string; icon: ReactNode }> = {
  flag: {
    label: 'Flag',
    bg: 'bg-vintiga-red-100',
    text: 'text-vintiga-red-700',
    icon: <FlagIcon />,
  },
  reminder: {
    label: 'Reminder',
    bg: 'bg-vintiga-blue-100',
    text: 'text-vintiga-blue-800',
    icon: <CheckIcon />,
  },
  note: {
    label: 'Note',
    bg: 'bg-vintiga-slate-100',
    text: 'text-vintiga-slate-700',
    icon: <FileTextIcon />,
  },
}

function NoteCard({ note, onEdit, onDelete }: { note: CustomerNote; onEdit: () => void; onDelete: () => void }) {
  const meta = NOTE_KIND_META[note.kind]
  return (
    <article className="border border-vintiga-slate-200 rounded-vintiga-lg overflow-hidden bg-vintiga-white">
      <header className={`flex items-center justify-between gap-vintiga-sm px-vintiga-md py-2 ${meta.bg}`}>
        <span className={`inline-flex items-center gap-1.5 typo-body-sm font-semibold ${meta.text}`}>
          <span className="[&>svg]:w-4 [&>svg]:h-4">{meta.icon}</span>
          {meta.label}
        </span>
        <PopoverMenu
          align="right"
          width="w-44"
          trigger={(_open, toggle) => (
            <IconButton
              variant="outline"
              size="xs"
              icon={<EllipsisIcon />}
              onClick={toggle}
              aria-label={`More options for ${meta.label.toLowerCase()}`}
              className="bg-vintiga-white/60"
            />
          )}
          items={[
            { label: 'Edit',         onClick: onEdit },
            { label: 'View History', onClick: () => {} },
            { label: 'Delete',       onClick: onDelete, danger: true },
          ]}
        />
      </header>

      <div className="px-vintiga-md py-vintiga-md flex flex-col gap-vintiga-sm">
        {note.assignee && (
          <div className="flex items-center gap-vintiga-sm">
            <Avatar name={note.assignee.name} src={note.assignee.avatarUrl} size="sm" />
            <div className="flex flex-col">
              <span className="typo-body-sm font-semibold text-vintiga-slate-900">{note.assignee.name}</span>
              <span className="typo-caption text-vintiga-slate-500">{note.assignee.createdAt}</span>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-1">
          <p className="typo-body-sm font-semibold text-vintiga-slate-900">{note.title}</p>
          <p className="typo-caption text-vintiga-slate-500">{note.createdAt}</p>
          <p className="typo-caption text-vintiga-slate-500">By {note.author}</p>
        </div>
        <p className="typo-body-sm text-vintiga-slate-700">{note.body}</p>
      </div>
    </article>
  )
}

function NotesSection() {
  const notes = useCustomerNotes()
  const [addOpen, setAddOpen]   = useState(false)
  const [editing, setEditing]   = useState<CustomerNote | null>(null)

  return (
    <>
      <RailSection
        title="Notes"
        action={
          <Button variant="outline" size="sm" leftIcon={<PlusIcon />} onClick={() => setAddOpen(true)}>
            Add
          </Button>
        }
      >
        <div className="flex flex-col gap-vintiga-md">
          {notes.map((n) => (
            <NoteCard
              key={n.id}
              note={n}
              onEdit={() => setEditing(n)}
              onDelete={() => customerActions.deleteNote(n.id)}
            />
          ))}
        </div>
      </RailSection>

      <NoteModal mode="add" open={addOpen} onClose={() => setAddOpen(false)} />
      {editing && (
        <NoteModal mode="edit" open={!!editing} note={editing} onClose={() => setEditing(null)} />
      )}
    </>
  )
}

function TagsSection() {
  const [query, setQuery] = useState('')
  const [tags, setTags] = useState<string[]>(CUSTOMER.tags)

  return (
    <RailSection
      title="Tags"
      action={
        <Button variant="outline" size="sm" leftIcon={<PlusIcon />} onClick={() => {}}>
          Add
        </Button>
      }
    >
      <div className="flex flex-col gap-vintiga-md">
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          leftIcon={<SearchIcon />}
        />
        <div className="flex flex-wrap gap-vintiga-xs">
          {tags.map((t) => (
            <Tag
              key={t}
              variant="outline"
              size="md"
              onRemove={() => setTags((prev) => prev.filter((p) => p !== t))}
            >
              {t}
            </Tag>
          ))}
        </div>
      </div>
    </RailSection>
  )
}

function CustomerRail() {
  return (
    <>
      <NotesSection />
      <TagsSection />
    </>
  )
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export function CustomerViewLayout({
  activeTab,
  hideRail = false,
  hideTitle = false,
  actions,
  children,
}: {
  activeTab: CustomerViewTab | null
  hideRail?: boolean
  /** When true, omits the auto h1 — the screen renders its own header card. */
  hideTitle?: boolean
  actions?: ReactNode
  children: ReactNode
}) {
  const { collapsed, mobileOpen, onMenuToggle, closeMobile } = useResponsiveSidebar()
  const displayName = useCustomerDisplayName()

  return (
    <div className="flex h-full bg-vintiga-white">
      <AppSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={closeMobile}
        activeNav="Customers"
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
            breadcrumbs={[
              { icon: <BreadcrumbHomeIcon />, href: '#/web/customers' },
              { label: 'Customers', href: '#/web/customers' },
              { label: displayName },
            ]}
            title={hideTitle ? undefined : displayName}
            actions={
              hideTitle
                ? undefined
                : (actions ?? (
                    <>
                      <Button leftIcon={<PencilIcon />} onClick={() => {}}>
                        Update
                      </Button>
                      <IconButton
                        variant="outline"
                        size="md"
                        icon={<EllipsisVerticalIcon />}
                        onClick={() => {}}
                        aria-label="More actions"
                      />
                    </>
                  ))
            }
            tabs={
              activeTab ? (
                <SegmentedControl<CustomerViewTab>
                  value={activeTab}
                  aria-label="Customer view tabs"
                  options={TABS}
                />
              ) : undefined
            }
            rail={!hideRail ? <CustomerRail /> : undefined}
          >
            {children}
          </PageTemplate>
        </div>
      </div>
    </div>
  )
}
