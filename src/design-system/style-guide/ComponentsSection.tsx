import { useState } from 'react'
import { SectionHeader } from './SectionHeader'
import { usePlayground, type ControlSchema } from './Playground'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { Checkbox } from '@ds/shared/Checkbox'
import { Radio } from '@ds/shared/Radio'
import { Switch } from '@ds/shared/Switch'
import { AlertSoft } from '@ds/shared/AlertSoft'
import { Card } from '@ds/shared/Card'
import { Pill } from '@ds/shared/Pill'
import { OtpInputGroup } from '@ds/shared/OtpInput'
import { BottomSheet } from '@ds/shared/BottomSheet'
import { EmptyState } from '../components/EmptyState'
import { Skeleton, SkeletonText, SkeletonCard } from '../components/Skeleton'
import { ErrorState } from '../components/ErrorState'
import { ScreenHeader } from '@ds/shared/ScreenHeader'
import { ScreenFooter } from '@ds/shared/ScreenFooter'
import { Tabs } from '@base-ui/react/tabs'
import { Progress } from '@base-ui/react/progress'
import { Separator } from '@base-ui/react/separator'
import { Modal, ModalHeader, ModalAlertHeader, ModalCenteredHeader, ModalBody, ModalFooter } from '@ds/shared/Modal'
import { Tooltip } from '@base-ui/react/tooltip'
import type { ButtonSize, ButtonVariant } from '@ds/shared/Button'
import type { IconButtonVariant } from '@ds/shared/IconButton'
import { Avatar, AvatarGroup, type AvatarSize } from '@ds/shared/Avatar'
import { Tag, type TagTone, type TagVariant } from '@ds/shared/Tag'
import { KpiCard } from '@ds/shared/KpiCard'
import { TextField } from '@ds/shared/TextField'
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@ds/shared/Table'
import { Toast, type ToastVariant } from '@ds/shared/Toast'
import { DropdownMenu, DropdownItem, DropdownSection, DropdownSeparator } from '@ds/shared/Dropdown'
import { SegmentedControl } from '@ds/shared/SegmentedControl'
import { Navbar } from '@ds/shared/Navbar'
import { Sidebar, SidebarHeader, SidebarBody, SidebarItem, SidebarDivider, SidebarFooter, SidebarBadge } from '@ds/shared/Sidebar'
import { ListCard } from '@ds/shared/ListCard'
import { SelectionCard } from '@ds/shared/SelectionCard'
import { Widget, WidgetHeader, WidgetBody, WidgetFooter } from '@ds/shared/Widget'
import { VintigaIconIndigo } from '@ds/shared/VintigaLogo'
import { DollarIcon, TrendUpIcon, UserIcon, SettingsIcon, LogOutIcon, HomeIcon, ChartIcon, BookOpenIcon, ExportIcon, AlertTriangleIcon, InfoIcon, CheckIcon, FolderIcon, SearchIcon, InboxIcon, UsersIcon, PlusIcon, CircleAlertIcon, MessagesSquareIcon, MailIcon, GiftIcon, GlobeIcon, StarIcon, CalendarIcon, PackageIcon, ShoppingCartIcon, CalendarCheckIcon, IdCardIcon, MapPinIcon, ChevronDownIcon, DownloadIcon, EllipsisIcon, GemIcon, HandIcon, BuildingIcon, TagIcon } from '@ds/icons/Icons'

const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
  </svg>
)

function SubSection({ id, title, description, children }: { id: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-4 scroll-mt-20">
      <SectionHeader id={id} title={title} description={description} />
      <div className="border border-vintiga-border rounded-vintiga-card p-6 bg-vintiga-surface">{children}</div>
    </section>
  )
}

const BUTTON_SIZES: ButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl']
const BUTTON_VARIANTS: ButtonVariant[] = ['solid', 'outline']
const ICON_VARIANTS: IconButtonVariant[] = ['solid', 'outline']

// Dotted canvas — Metro pattern
const STAGE_STYLE: React.CSSProperties = {
  minHeight: 280,
  backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)',
  backgroundSize: '20px 20px',
  backgroundColor: '#f8fafc',
}

function PlaygroundStage({ children, minHeight = 280 }: { children: React.ReactNode; minHeight?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-vintiga-xl border border-vintiga-slate-200"
      style={{ ...STAGE_STYLE, minHeight }}
    >
      {children}
    </div>
  )
}

function ReferenceCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="typo-caption font-semibold uppercase tracking-wider text-vintiga-slate-500">{label}</p>
      <div className="border border-vintiga-slate-200 rounded-vintiga-lg p-vintiga-lg bg-vintiga-white">
        {children}
      </div>
    </div>
  )
}

const BUTTON_CONTROLS: ControlSchema = {
  variant:    { type: 'select',  options: ['solid', 'outline'],            default: 'solid' },
  size:       { type: 'select',  options: ['xs', 'sm', 'md', 'lg', 'xl'],  default: 'md' },
  intent:     { type: 'select',  options: ['primary', 'destructive'],      default: 'primary' },
  children:   { type: 'text',    default: 'Button text' },
  leftIcon:   { type: 'boolean', default: true },
  rightIcon:  { type: 'boolean', default: true },
  fullWidth:  { type: 'boolean', default: false },
  disabled:   { type: 'boolean', default: false },
}

function ButtonsSection() {
  const values = usePlayground(BUTTON_CONTROLS)

  return (
    <SubSection
      id="ds-buttons"
      title="Buttons"
      description="Two variants — Solid (primary CTA) and Outline (secondary, neutral slate border). Each supports primary and destructive intents, five sizes, optional icons, and a disabled state."
    >
      <div className="flex flex-col gap-vintiga-xl">
        <PlaygroundStage>
          <Button
            variant={values.variant as ButtonVariant}
            size={values.size as ButtonSize}
            intent={values.intent as 'primary' | 'destructive'}
            fullWidth={values.fullWidth as boolean}
            disabled={values.disabled as boolean}
            leftIcon={values.leftIcon ? <HeartIcon /> : undefined}
            rightIcon={values.rightIcon ? <HeartIcon /> : undefined}
          >
            {values.children as string}
          </Button>
        </PlaygroundStage>

        <ReferenceCard label="Variants">
          <div className="flex flex-wrap gap-4 items-center">
            {BUTTON_VARIANTS.map((v) => (
              <div key={v} className="flex flex-col items-center gap-2">
                <Button variant={v}>Button</Button>
                <span className="typo-caption text-vintiga-slate-400 capitalize">{v}</span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-2">
              <Button disabled>Button</Button>
              <span className="typo-caption text-vintiga-slate-400">Disabled</span>
            </div>
          </div>
        </ReferenceCard>

        <ReferenceCard label="Sizes">
          <div className="flex flex-wrap gap-4 items-end">
            {BUTTON_SIZES.map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <Button size={size}>Button</Button>
                <span className="typo-caption text-vintiga-slate-400 uppercase">{size}</span>
              </div>
            ))}
          </div>
        </ReferenceCard>

        <p className="typo-caption text-vintiga-slate-500">
          Import from <code className="font-mono bg-vintiga-slate-100 px-1 rounded">@ds/shared/Button</code>.
          Props: <code className="font-mono bg-vintiga-slate-100 px-1 rounded">variant</code>,{' '}
          <code className="font-mono bg-vintiga-slate-100 px-1 rounded">intent</code>,{' '}
          <code className="font-mono bg-vintiga-slate-100 px-1 rounded">size</code>,{' '}
          <code className="font-mono bg-vintiga-slate-100 px-1 rounded">leftIcon</code>,{' '}
          <code className="font-mono bg-vintiga-slate-100 px-1 rounded">rightIcon</code>,{' '}
          <code className="font-mono bg-vintiga-slate-100 px-1 rounded">disabled</code>,{' '}
          <code className="font-mono bg-vintiga-slate-100 px-1 rounded">fullWidth</code>,{' '}
          <code className="font-mono bg-vintiga-slate-100 px-1 rounded">as="a" href="..."</code>.
        </p>
      </div>
    </SubSection>
  )
}

const ICON_BUTTON_CONTROLS: ControlSchema = {
  variant:  { type: 'select',  options: ['solid', 'outline'],            default: 'solid' },
  size:     { type: 'select',  options: ['xs', 'sm', 'md', 'lg', 'xl'],  default: 'md' },
  tone:     { type: 'select',  options: ['primary', 'destructive'],      default: 'primary' },
  disabled: { type: 'boolean', default: false },
}

function IconButtonsSection() {
  const values = usePlayground(ICON_BUTTON_CONTROLS)

  return (
    <SubSection
      id="ds-icon-buttons"
      title="Icon Buttons"
      description="Square icon-only action buttons. Same variants, sizes, and states as Button — used when space is tight or the icon is self-describing."
    >
      <div className="flex flex-col gap-vintiga-xl">
        <PlaygroundStage>
          <IconButton
            variant={values.variant as IconButtonVariant}
            size={values.size as ButtonSize}
            tone={values.tone as 'primary' | 'destructive'}
            disabled={values.disabled as boolean}
            icon={<HeartIcon />}
            aria-label="Example action"
          />
        </PlaygroundStage>

        <ReferenceCard label="Variants">
          <div className="flex flex-wrap gap-4 items-center">
            {ICON_VARIANTS.map((v) => (
              <div key={v} className="flex flex-col items-center gap-2">
                <IconButton variant={v} icon={<HeartIcon />} aria-label={v} />
                <span className="typo-caption text-vintiga-slate-400 capitalize">{v}</span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-2">
              <IconButton icon={<HeartIcon />} aria-label="Disabled" disabled />
              <span className="typo-caption text-vintiga-slate-400">Disabled</span>
            </div>
          </div>
        </ReferenceCard>

        <ReferenceCard label="Sizes">
          <div className="flex flex-wrap gap-4 items-end">
            {BUTTON_SIZES.map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <IconButton size={size} icon={<HeartIcon />} aria-label={size} />
                <span className="typo-caption text-vintiga-slate-400 uppercase">{size}</span>
              </div>
            ))}
          </div>
        </ReferenceCard>

        <p className="typo-caption text-vintiga-slate-500">
          Import from <code className="font-mono bg-vintiga-slate-100 px-1 rounded">@ds/shared/IconButton</code>.
          Always pass an <code className="font-mono bg-vintiga-slate-100 px-1 rounded">aria-label</code> so screen readers announce the action.
        </p>
      </div>
    </SubSection>
  )
}

function CheckboxSection() {
  const [a, setA] = useState(false)
  const [b, setB] = useState(true)
  const [c, setC] = useState(false)
  const [d, setD] = useState(true)
  const [e, setE] = useState(false)
  const [f, setF] = useState(true)
  const [g, setG] = useState(false)
  const [h, setH] = useState(false)
  const [i, setI] = useState(true)

  return (
    <SubSection
      id="ds-checkbox"
      title="Checkbox"
      description="Boolean selection. Three layouts (label · label + description · with dropdown indicator), three sizes (sm · md · lg), and full state coverage (default · hover · checked · indeterminate · disabled)."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-vintiga-lg">
        {/* ── States ──────────────────────────────────────────────── */}
        <ReferenceCard label="States">
          <div className="flex flex-col gap-vintiga-md">
            <Checkbox checked={a} onChange={setA} label="Default" />
            <Checkbox checked label="Checked" onChange={() => {}} />
            <Checkbox indeterminate label="Indeterminate" onChange={() => {}} />
            <Checkbox label="Disabled" disabled />
            <Checkbox checked label="Disabled checked" disabled />
          </div>
        </ReferenceCard>

        {/* ── With description ─────────────────────────────────────── */}
        <ReferenceCard label="With description">
          <div className="flex flex-col gap-vintiga-md">
            <Checkbox
              checked={b}
              onChange={setB}
              label="Email notifications"
              description="Get an email whenever something happens."
            />
            <Checkbox
              checked={c}
              onChange={setC}
              label="Push notifications"
              description="Send a push to my mobile device."
            />
            <Checkbox
              label="Marketing"
              description="Occasional product updates."
              disabled
            />
          </div>
        </ReferenceCard>

        {/* ── Sizes ────────────────────────────────────────────────── */}
        <ReferenceCard label="Sizes">
          <div className="flex flex-col gap-vintiga-md">
            <Checkbox size="sm" checked={d} onChange={setD} label="Small (16 px)" />
            <Checkbox size="md" checked={e} onChange={setE} label="Medium (20 px)" />
            <Checkbox size="lg" checked={f} onChange={setF} label="Large (24 px)" />
          </div>
        </ReferenceCard>

        {/* ── Bare (no label) ──────────────────────────────────────── */}
        <ReferenceCard label="Bare (no label)">
          <div className="flex items-center gap-vintiga-md">
            <Checkbox checked={g} onChange={setG} aria-label="Select row" />
            <Checkbox checked aria-label="Selected" onChange={() => {}} />
            <Checkbox indeterminate aria-label="Some selected" onChange={() => {}} />
            <Checkbox disabled aria-label="Disabled" />
          </div>
        </ReferenceCard>

        {/* ── With dropdown indicator (table-header pattern) ───────── */}
        <ReferenceCard label="With dropdown indicator">
          <div className="flex items-center gap-vintiga-md">
            <Checkbox dropdownIndicator checked={h} onChange={setH} aria-label="Select all" />
            <Checkbox dropdownIndicator indeterminate aria-label="Some rows selected" onChange={() => {}} />
            <Checkbox dropdownIndicator checked aria-label="All rows selected" onChange={() => {}} />
          </div>
        </ReferenceCard>

        {/* ── Group example ────────────────────────────────────────── */}
        <ReferenceCard label="Group">
          <div className="flex flex-col gap-vintiga-sm">
            <Checkbox checked={i} onChange={setI} label="Active" />
            <Checkbox label="Archived" />
            <Checkbox label="Draft" />
          </div>
        </ReferenceCard>
      </div>
    </SubSection>
  )
}

function RadioGroupSection() {
  const [states, setStates] = useState<'a' | 'b' | 'c'>('b')
  const [withDesc, setWithDesc] = useState<'email' | 'push' | 'marketing'>('email')
  const [sizes, setSizes] = useState<'sm' | 'md' | 'lg'>('md')
  const [bare, setBare] = useState<'1' | '2' | '3'>('2')
  const [group, setGroup] = useState<'active' | 'archived' | 'draft'>('active')

  return (
    <SubSection
      id="ds-radio"
      title="Radio Group"
      description="Single choice from a set. Two layouts (label · label + description), three sizes (sm · md · lg), and full state coverage (default · hover · checked · disabled)."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-vintiga-lg">
        {/* ── States ──────────────────────────────────────────────── */}
        <ReferenceCard label="States">
          <div className="flex flex-col gap-vintiga-md" role="radiogroup" aria-label="States">
            <Radio checked={states === 'a'} onChange={() => setStates('a')} label="Default" />
            <Radio checked={states === 'b'} onChange={() => setStates('b')} label="Checked" />
            <Radio checked={states === 'c'} onChange={() => setStates('c')} label="Hover me" />
            <Radio checked={false} label="Disabled" disabled />
            <Radio checked={true} label="Disabled checked" disabled />
          </div>
        </ReferenceCard>

        {/* ── With description ─────────────────────────────────────── */}
        <ReferenceCard label="With description">
          <div className="flex flex-col gap-vintiga-md" role="radiogroup" aria-label="Notification preferences">
            <Radio
              checked={withDesc === 'email'}
              onChange={() => setWithDesc('email')}
              label="Email"
              description="Get an email whenever something happens."
            />
            <Radio
              checked={withDesc === 'push'}
              onChange={() => setWithDesc('push')}
              label="Push"
              description="Send a push to my mobile device."
            />
            <Radio
              checked={withDesc === 'marketing'}
              onChange={() => setWithDesc('marketing')}
              label="None"
              description="Don't notify me about anything."
            />
          </div>
        </ReferenceCard>

        {/* ── Sizes ────────────────────────────────────────────────── */}
        <ReferenceCard label="Sizes">
          <div className="flex flex-col gap-vintiga-md" role="radiogroup" aria-label="Sizes">
            <Radio size="sm" checked={sizes === 'sm'} onChange={() => setSizes('sm')} label="Small (16 px)" />
            <Radio size="md" checked={sizes === 'md'} onChange={() => setSizes('md')} label="Medium (20 px)" />
            <Radio size="lg" checked={sizes === 'lg'} onChange={() => setSizes('lg')} label="Large (24 px)" />
          </div>
        </ReferenceCard>

        {/* ── Bare (no label) ──────────────────────────────────────── */}
        <ReferenceCard label="Bare (no label)">
          <div className="flex items-center gap-vintiga-md" role="radiogroup" aria-label="Bare">
            <Radio checked={bare === '1'} onChange={() => setBare('1')} aria-label="Option 1" />
            <Radio checked={bare === '2'} onChange={() => setBare('2')} aria-label="Option 2" />
            <Radio checked={bare === '3'} onChange={() => setBare('3')} aria-label="Option 3" />
            <Radio checked={false} disabled aria-label="Disabled" />
          </div>
        </ReferenceCard>

        {/* ── Group example ────────────────────────────────────────── */}
        <ReferenceCard label="Group">
          <div className="flex flex-col gap-vintiga-sm" role="radiogroup" aria-label="Status">
            <Radio checked={group === 'active'}   onChange={() => setGroup('active')}   label="Active" />
            <Radio checked={group === 'archived'} onChange={() => setGroup('archived')} label="Archived" />
            <Radio checked={group === 'draft'}    onChange={() => setGroup('draft')}    label="Draft" />
          </div>
        </ReferenceCard>

        {/* ── Inline ───────────────────────────────────────────────── */}
        <ReferenceCard label="Inline">
          <div className="flex items-center gap-vintiga-lg" role="radiogroup" aria-label="Inline">
            <Radio checked={group === 'active'}   onChange={() => setGroup('active')}   label="Active" />
            <Radio checked={group === 'archived'} onChange={() => setGroup('archived')} label="Archived" />
            <Radio checked={group === 'draft'}    onChange={() => setGroup('draft')}    label="Draft" />
          </div>
        </ReferenceCard>
      </div>
    </SubSection>
  )
}

function SwitchSection() {
  const [a, setA] = useState(false)
  const [b, setB] = useState(true)
  const [c, setC] = useState(true)
  const [d, setD] = useState(false)
  const [e, setE] = useState(true)
  const [f, setF] = useState(false)
  const [g, setG] = useState(true)
  const [h, setH] = useState(false)
  const [i, setI] = useState(true)
  const [j, setJ] = useState(false)

  return (
    <SubSection
      id="ds-switch"
      title="Switch"
      description="Instant on/off toggle for settings that don't need a save step. Three layouts (bare · label-right · settings-row) and three sizes (sm · md · lg)."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-vintiga-lg">
        {/* ── States ──────────────────────────────────────────────── */}
        <ReferenceCard label="States">
          <div className="flex flex-col gap-vintiga-md">
            <Switch checked={a} onChange={setA} label="Off (default)" />
            <Switch checked={b} onChange={setB} label="On" />
            <Switch checked={false} label="Disabled off" disabled />
            <Switch checked={true}  label="Disabled on"  disabled />
          </div>
        </ReferenceCard>

        {/* ── With description ─────────────────────────────────────── */}
        <ReferenceCard label="With description">
          <div className="flex flex-col gap-vintiga-md">
            <Switch
              checked={c}
              onChange={setC}
              label="Email notifications"
              description="Get an email whenever something happens."
            />
            <Switch
              checked={d}
              onChange={setD}
              label="Push notifications"
              description="Send a push to my mobile device."
            />
          </div>
        </ReferenceCard>

        {/* ── Sizes ────────────────────────────────────────────────── */}
        <ReferenceCard label="Sizes">
          <div className="flex flex-col gap-vintiga-md">
            <Switch size="sm" checked={e} onChange={setE} label="Small (32 × 18)" />
            <Switch size="md" checked={f} onChange={setF} label="Medium (46 × 24)" />
            <Switch size="lg" checked={g} onChange={setG} label="Large (52 × 28)" />
          </div>
        </ReferenceCard>

        {/* ── Bare ─────────────────────────────────────────────────── */}
        <ReferenceCard label="Bare (no label)">
          <div className="flex items-center gap-vintiga-md">
            <Switch checked={h} onChange={setH} aria-label="Toggle 1" />
            <Switch checked={true}  onChange={() => {}} aria-label="On" />
            <Switch checked={false} disabled aria-label="Disabled off" />
            <Switch checked={true}  disabled aria-label="Disabled on" />
          </div>
        </ReferenceCard>

        {/* ── Settings row (label fills, toggle pinned right) ───────── */}
        <ReferenceCard label="Settings row (full-width)">
          <div className="flex flex-col gap-vintiga-md">
            <Switch
              labelPosition="between"
              checked={i}
              onChange={setI}
              label="Two-factor authentication"
              description="Require a second step at sign-in."
            />
            <Switch
              labelPosition="between"
              checked={j}
              onChange={setJ}
              label="Marketing emails"
              description="Occasional product updates."
            />
            <Switch
              labelPosition="between"
              checked={false}
              disabled
              label="SMS alerts"
              description="Coming soon — disabled for now."
            />
          </div>
        </ReferenceCard>

        {/* ── Group example ────────────────────────────────────────── */}
        <ReferenceCard label="Group">
          <div className="flex flex-col gap-vintiga-sm">
            <Switch checked={i} onChange={setI} label="Active" />
            <Switch checked={j} onChange={setJ} label="Archived" />
            <Switch checked={false}  label="Draft" />
          </div>
        </ReferenceCard>
      </div>
    </SubSection>
  )
}

function AlertSoftSection() {
  return (
    <SubSection id="ds-alert-soft" title="Alert" description="Inline, non-blocking messaging.">
      <div className="space-y-3">
        <AlertSoft variant="info" title="Heads up" subtitle="Informational message." />
        <AlertSoft variant="success" title="All set" subtitle="Everything worked." />
        <AlertSoft variant="warning" title="Check this" subtitle="Something needs attention." />
        <AlertSoft variant="error" title="Something went wrong" subtitle="Please try again." />
      </div>
    </SubSection>
  )
}

function ProgressSection() {
  return (
    <SubSection id="ds-progress" title="Progress" description="Determinate progress indicator.">
      <Progress.Root value={60} className="w-full">
        <Progress.Track className="block h-2 bg-vintiga-surface-element rounded-full overflow-hidden">
          <Progress.Indicator className="block h-full bg-vintiga-primary transition-[width]" />
        </Progress.Track>
      </Progress.Root>
    </SubSection>
  )
}

function EmptyStatesSection() {
  return (
    <SubSection
      id="ds-empty-states"
      title="Empty States"
      description="Shown when a list, table, or section has no data. Five templates: default, no-results (after search/filter), invite (collaborative spaces), first-run (onboard a new feature), and error (something went wrong)."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md">
        {/* Default — no records yet */}
        <EmptyState
          icon={<FolderIcon />}
          title="No records yet"
          description="Use this when a list is empty for the first time. Pair with a single primary CTA to create the first record."
          action={<Button leftIcon={<PlusIcon />}>Create record</Button>}
        />

        {/* No results — search / filter returned nothing */}
        <EmptyState
          icon={<SearchIcon />}
          title="No results found"
          description="Use after a search or filter returns nothing. Offer a way to clear filters so the user can recover quickly."
          action={<Button variant="outline">Clear filters</Button>}
        />

        {/* Invite — collaboration space */}
        <EmptyState
          icon={<UsersIcon />}
          title="Invite your team"
          description="Use for collaborative areas (members, workspaces, sharing). Primary action invites; secondary explains the feature."
          action={<Button leftIcon={<PlusIcon />}>Invite member</Button>}
          secondaryAction={<Button variant="outline">Learn more</Button>}
        />

        {/* First-run — onboard a new feature */}
        <EmptyState
          icon={<InboxIcon />}
          title="Welcome to your inbox"
          description="Use to introduce a new feature on first visit. Lead with the primary action, keep the description short and active."
          action={<Button>Get started</Button>}
        />

        {/* Error */}
        <EmptyState
          icon={<CircleAlertIcon />}
          title="Something went wrong"
          description="Use when loading fails. Always offer a retry; consider a secondary 'contact support' for persistent failures."
          action={<Button variant="outline">Try again</Button>}
          secondaryAction={<Button variant="outline">Contact support</Button>}
        />

        {/* Borderless — for nesting inside other cards */}
        <EmptyState
          bordered={false}
          icon={<FolderIcon />}
          title="Borderless variant"
          description="Pass bordered={false} when nesting inside another card or empty container that already has its own border."
        />
      </div>
    </SubSection>
  )
}

function SkeletonLoadingSection() {
  return (
    <SubSection id="ds-skeletons" title="Skeletons" description="Loading placeholders.">
      <div className="space-y-4 max-w-md">
        <Skeleton className="h-8 w-1/2" />
        <SkeletonText lines={3} />
        <SkeletonCard />
      </div>
    </SubSection>
  )
}

function ErrorStatesSection() {
  return (
    <SubSection id="ds-error-states" title="Error States" description="Shown when something fails.">
      <ErrorState title="Couldn't load this" description="Check your connection and try again." />
    </SubSection>
  )
}

function DialogSection() {
  const [formOpen,    setFormOpen]    = useState(false)
  const [dangerOpen,  setDangerOpen]  = useState(false)
  const [infoOpen,    setInfoOpen]    = useState(false)
  const [warnOpen,    setWarnOpen]    = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)

  return (
    <SubSection
      id="ds-dialog"
      title="Dialog / Modal"
      description="Five variants: form (large title + close button), danger, warning, info (alert row with coloured icon), and centred success. Built on Base UI Dialog with a dark backdrop."
    >
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setFormOpen(true)}>Form modal</Button>
        <Button variant="outline" onClick={() => setDangerOpen(true)}>Danger</Button>
        <Button variant="outline" onClick={() => setWarnOpen(true)}>Warning</Button>
        <Button variant="outline" onClick={() => setInfoOpen(true)}>Info</Button>
        <Button variant="outline" onClick={() => setSuccessOpen(true)}>Success</Button>
      </div>

      {/* Form */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} size="md">
        <ModalHeader
          title="Form modal"
          description="Use for creating or editing records. Pair with a body of input fields and primary / secondary actions."
          onClose={() => setFormOpen(false)}
        />
        <ModalBody>
          <div className="grid grid-cols-2 gap-vintiga-md">
            <div className="flex flex-col gap-1.5">
              <label className="typo-body-sm font-medium text-vintiga-slate-900">Field label</label>
              <input className="px-2 py-2 rounded-vintiga-md border border-vintiga-slate-200 typo-body-sm text-vintiga-slate-400 bg-vintiga-white focus:outline-none focus:border-vintiga-indigo-500" placeholder="Placeholder" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="typo-body-sm font-medium text-vintiga-slate-900">Field label</label>
              <input className="px-2 py-2 rounded-vintiga-md border border-vintiga-slate-200 typo-body-sm text-vintiga-slate-400 bg-vintiga-white focus:outline-none focus:border-vintiga-indigo-500" placeholder="Placeholder" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="typo-body-sm font-medium text-vintiga-slate-900">Field label</label>
            <input className="px-2 py-2 rounded-vintiga-md border border-vintiga-slate-200 typo-body-sm text-vintiga-slate-400 bg-vintiga-white focus:outline-none focus:border-vintiga-indigo-500" placeholder="Placeholder" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="typo-body-sm font-medium text-vintiga-slate-900">Field label (optional)</label>
            <input className="px-2 py-2 rounded-vintiga-md border border-vintiga-slate-200 typo-body-sm text-vintiga-slate-400 bg-vintiga-white focus:outline-none focus:border-vintiga-indigo-500" placeholder="Placeholder" />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button onClick={() => setFormOpen(false)}>Save</Button>
        </ModalFooter>
      </Modal>

      {/* Danger */}
      <Modal open={dangerOpen} onClose={() => setDangerOpen(false)} size="sm">
        <ModalAlertHeader
          icon={<AlertTriangleIcon />}
          iconColor="red"
          title="Danger modal"
          description="Use for irreversible actions — deletes, deactivations, anything that loses data. Always pair with a destructive primary button."
        />
        <ModalFooter shaded>
          <Button variant="outline" onClick={() => setDangerOpen(false)}>Cancel</Button>
          <Button intent="destructive" onClick={() => setDangerOpen(false)}>Delete</Button>
        </ModalFooter>
      </Modal>

      {/* Warning */}
      <Modal open={warnOpen} onClose={() => setWarnOpen(false)} size="sm">
        <ModalAlertHeader
          icon={<AlertTriangleIcon />}
          iconColor="orange"
          title="Warning modal"
          description="Use for actions that have side-effects but aren't irreversible — disconnecting, archiving, switching modes. Lets the user reconsider before continuing."
        />
        <ModalFooter shaded>
          <Button variant="outline" onClick={() => setWarnOpen(false)}>Cancel</Button>
          <Button onClick={() => setWarnOpen(false)}>Continue</Button>
        </ModalFooter>
      </Modal>

      {/* Info */}
      <Modal open={infoOpen} onClose={() => setInfoOpen(false)} size="sm">
        <ModalAlertHeader
          icon={<InfoIcon />}
          iconColor="blue"
          title="Info modal"
          description="Use to surface helpful context the user needs to acknowledge before proceeding — first-run hints, feature explanations, gentle nudges."
        />
        <ModalFooter shaded>
          <Button variant="outline" onClick={() => setInfoOpen(false)}>Cancel</Button>
          <Button onClick={() => setInfoOpen(false)}>Got it</Button>
        </ModalFooter>
      </Modal>

      {/* Success / centred */}
      <Modal open={successOpen} onClose={() => setSuccessOpen(false)} size="sm">
        <ModalCenteredHeader
          icon={<CheckIcon />}
          iconColor="green"
          title="Success modal"
          description="Use to confirm a positive outcome — saved, sent, paid, completed. Centred layout signals end-of-flow."
        />
        <ModalFooter fullWidth>
          <Button variant="outline" fullWidth onClick={() => setSuccessOpen(false)}>Close</Button>
          <Button fullWidth onClick={() => setSuccessOpen(false)}>Continue</Button>
        </ModalFooter>
      </Modal>
    </SubSection>
  )
}

function TooltipSection() {
  return (
    <SubSection id="ds-tooltip" title="Tooltip" description="Contextual hint on hover/focus.">
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger render={<Button variant="outline">Hover me</Button>} />
          <Tooltip.Portal>
            <Tooltip.Positioner sideOffset={8}>
              <Tooltip.Popup className="bg-vintiga-foreground text-vintiga-surface typo-caption font-semibold px-2 py-1 rounded">Tooltip content</Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </SubSection>
  )
}

function BottomSheetSection() {
  const [open, setOpen] = useState(false)
  return (
    <SubSection id="ds-bottom-sheet" title="Bottom Sheet" description="Mobile modal sliding from bottom.">
      <Button onClick={() => setOpen(true)}>Open sheet</Button>
      <BottomSheet
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Need help?"
        subtitle="Tap a question to expand."
        items={[
          { id: '1', question: 'What is this?', content: <p className="typo-body text-vintiga-foreground-muted">Example content.</p> },
        ]}
      />
    </SubSection>
  )
}

function TabsSection() {
  return (
    <SubSection id="ds-tabs" title="Tabs" description="Switch between views.">
      <Tabs.Root defaultValue="one" className="space-y-3">
        <Tabs.List className="flex gap-4 border-b border-vintiga-border">
          <Tabs.Tab value="one" className="px-3 py-2 typo-body-sm font-semibold data-[selected]:border-b-2 data-[selected]:border-vintiga-primary">One</Tabs.Tab>
          <Tabs.Tab value="two" className="px-3 py-2 typo-body-sm font-semibold data-[selected]:border-b-2 data-[selected]:border-vintiga-primary">Two</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="one" className="typo-body-sm text-vintiga-foreground-muted">Panel one</Tabs.Panel>
        <Tabs.Panel value="two" className="typo-body-sm text-vintiga-foreground-muted">Panel two</Tabs.Panel>
      </Tabs.Root>
    </SubSection>
  )
}

function SeparatorSection() {
  return (
    <SubSection id="ds-separator" title="Separator" description="Visual divider between sections.">
      <div className="flex flex-col gap-4">
        <span className="typo-body text-vintiga-foreground">Above</span>
        <Separator className="h-px bg-vintiga-border" />
        <span className="typo-body text-vintiga-foreground">Below</span>
      </div>
    </SubSection>
  )
}

function CardSection() {
  return (
    <SubSection id="ds-cards" title="Cards" description="Surface container for grouped content.">
      <Card>
        <p className="typo-title-subsection font-semibold text-vintiga-foreground">Card title</p>
        <p className="typo-body-sm text-vintiga-foreground-muted mt-1">Card body content.</p>
      </Card>
    </SubSection>
  )
}

function PillSection() {
  const [selected, setSelected] = useState<'a' | 'b' | null>('a')
  return (
    <SubSection id="ds-pill" title="Pill" description="Selection chip for filters and tags.">
      <div className="flex gap-2">
        <Pill label="Option A" selected={selected === 'a'} onClick={() => setSelected('a')} />
        <Pill label="Option B" selected={selected === 'b'} onClick={() => setSelected('b')} />
      </div>
    </SubSection>
  )
}

function OtpInputSection() {
  const [value, setValue] = useState<string[]>(['', '', '', '', '', ''])
  return (
    <SubSection id="ds-otp-input" title="OTP Input" description="One-time code entry.">
      <OtpInputGroup value={value} onChange={setValue} />
    </SubSection>
  )
}

function ScreenHeaderSection() {
  return (
    <SubSection id="ds-screen-header" title="Screen Header" description="Mobile screen top bar.">
      <div className="border border-vintiga-border rounded-vintiga-card overflow-hidden">
        <ScreenHeader title="Screen title" showBack={false} />
      </div>
    </SubSection>
  )
}

function ScreenFooterSection() {
  return (
    <SubSection id="ds-screen-footer" title="Screen Footer" description="Mobile fixed-bottom action area.">
      <div className="border border-vintiga-border rounded-vintiga-card overflow-hidden">
        <ScreenFooter primaryLabel="Continue" />
      </div>
    </SubSection>
  )
}

// ── New component sections ──────────────────────────────────────────────────

function AvatarsSection() {
  const NAMES = [
    'Alex Morgan', 'Ben Ortiz', 'Cho Lin', 'Dana Patel', 'Emma Smith',
    'Felipe Gomez', 'Grace Kim', 'Hiro Yamada', 'Ines Costa', 'Jack Liu',
    'Kira Novak', 'Leo Nakamura', 'Mia Brown', 'Nils Hansen', 'Olivia Reed', 'Priya Rao',
  ]
  return (
    <SubSection id="ds-avatars" title="Avatars" description="Circular profile markers. Provide a name for auto-initials + colour, or a src for photo. Stack via AvatarGroup.">
      <div className="flex flex-col gap-vintiga-lg">
        <PlaygroundStage>
          <div className="flex flex-col gap-vintiga-lg">
            <div className="flex flex-wrap gap-vintiga-sm justify-center">
              {NAMES.map((n) => <Avatar key={n} name={n} />)}
            </div>
            <AvatarGroup avatars={NAMES.slice(0, 5).map((name) => ({ name }))} max={4} />
          </div>
        </PlaygroundStage>

        <ReferenceCard label="Sizes">
          <div className="flex flex-wrap gap-vintiga-lg items-end">
            {(['xs', 'sm', 'md', 'lg', 'xl'] as AvatarSize[]).map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <Avatar name="Alex Morgan" size={size} />
                <span className="typo-caption text-vintiga-slate-400 uppercase">{size}</span>
              </div>
            ))}
          </div>
        </ReferenceCard>
      </div>
    </SubSection>
  )
}

const TAG_CONTROLS: ControlSchema = {
  variant:  { type: 'select', options: ['filled', 'outline', 'neutral-dark', 'neutral-light'], default: 'filled' },
  tone:     { type: 'select', options: ['default', 'success', 'warning', 'danger', 'info', 'orange', 'yellow', 'teal', 'blue', 'violet'], default: 'success' },
  size:     { type: 'select', options: ['sm', 'md'], default: 'md' },
  children: { type: 'text',   default: 'Wine Club' },
}

function TagsSection() {
  const v = usePlayground(TAG_CONTROLS)
  return (
    <SubSection id="ds-tags" title="Tags" description="Labels for status, category, or metadata. Filled variant carries tone — semantic (success / warning / danger / info / default) plus extras (orange / yellow / teal / blue / violet) used by the order-status palette.">
      <div className="flex flex-col gap-vintiga-lg">
        <PlaygroundStage>
          <Tag variant={v.variant as TagVariant} tone={v.tone as TagTone} size={v.size as 'sm' | 'md'}>
            {v.children as string}
          </Tag>
        </PlaygroundStage>

        <ReferenceCard label="Semantic tones">
          <div className="flex flex-wrap gap-2">
            <Tag tone="default">Default</Tag>
            <Tag tone="success">Success</Tag>
            <Tag tone="warning">Warning</Tag>
            <Tag tone="danger">Danger</Tag>
            <Tag tone="info">Info</Tag>
          </div>
        </ReferenceCard>

        <ReferenceCard label="Extended palette">
          <div className="flex flex-wrap gap-2">
            <Tag tone="orange">Orange</Tag>
            <Tag tone="yellow">Yellow</Tag>
            <Tag tone="teal">Teal</Tag>
            <Tag tone="blue">Blue</Tag>
            <Tag tone="violet">Violet</Tag>
          </div>
        </ReferenceCard>

        <ReferenceCard label="Order status (Figma 4506:19880)">
          <div className="flex flex-wrap gap-2">
            <Tag tone="default">Pending</Tag>
            <Tag tone="warning">Awaiting Payment</Tag>
            <Tag tone="orange">Awaiting Compliance</Tag>
            <Tag tone="yellow">Awaiting Fulfillment</Tag>
            <Tag tone="info">Awaiting Shipping</Tag>
            <Tag tone="success">Completed</Tag>
            <Tag tone="success">Fulfilled</Tag>
            <Tag tone="teal">Exchanged</Tag>
            <Tag tone="danger">Declined</Tag>
            <Tag tone="danger">Quarantined</Tag>
            <Tag tone="blue">Refunded</Tag>
            <Tag tone="violet">Partially Refunded</Tag>
          </div>
        </ReferenceCard>

        <ReferenceCard label="Other variants">
          <div className="flex flex-wrap gap-2">
            <Tag variant="outline">Outline</Tag>
            <Tag variant="neutral-dark">Wine Club</Tag>
            <Tag variant="neutral-light">Repeat</Tag>
          </div>
        </ReferenceCard>
      </div>
    </SubSection>
  )
}

function KpiCardsSection() {
  return (
    <SubSection id="ds-kpi-card" title="KPI Card" description="Metric summary with optional icon and progress bar.">
      <div className="flex flex-col gap-vintiga-lg">
        <PlaygroundStage>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-md w-full max-w-lg">
            <KpiCard
              label="Total Revenue"
              value="$45,231.89"
              icon={<DollarIcon className="w-4 h-4" />}
              goalLabel="Goal: $10,000.00"
              progressPercent={25}
            />
            <KpiCard
              label="Active customers"
              value="1,284"
              icon={<TrendUpIcon className="w-4 h-4" />}
            />
          </div>
        </PlaygroundStage>
      </div>
    </SubSection>
  )
}

const TEXT_FIELD_CONTROLS: ControlSchema = {
  state:       { type: 'select',  options: ['default', 'focus', 'success', 'destructive', 'disabled'], default: 'default' },
  label:       { type: 'text',    default: 'Label' },
  placeholder: { type: 'text',    default: 'Enter value' },
  helperText:  { type: 'text',    default: '' },
  required:    { type: 'boolean', default: false },
}

function TextFieldsSectionV2() {
  const v = usePlayground(TEXT_FIELD_CONTROLS)
  return (
    <SubSection id="ds-text-fields" title="Text Fields" description="Labelled single-line input with helper text, validation states, and optional icons.">
      <div className="flex flex-col gap-vintiga-lg">
        <PlaygroundStage>
          <div className="w-full max-w-sm">
            <TextField
              state={v.state === 'default' ? undefined : (v.state as 'focus' | 'success' | 'destructive' | 'disabled')}
              label={v.label as string}
              placeholder={v.placeholder as string}
              helperText={v.helperText as string}
              required={v.required as boolean}
            />
          </div>
        </PlaygroundStage>

        <ReferenceCard label="States">
          <div className="flex flex-col gap-vintiga-md max-w-sm">
            <TextField label="Default"     placeholder="Placeholder" />
            <TextField label="Filled"      defaultValue="Filled" />
            <TextField label="Focus"       defaultValue="Focused"  state="focus" />
            <TextField label="Success"     defaultValue="Looks good" state="success" helperText="Username is available" />
            <TextField label="Destructive" defaultValue="Bad input"  state="destructive" helperText="Must be a valid email" />
            <TextField label="Disabled"    defaultValue="Disabled"   disabled />
          </div>
        </ReferenceCard>
      </div>
    </SubSection>
  )
}

function TablesSection() {
  type Row = { name: string; email: string; phone: string; tag: React.ReactNode; date: string; total: string }
  const ROWS: Row[] = [
    { name: 'Jane Davis',       email: 'jane@example.com',       phone: '(406) 555-0120', tag: <Tag variant="neutral-dark">Wine Club</Tag>, date: 'Mar 15, 2025', total: '$1,245.00' },
    { name: 'Esther Howard',    email: 'esther@example.com',     phone: '(704) 555-0127', tag: <Tag variant="outline">Repeat</Tag>,         date: 'Mar 15, 2025', total: '$205.00' },
    { name: 'Jane Cooper',      email: 'cooper@example.com',     phone: '(480) 555-0103', tag: <Tag variant="neutral-dark">Wine Club</Tag>, date: 'Mar 15, 2025', total: '$99.00' },
    { name: 'Wade Warren',      email: 'wade@example.com',       phone: '(219) 555-0114', tag: <Tag variant="outline">New</Tag>,            date: 'Mar 13, 2025', total: '$79.00' },
    { name: 'Brooklyn Simmons', email: 'brooklyn@example.com',   phone: '(208) 555-0112', tag: <Tag variant="outline">New</Tag>,            date: 'Mar 11, 2025', total: '$2,200.00' },
  ]
  return (
    <SubSection id="ds-table" title="Table" description="Tabular data with header row, row hover, and typed cells (text, tags, currency).">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Phone</TableHeader>
            <TableHeader>Tag</TableHeader>
            <TableHeader>Last Purchase</TableHeader>
            <TableHeader className="text-right">Total Spent</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {ROWS.map((r) => (
            <TableRow key={r.name} onClick={() => { /* noop demo */ }}>
              <TableCell className="font-medium">{r.name}</TableCell>
              <TableCell className="text-vintiga-slate-500">{r.email}</TableCell>
              <TableCell className="text-vintiga-slate-500">{r.phone}</TableCell>
              <TableCell>{r.tag}</TableCell>
              <TableCell className="text-vintiga-slate-500">{r.date}</TableCell>
              <TableCell className="text-right font-medium">{r.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </SubSection>
  )
}

const TOAST_CONTROLS: ControlSchema = {
  variant:     { type: 'select', options: ['success', 'info', 'warning', 'error'], default: 'success' },
  title:       { type: 'text',   default: 'Product saved!' },
  description: { type: 'text',   default: "'2018 Pinot Noir' is now live in your catalogue." },
}

function ToastsSection() {
  const v = usePlayground(TOAST_CONTROLS)
  return (
    <SubSection id="ds-toast" title="Toast" description="Transient notification, anchored to a corner. Auto-dismiss or manual close.">
      <div className="flex flex-col gap-vintiga-lg">
        <PlaygroundStage>
          <Toast
            variant={v.variant as ToastVariant}
            title={v.title as string}
            description={v.description as string}
            onClose={() => { /* demo */ }}
          />
        </PlaygroundStage>

        <ReferenceCard label="Variants">
          <div className="flex flex-col gap-vintiga-sm">
            <Toast variant="success" title="All done"         description="Changes have been saved." />
            <Toast variant="info"    title="Heads up"         description="A new version is available." />
            <Toast variant="warning" title="Check this"       description="Connection is unstable." />
            <Toast variant="error"   title="Something broke"  description="Please try again." />
          </div>
        </ReferenceCard>
      </div>
    </SubSection>
  )
}

function DropdownsSection() {
  return (
    <SubSection id="ds-dropdown" title="Dropdown" description="Context menus, action menus, and account menus. Pairs with any trigger — button, avatar, table row ellipsis.">
      <div className="flex flex-col gap-vintiga-lg">

        {/* Playground — simple select menu */}
        <PlaygroundStage>
          <DropdownMenu>
            <DropdownItem selected>New Customer</DropdownItem>
            <DropdownItem>Repeat Customer</DropdownItem>
            <DropdownItem>Wine Club Member</DropdownItem>
          </DropdownMenu>
        </PlaygroundStage>

        {/* Account menu — sections + sublabel + icons */}
        <ReferenceCard label="Account menu — sections, sublabel, separator">
          <div className="flex items-start gap-vintiga-lg flex-wrap">
            <DropdownMenu>
              <DropdownSection label="My Account">
                <DropdownItem sublabel="Current Tenant" readOnly>
                  Vintiga Labs
                </DropdownItem>
              </DropdownSection>
              <DropdownSeparator />
              <DropdownSection>
                <DropdownItem leftIcon={<UserIcon className="w-4 h-4" />}>Profile</DropdownItem>
                <DropdownItem leftIcon={<SettingsIcon className="w-4 h-4" />}>Settings</DropdownItem>
              </DropdownSection>
              <DropdownSeparator />
              <DropdownSection>
                <DropdownItem leftIcon={<LogOutIcon className="w-4 h-4" />}>Sign Out</DropdownItem>
              </DropdownSection>
            </DropdownMenu>

            {/* Action menu */}
            <DropdownMenu>
              <DropdownItem leftIcon={<ExportIcon className="w-4 h-4" />}>Export Products</DropdownItem>
              <DropdownItem leftIcon={<ExportIcon className="w-4 h-4 scale-x-[-1]" />}>Duplicate</DropdownItem>
            </DropdownMenu>
          </div>
        </ReferenceCard>

        {/* Item states */}
        <ReferenceCard label="Item states">
          <DropdownMenu className="w-44">
            <DropdownItem>Default</DropdownItem>
            <DropdownItem selected>Selected</DropdownItem>
            <DropdownItem disabled>Disabled</DropdownItem>
          </DropdownMenu>
        </ReferenceCard>

      </div>
    </SubSection>
  )
}

const SEGMENTED_CONTROLS: ControlSchema = {
  size:    { type: 'select',  options: ['sm', 'md'], default: 'md' },
  withIcons: { type: 'boolean', default: false },
}

function SegmentedControlSection() {
  const v = usePlayground(SEGMENTED_CONTROLS)
  const [tab, setTab] = useState<'general' | 'pos' | 'website'>('general')

  const baseOptions = [
    { value: 'general' as const, label: 'General' },
    { value: 'pos'     as const, label: 'POS' },
    { value: 'website' as const, label: 'Website' },
  ]

  const iconOptions = [
    { value: 'general' as const, label: 'General', icon: <HomeIcon className="w-3.5 h-3.5" /> },
    { value: 'pos'     as const, label: 'POS',     icon: <ChartIcon className="w-3.5 h-3.5" /> },
    { value: 'website' as const, label: 'Website', icon: <BookOpenIcon className="w-3.5 h-3.5" /> },
  ]

  return (
    <SubSection
      id="ds-segmented-control"
      title="Segmented Control"
      description="Single-select toggle for switching between two or more sibling views. Use it for view modes, in-page tabs, and time-range filters."
    >
      <div className="flex flex-col gap-vintiga-xl">
        <PlaygroundStage>
          <SegmentedControl
            value={tab}
            onChange={setTab}
            size={v.size as 'sm' | 'md'}
            options={v.withIcons ? iconOptions : baseOptions}
            aria-label="Demo tabs"
          />
        </PlaygroundStage>

        <ReferenceCard label="Sizes">
          <div className="flex flex-col gap-vintiga-md items-start">
            <SegmentedControl size="sm" value="a" onChange={() => { /* demo */ }} options={[{ value: 'a', label: 'Label' }, { value: 'b', label: 'Label' }]} />
            <SegmentedControl size="md" value="a" onChange={() => { /* demo */ }} options={[{ value: 'a', label: 'Label' }, { value: 'b', label: 'Label' }]} />
          </div>
        </ReferenceCard>

        <ReferenceCard label="Variants">
          <div className="flex flex-col gap-vintiga-md items-start">
            <SegmentedControl
              value="a"
              onChange={() => { /* demo */ }}
              options={[{ value: 'a', label: 'Label' }, { value: 'b', label: 'Label' }]}
            />
            <SegmentedControl
              value="a"
              onChange={() => { /* demo */ }}
              options={[
                { value: 'a', label: 'Label', icon: <HomeIcon className="w-3.5 h-3.5" /> },
                { value: 'b', icon: <ChartIcon className="w-3.5 h-3.5" /> },
              ]}
            />
          </div>
        </ReferenceCard>

        <p className="typo-caption text-vintiga-slate-500">
          Import from <code className="font-mono bg-vintiga-slate-100 px-1 rounded">@ds/shared/SegmentedControl</code>.
          Each option can carry an <code className="font-mono bg-vintiga-slate-100 px-1 rounded">href</code> to render as a link instead of a button.
        </p>
      </div>
    </SubSection>
  )
}

function NavbarSection() {
  return (
    <SubSection
      id="ds-navbar"
      title="Navbar"
      description="App-shell top bar — sidebar toggle on the left, optional centre slot (e.g. global search), and a right cluster (notifications · divider · avatar pill). Layout adapts: hamburger on mobile, panel-left toggle on desktop."
    >
      <div className="flex flex-col gap-vintiga-lg">
        <ReferenceCard label="Desktop">
          <Navbar
            device="desktop"
            user={{ name: 'Tom Cook', initials: 'TC' }}
            hasNotifications
            onMenuToggle={() => {}}
            onUserClick={() => {}}
            onNotificationClick={() => {}}
          />
        </ReferenceCard>

        <ReferenceCard label="Mobile">
          <Navbar
            device="mobile"
            user={{ name: 'Tom Cook', initials: 'TC' }}
            onMenuToggle={() => {}}
            onUserClick={() => {}}
            onNotificationClick={() => {}}
          />
        </ReferenceCard>

        <ReferenceCard label="With centre slot (global search)">
          <Navbar
            device="desktop"
            user={{ name: 'Sarah Johnson', initials: 'SJ' }}
            hasNotifications
            onMenuToggle={() => {}}
            onUserClick={() => {}}
            onNotificationClick={() => {}}
            center={
              <div className="w-full max-w-[480px] flex items-center gap-2 px-3 py-1.5 rounded-vintiga-md border border-vintiga-slate-200 bg-vintiga-white">
                <SearchIcon className="w-4 h-4 text-vintiga-slate-400" />
                <input className="flex-1 bg-transparent border-0 outline-none typo-body-sm text-vintiga-slate-900 placeholder:text-vintiga-slate-400" placeholder="Search…" />
              </div>
            }
          />
        </ReferenceCard>

        <ReferenceCard label="Without notifications dot">
          <Navbar
            device="desktop"
            user={{ name: 'Alex Rivera', initials: 'AR' }}
            onMenuToggle={() => {}}
            onUserClick={() => {}}
            onNotificationClick={() => {}}
          />
        </ReferenceCard>

        <ReferenceCard label="Wired with sidebar — interactive collapse">
          <AppShellDemo />
        </ReferenceCard>
      </div>
    </SubSection>
  )
}

// ── Tiny chart placeholder for widget bodies ──────────────────────────────────
function ChartPlaceholder({ height = 200 }: { height?: number }) {
  return (
    <div
      className="w-full rounded-vintiga-md border border-dashed border-vintiga-slate-300 bg-vintiga-slate-50 flex items-center justify-center"
      style={{ height }}
    >
      <span className="typo-caption text-vintiga-slate-400">Chart / content area</span>
    </div>
  )
}

function WidgetSection() {
  return (
    <SubSection
      id="ds-widget"
      title="Widget"
      description="Dashboard widget container — title + description + actions in the header, flexible body slot for charts or content. Composable: drop in <WidgetHeader>, <WidgetBody>, <WidgetFooter> for full control, or use the convenience props on <Widget>."
    >
      <div className="flex flex-col gap-vintiga-lg">
        <ReferenceCard label="Default — title + description + actions">
          <Widget
            title="Sales overview"
            description="Revenue across all channels for the last 30 days."
            actions={
              <>
                <Button variant="outline" size="sm" leftIcon={<CalendarIcon />} rightIcon={<ChevronDownIcon />}>Daily</Button>
                <IconButton variant="outline" size="sm" icon={<DownloadIcon />} aria-label="Export" />
              </>
            }
          >
            <ChartPlaceholder height={260} />
          </Widget>
        </ReferenceCard>

        <ReferenceCard label="Multi-row body">
          <Widget
            title="Channel breakdown"
            description="Visits, conversions, and revenue by source."
            actions={
              <IconButton variant="outline" size="sm" icon={<EllipsisIcon />} aria-label="More" />
            }
          >
            <ChartPlaceholder height={120} />
            <ChartPlaceholder height={120} />
            <ChartPlaceholder height={120} />
          </Widget>
        </ReferenceCard>

        <ReferenceCard label="Title only">
          <Widget title="Recent activity">
            <ChartPlaceholder height={180} />
          </Widget>
        </ReferenceCard>

        <ReferenceCard label="Composable — with footer">
          <Widget>
            <WidgetHeader
              title="Top products"
              description="Best-sellers this month."
              actions={<Button variant="outline" size="sm">View all</Button>}
            />
            <WidgetBody>
              <ChartPlaceholder height={180} />
            </WidgetBody>
            <WidgetFooter>
              <Button variant="outline" size="sm">Cancel</Button>
              <Button size="sm">Save report</Button>
            </WidgetFooter>
          </Widget>
        </ReferenceCard>

        <ReferenceCard label="Two-column dashboard layout">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-vintiga-md">
            <Widget
              title="Revenue"
              description="Last 7 days"
              actions={<Button variant="outline" size="sm" rightIcon={<ChevronDownIcon />}>Weekly</Button>}
            >
              <ChartPlaceholder height={160} />
            </Widget>
            <Widget
              title="Orders"
              description="Last 7 days"
              actions={<IconButton variant="outline" size="sm" icon={<DownloadIcon />} aria-label="Export" />}
            >
              <ChartPlaceholder height={160} />
            </Widget>
          </div>
        </ReferenceCard>
      </div>
    </SubSection>
  )
}

function AppShellDemo() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="h-[640px] flex border border-vintiga-slate-200 rounded-vintiga-lg overflow-hidden">
      <Sidebar collapsed={collapsed}>
        <SidebarHeader logo={<VintigaIconIndigo size={40} />} title={collapsed ? undefined : 'Vintiga Labs, LLC'} />
        <SidebarBody>
          <SidebarItem icon={<HomeIcon />}            label="Dashboard"   selected />
          <SidebarItem icon={<MessagesSquareIcon />}  label="Sales Chat" />
          <SidebarItem icon={<MailIcon />}            label="Campaigns" />
          <SidebarItem icon={<GiftIcon />}            label="Promotions" />
          <SidebarItem icon={<GlobeIcon />}           label="Website" external />
          <SidebarItem icon={<StarIcon />}            label="Reviews" />
          <SidebarItem icon={<CalendarIcon />}        label="Events" />
          <SidebarItem icon={<TrendUpIcon />}         label="Reports" />
          <SidebarDivider />
          <SidebarItem icon={<UsersIcon />}           label="Customers" />
          <SidebarItem icon={<PackageIcon />}         label="Products" />
          <SidebarItem icon={<ShoppingCartIcon />}    label="Orders" />
          <SidebarItem icon={<CalendarCheckIcon />}   label="Reservations" badge={!collapsed ? <SidebarBadge>Coming Soon</SidebarBadge> : undefined} />
          <SidebarItem icon={<IdCardIcon />}          label="Clubs"  disabled badge={!collapsed ? <SidebarBadge>Available soon</SidebarBadge> : undefined} />
          <SidebarFooter>
            <SidebarItem icon={<MapPinIcon />}  label="POS Profiles" />
            <SidebarItem icon={<SettingsIcon />} label="Settings" />
          </SidebarFooter>
        </SidebarBody>
      </Sidebar>
      <div className="flex-1 flex flex-col min-w-0 bg-vintiga-slate-50">
        <Navbar
          device="desktop"
          user={{ name: 'Tom Cook', initials: 'TC' }}
          hasNotifications
          onMenuToggle={() => setCollapsed((c) => !c)}
          onUserClick={() => {}}
          onNotificationClick={() => {}}
        />
        <div className="flex-1 p-vintiga-xl flex items-center justify-center">
          <div className="max-w-md text-center flex flex-col gap-vintiga-sm">
            <p className="typo-title-section font-semibold text-vintiga-slate-900">App shell preview</p>
            <p className="typo-body-sm text-vintiga-slate-500">
              Click the panel-left icon in the navbar (top-left) to collapse / expand the sidebar.
              Sidebar is currently <span className="font-semibold text-vintiga-slate-900">{collapsed ? 'collapsed (72 px)' : 'open (288 px)'}</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SidebarSection() {
  const renderItems = (selectedKey: string) => (
    <>
      <SidebarItem icon={<HomeIcon />}            label="Dashboard"     selected={selectedKey === 'dashboard'} />
      <SidebarItem icon={<MessagesSquareIcon />}  label="Sales Chat"    selected={selectedKey === 'chat'} />
      <SidebarItem icon={<MailIcon />}            label="Campaigns"     selected={selectedKey === 'campaigns'} />
      <SidebarItem icon={<GiftIcon />}            label="Promotions"    selected={selectedKey === 'promotions'} />
      <SidebarItem icon={<GlobeIcon />}           label="Website"       external />
      <SidebarItem icon={<StarIcon />}            label="Reviews" />
      <SidebarItem icon={<CalendarIcon />}        label="Events" />
      <SidebarItem icon={<TrendUpIcon />}         label="Reports" />
      <SidebarDivider />
      <SidebarItem icon={<UsersIcon />}           label="Customers" />
      <SidebarItem icon={<PackageIcon />}         label="Products" />
      <SidebarItem icon={<ShoppingCartIcon />}    label="Orders" />
      <SidebarItem icon={<CalendarCheckIcon />}   label="Reservations"  badge={<SidebarBadge>Coming Soon</SidebarBadge>} />
      <SidebarItem icon={<IdCardIcon />}          label="Clubs"         disabled badge={<SidebarBadge>Available soon</SidebarBadge>} />
      <SidebarFooter>
        <SidebarItem icon={<MapPinIcon />}  label="POS Profiles" />
        <SidebarItem icon={<SettingsIcon />} label="Settings" />
      </SidebarFooter>
    </>
  )

  return (
    <SubSection
      id="ds-sidebar"
      title="Sidebar"
      description="Composable app shell sidebar — header (logo + workspace name), body (nav items + dividers), footer (sticky bottom items). Two layouts: Open (288 px) and Collapsed (72 px, icon-only). Items support selected, disabled, external-link, and a small badge slot."
    >
      <div className="flex flex-col gap-vintiga-lg">
        <ReferenceCard label="App shell — interactive collapse">
          <AppShellDemo />
        </ReferenceCard>

        <ReferenceCard label="Open (288 px)">
          <div className="h-[640px] flex">
            <Sidebar collapsed={false}>
              <SidebarHeader logo={<VintigaIconIndigo size={40} />} title="Vintiga Labs, LLC" />
              <SidebarBody>{renderItems('dashboard')}</SidebarBody>
            </Sidebar>
            <div className="flex-1 bg-vintiga-slate-50" />
          </div>
        </ReferenceCard>

        <ReferenceCard label="Collapsed (72 px, icon-only)">
          <div className="h-[640px] flex">
            <Sidebar collapsed>
              <SidebarHeader logo={<VintigaIconIndigo size={40} />} />
              <SidebarBody>{renderItems('dashboard')}</SidebarBody>
            </Sidebar>
            <div className="flex-1 bg-vintiga-slate-50" />
          </div>
        </ReferenceCard>

        <ReferenceCard label="Item states">
          <div className="h-[260px] flex">
            <Sidebar collapsed={false}>
              <SidebarBody>
                <SidebarItem icon={<HomeIcon />}     label="Default" />
                <SidebarItem icon={<HomeIcon />}     label="Hover (try it)" />
                <SidebarItem icon={<HomeIcon />}     label="Selected" selected />
                <SidebarItem icon={<HomeIcon />}     label="Disabled" disabled />
                <SidebarItem icon={<GlobeIcon />}    label="External link" external />
                <SidebarItem icon={<CalendarCheckIcon />} label="With badge" badge={<SidebarBadge>New</SidebarBadge>} />
              </SidebarBody>
            </Sidebar>
            <div className="flex-1 bg-vintiga-slate-50" />
          </div>
        </ReferenceCard>
      </div>
    </SubSection>
  )
}

function ListCardSection() {
  const [picked, setPicked] = useState('mix-wines')
  const items = [
    { id: 'mix-wines',   label: 'Mix Wines' },
    { id: 'white-wines', label: 'White Wines' },
    { id: 'red-wines',   label: 'Red Wines' },
    { id: 'pale-ale',    label: 'Pale Ale' },
    { id: 'on-tap',      label: 'On Tap' },
    { id: 'flights',     label: 'Flights' },
  ]

  return (
    <SubSection
      id="ds-list-card"
      title="List Card"
      description="44 px bordered list-item — used wherever a vertical list of selectable rows is needed (Collections, Channels, Workspaces, Saved views). Three states: default, hover, selected. Trailing slot defaults to a kebab menu but accepts any node."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-lg">
        <ReferenceCard label="States">
          <div className="flex flex-col gap-vintiga-sm w-[289px]">
            <ListCard label="Default" />
            <ListCard label="Hover (try it)" />
            <ListCard label="Selected" selected />
            <ListCard label="Disabled" disabled />
          </div>
        </ReferenceCard>

        <ReferenceCard label="Selectable list">
          <div className="flex flex-col gap-vintiga-sm w-[289px]" role="listbox" aria-label="Collections">
            {items.map((it) => (
              <ListCard
                key={it.id}
                label={it.label}
                selected={picked === it.id}
                onClick={() => setPicked(it.id)}
                onActionClick={() => {}}
              />
            ))}
          </div>
        </ReferenceCard>

        <ReferenceCard label="With leading icon">
          <div className="flex flex-col gap-vintiga-sm w-[289px]">
            <ListCard label="Folder" icon={<FolderIcon />} />
            <ListCard label="Inbox"  icon={<InboxIcon />} selected />
            <ListCard label="Starred" icon={<StarIcon />} />
          </div>
        </ReferenceCard>

        <ReferenceCard label="No trailing action">
          <div className="flex flex-col gap-vintiga-sm w-[289px]">
            <ListCard label="Read-only row" hideAction />
            <ListCard label="Read-only row" hideAction selected />
          </div>
        </ReferenceCard>
      </div>
    </SubSection>
  )
}

const SELECTION_CARD_CONTROLS: ControlSchema = {
  orientation: { type: 'select',  options: ['horizontal', 'vertical'],   default: 'horizontal' },
  align:       { type: 'select',  options: ['start', 'center'],          default: 'start' },
  size:        { type: 'select',  options: ['md', 'sm'],                 default: 'md' },
  tone:        { type: 'select',  options: ['indigo', 'slate'],          default: 'indigo' },
  title:       { type: 'text',    default: 'Reserve Tier' },
  description: { type: 'text',    default: 'Premium members get first access to allocations and limited releases.' },
  selected:    { type: 'boolean', default: false },
  disabled:    { type: 'boolean', default: false },
  trailing:    { type: 'boolean', default: false },
}

function SelectionCardSection() {
  const v = usePlayground(SELECTION_CARD_CONTROLS)
  const [promo, setPromo] = useState<'manual' | 'auto' | 'code'>('auto')

  return (
    <SubSection
      id="ds-selection-card"
      title="Selection Card"
      description={`"Pick one" card. One component, four common patterns: a wide horizontal info card, a narrow vertical type tile (left or centred text), and a compact tenant-style row with a trailing pill. Each pattern below is split into its own subsection.`}
    >
      <div className="flex flex-col gap-vintiga-xl">
        {/* ── Playground ─────────────────────────────────────────────────── */}
        <PlaygroundStage minHeight={220}>
          <div className={v.orientation === 'vertical' ? 'w-[200px]' : 'w-[460px]'}>
            <SelectionCard
              orientation={v.orientation as 'horizontal' | 'vertical'}
              align={v.align as 'start' | 'center'}
              size={v.size as 'sm' | 'md'}
              tone={v.tone as 'indigo' | 'slate'}
              icon={<GemIcon />}
              title={v.title as string}
              description={v.description as string}
              selected={v.selected as boolean}
              disabled={v.disabled as boolean}
              trailing={v.trailing ? <Tag variant="outline">Select</Tag> : undefined}
              onClick={() => {}}
            />
          </div>
        </PlaygroundStage>

        {/* ── 1. Horizontal info card ────────────────────────────────────── */}
        <div className="flex flex-col gap-vintiga-sm">
          <h4 className="typo-body font-semibold text-vintiga-slate-900">Horizontal — info card</h4>
          <p className="typo-body-sm text-vintiga-slate-500">
            Wide horizontal layout, 48 px indigo icon container, 18 px semibold title + 14 px description.
            Used in onboarding pickers (e.g. wine-club tier, business type).
            Figma <code className="font-mono bg-vintiga-slate-100 px-1 rounded">5079:33569</code>.
          </p>
          <ReferenceCard label="Default · hover">
            <div className="flex flex-col gap-vintiga-md max-w-[460px]">
              <SelectionCard
                icon={<GemIcon />}
                title="Reserve Tier"
                description="Premium members get first access to allocations and limited releases."
                onClick={() => {}}
              />
              <SelectionCard
                icon={<StarIcon />}
                title="Founders Club"
                description="Charter members. Annual shipment plus exclusive winemaker dinners."
                onClick={() => {}}
              />
            </div>
          </ReferenceCard>
        </div>

        {/* ── 2. Vertical tile, left-aligned ─────────────────────────────── */}
        <div className="flex flex-col gap-vintiga-sm">
          <h4 className="typo-body font-semibold text-vintiga-slate-900">Vertical — left-aligned, with selected state</h4>
          <p className="typo-body-sm text-vintiga-slate-500">
            Tile-style picker for type / mode selection. Selected state fills the icon container with indigo-600.
            Figma <code className="font-mono bg-vintiga-slate-100 px-1 rounded">3675:37603</code>.
          </p>
          <ReferenceCard label="Default · hover · selected">
            <div className="grid grid-cols-3 gap-vintiga-sm">
              <SelectionCard
                orientation="vertical"
                icon={<HandIcon />}
                title="Manual"
                description="Tap to apply during checkout. Staff-controlled discounts."
                selected={promo === 'manual'}
                onClick={() => setPromo('manual')}
              />
              <SelectionCard
                orientation="vertical"
                icon={<TrendUpIcon />}
                title="Automatic"
                description="Trigger when a basket meets the rules — no code required."
                selected={promo === 'auto'}
                onClick={() => setPromo('auto')}
              />
              <SelectionCard
                orientation="vertical"
                icon={<TagIcon />}
                title="Code"
                description="Customer enters a code at checkout. Track usage and limits."
                selected={promo === 'code'}
                onClick={() => setPromo('code')}
              />
            </div>
          </ReferenceCard>
        </div>

        {/* ── 3. Vertical tile, centred ──────────────────────────────────── */}
        <div className="flex flex-col gap-vintiga-sm">
          <h4 className="typo-body font-semibold text-vintiga-slate-900">Vertical — centred</h4>
          <p className="typo-body-sm text-vintiga-slate-500">
            Same tile as above but every line centred. Used for report-type pickers and short labels.
            Figma <code className="font-mono bg-vintiga-slate-100 px-1 rounded">5000:45656</code>.
          </p>
          <ReferenceCard label="Centred">
            <div className="grid grid-cols-3 gap-vintiga-sm">
              <SelectionCard orientation="vertical" align="center" icon={<ChartIcon />}   title="Sales"      description="Revenue and order trends across channels." onClick={() => {}} />
              <SelectionCard orientation="vertical" align="center" icon={<UsersIcon />}   title="Customers"  description="Lifecycle, lifetime value, and retention."  onClick={() => {}} />
              <SelectionCard orientation="vertical" align="center" icon={<PackageIcon />} title="Inventory"  description="Stock movement and low-stock alerts."        onClick={() => {}} />
            </div>
          </ReferenceCard>
        </div>

        {/* ── 4. Compact tenant row ──────────────────────────────────────── */}
        <div className="flex flex-col gap-vintiga-sm">
          <h4 className="typo-body font-semibold text-vintiga-slate-900">Compact tenant / list row</h4>
          <p className="typo-body-sm text-vintiga-slate-500">
            Smaller variant — 32 px slate icon container, 8 px corner radius, trailing pill. Used in
            workspace switchers and account pickers.
            Figma <code className="font-mono bg-vintiga-slate-100 px-1 rounded">2930:20012</code>.
          </p>
          <ReferenceCard label="Compact + trailing tag">
            <div className="flex flex-col gap-vintiga-sm">
              {[
                { name: 'Vintiga Labs Inc',     rep: 'Rep: Jim Secord' },
                { name: 'Hillside Vineyards',   rep: 'Rep: Marcus Chen' },
                { name: 'Valley View Winery',   rep: 'Rep: Maria Rodriguez' },
              ].map((t) => (
                <SelectionCard
                  key={t.name}
                  size="sm"
                  tone="slate"
                  icon={<BuildingIcon />}
                  title={t.name}
                  description={t.rep}
                  trailing={<Tag variant="outline">Select</Tag>}
                  onClick={() => {}}
                />
              ))}
            </div>
          </ReferenceCard>
        </div>

        {/* ── API ─────────────────────────────────────────────────────────── */}
        <p className="typo-caption text-vintiga-slate-500">
          Import from <code className="font-mono bg-vintiga-slate-100 px-1 rounded">@ds/shared/SelectionCard</code>.
          Props: <code className="font-mono bg-vintiga-slate-100 px-1 rounded">orientation</code>,{' '}
          <code className="font-mono bg-vintiga-slate-100 px-1 rounded">align</code>,{' '}
          <code className="font-mono bg-vintiga-slate-100 px-1 rounded">size</code>,{' '}
          <code className="font-mono bg-vintiga-slate-100 px-1 rounded">tone</code>,{' '}
          <code className="font-mono bg-vintiga-slate-100 px-1 rounded">selected</code>,{' '}
          <code className="font-mono bg-vintiga-slate-100 px-1 rounded">disabled</code>,{' '}
          <code className="font-mono bg-vintiga-slate-100 px-1 rounded">icon</code>,{' '}
          <code className="font-mono bg-vintiga-slate-100 px-1 rounded">title</code>,{' '}
          <code className="font-mono bg-vintiga-slate-100 px-1 rounded">description</code>,{' '}
          <code className="font-mono bg-vintiga-slate-100 px-1 rounded">trailing</code>,{' '}
          <code className="font-mono bg-vintiga-slate-100 px-1 rounded">onClick</code>.
        </p>
      </div>
    </SubSection>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const COMPONENT_PAGES: Record<string, React.ComponentType> = {
  'ds-buttons':        ButtonsSection,
  'ds-icon-buttons':   IconButtonsSection,
  'ds-text-fields':    TextFieldsSectionV2,
  'ds-checkbox':       CheckboxSection,
  'ds-radio':          RadioGroupSection,
  'ds-switch':         SwitchSection,
  'ds-alert-soft':     AlertSoftSection,
  'ds-progress':       ProgressSection,
  'ds-empty-states':   EmptyStatesSection,
  'ds-skeletons':      SkeletonLoadingSection,
  'ds-error-states':   ErrorStatesSection,
  'ds-dialog':         DialogSection,
  'ds-tooltip':        TooltipSection,
  'ds-bottom-sheet':   BottomSheetSection,
  'ds-tabs':           TabsSection,
  'ds-separator':      SeparatorSection,
  'ds-cards':          CardSection,
  'ds-pill':           PillSection,
  'ds-otp-input':      OtpInputSection,
  'ds-screen-header':  ScreenHeaderSection,
  'ds-screen-footer':  ScreenFooterSection,
  'ds-avatars':        AvatarsSection,
  'ds-tags':           TagsSection,
  'ds-kpi-card':       KpiCardsSection,
  'ds-table':          TablesSection,
  'ds-toast':          ToastsSection,
  'ds-dropdown':       DropdownsSection,
  'ds-segmented-control': SegmentedControlSection,
  'ds-navbar':         NavbarSection,
  'ds-sidebar':        SidebarSection,
  'ds-widget':         WidgetSection,
  'ds-list-card':      ListCardSection,
  'ds-selection-card': SelectionCardSection,
}

export function ComponentsSection() {
  return (
    <section className="space-y-12">
      <SectionHeader id="components" title="Components" description="Base UI components branded with Vintiga design tokens." />
      {Object.values(COMPONENT_PAGES).map((Page, i) => <Page key={i} />)}
    </section>
  )
}
